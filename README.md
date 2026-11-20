# Daily Expense Tracker — MERN Stack

A mobile-friendly full-stack expense tracker based on the supplied project blueprint.

## Stack
- React + Vite
- Node.js
- Express.js
- MongoDB + Mongoose
- Axios
- CSS

## Features
- Monthly budget
- Add expenses
- Add multiple expenses at once, each with its own category, amount, and payment method
- Delete expenses
- Monthly total spent
- Remaining budget
- Average spending/day
- Remaining days
- Suggested daily limit
- Category and payment-method tracking
- Filter expense history by multiple categories
- Browse and edit expenses for a selected past date
- Automatically advance the entry date after saving an expense
- Monthly expense history
- Responsive UI
- Oil-green and white color theme

## Requirements
- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection

## 1. Start the backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use:

```bash
cp .env.example .env
npm install
npm run dev
```

If `.env.example` is not present, create `.env` manually with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/daily_expense_tracker
```

Backend: http://localhost:5000

## 2. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173

## MongoDB
The default local database is:

mongodb://127.0.0.1:27017/daily_expense_tracker

If a local MongoDB server is not available, the backend now falls back to an in-memory MongoDB instance automatically, so the app can still run for development/testing.

For MongoDB Atlas, replace MONGO_URI in `server/.env`.

## Important
This starter does not include authentication. Add JWT/user accounts before using it for multiple users in production.

## Free-tier deployment

The app can be hosted with MongoDB Atlas (database), Render (API), and Vercel (frontend). Free-tier availability and limits are controlled by each provider and may change. Render's free web service can sleep when idle, so the first request after inactivity may take longer.

### 1. Push the project to a private GitHub repository

Make sure `.env` files, `node_modules`, and build output are not committed. The root `.gitignore` excludes these. Do not commit database credentials.

### 2. Create a MongoDB Atlas database

Create a free cluster, create a database user, and allow network access from the deployment host. Copy the Atlas connection string and replace its username/password placeholders. Keep this value private; it will be entered as Render's `MONGO_URI` environment variable.

### 3. Deploy the backend on Render

Create a Render web service from the repository using the included `render.yaml` blueprint. Enter:

- `MONGO_URI`: the Atlas connection string.
- `CLIENT_ORIGIN`: the deployed Vercel site origin (for example, `https://your-app.vercel.app`, without a trailing slash).

The service root directory is `server`; Render uses `npm install` and `npm start`. Once deployed, copy its HTTPS URL (for example, `https://daily-expense-tracker-api.onrender.com`).

### 4. Deploy the frontend on Vercel

Import the same repository into Vercel, set the project root directory to `client`, and configure:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable `VITE_API_URL`: the Render backend HTTPS URL, without a trailing slash.

Deploy the frontend. If its origin differs from the `CLIENT_ORIGIN` entered in Render, update that Render environment variable to the final Vercel origin and redeploy/restart the API.

The production API requires a working `MONGO_URI`; it will not silently fall back to temporary in-memory storage.
