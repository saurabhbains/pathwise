# Voice Setup Guide - Google Cloud Text-to-Speech

This guide will help you set up distinct AI voices for different agents (Employee vs HR) using Google Cloud TTS.

## Why Google Cloud TTS?

✅ **Consistency**: Each agent always sounds the same
✅ **Speed**: Faster than Gemini's native audio generation
✅ **Quality**: Neural2 voices sound very human-like
✅ **Differentiation**: Distinct male/female voices for easy identification

## Voice Profiles

| Agent | Voice | Gender | Description |
|-------|-------|--------|-------------|
| **Employee (Alex)** | `en-US-Neural2-F` | Female | Younger, defensive tone |
| **HR Observer** | `en-US-Neural2-D` | Male | Professional, authoritative |
| **System Narrator** | `en-US-Neural2-C` | Female | Neutral, system messages |

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Note your Project ID

### 2. Enable Text-to-Speech API

1. Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Text-to-Speech API"
3. Click **Enable**

### 3. Create Service Account

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **Create Service Account**
3. Name it: `pathwise-tts-service`
4. Click **Create and Continue**
5. Grant role: **Cloud Text-to-Speech User**
6. Click **Done**

### 4. Download Credentials (JSON Key)

1. Find your newly created service account in the list
2. Click the **three dots** menu → **Manage keys**
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. Save the downloaded JSON file to a secure location

**Example location:**
```
/Users/yourname/pathwise-credentials/
  └── pathwise-tts-key.json
```

### 5. Set Environment Variable

Add to your `.env` file:

```bash
# Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/your/pathwise-tts-key.json
```

**Example:**
```bash
GOOGLE_APPLICATION_CREDENTIALS=/Users/saurabhbains/pathwise-credentials/pathwise-tts-key.json
```

### 6. Install Dependencies

```bash
# Backend dependency already added
npm install

# This will install @google-cloud/text-to-speech
```

### 7. Test It!

Start the backend:

```bash
npm run dev
```

You should see in the logs:
```
[INFO] Google Cloud TTS initialized
```

If TTS is NOT available, you'll see:
```
[WARN] Google Cloud TTS not available - audio disabled
```

## Testing Audio

### Test with Full App

1. Start backend: `npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Open `http://localhost:5173`
4. Send a message
5. **Listen** for Alex's voice response!

### Expected Behavior

- ✅ Female voice (Alex, the employee)
- ✅ Audio plays automatically after text appears
- ✅ Natural-sounding speech (Neural2 quality)
- ✅ Consistent voice across all responses

## Troubleshooting

### "Google Cloud TTS not available"

**Check 1: Credentials Path**
```bash
# Verify file exists
ls -la $GOOGLE_APPLICATION_CREDENTIALS

# Should show your JSON file
```

**Check 2: Environment Variable**
```bash
# Print it
echo $GOOGLE_APPLICATION_CREDENTIALS

# Should show full path to JSON file
```

**Check 3: JSON File Permissions**
```bash
# Make sure it's readable
chmod 600 /path/to/pathwise-tts-key.json
```

**Check 4: API Enabled**
- Verify Text-to-Speech API is enabled in Google Cloud Console
- Check for any billing issues (free tier: 1M characters/month)

### Audio Doesn't Play in Browser

**Browser Autoplay Policy:**
Modern browsers block autoplay until user interaction.

**Solution:**
- Click anywhere on the page first
- Or the user sends at least one message (interaction)

**Check Console:**
```javascript
// Open browser console (F12)
// Look for: "Error playing audio"
```

### Audio Quality Issues

**Slow/Choppy:**
- Normal! First TTS request can take 1-2 seconds
- Subsequent requests are faster (~500ms)

**Wrong Voice:**
- Check `voiceGenerator.ts` for voice assignments
- Employee should be `en-US-Neural2-F`

## Cost Estimate

**Free Tier:**
- 1 million characters/month FREE
- After that: $4 per 1M characters

**Typical Usage:**
- Average employee response: ~100-200 characters
- 1,000 responses = ~150,000 characters
- **Well within free tier for testing/demos!**

## Advanced: Customizing Voices

Edit `src/audio/voiceGenerator.ts`:

```typescript
const VOICE_CONFIGS: Record<VoiceProfile, VoiceConfig> = {
  [VoiceProfile.EMPLOYEE]: {
    languageCode: 'en-US',
    name: 'en-US-Neural2-F',  // ← Change voice here
    ssmlGender: 'FEMALE',
    description: 'Employee Alex'
  },
  // ...
};
```

**Available Voices:**
- `en-US-Neural2-A` - Male
- `en-US-Neural2-C` - Female
- `en-US-Neural2-D` - Male
- `en-US-Neural2-F` - Female
- `en-US-Neural2-G` - Female
- `en-US-Neural2-H` - Female
- `en-US-Neural2-I` - Male
- `en-US-Neural2-J` - Male

[Full list](https://cloud.google.com/text-to-speech/docs/voices)

## Disabling Audio (Optional)

If you don't want audio:
1. Don't set `GOOGLE_APPLICATION_CREDENTIALS`
2. Or comment it out in `.env`
3. System will work fine without audio (text-only)

## Security Best Practices

✅ **Never commit credentials:**
```bash
# Add to .gitignore (already included)
*.json
pathwise-tts-key.json
```

✅ **Use service accounts** (not personal accounts)

✅ **Restrict permissions** (only Text-to-Speech User role)

✅ **Rotate keys periodically** (every 90 days recommended)

---

**All set!** Your AI agents now have distinct, realistic voices. 🎙️

Questions? Check the [Google Cloud TTS docs](https://cloud.google.com/text-to-speech/docs)
