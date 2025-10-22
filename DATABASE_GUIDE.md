# 📊 Database Guide - Courtroom Game

This guide shows you how to view and manage your PostgreSQL database records.

## 🚀 Quick Commands

### View All Database Records
```bash
npm run db:view
```
This will display a nicely formatted table of all game completion records.

### Test Database Connection
```bash
npm run db:test
```
Verifies that your database connection is working.

---

## 📋 Method 1: Using the View Script (Recommended)

The easiest way to check your records:

```bash
npm run db:view
```

**Output Example:**
```
📊 Found 4 record(s) in the database:

════════════════════════════════════════════════════════════════
ID     | User Name    | Status      | Time   | Challenges | Created At                    
════════════════════════════════════════════════════════════════
1      | TestUser     | completed   | 120s   | 5/5        | 10/22/2025, 9:49:52 PM        
2      | Alice        | completed   | 90s    | 5/5        | 10/22/2025, 9:50:14 PM        
3      | Bob          | failed      | 60s    | 3/5        | 10/22/2025, 9:50:14 PM        
4      | Charlie      | completed   | 110s   | 5/5        | 10/22/2025, 9:50:14 PM        
════════════════════════════════════════════════════════════════
```

---

## 🔧 Method 2: Using PostgreSQL CLI (psql)

If you have PostgreSQL installed locally:

### Connect to Database
```bash
psql -U postgres -d courtroom_db
```

### Useful SQL Queries
```sql
-- View all records
SELECT * FROM game_completions ORDER BY id ASC;

-- Count total records
SELECT COUNT(*) FROM game_completions;

-- View only completed games
SELECT * FROM game_completions WHERE "completionStatus" = 'completed';

-- View only failed games
SELECT * FROM game_completions WHERE "completionStatus" = 'failed';

-- Get statistics
SELECT 
    "completionStatus",
    COUNT(*) as count,
    AVG("timeTaken") as avg_time
FROM game_completions
GROUP BY "completionStatus";

-- Exit psql
\q
```

---

## 🐳 Method 3: Using Docker

If you're running the database in Docker:

### Connect to PostgreSQL in Docker
```bash
docker exec -it courtroom_postgres psql -U postgres -d courtroom_db
```

Then use the SQL queries from Method 2.

---

## 🖥️ Method 4: Using pgAdmin (GUI Tool)

1. **Download pgAdmin**: https://www.pgadmin.org/download/
2. **Add New Server**:
   - Host: `localhost`
   - Port: `5432`
   - Database: `courtroom_db`
   - Username: `postgres`
   - Password: `postgres`
3. Navigate to: `Servers > courtroom_db > Schemas > public > Tables > game_completions`
4. Right-click on `game_completions` → **View/Edit Data** → **All Rows**

---

## 🗂️ Database Schema

### Table: `game_completions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-increments (1, 2, 3...) |
| `userName` | STRING | Player's name |
| `completionStatus` | ENUM | 'completed', 'failed', or 'in_progress' |
| `timeTaken` | INTEGER | Time taken in seconds |
| `totalChallenges` | INTEGER | Total number of challenges |
| `challengesCompleted` | INTEGER | Number completed |
| `createdAt` | TIMESTAMP | Auto-generated creation time |
| `updatedAt` | TIMESTAMP | Auto-generated update time |

---

## 📊 Common Queries Explained

### Find the fastest completion time:
```sql
SELECT "userName", "timeTaken" 
FROM game_completions 
WHERE "completionStatus" = 'completed' 
ORDER BY "timeTaken" ASC 
LIMIT 1;
```

### Count wins vs losses:
```sql
SELECT 
    "completionStatus",
    COUNT(*) as total
FROM game_completions
GROUP BY "completionStatus";
```

### View recent games:
```sql
SELECT * FROM game_completions 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

---

## 🧹 Maintenance Commands

### Run Migrations
```bash
npm run db:migrate
```

### Undo Last Migration
```bash
npm run db:migrate:undo
```

### Clear All Records (⚠️ Use with caution!)
```bash
psql -U postgres -d courtroom_db -c "DELETE FROM game_completions;"
```

---

## 🔍 Troubleshooting

### Database Connection Errors
1. Make sure PostgreSQL is running:
   ```bash
   # Check if PostgreSQL service is running
   # Windows:
   Get-Service -Name postgresql*
   
   # Or check if port 5432 is open:
   netstat -ano | findstr :5432
   ```

2. Test connection:
   ```bash
   npm run db:test
   ```

3. Check environment variables in `.env.local`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=courtroom_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

---

## 📝 Notes

- **Auto-Incrementing IDs**: The `id` field automatically increments (1, 2, 3, 4...)
- **Timestamps**: `createdAt` and `updatedAt` are automatically managed by Sequelize
- **Data Persistence**: Records remain in the database even after restarting the server

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| View all records | `npm run db:view` |
| Test connection | `npm run db:test` |
| Run migrations | `npm run db:migrate` |
| Connect via CLI | `psql -U postgres -d courtroom_db` |
| Connect via Docker | `docker exec -it courtroom_postgres psql -U postgres -d courtroom_db` |

---

**Happy Database Querying! 🎉**

