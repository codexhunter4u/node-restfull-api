const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Set Image Storage
 */
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/./uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

/**
 * Upload documentation
 */
const upload = multer({
    storage : storage,
    fileFilter : (req, file, cb) => {
        checkFileType(file, cb);
    },
    limits: {
        fileSize: 2024 * 1024 * 5
    }
});

/**
 * Validate the file extention
 * 
 * @param {*} file 
 * @param {*} cb
 * 
 * @returns 
 */
function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Please images only.');
    }
}

module.exports = upload;
