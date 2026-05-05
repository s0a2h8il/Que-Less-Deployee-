# Deployment Guide for QueueLess

This guide outlines the steps to deploy the QueueLess application to platforms like **Render**, **Heroku**, or **Vercel/DigitalOcean**.

## 1. Backend Environment Variables (.env)

Set the following environment variables in your hosting platform's dashboard:

| Variable | Description | Example (Production) |
| :--- | :--- | :--- |
| `PORT` | The port the server runs on | `5000` (usually provided by host) |
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/queueless` |
| `JWT_SECRET` | A long, random string for tokens | `your_very_long_random_secret_string_here` |
| `JWT_REFRESH_SECRET`| A long, random string for refresh tokens | `another_long_random_secret_string_here` |
| `CORS_ORIGIN` | Your frontend URL | `https://your-app.vercel.app` |

## 2. Frontend Environment Variables (.env)

When building the frontend, these must be available:

| Variable | Description | Example (Production) |
| :--- | :--- | :--- |
| `VITE_API_URL` | Your backend API endpoint | `https://your-api.onrender.com/api` |
| `VITE_SOCKET_URL` | Your backend root URL (for sockets)| `https://your-api.onrender.com` |

## 3. Serving Frontend from Backend (Recommended for Render/Heroku)

If you want to host both on the same domain:
1. Run `npm run build` inside the `frontend` folder.
2. The `server.js` in the backend is configured to serve the `frontend/dist` folder automatically when `NODE_ENV=production`.

## 4. Deployment Steps (Render Example)

### Backend
1. Connect your GitHub repository.
2. Select the `backend` directory as the Root Directory.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add the environment variables from the table above.

### Frontend
1. Select the `frontend` directory as the Root Directory.
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. Add the `VITE_API_URL` and `VITE_SOCKET_URL` pointing to your deployed backend.

---
**Note:** For Socket.io to work correctly in production, ensure your backend URL uses `https://` and that you don't have a port number in the `VITE_SOCKET_URL` unless your host specifically requires it.
