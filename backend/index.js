const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/uploads/");
  },
  filename: (req, file, cb) => {
    const tempFilename = Date.now() + path.extname(file.originalname);
    cb(null, tempFilename);
  },
});

const upload = multer({ storage: storage }).single("image");

// Upload Endpoint
app.post("/upload", upload, (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { contractAddress, tokenId } = req.body;
  if (!contractAddress || !tokenId) {
    return res.status(400).send("contractAddress and tokenId are required.");
  }

  // Original file path
  const oldPath = path.join("uploads", req.file.filename);

  // New directory and file path
  const newDir = path.join("uploads", contractAddress.toLowerCase());
  const newFilename = `${tokenId}${path.extname(
    req.file.originalname
  )}`.toLowerCase();
  const newPath = path.join(newDir, newFilename);

  // Ensure the directory exists
  fs.mkdir(newDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return res.status(500).send("Error processing file.");
    }

    // Rename and move the file
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).send("Error processing file.");
      }

      // Construct the image URL
      const imageUrl =
        `https://demotokenuri.fly.dev/uploads/${contractAddress.toLowerCase()}/${tokenId}${path.extname(
          req.file.originalname
        )}`.toLowerCase();

      // Additional attributes from the request body
      const attributes = Object.entries(req.body)
        .filter(
          ([key]) => !["image", "contractAddress", "tokenId"].includes(key)
        )
        .map(([key, value]) => ({ trait_type: key, value }));

      // Metadata construction
      const metadata = {
        name: `ESOV ${tokenId}`, // Consider making this dynamic
        description: "A description of your token", // Consider making this dynamic
        image: imageUrl,
        attributes,
      };

      // Metadata file path
      const metadataFilename = path
        .join(newDir, `${tokenId}.json`)
        .toLowerCase();

      // Write metadata to file
      fs.writeFile(
        metadataFilename,
        JSON.stringify(metadata, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing metadata:", err);
            return res.status(500).send("Error saving metadata.");
          }
          res.status(200).send("File and metadata uploaded successfully.");
        }
      );
    });
  });
});

app.get("/metadata/pfps/:contractAddress/:tokenId", (req, res) => {
  const { contractAddress, tokenId } = req.params;
  const metadataFilePath = path.join(
    "uploads",
    `${contractAddress}/${tokenId}.json`
  );

  fs.readFile(metadataFilePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).send("Metadata not found.");
      }
      console.error("Error reading metadata:", err);
      return res.status(500).send("Error retrieving metadata.");
    }
    res.json(JSON.parse(data));
  });
});

app.get("/metadata/single_image", (req, res) => {
  const metadata = {
    name: "Token Name",
    description: "A description of your token",
    image: "https://demotokenuri.fly.dev/uploads/single_image.png",
  };

  res.json(metadata);
});

app.get("/metadata/presets/:presetName", (req, res) => {
  const { presetName } = req.params;
  const metadata = {
    name: presetName,
    description: "A description of your token",
    image: `https://demotokenuri.fly.dev/uploads/presets/${presetName}.png`,
  };

  res.json(metadata);
});

app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
