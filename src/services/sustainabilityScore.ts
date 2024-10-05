interface ScoreCriteria {
    airQuality: number;      // Value between 0-100
    walkability: number;     // Value between 0-100
    greenSpaces: number;     // Value between 0-100
    publicTransport: number; // Value between 0-100
}

export const calculateSustainabilityScore = (criteria: ScoreCriteria): number => {
    const { airQuality, walkability, greenSpaces, publicTransport } = criteria;

    // Example formula, adjust weights as needed
    const totalScore = (airQuality * 0.4) + (walkability * 0.3) + (greenSpaces * 0.2) + (publicTransport * 0.1);

    // Return score, round to 2 decimal places
    return Math.round(totalScore * 100) / 100;
};
