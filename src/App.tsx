import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Bot, BookOpen, Link2, Users, Settings,
  LogOut, Menu, X, Bell, Search, ChevronDown, Plus, Trash2, Eye, EyeOff,
  Send, AlertTriangle, Check, Clock, User, Zap, Shield, TrendingUp,
  RefreshCw, ExternalLink, Info, Filter, MoreVertical, ArrowRight
} from 'lucide-react';
import {
  getDemoAgents, getDemoChannels, getDemoConversations, getDemoMessages,
  getDemoKnowledgeSources, getDemoCRMContacts, getDemoLeads, getDemoStats
} from './lib/demo-data';
import type { Conversation, Message, AIAgent, Channel, KnowledgeSource } from './lib/supabase';

// ==================== CONTEXTS ====================

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

interface WorkspaceState {
  currentWorkspace: { id: string; name: string; isDemo: boolean } | null;
  workspaces: { id: string; name: string; isDemo: boolean }[];
  setWorkspace: (ws: { id: string; name: string; isDemo: boolean }) => void;
  createWorkspace: (name: string, isDemo: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceState>({
  currentWorkspace: null,
  workspaces: [],
  setWorkspace: () => {},
  createWorkspace: () => {},
});

// ==================== AUTH PROVIDER ====================

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('social_mgmt_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setIsAuthenticated(true);
      setUser(parsed);
    }
  }, []);

  const login = (email: string, _password: string) => {
    const userData = { id: 'user-001', email, name: email.split('@')[0] };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('social_mgmt_auth', JSON.stringify(userData));
  };

  const register = (email: string, _password: string, name: string) => {
    const userData = { id: 'user-001', email, name };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('social_mgmt_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('social_mgmt_auth');
    localStorage.removeItem('social_mgmt_workspace');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ==================== WORKSPACE PROVIDER ====================

function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<{ id: string; name: string; isDemo: boolean } | null>(null);
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string; isDemo: boolean }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('social_mgmt_workspaces');
    const current = localStorage.getItem('social_mgmt_workspace');
    if (stored) setWorkspaces(JSON.parse(stored));
    if (current) setCurrentWorkspace(JSON.parse(current));
  }, []);

  const setWorkspace = (ws: { id: string; name: string; isDemo: boolean }) => {
    setCurrentWorkspace(ws);
    localStorage.setItem('social_mgmt_workspace', JSON.stringify(ws));
  };

  const createWorkspace = (name: string, isDemo: boolean) => {
    const ws = { id: `ws-${Date.now()}`, name, isDemo };
    const updated = [...workspaces, ws];
    setWorkspaces(updated);
    localStorage.setItem('social_mgmt_workspaces', JSON.stringify(updated));
    setWorkspace(ws);
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, workspaces, setWorkspace, createWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ==================== LOGIN PAGE ====================

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      login(email, password);
    } else {
      login(email, password);
    }
    navigate('/workspaces');
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-bl from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة سوشيال</h1>
          <p className="text-gray-500 mt-2">منصة إدارة خدمة العملاء بالذكاء الاصطناعي</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="أدخل اسمك"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="example@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            {isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            {isRegister ? 'لديك حساب؟ سجل دخول' : 'ليس لديك حساب؟ أنشئ حساب جديد'}
          </button>
        </div>

        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <Info className="w-3 h-3" />
            وضع العرض التجريبي - البيانات المعروضة للتوضيح فقط
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== WORKSPACE SELECTOR ====================

function WorkspaceSelector() {
  const { workspaces, setWorkspace, createWorkspace } = useContext(WorkspaceContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [isDemo, setIsDemo] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = () => {
    if (newName.trim()) {
      createWorkspace(newName, isDemo);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">مرحباً {user?.name}</h1>
          <p className="text-gray-500 mt-2">اختر مساحة العمل أو أنشئ واحدة جديدة</p>
        </div>

        {workspaces.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-500">مساحات العمل</h3>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => { setWorkspace(ws); navigate('/dashboard'); }}
                className="w-full p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-right flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{ws.name}</p>
                  {ws.isDemo && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">تجريبي</span>}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}

        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 transition-colors flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء مساحة عمل جديدة</span>
          </button>
        ) : (
          <div className="space-y-4 p-4 border border-gray-200 rounded-xl">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="اسم مساحة العمل"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDemo}
                onChange={(e) => setIsDemo(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">إنشاء مع بيانات تجريبية (Demo Mode)</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                إنشاء
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== LAYOUT ====================

function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useContext(AuthContext);
  const { currentWorkspace } = useContext(WorkspaceContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
    { path: '/inbox', label: 'صندوق الوارد', icon: MessageSquare },
    { path: '/agents', label: 'وكلاء AI', icon: Bot },
    { path: '/knowledge', label: 'قاعدة المعرفة', icon: BookOpen },
    { path: '/channels', label: 'القنوات', icon: Link2 },
    { path: '/crm', label: 'CRM', icon: Users },
    { path: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-bl from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">إدارة سوشيال</h1>
                <p className="text-xs text-gray-500 truncate">{currentWorkspace?.name}</p>
              </div>
            </div>
            {currentWorkspace?.isDemo && (
              <div className="mt-2 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  الوضع التجريبي - بيانات للعرض
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => navigate('/workspaces')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              تبديل مساحة العمل
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="بحث..."
                className="bg-transparent outline-none text-sm w-40"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-xl relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================

function DashboardPage() {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const stats = getDemoStats();
  const conversations = getDemoConversations();
  const channels = getDemoChannels();
  const agents = getDemoAgents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">نظرة عامة</h1>
          <p className="text-gray-500 text-sm mt-1">مرحباً بك في لوحة التحكم</p>
        </div>
        {currentWorkspace?.isDemo && (
          <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            بيانات تجريبية
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="المحادثات" value={stats.totalConversations} color="indigo" />
        <StatCard icon={Zap} label="تم الرد بالـ AI" value={stats.aiHandled} color="green" />
        <StatCard icon={User} label="تحتاج موظف" value={stats.needsHuman} color="amber" />
        <StatCard icon={TrendingUp} label="عملاء محتملين" value={stats.leadsGenerated} color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Conversations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            آخر المحادثات
          </h3>
          <div className="space-y-3">
            {conversations.slice(0, 4).map((conv) => (
              <div key={conv.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(conv.status)}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{conv.contact_name}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.last_message_preview}</p>
                </div>
                <div className="text-xs text-gray-400">{formatTime(conv.last_message_at)}</div>
                {conv.is_demo && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">تجريبي</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Channels Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-600" />
            القنوات المتصلة
          </h3>
          {channels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Link2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">لم يتم ربط أي قناة بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-bl from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">IG</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{ch.display_name || ch.username}</p>
                    <p className="text-xs text-gray-500">@{ch.username}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-green-600">متصل</span>
                  </div>
                  {ch.is_demo && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">تجريبي</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agents Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          وكلاء AI النشطين
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {agents.map((agent) => (
            <div key={agent.id} className="p-4 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-500">{getRoleLabel(agent.role)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${agent.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-xs text-gray-500">{agent.is_active ? 'نشط' : 'متوقف'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== INBOX PAGE ====================

function InboxPage() {
  const [conversations] = useState<Conversation[]>(getDemoConversations());
  const [messages] = useState<Record<string, Message[]>>(getDemoMessages());
  const [selectedConv, setSelectedConv] = useState<string | null>('conv-demo-001');
  const [filter, setFilter] = useState<'all' | 'demo' | 'real'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [replyText, setReplyText] = useState('');

  const filteredConversations = conversations.filter((c) => {
    if (filter === 'demo' && !c.is_demo) return false;
    if (filter === 'real' && c.is_demo) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const selectedConversation = conversations.find(c => c.id === selectedConv);
  const selectedMessages = selectedConv ? (messages[selectedConv] || []) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">صندوق الوارد</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة المحادثات والردود</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'demo' | 'real')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">الكل</option>
            <option value="real">حقيقي فقط</option>
            <option value="demo">تجريبي فقط</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كل الحالات</option>
            <option value="ai_active">AI نشط</option>
            <option value="human_requested">يحتاج موظف</option>
            <option value="assigned_to_human">معيّن لموظف</option>
            <option value="resolved">تم الحل</option>
            <option value="closed">مغلق</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="بحث في المحادثات..." className="bg-transparent outline-none text-sm w-full" />
              </div>
            </div>
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">لا توجد محادثات</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv.id)}
                    className={`w-full p-3 text-right hover:bg-gray-50 transition-colors ${selectedConv === conv.id ? 'bg-indigo-50 border-r-2 border-indigo-600' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(conv.status)}`}></span>
                      <p className="text-sm font-medium text-gray-900 truncate flex-1">{conv.contact_name}</p>
                      {conv.unread_count > 0 && (
                        <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">{conv.unread_count}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.last_message_preview}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">{formatTime(conv.last_message_at)}</span>
                      {conv.is_demo && <span className="text-[10px] bg-amber-50 text-amber-600 px-1 rounded">تجريبي</span>}
                      <span className="text-[10px] text-gray-400">{getStatusLabel(conv.status)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedConversation.contact_name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedConversation.status)}`}></span>
                        <span className="text-xs text-gray-500">{getStatusLabel(selectedConversation.status)}</span>
                        {selectedConversation.is_demo && (
                          <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">محادثة تجريبية</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(selectedConversation.status === 'ai_active' || selectedConversation.status === 'ai_resumed') && (
                      <button className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                        تحويل لموظف
                      </button>
                    )}
                    {(selectedConversation.status === 'human_requested' || selectedConversation.status === 'assigned_to_human') && (
                      <button className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        تولي المحادثة
                      </button>
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_type === 'customer' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        msg.sender_type === 'customer'
                          ? 'bg-gray-100 text-gray-900'
                          : msg.sender_type === 'ai'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-green-600 text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${msg.sender_type === 'customer' ? 'text-gray-400' : 'text-white/70'}`}>
                          <span className="text-[10px]">{formatTime(msg.created_at)}</span>
                          {msg.sender_type === 'ai' && <Zap className="w-3 h-3" />}
                          {msg.sender_type === 'human' && <User className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Area */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب رداً..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <button className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedConversation.is_demo && (
                    <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      هذه محادثة تجريبية - الردود لن تُرسل عبر Instagram الحقيقي
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>اختر محادثة لعرض الرسائل</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== AGENTS PAGE ====================

function AgentsPage() {
  const [agents] = useState<AIAgent[]>(getDemoAgents());
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">وكلاء AI</h1>
          <p className="text-gray-500 text-sm mt-1">إنشاء وإدارة موظفي الذكاء الاصطناعي</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          وكيل جديد
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">إنشاء وكيل AI جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوكيل</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="مثال: مساعد المبيعات" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                <option value="customer_service">خدمة عملاء</option>
                <option value="sales">مبيعات</option>
                <option value="appointments">حجوزات</option>
                <option value="technical_support">دعم فني</option>
                <option value="orders">استقبال طلبات</option>
                <option value="general">مساعد عام</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اللهجة</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                <option>العربية الفصحى</option>
                <option>العراقية</option>
                <option>الخليجية</option>
                <option>السعودية</option>
                <option>الكويتية</option>
                <option>الإماراتية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نبرة الرد</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="مثال: مهني وودود" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">التعليمات</label>
              <textarea className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-24 resize-none" placeholder="اكتب تعليمات الوكيل هنا..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">قواعد عدم الإجابة</label>
              <textarea className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-16 resize-none" placeholder="مثال: لا تجيب على أسئلة سياسية أو دينية" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
              حفظ الوكيل
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              الوكيل محمي من: Prompt Injection، تسريب التعليمات، اختلاق معلومات
            </p>
          </div>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-500">{getRoleLabel(agent.role)}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${agent.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {agent.is_active ? 'نشط' : 'متوقف'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{agent.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {agent.dialect}</span>
              <span>•</span>
              <span>{agent.tone}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
              <button className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                تعديل
              </button>
              <button className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {agent.is_active ? 'إيقاف' : 'تفعيل'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          حماية الوكيل
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> حماية من Prompt Injection</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> منع تسريب التعليمات الداخلية</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> منع اختلاق المنتجات والأسعار</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> إجابة آمنة عند عدم توفر المعلومة</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> تحويل تلقائي للموظف عند الحاجة</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> الفصل بين التعليمات ورسائل العميل</div>
        </div>
      </div>
    </div>
  );
}

// ==================== KNOWLEDGE BASE PAGE ====================

function KnowledgeBasePage() {
  const [sources] = useState<KnowledgeSource[]>(getDemoKnowledgeSources());
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قاعدة المعرفة</h1>
          <p className="text-gray-500 text-sm mt-1">مصادر المعلومات التي يستخدمها وكلاء AI</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مصدر
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">إضافة مصدر معرفة</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المصدر</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="مثال: كتالوج المنتجات" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع المصدر</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['نص يدوي', 'ملف PDF', 'ملف Word', 'رابط موقع'].map((type) => (
                  <button key={type} className="p-3 border border-gray-200 rounded-xl text-sm hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى</label>
              <textarea className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-32 resize-none" placeholder="اكتب المحتوى أو الصق النص هنا..." />
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
                حفظ المصدر
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources List */}
      <div className="space-y-3">
        {sources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">لم تتم إضافة مصادر معرفة بعد</p>
            <p className="text-sm text-gray-400 mt-1">أضف مصادر ليستخدمها وكيل AI في الردود</p>
          </div>
        ) : (
          sources.map((source) => (
            <div key={source.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{source.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{source.type === 'text' ? 'نص' : source.type === 'pdf' ? 'PDF' : source.type === 'url' ? 'رابط' : 'مستند'}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{source.chunks_count} أجزاء</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                source.status === 'ready' ? 'bg-green-100 text-green-700' :
                source.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                source.status === 'failed' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-500'
              }`}>
                {source.status === 'ready' ? 'جاهز' : source.status === 'processing' ? 'قيد المعالجة' : source.status === 'failed' ? 'فشل' : 'معلّق'}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== CHANNELS PAGE ====================

function ChannelsPage() {
  const [channels] = useState<Channel[]>(getDemoChannels());
  const agents = getDemoAgents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">القنوات</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة قنوات التواصل المتصلة</p>
        </div>
      </div>

      {/* Instagram Channel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-bl from-pink-500 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">IG</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Instagram Business</h3>
            <p className="text-sm text-gray-500">الربط عبر Meta Graph API الرسمي</p>
          </div>
        </div>

        {channels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">لم يتم ربط حساب Instagram بعد</p>
            <button className="px-6 py-3 bg-gradient-to-l from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              ربط حساب Instagram
            </button>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-right">
              <p className="text-sm text-blue-700 font-medium mb-2">متطلبات الربط:</p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• حساب Instagram Business أو Professional</li>
                <li>• Meta App مع منتجات Instagram مُفعّلة</li>
                <li>• صلاحية instagram_basic و instagram_manage_messages</li>
                <li>• Webhook Callback URL (HTTPS)</li>
                <li>• Meta App Review للحصول على Advanced Access</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((ch) => (
              <div key={ch.id} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">@</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ch.display_name}</p>
                      <p className="text-xs text-gray-500">@{ch.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      متصل
                    </span>
                    {ch.is_demo && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">تجريبي</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">الوكيل</p>
                    <p className="font-medium text-gray-900">{agents.find(a => a.id === ch.agent_id)?.name || 'غير مرتبط'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">حالة Token</p>
                    <p className="font-medium text-green-600">{ch.token_status === 'valid' ? 'صالح' : 'منتهي'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Webhook</p>
                    <p className="font-medium text-green-600">{ch.webhook_status === 'active' ? 'نشط' : 'غير نشط'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">آخر مزامنة</p>
                    <p className="font-medium text-gray-900">{formatTime(ch.last_sync_at || '')}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">إعادة المصادقة</button>
                  <button className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50">فصل الحساب</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meta Integration Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-indigo-600" />
          معلومات التكامل مع Meta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900 mb-1">Graph API Version</p>
            <p className="text-gray-600">v19.0 (أو أحدث إصدار مستقر)</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900 mb-1">الصلاحيات المطلوبة</p>
            <p className="text-gray-600">instagram_basic, instagram_manage_messages, pages_show_list</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900 mb-1">حالة App Review</p>
            <p className="text-amber-600">يحتاج Advanced Access للإنتاج</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900 mb-1">Webhook Fields</p>
            <p className="text-gray-600">messages, messaging_postbacks, comments</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            في وضع التطوير: يمكن لـ 5 حسابات فقط اختبار التكامل. للإنتاج يحتاج Meta App Review + Business Verification.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== CRM PAGE ====================

function CRMPage() {
  const contacts = getDemoCRMContacts();
  const leads = getDemoLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء (CRM)</h1>
          <p className="text-gray-500 text-sm mt-1">متابعة العملاء والعملاء المحتملين</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة عميل
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="إجمالي العملاء" value={contacts.length} color="indigo" />
        <StatCard icon={TrendingUp} label="عملاء محتملين" value={leads.length} color="green" />
        <StatCard icon={Check} label="تم التحويل" value={1} color="purple" />
        <StatCard icon={Clock} label="بانتظار المتابعة" value={2} color="amber" />
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">العملاء المحتملين</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الاسم</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الاهتمام</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">التواصل</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">النوع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.interest}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getLeadStatusColor(lead.status)}`}>
                      {getLeadStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{lead.phone || lead.email || '-'}</td>
                  <td className="px-4 py-3">
                    {lead.is_demo && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">تجريبي</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">جهات الاتصال</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.phone || contact.email || '-'}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getContactStatusColor(contact.status)}`}>
                {getContactStatusLabel(contact.status)}
              </span>
              {contact.is_demo && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">تجريبي</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS PAGE ====================

function SettingsPage() {
  const { user } = useContext(AuthContext);
  const { currentWorkspace } = useContext(WorkspaceContext);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 text-sm mt-1">إدارة حسابك ومساحة العمل</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">إعدادات الحساب</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input type="text" defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Workspace Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">إعدادات مساحة العمل</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم مساحة العمل</label>
            <input type="text" defaultValue={currentWorkspace?.name} className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الخطة</label>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-900">الخطة المجانية</p>
              <p className="text-xs text-gray-500 mt-1">ترقية قريباً - خطط مدفوعة قيد التطوير</p>
            </div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <Info className="w-3 h-3" />
              الاشتراكات والخطط المدفوعة ستكون متاحة قريباً
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">الفريق</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">مالك</span>
        </div>
        <button className="mt-3 w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          دعوة عضو جديد
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-700 mb-4">منطقة الخطر</h3>
        <div className="space-y-3">
          <button className="w-full p-3 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors text-right">
            حذف جميع البيانات التجريبية
          </button>
          <button className="w-full p-3 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors text-right">
            حذف مساحة العمل
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER FUNCTIONS ====================

function getStatusColor(status: string): string {
  switch (status) {
    case 'ai_active': case 'ai_resumed': return 'bg-green-500';
    case 'human_requested': return 'bg-amber-500';
    case 'assigned_to_human': case 'human_active': return 'bg-blue-500';
    case 'resolved': return 'bg-purple-500';
    case 'closed': return 'bg-gray-400';
    default: return 'bg-gray-300';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ai_active': return 'AI نشط';
    case 'ai_resumed': return 'AI مستأنف';
    case 'human_requested': return 'يحتاج موظف';
    case 'assigned_to_human': return 'معيّن لموظف';
    case 'human_active': return 'موظف نشط';
    case 'waiting_for_customer': return 'بانتظار العميل';
    case 'resolved': return 'تم الحل';
    case 'closed': return 'مغلق';
    default: return status;
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'customer_service': return 'خدمة عملاء';
    case 'sales': return 'مبيعات';
    case 'appointments': return 'حجوزات';
    case 'technical_support': return 'دعم فني';
    case 'orders': return 'استقبال طلبات';
    case 'general': return 'مساعد عام';
    default: return role;
  }
}

function getLeadStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-700';
    case 'contacted': return 'bg-indigo-100 text-indigo-700';
    case 'qualified': return 'bg-green-100 text-green-700';
    case 'converted': return 'bg-purple-100 text-purple-700';
    case 'lost': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getLeadStatusLabel(status: string): string {
  switch (status) {
    case 'new': return 'جديد';
    case 'contacted': return 'تم التواصل';
    case 'qualified': return 'مؤهل';
    case 'converted': return 'تم التحويل';
    case 'lost': return 'مفقود';
    default: return status;
  }
}

function getContactStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-700';
    case 'contacted': return 'bg-indigo-100 text-indigo-700';
    case 'qualified': return 'bg-green-100 text-green-700';
    case 'proposal': return 'bg-amber-100 text-amber-700';
    case 'won': return 'bg-purple-100 text-purple-700';
    case 'lost': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getContactStatusLabel(status: string): string {
  switch (status) {
    case 'new': return 'جديد';
    case 'contacted': return 'تم التواصل';
    case 'qualified': return 'مؤهل';
    case 'proposal': return 'عرض سعر';
    case 'won': return 'تم الفوز';
    case 'lost': return 'مفقود';
    default: return status;
  }
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} د`;
  if (hours < 24) return `منذ ${hours} س`;
  if (days < 7) return `منذ ${days} يوم`;
  return date.toLocaleDateString('ar-IQ');
}

// ==================== STAT CARD COMPONENT ====================

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color] || colorClasses.indigo}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== PROTECTED ROUTE ====================

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function WorkspaceRoute({ children }: { children: ReactNode }) {
  const { currentWorkspace } = useContext(WorkspaceContext);
  if (!currentWorkspace) return <Navigate to="/workspaces" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

// ==================== MAIN APP ====================

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/workspaces" element={<ProtectedRoute><WorkspaceSelector /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><WorkspaceRoute><DashboardPage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><WorkspaceRoute><InboxPage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="/agents" element={<ProtectedRoute><WorkspaceRoute><AgentsPage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="/knowledge" element={<ProtectedRoute><WorkspaceRoute><KnowledgeBasePage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="/channels" element={<ProtectedRoute><WorkspaceRoute><ChannelsPage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute><WorkspaceRoute><CRMPage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><WorkspaceRoute><SettingsPage /></WorkspaceRoute></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
