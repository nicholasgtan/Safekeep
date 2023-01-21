const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
  };

  const toDate = new Date(date);
  const formatted = toDate?.toLocaleString("en-GB", options);
  return formatted;
};

export default formatDate;
