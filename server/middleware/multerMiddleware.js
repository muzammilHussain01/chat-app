const multer = require("multer");

/*
|--------------------------------------------------------------------------
| Multer Memory Storage
|--------------------------------------------------------------------------
| File is kept in RAM temporarily
| Then controller stores it in MongoDB GridFS
*/
const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    }
});

module.exports = uploadAvatar;
