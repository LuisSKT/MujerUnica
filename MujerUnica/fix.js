const fs = require('fs');
const path = require('path');
const htmlsDir = path.join(process.cwd(), 'htmls');
const files = fs.readdirSync(htmlsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(htmlsDir, file), 'utf8');
    content = content.replace(/href="\.\.\/style\.css"/g, 'href="style.css"');
    content = content.replace(/src="\.\.\/script\.js"/g, 'src="script.js"');
    fs.writeFileSync(path.join(htmlsDir, file), content);
});

// Also fix index.html
let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(/href="style\.css"/g, 'href="htmls/style.css"');
indexContent = indexContent.replace(/src="script\.js"/g, 'src="htmls/script.js"');
fs.writeFileSync('index.html', indexContent);

console.log('Fixed css/js links');
