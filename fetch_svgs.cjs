const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  'avatar-duo.svg',
  'hemira-illustration.svg',
  'avatar-jeanne.svg',
  'avatar-miriam.svg'
];

async function downloadOne(file) {
  return new Promise((resolve) => {
    const url = `https://www.hemiraservices.com/assets/img/uploads/${file}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.hemiraservices.com/',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin'
      }
    };
    https.get(url, options, (res) => {
      console.log(file, 'Status:', res.statusCode);
      if (res.statusCode === 200) {
        const dest = path.join(__dirname, 'public', 'assets', 'img', 'uploads', file);
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); resolve(); });
      } else {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(file, 'Body preview:', body.substring(0, 100));
          resolve();
        });
      }
    }).on('error', (err) => {
      console.error(file, 'Error:', err.message);
      resolve();
    });
  });
}

async function main() {
  for (const f of files) {
    await downloadOne(f);
  }
}
main();
