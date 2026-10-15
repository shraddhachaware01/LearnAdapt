# LearnAdapt AI — Personalized Learning Platform

LearnAdapt AI is an AI-based adaptive learning platform designed to help students identify their weak concepts and follow a personalized learning path.

The project initially focuses on **JavaScript learning**, helping students understand their current knowledge level through a diagnostic quiz and receive a roadmap based on their performance.

## Problem Statement

Students learn at different speeds and have different levels of understanding. Traditional learning approaches often provide the same content to everyone, making it difficult for students to identify their knowledge gaps and decide what to study next.

LearnAdapt AI aims to address this problem through concept-wise performance analysis and personalized learning recommendations.

## Current Features

- **Interactive Quiz:** Answer JavaScript questions to assess your understanding.
- **Instant Feedback:** See whether your selected answer is correct.
- **Score Calculation:** View your overall quiz score and percentage.
- **Concept-wise Analysis:** Identify strong, medium, and weak concepts.
- **Personalized Learning Roadmap:** Receive an ordered list of concepts to review based on your performance and prerequisite relationships.
- **Progress Visualization:** View concept-level scores using progress bars.
- **Retake Quiz:** Attempt the quiz again to reassess your knowledge.

## How It Works

1. The student attempts a JavaScript diagnostic quiz.
2. The application records answers and calculates the score.
3. Performance is analyzed separately for each concept.
4. Concepts are classified as strong, medium, or weak.
5. A learning roadmap is generated using concept prerequisites.
6. The student can retake the quiz to reassess their understanding.

## Technology Stack

- **Frontend:** React.js
- **Build Tool:** Vite
- **Language:** JavaScript
- **Styling:** CSS-in-JS using React inline styles
- **Version Control:** Git and GitHub

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shraddhachaware01/LearnAdapt.git
   ```

2. Navigate to the project directory:

   ```bash
   cd LearnAdapt
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## Project Structure

```text
LearnAdapt/
├── public/
├── src/
│   ├── engine/
│   │   ├── question.js
│   │   └── scoring.js
│   ├── Quiz.jsx
│   └── ...
├── index.html
├── package.json
└── README.md
```

## Future Enhancements

- User authentication and learner profiles
- Backend API and database integration
- Personalized learning resources and video recommendations
- A second assessment to measure improvement
- Before-and-after performance comparison
- Python-based AI/ML service for learner analysis and recommendations
- Student dashboard and learning progress tracking

## Project Goal

The long-term goal of LearnAdapt AI is to make learning more personalized by helping students understand their strengths, improve weak concepts, and follow a learning path suited to their needs.