require('dotenv').config();
require('express-async-errors');

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const path         = require('path');

const routes       = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger       = require('./middlewares/logger');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // ── Static uploads ────────────────────────────────────────────────────────────
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // ── API Routes ────────────────────────────────────────────────────────────────
    app.use('/api', routes);

    // ── Health Check ──────────────────────────────────────────────────────────────
    app.get('/health', (req, res) => {
      res.json({
          status:    'OK',
              app:       'KSU Procurement System',
                  timestamp: new Date().toISOString(),
                    });
                    });

                    // ── 404 Handler ───────────────────────────────────────────────────────────────
                    app.use((req, res) => {
                      res.status(404).json({ success: false, message: 'Route not found' });
                      });

                      // ── Global Error Handler ──────────────────────────────────────────────────────
                      app.use(errorHandler);

                      // ── Start Server ──────────────────────────────────────────────────────────────
                      app.listen(PORT, () => {
                        logger.info(`🚀 KSU Procurement API running on http://localhost:${PORT}`);
                          logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
                          });

                          module.exports = app;