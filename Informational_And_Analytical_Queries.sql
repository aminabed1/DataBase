--1
SELECT first_name,last_name
    FROM users
WHERE id NOT IN (SELECT user_id FROM reservations);

--2
SELECT DISTINCT u.first_name , u.last_name
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN reservation_items ri ON r.id = ri.reservation_id
JOIN tickets t ON ri.id = t.reservation_item_id;

--3
SELECT u.first_name, u.last_name,
       EXTRACT(YEAR FROM p.payment_date) AS pay_year,
       EXTRACT(MONTH FROM p.payment_date) AS pay_month,
       SUM(p.amount) AS total_paid
FROM payments p
JOIN reservations r ON p.reservation_id = r.id
JOIN users u ON r.user_id = u.id
GROUP BY u.id, u.first_name, u.last_name, pay_year, pay_month;

--4
SELECT u.first_name, u.last_name, c.name AS city_name
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN reservation_items ri ON r.id = ri.reservation_id
JOIN tickets t ON t.reservation_item_id = ri.id
JOIN match_seats ms ON ri.match_seat_id = ms.id
JOIN matches m ON ms.match_id = m.id
JOIN venues v ON m.venue_id = v.id
JOIN cities c ON v.city_id = c.id
GROUP BY u.id, u.first_name, u.last_name, c.id, c.name
HAVING COUNT(t.id) = 1;

--5
SELECT u.*
FROM tickets t
JOIN reservation_items ri ON t.reservation_item_id = ri.id
JOIN reservations r ON ri.reservation_id = r.id
JOIN users u ON r.user_id = u.id
ORDER BY t.issued_at DESC
LIMIT 1;

--6
SELECT u.phone, u.email
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN payments p ON r.id = p.reservation_id
GROUP BY u.id, u.phone, u.email
HAVING SUM(p.amount) > (SELECT AVG(total_paid) FROM (SELECT SUM(amount) AS total_paid FROM payments GROUP BY reservation_id) AS sub);

--7
SELECT s.name AS sport_name, COUNT(t.id) AS total_tickets
FROM sports s
JOIN matches m ON s.id = m.sport_id
JOIN match_seats ms ON m.id = ms.match_id
JOIN reservation_items ri ON ri.match_seat_id = ms.id
JOIN tickets t ON t.reservation_item_id = ri.id
GROUP BY s.id, s.name;

--8
SELECT u.first_name, u.last_name, COUNT(t.id) AS tickets_count
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN reservation_items ri ON r.id = ri.reservation_id
JOIN tickets t ON ri.id = t.reservation_item_id
WHERE t.issued_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY u.id, u.first_name, u.last_name
ORDER BY tickets_count DESC
LIMIT 3;

--9
SELECT c.name AS city_name, COUNT(t.id) AS total_tickets
FROM cities c
JOIN venues v ON c.id = v.city_id
JOIN matches m ON v.id = m.venue_id
JOIN match_seats ms ON m.id = ms.match_id
JOIN reservation_items ri ON ri.match_seat_id = ms.id
JOIN tickets t ON t.reservation_item_id = ri.id
JOIN provinces p ON c.province_id = p.id
WHERE p.name = 'تهران'
GROUP BY c.id, c.name;

--10
SELECT DISTINCT c.name
FROM cities c
JOIN venues v ON c.id = v.city_id
JOIN matches m ON v.id = m.venue_id
JOIN match_seats ms ON m.id = ms.match_id
JOIN reservation_items ri ON ri.match_seat_id = ms.id
JOIN tickets t ON t.reservation_item_id = ri.id
JOIN reservations r ON ri.reservation_id = r.id
WHERE r.user_id = (SELECT id FROM users ORDER BY id ASC LIMIT 1);

--11
SELECT first_name, last_name
FROM users
WHERE role = 'SUPPORT';

--12
SELECT u.first_name, u.last_name
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN reservation_items ri ON r.id = ri.reservation_id
JOIN tickets t ON t.reservation_item_id = ri.id
GROUP BY u.id
HAVING COUNT(t.id) >= 2;

--13
SELECT u.first_name, u.last_name
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN reservation_items ri ON r.id = ri.reservation_id
JOIN tickets t ON t.reservation_item_id = ri.id
JOIN match_seats ms ON ri.match_seat_id = ms.id
JOIN matches m ON ms.match_id = m.id
JOIN sports s ON m.sport_id = s.id
WHERE s.name = 'فوتبال'
GROUP BY u.id, u.first_name, u.last_name
HAVING COUNT(t.id) <= 2;

--14
SELECT u.email, u.phone
FROM users u
JOIN reservations r ON u.id = r.user_id
JOIN reservation_items ri ON r.id = ri.reservation_id
JOIN tickets t ON t.reservation_item_id = ri.id
JOIN match_seats ms ON ri.match_seat_id = ms.id
JOIN matches m ON ms.match_id = m.id
JOIN sports s ON m.sport_id = s.id
WHERE s.name IN ('فوتبال', 'والیبال', 'بسکتبال')
GROUP BY u.id
HAVING COUNT(DISTINCT s.name) = 3;

--15
SELECT t.*
FROM tickets t
WHERE t.issued_at::date = CURRENT_DATE
ORDER BY t.issued_at ASC;

--16
SELECT ms.id, COUNT(t.id) AS sales_count
FROM tickets t
JOIN match_seats ms ON t.reservation_item_id = ms.id
GROUP BY ms.id
ORDER BY sales_count DESC
OFFSET 1 LIMIT 1;

--17
SELECT
    u.first_name,
    u.last_name,
    COUNT(c.id) AS total_cancellations_by_support,
    ROUND((COUNT(c.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM cancellations), 0)), 2) AS cancellation_percentage
FROM users u
JOIN cancellations c ON u.id = c.user_id
WHERE u.role = 'SUPPORT'
GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_cancellations_by_support DESC
LIMIT 1;

--18
UPDATE users
SET last_name = 'ردینگتون'
WHERE id = (SELECT u.id FROM users u JOIN cancellations c ON u.id = c.user_id
            GROUP BY u.id ORDER BY COUNT(c.id) DESC LIMIT 1);

--19
DELETE FROM tickets
WHERE reservation_item_id IN (
    SELECT ri.id
    FROM reservation_items ri
    JOIN cancellations c ON ri.reservation_id = c.reservation_id
    JOIN users u ON c.user_id = u.id
    WHERE u.last_name = 'ردینگتون'
    );

--20
DELETE FROM tickets
WHERE id IN (SELECT t.id FROM tickets t WHERE t.status = 'CANCELLED');

--21
UPDATE match_seats ms
SET price = price * 0.9
FROM matches m
JOIN venues v ON m.venue_id = v.id
WHERE ms.match_id = m.id AND v.name = 'آزادی'
AND m.datetime::date = CURRENT_DATE - INTERVAL '1 day';

--22
SELECT subject, COUNT(*) AS report_count
FROM issue_reports
GROUP BY subject
ORDER BY report_count DESC
LIMIT 1;