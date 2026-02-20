export const parseApiDate = (value) => {
  if (!value) return null;

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    const fromNumeric = new Date(numericValue);
    if (!Number.isNaN(fromNumeric.getTime())) {
      return fromNumeric;
    }
  }

  const fromString = new Date(value);
  if (!Number.isNaN(fromString.getTime())) {
    return fromString;
  }

  return null;
};
