// const User = require("../models/user-model");
// const Team = require("../models/team-model");
// const Match = require("../models/match-model");
// const CustomMatch = require('../models/customMatch-model')
// const Player = require("../models/player-model");

// // Cache for frequently accessed data
// const cache = {
//   data: {},
//   timestamp: {},
//   TTL: 5 * 60 * 1000 // 5 minutes
// };
// function setCachedData(key, data) {
//   cache.data[key] = data;
//   cache.timestamp[key] = Date.now();
// }
// function getCachedData(key) {
//   if (cache.data[key] && Date.now() - cache.timestamp[key] < cache.TTL) {
//     return cache.data[key];
//   }
//   return null;
// }



// async function getUserContext(role, userId) {
//   if (role === "team_owner") {
//     const teams = await Team.find({ createdBy: userId }).lean();
//     const players = await Player.find({ createdBy: userId }).lean();
//     return `Teams: ${teams.map(t => t.name).join(", ")}\nPlayers: ${players.map(p => p.name).join(", ")}`;
//   }

//   if (role === "admin") {
//     const totalUsers = await User.countDocuments();
//     const totalMatches = await Match.countDocuments();
//     return `Total users: ${totalUsers}, Total matches: ${totalMatches}`;
//   }

//   return "No context available.";
// }

// module.exports = { getUserContext };

const User = require("../models/user-model");
const Team = require("../models/team-model");
const Match = require("../models/match-model");
const Player = require("../models/player-model");

// Cache for frequently accessed data
const cache = {
  data: {},
  timestamp: {},
  TTL: 5 * 60 * 1000 // 5 minutes
};

function getCachedData(key) {
  if (cache.data[key] && Date.now() - cache.timestamp[key] < cache.TTL) {
    return cache.data[key];
  }
  return null;
}

function setCachedData(key, data) {
  cache.data[key] = data;
  cache.timestamp[key] = Date.now();
}

async function getUserContext(role, userId) {
  const cacheKey = `user_${role}_${userId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  let context = "";

  try {
    if (role === "teamOwner") {
      const teams = await Team.find({ createdBy: userId })
        .populate('players', 'name position battingStats bowlingStats')
        .lean();
      
      const playerStats = [];
      teams.forEach(team => {
        team.players.forEach(player => {
          playerStats.push({
            name: player.name,
            position: player.position,
            runs: player.battingStats?.totalRuns || 0,
            wickets: player.bowlingStats?.totalWickets || 0
          });
        });
      });

      context = `Teams owned: ${teams.length}
Team Names: ${teams.map(t => t.name).join(", ")}
Total Players: ${playerStats.length}
Top Performers: ${playerStats
  .sort((a, b) => b.runs - a.runs)
  .slice(0, 3)
  .map(p => `${p.name} (${p.runs} runs)`)
  .join(", ")}`;

    } else if (role === "admin") {
      const [totalUsers, totalMatches, totalTeams, recentMatches, topPlayers] = await Promise.all([
        User.countDocuments(),
        Match.countDocuments(),
        Team.countDocuments(),
        Match.find({}).sort({ createdAt: -1 }).limit(5).lean(),
        Player.find({}).sort({ 'battingStats.totalRuns': -1 }).limit(5).lean()
      ]);

      context = `Platform Stats:
Total Users: ${totalUsers}
Total Matches: ${totalMatches}
Total Teams: ${totalTeams}
Recent Matches: ${recentMatches.map(m => `${m.team1} vs ${m.team2}`).join(", ")}
Top Players: ${topPlayers.map(p => `${p.name} (${p.battingStats?.totalRuns || 0} runs)`).join(", ")}`;

    } else if (role === "player") {
      const player = await Player.findOne({ userId }).lean();
      if (player) {
        context = `Player Profile: ${player.name}
Position: ${player.position}
Matches Played: ${player.matchesPlayed || 0}
Total Runs: ${player.battingStats?.totalRuns || 0}
Total Wickets: ${player.bowlingStats?.totalWickets || 0}
Strike Rate: ${player.battingStats?.strikeRate || 0}
Economy Rate: ${player.bowlingStats?.economyRate || 0}`;
      }
    }

    setCachedData(cacheKey, context);
    return context;
  } catch (error) {
    console.error("Error fetching user context:", error);
    return "Unable to fetch user-specific data at the moment.";
  }
}

async function getAppAnalytics() {
  const cacheKey = "app_analytics";
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const [
      userStats,
      matchStats,
      teamStats,
      playerStats,
      liveMatches,
      recentActivity
    ] = await Promise.all([
      User.aggregate([
        { $group: { 
          _id: "$role", 
          count: { $sum: 1 },
          lastActive: { $max: "$lastLogin" }
        }}
      ]),
      Match.aggregate([
        { $group: {
          _id: "$status",
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 }}
      ]),
      Team.aggregate([
        { $group: {
          _id: null,
          totalTeams: { $sum: 1 },
          avgPlayersPerTeam: { $avg: { $size: "$players" }}
        }}
      ]),
      Player.aggregate([
        { $group: {
          _id: "$position",
          count: { $sum: 1 },
          avgRuns: { $avg: "$battingStats.totalRuns" },
          avgWickets: { $avg: "$bowlingStats.totalWickets" }
        }}
      ]),
      Match.find({ status: "live" }).limit(10).lean(),
      Match.find({}).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const analytics = {
      users: {
        total: userStats.reduce((sum, stat) => sum + stat.count, 0),
        breakdown: userStats,
        activeToday: userStats.filter(u => u.lastActive && 
          new Date(u.lastActive).toDateString() === new Date().toDateString()).length
      },
      matches: {
        total: matchStats.reduce((sum, stat) => sum + stat.count, 0),
        byStatus: matchStats,
        live: liveMatches.length,
        recent: recentActivity.slice(0, 5)
      },
      teams: {
        total: teamStats[0]?.totalTeams || 0,
        avgPlayersPerTeam: Math.round(teamStats[0]?.avgPlayersPerTeam || 0)
      },
      players: {
        total: playerStats.reduce((sum, stat) => sum + stat.count, 0),
        byPosition: playerStats,
        topPerformers: await getTopPerformers()
      }
    };

    setCachedData(cacheKey, analytics);
    return analytics;
  } catch (error) {
    console.error("Error fetching app analytics:", error);
    return {
      users: { total: 0 },
      matches: { total: 0, live: 0 },
      teams: { total: 0 },
      players: { total: 0 }
    };
  }
}

async function getTopPerformers() {
  try {
    const [topBatsmen, topBowlers] = await Promise.all([
      Player.find({ "battingStats.totalRuns": { $gt: 0 }})
        .sort({ "battingStats.totalRuns": -1 })
        .limit(5)
        .select("name battingStats.totalRuns battingStats.strikeRate")
        .lean(),
      Player.find({ "bowlingStats.totalWickets": { $gt: 0 }})
        .sort({ "bowlingStats.totalWickets": -1 })
        .limit(5)
        .select("name bowlingStats.totalWickets bowlingStats.economyRate")
        .lean()
    ]);

    return { topBatsmen, topBowlers };
  } catch (error) {
    console.error("Error fetching top performers:", error);
    return { topBatsmen: [], topBowlers: [] };
  }
}

async function getMatchInsights(matchId = null) {
  try {
    let query = {};
    if (matchId) {
      query._id = matchId;
    } else {
      // Get recent matches
      query = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }};
    }

    const matches = await Match.find(query)
      .populate('team1Players team2Players', 'name runs wickets average role')
      .lean();

    return matches.map(match => ({
      id: match._id,
      teams: `${match.team1} vs ${match.team2}`,
      status: match.status,
      score: match.currentScore,
      overs: match.currentOvers,
      topPerformer: getMatchTopPerformer(match)
    }));
  } catch (error) {
    console.error("Error fetching match insights:", error);
    return [];
  }
}

function getMatchTopPerformer(match) {
  // Simple logic to find top performer - can be enhanced
  const allPlayers = [...(match.team1Players || []), ...(match.team2Players || [])];
  
  if (allPlayers.length === 0) return "Data not available";
  
  const topBatsman = allPlayers.reduce((top, player) => {
    const runs = player.runs || 0;
    const topRuns = top.runs || 0;
    return runs > topRuns ? player : top;
  }, allPlayers[0]);

  return `${topBatsman.name} (${topBatsman.runs || 0} runs)`;
}

module.exports = { 
  getUserContext, 
  getAppAnalytics, 
  getTopPerformers,
  getMatchInsights 
};
