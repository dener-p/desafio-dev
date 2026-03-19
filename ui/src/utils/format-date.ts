export const formatDate = (date: string | Date | null | undefined) => {
  const formatedDate = new Date(date ?? new Date());
  const day = formatedDate.getUTCDate().toString().padStart(2, "0");
  const month = formatedDate.getUTCMonth().toString().padStart(2, "0");
  const year = formatedDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
