-- Migration 005: Batch Investigations System
-- Enables users to upload CSV files and process multiple investigations in batch

-- Batch Jobs Table
-- Tracks overall batch upload and processing status
CREATE TABLE IF NOT EXISTS batch_jobs (
  id TEXT PRIMARY KEY, -- UUID
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  -- Job metadata
  type TEXT NOT NULL CHECK(type IN ('cpf', 'cnpj', 'mixed')), -- Type of documents in batch
  filename TEXT NOT NULL, -- Original CSV filename
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- Progress tracking
  total_items INTEGER NOT NULL DEFAULT 0,
  processed_items INTEGER NOT NULL DEFAULT 0,
  successful_items INTEGER NOT NULL DEFAULT 0,
  failed_items INTEGER NOT NULL DEFAULT 0,

  -- Timing
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,

  -- Results
  result_url TEXT, -- URL to download results CSV
  error_message TEXT,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Batch Items Table
-- Tracks each individual document in a batch
CREATE TABLE IF NOT EXISTS batch_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_job_id TEXT NOT NULL,

  -- Item data
  row_number INTEGER NOT NULL, -- Row in original CSV
  document TEXT NOT NULL, -- CPF or CNPJ
  document_type TEXT NOT NULL CHECK(document_type IN ('cpf', 'cnpj')),

  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
  investigation_id INTEGER, -- Link to created investigation

  -- Result data (JSON with investigation summary)
  result_data TEXT, -- JSON string with investigation results
  error_message TEXT,

  -- Timing
  processed_at DATETIME,

  FOREIGN KEY (batch_job_id) REFERENCES batch_jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (investigation_id) REFERENCES user_investigacoes(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_batch_jobs_tenant ON batch_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_user ON batch_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON batch_jobs(status);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_created ON batch_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_batch_items_job ON batch_items(batch_job_id);
CREATE INDEX IF NOT EXISTS idx_batch_items_status ON batch_items(status);
CREATE INDEX IF NOT EXISTS idx_batch_items_investigation ON batch_items(investigation_id);

-- Sample data for development/testing
-- (commented out, uncomment for dev environment)
-- INSERT INTO batch_jobs (id, tenant_id, user_id, type, filename, status, total_items)
-- VALUES ('batch-001', 1, 1, 'cpf', 'funcionarios.csv', 'completed', 5);
