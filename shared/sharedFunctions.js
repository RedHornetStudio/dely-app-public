export const roundWithZeros = (value, decimal = 0) => {
  const number = Number(Math.round(value + 'e' + decimal) + 'e-' + decimal);
  const splited = number.toString().split('.');
  const wholeNumber = splited[0];
  let decimalNumber = '';
  if (splited[1]) {
    decimalNumber = splited[1];
    for (let i = 0; i < decimal - splited[1].length; i++) {
      decimalNumber = decimalNumber + '0';
    }
  } else {
    for (let i = 0; i < decimal; i++) {
      decimalNumber = decimalNumber + '0';
    }
  }
  return decimal === 0 ? wholeNumber : wholeNumber + '.' + decimalNumber;
};