# AnakSehat AI — Frontend

AI-powered early stunting risk screening platform for Posyandu cadres and parents, built as a Capstone Project for Coding Camp 2026 by DBS Foundation (Healthy Lives & Well-being).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Deployment](#deployment)

---

## Overview

AnakSehat AI is a web-based application that enables Posyandu cadres to perform early stunting risk screenings for children under five (balita) using an AI prediction model. Parents can also access the platform to monitor their child's health records and receive personalized nutrition recommendations.

The frontend communicates with a Node.js/Express backend and a Python/FastAPI AI inference service, both deployed on Railway.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 with Vite |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |

---

## Prerequisites

Ensure the following are installed on your machine before proceeding:

- Node.js version 20 or higher
- npm version 10 or higher

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/afifn11/CC26-PSU383-anaksehat-ai-frontend.git
cd CC26-PSU383-anaksehat-ai-frontend
```

2. Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root of the project. Use `.env.example` as a reference:

```bash
cp .env.example .env
```

Then fill in the values:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:8000` |
| `VITE_USE_MOCK` | Use mock data instead of real API | `false` |

For local development, set `VITE_API_URL` to your locally running backend. For production, set it to the deployed backend URL on Railway.

---

## Running the Project

**Development mode:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

**Build for production:**

```bash
npm run build
```

**Preview production build locally:**

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── kader/          # Components specific to Posyandu cadre workflows
│   ├── landing/        # Landing page sections
│   ├── layout/         # Layout components (Sidebar, Navbar, etc.)
│   ├── shared/         # Reusable form and UI components
│   └── ui/             # General UI components
├── constants/          # Static data and configuration constants
├── hooks/              # Custom React hooks
├── pages/
│   ├── auth/           # Login and Register pages
│   ├── kader/          # Pages for Posyandu cadre role
│   └── orangtua/       # Pages for parent role
├── services/           # API service functions (Axios)
├── store/              # Zustand global state stores
└── utils/              # Utility/helper functions
```

---

## Usage

The application supports two user roles:

**Posyandu Cadre (Kader)**
- Register and log in as a cadre
- Input anthropometric and socioeconomic data for a child
- View AI-generated stunting risk prediction results
- Manage and monitor child records
- Access AI-generated health reports

**Parent (Orang Tua)**
- Log in to view their child's health data
- Monitor examination history
- Receive personalized nutrition and health recommendations

---

## Deployment

The frontend is deployed on Vercel. To deploy your own instance:

1. Import this repository into your Vercel account.
2. Set the following environment variables in the Vercel project settings:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your deployed Railway backend URL |
| `VITE_USE_MOCK` | `false` |

3. Vercel will automatically detect Vite and apply the correct build settings.

The `vercel.json` file in this repository configures URL rewriting so that React Router works correctly on page refresh.

---

## License

This project was developed as a capstone submission for Coding Camp 2026 by DBS Foundation.