#!/bin/bash

echo "🔧 Setting up .env file for GitHub MCP"
echo "======================================"

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Copy from example
cp env.example .env

echo "✅ .env file created from env.example"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file and add your GitHub token:"
echo "   GITHUB_TOKEN=your_github_personal_access_token"
echo ""
echo "2. Run the setup script:"
echo "   ./setup-mcp.sh"
echo ""
echo "🔗 To get a GitHub token:"
echo "   https://github.com/settings/tokens" 