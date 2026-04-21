import { EditSectionScaffold } from "@/src/features/profile/EditSectionScaffold";
import { FormField } from "@/src/features/profile/FormField";
import {
  hasErrors,
  isMaskedSIN,
  validateInsuranceGroup,
  validateSIN,
} from "@/src/features/profile/validators";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

type ErrorMap = {
  sin?: string | null;
  company?: string | null;
  policy?: string | null;
  expiry?: string | null;
};

export default function LegalEditScreen() {
  const { t } = useTranslation("handyman");
  const { data } = useHandymanProfile();
  const { mutate: updateProfile, isPending } = useHandymanUpdateProfile();
  const profile = data?.user?.profile;

  const [sin, setSin] = useState("");
  const [hst, setHst] = useState("");
  const [company, setCompany] = useState("");
  const [policy, setPolicy] = useState("");
  const [expiry, setExpiry] = useState("");
  const [sinOnFile, setSinOnFile] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});

  useEffect(() => {
    if (profile) {
      // Backend masks SIN (e.g. `***-***-123`). Don't rebind the mask into the
      // input — leave it blank and show a hint that one is already on file.
      const rawSin = profile.sin_number ?? "";
      if (isMaskedSIN(rawSin)) {
        setSin("");
        setSinOnFile(true);
      } else {
        setSin(rawSin);
        setSinOnFile(!!rawSin);
      }
      setHst(profile.hst_number ?? "");
      setCompany(profile.insurance_company ?? "");
      setPolicy(profile.insurance_policy_number ?? "");
      setExpiry(profile.insurance_expiry_date ?? "");
    }
  }, [profile]);

  const clearErr = (k: keyof ErrorMap) =>
    setErrors((e) => (e[k] ? { ...e, [k]: null } : e));

  const handleSave = () => {
    const insuranceErrs = validateInsuranceGroup({
      company,
      policy,
      expiry,
    });
    const next: ErrorMap = {
      sin: validateSIN(sin),
      company: insuranceErrs.company,
      policy: insuranceErrs.policy,
      expiry: insuranceErrs.expiry,
    };
    setErrors(next);
    if (hasErrors(next)) {
      haptic.warning();
      Alert.alert("Fix errors", "Please correct the highlighted fields.");
      return;
    }

    updateProfile(
      {
        // Only send SIN if user retyped it — otherwise keep existing value.
        sin_number: sin.trim() || undefined,
        hst_number: hst.trim() || undefined,
        insurance_company: company.trim() || undefined,
        insurance_policy_number: policy.trim() || undefined,
        insurance_expiry_date: expiry.trim() || undefined,
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

  return (
    <EditSectionScaffold
      title={t("profile.sections.legal.title")}
      subtitle={t("profile.sections.legal.subtitle")}
      saving={isPending}
      onSave={handleSave}
      saveLabel={t("profile.save")}
      cancelLabel={t("profile.cancel")}
    >
      <FormField
        label={t("profile.fields.sin_number")}
        hint={
          sinOnFile
            ? t("profile.fields.sin_on_file")
            : t("profile.fields.sin_hint")
        }
        value={sin}
        onChangeText={(v) => {
          setSin(v);
          clearErr("sin");
        }}
        placeholder={sinOnFile ? "Re-enter to update" : "123456789"}
        keyboardType="number-pad"
        maxLength={11}
        error={errors.sin}
      />

      <FormField
        label={t("profile.fields.hst_number")}
        value={hst}
        onChangeText={setHst}
        placeholder="123456789RT0001"
        autoCapitalize="characters"
        maxLength={20}
      />

      <FormField
        label={t("profile.fields.insurance_company")}
        value={company}
        onChangeText={(v) => {
          setCompany(v);
          clearErr("company");
        }}
        placeholder="Insurance company name"
        autoCapitalize="words"
        maxLength={255}
        error={errors.company}
      />

      <FormField
        label={t("profile.fields.insurance_policy_number")}
        value={policy}
        onChangeText={(v) => {
          setPolicy(v);
          clearErr("policy");
        }}
        placeholder="Policy number"
        autoCapitalize="characters"
        maxLength={100}
        error={errors.policy}
      />

      <FormField
        label={t("profile.fields.insurance_expiry_date")}
        value={expiry}
        onChangeText={(v) => {
          setExpiry(v);
          clearErr("expiry");
        }}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        error={errors.expiry}
      />
    </EditSectionScaffold>
  );
}
