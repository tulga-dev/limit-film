// Builds both language versions from limit.html (the source, English by default).
//   limit-mn.html        the same film, Mongolian by default (published as its own artifact)
//   site/index.html      English, as a standalone page for hosting or sending
//   site/mn/index.html   Mongolian, as a standalone page
// Run with: node build.mjs
import fs from 'fs';

const swap = (s, from, to) => {
  if (!s.includes(from)) throw new Error(`expected to find: ${from}`);
  return s.replace(from, to);
};

const en = fs.readFileSync('limit.html', 'utf8');
let mn = swap(en, "const DEFAULT_LANG = 'en';", "const DEFAULT_LANG = 'mn';");
mn = swap(mn, '<title>Approaching the Limit</title>', '<title>Хязгаарт ойртох</title>');
fs.writeFileSync('limit-mn.html', mn);

// the artifact host adds the document skeleton itself; standalone pages need it spelled out
const page = (body, lang) => {
  const i = body.indexOf('<canvas');
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${body.slice(0, i)}</head>\n<body>\n${body.slice(i)}\n</body>\n</html>\n`;
};
fs.mkdirSync('site/mn', { recursive: true });
fs.writeFileSync('site/index.html', page(en, 'en'));
fs.writeFileSync('site/mn/index.html', page(mn, 'mn'));
console.log('built limit-mn.html, site/index.html, site/mn/index.html');
