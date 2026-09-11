import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client - will work when real credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = () => !!supabase && !!supabaseUrl && !!supabaseAnonKey;

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'agent' | 'viewer';
  joined_at: string;
}

export interface AIAgent {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  role: 'customer_service' | 'sales' | 'appointments' | 'technical_support' | 'orders' | 'general';
  instructions: string;
  tone: string;
  language: string;
  dialect: string;
  rules: string[];
  dont_answer_rules: string[];
  handoff_conditions: string[];
  channel_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  workspace_id: string;
  provider: 'instagram' | 'demo';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  external_id?: string;
  username?: string;
  display_name?: string;
  agent_id?: string;
  last_sync_at?: string;
  webhook_status?: string;
  token_status?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  channel_id: string;
  agent_id?: string;
  external_contact_id?: string;
  contact_name?: string;
  contact_avatar?: string;
  status: 'ai_active' | 'human_requested' | 'assigned_to_human' | 'human_active' | 'waiting_for_customer' | 'resolved' | 'closed' | 'ai_resumed';
  assigned_to?: string;
  is_demo: boolean;
  source: 'instagram' | 'demo';
  last_message_at: string;
  last_message_preview?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  workspace_id: string;
  sender_type: 'customer' | 'ai' | 'human';
  content: string;
  attachments?: string[];
  is_demo: boolean;
  source: 'instagram' | 'demo';
  external_message_id?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  created_at: string;
}

export interface KnowledgeSource {
  id: string;
  workspace_id: string;
  title: string;
  type: 'text' | 'pdf' | 'url' | 'document';
  content?: string;
  file_url?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  chunks_count: number;
  created_at: string;
  updated_at: string;
}

export interface CRMContact {
  id: string;
  workspace_id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  notes?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  workspace_id: string;
  contact_id?: string;
  name: string;
  email?: string;
  phone?: string;
  interest: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  is_demo: boolean;
  created_at: string;
}
