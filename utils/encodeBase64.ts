/**
 * Encode a string to Base64
 * @param {string} input - The string to encode
 * @returns {string} - Base64 encoded string
 */
export function encodeBase64(input: string): string {
  return btoa(
    new TextEncoder()
      .encode(input)
      .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}
