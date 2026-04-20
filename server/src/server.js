require('dotenv').config();
const app = require('./app');

// Explicitly use 4000 for the backend to avoid conflicts with Next.js (3000)
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('--- Ballroom Studio PRO (Academic Edition) ---');
  console.log(`Backend running at: http://localhost:${port}`);
  console.log('Architecture: API-ABL-Util');
  console.log('Auth: Passport + JWT + Bcrypt');
  console.log('----------------------------------------------');
});
