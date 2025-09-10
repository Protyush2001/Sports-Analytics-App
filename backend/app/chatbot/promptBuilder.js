// function buildPrompt(message) {
//     const today = new Date().toLocaleDateString("en-IN", {
//   weekday: "long",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// });

//   return `
// You are a cricket assistant chatbot. Today's date is ${today}.
// Respond to the user’s query with up-to-date context and conversational tone.
// User: "${message}"
// `;

// }

// module.exports = { buildPrompt };


function buildPrompt(message, context = {}) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const currentTime = today.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const { appContext, userContext, userRole, userName } = context;

  let systemPrompt = `You are CricketBot, an intelligent cricket assistant for a comprehensive cricket management platform. You have access to real-time data and can provide detailed insights about players, teams, matches, and statistics.

CURRENT CONTEXT:
📅 Today: ${formattedDate} at ${currentTime} (IST)
🏏 Platform: Professional Cricket Management System
${userName ? `👤 User: ${userName} (${userRole || 'User'})` : ''}

PLATFORM DATA SUMMARY:
${formatAppContext(appContext)}

${userContext ? `YOUR SPECIFIC CONTEXT:\n${userContext}\n` : ''}

CAPABILITIES & PERSONALITY:
• Provide real-time cricket statistics and analysis
• Compare player performances with actual data
• Suggest team combinations and strategies
• Track match progress and predictions
• Offer insights based on current platform data
• Maintain a friendly, knowledgeable cricket expert tone
• Use cricket terminology appropriately
• Provide actionable recommendations

RESPONSE GUIDELINES:
1. Always base responses on actual platform data when available
2. Mention specific numbers, stats, and comparisons
3. Be conversational but informative
4. Use cricket emojis and terminology appropriately
5. If data is unavailable, clearly state limitations
6. Provide context-aware suggestions based on user role
7. Keep responses concise but comprehensive (200-500 words max)

USER QUERY: "${message}"

Respond as CricketBot with expertise, using the provided data to give accurate, helpful, and engaging cricket insights.`;

  return systemPrompt;
}

function formatAppContext(appContext) {
  if (!appContext) return "Platform data temporarily unavailable.";

  const { users, matches, teams, players } = appContext;
  
  let formatted = `📊 PLATFORM STATISTICS:
• Total Users: ${users?.total || 0} (Active today: ${users?.activeToday || 0})
• Teams: ${teams?.total || 0} (Avg ${teams?.avgPlayersPerTeam || 0} players/team)
• Players: ${players?.total || 0} registered
• Matches: ${matches?.total || 0} total (${matches?.live || 0} live)

🏆 TOP PERFORMERS:`;

  if (players?.topPerformers?.topBatsmen?.length > 0) {
    formatted += `\n🏏 Leading Batsmen: ${players.topPerformers.topBatsmen
      .slice(0, 3)
      .map(p => `${p.name} (${p.runs} runs, avg: ${p.average})`)
      .join(', ')}`;
  }

  if (players?.topPerformers?.topBowlers?.length > 0) {
    formatted += `\n⚡ Leading Bowlers: ${players.topPerformers.topBowlers
      .slice(0, 3)
      .map(p => `${p.name} (${p.wickets} wickets)`)
      .join(', ')}`;
  }

  if (matches?.recent?.length > 0) {
    formatted += `\n\n🎯 RECENT MATCHES:
${matches.recent
  .slice(0, 3)
  .map(m => `• ${m.team1} vs ${m.team2} (${m.status})`)
  .join('\n')}`;
  }

  return formatted;
}

function getContextualPromptEnhancements(message, userRole) {
  const enhancements = [];
  
  // Role-based enhancements
  switch (userRole) {
    case 'admin':
      enhancements.push("Focus on platform analytics, user management insights, and overall system health.");
      break;
    case 'teamOwner':
      enhancements.push("Emphasize team performance, player management, and strategic insights for team building.");
      break;
    case 'player':
      enhancements.push("Provide personal performance analysis, improvement suggestions, and career guidance.");
      break;
  }

  // Query type enhancements
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
    enhancements.push("Provide detailed statistical comparisons with specific numbers and percentages.");
  }
  
  if (lowerMessage.includes('best') || lowerMessage.includes('top')) {
    enhancements.push("Rank based on actual performance data and provide reasoning for rankings.");
  }
  
  if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
    enhancements.push("Base predictions on historical data trends and current form analysis.");
  }
  
  if (lowerMessage.includes('strategy') || lowerMessage.includes('tactic')) {
    enhancements.push("Provide actionable strategic advice based on team composition and opponent analysis.");
  }

  return enhancements.join(' ');
}

module.exports = { buildPrompt, formatAppContext };