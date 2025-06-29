// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// export const upload = multer({ storage });

import multer from 'multer'

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null, "./public/temp")
    },
    filename : function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    fieldSize: 10 * 1024 * 1024, // 10MB max field size
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, and common document formats
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Please upload images, PDFs, or documents.`), false);
    }
  }
});

// Error handling for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum file size is 50MB.',
        error: 'FileSizeLimitExceeded'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.',
        error: 'FileCountLimitExceeded'
      });
    }
    if (err.code === 'LIMIT_FIELD_COUNT') {
      return res.status(413).json({
        success: false,
        message: 'Too many form fields.',
        error: 'FieldCountLimitExceeded'
      });
    }
  }
  
  if (err.message && err.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: err.message,
      error: 'InvalidFileType'
    });
  }
  
  next(err);
};
