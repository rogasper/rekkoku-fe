export function capitalizeWords(sentence: string) {
  // Split the sentence into an array of words based on spaces
  const words = sentence.split(" ");

  // Map over the array of words to capitalize the first letter of each
  const capitalizedWords = words.map((word) => {
    // Handle empty strings or words that might be just spaces
    if (word.length === 0) {
      return "";
    }
    // Capitalize the first letter and concatenate with the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the capitalized words back into a single string
  return capitalizedWords.join(" ");
}

export const isValidGmapsLink = (url: string): boolean => {
  const gmapsPattern =
    /(https?:\/\/(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl|g\.co)\/[^\s]+)/;
  return gmapsPattern.test(url);
};

// handle thousands, millions, billions, etc.
export const formatNumber = (number: number) => {
  const units = ["", "K", "M", "B", "T", "Q"];
  const unitSize = 1000;

  // Find the appropriate unit
  let unitIndex = 0;
  let value = number;
  while (value >= unitSize && unitIndex < units.length - 1) {
    value /= unitSize;
    unitIndex++;
  }

  // Format with one decimal place if needed, otherwise as integer
  const formatted = unitIndex === 0 ? value.toString() : value.toFixed(1);
  return formatted + units[unitIndex];
};

export const formatCurrencyIDR = (value?: number) => {
  if (value === null || value === undefined || Number.isNaN(value))
    return undefined;
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
};
