// shared/formatters/boolean-formatter.ts

export const booleanFormatter = (
  value: boolean | null | undefined,
): string => {
  if (value === null || value === undefined) {
    return '';
  }

  return value ? 'Ja' : 'Nein';
};