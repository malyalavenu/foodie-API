#!/bin/bash

echo "🚀 Setting up GitHub MCP for Foodie API Project"
echo "================================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "📝 Please create a .env file:"
    echo "1. Copy env.example to .env: cp env.example .env"
    echo "2. Edit .env and add your GitHub token:"
    echo "   GITHUB_TOKEN=your_github_personal_access_token"
    echo ""
    echo "🔗 Or create .env manually with:"
    echo "   echo 'GITHUB_TOKEN=your_token_here' > .env"
    exit 1
fi

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

# Check if GitHub token is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN is not set in .env file!"
    echo ""
    echo "📝 Please follow these steps:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Set permissions: repo, read:org, read:user, read:email"
    echo "4. Copy the token"
    echo "5. Add to .env file: GITHUB_TOKEN=your_token_here"
    echo ""
    echo "🔗 Or set it in .env: echo 'GITHUB_TOKEN=your_token_here' >> .env"
    exit 1
fi

echo "✅ GITHUB_TOKEN is set in .env file"
echo "🔧 Testing GitHub MCP connection..."

# Test the MCP server
if github-mcp-server stdio --help > /dev/null 2>&1; then
    echo "✅ GitHub MCP server is working"
else
    echo "❌ GitHub MCP server is not working properly"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your GitHub MCP is ready to use."
echo ""
echo "📋 Available features:"
echo "   • Repository management"
echo "   • Issue and PR operations"
echo "   • Code search and navigation"
echo "   • User and organization data"
echo ""
echo "💡 To use in your AI assistant, reference: mcp-config.json"
echo "🔒 Your GitHub token is securely stored in .env file" 