const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy /api to your e-commerce backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000', // ecom-backend
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
}));

// Add more proxies here for other services (e.g., blog, tutorials)

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});