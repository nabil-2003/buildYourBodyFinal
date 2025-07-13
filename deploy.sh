#!/bin/bash

echo "🚀 BuildYourBody Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd front-end
npm install
npm run build
cd ..

# Check if build was successful
if [ ! -d "front-end/dist" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# Check backend dependencies
echo "🔧 Checking backend dependencies..."
cd back-end
npm install
cd ..

echo "✅ Backend dependencies installed!"

echo ""
echo "🎉 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy to your preferred platform:"
echo "   - Vercel: https://vercel.com"
echo "   - Netlify: https://netlify.com"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 