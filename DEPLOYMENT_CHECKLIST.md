# 🚀 AWS EC2 Deployment Checklist

Quick reference checklist for deploying the Courtroom Game to AWS EC2.

## ✅ Pre-Deployment Checklist

- [ ] AWS EC2 instance launched (t2.medium or larger)
- [ ] Security group configured (ports: 22, 80, 3000, 16686, 5432)
- [ ] `.pem` key file downloaded and secured
- [ ] SSH access verified

---

## 📋 Installation Steps (Copy-Paste Ready)

### 1. Connect to EC2
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 2. Install Everything (One Command)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Git
sudo apt install git -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
git --version
docker --version
docker-compose --version
```

### 3. Clone & Setup
```bash
# Clone repository
cd ~
git clone https://github.com/Sadaat17/cwa-Assignment.git
cd cwa-Assignment

# Create environment file
cat > .env.local << 'EOF'
DB_HOST=postgres
DB_PORT=5432
DB_NAME=courtroom_db
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/courtroom_db
OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318
OTEL_SERVICE_NAME=courtroom-game
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF
```

### 4. Deploy with Docker
```bash
# Start all services
docker-compose up -d

# Wait for containers to start (about 2-3 minutes)
docker-compose logs -f

# Once build is complete, run migrations
docker exec -it courtroom_app npm run db:migrate
```

### 5. Access Application
```bash
# Get your public IP
curl ifconfig.me

# Access:
# App: http://your-ip:3000
# Jaeger: http://your-ip:16686
```

---

## 🔍 Verification Commands

```bash
# Check all containers are running
docker ps

# Should show 3 containers:
# - courtroom_app
# - courtroom_postgres
# - courtroom_jaeger

# Check logs
docker-compose logs app
docker-compose logs postgres
docker-compose logs jaeger

# Test database
docker exec -it courtroom_app npm run db:test

# View database records
docker exec -it courtroom_app npm run db:view
```

---

## 🛠️ Troubleshooting

### Containers not starting?
```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Can't access the app?
```bash
# Check if port 3000 is open
sudo ufw status
sudo ufw allow 3000

# Check if app is running
curl http://localhost:3000
```

### Database errors?
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Re-run migrations
docker exec -it courtroom_app npm run db:migrate
```

---

## 🔄 Update Application

```bash
# Pull latest changes
cd ~/cwa-Assignment
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run migrations if needed
docker exec -it courtroom_app npm run db:migrate
```

---

## 🗑️ Complete Cleanup

```bash
# Stop and remove everything
docker-compose down -v

# Remove Docker images
docker system prune -a

# Remove repository
rm -rf ~/cwa-Assignment
```

---

## 📊 Monitoring

### View Logs in Real-Time
```bash
docker-compose logs -f app
```

### Check Resource Usage
```bash
docker stats
```

### Access Container Shell
```bash
docker exec -it courtroom_app sh
```

---

## 🎯 Quick Reference URLs

After deployment, bookmark these:

- **Application:** `http://your-ec2-ip:3000`
- **Jaeger Tracing:** `http://your-ec2-ip:16686`
- **SSH Command:** `ssh -i your-key.pem ubuntu@your-ec2-ip`

---

## ✅ Post-Deployment Checklist

- [ ] All 3 containers running (`docker ps`)
- [ ] App accessible at port 3000
- [ ] Jaeger UI accessible at port 16686
- [ ] Database migrations completed
- [ ] Game playable and functional
- [ ] Traces visible in Jaeger
- [ ] Database storing game results

---

**Deployment Time Estimate:** 15-20 minutes

**Need help?** See [README.md](./README.md) for detailed documentation.

