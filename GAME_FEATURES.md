# 🎮 Game Features & Database Integration

## 📊 Database Save Functionality

Your Courtroom Debugging Game now has **complete database integration** with smart save functionality!

---

## ✨ New Features

### 1. **Completion Modal with Save Button** 🎉

When you complete all challenges:
- ✅ **Beautiful completion modal** appears with congratulations message
- ✅ **Save Record Button** - Click to manually save your winning record
- ✅ **Shows your completion time**
- ✅ **Success/error feedback** when saving
- ✅ **Button disappears** after successfully saving (prevents duplicate saves)
- ✅ **Options** to play again or return to builder

**What gets saved:**
```json
{
  "userName": "Your Name",
  "completionStatus": "completed",
  "timeTaken": 45,  // in seconds
  "totalChallenges": 5,
  "challengesCompleted": 5
}
```

---

### 2. **Automatic Failure Record Saving** ⏰

Failed attempts are **automatically saved** to the database in two scenarios:

#### Scenario A: Time Runs Out ⏰
- Timer expires before completing all challenges
- Record is **automatically saved** as "failed"
- Modal shows time and challenges completed
- No manual save button needed (already saved)

#### Scenario B: Sent to Courtroom ⚖️
- Ignored 2+ urgent messages
- Sent to courtroom scene
- Record is **automatically saved** as "failed"
- Modal shows why you failed

**What gets saved for failures:**
```json
{
  "userName": "Your Name",
  "completionStatus": "failed",
  "timeTaken": 60,  // time when failed
  "totalChallenges": 5,
  "challengesCompleted": 3  // how many you finished
}
```

---

## 🎯 How It Works

### Game Flow:

```
1. Builder Mode → Enter your name
                ↓
2. Build Game → Fill 5 challenges
                ↓
3. Start Game → Timer starts
                ↓
4. Play:
   ├─ Complete all challenges → SUCCESS MODAL (click "Save Record")
   ├─ Time runs out → FAILURE MODAL (auto-saved)
   └─ Ignore urgent messages → COURTROOM → FAILURE MODAL (auto-saved)
                                ↓
5. View records → npm run db:view
```

---

## 📋 Testing the Feature

### Test 1: Successful Completion
```bash
1. Go to http://localhost:3000/escape-room
2. Enter your name in the builder
3. Fill in all 5 challenges
4. Click "Build Game"
5. Click "Start Game"
6. Complete all challenges before time runs out
7. ✅ Completion modal appears
8. Click "💾 Save Record to Database"
9. See success message: "✅ Record saved successfully!"
10. Run: npm run db:view
11. Your completion record should be visible!
```

### Test 2: Timeout Failure
```bash
1. Build a game with 60s timer (or reduce to 10s for quick testing)
2. Start the game
3. Wait for timer to expire without completing challenges
4. ⏰ Failure modal appears automatically
5. See: "📊 Your failure record has been automatically saved"
6. Run: npm run db:view
7. Your failure record should be visible with status "failed"
```

### Test 3: Courtroom Failure
```bash
1. Build and start a game
2. Wait for an URGENT message (appears randomly)
3. Click "Ignore" on the urgent message
4. Wait for another URGENT message
5. Click "Ignore" again
6. ⚖️ Sent to courtroom, failure modal appears
7. Record automatically saved
8. Run: npm run db:view
9. Your failure record should be visible
```

---

## 🗄️ Database Records

### View All Records
```bash
npm run db:view
```

**Example Output:**
```
📊 Found 3 record(s) in the database:

═══════════════════════════════════════════════════════════════════════
ID  | User Name      | Status      | Time   | Challenges | Created At
═══════════════════════════════════════════════════════════════════════
1   | Alice          | completed   | 45s    | 5/5        | 10/22/2025, 10:30 PM
2   | Bob            | failed      | 60s    | 3/5        | 10/22/2025, 10:32 PM
3   | Charlie        | failed      | 35s    | 2/5        | 10/22/2025, 10:35 PM
═══════════════════════════════════════════════════════════════════════
```

### Clear All Records (for testing)
If you want to start fresh:
```bash
psql -U postgres -d courtroom_db -c "DELETE FROM game_completions;"
```

Or using Docker:
```bash
docker exec -it courtroom_postgres psql -U postgres -d courtroom_db -c "DELETE FROM game_completions;"
```

---

## 🎨 UI Features

### Completion Modal Features:
- 🎉 **Celebration emoji** and green success color
- ⏱️ **Shows completion time**
- 💾 **Save Record button** (only appears if not saved yet)
- ✅ **Success feedback** with green badge
- 🔄 **Play Again** button
- ← **Back to Builder** button

### Failure Modal Features:
- ⏰/⚖️ **Context-specific emoji** (clock for timeout, gavel for courtroom)
- 📊 **Auto-save confirmation** message
- 📈 **Shows progress** (challenges completed / total)
- ⏱️ **Shows time survived**
- 🔄 **Try Again** button
- ← **Back to Builder** button

---

## 🔧 Technical Details

### State Management:
- `gameCompleted` - Triggers success modal
- `gameFailed` - Triggers failure modal
- `recordSaved` - Tracks if record was saved
- `saveMessage` - Shows save status feedback

### Auto-Save Triggers:
1. Timer expiration (`time >= gameTimer`)
2. Courtroom scene (`urgentIgnoreCount >= 2`)

### Manual Save:
- Only available on **successful completion**
- Button disabled after save to prevent duplicates
- Visual feedback during save process

---

## 📊 Database Schema

```sql
CREATE TABLE game_completions (
  id                     SERIAL PRIMARY KEY,      -- Auto-increment
  userName              VARCHAR(255) NOT NULL,
  completionStatus      ENUM('completed', 'failed', 'in_progress'),
  timeTaken             INTEGER,
  totalChallenges       INTEGER,
  challengesCompleted   INTEGER,
  createdAt             TIMESTAMP DEFAULT NOW(),
  updatedAt             TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Key Improvements

### Before:
- ❌ No visual feedback when game ends
- ❌ Alert boxes for completion
- ❌ Records never actually saved
- ❌ No failure tracking

### After:
- ✅ Beautiful modals with animations
- ✅ Manual save for completions
- ✅ **Automatic save for failures**
- ✅ Real-time feedback
- ✅ Prevents duplicate saves
- ✅ All records properly stored in database
- ✅ Tracks both wins and losses

---

## 🎮 Play Now!

```bash
# Start the development server
npm run dev

# Open in browser
http://localhost:3000/escape-room

# Play the game, complete or fail
# Check the database
npm run db:view
```

---

**Your game now has complete database integration! Every play session can be tracked! 🚀**

