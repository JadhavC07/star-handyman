import client from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/endpoints";
import type {
  AuthResponse,
  ServicemanLoginPayload,
  ServicemanRegisterPayload,
  ServicemanSendLoginOtpPayload,
  ServicemanSendOtpPayload,
  ServicemanUpdateProfilePayload,
} from "./auth.types";

const TAG = "[HandymanAuthService]";

const devLog = (...args: unknown[]) => {
  if (__DEV__) console.log(TAG, ...args);
};

const devWarn = (...args: unknown[]) => {
  if (__DEV__) console.warn(TAG, ...args);
};

export const HandymanAuthService = {
  sendOtp: (payload: ServicemanSendOtpPayload) => {
    devLog("sendOtp →", API_ENDPOINTS.HANDYMAN_AUTH.SEND_OTP, payload);
    return client
      .post(API_ENDPOINTS.HANDYMAN_AUTH.SEND_OTP, payload)
      .then((r) => {
        devLog("sendOtp ✓", r.data);
        // Backend returns `debug_otp` in non-production environments so the
        // client can auto-fill without hitting an email service. Surface it
        // prominently so testers can find it at a glance.
        const debugOtp = (r.data as any)?.debug_otp;
        if (__DEV__ && debugOtp) {
          console.log(
            `${TAG} 🔑 DEBUG OTP for ${payload.phone}: ${debugOtp}`,
          );
        }
        return r.data;
      })
      .catch((err) => {
        devWarn(
          "sendOtp ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },

  sendLoginOtp: (payload: ServicemanSendLoginOtpPayload) => {
    devLog("sendLoginOtp →", API_ENDPOINTS.HANDYMAN_AUTH.SEND_LOGIN_OTP, payload);
    return client
      .post(API_ENDPOINTS.HANDYMAN_AUTH.SEND_LOGIN_OTP, payload)
      .then((r) => {
        devLog("sendLoginOtp ✓", r.data);
        const debugOtp = (r.data as any)?.debug_otp;
        if (__DEV__ && debugOtp) {
          console.log(
            `${TAG} 🔑 DEBUG OTP for ${payload.phone}: ${debugOtp}`,
          );
        }
        return r.data;
      })
      .catch((err) => {
        devWarn(
          "sendLoginOtp ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },

  login: (payload: ServicemanLoginPayload) => {
    devLog("login →", API_ENDPOINTS.HANDYMAN_AUTH.LOGIN, {
      phone: payload.phone,
    });
    return client
      .post<AuthResponse>(API_ENDPOINTS.HANDYMAN_AUTH.LOGIN, payload)
      .then((r) => {
        devLog("login ✓", { userId: r.data?.user?.id });
        return r.data;
      })
      .catch((err) => {
        devWarn(
          "login ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },

  register: (payload: ServicemanRegisterPayload) => {
    const url = API_ENDPOINTS.HANDYMAN_AUTH.REGISTER;
    const { categories, levels, license_photos, ...rest } = payload;

    const form = new FormData();
    Object.entries(rest).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      form.append(k, String(v));
    });

    if (categories?.length) {
      categories.forEach((id) => form.append("categories[]", String(id)));
    }
    if (levels) {
      Object.entries(levels).forEach(([catId, lvl]) => {
        form.append(`levels[${catId}]`, String(lvl));
      });
    }
    if (license_photos) {
      Object.entries(license_photos).forEach(([catId, file]) => {
        const rawUri = file.uri;
        const uri = rawUri.startsWith("file://") ? rawUri : `file://${rawUri}`;
        const ext = (uri.split(".").pop() || "jpg").toLowerCase();
        const mime =
          ext === "png" ? "image/png"
          : ext === "webp" ? "image/webp"
          : ext === "heic" ? "image/heic"
          : "image/jpeg";
        form.append(`license_photos[${catId}]`, {
          uri,
          name: file.name || `license_${catId}.${ext}`,
          type: file.type || mime,
        } as any);
      });
    }

    devLog("register → POST multipart", url, { rest, categories, levels });

    return client
      .post<AuthResponse>(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
      })
      .then((r) => {
        devLog("register ✓", { userId: r.data?.user?.id });
        return r.data;
      })
      .catch((err) => {
        devWarn(
          "register ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },

  updateProfile: (payload: ServicemanUpdateProfilePayload) => {
    const url = API_ENDPOINTS.HANDYMAN_PROFILE.PUT;
    const form = new FormData();
    const debugParts: Record<string, unknown> = {};

    // Laravel can't parse `multipart/form-data` on PUT requests, and
    // React Native's XHR on Android drops the body for non-POST multipart
    // uploads. Use Laravel's method-spoofing: POST with `_method=PUT`.
    form.append("_method", "PUT");
    debugParts["_method"] = "PUT";

    const inferMime = (ext: string) =>
      ext === "png" ? "image/png"
      : ext === "webp" ? "image/webp"
      : ext === "heic" ? "image/heic"
      : "image/jpeg";

    Object.entries(payload).forEach(([key, val]) => {
      if (val === undefined || val === null) return;

      if (key === "avatar" && typeof val === "object") {
        const rawUri = (val as any).uri as string;
        const uri = rawUri.startsWith("file://") ? rawUri : `file://${rawUri}`;
        const ext = (uri.split(".").pop() || "jpg").toLowerCase();
        const file = {
          uri,
          name: (val as any).name || `avatar.${ext}`,
          type: (val as any).type || inferMime(ext),
        };
        form.append("avatar", file as any);
        debugParts["avatar"] = file;
        return;
      }

      if (key === "categories" && Array.isArray(val)) {
        val.forEach((id) => form.append("categories[]", String(id)));
        debugParts["categories[]"] = val;
        return;
      }

      if (key === "levels" && val && typeof val === "object") {
        Object.entries(val as Record<string, number>).forEach(([catId, lvl]) => {
          form.append(`levels[${catId}]`, String(lvl));
        });
        debugParts["levels"] = val;
        return;
      }

      if (key === "license_photos" && val && typeof val === "object") {
        Object.entries(
          val as Record<string, { uri: string; name?: string; type?: string }>,
        ).forEach(([catId, file]) => {
          const rawUri = file.uri;
          const uri = rawUri.startsWith("file://") ? rawUri : `file://${rawUri}`;
          const ext = (uri.split(".").pop() || "jpg").toLowerCase();
          form.append(`license_photos[${catId}]`, {
            uri,
            name: file.name || `license_${catId}.${ext}`,
            type: file.type || inferMime(ext),
          } as any);
        });
        debugParts["license_photos"] = Object.keys(val);
        return;
      }

      form.append(key, String(val));
      debugParts[key] = val;
    });

    devLog("updateProfile → POST (spoofed PUT)", url);
    devLog("updateProfile payload (raw):", payload);
    devLog("updateProfile FormData parts:", debugParts);

    return client
      .post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data, // don't let axios JSON-stringify
      })
      .then((r) => {
        devLog("updateProfile ✓", r.status, r.data);
        return r.data;
      })
      .catch((err) => {
        devWarn(
          "updateProfile ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },

  logout: () => {
    devLog("logout →", API_ENDPOINTS.HANDYMAN_AUTH.LOGOUT);
    return client.post(API_ENDPOINTS.HANDYMAN_AUTH.LOGOUT);
  },
};
