import { SymbolMap, UserDefinedAlphabet } from "../types";

export const INFORMATION_CONTENT = "INFORMATION_CONTENT";
export const FREQUENCY = "FREQUENCY";

export const maxLabelLength = (startpos: number, length: number) => {
  let max = ("" + startpos).length;
  for (let i = startpos + 1; i < startpos + length; ++i)
    if (("" + i).length > max) max = ("" + i).length;
  return max;
};

/**
 * @deprecated
 */
export const logLikelihood =
  (backgroundFrequencies: number[]) =>
  (r: number[], e: number = 0.0) => {
    if (backgroundFrequencies.length !== r.length)
      throw new Error(
        "Background frequencies and input vector must be the same length"
      );
    let sum = 0.0;
    r.forEach((x, i) => {
      if (x !== 0) {
        const frequency = backgroundFrequencies[i] || 0.01;
        sum += x * Math.log2(x / frequency);
      }
    });
    return r.map((x) => Math.max(0.0, x * (sum - e)));
  };

/**
 * Calculate log likelihood scores for a probability vector relative to background frequencies.
 *
 * The observed count total can be provided to apply an entropy adjustment influenced by the size of the alphabet.
 *
 * @param backgroundFrequencies An array of background frequencies.
 * @param alphabetLength The number of characters in the alphabet used.
 * @param observedProbabilities An array of observed probabilities.
 * @param observedTotal The total count of observed symbols.
 * @returns A function that accepts an array of observed counts, and returns an array of log likelihood scores.
 */
export const calculateLogLikelihood =
  (backgroundFrequencies: number[], alphabetLength: number) =>
  (
    observedProbabilities: number[],
    observedTotal: number | null = null
  ): number[] => {
    // Validate that the length of background frequencies and observed counts match.
    if (backgroundFrequencies.length !== observedProbabilities.length) {
      throw new Error(
        "Background frequencies and observed counts must be the same length"
      );
    }

    // If an observed total counts is provided, use it for entropy adjustment.
    const entropyAdjustment = observedTotal
      ? (alphabetLength - 1) / (2 * Math.log(2) * observedTotal)
      : 0;

    let logLikelihoodSum = 0.0;
    // Calculate the sum of log likelihoods across all non-zero observed counts.
    observedProbabilities.forEach((count, index) => {
      if (count !== 0) {
        const frequency = backgroundFrequencies[index] || 0.01; // Default frequency fallback to 0.01
        logLikelihoodSum += count * Math.log2(count / frequency);
      }
    });

    // Adjust and normalize log likelihood scores using the entropy adjustment.
    return observedProbabilities.map((count) =>
      Math.max(0.0, count * (logLikelihoodSum - entropyAdjustment))
    );
  };

/**
 * For an array of numbers, returns the indices sorted in ascending order.
 *
 * @param x Array of numeric values
 * @returns Array of indices sorted in ascending order
 */
export const sortedIndices = (x: number[]): number[] => {
  let indices = x.map((_, i) => i);
  return indices.sort((a, b) => (x[a] < x[b] ? -1 : x[a] === x[b] ? 0 : 1));
};

/**
 * For an array of numbers, returns the indices sorted in order of ascending magnitude (absolute value).
 *
 * @param x Array of numeric values
 * @returns Array of indices sorted in ascending order
 */
export const sortedIndicesByMagnitude = (x: number[]): number[] => {
  let indices = x.map((_, i) => i);
  return indices.sort((a, b) =>
    Math.abs(x[a]) < Math.abs(x[b])
      ? -1
      : Math.abs(x[a]) === Math.abs(x[b])
        ? 0
        : 1
  );
};

export const sortedIndicesNegative = (x: number[]) => {
  let indices = x.map((_, i) => i);
  return indices.sort((a, b) => (x[a] < x[b] ? 1 : x[a] === x[b] ? 0 : -1));
};

export const xrange = (n: number) => [...Array(Math.floor(n)).keys()];

export const onehot = (l: number) => (x: number) =>
  xrange(l).map((_, i) => (i === x ? 1 : 0));

export const possum = (x: number[]) => {
  let s = 0.0;
  x.filter((x) => x > 0.0).forEach((x) => {
    s += x;
  });
  return s;
};

export const negsum = (x: number[]) => {
  let s = 0.0;
  x.filter((x) => x < 0.0).forEach((x) => {
    s += x;
  });
  return s;
};

const validHex = (color: string) => {
  /* validate color is a hex color */
  color = String(color).replace(/[^0-9a-f]/gi, "");
  if (color.length === 3)
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  if (color.length === 8) color = color.substring(0, 6);
  if (color.length !== 6) throw new Error(color + " is not a valid hex color");

  /* return the first 6 hex digits */
  return color;
};

/**
 * Validates a hex color and parses it to an integer.
 *
 * @param color the color as a hex string (e.g. #fff or ABCDEF)
 */
export const parseHex = (color: string) => parseInt(validHex(color), 16);

export const constructSymbolToAlphabetMap = (
  alphabet: UserDefinedAlphabet
): SymbolMap =>
  alphabet.reduce((map, symbol) => {
    map[symbol.regex] = symbol;
    return map;
  }, {} as SymbolMap);

export const constructSymbolToAlphabetIndexMap = (
  alphabet: UserDefinedAlphabet
): { [key: string]: number } =>
  alphabet.reduce(
    (map, symbol, index) => {
      map[symbol.regex] = index;
      return map;
    },
    {} as { [key: string]: number }
  );
