import { formatCurrency } from './currencies';

/**
 * Clean text & printable report generator for each DayTrace screen.
 * Formats data into aesthetic text summaries, markdown, clipboard-ready text, or printable receipts.
 */

export function generateTodayReport(state) {
  const { activeSession, metrics, habits, timelineEvents, voiceNotes, currency } = state;
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const completedHabits = habits.filter(h => h.done);

  return `═══════════════════════════════════════════
       DAYTRACE — DAILY RHYTHM REPORT       
═══════════════════════════════════════════
Date: ${dateStr}

[ 1. LIVE FOCUS & FLOW ]
• Active Session: ${activeSession.title}
• Category: ${activeSession.category}
• Time Elapsed: ${Math.floor(activeSession.elapsedSeconds / 60)}m ${activeSession.elapsedSeconds % 60}s / ${activeSession.targetMinutes}m target
• Status: ${activeSession.isRunning ? 'Active / In Progress' : 'Paused'}

[ 2. DAILY METRICS & VITALITY ]
• Focus Index: ${metrics.focus}%
• Rhythm Streak: ${metrics.streak} Consecutive Days
• Spent Today: ${formatCurrency(metrics.todaySpent, currency)}

[ 3. HABIT ANCHORS (${completedHabits.length}/${habits.length} COMPLETED) ]
${habits.map(h => `  [${h.done ? '✓' : ' '}] ${h.title} (Target: ${h.target}, Streak: ${h.streak}d)`).join('\n')}

[ 4. TODAY'S FLOW STREAM ]
${timelineEvents.slice(0, 5).map(e => `  • ${e.time} | ${e.title} (${e.category}, ${e.duration}) [${e.status.toUpperCase()}]`).join('\n')}

[ 5. VOICE REFLECTIONS ]
${voiceNotes.length > 0 ? voiceNotes.map(v => `  • ${v.timestamp}: "${v.title}" (${v.duration})`).join('\n') : '  • No voice notes recorded today.'}

═══════════════════════════════════════════
Generated via DayTrace • Personal Life OS
═══════════════════════════════════════════`;
}

export function generateMoneyReport(state) {
  const { transactions, metrics, currency } = state;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netSavings = totalIncome - totalExpense;

  return `═══════════════════════════════════════════
      DAYTRACE — FINANCIAL CASH FLOW REPORT  
═══════════════════════════════════════════
Period: ${dateStr}
Currency: ${currency}

[ 1. CASH FLOW SUMMARY ]
• Net Monthly Surplus : ${formatCurrency(netSavings, currency)}
• Total Inflow (+)    : ${formatCurrency(totalIncome, currency)}
• Total Outflow (-)   : ${formatCurrency(totalExpense, currency)}
• Spending Guardrail  : ${formatCurrency(metrics.monthlySpent, currency)} / ${formatCurrency(metrics.monthlyBudget, currency)} (${Math.round((metrics.monthlySpent / metrics.monthlyBudget) * 100)}% Used)

[ 2. ITEMIZED TRANSACTIONS LEDGER ]
${transactions.map(t => {
  const isInc = t.type === 'income';
  const sign = isInc ? '+' : '-';
  return `  • ${t.date} | ${t.title.padEnd(24, ' ')} | ${sign}${formatCurrency(Math.abs(t.amount), currency).padEnd(10, ' ')} | [${t.category}] via ${t.account}`;
}).join('\n')}

═══════════════════════════════════════════
Generated via DayTrace • Personal Life OS
═══════════════════════════════════════════`;
}

export function generateTimelineReport(state) {
  const { timelineEvents } = state;
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return `═══════════════════════════════════════════
      DAYTRACE — CHRONO TIMELINE STREAM     
═══════════════════════════════════════════
Date: ${dateStr}

[ CHRONOLOGICAL LOG ]
${timelineEvents.map((e, idx) => `  ${idx + 1}. [${e.time}] ${e.title}
     Category: ${e.category} | Duration: ${e.duration} | Status: ${e.status.toUpperCase()}`).join('\n\n')}

═══════════════════════════════════════════
Generated via DayTrace • Personal Life OS
═══════════════════════════════════════════`;
}

export function generateMemoriesReport(state) {
  const { memories } = state;

  return `═══════════════════════════════════════════
      DAYTRACE — VISUAL MEMORY JOURNAL      
═══════════════════════════════════════════
Total Entries: ${memories.length}

${memories.map((m, idx) => `[ MEMORY #${idx + 1} — ${m.date} ]
• Location: ${m.location}
• Mood State: ${m.mood}
• Reflection: "${m.caption}"
• Tags: ${m.tags?.join(' ')}
• Image Reference: ${m.image}
`).join('\n-------------------------------------------\n')}

═══════════════════════════════════════════
Generated via DayTrace • Personal Life OS
═══════════════════════════════════════════`;
}

export function generateSystemReport(state) {
  return `═══════════════════════════════════════════
      DAYTRACE — SYSTEM & HEALTH DIAGNOSTIC  
═══════════════════════════════════════════
User: Alex Morgan (PRO)
Active Currency: ${state.currency}
Shader Engine: ${state.shaderSettings.enabled ? `Active (Speed: ${state.shaderSettings.speed}x, Intensity: ${state.shaderSettings.intensity * 100}%)` : 'Disabled'}
Total Memories: ${state.memories.length}
Total Transactions: ${state.transactions.length}
Habits Tracked: ${state.habits.length}
Timeline Events: ${state.timelineEvents.length}

Generated via DayTrace • Personal Life OS
═══════════════════════════════════════════`;
}
