/**
 * X-Viewer / Nitter Alternative
 * Ultra-Fast Twitter Profile & Content Viewer
 */

// Global State
const state = {
  user: null,
  tweets: [],
  allTweetsRaw: [],
  spaces: [],
  spacesDashboardUrl: '',
  cursor: null,
  currentFilter: 'all',
  currentTab: 'tab-tweets',
  lang: 'ar',
  isLoadingMore: false
};

// Multi-Language Dictionary
const i18n = {
  ar: {
    badge_nitter: 'بديل Nitter',
    search_placeholder: 'ابحث عن حساب (مثل SaudiProject)...',
    hero_privacy_tag: 'بدون تسجيل دخول • حماية الخصوصية • فائق السرعة',
    hero_title: 'استكشف معلومات وتغريدات أي حساب في <span class="gradient-text">تويتر / إكس</span>',
    hero_desc: 'شاهد كامل تفاصيل الحساب، صورة العرض الأصلية بدقة عالية، التغريدات، الوسائط، الردود، والإحصائيات بضغطة زر واحدة وبدون قيود.',
    hero_input_placeholder: 'أدخل اسم المستخدم (مثال: SaudiProject أو elonmusk)',
    btn_fetch: 'جلب البيانات',
    suggested_accounts: 'حسابات مقترحة للتجربة:',
    trends_title: 'المواضيع الشائعة في إكس الآن (Trends)',
    loading_profile: 'جاري جلب بيانات الحساب وتفاصيل التغريدات والمساحات...',
    loading_sub: 'يتم الاتصال بقاعدة البيانات وتحسين الصور والوسائط ومطابقة Spaces',
    error_title: 'تعذر جلب بيانات الحساب',
    btn_retry: 'إعادة المحاولة',
    btn_home: 'العودة للرئيسية',
    view_banner: 'عرض الغلاف بالحجم الكامل',
    view_avatar: 'تكبير صورة الحساب',
    btn_share: 'مشاركة',
    btn_export: 'تصدير',
    btn_open_x: 'فتح في X',
    btn_spaces_dash: 'سبيسات الحساب',
    joined_date: 'انضم في ',
    stat_followers: 'المتابعون',
    stat_following: 'يتابعهم',
    stat_tweets: 'التغريدات',
    stat_media: 'الوسائط',
    stat_likes: 'الإعجابات',
    tab_tweets: 'التغريدات والمنشورات',
    tab_spaces: 'المساحات (Spaces)',
    tab_media: 'معرض الوسائط (Media)',
    tab_analytics: 'إحصائيات وتحليل التفاعل',
    spaces_hub_title: 'أرشيف ومتابعة المساحات الصوتية (Spaces Hub)',
    spaces_banner_desc: 'استكشف تسجيلات وجلسات المساحات السابقة والمجدولة المرتبطة بالحساب',
    btn_open_in_spacesdash: 'فتح على SpacesDashboard',
    btn_listen_space: 'استماع في X',
    btn_view_on_sd: 'تفاصيل SpacesDashboard',
    filter_all: 'الكل',
    filter_original: 'تغريدات أساسية فقط',
    filter_with_media: 'مع وسائط',
    btn_load_more: 'تحميل المزيد من التغريدات',
    analytics_engagement: 'معدل التفاعل والنشاط',
    metric_avg_likes: 'متوسط الإعجابات لكل تغريدة:',
    metric_avg_reposts: 'متوسط إعادة التغريد:',
    metric_avg_replies: 'متوسط الردود:',
    metric_media_ratio: 'نسبة التغريدات ذات الوسائط:',
    analytics_hashtags: 'أبرز الوسوم (Hashtags) استخداماً',
    no_hashtags: 'لا توجد وسوم في آخر تغريدات تم جلبها',
    analytics_account_info: 'معلومات أمان وهوية الحساب',
    metric_verification_type: 'نوع التوثيق:',
    metric_account_age: 'عمر الحساب التقريبي:',
    metric_protected_status: 'حالة الحماية:',
    export_modal_title: 'تصدير بيانات الحساب والتغريدات',
    export_modal_desc: 'يمكنك تنزيل بيانات هذا الملف الشخصي والتغريدات بصيغة JSON أو CSV لاستخدامها في التحليلات أو الأرشفة:',
    btn_download_image: 'تحميل الصورة الأصلية',
    toast_copied_handle: 'تم نسخ اسم المستخدم بنجاح!',
    toast_copied_link: 'تم نسخ رابط الحساب بنجاح!',
    toast_copied_tweet: 'تم نسخ نص التغريدة!',
    toast_error_search: 'يرجى إدخال اسم مستخدم صحيح',
    reposted_by: 'أعاد نشرها',
    pinned_tweet: 'تغريدة مثبتة',
    empty_tweets: 'لا توجد تغريدات مطابقة لهذا الفلتر',
    empty_spaces: 'لم يتم العثور على تغريدات مساحات مباشرة لهذا الحساب مؤخراً. يمكنك استعراض الأرشيف الكامل على SpacesDashboard:'
  },
  en: {
    badge_nitter: 'Nitter Alternative',
    search_placeholder: 'Search handle (e.g. elonmusk)...',
    hero_privacy_tag: 'No Login Required • Privacy-First • Ultra Fast',
    hero_title: 'Explore Profile & Tweets on <span class="gradient-text">Twitter / X</span>',
    hero_desc: 'View full profile metadata, HD avatar & banner, timeline posts, media gallery, and engagement analytics with zero login walls.',
    hero_input_placeholder: 'Enter username (e.g. elonmusk or SaudiProject)',
    btn_fetch: 'Fetch Profile',
    suggested_accounts: 'Suggested accounts to try:',
    trends_title: 'Live Trending Topics on X',
    loading_profile: 'Fetching profile data, tweets & spaces...',
    loading_sub: 'Connecting to feeds, optimizing media and resolving audio spaces',
    error_title: 'Could Not Load Profile',
    btn_retry: 'Retry',
    btn_home: 'Go to Home',
    view_banner: 'View Fullscreen Banner',
    view_avatar: 'Zoom Avatar',
    btn_share: 'Share',
    btn_export: 'Export',
    btn_open_x: 'Open on X',
    btn_spaces_dash: 'Audio Spaces',
    joined_date: 'Joined ',
    stat_followers: 'Followers',
    stat_following: 'Following',
    stat_tweets: 'Posts',
    stat_media: 'Media',
    stat_likes: 'Likes',
    tab_tweets: 'Tweets & Timeline',
    tab_spaces: 'Spaces (Audio)',
    tab_media: 'Media Gallery',
    tab_analytics: 'Engagement Analytics',
    spaces_hub_title: 'Spaces Audio Hub & Archive',
    spaces_banner_desc: 'Explore live, recorded, and historical audio Spaces for this creator',
    btn_open_in_spacesdash: 'Open on SpacesDashboard',
    btn_listen_space: 'Listen on X',
    btn_view_on_sd: 'SpacesDashboard Info',
    filter_all: 'All',
    filter_original: 'Original Tweets Only',
    filter_with_media: 'With Media',
    btn_load_more: 'Load More Tweets',
    analytics_engagement: 'Engagement & Activity',
    metric_avg_likes: 'Avg. Likes per Tweet:',
    metric_avg_reposts: 'Avg. Reposts per Tweet:',
    metric_avg_replies: 'Avg. Replies per Tweet:',
    metric_media_ratio: 'Tweets with Media Ratio:',
    analytics_hashtags: 'Top Hashtags Used',
    no_hashtags: 'No hashtags found in recent tweets',
    analytics_account_info: 'Account Trust & Metadata',
    metric_verification_type: 'Verification Status:',
    metric_account_age: 'Approximate Account Age:',
    metric_protected_status: 'Privacy Status:',
    export_modal_title: 'Export Profile & Tweets Data',
    export_modal_desc: 'Download this profile details and fetched tweets as JSON or CSV format for analysis or archiving:',
    btn_download_image: 'Download Original Image',
    toast_copied_handle: 'Username copied to clipboard!',
    toast_copied_link: 'Profile share link copied!',
    toast_copied_tweet: 'Tweet text copied!',
    toast_error_search: 'Please enter a valid username',
    reposted_by: 'Reposted by',
    pinned_tweet: 'Pinned Tweet',
    empty_tweets: 'No tweets match this filter',
    empty_spaces: 'No direct space broadcasts found in recent tweets. You can explore the full history on SpacesDashboard:'
  }
};

// DOM Elements
const elements = {
  heroSection: document.getElementById('heroSection'),
  loadingSection: document.getElementById('loadingSection'),
  errorSection: document.getElementById('errorSection'),
  profileSection: document.getElementById('profileSection'),
  
  heroSearchForm: document.getElementById('heroSearchForm'),
  heroSearchInput: document.getElementById('heroSearchInput'),
  navSearchForm: document.getElementById('navSearchForm'),
  navSearchInput: document.getElementById('navSearchInput'),
  
  btnGoHome: document.getElementById('btnGoHome'),
  btnLangToggle: document.getElementById('btnLangToggle'),
  langText: document.getElementById('langText'),
  trendsList: document.getElementById('trendsList'),
  btnRefreshTrends: document.getElementById('btnRefreshTrends'),
  
  // Profile elements
  profileBanner: document.getElementById('profileBanner'),
  btnViewBanner: document.getElementById('btnViewBanner'),
  profileAvatar: document.getElementById('profileAvatar'),
  btnViewAvatar: document.getElementById('btnViewAvatar'),
  profileName: document.getElementById('profileName'),
  profileBadge: document.getElementById('profileBadge'),
  profileProtected: document.getElementById('profileProtected'),
  profileHandle: document.getElementById('profileHandle'),
  btnCopyHandle: document.getElementById('btnCopyHandle'),
  profileBio: document.getElementById('profileBio'),
  
  metaLocation: document.getElementById('metaLocation'),
  textLocation: document.getElementById('textLocation'),
  metaWebsite: document.getElementById('metaWebsite'),
  linkWebsite: document.getElementById('linkWebsite'),
  metaJoined: document.getElementById('metaJoined'),
  textJoined: document.getElementById('textJoined'),
  metaId: document.getElementById('metaId'),
  textId: document.getElementById('textId'),
  
  valFollowers: document.getElementById('valFollowers'),
  valFollowing: document.getElementById('valFollowing'),
  valTweets: document.getElementById('valTweets'),
  valMedia: document.getElementById('valMedia'),
  valLikes: document.getElementById('valLikes'),
  
  btnShareProfile: document.getElementById('btnShareProfile'),
  btnExportData: document.getElementById('btnExportData'),
  linkOpenX: document.getElementById('linkOpenX'),
  linkSpacesDashboard: document.getElementById('linkSpacesDashboard'),
  btnOpenSpacesDashTab: document.getElementById('btnOpenSpacesDashTab'),
  
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  tabCountTweets: document.getElementById('tabCountTweets'),
  tabCountSpaces: document.getElementById('tabCountSpaces'),
  tabCountMedia: document.getElementById('tabCountMedia'),
  
  filterPills: document.querySelectorAll('.filter-pill'),
  tweetsContainer: document.getElementById('tweetsContainer'),
  spacesContainer: document.getElementById('spacesContainer'),
  loadMoreWrapper: document.getElementById('loadMoreWrapper'),
  btnLoadMoreTweets: document.getElementById('btnLoadMoreTweets'),
  timelineCountText: document.getElementById('timelineCountText'),
  
  mediaGalleryContainer: document.getElementById('mediaGalleryContainer'),
  
  // Analytics
  metricAvgLikes: document.getElementById('metricAvgLikes'),
  metricAvgReposts: document.getElementById('metricAvgReposts'),
  metricAvgReplies: document.getElementById('metricAvgReplies'),
  metricMediaRatio: document.getElementById('metricMediaRatio'),
  hashtagsCloud: document.getElementById('hashtagsCloud'),
  metricVerificationType: document.getElementById('metricVerificationType'),
  metricAccountAge: document.getElementById('metricAccountAge'),
  metricProtectedStatus: document.getElementById('metricProtectedStatus'),
  
  // Modals
  lightboxModal: document.getElementById('lightboxModal'),
  lightboxImage: document.getElementById('lightboxImage'),
  lightboxDownloadBtn: document.getElementById('lightboxDownloadBtn'),
  btnCloseLightbox: document.getElementById('btnCloseLightbox'),
  
  exportModal: document.getElementById('exportModal'),
  btnCloseExport: document.getElementById('btnCloseExport'),
  btnDownloadJSON: document.getElementById('btnDownloadJSON'),
  btnDownloadCSV: document.getElementById('btnDownloadCSV'),
  
  errorMessage: document.getElementById('errorMessage'),
  btnRetry: document.getElementById('btnRetry'),
  btnErrorBack: document.getElementById('btnErrorBack'),
  toastContainer: document.getElementById('toastContainer')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadTrends();
  checkUrlParams();
});

// Check if URL has a search query param (e.g. ?u=SaudiProject)
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const handle = params.get('u') || params.get('user') || params.get('username');
  if (handle) {
    fetchUserData(handle.trim());
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Search Forms
  elements.heroSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const handle = elements.heroSearchInput.value.trim();
    if (handle) fetchUserData(handle);
    else showToast(i18n[state.lang].toast_error_search, 'warning');
  });

  elements.navSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const handle = elements.navSearchInput.value.trim();
    if (handle) fetchUserData(handle);
    else showToast(i18n[state.lang].toast_error_search, 'warning');
  });

  // Suggestion Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const handle = chip.dataset.username;
      if (handle) fetchUserData(handle);
    });
  });

  // Brand Logo (Back to Home)
  elements.btnGoHome.addEventListener('click', showHeroView);
  elements.btnErrorBack.addEventListener('click', showHeroView);

  // Language Switch
  elements.btnLangToggle.addEventListener('click', toggleLanguage);

  // Refresh Trends
  elements.btnRefreshTrends.addEventListener('click', loadTrends);

  // Copy Handle & Profile Link
  elements.btnCopyHandle.addEventListener('click', () => {
    if (state.user) {
      navigator.clipboard.writeText(`@${state.user.screen_name}`);
      showToast(i18n[state.lang].toast_copied_handle, 'success');
    }
  });

  elements.btnShareProfile.addEventListener('click', () => {
    if (state.user) {
      const url = `${window.location.origin}${window.location.pathname}?u=${state.user.screen_name}`;
      navigator.clipboard.writeText(url);
      showToast(i18n[state.lang].toast_copied_link, 'success');
    }
  });

  // Lightbox Zoom Buttons
  elements.btnViewBanner.addEventListener('click', () => {
    if (state.user && state.user.banner_url) {
      openLightbox(`${state.user.banner_url}/1500x500`);
    }
  });

  elements.btnViewAvatar.addEventListener('click', () => {
    if (state.user && state.user.avatar_hd) {
      openLightbox(state.user.avatar_hd);
    }
  });

  elements.btnCloseLightbox.addEventListener('click', closeLightbox);
  elements.lightboxModal.addEventListener('click', (e) => {
    if (e.target === elements.lightboxModal) closeLightbox();
  });

  // Export Modal
  elements.btnExportData.addEventListener('click', openExportModal);
  elements.btnCloseExport.addEventListener('click', closeExportModal);
  elements.exportModal.addEventListener('click', (e) => {
    if (e.target === elements.exportModal) closeExportModal();
  });

  elements.btnDownloadJSON.addEventListener('click', downloadJSON);
  elements.btnDownloadCSV.addEventListener('click', downloadCSV);

  // Tabs Navigation
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      switchTab(targetTab);
    });
  });

  // Timeline Filter Pills
  elements.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.currentFilter = pill.dataset.filter;
      renderTweets();
    });
  });

  // Load More Tweets
  elements.btnLoadMoreTweets.addEventListener('click', () => {
    if (state.user && state.cursor && !state.isLoadingMore) {
      loadMoreTweets();
    }
  });

  // Retry on error
  elements.btnRetry.addEventListener('click', () => {
    const handle = elements.heroSearchInput.value.trim() || elements.navSearchInput.value.trim();
    if (handle) fetchUserData(handle);
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeExportModal();
    }
  });
}

// Switch UI Language (Arabic <-> English)
function toggleLanguage() {
  state.lang = state.lang === 'ar' ? 'en' : 'ar';
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  elements.langText.textContent = state.lang === 'ar' ? 'EN' : 'عربي';

  // Update text nodes with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[state.lang][key]) {
      el.innerHTML = i18n[state.lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[state.lang][key]) {
      el.placeholder = i18n[state.lang][key];
    }
  });

  // Re-render components that format language text
  if (state.user) {
    renderProfile(state.user);
    renderTweets();
    renderAnalytics();
  }
}

// Hybrid API Fetcher (Supports both Vercel/Node Backend and GitHub Pages Static Hosting)
const isStaticHost = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';

async function apiFetch(endpoint, fallbackDirectUrl) {
  if (!isStaticHost) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API failed, trying direct API fallback...', e);
    }
  }

  // Direct Public API Fallback for GitHub Pages
  if (fallbackDirectUrl) {
    const res = await fetch(fallbackDirectUrl);
    const text = await res.text().catch(() => '');
    let data;
    try { data = JSON.parse(text); } catch (_) {}
    return data;
  }

  throw new Error('Endpoint not available on static hosting');
}

// Fetch Complete User Data
async function fetchUserData(rawHandle) {
  const handle = rawHandle.replace(/^@/, '').trim();
  if (!handle) return;

  showLoadingView();

  // Update URL query param without full reload
  const newUrl = `${window.location.pathname}?u=${encodeURIComponent(handle)}`;
  window.history.pushState({ handle }, '', newUrl);

  try {
    // 1. Fetch Profile
    let profileData;
    if (!isStaticHost) {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(handle)}`);
        profileData = await res.json();
      } catch (_) {}
    }

    if (!profileData || !profileData.success) {
      // Direct Strategy for GitHub Pages
      let u = null;
      try {
        const d1 = await fetch(`https://api.fxtwitter.com/${encodeURIComponent(handle)}`).then(r => r.json());
        if (d1 && d1.code === 200 && d1.user) u = d1.user;
      } catch (_) {}

      if (!u) {
        try {
          const d2 = await fetch(`https://api.fxtwitter.com/2/profile/${encodeURIComponent(handle)}/statuses?count=1`).then(r => r.json());
          if (d2 && d2.code === 200 && d2.results?.[0]?.author) u = d2.results[0].author;
        } catch (_) {}
      }

      if (u) {
        if (u.avatar_url) u.avatar_hd = u.avatar_url.replace('_normal.', '_400x400.').replace('_bigger.', '_400x400.');
        if (u.banner_url) u.banner_hd = `${u.banner_url}/1500x500`;
        profileData = { success: true, data: u };
      } else {
        throw new Error('لم يتم العثور على الحساب أو الحساب محظور/خاص.');
      }
    }

    state.user = profileData.data;

    // 2. Fetch Tweets
    let tweetsResults = [];
    let nextCursor = null;

    if (!isStaticHost) {
      try {
        const tweetsRes = await fetch(`/api/tweets/${encodeURIComponent(handle)}?count=25`);
        const twData = await tweetsRes.json();
        if (twData.success && twData.data) {
          tweetsResults = twData.data.results || [];
          nextCursor = twData.data.cursor?.bottom || null;
        }
      } catch (_) {}
    }

    if (!tweetsResults.length) {
      try {
        const twDirect = await fetch(`https://api.fxtwitter.com/2/profile/${encodeURIComponent(handle)}/statuses?count=25`).then(r => r.json());
        if (twDirect && twDirect.code === 200) {
          tweetsResults = twDirect.results || [];
          nextCursor = twDirect.cursor?.bottom || null;
        }
      } catch (_) {}
    }

    state.allTweetsRaw = tweetsResults;
    state.cursor = nextCursor;

    // 3. Fetch Spaces
    let spacesList = [];
    if (!isStaticHost) {
      try {
        const spacesRes = await fetch(`/api/spaces/${encodeURIComponent(handle)}`);
        const spData = await spacesRes.json();
        if (spData.success && spData.data) {
          spacesList = spData.data.spaces || [];
        }
      } catch (_) {}
    }

    if (!spacesList.length) {
      try {
        const query = `from:${handle} spaces`;
        const spDirect = await fetch(`https://api.fxtwitter.com/2/search?q=${encodeURIComponent(query)}&count=20`).then(r => r.json());
        if (spDirect && spDirect.code === 200 && Array.isArray(spDirect.results)) {
          spDirect.results.forEach(t => {
            const spaceMatch = (t.text || '').match(/(?:x\.com|twitter\.com)\/i\/spaces\/([a-zA-Z0-9]+)/i);
            if (spaceMatch) {
              const sId = spaceMatch[1];
              spacesList.push({
                id: t.id,
                spaceId: sId,
                title: t.text.replace(/https?:\/\/[^\s]+/g, '').trim() || `مساحة @${handle}`,
                url: `https://x.com/i/spaces/${sId}`,
                spacesDashboardUrl: `https://spacesdashboard.com/space/${sId}`,
                created_at: t.created_at,
                likes: t.likes || 0,
                reposts: t.reposts || 0
              });
            }
          });
        }
      } catch (_) {}
    }

    state.spaces = spacesList;
    state.spacesDashboardUrl = `https://spacesdashboard.com/u/${encodeURIComponent(handle)}`;

    // Render Everything
    renderProfile(state.user);
    renderTweets();
    renderSpaces();
    renderMediaGallery();
    renderAnalytics();
    showProfileView();

  } catch (err) {
    console.error('Fetch error:', err);
    showErrorView(err.message || 'حدث خطأ أثناء جلب البيانات. يرجى التأكد من اسم المستخدم والمحاولة مجدداً.');
  }
}

// Load More Tweets (Pagination)
async function loadMoreTweets() {
  if (!state.user || !state.cursor || state.isLoadingMore) return;

  state.isLoadingMore = true;
  elements.btnLoadMoreTweets.disabled = true;
  elements.btnLoadMoreTweets.innerHTML = `<div class="loader-spinner" style="width:18px;height:18px;border-width:2px;margin:0"></div> ${i18n[state.lang].loading_profile}`;

  try {
    const res = await fetch(`/api/tweets/${encodeURIComponent(state.user.screen_name)}?count=25&cursor=${encodeURIComponent(state.cursor)}`);
    const data = await res.json();

    if (data.success && data.data) {
      const newResults = data.data.results || [];
      state.allTweetsRaw = [...state.allTweetsRaw, ...newResults];
      state.cursor = data.data.cursor?.bottom || null;
      renderTweets();
      renderMediaGallery();
      renderAnalytics();
    }
  } catch (err) {
    console.error('Error loading more tweets:', err);
    showToast('تعذر تحميل المزيد من التغريدات حالياً', 'warning');
  } finally {
    state.isLoadingMore = false;
    elements.btnLoadMoreTweets.disabled = false;
    elements.btnLoadMoreTweets.innerHTML = `<i class="fa-solid fa-angles-down"></i> <span>${i18n[state.lang].btn_load_more}</span>`;
  }
}

// Render Profile Header & Stats
function renderProfile(user) {
  // Banner
  if (user.banner_url) {
    elements.profileBanner.style.backgroundImage = `url('${user.banner_url}/1500x500')`;
    elements.btnViewBanner.classList.remove('hidden');
  } else {
    elements.profileBanner.style.backgroundImage = 'linear-gradient(135deg, #1e293b, #0f172a)';
    elements.btnViewBanner.classList.add('hidden');
  }

  // Avatar
  elements.profileAvatar.src = user.avatar_hd || user.avatar_url || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

  // Names
  elements.profileName.textContent = user.name || user.screen_name;
  elements.profileHandle.textContent = `@${user.screen_name}`;

  // Badges (Verified & Protected)
  elements.profileBadge.className = 'verified-badge hidden';
  if (user.verification && user.verification.verified) {
    elements.profileBadge.classList.remove('hidden');
    const vType = user.verification.type || 'individual';
    elements.profileBadge.classList.add(`verified-${vType}`);
    
    if (vType === 'organization' || vType === 'business') {
      elements.profileBadge.innerHTML = '<i class="fa-solid fa-square-check" title="منشأة / شركة موثقة"></i>';
    } else {
      elements.profileBadge.innerHTML = '<i class="fa-solid fa-circle-check" title="حساب موثق"></i>';
    }
  }

  if (user.protected) {
    elements.profileProtected.classList.remove('hidden');
  } else {
    elements.profileProtected.classList.add('hidden');
  }

  // Bio parsing
  elements.profileBio.innerHTML = parseRichText(user.description || '', user.raw_description?.facets);

  // Meta items
  if (user.location) {
    elements.metaLocation.classList.remove('hidden');
    elements.textLocation.textContent = user.location;
  } else {
    elements.metaLocation.classList.add('hidden');
  }

  if (user.website && user.website.url) {
    elements.metaWebsite.classList.remove('hidden');
    elements.linkWebsite.href = user.website.url;
    elements.linkWebsite.textContent = user.website.display_url || user.website.url;
  } else {
    elements.metaWebsite.classList.add('hidden');
  }

  if (user.joined) {
    const joinDate = new Date(user.joined);
    const formattedJoin = joinDate.toLocaleDateString(state.lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long' });
    elements.textJoined.textContent = `${i18n[state.lang].joined_date} ${formattedJoin}`;
  }

  if (user.id) {
    elements.textId.textContent = `ID: ${user.id}`;
  }

  // Stats Counters
  elements.valFollowers.textContent = formatNumber(user.followers || 0);
  elements.valFollowers.title = (user.followers || 0).toLocaleString();

  elements.valFollowing.textContent = formatNumber(user.following || 0);
  elements.valFollowing.title = (user.following || 0).toLocaleString();

  elements.valTweets.textContent = formatNumber(user.statuses || user.tweets || 0);
  elements.valTweets.title = (user.statuses || user.tweets || 0).toLocaleString();

  elements.valMedia.textContent = formatNumber(user.media_count || 0);
  elements.valMedia.title = (user.media_count || 0).toLocaleString();

  elements.valLikes.textContent = formatNumber(user.likes || 0);
  elements.valLikes.title = (user.likes || 0).toLocaleString();

  // Links
  elements.linkOpenX.href = `https://x.com/${user.screen_name}`;
  if (elements.linkSpacesDashboard) {
    elements.linkSpacesDashboard.href = state.spacesDashboardUrl || `https://spacesdashboard.com/u/${user.screen_name}`;
  }
  if (elements.btnOpenSpacesDashTab) {
    elements.btnOpenSpacesDashTab.href = state.spacesDashboardUrl || `https://spacesdashboard.com/u/${user.screen_name}`;
  }
}

// Render Spaces Tab
function renderSpaces() {
  const container = elements.spacesContainer;
  container.innerHTML = '';

  const count = state.spaces ? state.spaces.length : 0;
  if (elements.tabCountSpaces) {
    elements.tabCountSpaces.textContent = count;
  }

  if (count === 0) {
    container.innerHTML = `
      <div class="empty-state glass-panel" style="grid-column: 1 / -1; padding: 3rem 2rem; text-align: center; color: var(--text-muted);">
        <i class="fa-solid fa-microphone-slash" style="font-size: 3rem; margin-bottom: 1rem; color: #c084fc;"></i>
        <h4 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.5rem;">${i18n[state.lang].tab_spaces}</h4>
        <p style="max-width: 540px; margin: 0 auto 1.5rem; line-height: 1.6;">${i18n[state.lang].empty_spaces}</p>
        <a href="${state.spacesDashboardUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-glow">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>${i18n[state.lang].btn_open_in_spacesdash}</span>
        </a>
      </div>
    `;
    return;
  }

  state.spaces.forEach(space => {
    const card = document.createElement('div');
    card.className = 'space-card glass-panel';

    const isLive = space.state === 'LIVE';
    const timeAgo = formatTimeAgo(space.created_timestamp ? space.created_timestamp * 1000 : space.created_at);

    card.innerHTML = `
      <div>
        <div class="space-header">
          <div class="space-icon-box">
            <i class="fa-solid ${isLive ? 'fa-tower-broadcast' : 'fa-microphone-lines'}"></i>
          </div>
          <span class="space-status-badge ${isLive ? 'live' : 'ended'}">
            ${isLive ? '🔴 مباشر الآن' : 'انتهت'}
          </span>
        </div>
        <div style="margin-top: 0.85rem;">
          <h4 class="space-title">${parseRichText(space.title || `مساحة @${state.user?.screen_name}`)}</h4>
          <div class="space-meta" style="margin-top: 0.5rem;">
            <span><i class="fa-regular fa-clock"></i> ${timeAgo}</span>
            <span><i class="fa-regular fa-heart"></i> ${formatNumber(space.likes || 0)}</span>
            <span><i class="fa-solid fa-retweet"></i> ${formatNumber(space.reposts || 0)}</span>
          </div>
        </div>
      </div>

      <div class="space-footer-actions">
        <a href="${space.url}" target="_blank" rel="noopener noreferrer" class="btn-space-open">
          <i class="fa-brands fa-x-twitter"></i>
          <span>${i18n[state.lang].btn_listen_space}</span>
        </a>
        <a href="${space.spacesDashboardUrl}" target="_blank" rel="noopener noreferrer" class="btn-space-open btn-space-sd">
          <i class="fa-solid fa-chart-simple"></i>
          <span>${i18n[state.lang].btn_view_on_sd}</span>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

// Render Tweets Stream
function renderTweets() {
  const container = elements.tweetsContainer;
  container.innerHTML = '';

  // Filter tweets
  let filtered = state.allTweetsRaw;
  if (state.currentFilter === 'original') {
    filtered = filtered.filter(t => !t.reposted_by && !t.replying_to);
  } else if (state.currentFilter === 'media') {
    filtered = filtered.filter(t => t.media && ((t.media.photos && t.media.photos.length > 0) || (t.media.videos && t.media.videos.length > 0)));
  }

  elements.tabCountTweets.textContent = filtered.length;
  elements.timelineCountText.textContent = `${filtered.length} تغريدة معروضة`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state glass-panel" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
        <i class="fa-solid fa-inbox" style="font-size: 2.5rem; margin-bottom: 0.8rem;"></i>
        <p>${i18n[state.lang].empty_tweets}</p>
      </div>
    `;
    elements.loadMoreWrapper.classList.add('hidden');
    return;
  }

  filtered.forEach(tweet => {
    const tweetEl = createTweetCard(tweet);
    container.appendChild(tweetEl);
  });

  // Show or hide pagination button
  if (state.cursor) {
    elements.loadMoreWrapper.classList.remove('hidden');
  } else {
    elements.loadMoreWrapper.classList.add('hidden');
  }
}

// Create Tweet Card DOM Element
function createTweetCard(tweet) {
  const card = document.createElement('article');
  card.className = 'tweet-card glass-panel';

  const author = tweet.author || state.user || {};
  const isRepost = !!tweet.reposted_by;
  const timeAgo = formatTimeAgo(tweet.created_timestamp ? tweet.created_timestamp * 1000 : tweet.created_at);

  let repostHtml = '';
  if (isRepost) {
    repostHtml = `
      <div class="tweet-repost-banner">
        <i class="fa-solid fa-retweet"></i>
        <span>${i18n[state.lang].reposted_by} ${escapeHtml(tweet.reposted_by.name || tweet.reposted_by.screen_name)}</span>
      </div>
    `;
  }

  // Media Grid HTML
  let mediaHtml = '';
  if (tweet.media) {
    if (tweet.media.videos && tweet.media.videos.length > 0) {
      const vid = tweet.media.videos[0];
      const highestFormat = vid.formats?.find(f => f.container === 'mp4') || vid.formats?.[0];
      if (highestFormat) {
        mediaHtml = `
          <div class="tweet-video-wrapper" style="margin-bottom:1rem;">
            <video controls preload="metadata" poster="${vid.thumbnail_url || ''}" class="media-video-player">
              <source src="${highestFormat.url}" type="video/mp4">
              متصفحك لا يدعم تشغيل هذا الفيديو.
            </video>
          </div>
        `;
      }
    } else if (tweet.media.photos && tweet.media.photos.length > 0) {
      const count = Math.min(tweet.media.photos.length, 4);
      const itemsHtml = tweet.media.photos.slice(0, 4).map(p => `
        <div class="media-item" onclick="openLightbox('${p.url}')">
          <img src="${p.url}" alt="Tweet Image" loading="lazy">
        </div>
      `).join('');

      mediaHtml = `<div class="tweet-media-grid count-${count}">${itemsHtml}</div>`;
    }
  }

  // Quoted Tweet Box
  let quoteHtml = '';
  if (tweet.quote && tweet.quote.type === 'status') {
    const qAuthor = tweet.quote.author || {};
    quoteHtml = `
      <div class="quoted-tweet-box">
        <div class="quoted-header">
          <img src="${qAuthor.avatar_url || ''}" alt="" class="quoted-avatar" onerror="this.style.display='none'">
          <span class="quoted-name">${escapeHtml(qAuthor.name || '')}</span>
          <span class="quoted-handle">@${escapeHtml(qAuthor.screen_name || '')}</span>
        </div>
        <div class="quoted-text">${parseRichText(tweet.quote.text || '')}</div>
      </div>
    `;
  }

  card.innerHTML = `
    ${repostHtml}
    <div class="tweet-header">
      <div class="tweet-author-info">
        <img src="${author.avatar_url || ''}" alt="${escapeHtml(author.name || '')}" class="tweet-avatar" loading="lazy">
        <div class="tweet-author-names">
          <div class="tweet-author-title">
            <span class="tweet-name">${escapeHtml(author.name || '')}</span>
            ${author.verification?.verified ? '<i class="fa-solid fa-circle-check tweet-badge" style="color:var(--x-blue);"></i>' : ''}
          </div>
          <span class="tweet-handle">@${escapeHtml(author.screen_name || '')}</span>
        </div>
      </div>
      <a href="${tweet.url || `https://x.com/${author.screen_name}/status/${tweet.id}`}" target="_blank" rel="noopener noreferrer" class="tweet-time-link" title="${tweet.created_at || ''}">
        ${timeAgo}
      </a>
    </div>

    <div class="tweet-text">${parseRichText(tweet.text || '', tweet.raw_text?.facets)}</div>

    ${mediaHtml}
    ${quoteHtml}

    <div class="tweet-footer">
      <div class="tweet-metrics">
        <div class="metric-item metric-replies" title="الردود">
          <i class="fa-regular fa-comment"></i>
          <span>${formatNumber(tweet.replies || 0)}</span>
        </div>
        <div class="metric-item metric-reposts" title="إعادة التغريد">
          <i class="fa-solid fa-retweet"></i>
          <span>${formatNumber(tweet.reposts || 0)}</span>
        </div>
        <div class="metric-item metric-likes" title="الإعجابات">
          <i class="fa-regular fa-heart"></i>
          <span>${formatNumber(tweet.likes || 0)}</span>
        </div>
        ${tweet.views ? `
          <div class="metric-item metric-views" title="المشاهدات">
            <i class="fa-solid fa-chart-simple"></i>
            <span>${formatNumber(tweet.views)}</span>
          </div>
        ` : ''}
        ${tweet.bookmarks ? `
          <div class="metric-item metric-bookmarks" title="الإشارات المرجعية">
            <i class="fa-regular fa-bookmark"></i>
            <span>${formatNumber(tweet.bookmarks)}</span>
          </div>
        ` : ''}
      </div>

      <div class="tweet-tools">
        <button class="btn-tweet-action btn-copy-tweet" title="نسخ نص التغريدة" data-text="${escapeHtml(tweet.text || '')}">
          <i class="fa-regular fa-copy"></i>
        </button>
        <a href="${tweet.url || `https://x.com/${author.screen_name}/status/${tweet.id}`}" target="_blank" rel="noopener noreferrer" class="btn-tweet-action" title="فتح في X">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    </div>
  `;

  // Attach copy listener
  const copyBtn = card.querySelector('.btn-copy-tweet');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(tweet.text || '');
      showToast(i18n[state.lang].toast_copied_tweet, 'success');
    });
  }

  return card;
}

// Render Media Gallery Grid
function renderMediaGallery() {
  const container = elements.mediaGalleryContainer;
  container.innerHTML = '';

  const mediaItems = [];
  state.allTweetsRaw.forEach(tweet => {
    if (!tweet.media) return;
    if (tweet.media.photos) {
      tweet.media.photos.forEach(p => {
        mediaItems.push({ type: 'photo', url: p.url, tweet });
      });
    }
    if (tweet.media.videos) {
      tweet.media.videos.forEach(v => {
        mediaItems.push({ type: 'video', url: v.thumbnail_url || '', videoUrl: v.formats?.[0]?.url, tweet });
      });
    }
  });

  elements.tabCountMedia.textContent = mediaItems.length;

  if (mediaItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state glass-panel" style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted);">
        <i class="fa-regular fa-image" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>لا توجد وسائط تم جلبها لهذا الحساب حتى الآن.</p>
      </div>
    `;
    return;
  }

  mediaItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${item.url}" alt="" loading="lazy">
      <div class="gallery-type-badge">
        <i class="fa-solid ${item.type === 'video' ? 'fa-video' : 'fa-image'}"></i>
      </div>
      <div class="gallery-overlay">
        <div class="gallery-stats">
          <span><i class="fa-regular fa-heart"></i> ${formatNumber(item.tweet.likes || 0)}</span>
          <span><i class="fa-solid fa-retweet"></i> ${formatNumber(item.tweet.reposts || 0)}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(item.url);
    });

    container.appendChild(card);
  });
}

// Render Analytics Tab
function renderAnalytics() {
  const tweets = state.allTweetsRaw;
  if (!tweets.length) return;

  let totalLikes = 0;
  let totalReposts = 0;
  let totalReplies = 0;
  let mediaCount = 0;
  const hashtagMap = {};

  tweets.forEach(t => {
    totalLikes += (t.likes || 0);
    totalReposts += (t.reposts || 0);
    totalReplies += (t.replies || 0);
    if (t.media && ((t.media.photos && t.media.photos.length) || (t.media.videos && t.media.videos.length))) {
      mediaCount++;
    }

    // Extract hashtags
    const matches = (t.text || '').match(/#([a-zA-Z0-9_\u0600-\u06FF]+)/g);
    if (matches) {
      matches.forEach(tag => {
        const clean = tag.toLowerCase();
        hashtagMap[clean] = (hashtagMap[clean] || 0) + 1;
      });
    }
  });

  const avgLikes = Math.round(totalLikes / tweets.length);
  const avgReposts = Math.round(totalReposts / tweets.length);
  const avgReplies = Math.round(totalReplies / tweets.length);
  const mediaRatio = Math.round((mediaCount / tweets.length) * 100);

  elements.metricAvgLikes.textContent = avgLikes.toLocaleString();
  elements.metricAvgReposts.textContent = avgReposts.toLocaleString();
  elements.metricAvgReplies.textContent = avgReplies.toLocaleString();
  elements.metricMediaRatio.textContent = `${mediaRatio}%`;

  // Render top hashtags
  const sortedTags = Object.entries(hashtagMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const hashtagsContainer = elements.hashtagsCloud;
  hashtagsContainer.innerHTML = '';

  if (sortedTags.length === 0) {
    hashtagsContainer.innerHTML = `<p class="empty-hint">${i18n[state.lang].no_hashtags}</p>`;
  } else {
    sortedTags.forEach(([tag, count]) => {
      const pill = document.createElement('span');
      pill.className = 'hashtag-pill';
      pill.innerHTML = `<span>${escapeHtml(tag)}</span> <span class="hashtag-count">${count}</span>`;
      hashtagsContainer.appendChild(pill);
    });
  }

  // Account trust & metadata
  if (state.user) {
    const vType = state.user.verification?.type || (state.user.verification?.verified ? 'individual' : 'none');
    elements.metricVerificationType.textContent = vType === 'organization' ? 'شركة / منظمة موثقة (Gold)' : vType === 'individual' ? 'فرد موثق (Blue)' : 'غير موثق (Unverified)';
    
    if (state.user.joined) {
      const joinYear = new Date(state.user.joined).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - joinYear;
      elements.metricAccountAge.textContent = `${age} سنوات (منذ ${joinYear})`;
    }

    elements.metricProtectedStatus.textContent = state.user.protected ? 'حساب خاص (Protected)' : 'عام متاح للجميع (Public)';
  }
}

// Load Trends
async function loadTrends() {
  const container = elements.trendsList;
  try {
    const res = await fetch('/api/trends');
    const data = await res.json();
    const trends = data.data || [];

    if (trends.length === 0) {
      container.innerHTML = '<p class="empty-hint" style="grid-column:1/-1;">التريندات غير متاحة حالياً</p>';
      return;
    }

    container.innerHTML = '';
    trends.slice(0, 8).forEach(trend => {
      const item = document.createElement('div');
      item.className = 'trend-item';
      item.innerHTML = `
        <span class="trend-context">${escapeHtml(trend.context || 'شائع في إكس')}</span>
        <span class="trend-name">${escapeHtml(trend.name)}</span>
      `;
      item.addEventListener('click', () => {
        // Search query or hashtag
        fetchUserData(trend.name.replace(/^#/, ''));
      });
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading trends:', err);
    container.innerHTML = '<p class="empty-hint" style="grid-column:1/-1;">تعذر تحميل التريندات</p>';
  }
}

// View State Switchers
function showHeroView() {
  elements.heroSection.classList.remove('hidden');
  elements.profileSection.classList.add('hidden');
  elements.loadingSection.classList.add('hidden');
  elements.errorSection.classList.add('hidden');
  elements.heroSearchInput.value = '';
  elements.navSearchInput.value = '';
  window.history.pushState({}, '', window.location.pathname);
}

function showLoadingView() {
  elements.heroSection.classList.add('hidden');
  elements.profileSection.classList.add('hidden');
  elements.errorSection.classList.add('hidden');
  elements.loadingSection.classList.remove('hidden');
}

function showProfileView() {
  elements.heroSection.classList.add('hidden');
  elements.loadingSection.classList.add('hidden');
  elements.errorSection.classList.add('hidden');
  elements.profileSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showErrorView(message) {
  elements.heroSection.classList.add('hidden');
  elements.loadingSection.classList.add('hidden');
  elements.profileSection.classList.add('hidden');
  elements.errorSection.classList.remove('hidden');
  elements.errorMessage.textContent = message;
}

// Switch Tabs
function switchTab(tabId) {
  state.currentTab = tabId;
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// Lightbox
function openLightbox(imageUrl) {
  elements.lightboxImage.src = imageUrl;
  elements.lightboxDownloadBtn.href = imageUrl;
  elements.lightboxModal.classList.remove('hidden');
}

function closeLightbox() {
  elements.lightboxModal.classList.add('hidden');
  elements.lightboxImage.src = '';
}

// Export Modal & Downloads
function openExportModal() {
  elements.exportModal.classList.remove('hidden');
}

function closeExportModal() {
  elements.exportModal.classList.add('hidden');
}

function downloadJSON() {
  if (!state.user) return;
  const payload = {
    profile: state.user,
    exported_at: new Date().toISOString(),
    tweets: state.allTweetsRaw
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.user.screen_name}_twitter_archive.json`;
  a.click();
  URL.revokeObjectURL(url);
  closeExportModal();
  showToast('تم تصدير ملف JSON بنجاح!', 'success');
}

function downloadCSV() {
  if (!state.user) return;
  const headers = ['Tweet ID', 'Date', 'Text', 'Likes', 'Reposts', 'Replies', 'Views', 'Media URLs'];
  const rows = state.allTweetsRaw.map(t => {
    const mediaUrls = (t.media?.photos || []).map(p => p.url).join(' | ');
    return [
      `"${t.id || ''}"`,
      `"${t.created_at || ''}"`,
      `"${(t.text || '').replace(/"/g, '""')}"`,
      t.likes || 0,
      t.reposts || 0,
      t.replies || 0,
      t.views || 0,
      `"${mediaUrls}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.user.screen_name}_tweets.csv`;
  a.click();
  URL.revokeObjectURL(url);
  closeExportModal();
  showToast('تم تصدير ملف CSV بنجاح!', 'success');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}" style="color:var(--x-blue);"></i> <span>${escapeHtml(message)}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Helpers
function formatNumber(num) {
  if (typeof num !== 'number') num = Number(num) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return state.lang === 'ar' ? 'الآن' : 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${state.lang === 'ar' ? ' د' : 'm'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${state.lang === 'ar' ? ' س' : 'h'}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}${state.lang === 'ar' ? ' ي' : 'd'}`;

  return date.toLocaleDateString(state.lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' });
}

function parseRichText(text, facets) {
  if (!text) return '';
  let escaped = escapeHtml(text);

  // Parse URLs
  escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tweet-link">${url}</a>`;
  });

  // Parse Hashtags
  escaped = escaped.replace(/#([a-zA-Z0-9_\u0600-\u06FF]+)/g, (match, tag) => {
    return `<span class="tweet-hashtag" onclick="fetchUserData('${tag}')">${match}</span>`;
  });

  // Parse Mentions
  escaped = escaped.replace(/@([a-zA-Z0-9_]+)/g, (match, username) => {
    return `<span class="tweet-mention" dir="ltr" style="unicode-bidi:isolate;" onclick="fetchUserData('${username}')">@${username}</span>`;
  });

  return escaped;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Make global helper accessible to inline onclick
window.openLightbox = openLightbox;
window.fetchUserData = fetchUserData;
