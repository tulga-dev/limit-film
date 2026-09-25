// Builds both language versions from limit.html (the source, English by default).
//   limit-mn.html        the same film, Mongolian by default (published as its own artifact)
//   site/index.html      English, as a standalone page for hosting or sending
//   site/mn/index.html   Mongolian, as a standalone page
//   site/og*.jpg         link-preview images (the cards X, WhatsApp, Telegram etc. show)
// Run with: node build.mjs
import fs from 'fs';

// where the site is served; link previews need absolute URLs
const SITE = 'https://limit-film.fly.dev';

const META = {
  en: {
    path: '/',
    image: 'og.jpg',
    locale: 'en_US',
    title: 'LIMIT: a four-minute film computed live in your browser',
    description: "Archimedes' π, a million-particle Lorenz attractor, a Mandelbrot dive past the limits of 32-bit math, and a black hole. No video files: every frame and every note is generated as you watch.",
    alt: 'A black hole with a glowing accretion disk bent over its shadow, under the title LIMIT.',
  },
  mn: {
    path: '/mn/',
    image: 'og-mn.jpg',
    locale: 'mn_MN',
    title: 'ХЯЗГААР: таны браузер дээр шууд тооцоологдох дөрвөн минутын кино',
    description: 'Архимедийн π, сая бөөмтэй Лоренцын аттрактор, 32 битийн тооцооллын хязгаарыг давсан Мандельбротын шумбалт, хар нүх. Видео файл огт байхгүй: кадр бүр, нот бүр таны үзэх агшинд үүснэ.',
    alt: 'ХЯЗГААР гэсэн гарчигтай, гэрэлтэх дискээр хүрээлэгдсэн хар нүх.',
  },
};

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23030306'/%3E%3Ccircle cx='32' cy='32' r='17' fill='none' stroke='%23ede7db' stroke-width='3'/%3E%3C/svg%3E";

const swap = (s, from, to) => {
  if (!s.includes(from)) throw new Error(`expected to find: ${from}`);
  return s.replace(from, to);
};

const head = (lang) => {
  const m = META[lang], url = SITE + m.path, img = `${SITE}/${m.image}`;
  return [
    `<meta name="description" content="${m.description}">`,
    '<meta name="theme-color" content="#030306">',
    `<link rel="icon" href="${FAVICON}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="LIMIT">',
    `<meta property="og:locale" content="${m.locale}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${m.title}">`,
    `<meta property="og:description" content="${m.description}">`,
    `<meta property="og:image" content="${img}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${m.alt}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${m.title}">`,
    `<meta name="twitter:description" content="${m.description}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="twitter:image:alt" content="${m.alt}">`,
  ].join('\n');
};

const en = fs.readFileSync('limit.html', 'utf8');
let mn = swap(en, "const DEFAULT_LANG = 'en';", "const DEFAULT_LANG = 'mn';");
mn = swap(mn, '<title>Approaching the Limit</title>', '<title>Хязгаарт ойртох</title>');
fs.writeFileSync('limit-mn.html', mn);

// the artifact host adds the document skeleton itself; standalone pages need it spelled out
const page = (body, lang) => {
  const i = body.indexOf('<canvas');
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head(lang)}\n${body.slice(0, i)}</head>\n<body>\n${body.slice(i)}\n</body>\n</html>\n`;
};
fs.mkdirSync('site/mn', { recursive: true });
fs.writeFileSync('site/index.html', page(en, 'en'));
fs.writeFileSync('site/mn/index.html', page(mn, 'mn'));
for (const m of Object.values(META)) fs.copyFileSync(`assets/${m.image}`, `site/${m.image}`);
console.log('built limit-mn.html, site/index.html, site/mn/index.html and the preview images');
