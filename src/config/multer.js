const multer = require('multer')

const storageType = multer.memoryStorage({})

module.exports = {
    limits: {
        
    },
    storage: storageType,
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'application/pdf'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error('Invalid file type.'))
        }
    }
}