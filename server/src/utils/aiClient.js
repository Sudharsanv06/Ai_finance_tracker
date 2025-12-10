import axios from 'axios';

class AIClient {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.HF_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'huggingface'
  }

  async categorizeExpense(description, amount) {
    const systemMessage = "You are a financial assistant. Categorize user expenses into one of these categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Others.";
    const userMessage = `Description: "${description}"\nAmount: ${amount}\nReturn only one word: the best category.`;

    try {
      if (this.provider === 'openai') {
        return await this.callOpenAI(systemMessage, userMessage);
      } else {
        return await this.callHuggingFace(systemMessage, userMessage);
      }
    } catch (error) {
      console.error('AI categorization error:', error);
      return 'Others'; // Fallback category
    }
  }

  async generateInsight(summaryData) {
    const systemMessage = "You analyze personal finance data and explain it clearly and briefly. Use friendly language with numbers and percentages.";
    const userMessage = `Here is the user's monthly expense summary as JSON:\n${JSON.stringify(summaryData)}\n\nGenerate a short paragraph (4-6 lines) explaining:\n1. where they spent the most,\n2. where they overspent compared to last month,\n3. one simple saving suggestion.`;

    try {
      if (this.provider === 'openai') {
        return await this.callOpenAI(systemMessage, userMessage);
      } else {
        return await this.callHuggingFace(systemMessage, userMessage);
      }
    } catch (error) {
      console.error('AI insight generation error:', error);
      return 'Unable to generate insights at this time.';
    }
  }

  async answerQuestion(question, transactionsJson) {
    const systemMessage = "You are an AI that answers questions about a user's spending patterns from their transaction history. Use only the given data.";
    const userMessage = `Transactions (JSON):\n${transactionsJson}\n\nUser question: "${question}"\n\nAnswer in 3-6 lines, referring to specific amounts and categories if helpful.`;

    try {
      if (this.provider === 'openai') {
        return await this.callOpenAI(systemMessage, userMessage);
      } else {
        return await this.callHuggingFace(systemMessage, userMessage);
      }
    } catch (error) {
      console.error('AI question answering error:', error);
      return 'Unable to answer your question at this time.';
    }
  }

  async callOpenAI(systemMessage, userMessage) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 200,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  }

  async callHuggingFace(systemMessage, userMessage) {
    // Placeholder for Hugging Face implementation
    // You can use models like facebook/blenderbot or other chat models
    const fullPrompt = `${systemMessage}\n\n${userMessage}`;
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      { inputs: fullPrompt },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return response.data[0].generated_text || 'Others';
  }
}

export default new AIClient();
