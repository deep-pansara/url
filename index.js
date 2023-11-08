const express = require("express");
const shortid = require("shortid");

const app = express();
app.use(express.json());

// Store mappings between short and long URLs
const urlMap = new Map();

// Route to shorten a URL
app.post("/shorten", (req, res) => {
  const { longUrl } = req.body;
  const shortCode = shortid.generate();
  urlMap.set(shortCode, longUrl);
  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}` });
});

// Route to redirect to the original URL
app.get("/:shortCode", (req, res) => {
  const longUrl = urlMap.get(req.params.shortCode);
  if (longUrl) {
    res.redirect(301, longUrl); // 301 Moved Permanently
  } else {
    res.status(404).send("URL not found");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
