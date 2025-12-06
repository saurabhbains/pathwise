# Coach-Learner Integration Plan

## Current Architecture

### Scenarios are defined in:
- `pathwise/src/engine/scenarios/scenarioLibrary.ts` - 3 rich scenarios with personas
- `pathwise/src/engine/scenarios/performanceReview.ts` - Legacy scenario
- Each scenario has a `CharacterBio` with:
  - `personaType` (DEFENSIVE, CHECKED_OUT, HIGH_PERFORMER, etc.)
  - `motivations`, `stressors`, `triggerPoints`
  - `communicationStyle`

### Current Flow:
1. **Learner** selects from hardcoded scenarios in `ScenarioSelector.tsx`
2. **Backend** loads scenario from `SCENARIO_LIBRARY`
3. **Engine** uses scenario to generate agent behaviors

## Proposed Integration

### 1. Database Schema (Future Enhancement)

```typescript
// Scenario Customizations Table
interface ScenarioCustomization {
  id: string;
  coachId: string;
  baseScenarioId: string; // References the library scenario
  customizations: {
    difficulty?: 'novice' | 'intermediate' | 'advanced';
    persona?: {
      personaType?: PersonaType;
      triggerIntensity?: number; // 1-10 scale
      backstoryAdditions?: string;
      stressors?: string[];
      motivations?: string[];
    };
    context?: {
      orgContext?: Partial<OrgContext>;
      additionalConstraints?: string[];
    };
  };
  assignedTo?: string[]; // Learner IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. API Endpoints Needed

```typescript
// Coach endpoints
POST   /api/coach/scenarios/:id/customize
GET    /api/coach/scenarios/customizations
PATCH  /api/coach/scenarios/customizations/:customId
POST   /api/coach/scenarios/customizations/:customId/assign
DELETE /api/coach/scenarios/customizations/:customId

// Learner endpoints (modified)
GET    /api/scenarios/library          // All base scenarios
GET    /api/scenarios/assigned          // Assigned customized scenarios
GET    /api/scenarios/:id/effective     // Merge base + customizations
```

### 3. Implementation Steps

#### Phase 1: Coach UI for Scenario Customization

Create `pathwise/client/src/components/ScenarioConfigurator.tsx` enhancements:

```typescript
// Current: Just shows scenario details
// Enhanced: Allow real-time editing

interface CustomizationOptions {
  // Difficulty Adjustment
  difficulty: 'novice' | 'intermediate' | 'advanced';
  
  // Persona Adjustments
  personaIntensity: number; // 1-10: How defensive/hostile/checked-out?
  triggerPoints: string[];   // What makes them defensive?
  backstory: string;         // Additional context
  
  // Behavioral Adjustments
  communicationStyle: 'passive-aggressive' | 'direct-hostile' | 'withdrawn' | 'manipulative';
  emotionalState: 'stressed' | 'angry' | 'disengaged' | 'defensive';
  
  // Success Criteria
  minTurns: number;
  requiredTopics: string[];  // Must address these topics
  maxLegalRisk: number;
}
```

#### Phase 2: Real-Time Preview

```typescript
// In ScenarioConfigurator
const [preview, setPreview] = useState<string>('');

useEffect(() => {
  // Generate preview of how persona will behave
  const generatePreview = async () => {
    const response = await fetch('/api/coach/scenarios/preview', {
      method: 'POST',
      body: JSON.stringify({
        baseScenarioId: scenario.id,
        customizations: currentCustomizations
      })
    });
    const data = await response.json();
    setPreview(data.sampleDialog);
  };
  
  generatePreview();
}, [currentCustomizations]);
```

#### Phase 3: Backend Scenario Merging

```typescript
// pathwise/src/engine/scenarioManager.ts (NEW)

export class ScenarioManager {
  /**
   * Merge base scenario with coach customizations
   */
  static getMergedScenario(
    baseScenarioId: string,
    customizations?: ScenarioCustomization
  ): Scenario {
    const base = getScenarioById(baseScenarioId);
    if (!base) throw new Error('Scenario not found');
    
    if (!customizations) return base;
    
    // Deep merge customizations
    return {
      ...base,
      difficulty: customizations.customizations.difficulty || base.difficulty,
      characterBio: {
        ...base.characterBio,
        ...customizations.customizations.persona,
        // Merge arrays
        stressors: [
          ...(base.characterBio.stressors || []),
          ...(customizations.customizations.persona?.stressors || [])
        ],
        // Override communicationStyle if customized
        communicationStyle: 
          customizations.customizations.persona?.backstoryAdditions
            ? `${base.characterBio.communicationStyle}. ${customizations.customizations.persona.backstoryAdditions}`
            : base.characterBio.communicationStyle
      },
      successCriteria: {
        ...base.successCriteria,
        minTurns: customizations.customizations.minTurns || base.successCriteria.minTurns
      }
    };
  }
}
```

#### Phase 4: Assignment System

```typescript
// pathwise/src/server/server.ts - ADD ROUTES

// Coach assigns customized scenario to learners
app.post('/api/coach/scenarios/customizations/:customId/assign', async (req, res) => {
  const { customId } = req.params;
  const { learnerIds } = req.body;
  
  // Store assignment in database
  await db.assignments.create({
    customizationId: customId,
    learnerIds,
    assignedAt: new Date()
  });
  
  res.json({ success: true });
});

// Learner gets assigned scenarios
app.get('/api/scenarios/assigned', async (req, res) => {
  const { learnerId } = req.query;
  
  const assignments = await db.assignments.findByLearner(learnerId);
  const scenarios = await Promise.all(
    assignments.map(async (a) => {
      const customization = await db.customizations.findById(a.customizationId);
      return ScenarioManager.getMergedScenario(
        customization.baseScenarioId,
        customization
      );
    })
  );
  
  res.json({ scenarios });
});
```

### 4. UI Flow

#### For Coaches:
1. Go to `/coach` → See scenario library
2. Click "Configure" on a scenario
3. Adjust sliders/inputs:
   - **Persona Intensity**: 1-10 scale (How defensive?)
   - **Add Stressors**: "Recently became a parent", "Caring for sick family member"
   - **Trigger Words**: Phrases that make them defensive
   - **Difficulty**: Adjusts success criteria thresholds
4. Preview changes (see sample dialog)
5. Click "Assign to Learners"
6. Select learners from list
7. Scenario appears in their queue

#### For Learners:
1. Go to `/` → See:
   - **Scenario Library** (all base scenarios)
   - **Assigned Scenarios** (customized by coach)
2. Assigned scenarios show:
   - "Assigned by [Coach Name]"
   - Custom difficulty badge
   - "Custom scenario" tag
3. Start scenario → Uses merged persona

### 5. Quick Win Implementation (No Database)

For MVP without database:

```typescript
// pathwise/src/server/server.ts

// In-memory storage (resets on server restart)
const customizations = new Map<string, ScenarioCustomization>();

app.post('/api/scenarios/:id/customize', (req, res) => {
  const { id } = req.params;
  const { customizations: custom } = req.body;
  
  const customId = `custom-${Date.now()}`;
  customizations.set(customId, {
    id: customId,
    baseScenarioId: id,
    customizations: custom,
    isActive: true,
    createdAt: new Date()
  });
  
  res.json({ customId, previewUrl: `/simulation?customId=${customId}` });
});

// Use customization in scenario start
app.get('/api/scenarios/:id/effective', (req, res) => {
  const { id } = req.params;
  const { customId } = req.query;
  
  const base = getScenarioById(id);
  if (customId) {
    const custom = customizations.get(customId);
    if (custom) {
      return res.json(ScenarioManager.getMergedScenario(id, custom));
    }
  }
  
  res.json(base);
});
```

## Next Steps

1. **Phase 1 (Quick Win)**: 
   - Add in-memory customization storage
   - Create basic ScenarioConfigurator UI
   - Allow coaches to generate custom URLs for learners
   
2. **Phase 2 (Full Feature)**:
   - Add database (PostgreSQL/MongoDB)
   - Implement user authentication
   - Build assignment system
   - Add real-time preview

3. **Phase 3 (Advanced)**:
   - Version control for scenarios
   - A/B testing different customizations
   - Analytics on which customizations are most effective
   - Scenario templates ("High Stress", "Mild Conflict", etc.)

## Benefits

✅ **Coaches** can tailor scenarios to specific learners' needs
✅ **Learners** get personalized practice
✅ **Same codebase** - just different data
✅ **Real-time** adjustments possible
✅ **Scalable** - one scenario → infinite variations

