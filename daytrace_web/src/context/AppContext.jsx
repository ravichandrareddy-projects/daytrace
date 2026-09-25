import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095, name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, name: 'Euro' },
  ETB: { code: 'ETB', symbol: 'Br ', rate: 1.45, name: 'Ethiopian Birr' },
  JPY: { code: 'JPY', symbol: '¥', rate: 1.78, name: 'Japanese Yen' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, name: 'UAE Dirham' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 0.016, name: 'Canadian Dollar' },
};

export const getTodayDateKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateKey) => {
  if (!dateKey) return '';
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateKey;
  }
};

export const shiftDateKey = (dateKey, days) => {
  try {
    const [y, m, d] = (dateKey || getTodayDateKey()).split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return getTodayDateKey();
  }
};

export const MOBILE_STORAGE_KEY = 'daytrace_mobile_clean_v2';

const INITIAL_STATE = {
  activeTab: 'today', // today | timeline | money | memories | more
  currency: 'INR',
  searchQuery: '',
  isSearchOpen: false,
  activeReportModal: null, // null | 'today' | 'money' | 'timeline' | 'memory'
  isAddBlockOpen: false,
  isAddExpenseOpen: false,
  isLiveActionOpen: false,
  liveActionType: null, // 'stop' | 'edit' | 'note' | 'voice'
  isReviewCutoffOpen: false,
  selectedDate: getTodayDateKey(),
  
  // Live Active Focus Session (Clean Initial State - Ready for User)
  liveFocus: {
    isRunning: false,
    title: 'Daily Focus Session',
    subtitle: 'Tap to start or customize your live focus track',
    category: 'Deep Work',
    tag: 'READY · FOCUS · 45 MIN',
    startTimeStr: '--:--',
    endTimeStr: '--:--',
    totalMinutes: 45,
    elapsedSeconds: 0,
    streak: 1,
    focusScore: 100,
    notes: [],
    distractions: [] // Auto-tracked apps opened during this session
  },

  // 24/7 App Usage Tracking Logs
  appUsageLogs: [],

  // Daily Todos partitioned by date: { [dateKey]: [] }
  // Changes daily! Each day is its own clean slate.
  todosByDate: {},

  // Hourly Timeline Logs partitioned by date: { [dateKey]: [] }
  // Changes daily! Each day tracks its own 24-hour log.
  hourlyLogsByDate: {},

  // Active day's reactive lists
  todos: [],
  hourlyLogs: [],
  scheduleBlocks: [],

  // Money Hub Ledger & Metrics (Clean slate for real entries)
  moneyState: {
    totalDeployedINR: 0.00,
    maxCapINR: 25000.00,
    paceDifferenceINR: 0.00,
    todayFlowINR: 0.00,
    todayFlowCount: 0,
    runwayLeftINR: 25000.00,
    daysLeftInCycle: 30,
    ingressAlert: {
      visible: false,
      timeAgo: '',
      vendor: '',
      amountINR: 0,
      note: '',
      category: 'Food & Dining',
      attributionPills: []
    },
    categoryDistribution: [],
    transactions: []
  },

  // Visual Memories (Clean slate for real captures)
  memoryState: {
    totalItems: 0,
    activeFilter: 'all',
    searchFilter: '',
    items: []
  },

  // Brainstorming & Research Ideas Vault
  ideas: [],

  // Settings & Daemons
  settings: {
    userName: 'User',
    userEmail: 'user@daytrace.local',
    tier: 'PRO TIER',
    theme: 'aurora', // aurora | rainbow | aurora_white
    gpuShimmer: true,
    followSystemTheme: false,
    daemons: {
      smsParser: true,
      screenTime: true,
      visionOcr: true
    }
  }
};

export const getInitialActiveTab = () => {
  if (typeof window !== 'undefined' && window.location?.hash) {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['today', 'timeline', 'money', 'ideas', 'memories', 'more', 'settings'].includes(hash)) {
      return hash === 'settings' ? 'more' : hash;
    }
  }
  return 'today';
};

export const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme')?.toLowerCase();
    if (themeParam && ['aurora', 'plain_black', 'plain_white', 'rainbow', 'aurora_white'].includes(themeParam)) {
      return themeParam;
    }
  }
  return null;
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    // Purge legacy mock data caches
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        ['daytrace_master_state_v4', 'daytrace_master_state_v3', 'daytrace_master_state_v2', 'daytrace_state', 'daytrace_mobile_vault_clean_v1'].forEach(k => {
          localStorage.removeItem(k);
        });
      } catch (e) {}
    }

    const initialTab = getInitialActiveTab();
    const urlTheme = getInitialTheme();

    try {
      const saved = localStorage.getItem(MOBILE_STORAGE_KEY);
      const today = getTodayDateKey();
      if (saved) {
        const parsed = JSON.parse(saved);
        const activeDate = parsed.selectedDate || today;
        const dateTodos = parsed.todosByDate?.[activeDate] || parsed.todos || [];
        const dateHourlyLogs = parsed.hourlyLogsByDate?.[activeDate] || parsed.hourlyLogs || [];
        return {
          ...INITIAL_STATE,
          ...parsed,
          activeTab: initialTab !== 'today' ? initialTab : (parsed.activeTab || 'today'),
          selectedDate: activeDate,
          todos: dateTodos,
          hourlyLogs: dateHourlyLogs,
          settings: {
            ...INITIAL_STATE.settings,
            ...(parsed.settings || {}),
            theme: urlTheme || parsed.settings?.theme || INITIAL_STATE.settings.theme
          }
        };
      }
    } catch (e) {
      console.warn('Error reading mobile storage:', e);
    }
    return {
      ...INITIAL_STATE,
      activeTab: initialTab,
      settings: {
        ...INITIAL_STATE.settings,
        theme: urlTheme || INITIAL_STATE.settings.theme
      }
    };
  });

  // Save to mobile storage on change
  useEffect(() => {
    try {
      localStorage.setItem(MOBILE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error saving to mobile storage:', e);
    }
  }, [state]);

  // Sync theme to documentElement for global CSS styling
  useEffect(() => {
    const currentTheme = state?.settings?.theme || 'aurora';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      if (currentTheme === 'aurora' || currentTheme === 'aurora_night') {
        document.documentElement.classList.add('dark', 'theme-aurora');
      } else {
        document.documentElement.classList.remove('dark', 'theme-aurora');
      }
    }
  }, [state?.settings?.theme]);

  // Live timer tick for Python Practice session
  useEffect(() => {
    if (!state.liveFocus.isRunning) return;
    const interval = setInterval(() => {
      setState(prev => {
        const nextElapsed = prev.liveFocus.elapsedSeconds + 1;
        const elapsedMins = Math.floor(nextElapsed / 60);
        const percent = Math.min(100, Math.round((elapsedMins / prev.liveFocus.totalMinutes) * 100));
        
        return {
          ...prev,
          liveFocus: {
            ...prev.liveFocus,
            elapsedSeconds: nextElapsed
          }
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.liveFocus.isRunning]);

  // Navigation
  const setActiveTab = (tab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Currency Converter Formatter
  const formatMoney = (inrValue, options = {}) => {
    const curr = CURRENCIES[state.currency] || CURRENCIES.INR;
    const converted = inrValue * curr.rate;
    const decimals = options.noDecimals ? 0 : (curr.code === 'JPY' ? 0 : 2);
    
    const formattedNum = Math.abs(converted).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    const prefix = inrValue < 0 ? '-' : (options.withPlus && inrValue > 0 ? '+' : '');
    return `${prefix}${curr.symbol}${formattedNum}`;
  };

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setState(prev => ({ ...prev, currency: code }));
    }
  };

  // Live Focus Session Controls
  const toggleLiveFocusTimer = () => {
    setState(prev => ({
      ...prev,
      liveFocus: {
        ...prev.liveFocus,
        isRunning: !prev.liveFocus.isRunning
      }
    }));
  };

  const openLiveActionModal = (type) => {
    setState(prev => ({
      ...prev,
      isLiveActionOpen: true,
      liveActionType: type
    }));
  };

  const closeLiveActionModal = () => {
    setState(prev => ({
      ...prev,
      isLiveActionOpen: false,
      liveActionType: null
    }));
  };

  const addFocusNote = (noteText) => {
    if (!noteText.trim()) return;
    setState(prev => ({
      ...prev,
      liveFocus: {
        ...prev.liveFocus,
        notes: [noteText.trim(), ...prev.liveFocus.notes]
      }
    }));
  };

  // Date Navigation & Daily Partitioning
  const setSelectedDate = (dateKey) => {
    setState(prev => {
      const activeTodos = prev.todosByDate?.[dateKey] || [];
      const activeHourly = prev.hourlyLogsByDate?.[dateKey] || [];
      return {
        ...prev,
        selectedDate: dateKey,
        todos: activeTodos,
        hourlyLogs: activeHourly
      };
    });
  };

  // Reset entire vault to clean slate
  const resetVault = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(MOBILE_STORAGE_KEY);
      } catch (e) {}
    }
    setState({
      ...INITIAL_STATE,
      selectedDate: getTodayDateKey()
    });
  };

  // ==========================================
  // 1. TODAY'S TODO LIST CRUD (Partitioned by Date)
  // ==========================================
  const addTodo = (newTodo, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.todosByDate?.[date] || [];
      const item = {
        id: 'todo_' + Date.now(),
        title: newTodo.title || 'New Task',
        completed: false,
        priority: newTodo.priority || 'medium',
        category: newTodo.category || 'General',
        time: newTodo.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: newTodo.note || '',
        date
      };
      const updatedList = [item, ...currentList];
      const updatedTodosByDate = {
        ...prev.todosByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        todosByDate: updatedTodosByDate,
        todos: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.todos
      };
    });
  };

  const toggleTodo = (id, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.todosByDate?.[date] || prev.todos || [];
      const updatedList = currentList.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const updatedTodosByDate = {
        ...prev.todosByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        todosByDate: updatedTodosByDate,
        todos: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.todos
      };
    });
  };

  const editTodo = (id, updatedFields, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.todosByDate?.[date] || prev.todos || [];
      const updatedList = currentList.map(t => t.id === id ? { ...t, ...updatedFields } : t);
      const updatedTodosByDate = {
        ...prev.todosByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        todosByDate: updatedTodosByDate,
        todos: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.todos
      };
    });
  };

  const deleteTodo = (id, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.todosByDate?.[date] || prev.todos || [];
      const updatedList = currentList.filter(t => t.id !== id);
      const updatedTodosByDate = {
        ...prev.todosByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        todosByDate: updatedTodosByDate,
        todos: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.todos
      };
    });
  };

  // ==========================================
  // 2. HOURLY TIMELINE LOG CRUD (Partitioned by Date)
  // ==========================================
  const addHourlyLog = (newLog, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.hourlyLogsByDate?.[date] || [];
      const item = {
        id: 'hl_' + Date.now(),
        hourSlot: newLog.hourSlot || '04:00 - 05:00 PM',
        time: newLog.time || '04:00 PM',
        title: newLog.title || 'New Hourly Activity',
        description: newLog.description || 'Logged activity during this hour.',
        category: newLog.category || 'Deep Work',
        durationMinutes: parseInt(newLog.durationMinutes || 60, 10),
        done: typeof newLog.done === 'boolean' ? newLog.done : true,
        tag: newLog.tag || 'RECORDED',
        date
      };
      const updatedList = [...currentList, item];
      const updatedHourlyByDate = {
        ...prev.hourlyLogsByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        hourlyLogsByDate: updatedHourlyByDate,
        hourlyLogs: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.hourlyLogs
      };
    });
  };

  const editHourlyLog = (id, updatedFields, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.hourlyLogsByDate?.[date] || prev.hourlyLogs || [];
      const updatedList = currentList.map(hl => hl.id === id ? { ...hl, ...updatedFields } : hl);
      const updatedHourlyByDate = {
        ...prev.hourlyLogsByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        hourlyLogsByDate: updatedHourlyByDate,
        hourlyLogs: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.hourlyLogs
      };
    });
  };

  const deleteHourlyLog = (id, targetDate) => {
    setState(prev => {
      const date = targetDate || prev.selectedDate || getTodayDateKey();
      const currentList = prev.hourlyLogsByDate?.[date] || prev.hourlyLogs || [];
      const updatedList = currentList.filter(hl => hl.id !== id);
      const updatedHourlyByDate = {
        ...prev.hourlyLogsByDate,
        [date]: updatedList
      };
      return {
        ...prev,
        hourlyLogsByDate: updatedHourlyByDate,
        hourlyLogs: date === (prev.selectedDate || getTodayDateKey()) ? updatedList : prev.hourlyLogs
      };
    });
  };

  // Legacy Schedule Block Controls for backwards compatibility
  const toggleScheduleBlock = (blockId) => {
    setState(prev => {
      const updated = prev.scheduleBlocks.map(block => {
        if (block.id === blockId) {
          return { ...block, done: !block.done };
        }
        return block;
      });
      return { ...prev, scheduleBlocks: updated };
    });
  };

  const addScheduleBlock = (newBlock) => {
    const blockId = 'sb_' + Date.now();
    const duration = parseInt(newBlock.durationMinutes || 45, 10);
    const formatted = {
      id: blockId,
      time: newBlock.time || '10:00 AM',
      category: newBlock.category || 'Focus',
      categoryTag: newBlock.categoryTag || 'ACTIVE',
      title: newBlock.title || 'New Schedule Block',
      subtitle: newBlock.subtitle || 'Custom logged activity for today',
      durationMinutes: duration,
      done: newBlock.done || false,
      icon: newBlock.icon || 'task_alt',
      matchStatus: `${duration}m scheduled`
    };

    setState(prev => ({
      ...prev,
      scheduleBlocks: [...prev.scheduleBlocks, formatted],
      isAddBlockOpen: false
    }));
  };

  const editScheduleBlock = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      scheduleBlocks: prev.scheduleBlocks.map(b => b.id === id ? { ...b, ...updatedFields } : b)
    }));
  };

  const deleteScheduleBlock = (id) => {
    setState(prev => ({
      ...prev,
      scheduleBlocks: prev.scheduleBlocks.filter(b => b.id !== id)
    }));
  };

  // Money Actions
  const addTransaction = (tx) => {
    const amountNum = parseFloat(tx.amountINR || 0);
    const isExpense = amountNum < 0 || tx.type === 'expense';
    const finalAmountINR = isExpense ? -Math.abs(amountNum) : Math.abs(amountNum);

    const newTx = {
      id: 'tx_' + Date.now(),
      title: tx.title || 'Custom Expense',
      amountINR: finalAmountINR,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · App Input',
      dateGroup: 'TODAY · 16 SEP',
      category: tx.category || 'Food & Dining',
      icon: tx.icon || (isExpense ? 'payments' : 'account_balance_wallet')
    };

    setState(prev => {
      const ms = prev.moneyState;
      const newTodayFlow = ms.todayFlowINR + Math.abs(finalAmountINR);
      const newTotalDeployed = ms.totalDeployedINR + Math.abs(finalAmountINR);
      const newRunway = Math.max(0, ms.maxCapINR - newTotalDeployed);

      const updatedCat = ms.categoryDistribution.map(cat => {
        if (cat.name.toLowerCase().includes((tx.category || '').toLowerCase().slice(0, 4))) {
          return { ...cat, amountINR: cat.amountINR + Math.abs(finalAmountINR) };
        }
        return cat;
      });

      return {
        ...prev,
        isAddExpenseOpen: false,
        moneyState: {
          ...ms,
          totalDeployedINR: newTotalDeployed,
          todayFlowINR: newTodayFlow,
          todayFlowCount: ms.todayFlowCount + 1,
          runwayLeftINR: newRunway,
          categoryDistribution: updatedCat,
          transactions: [newTx, ...ms.transactions]
        }
      };
    });
  };

  const confirmIngress = (category = 'Food & Dining') => {
    setState(prev => {
      const ms = prev.moneyState;
      const ingress = ms.ingressAlert;
      if (!ingress.visible) return prev;

      const newTx = {
        id: 'tx_ingress_' + Date.now(),
        title: ingress.vendor,
        amountINR: -Math.abs(ingress.amountINR),
        time: 'Just now · PhonePe UPI',
        dateGroup: 'TODAY · 16 SEP',
        category,
        icon: 'local_cafe'
      };

      const newTodayFlow = ms.todayFlowINR + ingress.amountINR;
      const newTotalDeployed = ms.totalDeployedINR + ingress.amountINR;
      const newRunway = Math.max(0, ms.maxCapINR - newTotalDeployed);

      return {
        ...prev,
        moneyState: {
          ...ms,
          totalDeployedINR: newTotalDeployed,
          todayFlowINR: newTodayFlow,
          todayFlowCount: ms.todayFlowCount + 1,
          runwayLeftINR: newRunway,
          ingressAlert: { ...ingress, visible: false },
          transactions: [newTx, ...ms.transactions]
        }
      };
    });
  };

  const dismissIngress = () => {
    setState(prev => ({
      ...prev,
      moneyState: {
        ...prev.moneyState,
        ingressAlert: { ...prev.moneyState.ingressAlert, visible: false }
      }
    }));
  };

  // Memory Actions
  const addMemoryItem = (memory) => {
    const newItem = {
      id: 'mem_' + Date.now(),
      type: memory.type || 'receipt',
      badge: memory.badge || 'MANUAL CAPTURE // OCR',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: memory.title || 'Scanned Document Frame',
      description: memory.description || 'Processed neural OCR trace with automatic entity detection.',
      tags: memory.tags || ['#Receipt', '#DayTrace'],
      amountINR: memory.amountINR,
      paymentMode: memory.paymentMode
    };

    setState(prev => ({
      ...prev,
      memoryState: {
        ...prev.memoryState,
        totalItems: prev.memoryState.totalItems + 1,
        items: [newItem, ...prev.memoryState.items]
      }
    }));
  };

  // Settings & Daemon Actions
  const updateUserProfile = ({ userName, userEmail, tier }) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        userName: userName !== undefined ? (userName.trim() || 'User') : prev.settings.userName,
        userEmail: userEmail !== undefined ? (userEmail.trim() || 'user@daytrace.local') : prev.settings.userEmail,
        tier: tier !== undefined ? (tier.trim() || 'PRO TIER') : prev.settings.tier
      }
    }));
  };

  // ==========================================
  // IDEAS & BRAINSTORMING CRUD
  // ==========================================
  const addIdea = (newIdea) => {
    setState(prev => {
      const existing = prev.ideas || [];
      const ideaNum = existing.length + 1;
      const numStr = `#${String(ideaNum).padStart(2, '0')}`;
      const item = {
        id: 'idea_' + Date.now(),
        number: numStr,
        title: newIdea.title || 'Untitled Idea',
        category: newIdea.category || 'Product',
        status: newIdea.status || 'Brainstorming', // Brainstorming | In Progress | Success | Failure | Researching
        matter: newIdea.matter || '',
        researchNotes: newIdea.researchNotes || '',
        tags: newIdea.tags || ['#Brainstorm'],
        dateCreated: new Date().toLocaleDateString(),
        progressLogs: newIdea.progressLogs || [
          {
            id: 'log_' + Date.now(),
            time: new Date().toLocaleDateString() + ' · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: 'Conceived and initialized in Ideas Vault.'
          }
        ]
      };
      return {
        ...prev,
        ideas: [item, ...existing]
      };
    });
  };

  const updateIdea = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      ideas: (prev.ideas || []).map(item => item.id === id ? { ...item, ...updatedFields } : item)
    }));
  };

  const deleteIdea = (id) => {
    setState(prev => ({
      ...prev,
      ideas: (prev.ideas || []).filter(item => item.id !== id)
    }));
  };

  const addIdeaProgressLog = (ideaId, logText) => {
    if (!logText.trim()) return;
    setState(prev => ({
      ...prev,
      ideas: (prev.ideas || []).map(item => {
        if (item.id === ideaId) {
          const newLog = {
            id: 'log_' + Date.now(),
            time: new Date().toLocaleDateString() + ' · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: logText.trim()
          };
          return {
            ...item,
            progressLogs: [newLog, ...(item.progressLogs || [])]
          };
        }
        return item;
      })
    }));
  };

  const setIdeaStatus = (ideaId, status) => {
    setState(prev => ({
      ...prev,
      ideas: (prev.ideas || []).map(item => {
        if (item.id === ideaId) {
          const statusLog = {
            id: 'log_' + Date.now(),
            time: new Date().toLocaleDateString() + ' · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Status updated to ${status.toUpperCase()}`
          };
          return {
            ...item,
            status,
            progressLogs: [statusLog, ...(item.progressLogs || [])]
          };
        }
        return item;
      })
    }));
  };

  const toggleDaemon = (key) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        daemons: {
          ...prev.settings.daemons,
          [key]: !prev.settings.daemons[key]
        }
      }
    }));
  };

  const setTheme = (themeName) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: themeName
      }
    }));
  };

  const toggleGpuShimmer = () => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        gpuShimmer: !prev.settings.gpuShimmer
      }
    }));
  };

  // Modals
  const openReportModal = (screenName) => {
    setState(prev => ({ ...prev, activeReportModal: screenName }));
  };

  const closeReportModal = () => {
    setState(prev => ({ ...prev, activeReportModal: null }));
  };

  const toggleSearchModal = (isOpen) => {
    setState(prev => ({ ...prev, isSearchOpen: typeof isOpen === 'boolean' ? isOpen : !prev.isSearchOpen }));
  };

  const setSearchQuery = (query) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  // ==========================================
  // UNIVERSAL TEXT GENERATOR & SHARER
  // ==========================================
  const generateScreenText = (screenName) => {
    const activeDateKey = state.selectedDate || getTodayDateKey();
    const dateStr = formatDisplayDate(activeDateKey);
    const userStr = `${state.settings.userName} (${state.settings.tier})`;

    if (screenName === 'today') {
      const todayList = state.todos || [];
      const doneTodos = todayList.filter(t => t.completed).length;
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYTRACE — TODAY'S TODO LIST & RHYTHM
Date: ${dateStr}
User: ${userStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY METRICS:
• Tasks Completed: ${doneTodos} / ${todayList.length}
• Day Spent: ${formatMoney(state.moneyState.todayFlowINR)}
• Focus Track: ${state.liveFocus.title || 'Focus Session'} (${Math.floor(state.liveFocus.elapsedSeconds / 60)}m logged)

📝 TASKS FOR ${dateStr.toUpperCase()}:
${todayList.length > 0 
  ? todayList.map((t, idx) => `${idx + 1}. [${t.completed ? 'x' : ' '}] ${t.title} (${t.category} // ${t.priority.toUpperCase()})${t.note ? '\n   Note: ' + t.note : ''}`).join('\n')
  : '• No tasks logged for this day yet.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by DayTrace Mobile Vault`;
    }

    if (screenName === 'timeline') {
      const logs = state.hourlyLogs || [];
      const recordedMins = logs.reduce((acc, h) => acc + (h.done ? (h.durationMinutes || 60) : 0), 0);
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYTRACE — WHAT I HAVE DONE EVERY HOUR
Date: ${dateStr}
User: ${userStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 HOURLY LOG STREAM (${logs.length} entries | ${Math.floor(recordedMins / 60)}h ${recordedMins % 60}m logged):
${logs.length > 0
  ? logs.map((hl) => `• ${hl.hourSlot} [${hl.tag || (hl.done ? 'DONE' : 'PLANNED')}]:
  ${hl.title} (${hl.durationMinutes}m - ${hl.category})
  ${hl.description}`).join('\n\n')
  : '• No hourly logs recorded for this day yet.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by DayTrace Mobile Vault`;
    }

    if (screenName === 'money') {
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYTRACE — FINANCIAL RUNWAY & EXPENSES
Date: ${dateStr} | Active Currency: ${state.currency}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BUDGET METRICS:
• Total Deployed: ${formatMoney(state.moneyState.totalDeployedINR)} / Cap ${formatMoney(state.moneyState.maxCapINR)}
• Runway Remaining: ${formatMoney(state.moneyState.runwayLeftINR)} (${state.moneyState.daysLeftInCycle} days left in cycle)
• Today's Flow: ${formatMoney(state.moneyState.todayFlowINR)} (${state.moneyState.todayFlowCount} transfers)

🏷️ CATEGORY BREAKDOWN:
${state.moneyState.categoryDistribution.length > 0
  ? state.moneyState.categoryDistribution.map(c => `• ${c.name}: ${formatMoney(c.amountINR)}`).join('\n')
  : '• No expenses categorized yet.'}

📜 RECENT TRANSACTIONS:
${state.moneyState.transactions.length > 0
  ? state.moneyState.transactions.map(t => `• ${t.title}: ${formatMoney(t.amountINR)} (${t.time}) [${t.category}]`).join('\n')
  : '• No transactions recorded yet.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by DayTrace Mobile Vault`;
    }

    if (screenName === 'memories' || screenName === 'memory') {
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYTRACE — VISUAL MEMORY & OCR TRACE
Date: ${dateStr} | Indexed Items: ${state.memoryState.totalItems}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 EXTRACTED FRAMES & NOTES:
${state.memoryState.items.length > 0
  ? state.memoryState.items.map(m => `• ${m.badge} (${m.time}):
  ${m.title}
  ${m.description}
  Tags: ${m.tags?.join(', ') || 'None'}`).join('\n\n')
  : '• No memory notes or receipts captured yet.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by DayTrace Mobile Vault`;
    }

    if (screenName === 'ideas' || screenName === 'idea') {
      const ideas = state.ideas || [];
      const successes = ideas.filter(i => i.status === 'Success').length;
      const failures = ideas.filter(i => i.status === 'Failure').length;
      const inProgress = ideas.filter(i => i.status === 'In Progress').length;
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYTRACE — BRAINSTORMING & IDEAS VAULT
Date: ${dateStr} | Total Ideas: ${ideas.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 METRICS & STATUS:
• In Progress: ${inProgress}
• Validated Successes: ${successes}
• Failures / Scrapped: ${failures}

💡 IDEAS STREAM:
${ideas.length > 0
  ? ideas.map(i => `[${i.number}] ${i.title} (${i.category} // ${i.status.toUpperCase()})
  Matter: ${i.matter || 'None'}
  Research: ${i.researchNotes || 'None'}
  Updates: ${(i.progressLogs || []).map(l => `\n    - [${l.time}] ${l.text}`).join('')}`).join('\n\n')
  : '• No ideas logged in vault yet.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by DayTrace Mobile Vault`;
    }

    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYTRACE — SYSTEM INTEGRITY & TELEMETRY
Date: ${dateStr}
User: ${userStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ SENSOR DAEMONS:
• Automated SMS Parser: ${state.settings.daemons.smsParser ? 'ONLINE' : 'PAUSED'}
• Screen Time & HealthKit: ${state.settings.daemons.screenTime ? 'LINKED' : 'OFFLINE'}
• Vision OCR Pipeline: ${state.settings.daemons.visionOcr ? 'ACTIVE' : 'OFFLINE'}
• GPU Rainbow Shader: ${state.settings.gpuShimmer ? 'ENABLED' : 'DISABLED'}
• Active Theme: ${state.settings.theme}
• Mobile Storage: 100% Local & Encrypted

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by DayTrace Mobile Vault`;
  };

  const shareScreenText = async (screenName) => {
    const text = generateScreenText(screenName);
    const title = `DayTrace ${screenName.toUpperCase()} Report`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return { success: true, method: 'native' };
      } catch (e) {
        // User closed native picker, try clipboard fallback
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard' };
    } catch (err) {
      return { success: false, text };
    }
  };

  // Vault Exporters
  const exportVaultJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DayTrace_Vault_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportVaultMarkdown = () => {
    const mdContent = generateScreenText('today') + '\n\n' + generateScreenText('timeline') + '\n\n' + generateScreenText('money');
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DayTrace_Report_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const resetAllData = () => {
    resetVault();
  };

  // App Usage Tracking
  const addAppUsageLog = (entry) => {
    setState(prev => ({
      ...prev,
      appUsageLogs: [...(prev.appUsageLogs || []), entry].slice(-500) // Keep last 500
    }));
  };

  const addDistraction = (distraction) => {
    setState(prev => ({
      ...prev,
      liveFocus: {
        ...prev.liveFocus,
        distractions: [...(prev.liveFocus.distractions || []), distraction]
      }
    }));
  };

  const openExpenseModal = (preFill = {}) => {
    setState(p => ({ ...p, isAddExpenseOpen: true, expensePreFill: preFill }));
  };

  return (
    <AppContext.Provider value={{
      state,
      formatMoney,
      setCurrency,
      setActiveTab,
      setSelectedDate,
      resetVault,
      toggleLiveFocusTimer,
      openLiveActionModal,
      closeLiveActionModal,
      addFocusNote,
      // Today Todo CRUD (Daily Partitioned)
      addTodo,
      toggleTodo,
      editTodo,
      deleteTodo,
      // Hourly Timeline CRUD (Daily Partitioned)
      addHourlyLog,
      editHourlyLog,
      deleteHourlyLog,
      // Schedule Block CRUD
      toggleScheduleBlock,
      addScheduleBlock,
      editScheduleBlock,
      deleteScheduleBlock,
      // Money & Ingress
      addTransaction,
      confirmIngress,
      dismissIngress,
      addMemoryItem,
      updateUserProfile,
      // Ideas CRUD
      addIdea,
      updateIdea,
      deleteIdea,
      addIdeaProgressLog,
      setIdeaStatus,
      toggleDaemon,
      setTheme,
      toggleGpuShimmer,
      openReportModal,
      closeReportModal,
      toggleSearchModal,
      setSearchQuery,
      exportVaultJson,
      exportVaultMarkdown,
      resetAllData,
      // Text Sharing
      generateScreenText,
      shareScreenText,
      setIsAddBlockOpen: (isOpen) => setState(p => ({ ...p, isAddBlockOpen: isOpen })),
      setIsAddExpenseOpen: (isOpen) => setState(p => ({ ...p, isAddExpenseOpen: isOpen })),
      setIsReviewCutoffOpen: (isOpen) => setState(p => ({ ...p, isReviewCutoffOpen: isOpen })),
      // App Usage Tracking
      addAppUsageLog,
      addDistraction,
      openExpenseModal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
