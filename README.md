# Reflect Daily

Reflect Daily is a web application designed to be a personal space for daily reflection and growth. It leverages the power of generative AI to analyze journal entries, providing users with insights into their emotional patterns and generating personalized weekly "quests" to encourage self-improvement.

## Key Features

- **Secure User Authentication**: Users can sign up and log in to a personal, secure account.
- **Daily Journaling**: A simple and intuitive interface for writing and saving daily journal entries.
- **AI-Powered Analysis**: Each journal entry is analyzed by an AI to provide a "reflection score" and identify dominant emotions, helping users understand their state of mind.
- **Personalized Weekly Quests**: Based on the patterns and themes from the past week's journal entries, the app generates a unique, actionable quest to help the user focus on a specific area of personal growth.
- **Progress Visualization**: A chart tracks the user's reflection scores over time, providing a visual representation of their journey.
- **Journal History**: Users can easily review their most recent journal entries and the associated AI analysis.

## Tech Stack

This application is built with a modern, full-stack TypeScript setup:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore and Authentication)
- **Generative AI**: [Google AI](https://ai.google/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To run this project locally, you will need to have Node.js and npm installed.

### 1. Environment Variables

Before running the application, you need to set up your environment variables. Create a `.env.local` file in the root of the project and add your Firebase and Google AI credentials.

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI API Key (for Genkit)
GEMINI_API_KEY=your_google_ai_api_key
```

You can get your Firebase configuration from the Firebase console, and your Google AI API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
