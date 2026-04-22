const app = require('./app');
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('--- Ballroom Studio (Public Edition) ---');
  console.log(`Backend running at: http://localhost:${port}`);
  console.log('Architecture: API-ABL-Util (LMC Model)');
  console.log('Status: Operational / Submission Ready');
  console.log('-----------------------------------------');
});
