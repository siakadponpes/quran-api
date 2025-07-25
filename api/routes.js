const { Router } = require('express');

const { caching } = require('./middlewares');
const SurahHandler = require('./handlers/surah');
const JuzHandler = require('./handlers/juz');

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  next();
});

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Qur'an API</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to right, #1e3c72, #2a5298);
          color: #fff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container {
          text-align: center;
          padding: 2rem;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1rem;
          margin: 0.5rem 0;
        }
        code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 5px;
        }
        a {
          color: #ffd700;
          text-decoration: none;
        }
        .routes {
          margin-top: 2rem;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📖 Quran API</h1>
        <p>By Sutan Gading Fadhillah Nasution &lt;<a href="mailto:contact@gading.dev">contact@gading.dev</a>&gt;</p>
        <p>Source Code: <a href="https://github.com/gadingnst/quran-api" target="_blank">GitHub</a></p>
        <div class="routes">
          <h3>📌 Available Endpoints</h3>
          <p><code>GET /surah</code> – List all Surah</p>
          <p><code>GET /surah/18</code> – Specific Surah</p>
          <p><code>GET /surah/18/60</code> – Specific Ayah in Surah</p>
          <p><code>GET /juz/30</code> – Specific Juz</p>
        </div>
      </div>
    </body>
    </html>
  `);
});


router.get('/surah', caching, SurahHandler.getAllSurah);

router.get('/surah/:surah', caching, SurahHandler.getSurah);
router.get('/surah/:surah/:ayah', caching, SurahHandler.getAyahFromSurah);
router.get('/juz/:juz', caching, JuzHandler.getJuz);

// fallback router
router.all('*', (req, res) => res.status(404).send({
  code: 404,
  status: 'Not Found.',
  message: `Resource "${req.url}" is not found.`
}));

module.exports = router;
