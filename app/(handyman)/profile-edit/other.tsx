import type { ServicemanAvailability } from "@/src/features/auth/auth.types";
import { ChipSelector } from "@/src/features/profile/ChipSelector";
import { EditSectionScaffold } from "@/src/features/profile/EditSectionScaffold";
import { FormField } from "@/src/features/profile/FormField";
import {
  hasErrors,
  validateInt,
  validateLat,
  validateLng,
  validateNotes,
  validateRadius,
  validateSkills,
} from "@/src/features/profile/validators";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

type ErrorMap = {
  availability?: string | null;
  radius?: string | null;
  experience?: string | null;
  lat?: string | null;
  lng?: string | null;
  skills?: string | null;
  notes?: string | null;
};

export default function OtherEditScreen() {
  const { t } = useTranslation("handyman");
  const { data } = useHandymanProfile();
  const { mutate: updateProfile, isPending } = useHandymanUpdateProfile();
  const profile = data?.user?.profile;

  const [skills, setSkills] = useState("");
  const [availability, setAvailability] =
    useState<ServicemanAvailability | undefined>();
  const [radius, setRadius] = useState("");
  const [experience, setExperience] = useState("");
  const [notes, setNotes] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [errors, setErrors] = useState<ErrorMap>({});

  const clearErr = (k: keyof ErrorMap) =>
    setErrors((e) => (e[k] ? { ...e, [k]: null } : e));

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills?.join(", ") ?? "");
      setAvailability(
        (profile.availability as ServicemanAvailability) ?? undefined,
      );
      setRadius(
        profile.service_radius_km ? String(profile.service_radius_km) : "",
      );
      setExperience(
        profile.experience_years != null ? String(profile.experience_years) : "",
      );
      setNotes(profile.notes ?? "");
      setLat(profile.lat != null ? String(profile.lat) : "");
      setLng(profile.lng != null ? String(profile.lng) : "");
    }
  }, [profile]);

  const handleSave = () => {
    const skillsArr = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const next: ErrorMap = {
      availability: !availability ? "Select an availability" : null,
      radius: validateRadius(radius),
      // Laravel caps experience_years at 50.
      experience: validateInt(experience, 0, 50),
      lat: validateLat(lat),
      lng: validateLng(lng),
      skills: validateSkills(skillsArr),
      notes: validateNotes(notes),
    };

    // lat and lng must either both be set or both empty
    if ((lat && !lng) || (!lat && lng)) {
      next.lat = next.lat || "Provide both latitude and longitude";
      next.lng = next.lng || "Provide both latitude and longitude";
    }

    // if skills typed but still no availability, require it
    setErrors(next);
    if (hasErrors(next)) {
      haptic.warning();
      Alert.alert("Fix errors", "Please correct the highlighted fields.");
      return;
    }

    const radiusNum = radius ? parseFloat(radius) : undefined;
    const expNum = experience ? parseInt(experience, 10) : undefined;
    const latNum = lat ? parseFloat(lat) : undefined;
    const lngNum = lng ? parseFloat(lng) : undefined;

    updateProfile(
      {
        skills: skillsArr,
        availability,
        service_radius_km: radiusNum,
        experience_years: expNum,
        notes: notes.trim() || undefined,
        lat: latNum,
        lng: lngNum,
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

  const availabilityOptions: {
    value: ServicemanAvailability;
    label: string;
  }[] = [
    { value: "full-time", label: t("profile.availability_options.full-time") },
    { value: "part-time", label: t("profile.availability_options.part-time") },
    { value: "on-call", label: t("profile.availability_options.on-call") },
  ];

  return (
    <EditSectionScaffold
      title={t("profile.sections.other.title")}
      subtitle={t("profile.sections.other.subtitle")}
      saving={isPending}
      onSave={handleSave}
      saveLabel={t("profile.save")}
      cancelLabel={t("profile.cancel")}
    >
      <FormField
        label={t("profile.fields.skills")}
        hint={t("profile.fields.skills_hint")}
        value={skills}
        onChangeText={(v) => {
          setSkills(v);
          clearErr("skills");
        }}
        placeholder="Plumbing, Installation"
        autoCapitalize="words"
        error={errors.skills}
      />

      <ChipSelector
        label={t("profile.fields.availability")}
        options={availabilityOptions}
        value={availability}
        onChange={(v) => {
          setAvailability(v);
          clearErr("availability");
        }}
      />

      <FormField
        label={t("profile.fields.service_radius_km")}
        value={radius}
        onChangeText={(v) => {
          setRadius(v);
          clearErr("radius");
        }}
        placeholder="10"
        keyboardType="numeric"
        error={errors.radius}
      />

      <FormField
        label={t("profile.fields.experience_years")}
        value={experience}
        onChangeText={(v) => {
          setExperience(v);
          clearErr("experience");
        }}
        placeholder="5"
        keyboardType="number-pad"
        error={errors.experience}
      />

      <FormField
        label="Latitude"
        value={lat}
        onChangeText={(v) => {
          setLat(v);
          clearErr("lat");
        }}
        placeholder="e.g. 43.65107"
        keyboardType="numbers-and-punctuation"
        error={errors.lat}
      />

      <FormField
        label="Longitude"
        value={lng}
        onChangeText={(v) => {
          setLng(v);
          clearErr("lng");
        }}
        placeholder="e.g. -79.347015"
        keyboardType="numbers-and-punctuation"
        error={errors.lng}
      />

      <FormField
        label={t("profile.fields.notes")}
        value={notes}
        onChangeText={(v) => {
          setNotes(v);
          clearErr("notes");
        }}
        placeholder="Anything customers should know…"
        multiline
        maxLength={1000}
        error={errors.notes}
      />
    </EditSectionScaffold>
  );
}
