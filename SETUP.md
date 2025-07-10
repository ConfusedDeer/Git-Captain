# Git-Captain Setup Guide

> **📚 Note**: This is a quick setup guide. For comprehensive installation instructions, see [README.md](README.md). For enterprise deployment, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Quick Setup (Updated July 2025)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ConfusedDeer/Git-Captain.git
   cd Git-Captain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `controllers` directory:
   ```env
   client_id=your_github_client_id
   client_secret=your_github_client_secret
   GITHUB_ORG_NAME=your_organization_name
   PORT=3000
   GIT_PORT_ENDPOINT=https://your-domain.com
   privateKeyPath=./theKey.key
   certificatePath=./theCert.cert
   ```
   - Option B: Edit the `.env` file directly with your values

4. **Start the application**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `client_id` | GitHub OAuth Client ID | ✅ | `abc123def456` |
| `client_secret` | GitHub OAuth Client Secret | ✅ | `xyz789uvw012` |
| `GITHUB_ORG_NAME` | Your GitHub organization/username | ✅ | `ConfusedDeer` |
| `GIT_PORT_ENDPOINT` | Your server URL | ✅ | `https://your-server.com` |
| `PORT` | Server port | ❌ | `3000` |
| `privateKeyPath` | SSL private key path | ✅ | `./controllers/theKey.key` |
| `certificatePath` | SSL certificate path | ✅ | `./controllers/theCert.cert` |

## Development vs Production

### Development
```bash
NODE_ENV=development
GIT_PORT_ENDPOINT=https://localhost:3000
```

### Production
```bash
NODE_ENV=production
GIT_PORT_ENDPOINT=https://your-production-server.com
```

## Security Notes

- Never commit `.env` files to version control
- Keep your GitHub OAuth credentials secure
- Use environment-specific configurations for different deployments
