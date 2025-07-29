# Expresso Production Deployment Guide

This guide explains how to deploy the Expresso AI-powered videocalling app in production using the current configurations.

## Project Architecture

The project consists of 4 main components:

- **Frontend**: Next.js application (port 3000)
- **Backend**: Django REST API (port 8000)
- **MediaSoup Server**: WebRTC server (port 4444)
- **Nginx**: Reverse proxy (ports 80/443)

## Prerequisites

1. **Server Requirements**:

   - Ubuntu 20.04+ or CentOS 8+
   - 4GB RAM minimum (8GB recommended)
   - 2+ CPU cores
   - 50GB+ storage
   - Public IP address

2. **Domain Name**: Configure DNS to point to your server IP

3. **SSL Certificate**: Obtain SSL certificate for your domain

## Step 1: Server Setup

### Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# No need to install PostgreSQL or Redis separately - they'll run in Docker containers
```

### Clone Repository

```bash
git clone <your-repository-url>
cd Expresso
```

## Step 2: Environment Configuration

### Backend Environment (.env)

Copy the example file and configure:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your production values:

```env
# Django Settings
SECRET_KEY=your-actual-secret-key-here
DEBUG=False
HOST=your-domain.com
FRONTEND_URL=https://your-domain.com

# Database Configuration
DATABASE_URL=postgresql://expresso_user:password@postgres:5432/expresso_db

# Email Configuration
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password

# Google OAuth2 Configuration
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Production Settings
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Static Files
STATIC_ROOT=/app/static
MEDIA_ROOT=/app/media
```

### Frontend Environment (.env)

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com/api

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret


# Environment
NODE_ENV=production
```

### MediaSoup Server Environment (.env)

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
# MediaSoup Server Configuration
ANNOUNCED_IP=your-server-public-ip

# Server Ports
LISTEN_PORT=3016
WEBRTC_MIN_PORT=10000
WEBRTC_MAX_PORT=10100

# Environment
NODE_ENV=production
LOG_LEVEL=info
```

## Step 3: SSL Certificate Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot -y

# Obtain SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates to project directory
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/certificate.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/private.key
sudo chown -R $USER:$USER ssl/
```

## Step 4: Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: expresso_db
      POSTGRES_USER: expresso_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Redis for Django Channels
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Django Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://expresso_user:password@postgres:5432/expresso_db
      - REDIS_URL=redis://redis:6379/0
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
      - redis
    volumes:
      - static_files:/app/static
      - media_files:/app/media
    restart: unless-stopped

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
    restart: unless-stopped

  # MediaSoup WebRTC Server
  mediasoup:
    build:
      context: ./server
      dockerfile: Dockerfile
    env_file:
      - ./server/.env
    ports:
      - "10000-10100:10000-10100/udp"
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
      - "4444:4444"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
      - mediasoup
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  static_files:
  media_files:
```

## Step 5: Database Setup

### Using Docker Services (Recommended)

The PostgreSQL and Redis databases will run as Docker containers, so you don't need to install them separately on your server. This approach provides:

- **Isolation**: Each service runs in its own container
- **Consistency**: Same environment across development and production
- **Easy Management**: Start/stop with Docker Compose
- **Data Persistence**: Volumes ensure data survives container restarts

Set the database password (optional - using hardcoded 'password' in Docker Compose):

```bash
# If you want to use environment variable instead of hardcoded password
export POSTGRES_PASSWORD="your-secure-database-password"
```

## Step 6: Deploy

### Build and Start Services

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### Initialize Database

```bash
# Run Django migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# Verify database connection
docker-compose -f docker-compose.prod.yml exec backend python manage.py check --database default
```

## Step 7: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.com/accounts/google/login/callback/`
   - `https://your-domain.com/api/social/login/google/`
6. Copy Client ID and Client Secret to your environment files

## Step 8: Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### SSL Certificate Renewal

```bash
# Renew certificate
sudo certbot renew

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/certificate.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/private.key
sudo chown -R $USER:$USER ssl/

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## Step 9: Security Considerations

1. **Firewall Configuration**:

   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Regular Updates**:

   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y

   # Update Docker images
   docker-compose -f docker-compose.prod.yml pull
   ```

3. **Backup Strategy**:

```bash
# Backup database (using Docker container)
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U expresso_user expresso_db > backup.sql

# Backup volumes (Docker volumes persist data)
docker run --rm -v expresso_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Backup Redis data
docker run --rm -v expresso_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz -C /data .
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 80, 443, 4444, and 10000-10100 are available
2. **SSL Issues**: Verify certificate paths and permissions
3. **Database Connection**: Check PostgreSQL service and credentials
4. **WebRTC Issues**: Verify MediaSoup server configuration and firewall rules

### Health Checks

```bash
# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# Check service logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Test nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

## Performance Optimization

1. **Enable Gzip Compression** in nginx configuration
2. **Use CDN** for static assets
3. **Configure Redis** for session storage
4. **Monitor Resource Usage** with tools like htop or docker stats

## Support

For issues and support:

1. Check service logs
2. Verify environment configurations
3. Ensure all prerequisites are met
4. Review firewall and network configurations
