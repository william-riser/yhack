# Carbon Foodprint

Carbon Foodprint is a web app that helps users measure and reduce the carbon footprint of their grocery shopping. By submitting grocery receipts, users receive insights into the environmental impact of their purchases, along with personalized recommendations for making more sustainable choices. Users can track their progress, compare scores with others, and strive to improve their eco-friendly shopping habits through gamification.

## Features

- **Account Creation and User Profiles**: Users can create an account, track their carbon scores across multiple receipts, and view personalized statistics.
- **Receipt OCR Processing**: Upload receipts and extract text data using Tesseract.js for quick and accurate analysis.
- **Carbon Scoring and Recommendations**: Carbon footprint calculated using OpenAI and OpenFoodFacts APIs, providing scores and tips for improving sustainability.
- **Data Storage**: MongoDB stores user profiles, receipt details, and carbon scores for efficient data management.
- **Leaderboard Gamification**: Compete with other users by comparing carbon scores on a dynamic leaderboard, promoting sustainable shopping habits.

## Technologies Used

- **Frontend**: HTML, Tailwind CSS, React
- **Backend**: MongoDB, OpenAI API, OpenFoodFacts API
- **OCR**: Tesseract.js for receipt text extraction
- **Design**: Figma for UI/UX prototyping

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/william-riser/yhack.git
   ```
2. Set up environment variables for MongoDB, OpenAI API, and OpenFoodFacts API.
3. ```bash
   npm start
   ```

## Usage

- **Create an Account**: Sign up and log in to track your carbon footprint.
- **Upload Receipts**: Use the app to upload grocery receipts and analyze your purchases.
- **View Carbon Score**: Get a detailed carbon score and recommendations to reduce your impact.
- **Track Progress**: Compare scores on the leaderboard and aim for a higher ranking by making sustainable choices.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any improvements or bug fixes.

## License

This project is open-source and available under the [MIT License](LICENSE).

