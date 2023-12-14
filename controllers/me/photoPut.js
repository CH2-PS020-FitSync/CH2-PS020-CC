const { promisify } = require('util');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const sharp = require('sharp');

const db = require('../../models');

let storage;

if (process.env.IS_LOCAL === 'true') {
  storage = new Storage({
    keyFilename: 'keys/main-api-cloud-run.json',
  });
} else {
  storage = new Storage();
}

const bucket = storage.bucket(process.env.USER_PHOTOS_BUCKET);

const maxSize = 2 * 1024 * 1024; // 2MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('photo');

const uploadFile = promisify(upload);

async function photoPutController(req, res) {
  try {
    await uploadFile(req, res);

    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please upload the photo.',
      });
    }

    const validMimeTypes = ['image/png', 'image/jpeg'];

    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Photo MIME type should be [image/png, image/jpeg].',
      });
    }

    const compressedBuffer = await sharp(req.file.buffer)
      .resize(256, 256)
      .jpeg({
        quality: 75,
        mozjpeg: true,
      })
      .toBuffer();

    const fileName = `${req.user.id}.jpg`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        cacheControl: 'private',
      },
    });

    blobStream.on('error', (error) =>
      res.status(500).json({
        status: 'error',
        message: error.message,
      })
    );

    blobStream.on('finish', async () => {
      const photoUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      if (req.user.photoUrl) {
        const splittedPrevPhotoUrl = req.user.photoUrl.split('/');
        const prevFileName =
          splittedPrevPhotoUrl[splittedPrevPhotoUrl.length - 1];

        if (prevFileName !== fileName) {
          await bucket.file(prevFileName).delete();
        }
      }

      await db.users.update({ photoUrl }, { where: { id: req.user.id } });
      const user = await db.users.findByPk(req.user.id);

      return res.status(200).json({
        status: 'success',
        message: "User's photo successfully changed.",
        user: {
          id: user.id,
          photoUrl: user.photoUrl,
        },
      });
    });

    blobStream.end(compressedBuffer);

    return true;
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        message: "Photo size can't be larger than 2MB.",
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
}

module.exports = [photoPutController];
