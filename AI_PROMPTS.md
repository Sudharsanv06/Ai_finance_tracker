# AI Prompt Templates & Guidelines

This document contains all AI prompt templates used in the AI Finance Tracker application.

## Overview

The application uses AI for:
1. **Expense Categorization** - Automatically categorize expenses based on description
2. **Monthly Insights** - Generate financial insights and recommendations
3. **Q&A on Spending** - Answer user questions about spending patterns
4. **Budget Predictions** - Predict if user will exceed budget

---

## 1. AI Expense Categorization Prompt

**Goal:** Input description + amount → Output category

### System Message:
```
You are a financial assistant. Categorize user expenses into one of these categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Others.
```

### User Message Template:
```
Description: "{description}"
Amount: {amount}
Return only one word: the best category.
```

### Example:
**Input:**
```
Description: "Uber ride to office"
Amount: 250
```

**Expected Output:**
```
Transport
```

### Implementation:
Located in `server/src/utils/aiClient.js` → `categorizeExpense()` method

---

## 2. Monthly AI Summary / Insights

**Goal:** Analyze monthly expenses and provide actionable insights

### System Message:
```
You analyze personal finance data and explain it clearly and briefly. Use friendly language with numbers and percentages.
```

### User Message Template:
```
Here is the user's monthly expense summary as JSON:
{jsonSummary}

Generate a short paragraph (4-6 lines) explaining:
1. where they spent the most,
2. where they overspent compared to last month,
3. one simple saving suggestion.
```

### Example JSON Summary:
```json
{
  "month": "2025-12",
  "total": 24500,
  "byCategory": {
    "Food": 9000,
    "Transport": 3500,
    "Shopping": 5000,
    "Bills": 3000,
    "Entertainment": 2500,
    "Others": 500
  },
  "changeFromLastMonthPercent": 18
}
```

### Expected Output Example:
```
This month you spent ₹24,500 total, which is 18% higher than last month. Your biggest expense was Food (₹9,000), followed by Shopping (₹5,000). You're spending significantly on non-essentials like shopping and entertainment. Consider setting a weekly food budget and reducing impulse purchases to save at least ₹2,000 next month.
```

### Implementation:
Located in `server/src/utils/aiClient.js` → `generateInsight()` method

---

## 3. Q&A on Spending (Insights Chat)

**Goal:** Answer user questions about their spending patterns

### System Message:
```
You are an AI that answers questions about a user's spending patterns from their transaction history. Use only the given data.
```

### User Message Template:
```
Transactions (JSON):
{transactionsJson}

User question: "{userQuestion}"

Answer in 3-6 lines, referring to specific amounts and categories if helpful.
```

### Example:
**Transactions:**
```json
[
  {"date": "2025-12-05", "description": "Lunch at cafe", "amount": 450, "category": "Food"},
  {"date": "2025-12-04", "description": "Movie tickets", "amount": 600, "category": "Entertainment"},
  {"date": "2025-12-03", "description": "Grocery shopping", "amount": 2500, "category": "Food"}
]
```

**User Question:**
```
How much did I spend on food this week?
```

**Expected Output:**
```
Based on your recent transactions, you spent ₹2,950 on food this week. This includes ₹450 for lunch at a cafe and ₹2,500 for grocery shopping. Food is your highest spending category recently.
```

### Implementation:
Located in `server/src/utils/aiClient.js` → `answerQuestion()` method

---

## 4. Budget Prediction / Overspend Alert

**Goal:** Predict if user will exceed budget based on current spending

### System Message:
```
You estimate whether the user will exceed their budget this month based on current daily average spending.
```

### User Message Template:
```
Data:
- Monthly budget: {budget}
- Month days: {daysInMonth}
- Today: day {today}
- Amount spent so far: {spentSoFar}

Predict total spending by month end and say if they are likely to exceed the budget. Explain in 3-5 lines.
```

### Example:
**Input:**
```
Data:
- Monthly budget: 30000
- Month days: 30
- Today: day 10
- Amount spent so far: 12000
```

**Expected Output:**
```
You've spent ₹12,000 in 10 days, averaging ₹1,200 per day. At this rate, you'll spend approximately ₹36,000 by month end, which is ₹6,000 over your ₹30,000 budget. You need to reduce daily spending to ₹900 for the remaining 20 days to stay within budget.
```

### Implementation:
Can be implemented in `server/src/controllers/aiController.js` as a new endpoint

---

## AI Provider Configuration

### OpenAI (Recommended)
- Model: `gpt-3.5-turbo`
- Temperature: `0.7`
- Max Tokens: `200`
- API Endpoint: `https://api.openai.com/v1/chat/completions`

### Hugging Face (Alternative)
- Model: `facebook/blenderbot-400M-distill` or similar
- API Endpoint: `https://api-inference.huggingface.co/models/{model-name}`

### Environment Variables Required:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-key-here
# OR
AI_PROVIDER=huggingface
HF_API_KEY=your-key-here
```

---

## Best Practices

1. **Keep prompts focused** - Each prompt should have a single, clear objective
2. **Provide context** - Include relevant data in JSON format for consistency
3. **Set expectations** - Specify output format (word count, structure)
4. **Use system messages** - Define the AI's role and behavior
5. **Handle errors gracefully** - Always have fallback responses
6. **Test with edge cases** - Unusual descriptions, large amounts, etc.

---

## Testing AI Responses

You can test AI categorization via API:

```bash
POST /api/ai/categorize
{
  "description": "Coffee at Starbucks",
  "amount": 350
}
```

Generate insights:
```bash
POST /api/ai/insights
```

Ask questions:
```bash
POST /api/ai/ask
{
  "question": "What did I spend the most on this month?"
}
```

---

## Future Enhancements

- [ ] Add sentiment analysis for spending patterns
- [ ] Implement predictive budgeting with ML models
- [ ] Add receipt OCR for automatic expense entry
- [ ] Multi-language support for prompts
- [ ] Custom AI training on user spending history

---

**Last Updated:** December 10, 2025
