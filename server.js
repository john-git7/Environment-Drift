require('dotenv').config();

const express = require('express');
const healthRouter = require('./routes/health');
const config = require('./config');

const app = express();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

app.use(express.json());

app.use('/health', healthRouter);

app.get('/auth-check', (req, res) => {
  const secret = config.jwt_secret;

  if (secret && secret.length > 0) {
    return res.json({ secret_configured: true });
  }

  return res.json({ secret_configured: false });
});

console.log('=== Environment Check ===');
console.log(`NODE_ENV: ${config.node_env}`);
console.log(`PORT: ${config.port}`);
console.log(`NODE_VERSION: ${process.version}`);
console.log('DATABASE_URL: SET');
console.log('JWT_SECRET: SET');

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.node_env}`);
});