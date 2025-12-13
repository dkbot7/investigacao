-- Migration: Customer Health Score System
-- Predictive churn analysis and customer engagement scoring
--
-- References:
-- - https://www.everafter.ai/glossary/customer-health-score
-- - https://www.vitally.io/post/how-to-create-a-customer-health-score-with-four-metrics
-- - https://weld.app/blog/how-to-score-the-health-of-your-customers-and-5-need-to-know-metrics

-- Customer health scores
CREATE TABLE IF NOT EXISTS customer_health_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  -- Overall health score (0-100)
  health_score INTEGER NOT NULL DEFAULT 50,

  -- Health category
  health_category TEXT NOT NULL DEFAULT 'at_risk' CHECK(health_category IN (
    'healthy',    -- 80-100
    'at_risk',    -- 50-79
    'critical'    -- 0-49
  )),

  -- Component scores (0-100 each)
  onboarding_score INTEGER NOT NULL DEFAULT 0,    -- Setup completion
  usage_score INTEGER NOT NULL DEFAULT 0,         -- Product usage frequency
  engagement_score INTEGER NOT NULL DEFAULT 0,    -- Feature adoption & depth
  support_score INTEGER NOT NULL DEFAULT 100,     -- Support ticket frequency (inverse)

  -- Calculated metrics
  days_since_last_login INTEGER DEFAULT 0,
  days_since_signup INTEGER DEFAULT 0,
  investigations_count_30d INTEGER DEFAULT 0,
  features_adopted_count INTEGER DEFAULT 0,
  support_tickets_30d INTEGER DEFAULT 0,

  -- Churn prediction
  churn_risk_percentage REAL DEFAULT 0.0,  -- 0.0-100.0
  churn_predicted INTEGER DEFAULT 0,       -- 1 = likely to churn
  churn_factors TEXT,                      -- JSON array of contributing factors

  -- Trend analysis
  score_trend TEXT DEFAULT 'stable' CHECK(score_trend IN (
    'improving',  -- Score increased >5 points
    'stable',     -- Score changed <5 points
    'declining'   -- Score decreased >5 points
  )),
  previous_score INTEGER,

  -- Intervention tracking
  needs_intervention INTEGER DEFAULT 0,
  last_intervention_at DATETIME,
  intervention_type TEXT,

  -- Timestamps
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_health_scores_tenant ON customer_health_scores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_category ON customer_health_scores(health_category);
CREATE INDEX IF NOT EXISTS idx_health_scores_score ON customer_health_scores(health_score);
CREATE INDEX IF NOT EXISTS idx_health_scores_churn ON customer_health_scores(churn_predicted);
CREATE INDEX IF NOT EXISTS idx_health_scores_calculated ON customer_health_scores(calculated_at);

-- Health score history (for trend analysis)
CREATE TABLE IF NOT EXISTS health_score_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  health_score INTEGER NOT NULL,
  health_category TEXT NOT NULL,

  onboarding_score INTEGER NOT NULL,
  usage_score INTEGER NOT NULL,
  engagement_score INTEGER NOT NULL,
  support_score INTEGER NOT NULL,

  churn_risk_percentage REAL NOT NULL,

  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_health_history_tenant ON health_score_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_health_history_recorded ON health_score_history(recorded_at);

-- Churn predictions
CREATE TABLE IF NOT EXISTS churn_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  -- Prediction
  churn_probability REAL NOT NULL,  -- 0.0-1.0
  churn_likely INTEGER NOT NULL DEFAULT 0, -- 1 = churn likely
  predicted_churn_date TEXT,  -- YYYY-MM-DD

  -- Contributing factors
  primary_risk_factor TEXT,  -- 'low_usage', 'declining_engagement', 'support_issues', etc.
  risk_factors TEXT,         -- JSON array of all factors

  -- Model metadata
  model_version TEXT DEFAULT 'v1.0',
  confidence_score REAL,     -- 0.0-1.0

  -- Intervention recommendations
  recommended_actions TEXT,  -- JSON array of suggested interventions

  -- Validation (did prediction come true?)
  actual_churned INTEGER,
  churned_at DATETIME,
  prediction_accuracy REAL,

  predicted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_churn_predictions_tenant ON churn_predictions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_churn_predictions_likely ON churn_predictions(churn_likely);
CREATE INDEX IF NOT EXISTS idx_churn_predictions_predicted ON churn_predictions(predicted_at);

-- Health score interventions
CREATE TABLE IF NOT EXISTS health_interventions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  intervention_type TEXT NOT NULL CHECK(intervention_type IN (
    'email_outreach',
    'csm_call',
    'onboarding_assistance',
    'feature_training',
    'discount_offer',
    'usage_tips',
    'custom'
  )),

  -- Details
  trigger_reason TEXT NOT NULL,  -- What triggered this intervention
  trigger_score INTEGER,         -- Health score at trigger
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN (
    'pending',
    'in_progress',
    'completed',
    'cancelled'
  )),

  -- Outcome
  outcome TEXT,  -- What happened
  score_change INTEGER,  -- Change in health score after intervention
  successful INTEGER,    -- 1 = improved health

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_health_interventions_tenant ON health_interventions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_health_interventions_type ON health_interventions(intervention_type);
CREATE INDEX IF NOT EXISTS idx_health_interventions_status ON health_interventions(status);

-- Health score weights configuration
CREATE TABLE IF NOT EXISTS health_score_weights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  component_name TEXT NOT NULL UNIQUE,
  weight REAL NOT NULL,  -- 0.0-1.0 (sum should = 1.0)
  description TEXT,

  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default weights
INSERT INTO health_score_weights (component_name, weight, description) VALUES
  ('onboarding', 0.20, 'Setup and onboarding completion'),
  ('usage', 0.40, 'Product usage frequency and depth (highest weight)'),
  ('engagement', 0.25, 'Feature adoption and engagement trends'),
  ('support', 0.15, 'Support interaction quality (inverse - fewer tickets = better)');
