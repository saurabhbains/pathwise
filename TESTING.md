# Testing Guide - Pathwise

## Quick Start (Get It Running in 5 Minutes!)

### Step 1: Set Up Environment

```bash
# 1. Make sure you have Node.js installed (18+)
node --version

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and add your Gemini API key
# Get your API key from: https://makersuite.google.com/app/apikey
# Set: GEMINI_API_KEY=your_key_here
# Set: LLM_PROVIDER=gemini
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 3: Start the Application

**Terminal 1 - Backend Server:**
```bash
npm run dev
```

You should see:
```
[INFO] Server listening on port 3000
[INFO] WebSocket available at ws://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

### Step 4: Open and Test!

1. **Open your browser** to `http://localhost:5173`

2. **Check connection status** in the top-right corner:
   - Green dot = Connected ✅
   - Red dot = Disconnected ❌

3. **Start a conversation** - Try these example messages:

   **Good Example (Specific feedback):**
   ```
   Hi Alex, I wanted to discuss your performance. I noticed that the Q3 API project was delivered 5 days late, and the mobile feature was 3 days overdue. Can you help me understand what happened?
   ```

   **Bad Example (Will trigger warnings):**
   ```
   You're just not fitting in with the team culture. Your attitude has been concerning.
   ```

   **Better Example (Specific behaviors):**
   ```
   In last week's team meeting, I observed that you interrupted Sarah three times. In code reviews, comments like "this is wrong" without explanation impact team collaboration.
   ```

4. **Watch the Coach Dashboard** (right side):
   - **Metrics** update in real-time
   - **Shadow Feed** shows what the employee and HR are really thinking
   - **Flags** appear when you use problematic language

## What to Look For

### ✅ Good Signs:
- **Psychological Safety**: Stays above 70
- **Legal Risk**: Stays below 30
- **Clarity**: Above 70
- **Shadow Feed**: Shows employee is receptive, not defensive

### ⚠️ Warning Signs:
- **Metrics turning yellow/red**
- **Employee flags**: "potential-bias", "feels-attacked"
- **HR flags**: "vague-feedback", "legal-risk"

### ❌ Problematic Statements:
Try these to see the system detect issues:
- "You're not a good fit for the team"
- "Your attitude is the problem"
- "Everyone thinks you're difficult to work with"

## Testing Scenarios

### Scenario 1: The Professional Manager
**Goal**: Keep all metrics green

1. Start with clear context
2. Use specific examples with dates
3. Ask open-ended questions
4. Focus on behaviors, not personality

### Scenario 2: The Struggling Manager
**Goal**: Learn from mistakes

1. Use vague language ("bad attitude")
2. Watch legal risk spike
3. See employee get defensive
4. Try to recover with better feedback

### Scenario 3: The Learning Journey
**Goal**: See improvement over conversation

1. Start poorly (vague feedback)
2. Notice the metrics drop
3. Adjust approach (specific examples)
4. Watch metrics improve

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### Frontend Can't Connect
1. Check backend is running on port 3000
2. Look for "WebSocket connected" in browser console (F12)
3. Check connection indicator (top-right)

### No AI Responses
1. Check `.env` has `GEMINI_API_KEY` set
2. Check backend terminal for errors
3. Verify `LLM_PROVIDER=gemini` in `.env`

### Slow Responses
- Normal! Gemini takes 2-5 seconds to generate responses
- Watch for "Alex is typing..." indicator

## Advanced Testing

### Test Individual Components

**Test Gemini Adapter:**
```bash
npm run dev src/test-gemini.ts
```

**Test Multi-Agent System:**
```bash
npm run dev src/test-agents.ts
```

**Test Scenario Engine:**
```bash
npm run dev src/test-scenario.ts
```

## What You're Actually Testing

### Backend:
- ✅ Gemini LLM integration
- ✅ Employee agent (defensive behaviors)
- ✅ HR agent (legal risk monitoring)
- ✅ Scenario engine (performance review)
- ✅ WebSocket communication

### Frontend:
- ✅ Chat interface
- ✅ Real-time metrics display
- ✅ Shadow channel feed
- ✅ WebSocket connection
- ✅ Auto-scrolling and UX

## Sample Conversation Flow

```
YOU: Hi Alex, thanks for meeting. I want to discuss your recent performance.

ALEX: Sure, what did you want to talk about?

[Shadow: Employee is cautiously open]
[Metrics: All green - good start]

YOU: You missed the deadline on the API project by 5 days. What happened?

ALEX: Oh, well there were some unexpected issues with the database migration...

[Shadow: Employee is deflecting, mentioning obstacles]
[Metrics: Slight drop in psychological safety]

YOU: I understand there were challenges. Let's work together on a plan to prevent this. What support do you need?

ALEX: Well, maybe more time for testing would help...

[Shadow: Employee is opening up with specific needs]
[Metrics: Psychological safety improving]
```

## Expected Behavior

- **First message**: Takes 3-5 seconds (cold start)
- **Subsequent messages**: 2-3 seconds each
- **Metrics**: Update immediately after each response
- **Shadow thoughts**: 2 per turn (Employee + HR)
- **Flags**: Appear when problematic language detected

## Feedback

Found a bug? Something not working?
- Check browser console (F12) for errors
- Check backend terminal for server errors
- Note which message caused the issue

---

**Ready to test? Start from Step 1 above!** 🚀
