export function calculateAgeText(birthdate: Date | string): string {
  const birth = birthdate instanceof Date ? birthdate : new Date(birthdate);
  const today = new Date();

  if (Number.isNaN(birth.getTime())) {
    return "N/A";
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years ${months} months`;
}