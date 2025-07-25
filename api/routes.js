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
      <title>Qur'an API - Modern Islamic API Service</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          overflow-x: hidden;
          line-height: 1.6;
        }

        /* Animated background particles */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }

        .container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Hero Section */
        .hero {
          text-align: center;
          margin-bottom: 4rem;
          animation: fadeInUp 1s ease-out;
        }

        .logo {
          font-size: 4rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { text-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
          to { text-shadow: 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 215, 0, 0.3); }
        }

        h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #ffd700, #fff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 600px;
        }

        /* Author Info */
        .author-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .author-link {
          color: #ffd700;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 25px;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .author-link:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: #ffd700;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
        }

        /* API Endpoints Cards */
        .endpoints-container {
          width: 100%;
          max-width: 800px;
        }

        .endpoints-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .endpoints-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .endpoint-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .endpoint-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .endpoint-card:hover::before {
          left: 100%;
        }

        .endpoint-card:hover {
          transform: translateY(-10px) scale(1.02);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .endpoint-method {
          display: inline-block;
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .endpoint-path {
          font-family: 'Fira Code', monospace;
          font-size: 1.1rem;
          color: #ffd700;
          margin-bottom: 0.5rem;
          word-break: break-all;
        }

        .endpoint-description {
          opacity: 0.8;
          font-size: 0.9rem;
        }

        /* Try it button */
        .try-button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          margin-top: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .try-button:hover {
          background: linear-gradient(45deg, #ee5a52, #ff6b6b);
          transform: scale(1.05);
        }

        /* Statistics */
        .stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 3rem 0;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 120px;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #ffd700;
          display: block;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Data Sources Section */
        .data-sources {
          width: 100%;
          max-width: 1000px;
          margin: 4rem 0;
        }

        .sources-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .source-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .source-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transition: left 0.5s;
        }

        .source-card:hover::before {
          left: 100%;
        }

        .source-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .source-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .source-header i {
          font-size: 1.5rem;
          color: #ffd700;
        }

        .source-header h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .source-description {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .source-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .source-note {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 10px;
          padding: 0.8rem;
          font-size: 0.8rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .source-note i {
          color: #ffc107;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .source-note span {
          opacity: 0.9;
          line-height: 1.4;
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 3rem;
          opacity: 0.7;
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .endpoint-card {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .source-card {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .source-card:nth-child(1) { animation-delay: 0.1s; }
        .source-card:nth-child(2) { animation-delay: 0.2s; }
        .source-card:nth-child(3) { animation-delay: 0.3s; }

        /* Responsive */
        @media (max-width: 768px) {
          .container { padding: 1rem; }
          .endpoints-grid { grid-template-columns: 1fr; }
          .sources-grid { grid-template-columns: 1fr; }
          .stats { gap: 1rem; }
          .author-info { flex-direction: column; }
        }

        /* Loading animation for try buttons */
        .loading {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <!-- Animated Background Particles -->
      <div class="particles" id="particles"></div>

      <div class="container">
        <!-- Hero Section -->
        <div class="hero">
          <div class="logo">📖</div>
          <h1>Quran API</h1>
          <p class="subtitle">
            Modern, fast, and reliable RESTful API service for accessing the Holy Quran. 
            Get verses, chapters, and more with simple HTTP requests.
          </p>
          
          <div class="author-info">
            <a href="mailto:contact@gading.dev" class="author-link">
              <i class="fas fa-envelope"></i>
              Sutan Gading Fadhillah Nasution
            </a>
            <a href="https://github.com/gadingnst/quran-api" target="_blank" class="author-link">
              <i class="fab fa-github"></i>
              Source Code
            </a>
          </div>
        </div>

        <!-- Statistics -->
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">114</span>
            <span class="stat-label">Surahs</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">6,236</span>
            <span class="stat-label">Verses</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">30</span>
            <span class="stat-label">Juz</span>
          </div>
        </div>

        <!-- API Endpoints -->
        <div class="endpoints-container">
          <h2 class="endpoints-title">
            <i class="fas fa-code"></i>
            API Endpoints
          </h2>
          
          <div class="endpoints-grid">
            <div class="endpoint-card" onclick="tryEndpoint('/surah')">
              <span class="endpoint-method">GET</span>
              <div class="endpoint-path">/surah</div>
              <div class="endpoint-description">
                Get a complete list of all 114 Surahs with their basic information including names in Arabic and English.
              </div>
              <button class="try-button">
                <i class="fas fa-play"></i>
                Try it now
              </button>
            </div>

            <div class="endpoint-card" onclick="tryEndpoint('/surah/18')">
              <span class="endpoint-method">GET</span>
              <div class="endpoint-path">/surah/{number}</div>
              <div class="endpoint-description">
                Retrieve a specific Surah with all its verses, translations, and detailed information.
              </div>
              <button class="try-button">
                <i class="fas fa-play"></i>
                Try with Surah 18
              </button>
            </div>

            <div class="endpoint-card" onclick="tryEndpoint('/surah/18/60')">
              <span class="endpoint-method">GET</span>
              <div class="endpoint-path">/surah/{surah}/{ayah}</div>
              <div class="endpoint-description">
                Get a specific verse (Ayah) from any Surah with its translation and detailed metadata.
              </div>
              <button class="try-button">
                <i class="fas fa-play"></i>
                Try Surah 18:60
              </button>
            </div>

            <div class="endpoint-card" onclick="tryEndpoint('/juz/30')">
              <span class="endpoint-method">GET</span>
              <div class="endpoint-path">/juz/{number}</div>
              <div class="endpoint-description">
                Access any of the 30 Juz (Para) with all verses included in that specific section.
              </div>
              <button class="try-button">
                <i class="fas fa-play"></i>
                Try Juz 30
              </button>
            </div>
          </div>
        </div>

        <!-- Data Sources -->
        <div class="data-sources">
          <h2 class="sources-title">
            <i class="fas fa-database"></i>
            Data Sources
          </h2>
          
          <div class="sources-grid">
            <div class="source-card">
              <div class="source-header">
                <i class="fas fa-cloud"></i>
                <h3>api.alquran.cloud</h3>
              </div>
              <div class="source-description">
                Complete Quran text, metadata for verses, and high-quality audio recitations from various reciters.
              </div>
              <div class="source-tags">
                <span class="tag">Quran Text</span>
                <span class="tag">Meta Verses</span>
                <span class="tag">Audio</span>
              </div>
            </div>

            <div class="source-card">
              <div class="source-header">
                <i class="fas fa-flag"></i>
                <h3>quran.kemenag.go.id</h3>
              </div>
              <div class="source-description">
                Official Indonesian translations and comprehensive tafsir (commentary) for all verses, available in both short and detailed formats.
              </div>
              <div class="source-tags">
                <span class="tag">ID Translation</span>
                <span class="tag">Tafsir Verses</span>
                <span class="tag">Short/Long</span>
              </div>
            </div>

            <div class="source-card">
              <div class="source-header">
                <i class="fas fa-book-open"></i>
                <h3>Al-Quran-ID-API</h3>
              </div>
              <div class="source-description">
                Indonesian tafsir for each Surah with comprehensive explanations and context.
              </div>
              <div class="source-tags">
                <span class="tag">ID Tafsir Surah</span>
              </div>
              <div class="source-note">
                <i class="fas fa-info-circle"></i>
                <span>Note: Revelation type for Surah 13 & 55 corrected to Medinan according to Sahih International data</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Built with ❤️ for the Muslim community worldwide</p>
          <p>Free to use • No rate limits • Open source</p>
        </div>
      </div>

      <script>
        // Create floating particles
        function createParticles() {
          const particlesContainer = document.getElementById('particles');
          const particleCount = 50;

          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
          }
        }

        // Try endpoint function
        function tryEndpoint(endpoint) {
          const button = event.target.closest('.endpoint-card').querySelector('.try-button');
          const icon = button.querySelector('i');
          
          // Add loading state
          icon.className = 'fas fa-spinner loading';
          button.innerHTML = '<i class="fas fa-spinner loading"></i> Loading...';
          
          // Simulate API call delay
          setTimeout(() => {
            window.open(window.location.origin + endpoint, '_blank');
            
            // Reset button
            setTimeout(() => {
              icon.className = 'fas fa-play';
              button.innerHTML = '<i class="fas fa-play"></i> Try it now';
            }, 1000);
          }, 500);
        }

        // Initialize particles when page loads
        document.addEventListener('DOMContentLoaded', createParticles);

        // Add smooth scrolling and interactive effects
        document.querySelectorAll('.endpoint-card').forEach(card => {
          card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
          });
          
          card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
          });
        });

        // Add click ripple effect
        document.querySelectorAll('.endpoint-card').forEach(card => {
          card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
              ripple.remove();
            }, 600);
          });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = \`
          @keyframes ripple {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        \`;
        document.head.appendChild(style);
      </script>
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
