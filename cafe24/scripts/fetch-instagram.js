/**
 * Instagram Graph API로 최근 게시물 9개를 가져와 data/instagram.json으로 저장합니다.
 *
 * 필요: Instagram Business 또는 Creator 계정, Facebook 앱, 액세스 토큰
 * 환경 변수: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID
 *
 * 실행: node scripts/fetch-instagram.js
 * (cafe24 폴더가 작업 디렉터리이거나, 프로젝트 루트에서 실행)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LIMIT = 9;
const API_VERSION = 'v21.0';
const FIELDS = 'id,media_url,permalink,caption';

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID;

if (!token || !userId) {
  console.error('필요한 환경 변수가 없습니다.');
  console.error('  INSTAGRAM_ACCESS_TOKEN  - Instagram Graph API 액세스 토큰');
  console.error('  INSTAGRAM_USER_ID      - Instagram Business/Creator 계정의 IG User ID');
  process.exit(1);
}

const url = `https://graph.instagram.com/${API_VERSION}/${userId}/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${token}`;

function fetch(urlString) {
  return new Promise((resolve, reject) => {
    const req = https.get(urlString, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.error) {
            reject(new Error(data.error.message || JSON.stringify(data.error)));
            return;
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Request timeout')); });
  });
}

function resolveDataDir() {
  const cwd = process.cwd();
  const fromCafe24 = path.join(cwd, 'data', 'instagram.json');
  const fromRoot = path.join(cwd, 'cafe24', 'data', 'instagram.json');
  if (fs.existsSync(path.dirname(fromCafe24)) && fs.existsSync(path.join(path.dirname(fromCafe24), 'notice.json'))) {
    return fromCafe24;
  }
  if (fs.existsSync(path.dirname(fromRoot))) {
    return fromRoot;
  }
  return fromCafe24;
}

(async () => {
  try {
    const data = await fetch(url);
    const raw = data.data || [];
    const posts = raw.map((m) => ({
      media_url: m.media_url || '',
      permalink: m.permalink || `https://www.instagram.com/p/${m.id}/`,
      caption: (m.caption || '').slice(0, 500),
    }));

    const output = { posts };
    const outPath = resolveDataDir();
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`저장 완료: ${outPath} (${posts.length}개)`);
  } catch (err) {
    console.error('실패:', err.message);
    process.exit(1);
  }
})();
