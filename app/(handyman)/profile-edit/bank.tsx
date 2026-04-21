import type { BankAccountType } from "@/src/features/auth/auth.types";
import { ChipSelector } from "@/src/features/profile/ChipSelector";
import { EditSectionScaffold } from "@/src/features/profile/EditSectionScaffold";
import { FormField } from "@/src/features/profile/FormField";
import {
  hasErrors,
  isMaskedAccount,
  validateBankGroup,
} from "@/src/features/profile/validators";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text } from "react-native";

type ErrorMap = {
  name?: string | null;
  holder?: string | null;
  account?: string | null;
  routing?: string | null;
  branch?: string | null;
  type?: string | null;
};

export default function BankEditScreen() {
  const { t } = useTranslation("handyman");
  const { data } = useHandymanProfile();
  const { mutate: updateProfile, isPending } = useHandymanUpdateProfile();
  const profile = data?.user?.profile;

  const [bankName, setBankName] = useState("");
  const [holder, setHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routing, setRouting] = useState("");
  const [branch, setBranch] = useState("");
  const [accountType, setAccountType] = useState<BankAccountType | undefined>();
  const [accountOnFile, setAccountOnFile] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});

  useEffect(() => {
    if (profile) {
      setBankName(profile.bank_name ?? "");
      setHolder(profile.bank_account_holder_name ?? "");
      // Backend masks bank_account_number (e.g. `****1234`). Don't rebind the
      // mask into the input — leave it blank so saving without retyping keeps
      // the existing value on the server.
      const rawAccount = profile.bank_account_number ?? "";
      if (isMaskedAccount(rawAccount)) {
        setAccountNumber("");
        setAccountOnFile(true);
      } else {
        setAccountNumber(rawAccount);
        setAccountOnFile(!!rawAccount);
      }
      setRouting(profile.bank_routing_number ?? "");
      setBranch(profile.bank_branch ?? "");
      setAccountType(
        (profile.bank_account_type as BankAccountType) ?? undefined,
      );
    }
  }, [profile]);

  const clearErr = (k: keyof ErrorMap) =>
    setErrors((e) => (e[k] ? { ...e, [k]: null } : e));

  const handleSave = () => {
    const next = validateBankGroup(
      {
        name: bankName,
        holder,
        account: accountNumber,
        routing,
        branch,
        type: accountType,
      },
      { accountOnFile },
    );
    setErrors(next);

    if (hasErrors(next)) {
      haptic.warning();
      if (next.type) {
        Alert.alert(
          "Select account type",
          "Please pick savings, chequing, or current.",
        );
      } else {
        Alert.alert(
          "Complete bank details",
          "When adding bank details, all required fields must be filled.",
        );
      }
      return;
    }

    updateProfile(
      {
        bank_name: bankName.trim() || undefined,
        bank_account_holder_name: holder.trim() || undefined,
        // Only send account_number if user retyped it — blank means
        // "keep existing" when a value is already on file on the server.
        bank_account_number: accountNumber.trim() || undefined,
        bank_routing_number: routing.trim() || undefined,
        bank_branch: branch.trim() || undefined,
        bank_account_type: accountType,
      },
      {
        onSuccess: () => {
          haptic.success();
          router.back();
        },
        onError: (err: any) =>
          Alert.alert("Update failed", err?.message ?? "Try again"),
      },
    );
  };

  const accountTypeOptions: { value: BankAccountType; label: string }[] = [
    { value: "savings", label: t("profile.account_type.savings") },
    { value: "chequing", label: t("profile.account_type.chequing") },
    { value: "current", label: t("profile.account_type.current") },
  ];

  return (
    <EditSectionScaffold
      title={t("profile.sections.bank.title")}
      subtitle={t("profile.sections.bank.subtitle")}
      saving={isPending}
      onSave={handleSave}
      saveLabel={t("profile.save")}
      cancelLabel={t("profile.cancel")}
    >
      <Text style={styles.note}>
        Adding bank details is optional, but once you start all required
        fields must be completed so payouts can be processed.
      </Text>

      <FormField
        label={t("profile.fields.bank_name")}
        value={bankName}
        onChangeText={(v) => {
          setBankName(v);
          clearErr("name");
        }}
        placeholder="Bank name"
        autoCapitalize="words"
        maxLength={255}
        error={errors.name}
      />

      <FormField
        label={t("profile.fields.bank_account_holder_name")}
        value={holder}
        onChangeText={(v) => {
          setHolder(v);
          clearErr("holder");
        }}
        placeholder="Name on account"
        autoCapitalize="words"
        maxLength={255}
        error={errors.holder}
      />

      <FormField
        label={t("profile.fields.bank_account_number")}
        hint={accountOnFile ? t("profile.fields.account_on_file") : undefined}
        value={accountNumber}
        onChangeText={(v) => {
          setAccountNumber(v);
          clearErr("account");
        }}
        placeholder={accountOnFile ? "Re-enter to update" : "Account number"}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={50}
        error={errors.account}
      />

      <FormField
        label={t("profile.fields.bank_routing_number")}
        value={routing}
        onChangeText={(v) => {
          setRouting(v);
          clearErr("routing");
        }}
        placeholder="Routing / transit number"
        keyboardType="number-pad"
        maxLength={50}
        error={errors.routing}
      />

      <FormField
        label={t("profile.fields.bank_branch")}
        value={branch}
        onChangeText={setBranch}
        placeholder="Branch name or address"
        autoCapitalize="words"
        maxLength={255}
      />

      <ChipSelector
        label={t("profile.fields.bank_account_type")}
        options={accountTypeOptions}
        value={accountType}
        onChange={(v) => {
          setAccountType(v);
          clearErr("type");
        }}
      />
      {errors.type ? (
        <Text style={styles.errorText}>{errors.type}</Text>
      ) : null}
    </EditSectionScaffold>
  );
}

const styles = StyleSheet.create({
  note: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error ?? "#EF4444",
    marginTop: -8,
    marginBottom: theme.spacing.lg,
    fontWeight: "500",
  },
});
