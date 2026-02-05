# AWS Deployment Guide

## Infrastructure Overview

This document outlines the AWS infrastructure setup for PropertyQuest, demonstrating cloud architecture and DevOps practices.

## AWS Services Used

### Compute & Networking
- **EC2 Instances**: Ubuntu 22.04 LTS
- **Application Load Balancer**: Traffic distribution
- **Auto Scaling Group**: High availability
- **VPC**: Network isolation
- **Security Groups**: Firewall rules

### DNS & SSL
- **Route 53**: DNS management
- **ACM**: SSL certificate management

### Monitoring & Management
- **CloudWatch**: Monitoring and logging
- **Systems Manager**: Instance management

## Architecture Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Route 53  │───▶│     ALB      │───▶│   EC2 Instances │
│     DNS     │    │Load Balancer │    │   Auto Scaling  │
└─────────────┘    └──────────────┘    └─────────────────┘
                           │                      │
                           ▼                      ▼
                   ┌──────────────┐    ┌─────────────────┐
                   │ Target Group │    │     Nginx       │
                   │Health Checks │    │  Reverse Proxy  │
                   └──────────────┘    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Applications  │
                                    │ Frontend + API  │
                                    └─────────────────┘
```

## Deployment Steps

### 1. Infrastructure Setup
```bash
# Create VPC and subnets
# Configure security groups
# Launch EC2 instances
# Setup Application Load Balancer
# Configure Auto Scaling Group
```

### 2. Application Deployment
```bash
# Install Node.js and dependencies
sudo apt update
sudo apt install nodejs npm nginx -y
npm install -g pm2

# Deploy applications
git clone <repository>
cd property-quest
npm install
npm run build
pm2 start ecosystem.config.json
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name propertyquest.hkhofficial.xyz;
    
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Process Management
```bash
# PM2 ecosystem configuration
{
  "apps": [
    {
      "name": "propertyquest-api",
      "script": "npm",
      "args": "start",
      "cwd": "./properQuestServer",
      "env": {
        "NODE_ENV": "production",
        "PORT": "8080"
      }
    },
    {
      "name": "propertyquest-frontend",
      "script": "npm", 
      "args": "start",
      "cwd": "./propertyquestclient",
      "env": {
        "NODE_ENV": "production",
        "PORT": "3000"
      }
    }
  ]
}
```

## Security Considerations

### Network Security
- VPC with private subnets
- Security groups with minimal required ports
- ALB security group separate from EC2

### Application Security
- JWT authentication
- Environment variables for secrets
- HTTPS enforcement
- Input validation and sanitization

## Monitoring & Maintenance

### Health Checks
- ALB health checks on port 80
- Application-level health endpoints
- CloudWatch monitoring

### Backup Strategy
- Database backups
- Application code in version control
- Infrastructure as Code (planned)

## Cost Optimization

### Current Setup
- t3.micro instances for development
- On-demand pricing
- Auto Scaling for cost efficiency

### Recommendations
- Reserved Instances for production
- CloudFront CDN for static assets
- S3 for file storage

## Lessons Learned

1. **Infrastructure Planning**: Proper network design is crucial
2. **Process Management**: PM2 essential for production Node.js apps
3. **Health Checks**: Critical for auto-scaling reliability
4. **Security Groups**: Principle of least privilege
5. **Monitoring**: CloudWatch integration for production readiness


