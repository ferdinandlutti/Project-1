const Images = require("./model");
const multer = require("multer");
const fs = require("file-system");

//=======================================================================
//==================== ⬇⬇⬇  MULTER SETTINGS ⬇⬇⬇ =========================
//=======================================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");
//=======================================================================
//==================== ⬇⬇⬇  MULTER SETTINGS END  ⬇⬇⬇ ====================
//=======================================================================
const upload_image = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
        // A Multer error occurred when uploading.
      } else if (err) {
        return res.status(500).json(err);
        // An unknown error occurred when uploading.
      }
      // here we can add filename or path to the DB
      console.log(
        `these could go to the DB: ${req.file.filename}, ${req.file.path}`
      );
      await Images.create({
        pathname: req.file.path,
        filename: req.file.filename,
      });
      return res.status(200).json({ ok: true, file: req.file });
      // Everything went fine.
    });
  } catch (error) {
    console.log("error =====>", error);
  }
};

const fetch_all_images = async (req, res) => {
  try {
    const images = await Images.find({});
    res.status(200).json({ images });
  } catch (error) {
    console.info("error =====>", error);
    res.status(500).json({ ok: false });
  }
};

const delete_image = async (req, res) => {
  const { _id, filename } = req.params;
  try {
    await Images.deleteOne({ _id });
    fs.unlink(`./files/${filename}`, (err) => {
      if (err) throw err;
      console.log(`./files/${filename} was deleted`);
      return res.status(200).json({ message: `${filename} was deleted` });
    });
  } catch (error) {
    console.log("error =====>", error);
  }
};

module.exports = {
  upload_image,
  fetch_all_images,
  delete_image,
};
