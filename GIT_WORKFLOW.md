# Daily Git Workflow

## Initial Setup (Done ✓)
```bash
cd c:\Users\sudha\OneDrive\Desktop\MAIN\ai-finance-tracker
git clone https://github.com/Sudharsanv06/Ai_finance_tracker.git .
```

## Daily Workflow (Repeat Every Day)

After you finish your day's tasks:

### 1. Check What Changed
```bash
git status
```
This shows all modified, added, or deleted files.

### 2. Stage Your Changes
```bash
# Stage all changes
git add .

# Or stage specific files
git add <filename>
```

### 3. Commit With a Clear Message
```bash
git commit -m "Day X: <short description>"
```

**Examples of good commit messages:**
- `git commit -m "Day 1: setup client and server structure"`
- `git commit -m "Day 2: add database models and schemas"`
- `git commit -m "Day 3: implement user authentication"`
- `git commit -m "Day 4: expense CRUD APIs"`
- `git commit -m "Day 5: frontend expense form and list"`
- `git commit -m "Day 6: AI expense categorization"`

### 4. Push to GitHub
```bash
git push origin main
```

## Quick Reference Commands

```bash
# View commit history
git log --oneline

# View changes before staging
git diff

# View changes after staging
git diff --staged

# Undo staged changes (before commit)
git restore --staged <filename>

# Discard local changes (careful!)
git restore <filename>

# Pull latest changes from GitHub
git pull origin main
```

## Common Scenarios

### If you forgot to pull before making changes:
```bash
git pull origin main
# If conflicts occur, resolve them, then:
git add .
git commit -m "Merge remote changes"
git push origin main
```

### If you want to see what you did today:
```bash
git log --since="today" --oneline
```

### If you made a mistake in the last commit message:
```bash
git commit --amend -m "Day X: corrected message"
git push origin main --force
```

## Best Practices

✅ **DO:**
- Commit at the end of each day
- Write clear, descriptive commit messages
- Test your code before committing
- Push regularly to backup your work

❌ **DON'T:**
- Commit broken/non-working code
- Use vague messages like "updated files"
- Forget to push (your work isn't backed up until pushed!)
- Commit sensitive data (API keys, passwords)

## Project Structure Template

As you build, your project might look like:
```
ai-finance-tracker/
├── client/           # Frontend (React/Next.js)
├── server/           # Backend (Node.js/Express)
├── .gitignore        # Files to ignore
├── README.md         # Project documentation
├── package.json      # Dependencies
└── GIT_WORKFLOW.md   # This file
```

---

**Remember:** Git is your safety net. Commit often, push regularly, and your work is always safe! 🚀
