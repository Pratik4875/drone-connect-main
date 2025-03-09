const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/"); // Save files temporarily in /tmp
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware to handle file uploads and convert to WebP
const uploadAndConvertImage = (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload error" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const inputPath = req.file.path; // Temporary uploaded file
      const outputFileName = `${uuidv4()}.webp`;
      const outputPath = path.join("tmp", outputFileName); // Save in /tmp directory

      // Convert to WebP and compress
      await sharp(inputPath)
        .webp({ quality: 80 }) // Adjust quality (0-100)
        .toFile(outputPath);

      // Delete the original uploaded file
      fs.unlinkSync(inputPath);

      // Attach the converted file path to the request object for further processing
      req.file.path = outputPath;
      req.file.filename = outputFileName;

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Image conversion error:", error);
      return res.status(500).json({ error: "Image conversion failed" });
    }
  });
};

const checkExistenceOfImageAndUpload = (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload error" });
        }

        if (!req.file) {
            next();
        }
        else{

            try {
                const inputPath = req.file.path; // Temporary uploaded file
                const outputFileName = `${uuidv4()}.webp`;
                const outputPath = path.join("tmp", outputFileName); // Save in /tmp directory

                // Convert to WebP and compress
                await sharp(inputPath)
                    .webp({ quality: 80 }) // Adjust quality (0-100)
                    .toFile(outputPath);

                // Delete the original uploaded file
                fs.unlinkSync(inputPath);

                // Attach the converted file path to the request object for further processing
                req.file.path = outputPath;
                req.file.filename = outputFileName;

                next(); // Proceed to the next middleware or route handler
            } catch (error) {
                console.error("Image conversion error:", error);
                return res.status(500).json({ error: "Image conversion failed" });
            }
        }
    });
};
module.exports = { uploadAndConvertImage, checkExistenceOfImageAndUpload };
