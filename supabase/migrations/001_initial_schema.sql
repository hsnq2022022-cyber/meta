-- ============================================
-- إدارة سوشيال - Social Management
-- SQL Migration 001: Initial Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- WORKSPACES
-- ============================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'business', 'enterprise')),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ============================================
-- WORKSPACE MEMBERS
-- ============================================
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);

-- ============================================
-- AI AGENTS
-- ============================================
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('customer_service', 'sales', 'appointments', 'technical_support', 'orders', 'general')),
  instructions TEXT NOT NULL,
  tone VARCHAR(255),
  language VARCHAR(10) DEFAULT 'ar',
  dialect VARCHAR(100) DEFAULT 'العربية الفصحى',
  rules JSONB DEFAULT '[]',
  dont_answer_rules JSONB DEFAULT '[]',
  handoff_conditions JSONB DEFAULT '[]',
  channel_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_agents_workspace ON ai_agents(workspace_id);

-- ============================================
-- CHANNELS
-- ============================================
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('instagram', 'demo')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),
  external_id VARCHAR(255),
  username VARCHAR(255),
  display_name VARCHAR(255),
  agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
  last_sync_at TIMESTAMPTZ,
  webhook_status VARCHAR(50),
  token_status VARCHAR(50),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channels_workspace ON channels(workspace_id);
CREATE INDEX idx_channels_external ON channels(external_id);

-- ============================================
-- CHANNEL CREDENTIALS (Protected)
-- ============================================
CREATE TABLE channel_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  instagram_user_id VARCHAR(255),
  page_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id)
);

-- ============================================
-- CONVERSATIONS
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
  external_contact_id VARCHAR(255),
  contact_name VARCHAR(255),
  contact_avatar TEXT,
  status VARCHAR(50) DEFAULT 'ai_active' CHECK (status IN (
    'ai_active', 'human_requested', 'assigned_to_human', 
    'human_active', 'waiting_for_customer', 'resolved', 
    'closed', 'ai_resumed'
  )),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_demo BOOLEAN DEFAULT false,
  source VARCHAR(50) DEFAULT 'instagram' CHECK (source IN ('instagram', 'demo')),
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_workspace ON conversations(workspace_id);
CREATE INDEX idx_conversations_channel ON conversations(channel_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_external_contact ON conversations(external_contact_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('customer', 'ai', 'human')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_demo BOOLEAN DEFAULT false,
  source VARCHAR(50) DEFAULT 'instagram' CHECK (source IN ('instagram', 'demo')),
  external_message_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('sent', 'delivered', 'read', 'failed', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(external_message_id)
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_workspace ON messages(workspace_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- ============================================
-- KNOWLEDGE SOURCES
-- ============================================
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'pdf', 'url', 'document')),
  content TEXT,
  file_url TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  chunks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_sources_workspace ON knowledge_sources(workspace_id);

-- ============================================
-- KNOWLEDGE CHUNKS
-- ============================================
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_chunks_source ON knowledge_chunks(source_id);
CREATE INDEX idx_knowledge_chunks_workspace ON knowledge_chunks(workspace_id);

-- ============================================
-- HANDOFF EVENTS
-- ============================================
CREATE TABLE handoff_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  from_status VARCHAR(50) NOT NULL,
  to_status VARCHAR(50) NOT NULL,
  reason TEXT,
  triggered_by VARCHAR(50) CHECK (triggered_by IN ('ai', 'customer', 'human', 'system')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_handoff_events_conversation ON handoff_events(conversation_id);

-- ============================================
-- WEBHOOK EVENTS
-- ============================================
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- ============================================
-- CRM CONTACTS
-- ============================================
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  notes TEXT,
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_contacts_workspace ON crm_contacts(workspace_id);

-- ============================================
-- LEADS
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  interest TEXT,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_workspace ON leads(workspace_id);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  items JSONB DEFAULT '[]',
  total DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_workspace ON orders(workspace_id);

-- ============================================
-- APPOINTMENTS
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(50),
  service_type VARCHAR(255),
  appointment_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_workspace ON appointments(workspace_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- USAGE RECORDS
-- ============================================
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  metric VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 1,
  period VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_records_workspace ON usage_records(workspace_id);
CREATE INDEX idx_usage_records_period ON usage_records(period);

-- ============================================
-- SUBSCRIPTIONS (Future)
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_workspace ON subscriptions(workspace_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE handoff_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Note: channel_credentials should NOT have RLS readable by users
ALTER TABLE channel_credentials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Helper function to check workspace membership
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID, usr_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_id = ws_id AND user_id = usr_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Workspaces: users can see their own workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (owner_id = auth.uid() OR is_workspace_member(id, auth.uid()));

CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update workspaces" ON workspaces
  FOR UPDATE USING (owner_id = auth.uid());

-- Workspace Members
CREATE POLICY "Members can view workspace members" ON workspace_members
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

-- AI Agents: workspace-scoped
CREATE POLICY "Members can view agents" ON ai_agents
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can manage agents" ON ai_agents
  FOR ALL USING (is_workspace_member(workspace_id, auth.uid()));

-- Channels: workspace-scoped
CREATE POLICY "Members can view channels" ON channels
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can manage channels" ON channels
  FOR ALL USING (is_workspace_member(workspace_id, auth.uid()));

-- Channel Credentials: NOT accessible from client
-- Only accessible via service role key (backend)

-- Conversations: workspace-scoped
CREATE POLICY "Members can view conversations" ON conversations
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can manage conversations" ON conversations
  FOR ALL USING (is_workspace_member(workspace_id, auth.uid()));

-- Messages: workspace-scoped
CREATE POLICY "Members can view messages" ON messages
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can create messages" ON messages
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id, auth.uid()));

-- Knowledge Sources: workspace-scoped
CREATE POLICY "Members can view knowledge" ON knowledge_sources
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can manage knowledge" ON knowledge_sources
  FOR ALL USING (is_workspace_member(workspace_id, auth.uid()));

-- Knowledge Chunks: workspace-scoped
CREATE POLICY "Members can view chunks" ON knowledge_chunks
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

-- CRM: workspace-scoped
CREATE POLICY "Members can view CRM" ON crm_contacts
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can manage CRM" ON crm_contacts
  FOR ALL USING (is_workspace_member(workspace_id, auth.uid()));

-- Leads: workspace-scoped
CREATE POLICY "Members can view leads" ON leads
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can manage leads" ON leads
  FOR ALL USING (is_workspace_member(workspace_id, auth.uid()));

-- Orders: workspace-scoped
CREATE POLICY "Members can view orders" ON orders
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

-- Appointments: workspace-scoped
CREATE POLICY "Members can view appointments" ON appointments
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

-- Audit Logs: workspace-scoped
CREATE POLICY "Members can view audit logs" ON audit_logs
  FOR SELECT USING (is_workspace_member(workspace_id, auth.uid()));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create workspace member on workspace creation
CREATE OR REPLACE FUNCTION handle_new_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workspace_created
  AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION handle_new_workspace();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
