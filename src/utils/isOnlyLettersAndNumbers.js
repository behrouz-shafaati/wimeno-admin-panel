export default function isOnlyLettersAndNumbers(str) {
  return /^[A-Za-z0-9\s]*$/.test(str);
}
