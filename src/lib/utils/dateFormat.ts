const dateFormat = (datetime: string | Date, locale: string = "en") => {
  const dateTime = new Date(datetime);
  const resolvedLocale = locale.startsWith("es") ? "es-ES" : "en-US";

  const date = dateTime.toLocaleDateString(resolvedLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return date;
};

export default dateFormat;
