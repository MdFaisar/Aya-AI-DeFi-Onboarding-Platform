#!/bin/bash

# Aya DeFi Navigator Setup Script
# This script sets up the development environment for the project

set -e  # Exit on any error

echo "🚀 Setting up Aya DeFi Navigator development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11+ and try again."
        exit 1
    fi
    
    # Check pip
    if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
        print_error "pip is not installed. Please install pip and try again."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need to set up databases manually."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. You'll need to set up services manually."
    fi
    
    print_success "All requirements satisfied!"
}

# Setup environment file
setup_env() {
    print_status "Setting up environment file..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
            print_warning "Please edit .env file with your configuration before continuing"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_warning ".env file already exists, skipping..."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Install MCP server dependencies
    print_status "Installing MCP server dependencies..."
    cd mcp-server
    npm install
    cd ..
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    if command -v pip3 &> /dev/null; then
        pip3 install -r requirements.txt
    else
        pip install -r requirements.txt
    fi
    cd ..
    
    print_success "All dependencies installed!"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if command -v docker-compose &> /dev/null; then
        print_status "Starting database services with Docker Compose..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        print_success "Database services started!"
    else
        print_warning "Docker Compose not available. Please set up PostgreSQL and Redis manually."
        print_warning "PostgreSQL: Create database 'aya_defi_navigator' with user 'aya_user'"
        print_warning "Redis: Start Redis server on default port 6379"
    fi
}

# Build projects
build_projects() {
    print_status "Building projects..."
    
    # Build MCP server
    print_status "Building MCP server..."
    cd mcp-server
    npm run build
    cd ..
    
    # Build frontend (optional for development)
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    print_success "Projects built successfully!"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Test backend
    print_status "Testing backend..."
    cd backend
    if command -v pytest &> /dev/null; then
        pytest tests/ -v
    else
        print_warning "pytest not found, skipping backend tests"
    fi
    cd ..
    
    # Test frontend
    print_status "Testing frontend..."
    cd frontend
    npm test -- --watchAll=false
    cd ..
    
    # Test MCP server
    print_status "Testing MCP server..."
    cd mcp-server
    npm test
    cd ..
    
    print_success "All tests completed!"
}

# Start development servers
start_dev_servers() {
    print_status "Starting development servers..."
    
    print_status "You can now start the development servers:"
    echo ""
    echo "  # Start all services with Docker Compose:"
    echo "  docker-compose up"
    echo ""
    echo "  # Or start services individually:"
    echo "  # Terminal 1 - Backend:"
    echo "  cd backend && uvicorn main:app --reload --port 8000"
    echo ""
    echo "  # Terminal 2 - MCP Server:"
    echo "  cd mcp-server && npm run dev"
    echo ""
    echo "  # Terminal 3 - Frontend:"
    echo "  cd frontend && npm run dev"
    echo ""
    echo "  # Access the application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
}

# Main setup function
main() {
    echo "🎯 Aya DeFi Navigator Setup"
    echo "=========================="
    echo ""
    
    check_requirements
    setup_env
    install_dependencies
    setup_database
    build_projects
    
    # Ask if user wants to run tests
    read -p "Do you want to run tests? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_tests
    fi
    
    start_dev_servers
    
    print_success "Setup completed successfully! 🎉"
    print_status "Don't forget to:"
    echo "  1. Edit your .env file with proper API keys"
    echo "  2. Start the development servers"
    echo "  3. Visit http://localhost:3000 to see the application"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main "$@"
