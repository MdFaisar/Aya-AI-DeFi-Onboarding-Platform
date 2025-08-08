# Aya DeFi Navigator Setup Script (PowerShell)
# This script sets up the development environment for Windows

Write-Host "🚀 Setting up Aya DeFi Navigator development environment..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Check-Requirements {
    Write-Status "Checking requirements..."
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Success "npm found: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm and try again."
        exit 1
    }
    
    # Check Python
    try {
        $pythonVersion = python --version
        Write-Success "Python found: $pythonVersion"
    }
    catch {
        Write-Warning "Python not found with 'python' command, trying 'python3'..."
        try {
            $pythonVersion = python3 --version
            Write-Success "Python found: $pythonVersion"
        }
        catch {
            Write-Error "Python 3 is not installed. Please install Python 3.11+ and try again."
            exit 1
        }
    }
    
    # Check pip
    try {
        $pipVersion = pip --version
        Write-Success "pip found: $pipVersion"
    }
    catch {
        Write-Warning "pip not found with 'pip' command, trying 'pip3'..."
        try {
            $pipVersion = pip3 --version
            Write-Success "pip found: $pipVersion"
        }
        catch {
            Write-Error "pip is not installed. Please install pip and try again."
            exit 1
        }
    }
    
    # Check Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker found: $dockerVersion"
    }
    catch {
        Write-Warning "Docker is not installed. You'll need to set up databases manually."
    }
    
    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose found: $composeVersion"
    }
    catch {
        Write-Warning "Docker Compose is not installed. You'll need to set up services manually."
    }
}

# Setup environment file
function Setup-Environment {
    Write-Status "Setting up environment file..."
    
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Success "Created .env file from .env.example"
            Write-Warning "Please edit .env file with your configuration before continuing"
        }
        else {
            Write-Error ".env.example file not found"
            exit 1
        }
    }
    else {
        Write-Warning ".env file already exists, skipping..."
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Status "Installing dependencies..."
    
    # Install root dependencies
    Write-Status "Installing root dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install root dependencies"
        exit 1
    }
    
    # Install frontend dependencies
    Write-Status "Installing frontend dependencies..."
    Set-Location "frontend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
    Set-Location ".."
    
    # Install MCP server dependencies
    Write-Status "Installing MCP server dependencies..."
    Set-Location "mcp-server"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install MCP server dependencies"
        exit 1
    }
    Set-Location ".."
    
    # Install backend dependencies
    Write-Status "Installing backend dependencies..."
    Set-Location "backend"
    try {
        pip install -r requirements.txt
    }
    catch {
        try {
            pip3 install -r requirements.txt
        }
        catch {
            Write-Error "Failed to install backend dependencies"
            exit 1
        }
    }
    Set-Location ".."
    
    Write-Success "All dependencies installed!"
}

# Setup database
function Setup-Database {
    Write-Status "Setting up database..."
    
    try {
        docker-compose --version | Out-Null
        Write-Status "Starting database services with Docker Compose..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        Write-Status "Waiting for database to be ready..."
        Start-Sleep -Seconds 10
        
        Write-Success "Database services started!"
    }
    catch {
        Write-Warning "Docker Compose not available. Please set up PostgreSQL and Redis manually."
        Write-Warning "PostgreSQL: Create database 'aya_defi_navigator' with user 'aya_user'"
        Write-Warning "Redis: Start Redis server on default port 6379"
    }
}

# Build projects
function Build-Projects {
    Write-Status "Building projects..."
    
    # Build MCP server
    Write-Status "Building MCP server..."
    Set-Location "mcp-server"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "MCP server build failed, but continuing..."
    }
    Set-Location ".."
    
    # Build frontend (optional for development)
    Write-Status "Building frontend..."
    Set-Location "frontend"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Frontend build failed, but continuing..."
    }
    Set-Location ".."
    
    Write-Success "Projects built successfully!"
}

# Main setup function
function Main {
    Write-Host "🎯 Aya DeFi Navigator Setup" -ForegroundColor Cyan
    Write-Host "==========================" -ForegroundColor Cyan
    Write-Host ""
    
    Check-Requirements
    Setup-Environment
    Install-Dependencies
    Setup-Database
    Build-Projects
    
    Write-Host ""
    Write-Success "Setup completed successfully! 🎉"
    Write-Status "Next steps:"
    Write-Host "  1. Edit your .env file with proper API keys" -ForegroundColor White
    Write-Host "  2. Start the development servers:" -ForegroundColor White
    Write-Host "     npm run dev" -ForegroundColor Yellow
    Write-Host "  3. Visit http://localhost:3000 to see the application" -ForegroundColor White
    Write-Host ""
    Write-Success "Happy coding! 🚀"
}

# Run main function
Main
