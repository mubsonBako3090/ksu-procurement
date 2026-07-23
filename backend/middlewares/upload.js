const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
    filename:    (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${unique}${path.extname(file.originalname)}`);
              },
              });

              const fileFilter = (req, file, cb) => {
                const allowed = /jpeg|jpg|png|pdf|doc|docx/;
                  const isValid = allowed.test(
                      path.extname(file.originalname).toLowerCase()
                        );
                          isValid
                              ? cb(null, true)
                                  : cb(new Error('Only images and documents are allowed'));
                                  };

                                  module.exports = multer({
                                    storage,
                                      fileFilter,
                                        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
                                        });