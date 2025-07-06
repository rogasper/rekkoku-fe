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
