# 🎉 Pathwise Coach UI - Implementation Complete!

## What We've Built

### ✅ All 3 Priorities COMPLETE

---

## **Priority #1: Rich Scenario Storylines** ✅

### Backend (`pathwise/src/engine/`)
- **Enhanced Scenario Types** (`scenarioTypes.ts`)
  - `OrgContext` - Company, team, recent events, performance history
  - `CharacterBio` - Name, role, persona type, motivations, stressors, triggers, communication style
  - `SituationBrief` - What happened, manager goals, constraints, risks
  - `HiddenGoals` - Primary/secondary goals, relationship goals, legal considerations
  - Success criteria with difficulty levels

- **3 Rich Scenarios** (`scenarios/scenarioLibrary.ts`)
  1. **The Defensive Developer** (Novice)
     - Missed deadlines, deflecting blame
     - Persona: Defensive, blame-deflecting
     - Triggers: Vague criticism, comparisons, feeling unrecognized
  
  2. **The Checked-Out Senior** (Intermediate)
     - Previously star performer, now disengaged
     - Persona: Checked out, emotionally distant
     - Complex: Passed over for promotion, golden handcuffs
  
  3. **The High Performer with Bias Complaint** (Advanced)
     - DEI topic, formal HR complaint
     - Persona: High performer, direct communicator
     - High stakes: Legal considerations, representation issues

- **Server API** (`server/server.ts`)
  - `GET /api/scenarios/library` - List all scenarios
  - `GET /api/scenarios/:id` - Get full scenario details for briefing

### Frontend Components

- **ScenarioSelector** (`client/src/components/ScenarioSelector.tsx`)
  - Browse scenarios by skill tags (difficult_feedback, performance_pip, dei_topic, etc.)
  - Filter by difficulty (novice/intermediate/advanced)
  - Beautiful card layout with character previews
  - Shows estimated time, character info, skill tags

- **ScenarioBriefing** (`client/src/components/ScenarioBriefing.tsx`)
  - **4-page interactive briefing:**
    - Page 1: Mission Brief (org context, what happened)
    - Page 2: Know Your Employee (character bio, motivations, stressors, triggers)
    - Page 3: Your Mission (goals, win conditions, ideal outcome)
    - Page 4: Watch Out (constraints, risks, legal landmines)
  - Progress bar, beautiful gradients, emoji icons
  - Direct "Start Scenario" button after briefing

---

## **Priority #2: Coaching Framework (SBI)** ✅

### Backend (`pathwise/src/agents/`)

- **HR Agent Enhanced** (`HRAgent.ts`)
  - Evaluates using **SBI Framework** (Situation-Behavior-Impact)
  - Framework guidelines injected into prompt
  - Outputs framework assessment:
    - Which elements are present/missing
    - Overall framework score (0-100)
    - Suggested rewrite if feedback is vague
  - Example: "You jumped to Impact without establishing Situation"

- **Shadow Thoughts Extended** (`types.ts`)
  - Added `frameworkAssessment` field
  - Added `suggestedRewrite` field
  - Now shows framework-aligned better phrasing

### How It Works

**Good SBI Example:**
> "In Monday's client call [S], you interrupted the client twice [B], which made them seem frustrated and we lost the deal [I]."

**Bad (vague):**
> "You have a bad attitude in meetings." ❌

**HR Agent Response:**
```json
{
  "framework_assessment": {
    "framework": "SBI",
    "elements_present": [],
    "elements_missing": ["Situation", "Behavior", "Impact"],
    "overall_score": 20
  },
  "suggested_rewrite": "In yesterday's team meeting [S], you rolled your eyes when Jane presented her idea [B], which made her stop mid-sentence and disengage for the rest of the meeting [I]."
}
```

---

## **Priority #3: Coach UI** ✅

### CoachHome (`client/src/components/CoachHome.tsx`)

**Comprehensive coach dashboard with:**

- **Stats Overview**
  - Total scenarios
  - Total runs across all scenarios
  - Average performance score
  - Active learners count

- **Scenario Management**
  - Search and filter scenarios
  - View all/library/custom tabs
  - Each scenario card shows:
    - Name, description, difficulty
    - Character preview (name, role, avatar)
    - Persona type badge
    - Skill tags
    - Performance stats (times run, avg score)

- **Quick Actions**
  - **Configure** - Edit character personality & prompts
  - **Test Run** - Try it yourself
  - **Analytics** - View performance data
  - Duplicate, Export, Archive

### ScenarioConfigurator (`client/src/components/ScenarioConfigurator.tsx`)

**🎯 THE KEY FEATURE - Where You Test Personalities & Prompt Levers!**

#### Character Tab (Main Focus)

**1. Character Identity & Persona**
- Name, Role, Tenure
- **Persona Type Dropdown** - Changes core AI behavior:
  - Defensive - Deflects blame, makes excuses
  - Checked Out - Disengaged, minimal effort
  - High Performer - Confident, expects recognition
  - Hostile - Aggressive, confrontational
  - Overwhelmed - Stressed, emotional
  - Passive Aggressive - Subtle resistance

**2. Communication Style (Direct Prompt Lever)**
- Free-text field controlling how AI responds
- Example: "Initially polite but quickly becomes defensive when criticized"
- **This directly injects into the prompt!**

**3. Psychological Profile**
- **Motivations** (Green) - What drives them
  - Add/remove/edit motivations dynamically
  - Example: "Wants to be seen as valuable team member"
  
- **Stressors** (Red) - Current pressures
  - Add/remove/edit stressors
  - Example: "Working on unfamiliar codebase after restructure"

**4. Trigger Points (Purple) - CRITICAL LEVER**
- Controls when AI becomes defensive/hostile/shuts down
- Add/remove triggers
- Examples:
  - "Vague criticism without specific examples"
  - "Being compared to others"
  - "Feeling like efforts aren't recognized"
- **Super powerful for testing feedback approaches!**

**5. Identity & Context (Blue) - Optional**
- Identity dimensions (for DEI scenarios)
- Personal circumstances (adds depth)

#### Other Tabs (Placeholder for now)
- Situation & Context
- Goals & Outcomes  
- Success Criteria

---

## How to Use for Testing

### Quick Test Flow:

1. **Navigate to Coach Dashboard**
   ```
   http://localhost:5173/coach
   ```

2. **Click "Configure" on any scenario**
   - Opens ScenarioConfigurator

3. **Tweak the Personality Levers:**
   - Change persona type (defensive → hostile)
   - Edit communication style
   - Add/remove triggers
   - Adjust motivations/stressors

4. **Click "Test Run"**
   - Runs scenario with your custom configuration
   - See how AI responds differently!

5. **Iterate**
   - Try different trigger combinations
   - Test various communication styles
   - See how persona types change behavior

### Example Test:

**Scenario**: Defensive Developer  
**Test 1**: Persona = "Defensive", Trigger = "Vague criticism"  
**Manager says**: "You need to improve your attitude"  
**AI Response**: *Gets very defensive, shuts down*

**Test 2**: Change Trigger to "Not being heard"  
**Manager says**: Same thing  
**AI Response**: *Different defensive pattern - asks "Can you be more specific?"*

**Test 3**: Change Persona to "Overwhelmed"  
**Manager says**: Same thing  
**AI Response**: *Shows stress, apologizes, asks for help*

---

## File Structure

```
pathwise/
├── src/                           # Backend
│   ├── engine/
│   │   ├── scenarioTypes.ts      # Enhanced types with rich storylines
│   │   └── scenarios/
│   │       ├── scenarioLibrary.ts # 3 rich scenarios
│   │       └── index.ts           # Exports
│   ├── agents/
│   │   ├── HRAgent.ts             # SBI framework evaluation
│   │   ├── EmployeeAgent.ts       # Uses backstory
│   │   └── types.ts               # Framework assessment types
│   └── server/
│       └── server.ts              # API endpoints for scenarios
│
└── client/                        # Frontend
    └── src/
        └── components/
            ├── ScenarioSelector.tsx     # Browse scenarios by skill
            ├── ScenarioBriefing.tsx     # 4-page briefing
            ├── CoachHome.tsx            # Coach dashboard
            └── ScenarioConfigurator.tsx # THE KEY TOOL - Edit personalities!
```

---

## Next Steps

### To Run & Test:

1. **Backend should already be running** (port 3000)
2. **Frontend should already be running** (port 5173)
3. **Navigate to**: `http://localhost:5173/coach`

### If you need to restart:

```bash
# Backend
cd pathwise && npm run dev

# Frontend
cd pathwise/client && npm run dev
```

### To integrate with existing app:

You'll need to add routing in `App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoachHome from './components/CoachHome';
import ScenarioConfigurator from './components/ScenarioConfigurator';

// Add routes:
<Route path="/coach" element={<CoachHome />} />
<Route path="/coach/scenario/:id/configure" element={<ScenarioConfigurator />} />
```

---

## What You Can Test Now

1. **Different Persona Types**
   - How does "defensive" vs "hostile" vs "overwhelmed" change responses?

2. **Trigger Combinations**
   - What happens when you add "feeling unheard" as a trigger?
   - How does AI react to vague vs. specific feedback?

3. **Communication Styles**
   - "Passive aggressive" vs "Direct and confrontational"
   - See how it changes the conversation tone

4. **Motivations & Stressors**
   - Add financial pressure → see if AI mentions it
   - Add "wants recognition" → see if AI brings it up

5. **SBI Framework**
   - Test vague feedback → see HR agent's suggested rewrite
   - Test good SBI feedback → see high framework score

---

## 🎉 **All 3 Priorities Complete!**

You now have:
- ✅ Rich, story-based scenarios with deep character profiles
- ✅ SBI framework evaluation with rewrites
- ✅ Coach UI to configure & test personality levers

**Ready to test different personalities and see how prompt engineering changes AI behavior!** 🚀


