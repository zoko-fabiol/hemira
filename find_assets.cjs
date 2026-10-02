const fs = require('fs');
const files = ['index_live.html', 'about_live.html', 'services_live.html', 'case_studies_live.html', 'contact_live.html', 'style_live.css'];
const assets = new Set();
const regex = /(?:src|href|url)\s*[:=\(]\s*['"]?(\/assets\/[^'")\s]+)['"]?/g;

files.forEach(f => {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = regex.exec(text)) !== null) {
      assets.add(match[1]);
    }
  }
});
console.log(JSON.stringify(Array.from(assets), null, 2));
