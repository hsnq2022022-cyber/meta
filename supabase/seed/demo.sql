-- ============================================
-- إدارة سوشيال - Demo Seed Data
-- ============================================
-- This file creates demo data for testing/demo purposes.
-- All data is marked with is_demo = true and source = 'demo'.
-- Safe to run multiple times (uses ON CONFLICT / idempotent patterns).
-- ============================================

-- Note: This requires an existing workspace.
-- Replace 'YOUR_WORKSPACE_ID' with actual workspace UUID.

-- ============================================
-- DEMO AI AGENTS
-- ============================================
INSERT INTO ai_agents (id, workspace_id, name, description, role, instructions, tone, language, dialect, rules, dont_answer_rules, handoff_conditions, is_active)
VALUES 
  ('demo-agent-001', 'YOUR_WORKSPACE_ID', 'مساعد خدمة العملاء', 'وكيل ذكاء اصطناعي متخصص في خدمة العملاء', 'customer_service', 'أنت مساعد خدمة عملاء محترف. رد بأدب واحترافية. إذا لم تعرف الإجابة، حوّل لموظف.', 'مهني وودود', 'ar', 'العربية الفصحى', '["لا تخترع منتجات", "لا تذكر أسعار غير مؤكدة"]'::jsonb, '["أسئلة سياسية", "أسئلة دينية"]'::jsonb, '["شكوى عميل", "طلب موظف بشري"]'::jsonb, true),
  ('demo-agent-002', 'YOUR_WORKSPACE_ID', 'مساعد المبيعات', 'وكيل ذكاء اصطناعي متخصص في المبيعات', 'sales', 'أنت مساعد مبيعات. ساعد العملاء في اختيار المنتجات وجمع بيانات الطلبات.', 'متحمس ومقنع', 'ar', 'العراقية', '["اعرض المنتجات المتاحة فقط", "اجمع بيانات الطلب كاملة"]'::jsonb, '["لا تعد بخصومات غير معتمدة"]'::jsonb, '["طلب خصم كبير", "شكوى من السعر"]'::jsonb, true),
  ('demo-agent-003', 'YOUR_WORKSPACE_ID', 'مساعد الحجوزات', 'وكيل ذكاء اصطناعي متخصص في حجز المواعيد', 'appointments', 'أنت مساعد حجوزات. ساعد العملاء في حجز المواعيد.', 'منظم ودقيق', 'ar', 'الخليجية', '["اعرض الأوقات المتاحة فقط", "أكد الحجز قبل الإرسال"]'::jsonb, '["لا تؤكد حجز دون توفر"]'::jsonb, '["طلب تعديل حجز", "حالة طوارئ"]'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO KNOWLEDGE SOURCES
-- ============================================
INSERT INTO knowledge_sources (id, workspace_id, title, type, content, status, chunks_count)
VALUES
  ('demo-ks-001', 'YOUR_WORKSPACE_ID', 'كتالوج المنتجات', 'text', 'عطر الورد الدمشقي - 45,000 د.ع
عطر المسك الأبيض - 35,000 د.ع
عطر العود الملكي - 75,000 د.ع
عطر الياسمين - 40,000 د.ع', 'ready', 4),
  ('demo-ks-002', 'YOUR_WORKSPACE_ID', 'سياسة التوصيل', 'text', 'التوصيل داخل بغداد: 5,000 د.ع
التوصيل للمحافظات: 8,000 د.ع
التوصيل المجاني للطلبات فوق 100,000 د.ع
مدة التوصيل: 2-5 أيام عمل', 'ready', 4),
  ('demo-ks-003', 'YOUR_WORKSPACE_ID', 'خدمات العيادة', 'text', 'تنظيف أسنان - 25,000 د.ع
حشو عادي - 30,000 د.ع
علاج جذور - 80,000 د.ع
تبييض بالليزر - 150,000 د.ع
فحص عام - 15,000 د.ع', 'ready', 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO CHANNELS
-- ============================================
INSERT INTO channels (id, workspace_id, provider, status, username, display_name, agent_id, is_demo, webhook_status, token_status)
VALUES
  ('demo-channel-001', 'YOUR_WORKSPACE_ID', 'demo', 'connected', 'demo_store_iq', 'متجر النخبة التجريبي', 'demo-agent-001', true, 'active', 'valid'),
  ('demo-channel-002', 'YOUR_WORKSPACE_ID', 'demo', 'connected', 'demo_clinic_iq', 'عيادة الابتسامة التجريبية', 'demo-agent-003', true, 'active', 'valid')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO CONVERSATIONS
-- ============================================
INSERT INTO conversations (id, workspace_id, channel_id, agent_id, contact_name, status, is_demo, source, last_message_at, last_message_preview, unread_count)
VALUES
  ('demo-conv-001', 'YOUR_WORKSPACE_ID', 'demo-channel-001', 'demo-agent-002', 'سارة أحمد', 'ai_active', true, 'demo', NOW(), 'كم سعر التوصيل إلى بغداد؟', 0),
  ('demo-conv-002', 'YOUR_WORKSPACE_ID', 'demo-channel-001', 'demo-agent-001', 'محمد علي', 'human_requested', true, 'demo', NOW(), 'أريد التحدث مع موظف من فضلك', 2),
  ('demo-conv-003', 'YOUR_WORKSPACE_ID', 'demo-channel-002', 'demo-agent-003', 'نور الهدى', 'ai_active', true, 'demo', NOW(), 'أريد حجز موعد لتنظيف الأسنان', 0),
  ('demo-conv-004', 'YOUR_WORKSPACE_ID', 'demo-channel-001', 'demo-agent-001', 'أحمد كريم', 'assigned_to_human', true, 'demo', NOW(), 'المنتج وصل تالف وأريد استرجاع', 1),
  ('demo-conv-005', 'YOUR_WORKSPACE_ID', 'demo-channel-001', 'demo-agent-002', 'شركة الأفق', 'resolved', true, 'demo', NOW(), 'شكراً، سأتواصل معكم لاحقاً', 0),
  ('demo-conv-006', 'YOUR_WORKSPACE_ID', 'demo-channel-002', 'demo-agent-003', 'فاطمة حسن', 'closed', true, 'demo', NOW(), 'تم الحجز بنجاح، شكراً لكم', 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO MESSAGES (Scenario 1: Product Inquiry)
-- ============================================
INSERT INTO messages (id, conversation_id, workspace_id, sender_type, content, is_demo, source, status)
VALUES
  ('demo-msg-001-1', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'customer', 'مرحباً، هل لديكم عطور متاحة؟', true, 'demo', 'read'),
  ('demo-msg-001-2', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'ai', 'أهلاً وسهلاً! نعم لدينا تشكيلة واسعة من العطور. لدينا:
🌸 عطر الورد الدمشقي - 45,000 د.ع
🌿 عطر المسك الأبيض - 35,000 د.ع
✨ عطر العود الملكي - 75,000 د.ع
أيها يهمك؟', true, 'demo', 'read'),
  ('demo-msg-001-3', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'customer', 'عطر الورد الدمشقي يبدو رائع! هل يمكنني طلبه؟', true, 'demo', 'read'),
  ('demo-msg-001-4', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'ai', 'بالتأكيد! عطر الورد الدمشقي خيار ممتاز 🌹
لإتمام الطلب أحتاج:
📍 عنوان التوصيل
📱 رقم الهاتف', true, 'demo', 'read'),
  ('demo-msg-001-5', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'customer', 'بغداد - الكرادة، رقمي 07701234567', true, 'demo', 'read'),
  ('demo-msg-001-6', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'ai', 'ممتاز! تم تسجيل طلبك:
✅ عطر الورد الدمشقي - 45,000 د.ع
📍 بغداد - الكرادة
📱 07701234567
سيتم التواصل معك لتأكيد الطلب.', true, 'demo', 'read'),
  ('demo-msg-001-7', 'demo-conv-001', 'YOUR_WORKSPACE_ID', 'customer', 'كم سعر التوصيل إلى بغداد؟', true, 'demo', 'delivered')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO MESSAGES (Scenario 2: Human Handoff)
-- ============================================
INSERT INTO messages (id, conversation_id, workspace_id, sender_type, content, is_demo, source, status)
VALUES
  ('demo-msg-002-1', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'customer', 'السلام عليكم', true, 'demo', 'read'),
  ('demo-msg-002-2', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'ai', 'وعليكم السلام! أهلاً بك. كيف يمكنني مساعدتك؟', true, 'demo', 'read'),
  ('demo-msg-002-3', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'customer', 'عندي مشكلة بالطلب السابق', true, 'demo', 'read'),
  ('demo-msg-002-4', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'ai', 'أعتذر عن أي إزعاج. هل يمكنك إخباري أكثر عن المشكلة؟', true, 'demo', 'read'),
  ('demo-msg-002-5', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'customer', 'المنتج مختلف عن اللي طلبته تماماً!', true, 'demo', 'read'),
  ('demo-msg-002-6', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'ai', 'أفهم إحباطك. هذه الحالة تحتاج متابعة من فريقنا. سأحوّلك لموظف.', true, 'demo', 'read'),
  ('demo-msg-002-7', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'customer', 'أريد التحدث مع موظف من فضلك', true, 'demo', 'delivered'),
  ('demo-msg-002-8', 'demo-conv-002', 'YOUR_WORKSPACE_ID', 'customer', 'هل هناك أحد؟', true, 'demo', 'delivered')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO CRM CONTACTS
-- ============================================
INSERT INTO crm_contacts (id, workspace_id, name, phone, source, status, is_demo)
VALUES
  ('demo-crm-001', 'YOUR_WORKSPACE_ID', 'سارة أحمد', '07701234567', 'instagram', 'new', true),
  ('demo-crm-002', 'YOUR_WORKSPACE_ID', 'محمد علي', '07709876543', 'instagram', 'contacted', true),
  ('demo-crm-003', 'YOUR_WORKSPACE_ID', 'نور الهدى', '07705551234', 'instagram', 'qualified', true),
  ('demo-crm-004', 'YOUR_WORKSPACE_ID', 'أحمد كريم', '07701112233', 'instagram', 'contacted', true),
  ('demo-crm-005', 'YOUR_WORKSPACE_ID', 'شركة الأفق', '07709998877', 'instagram', 'proposal', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO LEADS
-- ============================================
INSERT INTO leads (id, workspace_id, contact_id, name, phone, interest, status, is_demo)
VALUES
  ('demo-lead-001', 'YOUR_WORKSPACE_ID', 'demo-crm-001', 'سارة أحمد', '07701234567', 'عطر الورد الدمشقي', 'new', true),
  ('demo-lead-002', 'YOUR_WORKSPACE_ID', 'demo-crm-005', 'شركة الأفق', '07709998877', 'طلبات بالجملة - 500 عطر', 'qualified', true),
  ('demo-lead-003', 'YOUR_WORKSPACE_ID', NULL, 'متجر بغداد', '07703334455', 'توزيع منتجات', 'contacted', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CLEANUP FUNCTION (to remove all demo data)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_demo_data(p_workspace_id UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM messages WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM conversations WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM leads WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM crm_contacts WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM orders WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM appointments WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM knowledge_chunks WHERE workspace_id = p_workspace_id AND source_id IN (SELECT id FROM knowledge_sources WHERE workspace_id = p_workspace_id);
  DELETE FROM knowledge_sources WHERE workspace_id = p_workspace_id;
  DELETE FROM channels WHERE workspace_id = p_workspace_id AND is_demo = true;
  DELETE FROM ai_agents WHERE workspace_id = p_workspace_id;
  -- Note: Does NOT delete workspaces, users, or real data
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
