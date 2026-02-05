Muhammad Baba Muhammad
email: Muhammadmeek2@gmail.com
linkdln:www.linkedin.com/in/muhammad-baba-715787246
# PropertyQuest - AWS Cloud Infrastructure Deployment


- **Health Monitoring**: ALB health checks and CloudWatch integration
- **Security**: Security groups, VPC configuration, and access control

### Infrastructure Comparison
| Aspect | Original (Vercel) | AWS Infrastructure |
|--------|-------------------|--------------------|
| **Deployment** | ✅ Serverless/Managed | 🔧 Custom Infrastructure |
| **Scalability** | ✅ Automatic | 🔧 Auto Scaling Groups |
| **Control** | ⚠️ Platform Limited | ✅ Full Infrastructure Control |
| **Learning** | ⚠️ Platform-specific | ✅ Cloud Architecture Skills |
| **Cost** | ✅ Free Tier | 💰 Resource-based Pricing |

##  Project Structure

```
property-quest/
├── propertyquestclient/     # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable components
│   │   └── lib/           # Utilities and configs
│   └── package.json
├── properQuestServer/       # Node.js Backend API
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   └── config/        # Configuration files
│   └── package.json
└── property-admin/         # Admin Dashboard
    ├── app/
    └── components/
```

##  Infrastructure Setup

### AWS Services Configuration

1. **VPC & Networking**
```bash
# VPC with public/private subnets across multiple AZs
# Internet Gateway and Route Tables
# Security Groups for web and database tiers
```

2. **EC2 & Auto Scaling**
```bash
# Launch Template with Ubuntu 22.04
# Auto Scaling Group across us-east-1b, us-east-1d, us-east-1e
# Target capacity: 1-3 instances based on demand
```

3. **Load Balancer & DNS**
```bash
# Application Load Balancer with SSL termination
# Route 53 hosted zone configuration
# Custom domain: propertyquest.hkhofficial.xyz
```

### Application Deployment

1. **Server Configuration**
```bash
# Install Node.js, nginx, PM2
sudo apt update && sudo apt install nodejs npm nginx -y
npm install -g pm2

# Configure nginx reverse proxy
sudo nano /etc/nginx/sites-available/propertyquest
```

2. **Process Management**
```bash
# PM2 ecosystem for application lifecycle
pm2 start ecosystem.config.json
pm2 save && pm2 startup
```

## 🌟 Key Achievements

- ✅ **AWS Infrastructure Design** - Architected complete cloud infrastructure from scratch
- ✅ **High Availability Setup** - Multi-AZ deployment with Auto Scaling Groups
- ✅ **Load Balancer Configuration** - ALB with health c[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://propertyquest.vercel.app/)
[![AWS Demo](https://img.shields.io/badge/AWS-Infrastructure-orange)](https://propertyquest.hkhofficial.xyz)
[![Infrastructure](https://img.shields.io/badge/Infrastructure-AWS-yellow)](https://aws.amazon.com/)
[![DevOps](https://img.shields.io/badge/DevOps-Production-blue)](https://github.com/)

> DevOps and cloud infrastructure deployment of a real estate marketplace. Demonstrates AWS cloud architecture, auto-scaling, load balancing, and production deployment practices.

##  Live Demos
**Original Application (Vercel):** [https://propertyquest.vercel.app/](https://propertyquest.vercel.app/)
**AWS Infrastructure Deployment:** [https://propertyquest.hkhofficial.xyz](https://propertyquest.hkhofficial.xyz)

##  Project Overview

This project demonstrates cloud infrastructure and DevOps skills by deploying an existing real estate application to AWS. The focus is on:

- **AWS Infrastructure Setup**: Complete cloud architecture with high availability
- **Production Deployment**: SSL, custom domains, process management
- **DevOps Practices**: nginx configuration, PM2, health checks, monitoring

##  Tech Stack

### Frontend
- **Next.js 15.2.6** - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Backend language
- **Express.js** - Web framework
- **MySQL** - Primary database
- **JWT** - Authentication

### DevOps & Infrastructure
- **AWS EC2** - Compute instances
- **Application Load Balancer** - Traffic distribution
- **Auto Scaling Group** - High availability
- **Route 53** - DNS management
- **Nginx** - Reverse proxy
- **PM2** - Process management

### Additional Services
- **Memcached** - Caching layer
- **RabbitMQ** - Message queue
- **Cloudinary** - Image management

##  Architecture

```
Internet → Route 53 → ALB → EC2 Instances
                              ├── Nginx (Port 80)
                              ├── Next.js Frontend (Port 3000)
                              └── Node.js API (Port 8080)
```

## ✨ Features

-    **Property Search** - Advanced filtering and search capabilities
-    **Property Listings** - Detailed property information with images
-    **User Authentication** - Secure login/registration system
-    **Responsive Design** - Mobile-first approach
-    **Property Categories** - Buy, Rent, Commercial properties
-    **Market Insights** - Property market analysis
-    **Agent Profiles** - Real estate agent listings
-    **Agency Management** - Property agency features

## 🚀 Infrastructure & Deployment

### AWS Cloud Architecture
- **High Availability**: Multi-AZ deployment across us-east-1
- **Load Balancing**: Application Load Balancer with health checks
- **Auto Scaling**: Auto Scaling Groups for fault tolerance
- **DNS Management**: Route 53 with custom domain configuration
- **SSL/TLS**: Certificate management and HTTPS enforcement

### DevOps Implementation
- **Reverse Proxy**: nginx configuration for traffic routing
- **Process Management**: PM2 for Node.js application lifecycle
- **Service Discovery**: Internal DNS for microservices communicationhecks and SSL termination
- ✅ **DNS & Domain Management** - Route 53 configuration with custom domain
- ✅ **Production Deployment** - nginx reverse proxy and PM2 process management
- ✅ **Security Implementation** - VPC, security groups, and SSL certificate management
- ✅ **Monitoring & Health Checks** - CloudWatch integration and application monitoring
- ✅ **DevOps Best Practices** - Infrastructure automation and deployment strategies

## Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)

### Property Search
![Property Search](./screenshots/propertyquest-search.png)



## DevOps Engineer

Muhammad Baba  - Cloud & DevOps Engineer
- Portfolio: 
- LinkedIn: [linkedin.com/in/muhammadbaba](https://linkedin.com/in/muhammadbaba)
- Email: muhammadmeek2@gmail.com

### Infrastructure Skills Demonstrated:
- AWS Cloud Architecture (EC2, ALB, ASG, Route 53)
- nginx Reverse Proxy Configuration
- PM2 Process Management
- SSL Certificate Management
- DNS & Domain Configuration
- High Availability & Auto Scaling
- Security Groups & VPC Configuration
- S3 bucket

⭐ **Star this repository if you found it helpful!**
