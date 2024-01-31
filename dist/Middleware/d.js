'use strict';

var _require = require('@aws-sdk/client-s3'),
    S3Client = _require.S3Client,
    PutObjectCommand = _require.PutObjectCommand;

var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');

var s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});
var s3BucketName = process.env.BUCKET_NAME;

var s3Storage = multerS3({
  s3: s3,
  bucket: s3BucketName,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function key(req, file, cb) {
    var destination = req.destination;

    var allowedFiletypes = ['jpeg', 'jpg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'files'];
    var filename = file.originalname.toLowerCase();

    if (filename.split('.').length > 2) {
      return cb('Error: Files with multiple extensions are not allowed!');
    }

    var timestamp = Date.now();
    var originalExtension = path.extname(file.originalname).toLowerCase();
    var key = destination + '/' + file.fieldname + '-' + timestamp + originalExtension;
    var correctedKey = key.replace(/%2F/g, '/');

    if (allowedFiletypes.includes(originalExtension.replace('.', ''))) {
      return cb(null, correctedKey);
    } else {
      return cb('Error: Images, Videos, and PDFs Only!');
    }
  }

});

function checkFileType(file, cb) {
  var allowedFiletypes = ['jpeg', 'jpg', 'png', 'gif', 'pdf'];
  var extname = path.extname(file.originalname).toLowerCase().replace('.', '');

  var isScriptFile = ['.js', '.jsx', '.sh', '.bat', '.cmd', '.php', '.sql', '.py'].includes(extname);

  if (isScriptFile || !allowedFiletypes.includes(extname)) {
    return cb('Error: Images, Videos, and PDFs Only!');
  }

  return cb(null, true);
}

function createUploadMiddleware(destination) {
  var upload = multer({
    storage: s3Storage,
    limits: { fileSize: 1024 * 1024 * 500 },
    fileFilter: function fileFilter(req, file, cb) {
      checkFileType(file, cb);
    }
  }).fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }, { name: 'file', maxCount: 1 }]);

  return function (req, res, next) {
    req.destination = destination;

    var uploadType = req.query.uploadType || 'single';
    var uploadMethod = uploadType === 'single' ? 'single' : 'array';

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Error: File size exceeds the limit (500 MB)' });
        } else {
          return res.status(500).json({ message: 'Multer Error: ' + err.message });
        }
      } else if (err) {
        return res.status(500).json({ message: 'Error: ' + err });
      }
      next();
    });
  };
}

var demoUpload = createUploadMiddleware('demo1');
module.exports = { demoUpload: demoUpload };
//# sourceMappingURL=d.js.map