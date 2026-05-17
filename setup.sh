#!/bin/bash
set -e

echo ""
echo "=== Recruiting Workflow App Setup ==="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed."
  echo "Download it from https://nodejs.org (LTS version) then re-run this script."
  exit 1
fi

echo "Node.js $(node -v) found."

# Check out the correct branch
git checkout claude/recruiting-workflow-app-VOclb 2>/dev/null || true

# Set up .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

if grep -q "your_api_key_here" .env; then
  echo ""
  echo "Enter your Anthropic API key (starts with sk-ant-):"
  read -r api_key
  if [ -z "$api_key" ]; then
    echo "ERROR: No API key entered. Edit .env manually and run: npm run dev"
    exit 1
  fi
  # Works on both macOS and Linux
  sed -i.bak "s/your_api_key_here/$api_key/" .env && rm -f .env.bak
  echo "API key saved to .env"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Start the app
echo ""
echo "Starting app at http://localhost:5173 ..."
echo "(Press Ctrl+C to stop)"
echo ""
npm run dev
