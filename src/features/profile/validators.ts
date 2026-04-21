// Tiny per-field validators for serviceman profile sections.
// Return string = error message, null = valid.

export const isEmptyStr = (v: string | undefined | null) =>
  !v || !String(v).trim();

// Backend (`formatUser`) masks sensitive fields before sending them to the
// client: SIN becomes `***-***-XYZ` and bank account becomes `****1234`.
// These helpers detect such masked values so edit screens don't rebind them
// into inputs and accidentally write the mask back on save.
export const isMaskedSIN = (v: string | undefined | null): boolean => {
  if (!v) return false;
  // Matches patterns like `***-***-123` or anything containing asterisks.
  return /\*/.test(v);
};

export const isMaskedAccount = (v: string | undefined | null): boolean => {
  if (!v) return false;
  return /\*/.test(v);
};

export const validateName = (v: string): string | null => {
  const t = v.trim();
  if (!t) return "Name is required";
  if (t.length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateEmail = (v: string): string | null => {
  const t = v.trim();
  if (!t) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "Enter a valid email";
  return null;
};

export const validateSIN = (v: string): string | null => {
  if (isEmptyStr(v)) return null; // optional
  const digits = v.replace(/\D/g, "");
  if (digits.length !== 9) return "SIN must be exactly 9 digits";
  return null;
};

export const validateDateYMD = (v: string): string | null => {
  if (isEmptyStr(v)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.trim())) return "Use format YYYY-MM-DD";
  const [y, m, d] = v.trim().split("-").map(Number);
  if (m < 1 || m > 12) return "Invalid month";
  if (d < 1 || d > 31) return "Invalid day";
  const parsed = new Date(`${v}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";
  return null;
};

export const validateFutureDate = (v: string): string | null => {
  const base = validateDateYMD(v);
  if (base) return base;
  if (isEmptyStr(v)) return null;
  const parsed = new Date(`${v}T00:00:00`);
  if (parsed.getTime() < Date.now() - 86400000)
    return "Expiry must be in the future";
  return null;
};

export const validateInsuranceGroup = (fields: {
  company: string;
  policy: string;
  expiry: string;
}): Record<string, string | null> => {
  const anyFilled =
    !isEmptyStr(fields.company) ||
    !isEmptyStr(fields.policy) ||
    !isEmptyStr(fields.expiry);
  if (!anyFilled) return { company: null, policy: null, expiry: null };
  return {
    company: isEmptyStr(fields.company)
      ? "Required when providing insurance details"
      : null,
    policy: isEmptyStr(fields.policy)
      ? "Required when providing insurance details"
      : null,
    expiry: isEmptyStr(fields.expiry)
      ? "Required when providing insurance details"
      : validateFutureDate(fields.expiry),
  };
};

export const validateBankGroup = (
  fields: {
    name: string;
    holder: string;
    account: string;
    routing: string;
    branch: string;
    type: string | undefined;
  },
  opts: { accountOnFile?: boolean } = {},
): Record<string, string | null> => {
  const anyFilled =
    !isEmptyStr(fields.name) ||
    !isEmptyStr(fields.holder) ||
    !isEmptyStr(fields.account) ||
    !isEmptyStr(fields.routing) ||
    !isEmptyStr(fields.branch) ||
    !!fields.type;

  if (!anyFilled) {
    return {
      name: null,
      holder: null,
      account: null,
      routing: null,
      branch: null,
      type: null,
    };
  }

  const req = (v: string) =>
    isEmptyStr(v) ? "Required for bank details" : null;

  // Account number: digits only, 4–20 chars. If a value is already on file
  // (backend masks it in the response), a blank input means "keep existing".
  let accountErr: string | null = null;
  if (isEmptyStr(fields.account)) {
    accountErr = opts.accountOnFile ? null : "Required for bank details";
  } else if (!/^\d{4,20}$/.test(fields.account.trim())) {
    accountErr = "Account number must be 4–20 digits";
  }
  // Routing: digits only, 5–12
  let routingErr: string | null = req(fields.routing);
  if (!routingErr && !/^\d{5,12}$/.test(fields.routing.trim())) {
    routingErr = "Routing must be 5–12 digits";
  }

  return {
    name: req(fields.name),
    holder: req(fields.holder),
    account: accountErr,
    routing: routingErr,
    branch: null, // optional even within the group
    type: !fields.type ? "Select an account type" : null,
  };
};

export const validateRadius = (v: string): string | null => {
  if (isEmptyStr(v)) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return "Enter a number";
  if (n < 1 || n > 500) return "Must be between 1 and 500";
  return null;
};

export const validateInt = (v: string, min = 0, max = 50): string | null => {
  if (isEmptyStr(v)) return null;
  const n = Number(v);
  if (!Number.isInteger(n)) return "Enter a whole number";
  if (n < min || n > max) return `Must be between ${min} and ${max}`;
  return null;
};

export const validateNotes = (v: string, max = 1000): string | null => {
  if (isEmptyStr(v)) return null;
  if (v.trim().length > max) return `Notes must be ${max} characters or fewer`;
  return null;
};

export const validateSkills = (skills: string[], max = 100): string | null => {
  const overLong = skills.find((s) => s.length > max);
  if (overLong) return `Each skill must be ${max} characters or fewer`;
  return null;
};

export const validateLat = (v: string): string | null => {
  if (isEmptyStr(v)) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return "Enter a number";
  if (n < -90 || n > 90) return "Latitude must be between -90 and 90";
  return null;
};

export const validateLng = (v: string): string | null => {
  if (isEmptyStr(v)) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return "Enter a number";
  if (n < -180 || n > 180) return "Longitude must be between -180 and 180";
  return null;
};

export const hasErrors = (errs: Record<string, string | null>) =>
  Object.values(errs).some(Boolean);
