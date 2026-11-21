export const NAME_MAX_LENGTH = 100;
export const COMPANY_MAX_LENGTH = 100;
export const NOTES_MAX_LENGTH = 1000;

export const NETWORKING_STATUSES = [
  "new",
  "follow-up",
  "connected",
  "archived",
];

export const NETWORKING_STATUS_LABELS = {
  new: "New Contact",
  "follow-up": "Follow-Up Needed",
  connected: "Connected",
  archived: "Archived",
};

export function isValidContactDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.toISOString().slice(0, 10) === value;
}

export function validateNetworkingFields(
  name,
  company,
  contactDate,
  status,
  notes
) {
  const errors = {};

  if (!name) {
    errors.name = "Please enter a name.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (!company) {
    errors.company = "Please enter a company.";
  } else if (company.length > COMPANY_MAX_LENGTH) {
    errors.company = `Company must be ${COMPANY_MAX_LENGTH} characters or fewer.`;
  }

  if (!contactDate) {
    errors.contactDate = "Please enter the contact date.";
  } else if (!isValidContactDate(contactDate)) {
    errors.contactDate =
      "Please enter a valid date in YYYY-MM-DD format, for example 2026-11-20.";
  }

  if (!status) {
    errors.status = "Please choose a status.";
  } else if (!NETWORKING_STATUSES.includes(status)) {
    errors.status = "Please choose a valid status.";
  }

  if (notes.length > NOTES_MAX_LENGTH) {
    errors.notes = `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function normalizeNetworkingValues(body) {
  return {
    name: String(body?.name ?? "").trim(),
    company: String(body?.company ?? "").trim(),
    contactDate: String(body?.contactDate ?? "").trim(),
    status: String(body?.status ?? "").trim(),
    notes: String(body?.notes ?? "").trim(),
  };
}
