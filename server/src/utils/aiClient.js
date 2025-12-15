import axios from 'axios';

class AIClient {
  constructor() {
    // Don't initialize in constructor - let it be lazy loaded
    this._initialized = false;
  }

  _ensureInitialized() {
    if (!this._initialized) {
      this.apiKey = process.env.OPENAI_API_KEY || process.env.HF_API_KEY;
      this.provider = process.env.AI_PROVIDER || 'openai';
      console.log("OpenAI key loaded:", !!process.env.OPENAI_API_KEY);
      console.log("Key length:", process.env.OPENAI_API_KEY?.length);
      console.log("Key starts with:", process.env.OPENAI_API_KEY?.substring(0, 10));
      this._initialized = true;
    }
  }

  async categorizeExpense(description, amount) {
    this._ensureInitialized();
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
      // Fallback to keyword-based categorization
      return this.fallbackCategorizeExpense(description);
    }
  }

  fallbackCategorizeExpense(description) {
    const lowerDesc = description.toLowerCase();

    const keywords = {
      Food: ['food', 'restaurant', 'lunch', 'dinner', 'breakfast', 'cafe', 'coffee', 'pizza', 'burger', 'meal', 'grocery', 'snack', 'dominos', 'mcdonalds', 'kfc', 'subway', 'starbucks', 'swiggy', 'zomato', 'delivery', 'kitchen', 'bakery'],
      Transport: ['uber', 'ola', 'taxi', 'bus', 'train', 'metro', 'fuel', 'gas', 'petrol', 'diesel', 'parking', 'toll', 'flight', 'ticket', 'cab', 'auto', 'rickshaw', 'bike', 'car'],
      Shopping: ['amazon', 'flipkart', 'shop', 'clothing', 'clothes', 'shoes', 'mall', 'store', 'purchase', 'buy', 'online', 'myntra', 'ajio'],
      Bills: ['bill', 'electricity', 'water', 'internet', 'phone', 'mobile', 'rent', 'utility', 'subscription', 'recharge', 'broadband', 'wifi'],
      Entertainment: ['movie', 'cinema', 'game', 'concert', 'netflix', 'spotify', 'amazon prime', 'hotstar', 'music', 'show', 'theatre', 'youtube'],
      Health: ['medicine', 'doctor', 'hospital', 'pharmacy', 'medical', 'health', 'clinic', 'therapy', 'dental', 'apollo', 'gym', 'fitness'],
      Education: ['book', 'course', 'tuition', 'school', 'college', 'class', 'education', 'learning', 'udemy', 'coursera', 'training'],
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some((word) => lowerDesc.includes(word))) {
        console.log(`Fallback categorization: "${description}" → ${category}`);
        return category;
      }
    }

    console.log(`Fallback categorization: "${description}" → Others (no match)`);
    return 'Others';
  }

  async generateInsight(summaryData) {
    this._ensureInitialized();
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
      // Fallback to rule-based insights
      return this.generateRuleBasedInsight(summaryData);
    }
  }

  generateRuleBasedInsight(summaryData) {
    const { total, byCategory, transactionCount } = summaryData;
    
    if (transactionCount === 0) {
      return 'No expenses recorded this month. Start tracking your spending to get personalized insights!';
    }

    // Find top category
    const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = categories[0];
    const topPercentage = ((topCategory[1] / total) * 100).toFixed(1);

    // Generate insight
    let insight = `This month, you spent ₹${total.toFixed(2)} across ${transactionCount} transactions. `;
    insight += `Your biggest expense was ${topCategory[0]} (₹${topCategory[1].toFixed(2)}, ${topPercentage}% of total spending). `;
    
    if (categories.length > 1) {
      const secondCategory = categories[1];
      const secondPercentage = ((secondCategory[1] / total) * 100).toFixed(1);
      insight += `Followed by ${secondCategory[0]} at ${secondPercentage}%. `;
    }

    // Add suggestion
    if (topPercentage > 40) {
      insight += `💡 Tip: Your ${topCategory[0]} spending is quite high. Consider setting a budget limit to track this category better.`;
    } else if (transactionCount > 20) {
      insight += `💡 Tip: You made ${transactionCount} transactions this month. Try consolidating purchases to save on fees and reduce impulse spending.`;
    } else {
      insight += `💡 Tip: Great job tracking your expenses! Keep monitoring your spending patterns to identify savings opportunities.`;
    }

    return insight;
  }

  async answerQuestion(question, transactionsJson, budgetsJson = '[]') {
    this._ensureInitialized();
    const systemMessage = "You are an AI that answers questions about a user's spending patterns and budgets from their transaction history. Use only the given data.";
    const userMessage = `Transactions (JSON):\n${transactionsJson}\n\nBudgets (JSON):\n${budgetsJson}\n\nUser question: "${question}"\n\nAnswer in 3-6 lines, referring to specific amounts and categories if helpful.`;

    try {
      if (this.provider === 'openai') {
        return await this.callOpenAI(systemMessage, userMessage);
      } else {
        return await this.callHuggingFace(systemMessage, userMessage);
      }
    } catch (error) {
      console.error('AI question answering error:', error);
      // Fallback: analyze data locally
      return this.fallbackAnswerQuestion(question, transactionsJson, budgetsJson);
    }
  }

  fallbackAnswerQuestion(question, transactionsJson, budgetsJson = '[]') {
    try {
      const transactions = JSON.parse(transactionsJson);
      const budgets = JSON.parse(budgetsJson);
      
      if (transactions.length === 0) {
        return "You don't have any expenses recorded yet. Start adding expenses to get insights!";
      }

      const lowerQuestion = question.toLowerCase();
      
      // Budget-related questions
      if (lowerQuestion.includes('budget') || lowerQuestion.includes('remaining') || lowerQuestion.includes('left') || lowerQuestion.includes('over') || lowerQuestion.includes('still spend') || lowerQuestion.includes('can spend') || lowerQuestion.includes('can i spend')) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        // Filter current month expenses
        const currentMonthExpenses = transactions.filter(t => {
          const expDate = new Date(t.date);
          return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
        });
        
        // Filter current month budget
        const currentMonthBudget = budgets.find(b => b.month === currentMonth && b.year === currentYear);
        
        const totalSpent = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
        const totalBudget = currentMonthBudget ? currentMonthBudget.totalLimit : 0;
        const remaining = totalBudget - totalSpent;
        const percentUsed = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;
        
        if (totalBudget === 0) {
          return `You haven't set a budget for this month yet. You've spent ₹${totalSpent.toFixed(2)} so far. Consider setting a budget to track your spending better!`;
        }
        
        if (remaining < 0) {
          return `You've exceeded your budget! You've spent ₹${totalSpent.toFixed(2)} out of ₹${totalBudget.toFixed(2)} budget (${percentUsed}% used). You're over budget by ₹${Math.abs(remaining).toFixed(2)}.`;
        } else if (percentUsed > 80) {
          return `Warning: You've used ${percentUsed}% of your budget! Spent ₹${totalSpent.toFixed(2)} out of ₹${totalBudget.toFixed(2)}. You have ₹${remaining.toFixed(2)} remaining for this month.`;
        } else {
          return `You're on track! You've spent ₹${totalSpent.toFixed(2)} out of ₹${totalBudget.toFixed(2)} budget (${percentUsed}% used). You have ₹${remaining.toFixed(2)} remaining for this month.`;
        }
      }
      
      // Category spending questions
      const categoryMatch = lowerQuestion.match(/food|transport|shopping|entertainment|utilities|health|other/i);
      if (categoryMatch) {
        const category = categoryMatch[0].charAt(0).toUpperCase() + categoryMatch[0].slice(1).toLowerCase();
        const categoryExpenses = transactions.filter(t => t.category.toLowerCase() === category.toLowerCase());
        const total = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
        
        if (categoryExpenses.length === 0) {
          return `You haven't recorded any ${category} expenses yet.`;
        }
        
        return `You spent ₹${total.toFixed(2)} on ${category} across ${categoryExpenses.length} transaction${categoryExpenses.length > 1 ? 's' : ''}. Your most recent ${category} expense was ₹${categoryExpenses[0].amount} for "${categoryExpenses[0].description}".`;
      }
      
      // Total spending questions
      if (lowerQuestion.includes('total') || lowerQuestion.includes('how much') || lowerQuestion.includes('spent')) {
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        const categories = {};
        transactions.forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
        const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
        
        return `You've spent a total of ₹${total.toFixed(2)} across ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}. Your highest spending category is ${topCategory[0]} with ₹${topCategory[1].toFixed(2)}.`;
      }
      
      // Recent spending
      if (lowerQuestion.includes('recent') || lowerQuestion.includes('last')) {
        const recent = transactions.slice(0, 5);
        const recentTotal = recent.reduce((sum, t) => sum + t.amount, 0);
        return `Your 5 most recent expenses total ₹${recentTotal.toFixed(2)}. The latest was ₹${recent[0].amount} for "${recent[0].description}" in ${recent[0].category}.`;
      }
      
      // Default response with summary
      const total = transactions.reduce((sum, t) => sum + t.amount, 0);
      const avgExpense = total / transactions.length;
      return `Based on your ${transactions.length} transactions, you've spent ₹${total.toFixed(2)} in total, with an average expense of ₹${avgExpense.toFixed(2)}. Try asking about specific categories like "How much did I spend on food?" or "What's my remaining budget?".`;
      
    } catch (error) {
      console.error('Fallback answer error:', error);
      return 'Unable to answer your question at this time. Please try rephrasing your question.';
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
