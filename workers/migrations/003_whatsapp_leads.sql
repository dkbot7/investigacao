-- Create whatsapp_leads table for tracking WhatsApp lead captures
CREATE TABLE IF NOT EXISTS whatsapp_leads (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  contato TEXT NOT NULL,
  mensagem TEXT,
  origem TEXT DEFAULT 'whatsapp',
  pagina TEXT DEFAULT '/',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  total_contatos INTEGER DEFAULT 1
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_contato ON whatsapp_leads(contato);
CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_created_at ON whatsapp_leads(created_at);
