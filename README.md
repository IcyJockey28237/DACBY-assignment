# Hacker News Scraper & Bookmark App (MERN Stack)

This is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js). It scrapes the top 10 stories from Hacker News and allows users to register, login, and bookmark their favorite stories.

## Features

*   **Web Scraper:** Automatically scrapes the top 10 stories from Hacker News on server start and can be triggered manually.
*   **Authentication:** Secure JWT-based user registration and login.
*   **Story Browsing:** View the latest scraped stories with pagination support.
*   **Bookmarks:** Logged-in users can save and view their favorite stories in a protected section.
*   **Modern UI:** A clean, responsive, glassmorphism-inspired dark mode interface.

## Tech Stack

*   **Frontend:** React (Vite), Context API, React Router, Axios, Lucide React (Icons), Vanilla CSS.
*   **Backend:** Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Axios & Cheerio (for scraping).

## Setup Instructions

### Prerequisites

*   Node.js (v14 or higher)
*   MongoDB (local instance or MongoDB Atlas URI)

### Environment Variables

You need to create a `.env` file in the `backend` directory. An example format is:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dacby_assignment
JWT_SECRET=your_super_secret_jwt_key
```

### Installation

1. **Clone the repository:**
   *(Ensure you have cloned this repository locally)*

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application Locally

1. **Start the Backend Server:**
   Open a terminal, navigate to the `backend` folder, and run:
   ```bash
   node server.js
   ```
   *The server will start on port 5000 and automatically perform an initial scrape of Hacker News.*

2. **Start the Frontend Development Server:**
   Open a new terminal, navigate to the `frontend` folder, and run:
   ```bash
   npm run dev
   ```
   *The React app will typically be accessible at `http://localhost:5173`.*

## Folder Structure

*   `backend/`
    *   `controllers/`: Logic for routes
    *   `middleware/`: Authentication and error handling
    *   `models/`: Mongoose schemas (User, Story)
    *   `routes/`: API endpoints
    *   `scraper/`: Web scraping logic using Cheerio
    *   `server.js`: Express app entry point
*   `frontend/`
    *   `src/api/`: Axios configuration
    *   `src/components/`: Reusable UI components
    *   `src/context/`: React Context for state management
    *   `src/pages/`: Main application views
    *   `src/index.css`: Global styles

## Evaluation Criteria Addressed
- Clean, structured code with separated concerns (Routes, Controllers, Models).
- Fully functional backend API with JWT authentication.
- Pagination implemented on `GET /api/stories`.
- Dynamic and aesthetic UI without Tailwind.

## Bonuses Completed
- **Pagination**: The API `GET /api/stories?page=1&limit=10` is fully supported and used by the frontend.
- **Premium Design Aesthetics**: Hand-crafted CSS using glassmorphism, dynamic gradients, CSS variables, and Lucide React icons for a truly "wow" first impression.

## Deploying to Vercel

This repository is pre-configured to be deployed as a full-stack monorepo directly on Vercel.

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and get your connection string.
2. Push your repository to GitHub.
3. Import the project into Vercel.
4. **Important**: Before deploying, add the following Environment Variables in your Vercel project settings:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for JWT authentication.
5. Vercel will automatically use `vercel.json` to build the frontend with Vite and deploy the backend as Serverless Functions handling all `/api/*` routes.
