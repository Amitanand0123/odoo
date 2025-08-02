#!/bin/bash

echo "🚀 QuickDesk Deployment Setup"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin YOUR_GITHUB_REPO_URL"
    echo "   git push -u origin main"
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "server/package.json"
    "client/package.json"
    "server/index.js"
    "server/src/app.js"
    "client/src/services/api.js"
    ".github/workflows/ping-backend.yml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done

echo ""
echo "🔧 Environment Setup Checklist:"
echo "==============================="
echo "1. MongoDB Atlas Database:"
echo "   - Create cluster at mongodb.com"
echo "   - Get connection string"
echo ""
echo "2. Cloudinary Account:"
echo "   - Sign up at cloudinary.com"
echo "   - Get cloud name, API key, and secret"
echo ""
echo "3. Gmail App Password:"
echo "   - Enable 2FA on Gmail"
echo "   - Generate app password"
echo ""
echo "4. GitHub Repository:"
echo "   - Push code to GitHub"
echo "   - Add RENDER_BACKEND_URL secret"
echo ""
echo "5. Render Deployment:"
echo "   - Connect GitHub repo"
echo "   - Set root directory to 'server'"
echo "   - Add environment variables"
echo ""
echo "6. Vercel Deployment:"
echo "   - Connect GitHub repo"
echo "   - Set root directory to 'client'"
echo "   - Add REACT_APP_API_URL environment variable"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎯 Next Steps:"
echo "1. Follow the deployment guide"
echo "2. Test your deployed application"
echo "3. Monitor GitHub Actions for backend health" 