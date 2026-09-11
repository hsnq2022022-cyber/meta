import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message, AIAgent, KnowledgeSource, CRMContact, Lead, Channel } from './supabase';

// Demo Mode Service - generates realistic demo data clearly marked as demo
// All demo data has is_demo = true and source = 'demo'

export interface DemoScenario {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  conversation: Conversation;
  messages: Message[];
}

const DEMO_WORKSPACE_ID = 'demo-workspace-001';

// Demo Agents
export function getDemoAgents(): AIAgent[] {
  return [
    {
      id: 'agent-001',
      workspace_id: DEMO_WORKSPACE_ID,
      name: 'مساعد خدمة العملاء',
      description: 'وكيل ذكاء اصطناعي متخصص في خدمة العملاء والرد على الاستفسارات',
      role: 'customer_service',
      instructions: 'أنت مساعد خدمة عملاء محترف. رد على أسئلة العملاء بأدب واحترافية. إذا لم تعرف الإجابة، حوّل المحادثة لموظف بشري.',
      tone: 'مهني وودود',
      language: 'ar',
      dialect: 'العربية الفصحى',
      rules: ['لا تخترع منتجات', 'لا تذكر أسعار غير مؤكدة', 'حوّل للموظف عند الشكوى'],
      dont_answer_rules: ['أسئلة سياسية', 'أسئلة دينية حساسة', 'معلومات شخصية عن موظفين'],
      handoff_conditions: ['شكوى عميل', 'طلب موظف بشري', 'سؤال خارج النطاق'],
      channel_id: 'channel-demo-001',
      is_active: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
    },
    {
      id: 'agent-002',
      workspace_id: DEMO_WORKSPACE_ID,
      name: 'مساعد المبيعات',
      description: 'وكيل ذكاء اصطناعي متخصص في المبيعات وجمع بيانات الطلبات',
      role: 'sales',
      instructions: 'أنت مساعد مبيعات. ساعد العملاء في اختيار المنتجات وجمع بيانات الطلب. اقترح منتجات مناسبة.',
      tone: 'متحمس ومقنع',
      language: 'ar',
      dialect: 'العراقية',
      rules: ['اعرض المنتجات المتاحة فقط', 'اذكر الأسعار من قاعدة المعرفة', 'اجمع بيانات الطلب كاملة'],
      dont_answer_rules: ['لا تعد بخصومات غير معتمدة', 'لا تقارن بمنافسين'],
      handoff_conditions: ['طلب خصم كبير', 'شكوى من السعر', 'طلب خاص'],
      channel_id: 'channel-demo-001',
      is_active: true,
      created_at: '2024-01-16T09:00:00Z',
      updated_at: '2024-01-21T11:00:00Z',
    },
    {
      id: 'agent-003',
      workspace_id: DEMO_WORKSPACE_ID,
      name: 'مساعد الحجوزات',
      description: 'وكيل ذكاء اصطناعي متخصص في حجز المواعيد',
      role: 'appointments',
      instructions: 'أنت مساعد حجوزات. ساعد العملاء في حجز المواعيد. اجمع الاسم ونوع الخدمة والوقت المفضل.',
      tone: 'منظم ودقيق',
      language: 'ar',
      dialect: 'الخليجية',
      rules: ['اعرض الأوقات المتاحة فقط', 'أكد الحجز قبل الإرسال', 'أرسل تذكير'],
      dont_answer_rules: ['لا تؤكد حجز دون توفر', 'لا تعد بأوقات غير متاحة'],
      handoff_conditions: ['طلب تعديل حجز', 'شكوى من موعد', 'حالة طوارئ'],
      channel_id: 'channel-demo-002',
      is_active: true,
      created_at: '2024-01-17T08:00:00Z',
      updated_at: '2024-01-22T10:00:00Z',
    },
  ];
}

// Demo Channels
export function getDemoChannels(): Channel[] {
  return [
    {
      id: 'channel-demo-001',
      workspace_id: DEMO_WORKSPACE_ID,
      provider: 'instagram',
      status: 'connected',
      external_id: 'demo_instagram_001',
      username: 'demo_store_iq',
      display_name: 'متجر النخبة التجريبي',
      agent_id: 'agent-001',
      last_sync_at: '2024-01-22T15:00:00Z',
      webhook_status: 'active',
      token_status: 'valid',
      is_demo: true,
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-22T15:00:00Z',
    },
    {
      id: 'channel-demo-002',
      workspace_id: DEMO_WORKSPACE_ID,
      provider: 'instagram',
      status: 'connected',
      external_id: 'demo_instagram_002',
      username: 'demo_clinic_iq',
      display_name: 'عيادة الابتسامة التجريبية',
      agent_id: 'agent-003',
      last_sync_at: '2024-01-22T14:00:00Z',
      webhook_status: 'active',
      token_status: 'valid',
      is_demo: true,
      created_at: '2024-01-12T09:00:00Z',
      updated_at: '2024-01-22T14:00:00Z',
    },
  ];
}

// Demo Conversations - 6 scenarios
export function getDemoConversations(): Conversation[] {
  return [
    // Scenario 1: Product Inquiry
    {
      id: 'conv-demo-001',
      workspace_id: DEMO_WORKSPACE_ID,
      channel_id: 'channel-demo-001',
      agent_id: 'agent-002',
      external_contact_id: 'demo_contact_001',
      contact_name: 'سارة أحمد',
      status: 'ai_active',
      is_demo: true,
      source: 'demo',
      last_message_at: '2024-01-22T14:30:00Z',
      last_message_preview: 'كم سعر التوصيل إلى بغداد؟',
      unread_count: 0,
      created_at: '2024-01-22T14:00:00Z',
      updated_at: '2024-01-22T14:30:00Z',
    },
    // Scenario 2: Human Handoff Request
    {
      id: 'conv-demo-002',
      workspace_id: DEMO_WORKSPACE_ID,
      channel_id: 'channel-demo-001',
      agent_id: 'agent-001',
      external_contact_id: 'demo_contact_002',
      contact_name: 'محمد علي',
      status: 'human_requested',
      is_demo: true,
      source: 'demo',
      last_message_at: '2024-01-22T13:45:00Z',
      last_message_preview: 'أريد التحدث مع موظف من فضلك',
      unread_count: 2,
      created_at: '2024-01-22T13:00:00Z',
      updated_at: '2024-01-22T13:45:00Z',
    },
    // Scenario 3: Appointment Booking
    {
      id: 'conv-demo-003',
      workspace_id: DEMO_WORKSPACE_ID,
      channel_id: 'channel-demo-002',
      agent_id: 'agent-003',
      external_contact_id: 'demo_contact_003',
      contact_name: 'نور الهدى',
      status: 'ai_active',
      is_demo: true,
      source: 'demo',
      last_message_at: '2024-01-22T12:20:00Z',
      last_message_preview: 'أريد حجز موعد لتنظيف الأسنان',
      unread_count: 0,
      created_at: '2024-01-22T11:30:00Z',
      updated_at: '2024-01-22T12:20:00Z',
    },
    // Scenario 4: Customer Complaint
    {
      id: 'conv-demo-004',
      workspace_id: DEMO_WORKSPACE_ID,
      channel_id: 'channel-demo-001',
      agent_id: 'agent-001',
      external_contact_id: 'demo_contact_004',
      contact_name: 'أحمد كريم',
      status: 'assigned_to_human',
      assigned_to: 'موظف الدعم',
      is_demo: true,
      source: 'demo',
      last_message_at: '2024-01-22T11:00:00Z',
      last_message_preview: 'المنتج وصل تالف وأريد استرجاع',
      unread_count: 1,
      created_at: '2024-01-22T10:00:00Z',
      updated_at: '2024-01-22T11:00:00Z',
    },
    // Scenario 5: Potential Lead
    {
      id: 'conv-demo-005',
      workspace_id: DEMO_WORKSPACE_ID,
      channel_id: 'channel-demo-001',
      agent_id: 'agent-002',
      external_contact_id: 'demo_contact_005',
      contact_name: 'شركة الأفق',
      status: 'resolved',
      is_demo: true,
      source: 'demo',
      last_message_at: '2024-01-22T09:30:00Z',
      last_message_preview: 'شكراً، سأتواصل معكم لاحقاً',
      unread_count: 0,
      created_at: '2024-01-21T16:00:00Z',
      updated_at: '2024-01-22T09:30:00Z',
    },
    // Scenario 6: Closed Conversation
    {
      id: 'conv-demo-006',
      workspace_id: DEMO_WORKSPACE_ID,
      channel_id: 'channel-demo-002',
      agent_id: 'agent-003',
      external_contact_id: 'demo_contact_006',
      contact_name: 'فاطمة حسن',
      status: 'closed',
      is_demo: true,
      source: 'demo',
      last_message_at: '2024-01-21T15:00:00Z',
      last_message_preview: 'تم الحجز بنجاح، شكراً لكم',
      unread_count: 0,
      created_at: '2024-01-21T14:00:00Z',
      updated_at: '2024-01-21T15:00:00Z',
    },
  ];
}

// Demo Messages for each conversation
export function getDemoMessages(): Record<string, Message[]> {
  return {
    'conv-demo-001': [
      { id: 'msg-001-1', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'مرحباً، هل لديكم عطور متاحة؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:00:00Z' },
      { id: 'msg-001-2', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أهلاً وسهلاً! نعم لدينا تشكيلة واسعة من العطور. لدينا:\n\n🌸 عطر الورد الدمشقي - 45,000 د.ع\n🌿 عطر المسك الأبيض - 35,000 د.ع\n✨ عطر العود الملكي - 75,000 د.ع\n\nأيها يهمك؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:02:00Z' },
      { id: 'msg-001-3', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'عطر الورد الدمشقي يبدو رائع! هل يمكنني طلبه؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:10:00Z' },
      { id: 'msg-001-4', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'بالتأكيد! عطر الورد الدمشقي خيار ممتاز 🌹\n\nلإتمام الطلب أحتاج:\n📍 عنوان التوصيل\n📱 رقم الهاتف\n\nوسأرسل لك التفاصيل كاملة.', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:12:00Z' },
      { id: 'msg-001-5', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'بغداد - الكرادة، رقمي 07701234567', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:20:00Z' },
      { id: 'msg-001-6', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'ممتاز! تم تسجيل طلبك:\n\n✅ عطر الورد الدمشقي - 45,000 د.ع\n📍 بغداد - الكرادة\n📱 07701234567\n\nسيتم التواصل معك لتأكيد الطلب. هل تحتاج شيء آخر؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:22:00Z' },
      { id: 'msg-001-7', conversation_id: 'conv-demo-001', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'كم سعر التوصيل إلى بغداد؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T14:30:00Z' },
    ],
    'conv-demo-002': [
      { id: 'msg-002-1', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'السلام عليكم', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T13:00:00Z' },
      { id: 'msg-002-2', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'وعليكم السلام ورحمة الله! أهلاً بك في متجر النخبة. كيف يمكنني مساعدتك اليوم؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T13:01:00Z' },
      { id: 'msg-002-3', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'عندي مشكلة بالطلب السابق', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T13:10:00Z' },
      { id: 'msg-002-4', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أعتذر عن أي إزعاج. هل يمكنك إخباري أكثر عن المشكلة؟ سأحاول مساعدتك.', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T13:11:00Z' },
      { id: 'msg-002-5', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'المنتج مختلف عن اللي طلبته تماماً!', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T13:15:00Z' },
      { id: 'msg-002-6', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أفهم إحباطك وأعتذر بشدة عن هذا الخطأ. هذه الحالة تحتاج متابعة من فريقنا المتخصص. سأحوّلك لموظف يمكنه حل المشكلة فوراً. 🙏', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T13:16:00Z' },
      { id: 'msg-002-7', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'أريد التحدث مع موظف من فضلك', is_demo: true, source: 'demo', status: 'delivered', created_at: '2024-01-22T13:40:00Z' },
      { id: 'msg-002-8', conversation_id: 'conv-demo-002', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'هل هناك أحد؟', is_demo: true, source: 'demo', status: 'delivered', created_at: '2024-01-22T13:45:00Z' },
    ],
    'conv-demo-003': [
      { id: 'msg-003-1', conversation_id: 'conv-demo-003', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'مرحبا، أريد حجز موعد', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T11:30:00Z' },
      { id: 'msg-003-2', conversation_id: 'conv-demo-003', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أهلاً بك في عيادة الابتسامة! 😊\n\nيسعدنا مساعدتك في حجز موعد. ما نوع الخدمة المطلوبة؟\n\n🦷 تنظيف أسنان\n🔧 حشو وعلاج\n✨ تجميل وتبييض\n📋 فحص عام', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T11:31:00Z' },
      { id: 'msg-003-3', conversation_id: 'conv-demo-003', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'أريد حجز موعد لتنظيف الأسنان', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T11:35:00Z' },
      { id: 'msg-003-4', conversation_id: 'conv-demo-003', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'ممتاز! تنظيف الأسنان خدمة متاحة.\n\nالمواعيد المتاحة هذا الأسبوع:\n📅 الأحد 28 يناير - 10:00 صباحاً\n📅 الاثنين 29 يناير - 2:00 مساءً\n📅 الثلاثاء 30 يناير - 11:00 صباحاً\n\nأي وقت يناسبك؟ وما اسمك الكريم؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T11:36:00Z' },
      { id: 'msg-003-5', conversation_id: 'conv-demo-003', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'أنا نور الهدى، أريد يوم الاثنين الساعة 2', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T12:00:00Z' },
      { id: 'msg-003-6', conversation_id: 'conv-demo-003', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'شكراً نور الهدى! ✅\n\nتم تسجيل حجزك المبدئي:\n👤 نور الهدى\n🦷 تنظيف أسنان\n📅 الاثنين 29 يناير - 2:00 مساءً\n\nسيتم تأكيد الموعد من قبل الإدارة وإرسال إشعار لك. هل تحتاج شيء آخر؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T12:20:00Z' },
    ],
    'conv-demo-004': [
      { id: 'msg-004-1', conversation_id: 'conv-demo-004', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'المنتج وصل مكسور!!', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T10:00:00Z' },
      { id: 'msg-004-2', conversation_id: 'conv-demo-004', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أعتذر جداً عن هذا الموقف المحبط. نأسف لتلف المنتج أثناء التوصيل.', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T10:01:00Z' },
      { id: 'msg-004-3', conversation_id: 'conv-demo-004', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'هذا غير مقبول! دفعت فلوسي والمنتج تالف!', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T10:05:00Z' },
      { id: 'msg-004-4', conversation_id: 'conv-demo-004', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أتفهم غضبك تماماً ولديك كل الحق. سأحوّلك مباشرة لموظف دعم يمكنه حل المشكلة واستبدال المنتج أو استرجاع المبلغ. 🙏', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T10:06:00Z' },
      { id: 'msg-004-5', conversation_id: 'conv-demo-004', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'المنتج وصل تالف وأريد استرجاع', is_demo: true, source: 'demo', status: 'delivered', created_at: '2024-01-22T11:00:00Z' },
    ],
    'conv-demo-005': [
      { id: 'msg-005-1', conversation_id: 'conv-demo-005', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'مرحبا، نحن شركة الأفق ونريد معرفة أسعاركم للطلبات بالجملة', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T16:00:00Z' },
      { id: 'msg-005-2', conversation_id: 'conv-demo-005', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أهلاً بشركة الأفق! 🏢\n\nيسعدنا التعاون معكم. لدينا أسعار خاصة للطلبات بالجملة.\n\nلأقدم لكم عرض مناسب، أحتاج معرفة:\n📦 نوع المنتجات المطلوبة\n📊 الكمية التقريبية\n📅 موعد التسليم المطلوب', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T16:02:00Z' },
      { id: 'msg-005-3', conversation_id: 'conv-demo-005', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'نريد 500 قطعة عطر متنوع، التسليم خلال أسبوعين', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T17:00:00Z' },
      { id: 'msg-005-4', conversation_id: 'conv-demo-005', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'ممتاز! طلب كبير ومهم. سأحوّل طلبكم لفريق المبيعات المتخصص ليقدم لكم أفضل عرض سعر.\n\n📋 تم تسجيل بياناتكم:\n🏢 شركة الأفق\n📦 500 قطعة عطر متنوع\n📅 خلال أسبوعين\n\nسيتم التواصل معكم خلال 24 ساعة. شكراً لثقتكم! 🙏', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T17:02:00Z' },
      { id: 'msg-005-5', conversation_id: 'conv-demo-005', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'شكراً، سأنتظر التواصل', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T09:00:00Z' },
      { id: 'msg-005-6', conversation_id: 'conv-demo-005', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'العفو! نتطلع للتعاون معكم. يومكم سعيد ☀️', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-22T09:30:00Z' },
    ],
    'conv-demo-006': [
      { id: 'msg-006-1', conversation_id: 'conv-demo-006', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'مرحبا، أريد الاستفسار عن خدمات العيادة', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T14:00:00Z' },
      { id: 'msg-006-2', conversation_id: 'conv-demo-006', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'أهلاً بك في عيادة الابتسامة! نقدم خدمات:\n\n🦷 تنظيف وتلميع\n🔧 حشو وعلاج جذور\n✨ تبييض أسنان\n👶 طب أسنان أطفال\n\nكيف يمكنني مساعدتك؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T14:01:00Z' },
      { id: 'msg-006-3', conversation_id: 'conv-demo-006', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'كم سعر التبييض؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T14:10:00Z' },
      { id: 'msg-006-4', conversation_id: 'conv-demo-006', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'ai', content: 'خدمة تبييض الأسنان لدينا:\n\n✨ تبييض بالليزر - 150,000 د.ع\n✨ تبييض منزلي - 75,000 د.ع\n\nكلاهما آمن وفعال. هل تودين حجز موعد؟', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T14:11:00Z' },
      { id: 'msg-006-5', conversation_id: 'conv-demo-006', workspace_id: DEMO_WORKSPACE_ID, sender_type: 'customer', content: 'تم الحجز بنجاح، شكراً لكم', is_demo: true, source: 'demo', status: 'read', created_at: '2024-01-21T15:00:00Z' },
    ],
  };
}

// Demo Knowledge Sources
export function getDemoKnowledgeSources(): KnowledgeSource[] {
  return [
    {
      id: 'ks-001',
      workspace_id: DEMO_WORKSPACE_ID,
      title: 'كتالوج المنتجات - متجر النخبة',
      type: 'document',
      content: 'عطر الورد الدمشقي - 45,000 د.ع\nعطر المسك الأبيض - 35,000 د.ع\nعطر العود الملكي - 75,000 د.ع\nعطر الياسمين - 40,000 د.ع\nعطر الصندل - 55,000 د.ع',
      status: 'ready',
      chunks_count: 5,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'ks-002',
      workspace_id: DEMO_WORKSPACE_ID,
      title: 'سياسة التوصيل',
      type: 'text',
      content: 'التوصيل داخل بغداد: 5,000 د.ع\nالتوصيل للمحافظات: 8,000 د.ع\nالتوصيل المجاني للطلبات فوق 100,000 د.ع\nمدة التوصيل: 2-5 أيام عمل',
      status: 'ready',
      chunks_count: 4,
      created_at: '2024-01-16T09:00:00Z',
      updated_at: '2024-01-16T09:00:00Z',
    },
    {
      id: 'ks-003',
      workspace_id: DEMO_WORKSPACE_ID,
      title: 'خدمات عيادة الابتسامة',
      type: 'text',
      content: 'تنظيف أسنان - 25,000 د.ع\nحشو عادي - 30,000 د.ع\nعلاج جذور - 80,000 د.ع\nتبييض بالليزر - 150,000 د.ع\nتبييض منزلي - 75,000 د.ع\nفحص عام - 15,000 د.ع',
      status: 'ready',
      chunks_count: 6,
      created_at: '2024-01-17T08:00:00Z',
      updated_at: '2024-01-17T08:00:00Z',
    },
  ];
}

// Demo CRM Contacts
export function getDemoCRMContacts(): CRMContact[] {
  return [
    { id: 'crm-001', workspace_id: DEMO_WORKSPACE_ID, name: 'سارة أحمد', phone: '07701234567', source: 'instagram', status: 'new', is_demo: true, created_at: '2024-01-22T14:00:00Z', updated_at: '2024-01-22T14:30:00Z' },
    { id: 'crm-002', workspace_id: DEMO_WORKSPACE_ID, name: 'محمد علي', phone: '07709876543', source: 'instagram', status: 'contacted', is_demo: true, created_at: '2024-01-22T13:00:00Z', updated_at: '2024-01-22T13:45:00Z' },
    { id: 'crm-003', workspace_id: DEMO_WORKSPACE_ID, name: 'نور الهدى', phone: '07705551234', source: 'instagram', status: 'qualified', is_demo: true, created_at: '2024-01-22T11:30:00Z', updated_at: '2024-01-22T12:20:00Z' },
    { id: 'crm-004', workspace_id: DEMO_WORKSPACE_ID, name: 'أحمد كريم', phone: '07701112233', source: 'instagram', status: 'contacted', is_demo: true, notes: 'شكوى - منتج تالف', created_at: '2024-01-22T10:00:00Z', updated_at: '2024-01-22T11:00:00Z' },
    { id: 'crm-005', workspace_id: DEMO_WORKSPACE_ID, name: 'شركة الأفق', email: 'info@alofoq.iq', phone: '07709998877', source: 'instagram', status: 'proposal', is_demo: true, notes: 'طلب بالجملة - 500 قطعة', created_at: '2024-01-21T16:00:00Z', updated_at: '2024-01-22T09:30:00Z' },
  ];
}

// Demo Leads
export function getDemoLeads(): Lead[] {
  return [
    { id: 'lead-001', workspace_id: DEMO_WORKSPACE_ID, contact_id: 'crm-001', name: 'سارة أحمد', phone: '07701234567', interest: 'عطر الورد الدمشقي', status: 'new', is_demo: true, created_at: '2024-01-22T14:00:00Z' },
    { id: 'lead-002', workspace_id: DEMO_WORKSPACE_ID, contact_id: 'crm-005', name: 'شركة الأفق', email: 'info@alofoq.iq', phone: '07709998877', interest: 'طلبات بالجملة - 500 عطر', status: 'qualified', is_demo: true, created_at: '2024-01-21T16:00:00Z' },
    { id: 'lead-003', workspace_id: DEMO_WORKSPACE_ID, name: 'متجر بغداد', phone: '07703334455', interest: 'توزيع منتجات', status: 'contacted', is_demo: true, created_at: '2024-01-20T10:00:00Z' },
  ];
}

// Demo Statistics
export function getDemoStats() {
  return {
    totalConversations: 6,
    activeConversations: 2,
    aiHandled: 4,
    humanHandled: 1,
    needsHuman: 1,
    resolved: 1,
    closed: 1,
    responseTime: '30 ثانية',
    satisfaction: '92%',
    leadsGenerated: 3,
    ordersCollected: 2,
    appointmentsBooked: 1,
  };
}
