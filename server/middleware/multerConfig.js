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
        cb(null, file.originalname)
    }
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"), false);
    }
  }
});
