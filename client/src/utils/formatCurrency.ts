const formatCurrency = (number: number) => {
  const toCurrency = new Number(number);
  const formatted = toCurrency.toLocaleString("en-US");
  return formatted;
};

export default formatCurrency;
