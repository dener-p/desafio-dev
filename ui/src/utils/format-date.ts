export const formatDate = (date: string | Date | null | undefined) => {
  const formatedDate = new Date(date ?? new Date());
  const day = formatedDate.getDate().toString().padStart(2, "0");
  const month = formatedDate.getMonth().toString().padStart(2, "0");
  const year = formatedDate.getFullYear();

  return `${day}/${month}/${year}`;
};
