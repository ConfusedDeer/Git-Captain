# Git-Captain Enterprise Deployment Guide

This guide covers advanced deployment scenarios for Git-Captain in production environments.

## Table of Contents
- [Windows Server Deployment](#windows-server-deployment)
- [Linux Server Deployment](#linux-server-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Reverse Proxy Configuration](#reverse-proxy-configuration)
- [SSL Certificate Management](#ssl-certificate-management)
- [Monitoring & Logging](#monitoring--logging)

---

## Windows Server Deployment

### Prerequisites
- Windows Server 2016 or later
- Node.js 18+ installed
- Git for Windows
- Administrative privileges

### Step-by-Step Installation

#### 1. Install Dependencies
```powershell
# Install Node.js from https://nodejs.org/
# Install Git from https://git-scm.com/download/win

# Verify installations
node --version
npm --version
git --version
```

#### 2. Clone and Setup Application
```powershell
# Clone repository
git clone https://github.com/ConfusedDeer/Git-Captain.git
cd Git-Captain

# Install dependencies
npm install

# Create .env file (see Configuration section)
```

#### 3. SSL Certificate Setup
```powershell
# Install OpenSSL (download from https://slproweb.com/products/Win32OpenSSL.html)

# Generate self-signed certificate
cd "C:\Program Files\OpenSSL-Win64\bin"
openssl req -nodes -new -x509 -keyout theKey.key -out theCert.cert

# Copy certificates to project
copy theKey.key "C:\Git-Captain\controllers\"
copy theCert.cert "C:\Git-Captain\controllers\"
```

#### 4. Windows Firewall Configuration
```powershell
# Open PowerShell as Administrator

# Allow inbound traffic on port 3000
netsh advfirewall firewall add rule name="Git-Captain-Inbound" dir=in action=allow protocol=TCP localport=3000

# Allow outbound traffic on port 3000
netsh advfirewall firewall add rule name="Git-Captain-Outbound" dir=out action=allow protocol=TCP localport=3000

# Allow HTTPS traffic (port 443)
netsh advfirewall firewall add rule name="HTTPS-Inbound" dir=in action=allow protocol=TCP localport=443
netsh advfirewall firewall add rule name="HTTPS-Outbound" dir=out action=allow protocol=TCP localport=443
```

#### 5. Port Forwarding (Optional - Legacy Method)
**Note: This is a legacy approach. Modern deployments should use reverse proxies.**

**Prerequisites:**
- IPv6 must be enabled
- IP Helper service must be running

**Verify IPv6:**
```powershell
# Check IPv6 status
Get-NetAdapterBinding -ComponentID ms_tcpip6
```

**Configure Port Forwarding:**
```powershell
# Get your server's IP address
ipconfig

# Add port forwarding rule (replace YOUR_IP with actual IP)
netsh interface portproxy add v4tov4 listenport=443 listenaddress=YOUR_IP connectport=3000 connectaddress=YOUR_IP

# Verify the rule
netsh interface portproxy show all

# Enable IP Helper service
sc config iphlpsvc start= auto
sc start iphlpsvc

# Verify service is running
sc query iphlpsvc
```

**Remove Port Forwarding:**
```powershell
# Delete the rule if needed
netsh interface portproxy delete v4tov4 listenport=443 listenaddress=YOUR_IP
```

#### 6. Windows Service Setup (Production)
```powershell
# Install PM2 for process management
npm install -g pm2
npm install -g pm2-windows-service

# Setup PM2 as Windows service
pm2-service-install

# Start Git-Captain with PM2
cd C:\Git-Captain
pm2 start controllers/server.js --name "git-captain"
pm2 save
```

#### 7. Task Scheduler (Alternative to PM2)
Create a scheduled task to start Git-Captain on boot:

1. Open Task Scheduler
2. Create Task → General Tab:
   - Name: "Git-Captain Startup"
   - Run whether user is logged on or not
   - Run with highest privileges
   - Configure for: Windows Server 2016/2019/2022

3. Triggers Tab:
   - New → At startup
   - Enable the trigger

4. Actions Tab:
   - New → Start a program
   - Program: `C:\Git-Captain\nodeStartupPROD.bat`

5. Conditions Tab:
   - Uncheck power conditions

6. Settings Tab:
   - Allow task to be run on demand
   - Do not start new instance if already running

---

## Linux Server Deployment

### Ubuntu/Debian Installation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Clone repository
git clone https://github.com/ConfusedDeer/Git-Captain.git
cd Git-Captain

# Install dependencies
npm install

# Generate SSL certificates
sudo apt install openssl -y
openssl req -nodes -new -x509 -keyout controllers/theKey.key -out controllers/theCert.cert
```

### CentOS/RHEL Installation
```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs npm git openssl -y

# Follow same steps as Ubuntu for cloning and setup
```

### Firewall Configuration (Linux)
```bash
# UFW (Ubuntu)
sudo ufw allow 3000
sudo ufw allow 443
sudo ufw enable

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload

# iptables (Direct)
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

### Systemd Service (Linux)
```bash
# Create service file
sudo tee /etc/systemd/system/git-captain.service > /dev/null <<EOF
[Unit]
Description=Git-Captain Node.js Application
After=network.target

[Service]
Type=simple
User=gitcaptain
WorkingDirectory=/opt/Git-Captain
ExecStart=/usr/bin/node controllers/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Create user and setup permissions
sudo useradd -r -s /bin/false gitcaptain
sudo chown -R gitcaptain:gitcaptain /opt/Git-Captain

# Enable and start service
sudo systemctl enable git-captain
sudo systemctl start git-captain
sudo systemctl status git-captain
```

---

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S gitcaptain -u 1001

# Change ownership
RUN chown -R gitcaptain:nodejs /app
USER gitcaptain

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f https://localhost:3000/health || exit 1

# Start application
CMD ["node", "controllers/server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  git-captain:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - controllers/.env
    volumes:
      - ./controllers/theKey.key:/app/controllers/theKey.key:ro
      - ./controllers/theCert.cert:/app/controllers/theCert.cert:ro
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "https://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - git-captain
    restart: unless-stopped
```

---

## Reverse Proxy Configuration

### Nginx Configuration
```nginx
upstream git-captain {
    server localhost:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy Configuration
    location / {
        proxy_pass https://git-captain;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files
    location /static/ {
        proxy_pass https://git-captain;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/cert.pem
    SSLCertificateKeyFile /etc/ssl/private/key.pem
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256
    
    # Security Headers
    Header always set Strict-Transport-Security "max-age=63072000"
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    
    # Proxy Configuration
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / https://localhost:3000/
    ProxyPassReverse / https://localhost:3000/
    
    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "wss://localhost:3000/$1" [P,L]
</VirtualHost>
```

---

## Cloud Platform Deployment

### AWS Deployment
```yaml
# docker-compose.aws.yml
version: '3.8'

services:
  git-captain:
    image: your-ecr-repo/git-captain:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    secrets:
      - github_client_id
      - github_client_secret
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

secrets:
  github_client_id:
    external: true
  github_client_secret:
    external: true
```

### Azure App Service
```json
{
  "name": "git-captain",
  "type": "Microsoft.Web/sites",
  "properties": {
    "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', 'git-captain-plan')]",
    "httpsOnly": true,
    "siteConfig": {
      "nodeVersion": "18-lts",
      "appSettings": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "GITHUB_ORG_NAME",
          "value": "[parameters('githubOrgName')]"
        }
      ]
    }
  }
}
```

### Google Cloud Run
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: git-captain
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/execution-environment: gen2
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/git-captain
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        resources:
          limits:
            memory: "512Mi"
            cpu: "1000m"
```

---

## SSL Certificate Management

### Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Custom Certificate Authority
```bash
# Generate CA private key
openssl genrsa -out ca-key.pem 4096

# Generate CA certificate
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

# Generate server private key
openssl genrsa -out server-key.pem 4096

# Generate server certificate signing request
openssl req -subj "/CN=your-domain.com" -sha256 -new -key server-key.pem -out server.csr

# Generate server certificate
openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -out server-cert.pem -CAcreateserial
```

---

## Monitoring & Logging

### Application Monitoring
```javascript
// Add to server.js for health checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/metrics', (req, res) => {
  res.status(200).json({
    requests_total: requestCount,
    errors_total: errorCount,
    response_time_avg: averageResponseTime
  });
});
```

### Log Rotation (Linux)
```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/git-captain > /dev/null <<EOF
/opt/Git-Captain/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 gitcaptain gitcaptain
    postrotate
        systemctl reload git-captain
    endscript
}
EOF
```

### Prometheus Monitoring
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'git-captain'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 30s
```

---

## Security Considerations

### Environment Variables
- Store sensitive data in encrypted key management systems
- Use different certificates for different environments
- Implement proper secret rotation

### Network Security
- Use private networks where possible
- Implement proper firewall rules
- Consider VPN access for administrative interfaces

### Application Security
- Regular dependency updates
- Security scanning in CI/CD pipeline
- Proper error handling to avoid information leakage

---

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process using port 3000
sudo lsof -i :3000
sudo netstat -tulpn | grep :3000

# Kill process
sudo kill -9 <PID>
```

**SSL Certificate Issues:**
```bash
# Verify certificate
openssl x509 -in controllers/theCert.cert -text -noout

# Test SSL connection
openssl s_client -connect localhost:3000
```

**Permission Issues:**
```bash
# Fix file permissions
sudo chown -R gitcaptain:gitcaptain /opt/Git-Captain
sudo chmod 600 controllers/.env
sudo chmod 600 controllers/theKey.key
```

### Log Analysis
```bash
# View application logs
tail -f logs/git-captain-$(date +%Y-%m-%d).log

# View system logs
sudo journalctl -u git-captain -f

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

For additional support or questions about enterprise deployment, please refer to the main project documentation or create an issue in the GitHub repository.
