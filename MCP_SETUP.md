# GitHub MCP Setup Guide

## 🎯 Overview
This guide helps you set up GitHub MCP (Model Context Protocol) for your Foodie API project, enabling AI assistants to interact with your GitHub repositories.

## 📋 Prerequisites
- GitHub account
- Homebrew (for macOS)
- Terminal access

## 🚀 Quick Setup

### 1. Install GitHub MCP Server
```bash
brew install github-mcp-server
```

### 2. Create GitHub Personal Access Token
1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Configure permissions:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Read organization data)
   - ✅ `read:user` (Read user data)
   - ✅ `read:email` (Read email addresses)
4. Copy the generated token

### 3. Set Up Environment File
```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your GitHub token
GITHUB_TOKEN=your_github_personal_access_token
```

### 4. Run Setup Script
```bash
./setup-mcp.sh
```

## 📁 Configuration Files

### `.env` File
Environment variables for your project:
```bash
DB_HOST=db
DB_PORT=5432
DB_USER=foodie
DB_PASSWORD=secret
DB_NAME=foodie_db
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_personal_access_token
```

### `mcp-config.json`
Main configuration file for MCP servers:
```json
{
  "mcpServers": {
    "github": {
      "command": "github-mcp-server",
      "args": ["stdio"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      },
      "description": "GitHub MCP server for repository management, issues, and more"
    }
  },
  "envFile": ".env"
}
```

## 🔧 Available Features

### Repository Management
- List repositories
- Get repository details
- Create/update/delete repositories
- Manage repository settings

### Issues & Pull Requests
- Create and manage issues
- Handle pull requests
- Comment on issues/PRs
- Review code changes

### Code Operations
- Search code across repositories
- Navigate file structures
- View commit history
- Manage branches

### User & Organization
- Get user information
- List organization members
- Manage team access

## 🛠️ Troubleshooting

### Common Issues

**1. .env File Not Found**
```bash
❌ .env file not found!
```
**Solution**: Create .env file from example: `cp env.example .env`

**2. Token Not Set in .env**
```bash
❌ GITHUB_TOKEN is not set in .env file!
```
**Solution**: Add `GITHUB_TOKEN=your_token_here` to your .env file

**3. Permission Denied**
```bash
❌ GitHub API returned 401 Unauthorized
```
**Solution**: Check token permissions and regenerate if needed

**4. Server Not Found**
```bash
❌ github-mcp-server: command not found
```
**Solution**: Reinstall with `brew install github-mcp-server`

### Testing Connection
```bash
# Test MCP server
github-mcp-server stdio --help

# Test with .env file
source .env && github-mcp-server stdio
```

## 📚 Integration with AI Assistants

### For Claude/Anthropic
- Reference `mcp-config.json` in your assistant configuration
- Enable MCP server connection in your AI tool settings
- The server will automatically load environment from `.env`

### For Other AI Tools
- Most AI assistants support MCP through configuration files
- Point to the `mcp-config.json` file
- Ensure `.env` file contains `GITHUB_TOKEN`

## 🔒 Security Notes

- **Never commit your .env file** to version control (already in .gitignore)
- Use environment variables for token storage
- Regularly rotate your tokens (30-90 days)
- Use minimal required permissions
- Consider using GitHub Apps for production use

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your GitHub token permissions
3. Test the MCP server manually
4. Check GitHub API status: https://www.githubstatus.com/

## 🎉 Success!

Once configured, your AI assistant can:
- Access your GitHub repositories
- Manage issues and pull requests
- Search and navigate code
- Handle repository operations
- Integrate with your development workflow 