import { EditSectionScaffold } from "@/src/features/profile/EditSectionScaffold";
import { FormField } from "@/src/features/profile/FormField";
import { isEmptyStr } from "@/src/features/profile/validators";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export default function LicensesEditScreen() {
  const { t } = useTranslation("handyman");
  const { data } = useHandymanProfile();
  const { mutate: updateProfile, isPending } = useHandymanUpdateProfile();
  const profile = data?.user?.profile;

  const [plumbing, setPlumbing] = useState("");
  const [electrical, setElectrical] = useState("");
  const [hvac, setHvac] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setPlumbing(profile.plumbing_license ?? "");
      setElectrical(profile.electrical_license ?? "");
      setHvac(profile.hvac_license ?? "");
    }
  }, [profile]);

  const validateLicense = (v: string): string | null => {
    if (isEmptyStr(v)) return null;
    if (v.trim().length < 3) return "License number looks too short";
    return null;
  };

  const handleSave = () => {
    const pErr = validateLicense(plumbing);
    const eErr = validateLicense(electrical);
    const hErr = validateLicense(hvac);

    if (pErr || eErr || hErr) {
      setError(pErr ?? eErr ?? hErr ?? null);
      haptic.warning();
      Alert.alert("Fix errors", pErr ?? eErr ?? hErr ?? "Check license fields");
      return;
    }
    setError(null);

    updateProfile(
      {
        plumbing_license: plumbing.trim() || undefined,
        electrical_license: electrical.trim() || undefined,
        hvac_license: hvac.trim() || undefined,
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
      title={t("profile.sections.licenses.title")}
      subtitle={t("profile.sections.licenses.subtitle")}
      saving={isPending}
      onSave={handleSave}
      saveLabel={t("profile.save")}
      cancelLabel={t("profile.cancel")}
    >
      <FormField
        label={t("profile.fields.plumbing_license")}
        value={plumbing}
        onChangeText={(v) => {
          setPlumbing(v);
          if (error) setError(null);
        }}
        placeholder="License number"
        autoCapitalize="characters"
        maxLength={100}
        error={error && plumbing ? validateLicense(plumbing) : null}
      />

      <FormField
        label={t("profile.fields.electrical_license")}
        value={electrical}
        onChangeText={(v) => {
          setElectrical(v);
          if (error) setError(null);
        }}
        placeholder="License number"
        autoCapitalize="characters"
        maxLength={100}
        error={error && electrical ? validateLicense(electrical) : null}
      />

      <FormField
        label={t("profile.fields.hvac_license")}
        value={hvac}
        onChangeText={(v) => {
          setHvac(v);
          if (error) setError(null);
        }}
        placeholder="License number"
        autoCapitalize="characters"
        maxLength={100}
        error={error && hvac ? validateLicense(hvac) : null}
      />
    </EditSectionScaffold>
  );
}
