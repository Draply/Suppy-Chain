export const s2d = (str) => {
  const date = new Date(str);
  Intl.DateTimeFormat("defaults", {
    dateStyle: "medium",
  });
  return `${new Intl.DateTimeFormat("defaults", {
    dateStyle: "medium",
  }).format(date)}`;
};
