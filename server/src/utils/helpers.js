/**
 * Calculates the Jaccard similarity between two arrays (sets of skills).
 * @param {Array<string>} set1 - The skills of the first user.
 * @param {Array<string>} set2 - The skills of the second user.
 * @returns {number} - A similarity score between 0 and 1.
 */
const jaccardSimilarity = (set1, set2) => {
  const s1 = new Set(set1);
  const s2 = new Set(set2);

  const intersection = new Set([...s1].filter(skill => s2.has(skill)));
  const union = new Set([...s1, ...s2]);

  if (union.size === 0) {
    return 0; // Avoid division by zero if both users have no skills
  }

  return intersection.size / union.size;
};

module.exports = {
  jaccardSimilarity,
};