import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Safely configure static files
try {
  const pubPath = path.join(__dirname, 'public');
  if (fs.existsSync(pubPath) && fs.statSync(pubPath).isDirectory()) {
    app.use(express.static(pubPath));
  }
} catch (_) {}
app.use(express.static(__dirname));

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data, ttl = CACHE_TTL_MS) {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

// Helper to make API requests with custom User-Agent
async function fetchFx(url) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 XProfileViewer/1.0',
    'Accept': 'application/json'
  };
  const res = await fetch(url, { headers });
  const text = await res.text().catch(() => '');
  let parsed;
  try { parsed = JSON.parse(text); } catch (_) {}
  
  if (!res.ok) {
    const err = new Error(parsed?.message || `Upstream error HTTP ${res.status}`);
    err.status = res.status;
    err.details = parsed;
    throw err;
  }
  return parsed || {};
}

// Normalize profile avatar and banner for high resolution
function enhanceProfile(user) {
  if (!user) return user;
  const enhanced = { ...user };
  if (enhanced.avatar_url) {
    enhanced.avatar_hd = enhanced.avatar_url.replace('_normal.', '_400x400.').replace('_bigger.', '_400x400.');
  }
  if (enhanced.banner_url) {
    enhanced.banner_hd = `${enhanced.banner_url}/1500x500`;
  }
  return enhanced;
}

// Multi-fallback profile resolver
async function resolveUserProfile(handle) {
  try {
    const d1 = await fetchFx(`https://api.fxtwitter.com/${encodeURIComponent(handle)}`);
    if (d1 && d1.code === 200 && d1.user) return d1.user;
  } catch (e1) {}

  try {
    const d2 = await fetchFx(`https://api.fxtwitter.com/2/profile/${encodeURIComponent(handle)}?about_account=1`);
    if (d2 && d2.code === 200 && d2.user) return d2.user;
  } catch (e2) {}

  try {
    const d3 = await fetchFx(`https://api.fxtwitter.com/2/profile/${encodeURIComponent(handle)}/statuses?count=1`);
    if (d3 && d3.code === 200 && Array.isArray(d3.results) && d3.results.length > 0) {
      const author = d3.results[0].author;
      if (author && author.screen_name) return author;
    }
  } catch (e3) {}

  return null;
}

// 1. Get User Profile
app.get('/api/profile/:handle', async (req, res) => {
  const handle = req.params.handle.trim().replace(/^@/, '');
  if (!handle) {
    return res.status(400).json({ success: false, error: 'اسم المستخدم مطلوب' });
  }

  const cacheKey = `profile_${handle.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    const user = await resolveUserProfile(handle);
    if (user) {
      const enhancedUser = enhanceProfile(user);
      setCache(cacheKey, enhancedUser, 2 * 60 * 1000);
      return res.json({ success: true, data: enhancedUser });
    }
    return res.status(404).json({
      success: false,
      error: `لم يتم العثور على الحساب @${handle} أو الحساب محظور/خاص.`
    });
  } catch (err) {
    console.error(`Error fetching profile for @${handle}:`, err.message);
    return res.status(500).json({
      success: false,
      error: 'تعذر جلب بيانات الحساب حالياً.'
    });
  }
});

// 2. Get User Statuses / Timeline
app.get('/api/tweets/:handle', async (req, res) => {
  const handle = req.params.handle.trim().replace(/^@/, '');
  const count = Math.min(parseInt(req.query.count, 10) || 20, 50);
  const cursor = req.query.cursor || '';
  const withReplies = req.query.replies === 'true' ? '1' : '0';

  const cacheKey = `tweets_${handle.toLowerCase()}_${count}_${cursor}_${withReplies}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    let url = `https://api.fxtwitter.com/2/profile/${encodeURIComponent(handle)}/statuses?count=${count}&with_replies=${withReplies}`;
    if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;

    const data = await fetchFx(url);
    if (data.code === 200) {
      const payload = {
        results: data.results || [],
        cursor: data.cursor || null
      };
      setCache(cacheKey, payload, 30 * 1000);
      return res.json({ success: true, data: payload });
    }
    return res.status(data.code || 404).json({
      success: false,
      error: data.message || 'لا توجد تغريدات متاحة لهذا الحساب'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'تعذر جلب التغريدات حالياً.'
    });
  }
});

// 3. Get User Media Posts
app.get('/api/media/:handle', async (req, res) => {
  const handle = req.params.handle.trim().replace(/^@/, '');
  const count = Math.min(parseInt(req.query.count, 10) || 20, 50);
  const cursor = req.query.cursor || '';

  const cacheKey = `media_${handle.toLowerCase()}_${count}_${cursor}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    let url = `https://api.fxtwitter.com/2/profile/${encodeURIComponent(handle)}/media?count=${count}`;
    if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;

    const data = await fetchFx(url);
    if (data.code === 200) {
      const payload = {
        results: data.results || [],
        cursor: data.cursor || null
      };
      setCache(cacheKey, payload, 30 * 1000);
      return res.json({ success: true, data: payload });
    }
    return res.status(data.code || 404).json({
      success: false,
      error: data.message || 'لا توجد وسائط لهذا الحساب'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'تعذر جلب الوسائط حالياً.'
    });
  }
});

// 4. Get Single Tweet / Thread
app.get('/api/tweet/:id', async (req, res) => {
  const tweetId = req.params.id.trim();
  const cacheKey = `tweet_${tweetId}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    const data = await fetchFx(`https://api.fxtwitter.com/2/conversation/${encodeURIComponent(tweetId)}`);
    if (data.code === 200) {
      setCache(cacheKey, data, 120 * 1000);
      return res.json({ success: true, data });
    }
    return res.status(data.code || 404).json({
      success: false,
      error: data.message || 'تعذر العثور على التغريدة'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'تعذر جلب التغريدة.'
    });
  }
});

// 5. Search Tweets / Topics
app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.status(400).json({ success: false, error: 'كلمة البحث مطلوبة' });
  }
  const feed = req.query.feed || 'latest';
  const count = Math.min(parseInt(req.query.count, 10) || 20, 50);

  const cacheKey = `search_${encodeURIComponent(query)}_${feed}_${count}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    const url = `https://api.fxtwitter.com/2/search?q=${encodeURIComponent(query)}&feed=${feed}&count=${count}`;
    const data = await fetchFx(url);
    if (data.code === 200) {
      setCache(cacheKey, data, 30 * 1000);
      return res.json({ success: true, data });
    }
    return res.status(data.code || 404).json({
      success: false,
      error: data.message || 'لا توجد نتائج بحث'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'تعذر إجراء البحث.'
    });
  }
});

// 6. Get User Spaces
app.get('/api/spaces/:handle', async (req, res) => {
  const handle = req.params.handle.trim().replace(/^@/, '');
  if (!handle) return res.status(400).json({ success: false, error: 'اسم المستخدم مطلوب' });

  const cacheKey = `spaces_${handle.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    const query = `from:${handle} (spaces OR "i/spaces" OR "twitter.com/i/spaces")`;
    const searchUrl = `https://api.fxtwitter.com/2/search?q=${encodeURIComponent(query)}&feed=latest&count=30`;
    const searchData = await fetchFx(searchUrl);

    const spacesList = [];
    const seenSpaceIds = new Set();

    if (searchData.code === 200 && Array.isArray(searchData.results)) {
      searchData.results.forEach(tweet => {
        const text = tweet.text || '';
        const spaceMatch = text.match(/(?:x\.com|twitter\.com)\/i\/spaces\/([a-zA-Z0-9]+)/i) ||
                           text.match(/spaces\/([a-zA-Z0-9]{12,15})/i);
        
        const spaceId = spaceMatch ? spaceMatch[1] : null;
        
        if (spaceId && !seenSpaceIds.has(spaceId)) {
          seenSpaceIds.add(spaceId);
          spacesList.push({
            id: tweet.id,
            spaceId: spaceId,
            title: text.replace(/https?:\/\/[^\s]+/g, '').trim() || `مساحة @${handle}`,
            rawText: text,
            url: `https://x.com/i/spaces/${spaceId}`,
            spacesDashboardUrl: `https://spacesdashboard.com/space/${spaceId}`,
            created_at: tweet.created_at,
            created_timestamp: tweet.created_timestamp,
            likes: tweet.likes || 0,
            reposts: tweet.reposts || 0,
            replies: tweet.replies || 0,
            views: tweet.views || 0,
            author: tweet.author || {}
          });
        }
      });
    }

    const payload = {
      handle,
      spacesDashboardUserUrl: `https://spacesdashboard.com/u/${handle}`,
      count: spacesList.length,
      spaces: spacesList
    };

    setCache(cacheKey, payload, 60 * 1000);
    return res.json({ success: true, data: payload });
  } catch (err) {
    return res.json({
      success: true,
      data: {
        handle,
        spacesDashboardUserUrl: `https://spacesdashboard.com/u/${handle}`,
        count: 0,
        spaces: []
      }
    });
  }
});

// 7. Live Trending Topics
app.get('/api/trends', async (req, res) => {
  const cacheKey = 'trends_live';
  const cached = getCached(cacheKey);
  if (cached) return res.json({ success: true, fromCache: true, data: cached });

  try {
    const data = await fetchFx('https://api.fxtwitter.com/2/trends');
    if (data.code === 200) {
      setCache(cacheKey, data.trends || [], 5 * 60 * 1000);
      return res.json({ success: true, data: data.trends || [] });
    }
    return res.json({ success: true, data: [] });
  } catch (err) {
    return res.json({ success: true, data: [] });
  }
});

// Safe Index HTML resolver
function getIndexHtmlPath() {
  const c1 = path.join(__dirname, 'public', 'index.html');
  try { if (fs.existsSync(c1) && fs.statSync(c1).isFile()) return c1; } catch (_) {}

  const c2 = path.join(__dirname, 'index.html');
  try { if (fs.existsSync(c2) && fs.statSync(c2).isFile()) return c2; } catch (_) {}

  return c1;
}

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(getIndexHtmlPath());
});

app.listen(PORT, () => {
  console.log(`🚀 خادم استعراض تويتر يعمل الآن على المنفذ: ${PORT}`);
});
