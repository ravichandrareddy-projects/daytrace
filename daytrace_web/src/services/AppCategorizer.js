/**
 * AppCategorizer — Automatically categorize apps by name/package
 * 
 * Categories: social, entertainment, productivity, communication,
 * finance, shopping, gaming, fitness, education, utility, call, other
 */

export const APP_CATEGORIES = {
  social: { label: 'Social', color: '#ef4444', icon: '📱', bgClass: 'bg-red-500/15 text-red-500' },
  entertainment: { label: 'Entertainment', color: '#f59e0b', icon: '🎬', bgClass: 'bg-amber-500/15 text-amber-500' },
  productivity: { label: 'Productivity', color: '#22c55e', icon: '💻', bgClass: 'bg-emerald-500/15 text-emerald-500' },
  communication: { label: 'Communication', color: '#3b82f6', icon: '💬', bgClass: 'bg-blue-500/15 text-blue-500' },
  finance: { label: 'Finance', color: '#8b5cf6', icon: '💳', bgClass: 'bg-violet-500/15 text-violet-500' },
  shopping: { label: 'Shopping', color: '#ec4899', icon: '🛒', bgClass: 'bg-pink-500/15 text-pink-500' },
  gaming: { label: 'Gaming', color: '#f97316', icon: '🎮', bgClass: 'bg-orange-500/15 text-orange-500' },
  fitness: { label: 'Fitness', color: '#14b8a6', icon: '🏃', bgClass: 'bg-teal-500/15 text-teal-500' },
  education: { label: 'Education', color: '#06b6d4', icon: '📚', bgClass: 'bg-cyan-500/15 text-cyan-500' },
  utility: { label: 'Utility', color: '#6b7280', icon: '⚙️', bgClass: 'bg-gray-500/15 text-gray-500' },
  call: { label: 'Phone Call', color: '#10b981', icon: '📞', bgClass: 'bg-emerald-500/15 text-emerald-500' },
  browser: { label: 'Browser', color: '#6366f1', icon: '🌐', bgClass: 'bg-indigo-500/15 text-indigo-500' },
  other: { label: 'Other', color: '#94a3b8', icon: '📱', bgClass: 'bg-slate-500/15 text-slate-500' },
};

// Keywords → category mapping
const CATEGORY_RULES = [
  // Social Media
  { keywords: ['instagram', 'facebook', 'twitter', 'x.com', 'tiktok', 'snapchat', 'reddit', 'threads', 'pinterest', 'linkedin', 'tumblr', 'mastodon', 'bereal'], category: 'social' },
  
  // Entertainment
  { keywords: ['youtube', 'netflix', 'prime video', 'hotstar', 'disney', 'spotify', 'jiosaan', 'jiosaavn', 'gaana', 'wynk', 'apple music', 'twitch', 'vlc', 'mx player', 'voot', 'zee5', 'sonyliv', 'mubi', 'crunchyroll', 'soundcloud'], category: 'entertainment' },
  
  // Gaming
  { keywords: ['free fire', 'pubg', 'bgmi', 'call of duty', 'cod', 'genshin', 'roblox', 'minecraft', 'clash', 'candy crush', 'asphalt', 'steam', 'epic games', 'valorant', 'fortnite', 'among us', 'ludo', 'chess.com', 'wordle'], category: 'gaming' },
  
  // Productivity
  { keywords: ['vs code', 'visual studio', 'intellij', 'android studio', 'xcode', 'terminal', 'iterm', 'sublime', 'atom', 'notion', 'obsidian', 'todoist', 'trello', 'asana', 'jira', 'figma', 'canva', 'photoshop', 'illustrator', 'excel', 'word', 'powerpoint', 'google docs', 'google sheets', 'google slides', 'cursor', 'webstorm', 'pycharm', 'neovim', 'vim', 'emacs', 'postman', 'insomnia', 'daytrace'], category: 'productivity' },
  
  // Communication
  { keywords: ['whatsapp', 'telegram', 'signal', 'discord', 'slack', 'teams', 'zoom', 'google meet', 'skype', 'facetime', 'duo', 'messages', 'sms', 'imessage', 'line', 'wechat', 'viber'], category: 'communication' },
  
  // Finance / UPI
  { keywords: ['gpay', 'google pay', 'phonepe', 'paytm', 'bhim', 'cred', 'mobikwik', 'freecharge', 'amazon pay', 'navi', 'slice', 'fi money', 'jupiter', 'groww', 'zerodha', 'kite', 'upstox', 'angel one', 'coin', 'payzapp', 'yono', 'imobile', 'axis mobile', 'bank of baroda', 'union bank', 'icici', 'hdfc', 'sbi', 'kotak', 'bank'], category: 'finance' },
  
  // Shopping
  { keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'shopee', 'shein', 'nykaa', 'swiggy', 'zomato', 'blinkit', 'dunzo', 'bigbasket', 'jiomart', 'uber eats', 'dominos', 'starbucks', 'rapido', 'ola', 'uber', 'irctc', 'makemytrip', 'booking.com', 'airbnb'], category: 'shopping' },
  
  // Education
  { keywords: ['udemy', 'coursera', 'khan academy', 'byju', 'unacademy', 'leetcode', 'hackerrank', 'codeforces', 'codechef', 'geeksforgeeks', 'w3schools', 'mdn', 'stackoverflow', 'duolingo', 'kindle', 'google classroom', 'edx', 'skillshare', 'brilliant'], category: 'education' },
  
  // Fitness
  { keywords: ['strava', 'fitbit', 'nike', 'google fit', 'health', 'workout', 'peloton', 'myfitnesspal', 'calm', 'headspace', 'sleep cycle'], category: 'fitness' },
  
  // Browser
  { keywords: ['chrome', 'firefox', 'safari', 'edge', 'brave', 'opera', 'arc', 'vivaldi'], category: 'browser' },
  
  // Phone
  { keywords: ['phone', 'call', 'dialer', 'contacts'], category: 'call' },
  
  // Utility
  { keywords: ['settings', 'calculator', 'clock', 'alarm', 'calendar', 'notes', 'files', 'gallery', 'photos', 'camera', 'maps', 'weather', 'compass', 'flashlight', 'recorder'], category: 'utility' },
];

/**
 * Categorize an app by its name
 */
export function categorizeApp(appName) {
  if (!appName) return 'other';
  const name = appName.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (name.includes(keyword)) {
        return rule.category;
      }
    }
  }

  return 'other';
}

/**
 * Get category info (color, icon, label)
 */
export function getCategoryInfo(category) {
  return APP_CATEGORIES[category] || APP_CATEGORIES.other;
}

/**
 * Check if an app is a "distraction" (not productivity/education)
 */
export function isDistraction(appName) {
  const cat = categorizeApp(appName);
  return !['productivity', 'education', 'utility'].includes(cat);
}
