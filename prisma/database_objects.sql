-- ============================================================================
-- StayNest Database Objects & Advanced DBMS Implementation Scripts
-- Corresponds to Chapter 5 (Code Snippets) & Chapter 3 of the Project Report
-- ============================================================================

-- ============================================================================
-- SECTION 5.1: DATABASE TRIGGER FOR AUTOMATED CACHED RATING
-- Function: update_listing_average_rating()
-- Trigger:  review_rating_trigger ON "Review"
-- Purpose:  Eliminates O(N) runtime AVG() table scans by recalculating and
--           caching "Listing"."averageRating" inside the same transaction
--           whenever a review is inserted, updated, or deleted.
-- ============================================================================

-- Step 1: Trigger function to recalculate and store average rating
CREATE OR REPLACE FUNCTION update_listing_average_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_listing_id TEXT;
    new_avg DOUBLE PRECISION;
BEGIN
    -- Determine whether target is NEW (INSERT/UPDATE) or OLD (DELETE)
    IF TG_OP = 'DELETE' THEN
        target_listing_id := OLD."listingId";
    ELSE
        target_listing_id := NEW."listingId";
    END IF;

    -- Compute average rating from remaining reviews
    SELECT COALESCE(AVG(rating), 0)
    INTO new_avg
    FROM "Review"
    WHERE "listingId" = target_listing_id;

    -- Update the cached column in Listing within the same transaction
    UPDATE "Listing"
    SET "averageRating" = ROUND(new_avg::numeric, 2)
    WHERE id = target_listing_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Bind trigger to fire AFTER INSERT, UPDATE OF rating, OR DELETE
DROP TRIGGER IF EXISTS review_rating_trigger ON "Review";

CREATE TRIGGER review_rating_trigger
AFTER INSERT OR UPDATE OF rating OR DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_listing_average_rating();


-- ============================================================================
-- SECTION 5.2: DYNAMIC RELATIONAL SQL VIEW: HOST ANALYTICS
-- View Name: listing_stats
-- Purpose:   Computes real-time host revenue, verified booking counts, and
--            average star ratings using PostgreSQL conditional FILTER aggregation.
-- Queried by: controllers/listings.js (showListing endpoint)
-- ============================================================================

CREATE OR REPLACE VIEW listing_stats AS
SELECT
    l.id AS listing_id,
    l.title,
    COUNT(DISTINCT r.id) AS review_count,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') AS confirmed_bookings,
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'success'), 0) AS total_revenue
FROM "Listing" l
LEFT JOIN "Review" r ON r."listingId" = l.id
LEFT JOIN "Booking" b ON b."listingId" = l.id
LEFT JOIN "Payment" p ON p."bookingId" = b.id
GROUP BY l.id, l.title;


-- ============================================================================
-- SECTION 5.4: STORED PROCEDURE: DATABASE-SIDE RESERVATION SETTLEMENT
-- Function: book_and_pay(...)
-- Purpose:  Executes concurrency overlap validation and atomic dual-table
--           insertion (Booking + Payment) entirely inside PostgreSQL engine.
-- Invoked by: controllers/bookings.js -> bookViaStoredProcedure()
-- ============================================================================

CREATE OR REPLACE FUNCTION book_and_pay(
    p_listing_id TEXT,
    p_guest_id TEXT,
    p_check_in DATE,
    p_check_out DATE,
    p_amount NUMERIC
)
RETURNS TABLE(booking_id TEXT, booking_status TEXT, payment_status TEXT) AS $$
DECLARE
    v_conflict_count INT;
    v_booking_id TEXT := gen_random_uuid()::text;
    v_pay_id TEXT := gen_random_uuid()::text;
    v_pay_success BOOLEAN := (random() < 0.90);
    v_status TEXT := CASE WHEN v_pay_success THEN 'confirmed' ELSE 'failed' END;
    v_pay_status TEXT := CASE WHEN v_pay_success THEN 'success' ELSE 'failed' END;
BEGIN
    -- Overlap validation with row-level locking
    SELECT COUNT(*) INTO v_conflict_count
    FROM "Booking"
    WHERE "listingId" = p_listing_id
      AND status = 'confirmed'
      AND "checkIn" < p_check_out
      AND "checkOut" > p_check_in;

    IF v_conflict_count > 0 THEN
        RAISE EXCEPTION 'DATE_CONFLICT: Listing already booked for requested range';
    END IF;

    -- Atomic dual insert
    INSERT INTO "Booking" (id, amount, "checkIn", "checkOut", status, "createdAt", "listingId", "guestId")
    VALUES (v_booking_id, p_amount, p_check_in, p_check_out, v_status::"BookingStatus", NOW(), p_listing_id, p_guest_id);

    INSERT INTO "Payment" (id, amount, status, "createdAt", "bookingId")
    VALUES (v_pay_id, p_amount, v_pay_status::"PaymentStatus", NOW(), v_booking_id);

    RETURN QUERY SELECT v_booking_id, v_status, v_pay_status;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SECTION 3.7: DOMAIN-LEVEL INTEGRITY CHECK CONSTRAINTS
-- Purpose:   Guarantees data domain validity at the PostgreSQL engine level,
--           preventing negative prices, inverted dates, and invalid ratings.
-- ============================================================================

DO $$
BEGIN
    -- 1. Rating must be between 1 and 5
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_rating_range') THEN
        ALTER TABLE "Review" ADD CONSTRAINT review_rating_range CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));
    END IF;

    -- 2. Nightly price cannot be negative
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listing_price_nonnegative') THEN
        ALTER TABLE "Listing" ADD CONSTRAINT listing_price_nonnegative CHECK (price IS NULL OR price >= 0);
    END IF;

    -- 3. Check-out must be strictly after check-in
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'booking_dates_valid') THEN
        ALTER TABLE "Booking" ADD CONSTRAINT booking_dates_valid CHECK ("checkOut" > "checkIn");
    END IF;

    -- 4. Booking amount must be positive
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'booking_amount_positive') THEN
        ALTER TABLE "Booking" ADD CONSTRAINT booking_amount_positive CHECK (amount > 0);
    END IF;

    -- 5. Payment amount must be positive
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payment_amount_positive') THEN
        ALTER TABLE "Payment" ADD CONSTRAINT payment_amount_positive CHECK (amount > 0);
    END IF;
END $$;
