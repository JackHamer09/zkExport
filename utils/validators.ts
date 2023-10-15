export const isValidAddress = (address: string) => {
  if (typeof address !== "string") {
    return false;
  }
  if (address.length !== 42) {
    return false;
  }
  if (address.substring(0, 2) !== "0x") {
    return false;
  }

  // Check if it contains only valid characters
  const addressBody = address.substring(2);
  const addressRegex = /^[0-9a-fA-F]+$/;

  return addressRegex.test(addressBody);
};
