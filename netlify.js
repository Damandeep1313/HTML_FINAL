/*******************************************************
 * deployFileToNetlify.js
 *
 * 1) INSTALL:
 *    npm install dotenv axios adm-zip
 *
 * 2) ENV FILE (.env):
 *    NETLIFY_AUTH_TOKEN=...
 *    NETLIFY_SITE_ID=...
 *
 * 3) RUN:
 *    node deployFileToNetlify.js
 *******************************************************/

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const axios = require("axios");

// 1) Retrieve env variables
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;

// Check for missing env
if (!NETLIFY_AUTH_TOKEN || !NETLIFY_SITE_ID) {
  console.error("ERROR: Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID in .env");
  process.exit(1);
}

// 2) Set the HTML file path (provided path)
const filePath = "/Users/damandeepsinghsatija/Desktop/html generator/index.html";

// 3) Attempt to read the file
const absolutePath = path.resolve(filePath);
console.log(`Reading file from: ${absolutePath}`);

let fileData;
try {
  fileData = fs.readFileSync(absolutePath, "utf-8");
} catch (err) {
  console.error("ERROR reading file:", err);
  process.exit(1);
}

console.log(`File read successfully. Length: ${fileData.length} chars`);

// 4) Zip the file in memory
const zip = new AdmZip();
zip.addFile("index.html", Buffer.from(fileData, "utf8"));
const zipBuffer = zip.toBuffer();

console.log(`Zipped file in-memory. Size: ${zipBuffer.length} bytes`);

// 5) Prepare Netlify API request
const netlifyUrl = `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`;
console.log(`Deploying to Netlify site ID: ${NETLIFY_SITE_ID}`);

// 6) POST the zip to Netlify
axios
  .post(netlifyUrl, zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
    },
  })
  .then((response) => {
    const deployUrl = response.data.deploy_url || response.data.url;
    console.log("Deployment success!");
    console.log("Netlify Deploy URL:", deployUrl);
  })
  .catch((error) => {
    console.error("ERROR deploying to Netlify:\n", error.response?.data || error);
    process.exit(1);
  });
