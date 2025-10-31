---
type: lesson
title: Deployment
---

# Deployment

Learn how to deploy your application to production.

## Deployment Strategies

### Static Hosting

Deploy to platforms like Vercel, Netlify, or Cloudflare Pages.

```bash
npm run build
npm run deploy
```

### Self-Hosted

Set up your own server with Docker.

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

## Environment Variables

Configure your environment:

```env
API_URL=https://api.example.com
SECRET_KEY=your-secret-key
```
