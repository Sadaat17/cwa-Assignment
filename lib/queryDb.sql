-- View all records
SELECT * FROM game_completions ORDER BY id ASC;

-- Count total records
SELECT COUNT(*) as total_records FROM game_completions;

-- View only completed games
SELECT * FROM game_completions WHERE "completionStatus" = 'completed';

-- View only failed games
SELECT * FROM game_completions WHERE "completionStatus" = 'failed';

-- Get statistics
SELECT 
    "completionStatus",
    COUNT(*) as count,
    AVG("timeTaken") as avg_time,
    MIN("timeTaken") as best_time,
    MAX("timeTaken") as worst_time
FROM game_completions
GROUP BY "completionStatus";

-- View recent 10 records
SELECT * FROM game_completions ORDER BY "createdAt" DESC LIMIT 10;

-- Delete all records (use carefully!)
-- DELETE FROM game_completions;

