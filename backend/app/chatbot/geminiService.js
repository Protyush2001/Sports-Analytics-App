// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { buildPrompt } = require("./promptBuilder");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function generateReply(userMessage) {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//   const prompt = buildPrompt(userMessage);

//   const result = await model.generateContent(prompt);
//   return result.response.text().trim();
// }

// module.exports = { generateReply };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildPrompt } = require("./promptBuilder");
const { getUserContext, getAppAnalytics } = require("./contextBuilder");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateReply(userMessage, userContext = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });

    // Get comprehensive context
    const appContext = await getAppAnalytics();
    const userSpecificContext = userContext.userId ? 
      await getUserContext(userContext.role, userContext.userId) : null;

    const prompt = buildPrompt(userMessage, {
      appContext,
      userContext: userSpecificContext,
      userRole: userContext.role,
      userName: userContext.name
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Log interaction for improvement
    console.log(`Chatbot Query: ${userMessage.substring(0, 100)}...`);
    console.log(`Response Length: ${response.length} chars`);

    return response;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback responses based on query type
    if (userMessage.toLowerCase().includes('player')) {
      return "I'm having trouble accessing player data right now. Please try again in a moment or contact support for player statistics.";
    } else if (userMessage.toLowerCase().includes('match')) {
      return "I'm experiencing issues retrieving match information. Please check the matches section directly or try again later.";
    } else if (userMessage.toLowerCase().includes('team')) {
      return "Team information is temporarily unavailable. Please visit the teams section for the latest updates.";
    }
    
    return "I apologize, but I'm experiencing technical difficulties. Please try rephrasing your question or contact support if the issue persists.";
  }
}

module.exports = { generateReply };