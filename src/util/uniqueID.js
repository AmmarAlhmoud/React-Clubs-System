export const generateUniqueIDFromInt = (number) => {
  // Combine timestamp for uniqueness and provided number
  const base = Date.now().toString(36) + number.toString(36);

  // Add random string for extra uniqueness
  const randomString = Math.random().toString(36).substring(2, 7);

  // Combine all parts and return the unique ID
  return `${base}${randomString}`;
};

export const generateUniqueIDFromStr = (str) => {
  // Hash the input string using a cryptographic hash function (more secure)
  const hash = crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));

  // Convert hash to a string representation (array buffer to hex)
  const hashArray = Array.from(new Uint8Array(hash));
  const hashString = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Combine timestamp and hashed string for uniqueness
  const base = Date.now().toString(36) + hashString.substring(0, 10);

  // Add random alphanumeric string for extra uniqueness
  const randomString = Math.random().toString(36).substring(2, 7);

  // Combine all parts and return the unique ID
  return `${base}${randomString}`;
};
