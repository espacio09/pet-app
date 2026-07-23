// shared/formatters/enum-formatter.ts

export const enumFormatter = <T extends string>(
  value: T | null | undefined,
  translations: Record<T, string>,
): string => {
  if (!value) {
    return '';
  }

  return translations[value] ?? value;
};
