const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'node_modules', 'html2pdf.js', 'dist');
const files = ['es6-promise.auto.js', 'es6-promise.auto.min.js', 'es6-promise.js', 'es6-promise.min.js'];

files.forEach((file) => {
  const fullPath = path.join(distPath, file);
  if (fs.existsSync(fullPath)) {
    let data = fs.readFileSync(fullPath, 'utf8');
    const updated = data.replace(/\/\/# sourceMappingURL=.*\.map\n?/, '');
    if (updated !== data) {
      fs.writeFileSync(fullPath, updated, 'utf8');
      console.log(`Removed sourceMappingURL from ${file}`);
    }
  }
});
