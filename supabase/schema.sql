-- ============================================================
-- Datastraw CRM — Database Schema (Phase 1)
-- Run this once in the Supabase SQL Editor (SQL Editor tab)
-- ============================================================

-- Sequence used to generate human-readable ticket IDs (TKT-001, TKT-002, ...)
-- Using a sequence instead of COUNT(*)+1 avoids duplicate IDs if two
-- tickets are created at the exact same time.
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- ============================================================
-- TICKETS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       TEXT UNIQUE NOT NULL,
    customer_name   TEXT NOT NULL,
    customer_email  TEXT NOT NULL,
    subject         TEXT NOT NULL,
    description     TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'Open'
                    CHECK (status IN ('Open', 'In Progress', 'Closed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-generate ticket_id (TKT-001, TKT-002, ...) before insert,
-- unless one is already provided.
CREATE OR REPLACE FUNCTION set_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_id IS NULL THEN
        NEW.ticket_id := 'TKT-' || LPAD(nextval('ticket_number_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_ticket_id ON tickets;
CREATE TRIGGER trg_set_ticket_id
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_id();

-- Auto-update updated_at on every row update.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON tickets;
CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Indexes to keep search/filter fast as data grows.
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_name ON tickets (customer_name);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON tickets (customer_email);

-- ============================================================
-- NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
    id          BIGSERIAL PRIMARY KEY,
    ticket_id   TEXT NOT NULL REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    note_text   TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_ticket_id ON notes (ticket_id);

-- ============================================================
-- Row Level Security: left DISABLED on purpose.
-- The backend connects using the service_role key, which bypasses RLS
-- entirely. The frontend never talks to Supabase directly — it only
-- calls your Express API. This matches the assignment's required
-- architecture: Frontend -> API -> Database.
-- ============================================================

-- ============================================================
-- Quick sanity check — run after creating tables:
-- INSERT INTO tickets (customer_name, customer_email, subject, description)
-- VALUES ('Test User', 'test@example.com', 'Login issue', 'Cannot log in to my account');
--
-- SELECT * FROM tickets;
-- SELECT ticket_id FROM tickets;  -- should show TKT-001
-- ============================================================
