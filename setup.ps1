# Setup script for Windows
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setting up CWA Assignment Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install npm dependencies
Write-Host ""
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install npm dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm dependencies installed" -ForegroundColor Green

# Install Playwright browsers
Write-Host ""
Write-Host "Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install Playwright browsers" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Playwright browsers installed" -ForegroundColor Green

# Install Playwright system dependencies
Write-Host ""
Write-Host "Installing Playwright system dependencies..." -ForegroundColor Yellow
npx playwright install-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: Failed to install system dependencies (may require admin privileges)" -ForegroundColor Yellow
}
Write-Host "✓ Playwright dependencies installed" -ForegroundColor Green

# Setup complete
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start development server: npm run dev" -ForegroundColor White
Write-Host "  2. Or start with Docker: docker-compose up --build" -ForegroundColor White
Write-Host "  3. Run tests: npm run test:e2e" -ForegroundColor White
Write-Host ""

