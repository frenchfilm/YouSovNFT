# Express.js Server for File Upload(Image upload), Metadata Management, and Persistent Storage

This comprehensive documentation provides an overview of an Express.js server designed for handling file uploads, metadata management, and managing predefined images with persistent storage. The server uses `multer` for file handling, `cors` for cross-origin resource sharing, and `fs` and `path` modules for file system operations.

## Features

- **File Upload Handling**: Utilizes `multer` for handling `multipart/form-data`.
- **Dynamic File Renaming and Directory Creation**: Based on token data (contract address and token ID) for Generative pfps
- **Metadata File Creation and Retrieval**: Generates and serves metadata for tokens.
- **Serving Static Files**: From the `uploads` directory.
- **CORS Enabled**: For cross-origin requests.
- **Persistent Storage**: Uses a volume mount for storing files persistently.
- **Predefined Images Management**: Handles a set of predefined images stored in an `initUploads` directory.

## Endpoints

### POST /upload

Uploads an image file and creates associated metadata.

#### Request

- **Form Data**
  - `image`: The image file to be uploaded.
  - `contractAddress`: The contract address associated with the token.
  - `tokenId`: The unique token ID.
  - Additional form data will be included as attributes in the metadata.

#### Response

- **200 OK**: File and metadata uploaded successfully.
- **400 Bad Request**: If `contractAddress`, `tokenId`, or the file is missing.
- **500 Internal Server Error**: On server-side errors like file processing issues.

### GET /metadata/pfps/:contractAddress/:tokenId

Retrieves metadata for a generative PFP NFT.

#### Parameters

- `contractAddress`: The contract address associated with the token.
- `tokenId`: The unique token ID.

#### Response

- **200 OK**: Returns the requested metadata in JSON format.
- **404 Not Found**: If metadata file does not exist.
- **500 Internal Server Error**: On server-side errors like file reading issues.

### GET /metadata/single_image

Provides metadata for a single, predefined image.

#### Response

- **200 OK**: Returns metadata in JSON format.

### GET /metadata/presets/:presetName

Provides metadata for preset images.

#### Parameters

- `presetName`: The name of the preset image.

#### Response

- **200 OK**: Returns metadata in JSON format.

### Static File Serving

- **Route**: `/uploads`
- Serves files stored in the `uploads` directory.

## Initialization Process

Upon server startup, predefined images from the `initUploads` directory are moved to the `uploads` directory for persistent storage.

### Directory Structure

```
initUploads/
├── presets/
│   ├── image1.png
│   ├── image2.png
│   ├── image3.png
│   ├── image4.png
│   └── image5.png
└── single_image.png
```

### Implementation

- SSH into the console and move the files from initUploads to uploads (volume mount)

```bash
fly ssh console
mv initUploads/* uploads/
```

## Configuration

- **Port**: Defaults to `3000`.
- **Multer Storage**: Configured to store files in `/app/uploads/`.
- **CORS**: Enabled for all routes.

## Dependencies

- `express`: Web framework for node.
- `multer`: Middleware for handling `multipart/form-data`.
- `fs`: File system module for file operations.
- `path`: Utilities for handling and transforming file paths.
- `cors`: Middleware to enable CORS.

## Environment

- Node.js environment with required dependencies installed.

## Usage

1. **Starting the Server**: Run the server script. It listens on the defined port.
2. **Uploading Files**: Send a POST request to `/upload` with the required data.
3. **Fetching Metadata**: Access metadata by making GET requests to the provided endpoints.
4. **Server Initialization**: On startup, it moves predefined images from `initUploads` to `uploads`.

## Note

- Ensure that the `initUploads` directory is correctly populated with the predefined images before starting the server.
- The server requires appropriate permissions to read from `initUploads` and write to `uploads`.

---
