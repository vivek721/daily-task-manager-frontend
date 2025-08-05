# Deployment Guide

This guide covers deployment options and CI/CD setup for the Daily Task Manager frontend.

## Quick Setup

### 1. Create GitHub Repository
```bash
# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/daily-task-manager-frontend.git
git branch -M main
git push -u origin main
```

### 2. Environment Variables

#### For Vercel Deployment
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_organization_id
VERCEL_PROJECT_ID=your_project_id
```

#### For Netlify Deployment
```bash
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

## Deployment Options

### Option 1: Vercel (Recommended)
Vercel provides excellent React/Vite support with zero configuration.

**Automatic Setup:**
1. Connect your GitHub repo to Vercel
2. Vercel auto-detects Vite configuration
3. Deploy automatically on every push to main

**Manual Setup with GitHub Actions:**
1. Get Vercel token from Vercel dashboard
2. Get Organization ID and Project ID from project settings
3. Add secrets to GitHub repository
4. Push to trigger deployment

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `20`

### Option 2: Netlify
Great alternative with similar features.

**Automatic Setup:**
1. Connect GitHub repo to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`

**Manual Setup with GitHub Actions:**
1. Uncomment `.github/workflows/netlify-deploy.yml`
2. Get Netlify token and site ID
3. Add secrets to GitHub repository

### Option 3: AWS S3 + CloudFront
For enterprise deployments requiring AWS infrastructure.

### Option 4: Docker Deployment
Use the existing Dockerfile for containerized deployments.

## CI/CD Pipeline Features

### Quality Checks
- **Multi-Node Testing**: Tests on Node.js 18, 20, and 22
- **TypeScript Compilation**: Ensures type safety
- **ESLint Validation**: Code quality and consistency
- **Security Audits**: Dependency vulnerability scanning
- **Bundle Analysis**: Performance monitoring

### Deployment Pipeline
- **Automatic Deployment**: Deploys main branch to production
- **Preview Deployments**: Creates preview environments for PRs
- **Build Caching**: Optimized build times with dependency caching
- **Artifact Storage**: Build artifacts stored for 30 days

### Performance Monitoring
- **Bundle Size Analysis**: Tracks bundle size changes
- **Build Time Monitoring**: Optimizes CI/CD performance
- **Dependency Updates**: Automated via Dependabot

## Environment Configuration

### Production Environment Variables
```bash
# Backend API URL (update vercel.json or netlify.toml)
VITE_API_URL=https://your-backend-api.com

# Google OAuth (if needed for client-side)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
```

## Custom Domain Setup

### Vercel
1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL automatically handled

### Netlify
1. Add domain in Netlify dashboard
2. Configure DNS records
3. SSL automatically handled

## Monitoring and Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring and performance
- **LogRocket**: Session recording and debugging

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review TypeScript compilation errors

**Deployment Issues:**
- Verify environment variables are set
- Check build logs for specific errors
- Ensure API endpoints are accessible

**Performance Issues:**
- Review bundle analysis results
- Optimize images and assets
- Implement code splitting

### Debug Commands
```bash
# Local debugging
npm run build        # Test production build
npm run preview      # Preview production build
npm run typecheck    # Check TypeScript errors
npm run lint         # Check code quality

# CI/CD debugging
# Check GitHub Actions logs
# Review deployment logs in hosting platform
```

## Security Considerations

### Content Security Policy
- Configured in netlify.toml
- Restricts resource loading
- Prevents XSS attacks

### Environment Variables
- Never commit secrets to repository
- Use GitHub Secrets for CI/CD
- Separate staging/production configs

### Dependencies
- Regular security audits via npm audit
- Automated updates via Dependabot
- Review security advisories

## Best Practices

### Code Quality
- Maintain high test coverage
- Follow TypeScript strict mode
- Use consistent code formatting
- Implement proper error boundaries

### Performance
- Optimize bundle size
- Implement lazy loading
- Use efficient state management
- Monitor Core Web Vitals

### Maintenance
- Regular dependency updates
- Monitor deployment metrics
- Review and update documentation
- Maintain backup strategies