const { promisify } = require('util');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const db = require('../../models');

const storage = new Storage({
  keyFilename: 'keys/storage-object-admin.json',
});
const bucket = storage.bucket('fitsync-user-photos');

const maxSize = 2 * 1024 * 1024; // 2MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('photo');

const uploadFile = promisify(upload);

async function photoAddController(req, res) {
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

    const splittedFileOriginalName = req.file.originalname.split('.');
    const fileExtension =
      splittedFileOriginalName[splittedFileOriginalName.length - 1];
    const fileName = `${req.user.id}.${fileExtension}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        cacheControl: 'private',
      },
    });

    blobStream.on('error', (error) => {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    });

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
      const newUser = await db.users.findByPk(req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'User photo successfully changed.',
        data: {
          user: {
            id: newUser.id,
            photoUrl: newUser.photoUrl,
          },
        },
      });
    });

    blobStream.end(req.file.buffer);

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

module.exports = [photoAddController];
