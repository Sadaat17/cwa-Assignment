#!/bin/bash
# Setup script for Linux/Mac

echo "========================================"
echo "  Setting up CWA Assignment Project"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js is installed: $NODE_VERSION"
else
    echo "✗ Node.js is not installed. Please install Node.js first."
    echo "  Download from: https://nodejs.org/"
    exit 1
fi

# Install npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "✗ Failed to install npm dependencies"
    exit 1
fi
echo "✓ npm dependencies installed"

# Install Playwright browsers
echo ""
echo "Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "✗ Failed to install Playwright browsers"
    exit 1
fi
echo "✓ Playwright browsers installed"

# Install Playwright system dependencies
echo ""
echo "Installing Playwright system dependencies..."
npx playwright install-deps

if [ $? -ne 0 ]; then
    echo "⚠ Warning: Failed to install system dependencies (may require sudo)"
fi
echo "✓ Playwright dependencies installed"

# Setup complete
echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Or start with Docker: docker-compose up --build"
echo "  3. Run tests: npm run test:e2e"
echo ""

