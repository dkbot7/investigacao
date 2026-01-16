-- Migration 013: Row Level Security (RLS)
-- Implementa isolamento de dados por tenant no nível do banco
-- Garante que usuários só acessem dados do próprio tenant

-- ============================================================================
-- PART 1: ENABLE RLS ON MULTI-TENANT TABLES
-- ============================================================================

-- Users table
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Investigations table
ALTER TABLE IF EXISTS investigations ENABLE ROW LEVEL SECURITY;

-- User investigations (junction table)
ALTER TABLE IF EXISTS user_investigations ENABLE ROW LEVEL SECURITY;

-- Alerts
ALTER TABLE IF EXISTS alerts ENABLE ROW LEVEL SECURITY;

-- Investigation alerts
ALTER TABLE IF EXISTS investigation_alerts ENABLE ROW LEVEL SECURITY;

-- Audit logs
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- API keys
ALTER TABLE IF EXISTS api_keys ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 2: CREATE RLS POLICIES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- USERS TABLE POLICIES
-- ---------------------------------------------------------------------------

-- Policy: Regular users can only see users from their own tenant
CREATE POLICY IF NOT EXISTS tenant_isolation_users ON users
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    OR current_setting('app.user_role', true)::text = 'admin'
  );

-- Policy: Users can update their own profile
CREATE POLICY IF NOT EXISTS user_update_own_profile ON users
  FOR UPDATE
  USING (
    id = current_setting('app.current_user_id', true)::text
    OR current_setting('app.user_role', true)::text = 'admin'
  );

-- ---------------------------------------------------------------------------
-- INVESTIGATIONS TABLE POLICIES
-- ---------------------------------------------------------------------------

-- Policy: Users can only see investigations from their tenant
CREATE POLICY IF NOT EXISTS tenant_isolation_investigations ON investigations
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    OR current_setting('app.user_role', true)::text = 'admin'
  );

-- Policy: Only editors and admins can create investigations
CREATE POLICY IF NOT EXISTS investigations_create ON investigations
  FOR INSERT
  WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    AND (
      current_setting('app.user_role', true)::text IN ('editor', 'admin')
    )
  );

-- Policy: Only editors and admins can update investigations
CREATE POLICY IF NOT EXISTS investigations_update ON investigations
  FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    AND (
      current_setting('app.user_role', true)::text IN ('editor', 'admin')
    )
  );

-- Policy: Only admins can delete investigations
CREATE POLICY IF NOT EXISTS investigations_delete ON investigations
  FOR DELETE
  USING (
    current_setting('app.user_role', true)::text = 'admin'
  );

-- ---------------------------------------------------------------------------
-- ALERTS TABLE POLICIES
-- ---------------------------------------------------------------------------

-- Policy: Users see only alerts for their tenant
CREATE POLICY IF NOT EXISTS tenant_isolation_alerts ON alerts
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    OR current_setting('app.user_role', true)::text = 'admin'
  );

-- Policy: Mark alert as read (own alerts only)
CREATE POLICY IF NOT EXISTS alerts_mark_read ON alerts
  FOR UPDATE
  USING (
    user_id = current_setting('app.current_user_id', true)::text
  );

-- ---------------------------------------------------------------------------
-- AUDIT LOGS TABLE POLICIES
-- ---------------------------------------------------------------------------

-- Policy: Admins can see all audit logs, users see their tenant's logs
CREATE POLICY IF NOT EXISTS audit_logs_select ON audit_logs
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    OR current_setting('app.user_role', true)::text = 'admin'
  );

-- Policy: Audit logs are insert-only (no updates)
CREATE POLICY IF NOT EXISTS audit_logs_insert ON audit_logs
  FOR INSERT
  WITH CHECK (true); -- Always allow inserts for auditing

-- ---------------------------------------------------------------------------
-- API KEYS TABLE POLICIES
-- ---------------------------------------------------------------------------

-- Policy: Users can only see API keys from their tenant
CREATE POLICY IF NOT EXISTS tenant_isolation_api_keys ON api_keys
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::text
    OR current_setting('app.user_role', true)::text = 'admin'
  );

-- Policy: Only admins can create/update/delete API keys
CREATE POLICY IF NOT EXISTS api_keys_admin_only ON api_keys
  FOR ALL
  USING (
    current_setting('app.user_role', true)::text = 'admin'
  );

-- ============================================================================
-- PART 3: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to set tenant context (used by backend before queries)
CREATE OR REPLACE FUNCTION set_tenant_context(
  p_tenant_id TEXT,
  p_user_id TEXT,
  p_user_role TEXT
) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', p_tenant_id, false);
  PERFORM set_config('app.current_user_id', p_user_id, false);
  PERFORM set_config('app.user_role', p_user_role, false);
END;
$$ LANGUAGE plpgsql;

-- Function to clear tenant context (cleanup after queries)
CREATE OR REPLACE FUNCTION clear_tenant_context() RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', '', false);
  PERFORM set_config('app.current_user_id', '', false);
  PERFORM set_config('app.user_role', '', false);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 4: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on tenant_id for faster RLS checks
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_investigations_tenant_id ON investigations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant_id ON alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant_id ON api_keys(tenant_id);

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Before running any query, the backend MUST call set_tenant_context()
-- 2. After queries complete, call clear_tenant_context() for cleanup
-- 3. Admin role bypasses most RLS policies (sees all tenants)
-- 4. Audit logs are insert-only to prevent tampering
-- 5. All policies use current_setting() to read context set by backend

-- Example usage in backend:
--
-- SELECT set_tenant_context('tenant-123', 'user-456', 'editor');
-- SELECT * FROM investigations; -- Will only return tenant-123 data
-- SELECT clear_tenant_context();
