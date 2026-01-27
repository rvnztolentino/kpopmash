-- ==========================================
-- SETUP AUTOMATIC RESET
-- ==========================================
-- Run this entire block ONE TIME to create the 'reset_monthly' function.
-- This function will automatically reset the leaderboard every month on the 1st at midnight.

CREATE OR REPLACE FUNCTION reset_monthly_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clear all voting history
  TRUNCATE TABLE votes;
  
  -- Reset all characters to default values
  UPDATE characters 
  SET elo_rating = 1500;
END;
$$;

-- Schedule the function to run monthly on the 1st at midnight
SELECT cron.schedule('reset_monthly_stats', '0 0 1 * *', 'SELECT reset_monthly_stats()');

-- drop a function
DROP FUNCTION reset_monthly_stats();
DROP SCHEDULE 'reset_monthly_stats';


-- ==========================================
-- VERIFY AUTOMATIC RESET
-- ==========================================
-- Run this query to see if your monthly reset cron job is scheduled.
-- You should see a job that calls a function (likely 'reset_monthly' or similar) 
-- scheduled for '0 0 1 * *' (Midnight on the 1st of every month).
SELECT * FROM cron.job;


-- ==========================================
-- SETUP MANUAL RESET COMMAND
-- ==========================================
-- Run this entire block ONE TIME to create the 'reset_rankings' function.
-- This function allows you to manually reset the leaderboard safely.

CREATE OR REPLACE FUNCTION reset_rankings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clear all voting history
  TRUNCATE TABLE votes;
  
  -- Reset all characters to default values
  UPDATE characters 
  SET elo_rating = 1500;
END;
$$;


-- ==========================================
-- EXECUTE MANUAL RESET
-- ==========================================
-- Run this line whenever you want to immediately wipe all data and reset Elos.
-- WARNING: This cannot be undone!

SELECT reset_rankings();


-- ==========================================
-- USEFUL QUERIES (FOR VERIFICATION)
-- ==========================================

-- Check the top 10 characters by Elo
SELECT name, elo_rating, wins, losses 
FROM characters 
ORDER BY elo_rating DESC 
LIMIT 10;

-- Check vote counts for a specific user (replace 'USER_UUID_HERE' with actual ID)
-- Useful for debugging rate limits.
-- SELECT count(*) FROM votes WHERE user_id = 'USER_UUID_HERE' AND created_at > now() - interval '12 hours';

-- View recent votes
SELECT * FROM votes ORDER BY created_at DESC LIMIT 20;

