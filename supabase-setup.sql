-- Supabase SQL - Run in Dashboard SQL Editor
-- Fix policies if they already exist

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON records;
DROP POLICY IF EXISTS "Allow authenticated insert" ON records;
DROP POLICY IF EXISTS "Allow authenticated update" ON records;
DROP POLICY IF EXISTS "Allow authenticated delete" ON records;

-- Create fresh policies
CREATE POLICY "Allow public read" ON records FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON records FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON records FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO records (name, village, price, note) VALUES
('Shri Sanjay Kumar Tiwari', 'Tiwari Barhawa', 51, NULL),
('Jitendra Sharma', 'Mahuawa', 201, NULL),
('Rohit Sharma', 'Mahuawa', 201, NULL),
('Divesh Sharma', 'Mahuawa', 401, NULL),
('Harinayaran Singh', 'Mohanapar', 51, NULL),
('Govinda Pandit', 'Mahuamari', 501, NULL),
('Dinanath Sharma', 'Ruka (Pattitola)', 501, NULL),
('Shivbali Singh', 'Barhajia', 51, NULL),
('Ramnath Ram', 'Bhopatpur', 51, NULL),
('Manoj Singh (Mukhiya)', 'Mohanapar', 101, NULL),
('Surendra Sharma', 'Ramgarh', 501, NULL),
('Ashok Sharma', 'Manikapur', 251, NULL),
('Pramod Sharma', 'Manikapur', 151, NULL),
('Lalbahadur Sharma', 'Manikapur', 201, NULL),
('Ramdev Singh', 'Barhajia', 51, NULL),
('Ramsinghasan Sharma', 'Bhains', 1001, NULL),
('Subhash Singh', 'Mohanapar', 101, NULL),
('Ayodhya Sharma', 'Kodviliya', 151, NULL),
('Sudama Sharma', 'Madhodevpur', 251, NULL),
('Shri Ram Sharma', 'Basnehi', 151, NULL),
('Hari Mishra', 'Singhe', 51, NULL),
('Kailash Mishra', 'Singhe', 51, NULL),
('Jeetlal Singh', 'Mohanapar', 51, NULL),
('Mahashreya Deva', 'Mohanapar', 50, NULL),
('Gangaprasad Agrawal', 'Majhauliraj', 110, NULL),
('Pawan Sharma', 'Itwa', 151, NULL),
('Devendra Sharma', 'Itwa', 210, NULL),
('Lakshman Singh', 'Dudhwan', 51, NULL),
('Sanjay Agrawal', 'Sirwan (Thane)', 150, NULL),
('Sultan Yadav', 'Sirwan (Thane)', 150, NULL),
('Harishankar Sharma', 'Barahaj', 251, NULL),
('Vinay Singh (Guddu)', 'Dudhwa Patti', 51, NULL),
('Satyaram Sharma', 'Padri', 101, NULL),
('Durgesh Pandey (DK Bhai)', 'Pandey Tola', 101, NULL),
('Pappu Singh', 'Gopalapur', 51, NULL),
('Vyas Sah', 'Mohanapar', 100, NULL),
('Ravindra Chaube (Maharajji)', 'Barhiya', 251, NULL),
('Durga Sharma', 'Mohanapar', 51, NULL),
('Dhotkalam Sharma', 'Rudrapur', 50, NULL),
('Vivek Singh', 'Mohanapar', 51, NULL),
('Hiram Singh', 'Mohanapar', 51, NULL),
('Chandram Singh', 'Mohanapar', 51, NULL),
('Ramji Prasad', 'Bishunpura', 51, NULL),
('Shama Bhushan Singh', 'Mohanapar', 51, NULL),
('Dr. Bhupendra Singh', 'Dudhwa', 51, NULL),
('Nityanand Thakur', 'Mirzapur (Ballia Dist.)', 1551, NULL),
('Manvendra Singh', 'Mohanapar', 50, NULL),
('Sandeep Singh', 'Mohanapar', 40, NULL),
('Hiralal Singh', 'Barhiya', 51, NULL),
('Bhalchandra Sah', 'Mohanapar', 51, NULL),
('Guddu Kumar', 'Nayagaon', 51, NULL),
('Fauji Singh', 'Mohanapar', 51, NULL),
('Chandrika Yadav', 'Bheloli', 110, NULL),
('Shivji Prasad', 'Bhopatpur', 101, NULL),
('Manoj Singh', 'Barhiya', 50, NULL),
('Sudhir Singh', 'Barhiya', 50, NULL),
('Kamal Singh', 'Barhiya', 51, NULL),
('Manir Ansari', 'Bhopatpur', 101, NULL),
('Jaimaram Singh', 'Mohanapar', 51, NULL),
('Piyare Chaudhary', 'Bhopatpur', 51, NULL),
('Vishal Gupta', 'Mohanapar', 51, NULL),
('Shyamdev Singh', 'Mohanapar', 51, NULL),
('Ritesh Kumar Sharma', 'Lamhi Tola (Tengariya Tola)', 501, NULL),
('Prem Singh', 'Mohanapar', 51, NULL),
('Umesh Singh', 'Nawaka Tola (Ludhpur)', 110, NULL),
('Malkhan Mishra', 'Mohanapar', 50, NULL),
('Sanjay Kumar (Master)', 'Deoria', 101, NULL),
('Gauri Ram', 'Kachhwa Mishr', 51, NULL),
('Dr. Dhananjay Sharma', 'Lamhi Tola', 151, NULL),
('Vishwanath Sharma', 'Rukna Tola Basti', 251, NULL),
('Surendra Sahu', 'Mohanapar', 51, NULL),
('Kamlesh Mishra', 'Singhe', 51, NULL),
('Rajmangal Singh', 'Mohanapar', 50, NULL),
('Shambhunath Singh', 'Mohanapar', 50, NULL),
('Madhuri Chaudhary', 'Itwa', 101, NULL),
('Faujdaar Singh', 'Barhiya', 51, NULL),
('Janardan Singh', 'Bhopatpur (Atrauli)', 51, NULL),
('Sandip Yadav', 'Bhopatpur', 51, NULL),
('Bankim Singh', 'Mohanapar', 51, NULL),
('Vijay Singh', 'Barhiya', 50, NULL),
('Baleshwar Singh', 'Barhiya', 50, NULL),
('Shri Kapildev Singh', 'Mohanapar', 51, NULL),
('Premdev Singh', 'Mohanapar', 51, NULL),
('Gaurav Singh', 'Mohanapar', 51, NULL),
('Upendra Kushwaha', 'Diya Belwa', 101, NULL),
('Ankita Singh', 'Barhiya', 50, NULL),
('Maniram Sharma', 'Madhopur', 251, NULL),
('Hareram Sharma', 'Gurrah', 51, NULL),
('Baburam Singh', 'Barhiya', 50, NULL),
('Babulal Bhagat', 'Itwa', 51, NULL),
('Phoolchand Singh', 'Mohanapar', 51, NULL),
('Balram Dehati', 'Mohanapar', 51, NULL),
('Jitendra Singh', 'Mohanapar', 50, NULL),
('Amarendra Dehati', 'Mohanapar', 51, NULL),
('Ashokraj Singh', 'Mohanapar', 51, NULL)
ON CONFLICT DO NOTHING;

INSERT INTO records (name, village, price, note) VALUES
('Chhotelal Bhagat', 'Mohanapar', 51, NULL),
('Vijay Singh', 'Mohanapar', 50, NULL),
('Munni Ji', 'Mohanapar', 51, NULL),
('Kishore Singh', 'Mohanapar', 51, NULL),
('Gujju Sharma', 'Jirwania', 501, NULL),
('Dilip Singh', 'Mohanapar', 51, NULL),
('Ramsangam Sharma', 'Bijli Bhedi', 205, NULL),
('Shivnandan Dehati', 'Bhopatpur', 51, NULL),
('Shri Lakhan Singh', 'Barhaj', 50, NULL),
('Shankar Sharma', 'Katha', 201, NULL),
('Bhola Sharma', 'Kusothi', 500, NULL),
('Balbhadra Singh', 'Barhiya', 51, NULL),
('Shri Sah', 'Lalapar', 51, NULL),
('Ramagyaat Singh', 'Mohanapar', 51, NULL),
('Ramavatar Sharma (Dharmendra Sharma)', 'Naini Patti', 151, NULL)
ON CONFLICT DO NOTHING;

-- Check total
SELECT COUNT(*) as total FROM records;