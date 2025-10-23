# 🎮 Courtroom Debugging Game

A Next.js-based interactive coding game where players debug code under time pressure while managing workplace distractions. Built with PostgreSQL, Docker, OpenTelemetry tracing, and E2E testing.

## 🌟 Features

- ✅ **Interactive Debugging Game** - Fix buggy code challenges under time pressure
- ✅ **Real-time Notifications** - Handle urgent and normal messages while coding
- ✅ **Database Integration** - PostgreSQL with Sequelize ORM
- ✅ **Distributed Tracing** - OpenTelemetry + Jaeger integration
- ✅ **Docker Support** - Containerized deployment with Docker Compose
- ✅ **E2E Testing** - Playwright test suite
- ✅ **Modern UI** - Tailwind CSS with Framer Motion animations

---

## 📋 Table of Contents

- [Local Development Setup](#-local-development-setup)
- [AWS EC2 Deployment](#-aws-ec2-deployment-guide)
- [Database Management](#-database-management)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)

---

## 🚀 AWS EC2 Deployment Guide

Follow these steps to deploy the application on a fresh AWS EC2 instance.

### Step 1: Launch EC2 Instance

1. **Create EC2 Instance:**
   - Go to AWS Console → EC2 → Launch Instance
   - **AMI:** Ubuntu Server 22.04 LTS (or Amazon Linux 2023)
   - **Instance Type:** t2.medium or larger (recommended for Docker)
   - **Security Group Rules:**
     - SSH: Port 22 (your IP)
     - HTTP: Port 80 (0.0.0.0/0)
     - Custom TCP: Port 3000 (0.0.0.0/0) - Next.js app
     - Custom TCP: Port 16686 (0.0.0.0/0) - Jaeger UI
     - Custom TCP: Port 5432 (only if external access needed) - PostgreSQL

2. **Download the `.pem` key file** and save it securely

3. **Connect to your EC2 instance:**
   ```bash
   chmod 400 your-key.pem
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

---

### Step 2: Install Required Software

Once connected to your EC2 instance, run these commands:

#### 2.1 Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2.2 Install Git
```bash
sudo apt install git -y
git --version
```

#### 2.3 Install Docker
```bash
# Install Docker
sudo apt install docker.io -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply group changes (or logout and login again)
newgrp docker

# Verify Docker installation
docker --version
```

#### 2.4 Install Docker Compose
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

#### 2.5 Install Node.js & npm (Optional - for local development)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

---

### Step 3: Clone the Repository

```bash
# Navigate to home directory
cd ~

# Clone the repository
git clone https://github.com/Sadaat17/cwa-Assignment.git

# Navigate to project directory
cd cwa-Assignment

# List files to verify
ls -la
```

---

### Step 4: Configure Environment Variables

Create environment file for production:

```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=courtroom_db
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/courtroom_db

# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318
OTEL_SERVICE_NAME=courtroom-game

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF

# Verify the file was created
cat .env.local
```

---

### Step 5: Build and Run with Docker

```bash
# Build and start all services
docker-compose up -d

# This will start:
# - PostgreSQL database (port 5432)
# - Next.js application (port 3000)
# - Jaeger tracing UI (port 16686)
```

#### Monitor the Build Process
```bash
# View logs
docker-compose logs -f

# Check running containers
docker ps

# Check specific service logs
docker-compose logs app
docker-compose logs postgres
docker-compose logs jaeger
```

---

### Step 6: Run Database Migrations

After the containers are running:

```bash
# Access the app container
docker exec -it courtroom_app sh

# Run migrations
npm run db:migrate

# Exit container
exit
```

Or run directly:
```bash
docker exec -it courtroom_app npm run db:migrate
```

---

### Step 7: Access the Application

Your application is now running! Access it via:

- **Main App:** `http://your-ec2-public-ip:3000`
- **Jaeger UI:** `http://your-ec2-public-ip:16686`

To find your EC2 public IP:
```bash
curl ifconfig.me
```

Or check in AWS Console → EC2 → Instances → Your Instance → Public IPv4 address

---

### Step 8: Set Up Nginx (Optional - for Production)

To serve the app on port 80 with a domain:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/courtroom-game
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/courtroom-game /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 💻 Local Development Setup

For running the application locally on your machine:

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Sadaat17/cwa-Assignment.git
cd cwa-Assignment

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Playwright system dependencies
npx playwright install-deps

# Create .env.local file
cat > .env.local << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=courtroom_db
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/courtroom_db
NODE_ENV=development
EOF

# Create database (if not exists)
createdb courtroom_db

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 🗄️ Database Management

### View Database Records
```bash
npm run db:view
```

### Test Database Connection
```bash
npm run db:test
```

### Run Migrations
```bash
npm run db:migrate
```

### Undo Last Migration
```bash
npm run db:migrate:undo
```

### Using PostgreSQL CLI
```bash
# Local
psql -U postgres -d courtroom_db

# Docker
docker exec -it courtroom_postgres psql -U postgres -d courtroom_db
```

**See [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) for more details.**

---

## 🧪 Testing

### First-time Setup
Before running tests, install Playwright browsers:

```bash
# Install Playwright browsers and system dependencies
npx playwright install --with-deps
```

### Run E2E Tests
```bash
# Run all Playwright tests
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui
```

### Current Test Coverage
- ✅ Game builder flow (5 challenges)
- ✅ Game play flow (start, answer, notifications)
- ✅ Error handling
- ✅ Challenge validation

---

## 📁 Project Structure

```
assignment-1/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── game-completion/  # Game completion endpoints
│   ├── escape-room/          # Main game page
│   ├── about/                # About page
│   ├── prelab/               # Pre-lab questions
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Tabs.tsx
│   └── Themetoggle.tsx
├── lib/                      # Utility libraries
│   ├── db.ts                 # Database connection
│   ├── testDb.ts             # DB connection test
│   └── viewRecords.ts        # View DB records
├── models/                   # Sequelize models
│   ├── GameCompletion.ts     # Game completion model
│   └── index.js              # Model loader
├── migrations/               # Database migrations
├── tests/                    # Playwright E2E tests
├── config/                   # Configuration files
├── public/                   # Static assets
├── docker-compose.yml        # Docker Compose configuration
├── dockerfile               # Docker build file
├── instrumentation.ts        # OpenTelemetry setup
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies & scripts
```

---

## 🛠️ Technologies Used

### Frontend
- **Next.js 15.5** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

### Backend
- **Next.js API Routes** - Backend endpoints
- **PostgreSQL** - Database
- **Sequelize** - ORM

### DevOps & Monitoring
- **Docker & Docker Compose** - Containerization
- **OpenTelemetry** - Distributed tracing
- **Jaeger** - Trace visualization
- **Playwright** - E2E testing

---

## 🔧 Useful Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v
```

### Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test:e2e     # Run Playwright tests
npm run db:view      # View database records
npm run db:migrate   # Run database migrations
```

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Check container logs
docker-compose logs app
```

### Database Connection Issues
```bash
# Test database connection
npm run db:test

# Check PostgreSQL is running
docker ps | grep postgres

# Access PostgreSQL container
docker exec -it courtroom_postgres psql -U postgres
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

---

## 📊 Monitoring & Tracing

### Jaeger UI
Access distributed tracing at: `http://your-ip:16686`

Features:
- View HTTP requests
- Track database queries
- Monitor API calls
- Performance analysis

---

## 🔒 Security Notes for Production

1. **Change default passwords** in `docker-compose.yml`
2. **Use environment variables** for sensitive data
3. **Enable SSL/TLS** with Let's Encrypt
4. **Configure firewall** properly
5. **Regular security updates**: `sudo apt update && sudo apt upgrade`
6. **Use Docker secrets** for production credentials

---

## 📝 License

This project is part of a university assignment.

---

## 👤 Author

**Sadaat**
- GitHub: [@Sadaat17](https://github.com/Sadaat17)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- OpenTelemetry community
- Playwright for E2E testing tools

---

**Happy Coding! 🚀**
