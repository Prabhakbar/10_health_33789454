USE health;

INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES (
  'gold',
  'Sample',
  'User',
  'gold@example.com',
  'REPLACE_WITH_HASH'
);

INSERT INTO activities (user_id, activity_type, duration_minutes, distance_km, activity_date, notes)
VALUES
(1, 'Running', 30, 5.00, '2025-01-01', 'Easy pace'),
(1, 'Cycling', 60, 20.00, '2025-01-02', 'Evening ride'),
(1, 'Walking', 45, 3.50, '2025-01-03', 'Walk in the park');
