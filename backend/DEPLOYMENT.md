# End-to-End DevOps Deployment Guide
## Vercel Frontend + PocketBase Backend on Oracle Cloud (OCI) ARM VPS

This guide provides step-by-step instructions for deploying a production-ready, decoupled blog setup:
- **Frontend**: Hosted on Vercel or Netlify (Free Tier).
- **Backend**: PocketBase CMS running on Oracle Cloud Infrastructure (OCI) Free Tier ARM Ampere VPS via Docker.
- **SSL / Domain**: HTTPS via Nginx Reverse Proxy and Let's Encrypt (Certbot).

---

## Phase 1: Oracle Cloud Server & Firewall Setup

### Step 1: Configure OCI Security Lists (Ingress Rules)
By default, Oracle Cloud blocks all incoming traffic except SSH. You must enable HTTP (80) and HTTPS (443) in the OCI Web Console:

1. Log into **Oracle Cloud Console** -> **Networking** -> **Virtual Cloud Networks (VCN)**.
2. Select your VCN -> Click **Security Lists** -> Click **Default Security List for your VCN**.
3. Click **Add Ingress Rules** and add the following rules:

| Source CIDR | IP Protocol | Source Port | Destination Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| `0.0.0.0/0` | TCP | All | `80` | Allow HTTP traffic for Certbot / Web |
| `0.0.0.0/0` | TCP | All | `443` | Allow HTTPS encrypted traffic |
| `0.0.0.0/0` | TCP | All | `22` | SSH Access (Default) |

---

### Step 2: Configure Ubuntu OS Firewall (`iptables` / `ufw`)
Oracle Cloud Ubuntu images come with `iptables` pre-configured to drop incoming traffic. Run these terminal commands on your server:

```bash
# 1. Update OS package lists
sudo apt update && sudo apt upgrade -y

# 2. Allow ports 80, 443, and 8090 through OS iptables
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8090 -j ACCEPT

# 3. Save iptables rules permanently so they persist across server reboots
sudo netfilter-persistent save
```

---

### Step 3: Install Docker & Docker Compose on Ubuntu ARM64 (aarch64)

Run the official Docker installation script tailored for Ubuntu ARM64:

```bash
# Install required dependencies
sudo apt install -y curl ca-certificates gnupg lsb-release

# Install Docker engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group (run without sudo)
sudo usermod -aG docker $USER

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify Docker installation
docker --version
docker compose version
```

---

## Phase 2: PocketBase Docker Compose Configuration

### Step 1: Set Up Backend Directory Structure
Create a dedicated project directory on your server:

```bash
mkdir -p ~/pocketbase-backend && cd ~/pocketbase-backend
```

### Step 2: Create `docker-compose.yml`
Save the following `docker-compose.yml` file into `~/pocketbase-backend/docker-compose.yml`:

```yaml
version: '3.8'

services:
  pocketbase:
    image: ghcr.io/muchweb/pocketbase:latest
    container_name: pocketbase-cms
    restart: unless-stopped
    ports:
      # Bind to 127.0.0.1 so PocketBase is accessible via Nginx reverse proxy
      - "127.0.0.1:8090:8090"
    volumes:
      # Persistent volume mapping for SQLite database
      - ./pb_data:/pb/pb_data
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8090/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3
```

> 💡 **Data Security**: `./pb_data` stores your SQLite database (`data.db`), uploaded files, and admin keys. Because it is mounted to `./pb_data` on your host disk, all content persists safely across reboots and container upgrades.

### Step 3: Start PocketBase Container
```bash
docker compose up -d
```

Verify status:
```bash
docker compose ps
```

---

## Phase 3: SSL & Reverse Proxy Setup (HTTPS)

Modern web apps hosted on Vercel (`https://`) require all API endpoints to use secure HTTPS.

### Step 1: Configure DNS A Record
In your domain registrar (Cloudflare, Namecheap, GoDaddy, etc.):
- Add an **A Record**: `api.yourdomain.com` -> `YOUR_OCI_SERVER_PUBLIC_IP`.

---

### Step 2: Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

### Step 3: Obtain Let's Encrypt SSL Certificate
Run Certbot to request a free SSL certificate for your API subdomain:

```bash
sudo certbot certonly --standalone -d api.yourdomain.com
```

---

### Step 4: Configure Nginx Reverse Proxy
Create the Nginx site configuration file at `/etc/nginx/sites-available/pocketbase.conf`:

```bash
sudo nano /etc/nginx/sites-available/pocketbase.conf
```

Paste the following configuration (replace `api.yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;

        # WebSockets & Real-time Subscriptions support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Standard Proxy Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

### Step 5: Enable Nginx Site & Restart
```bash
# Enable configuration
sudo ln -s /etc/nginx/sites-available/pocketbase.conf /etc/nginx/sites-enabled/

# Test configuration syntax
sudo nginx -t

# Reload Nginx service
sudo systemctl reload nginx
```

---

### Step 6: Enable Auto-Renewal for SSL
Certbot automatically sets up a systemd timer. Test auto-renewal with:

```bash
sudo certbot renew --dry-run
```

---

## Phase 4: Frontend Integration & Deployment

### Step 1: Update Local Environment (`.env`)
In your local project root:

```env
VITE_POCKETBASE_URL=https://api.yourdomain.com
```

---

### Step 2: Configure Environment Variable on Vercel
1. Log into your **Vercel Dashboard** -> Select your project.
2. Go to **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_POCKETBASE_URL`
   - **Value**: `https://api.yourdomain.com`
   - **Environments**: Production, Preview, Development
4. Save and click **Redeploy**.

---

### Step 3: Verify Live Connectivity
1. Open `https://api.yourdomain.com/_/` in your browser to access the PocketBase Admin Console.
2. Create your admin account and collection `posts` (as documented in `backend/README.md`).
3. Run the migration script locally to populate your remote database:
   ```bash
   POCKETBASE_URL=https://api.yourdomain.com ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yoursecret node scripts/migrate-md-to-pocketbase.js
   ```
4. Open your Vercel deployment URL — your blog will seamlessly render your posts directly from your OCI PocketBase backend over HTTPS!
