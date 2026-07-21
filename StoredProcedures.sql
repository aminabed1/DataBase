--1
CREATE OR REPLACE FUNCTION get_user_tickets(p_identifier VARCHAR)
RETURNS TABLE (ticket_id BIGINT, ticket_code VARCHAR, issued_at TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.ticket_code, t.issued_at
    FROM users u
    JOIN reservations r ON u.id = r.user_id
    JOIN reservation_items ri ON r.id = ri.reservation_id
    JOIN tickets t ON ri.id = t.reservation_item_id
    WHERE u.email = p_identifier OR u.phone = p_identifier
    ORDER BY t.issued_at ASC;
END;
$$ LANGUAGE plpgsql;

--2
CREATE OR REPLACE FUNCTION get_canceled_users_by_support(p_support_identifier VARCHAR)
RETURNS TABLE (first_name VARCHAR, last_name VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT buyer.first_name, buyer.last_name
    FROM users support_agent
    JOIN cancellations c ON support_agent.id = c.user_id
    JOIN reservations r ON c.reservation_id = r.id
    JOIN users buyer ON r.user_id = buyer.id
    WHERE (support_agent.email = p_support_identifier OR support_agent.phone = p_support_identifier)
      AND support_agent.role = 'SUPPORT';
END;
$$ LANGUAGE plpgsql;


--3
CREATE OR REPLACE FUNCTION get_tickets_by_city(p_city_name VARCHAR)
RETURNS TABLE (ticket_code VARCHAR, match_datetime TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT t.ticket_code, m.datetime
    FROM cities c
    JOIN venues v ON c.id = v.city_id
    JOIN matches m ON v.id = m.venue_id
    JOIN match_seats ms ON m.id = ms.match_id
    JOIN reservation_items ri ON ms.id = ri.match_seat_id
    JOIN tickets t ON ri.id = t.reservation_item_id
    WHERE c.name = p_city_name;
END;
$$ LANGUAGE plpgsql;

--4
CREATE OR REPLACE FUNCTION search_tickets(p_phrase VARCHAR)
RETURNS TABLE (ticket_code VARCHAR, user_name VARCHAR, venue_name VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT t.ticket_code, u.first_name || ' ' || u.last_name, v.name
    FROM tickets t
    JOIN reservation_items ri ON t.reservation_item_id = ri.id
    JOIN reservations r ON ri.reservation_id = r.id
    JOIN users u ON r.user_id = u.id
    JOIN match_seats ms ON ri.match_seat_id = ms.id
    JOIN matches m ON ms.match_id = m.id
    JOIN venues v ON m.venue_id = v.id
    JOIN teams ht ON m.host_team_id = ht.id
    JOIN teams gt ON m.guest_team_id = gt.id
    JOIN ticket_categories tc ON ms.ticket_category_id = tc.id
    WHERE u.first_name ILIKE '%' || p_phrase || '%'
       OR u.last_name ILIKE '%' || p_phrase || '%'
       OR v.name ILIKE '%' || p_phrase || '%'
       OR ht.name ILIKE '%' || p_phrase || '%'
       OR gt.name ILIKE '%' || p_phrase || '%'
       OR tc.name ILIKE '%' || p_phrase || '%';
END;
$$ LANGUAGE plpgsql;

--5
CREATE OR REPLACE FUNCTION get_same_city_users(p_identifier VARCHAR)
RETURNS TABLE (first_name VARCHAR, last_name VARCHAR, email VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT other.first_name, other.last_name, other.email
    FROM users target_user
    JOIN users other ON target_user.city_id = other.city_id
    WHERE (target_user.email = p_identifier OR target_user.phone = p_identifier)
      AND other.id != target_user.id;
END;
$$ LANGUAGE plpgsql;

--6
CREATE OR REPLACE FUNCTION get_top_buyers_since(p_date TIMESTAMP, p_limit INT)
RETURNS TABLE (first_name VARCHAR, last_name VARCHAR, total_tickets BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT u.first_name, u.last_name, COUNT(t.id) AS t_count
    FROM users u
    JOIN reservations r ON u.id = r.user_id
    JOIN reservation_items ri ON r.id = ri.reservation_id
    JOIN tickets t ON ri.id = t.reservation_item_id
    WHERE t.issued_at >= p_date
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY t_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

--7
CREATE OR REPLACE FUNCTION get_canceled_tickets_by_sport(p_sport_name VARCHAR)
RETURNS TABLE (ticket_code VARCHAR, requested_at TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT t.ticket_code, c.requested_at
    FROM sports s
    JOIN matches m ON s.id = m.sport_id
    JOIN match_seats ms ON m.id = ms.match_id
    JOIN reservation_items ri ON ms.id = ri.match_seat_id
    JOIN tickets t ON ri.id = t.reservation_item_id
    JOIN reservations r ON ri.reservation_id = r.id
    JOIN cancellations c ON r.id = c.reservation_id
    WHERE s.name = p_sport_name
    ORDER BY c.requested_at ASC;
END;
$$ LANGUAGE plpgsql;

--8
CREATE OR REPLACE FUNCTION get_top_reporters_by_subject(p_subject VARCHAR)
RETURNS TABLE (first_name VARCHAR, last_name VARCHAR, report_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT u.first_name, u.last_name, COUNT(ir.id) AS r_count
    FROM users u
    JOIN issue_reports ir ON u.id = ir.user_id
    WHERE ir.subject = p_subject
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY r_count DESC;
END;
$$ LANGUAGE plpgsql;



-- Index on email and phone to speed up user searches (used in functions 1, 2, and 5)
CREATE INDEX idx_users_email_phone ON users(email, phone);

-- Index on city name to speed up filtering by city (used in function 3)
CREATE INDEX idx_cities_name ON cities(name);

-- Index on ticket issuance date to speed up date range queries (used in function 6)
CREATE INDEX idx_tickets_issued_at ON tickets(issued_at);

-- Index on support issue reports subject (used in function 8)
CREATE INDEX idx_issue_reports_subject ON issue_reports(subject);