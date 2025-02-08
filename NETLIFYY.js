/*******************************************************
 * server.js
 *
 * Run:
 *   node server.js
 *
 * Then POST to /deploy with JSON:
 *   { "url": "https://some-website-that-returns-html.com" }
 *******************************************************/

require("dotenv").config();
const express = require("express");
const bodyParser = require("express").json; // or use express.json directly
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const AdmZip = require("adm-zip");

const app = express();
const PORT = 3000;

// Use JSON parser middleware
app.use(bodyParser());

// 1) Read env variables
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;

if (!NETLIFY_AUTH_TOKEN) {
  console.error("ERROR: Missing NETLIFY_AUTH_TOKEN in .env");
  process.exit(1);
}

// Decide which Netlify endpoint to use
const netlifyUrl = NETLIFY_SITE_ID
  ? `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`
  : `https://api.netlify.com/api/v1/sites`;

console.log("Netlify endpoint:", netlifyUrl);

/**
 * POST /deploy
 * Body: { "url": "https://some-html-endpoint" }
 */
app.post("/deploy", async (req, res) => {
  try {
    // 2) Extract the URL from req.body
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing 'url' in request body." });
    }

    // 3) Fetch the HTML from the given URL
    const response = await axios.get(url);
    if (typeof response.data !== "string") {
      return res
        .status(400)
        .json({ error: "The requested URL did not return raw HTML content." });
    }

    // 4) Create/ensure the build folder
    const buildDir = path.join(__dirname, "build");
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir);
    }

    // 5) Write the HTML to build/index.html
    const htmlFilePath = path.join(buildDir, "index.html");
    fs.writeFileSync(htmlFilePath, response.data, "utf8");

    // 6) Zip the build folder (in memory)
    const zip = new AdmZip();
    zip.addLocalFolder(buildDir);
    const zipBuffer = zip.toBuffer();

    // 7) Deploy the zip to Netlify
    const deployResp = await axios.post(netlifyUrl, zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
      },
    });

    const deployData = deployResp.data;
    // Common fields:
    // - deploy_url (preview URL)
    // - url (site domain if newly created)
    // - admin_url
    // - ssl_url
    // etc.

    // 8) Send success response
    return res.json({
      message: "Deployment success!",
      netlifyData: deployData,
      previewUrl: deployData.deploy_url || null,
      siteUrl: deployData.url || null,
    });
  } catch (error) {
    console.error("ERROR deploying to Netlify:", error.response?.data || error);
    return res.status(500).json({
      error: "Deployment failed",
      details: error.response?.data || error.message || error,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
