const fs = require('fs');
const path = require('path');
const htmlsDir = path.join(process.cwd(), 'htmls');
const files = fs.readdirSync(htmlsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(htmlsDir, file), 'utf8');
    // Ensure lowercase for href and src (except absolute URLs)
    content = content.replace(/href=\"([^\"]+)\"/g, (match, p1) => {
        if (!p1.startsWith('http')) return 'href=\"' + p1.toLowerCase() + '\"';
        return match;
    });
    content = content.replace(/src=\"([^\"]+)\"/g, (match, p1) => {
        if (!p1.startsWith('http')) return 'src=\"' + p1.toLowerCase() + '\"';
        return match;
    });
    fs.writeFileSync(path.join(htmlsDir, file), content);
});

let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(/href=\"([^\"]+)\"/g, (match, p1) => {
    if (!p1.startsWith('http')) return 'href=\"' + p1.toLowerCase() + '\"';
    return match;
});
indexContent = indexContent.replace(/src=\"([^\"]+)\"/g, (match, p1) => {
    if (!p1.startsWith('http')) return 'src=\"' + p1.toLowerCase() + '\"';
    return match;
});
fs.writeFileSync('index.html', indexContent);

console.log('All local hrefs and srcs converted to lowercase');
