-- Check if records exist and their count
SELECT COUNT(*) as total FROM records;

-- Show sample data
SELECT id, name, village, price, created_at 
FROM records 
ORDER BY created_at DESC 
LIMIT 10;