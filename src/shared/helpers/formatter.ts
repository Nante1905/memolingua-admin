export const formatDate = (date: Date) => {
  return date.toLocaleString("fr-Fr", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: Date) => {
  return date.toLocaleString("fr-Fr", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};