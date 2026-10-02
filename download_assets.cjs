const fs = require('fs');
const path = require('path');
const https = require('https');

const assets = [
  "/assets/img/uploads/logo-hemira-mark.png",
  "/assets/img/uploads/logo-hemira-full.png",
  "/assets/img/uploads/logo-hemira-white.png",
  "/assets/img/uploads/avatar-duo.svg",
  "/assets/img/uploads/hemira-illustration.svg",
  "/assets/img/uploads/avatar-jeanne.svg",
  "/assets/img/uploads/avatar-miriam.svg",
  "/assets/js/main.js",
  "/assets/css/style.css"
];

const baseUrl = "https://www.hemiraservices.com";

function download(assetPath) {
  return new Promise((resolve) => {
    const fullUrl = baseUrl + assetPath;
    const dest = path.join(__dirname, 'public', assetPath);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    https.get(fullUrl, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); console.log('Downloaded redirect:', assetPath); resolve(); });
        }).on('error', () => { console.error('Error redirect:', assetPath); resolve(); });
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => { file.close(); console.log('Downloaded:', assetPath); resolve(); });
      } else {
        console.error('Failed with code', response.statusCode, assetPath);
        resolve();
      }
    }).on('error', (err) => {
      console.error('Network error for', assetPath, err.message);
      resolve();
    });
  });
}

async function run() {
  for (const a of assets) {
    await download(a);
  }
  console.log('All downloads completed!');
}

run();
