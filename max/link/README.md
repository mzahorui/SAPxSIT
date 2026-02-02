# CDS File Upload Server (CAP v9 Architecture)

A technically accurate, lightweight implementation of a one-time file upload system using SAP Cloud Application Programming Model (CAP) and Express.

## 🏗 Overall Architecture

The project follows a **Hybrid Middleware Pattern**. While it is a CAP application, it leverages the `bootstrap` event to inject custom Express middlewares (`multer`) and REST endpoints. This allows for specialized file handling (filesystem streaming) that bypasses the standard OData/CQN layer for efficiency and simplicity.

### Key Concepts

1.  **CAP Bootstrap Lifecycle**: The server uses `cds.on('bootstrap', ...)` to hook into the Express application instance before the CDS services are mounted. This is the recommended way to add custom routes or middlewares in CAP.
2.  **Tokens as Volatile State**: Unique tokens are stored in a server-side `Map`. This provides an in-memory, high-performance "One-Time-Pad" mechanism for link validation without needing a persistent database.
3.  **Multer Multipart Handling**: Uses `multer` for `multipart/form-data` parsing. It is configured with `diskStorage` to stream uploads directly to the filesystem, minimizing memory footprint for large files.
4.  **Vanilla Frontend**: Employs the "No-Build" philosophy for the frontend, using native `fetch` and `FormData` APIs.

---

## 📂 File Role Map

### Core Server & Configuration
- [package.json](package.json): Defines dependencies (`@sap/cds`, `express`, `multer`) and start scripts.
- [server.js](server.js): The entry point. It initializes the CDS server, manages the token lifecycle, configures `multer` for disk storage, and implements the Link/Upload REST API.

### Service Layer (CAP)
- [srv/service.cds](srv/service.cds): The CDS model definition. In this project, it provides a minimal service layer to satisfy the CAP runtime requirements.
- [srv/service.js](srv/service.js): The implementation logic for the CDS service (e.g., the `ping` function).

### Frontend (Static Assets)
- [public/index.html](public/index.html): The **Link Generator** page. It consumes the `/api/link` endpoint to create and display a unique upload URL.
- [public/upload.html](public/upload.html): The **File Uploader** page. It extracts the token from the URL query parameters, validates it via `/api/link/:token`, and performs the `POST` upload.

### Storage
- [uploads/](uploads/): The destination directory for uploaded files. Filenames are prepended with a timestamp to prevent collisions.

---

## 🛠 Flow Analysis

1.  **Generation**: User clicks "Generate" -> Server creates a 16-byte hex token -> Token is mapped to an expiry timestamp -> JSON response returned with the full URL.
2.  **Validation**: Upload page loads -> JS calls `GET /api/link/:token` -> Server checks if token exists and is not expired.
3.  **Upload**: User selects file -> JS sends `POST /api/upload/:token` -> `multer` streams file to disk -> Server deletes the token from the `Map` (enforcing one-time use) -> Response confirms storage.

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Start the server: `npm start` (Runs on port 4004 by default)
3. Visit `http://localhost:4004`
