# BuildYourBody - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

#### Frontend Deployment:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `front-end`
5. Deploy

#### Backend Deployment:
1. Create a new Vercel project
2. Set root directory to `back-end`
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
4. Deploy

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify:
1. Push to GitHub
2. Connect to Netlify
3. Set build command: `cd front-end && npm install && npm run build`
4. Set publish directory: `front-end/dist`

#### Backend on Railway:
1. Push to GitHub
2. Connect to Railway
3. Set root directory to `back-end`
4. Add environment variables
5. Deploy

### Option 3: Render

#### Frontend:
1. Create Static Site
2. Connect GitHub repo
3. Set build command: `cd front-end && npm install && npm run build`
4. Set publish directory: `front-end/dist`

#### Backend:
1. Create Web Service
2. Connect GitHub repo
3. Set root directory to `back-end`
4. Add environment variables
5. Deploy

## 🔧 Environment Variables

### Backend (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
PORT=8080
```

### Frontend:
Update the API URL in your hooks to point to your deployed backend URL.

## 📦 Build Commands

### Frontend:
```bash
cd front-end
npm install
npm run build
```

### Backend:
```bash
cd back-end
npm install
npm start
```

## 🌐 CORS Configuration

Make sure your backend CORS settings allow requests from your frontend domain:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

## 📝 Notes

- The frontend is built with Vite and React
- The backend uses Express.js and MongoDB
- All unused dependencies have been removed for optimal deployment
- The app includes authentication, AI chat, training plans, and video features 