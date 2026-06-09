import { HeritageSite } from "@/types";

export interface AIResponse {
  text: string;
  suggestedQuestions?: string[];
  switchedSiteId?: string;
}

export interface AIProvider {
  generateResponse(query: string, currentSite: HeritageSite, allSites: HeritageSite[]): Promise<AIResponse>;
}

export class MockAIProvider implements AIProvider {
  async generateResponse(query: string, currentSite: HeritageSite, allSites: HeritageSite[]): Promise<AIResponse> {
    const msg = query.toLowerCase();

    // 1. Context Mismatch Detection
    // Check if the query mentions any other site name
    for (const site of allSites) {
      if (site.id !== currentSite.id) {
        const nameWords = site.name.toLowerCase().split(/\s+/).filter(w => w.length > 3 && w !== "group" && w !== "monuments");
        const matchesName = nameWords.some(word => msg.includes(word)) || msg.includes(site.id.replace(/-/g, " "));
        
        if (matchesName) {
          // Detected mismatch. Switch context automatically.
          const introEvent = site.timeline && site.timeline.length > 0 ? site.timeline[0].event : "";
          return {
            text: `[Context Switch] I detected you are asking about "${site.name}", but "${currentSite.name}" was active. I have automatically switched the guide focus to "${site.name}"!\n\n${site.description} Built by the ${site.builder || "dynasties of the era"}. ${introEvent}`,
            switchedSiteId: site.id,
            suggestedQuestions: [
              "What is its architectural style?",
              "Tell me an interesting legend.",
              "What are some nearby attractions?"
            ]
          };
        }
      }
    }

    // 2. Specific questions matching for currently selected site
    // Architecture Style
    if (msg.includes("architecture") || msg.includes("style") || msg.includes("design") || msg.includes("art")) {
      const highlights = currentSite.architectureHighlights 
        ? currentSite.architectureHighlights.map(h => `${h.title}: ${h.description}`).join(". ")
        : "blending regional structural traditions of the period.";
      return {
        text: `The architectural style of ${currentSite.name} is categorized as ${currentSite.category} style. Key marvels include: ${highlights}`,
        suggestedQuestions: ["How was it built?", "Tell me an interesting legend."]
      };
    }

    // Historical Importance
    if (msg.includes("importance") || msg.includes("history") || msg.includes("historical") || msg.includes("era") || msg.includes("chronicle")) {
      return {
        text: `Historically, ${currentSite.name} stands as a monument of major significance. ${currentSite.historicalOverview}`,
        suggestedQuestions: ["Who built this?", "What is its UNESCO justification?"]
      };
    }

    // Builder
    if (msg.includes("builder") || msg.includes("built") || msg.includes("construct") || msg.includes("dynasty") || msg.includes("emperor") || msg.includes("king")) {
      const intro = currentSite.timeline && currentSite.timeline.length > 0 ? currentSite.timeline[0].event : "";
      return {
        text: `${currentSite.name} was commissioned/constructed under the ${currentSite.builder || "historical builders of the period"}. ${intro}`,
        suggestedQuestions: ["What are some construction techniques?", "Tell me an interesting legend."]
      };
    }

    // UNESCO Significance
    if (msg.includes("unesco") || msg.includes("criteria") || msg.includes("significance") || msg.includes("justified")) {
      return {
        text: `${currentSite.name} is inscribed as a UNESCO World Heritage Site under criteria: ${currentSite.unescoInfo?.criteria || "Cultural"}. Justification: "${currentSite.unescoInfo?.justification || ""}"`,
        suggestedQuestions: ["What is its historical importance?", "What are some nearby attractions?"]
      };
    }

    // Nearby Attractions
    if (msg.includes("nearby") || msg.includes("attraction") || msg.includes("around") || msg.includes("visit next") || msg.includes("close to")) {
      const attractions = currentSite.nearbyAttractions?.join(", ") || "various local historical spots";
      return {
        text: `When visiting ${currentSite.name}, the recommended nearby attractions are: ${attractions}.`,
        suggestedQuestions: ["What are the ticket prices?", "What is the best time to visit?"]
      };
    }

    // Construction Techniques
    if (msg.includes("technique") || msg.includes("method") || msg.includes("material") || msg.includes("built with") || msg.includes("how was it built")) {
      const highlights = currentSite.architectureHighlights?.map(h => h.title).join(" and ") || "intricate stone masonry";
      return {
        text: `The construction of ${currentSite.name} utilized advanced civil engineering of its time, featuring ${highlights}. Inlays and carvings were executed by thousands of master craftsmen using indigenous materials like red sandstone, white marble, or basalt depending on region.`,
        suggestedQuestions: ["Tell me an interesting legend.", "What is its architectural style?"]
      };
    }

    // Interesting Legends
    if (msg.includes("legend") || msg.includes("myth") || msg.includes("story") || msg.includes("stories") || msg.includes("tales") || msg.includes("fact") || msg.includes("trivia")) {
      const facts = currentSite.interestingFacts;
      const selectedFact = facts && facts.length > 0 
        ? facts[Math.floor(Math.random() * facts.length)]
        : "It stands as a testament to medieval Indian structural planning.";
      return {
        text: `Here is a fascinating legend/fact about ${currentSite.name}: ${selectedFact}`,
        suggestedQuestions: ["What is its architectural style?", "What are its construction techniques?"]
      };
    }

    // Visitor Timings / Tickets
    if (msg.includes("hours") || msg.includes("timings") || msg.includes("ticket") || msg.includes("fee") || msg.includes("price") || msg.includes("cost") || msg.includes("open")) {
      return {
        text: `Visitor Information for ${currentSite.name}: Open hours are ${currentSite.visitorInfo.timings}. Entry admission is ${currentSite.visitorInfo.entryFee}. Best period to visit: ${currentSite.visitorInfo.bestTimeToVisit}.`,
        suggestedQuestions: ["What are some nearby attractions?", "Who built this?"]
      };
    }

    // 3. Fallback Handling
    return {
      text: `I couldn't find a direct answer regarding "${query}" for ${currentSite.name}. However, I can help you with: its architectural style, construction techniques, builder details, historical significance, or interesting legends.`,
      suggestedQuestions: [
        "What is its architectural style?",
        "What are its construction techniques?",
        "Tell me an interesting legend."
      ]
    };
  }
}

export class GeminiAIProvider implements AIProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  }

  async generateResponse(query: string, currentSite: HeritageSite, allSites: HeritageSite[]): Promise<AIResponse> {
    if (!this.apiKey) {
      // Fallback to Mock Provider
      return new MockAIProvider().generateResponse(query, currentSite, allSites);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert AI Heritage Guide specializing in India's UNESCO heritage. 
User's active site: "${currentSite.name}" (Description: "${currentSite.description}", Builder: "${currentSite.builder || "Unknown"}", Location: "${currentSite.location}, ${currentSite.state}").
User's query: "${query}"

Instructions:
- First, check if the user is asking about another site in India (such as Hampi, Ellora, Ajanta, Red Fort, Qutub Minar, etc.). If they are, detect this mismatch, explain that you have switched the focus to that monument, and answer for the new site.
- Otherwise, answer the query specifically for "${currentSite.name}".
- Provide a concise response (2-3 sentences max). Keep the tone informative, respectful, and engaging.
- Format the output in clean text.
- Return the response in a JSON-like format or just text. We will parse it. To simplify, return the answer text and optionally append suggested questions at the end on a new line starting with "SUGGESTIONS: question1 | question2 | question3".`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!rawText) {
        return new MockAIProvider().generateResponse(query, currentSite, allSites);
      }

      // Check for suggestions in output
      let text = rawText;
      let suggestedQuestions: string[] = [];
      const suggestionsIdx = rawText.indexOf("SUGGESTIONS:");
      if (suggestionsIdx !== -1) {
        text = rawText.substring(0, suggestionsIdx).trim();
        suggestedQuestions = rawText
          .substring(suggestionsIdx + 12)
          .split("|")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      // Check if another site name was discussed (basic client detection is safer for state management)
      let switchedSiteId: string | undefined;
      const lowerQuery = query.toLowerCase();
      for (const site of allSites) {
        if (site.id !== currentSite.id) {
          const nameWords = site.name.toLowerCase().split(/\s+/).filter(w => w.length > 3 && w !== "group" && w !== "monuments");
          if (nameWords.some(word => lowerQuery.includes(word))) {
            switchedSiteId = site.id;
            break;
          }
        }
      }

      return {
        text,
        suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : undefined,
        switchedSiteId
      };
    } catch (err) {
      console.error("Gemini API Error, falling back to mock:", err);
      return new MockAIProvider().generateResponse(query, currentSite, allSites);
    }
  }
}
