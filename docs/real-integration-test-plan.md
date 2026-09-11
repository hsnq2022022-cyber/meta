# خطة اختبار التكامل الحقيقي
## إدارة سوشيال - Social Management

### 1. إعداد Meta App

| الخطوة | الحالة | ملاحظات |
|--------|--------|---------|
| إنشاء Meta Developer Account | ⏳ Requires Manual Action | https://developers.facebook.com |
| إنشاء Meta App | ⏳ Requires Manual Action | اختر نوع Business |
| إضافة منتج Instagram | ⏳ Requires Manual Action | من App Dashboard |
| إضافة منتج Facebook Login | ⏳ Requires Manual Action | عند الحاجة |
| ضبط App Domain | ⏳ Requires Manual Action | Production domain |
| ضبط Privacy Policy URL | ⏳ Requires Manual Action | مطلوب |

### 2. OAuth Setup

| الخطوة | الحالة | ملاحظات |
|--------|--------|---------|
| ضبط OAuth Redirect URI | ⏳ Requires Manual Action | في Meta App Settings |
| إضافة الصلاحيات المطلوبة | ⏳ Requires Manual Action | instagram_basic, instagram_manage_messages |
| اختبار OAuth في Development Mode | ⏳ Not Tested | يحتاج حساب Instagram Test |
| Token Exchange | ⏳ Not Implemented | Backend callback handler |
| Long-lived Token | ⏳ Not Implemented | Token refresh logic |

### 3. Webhook Setup

| الخطوة | الحالة | ملاحظات |
|--------|--------|---------|
| Webhook Callback URL | ⏳ Requires HTTPS | لا يعمل مع localhost |
| Verify Token | ⏳ Not Implemented | يجب أن يتطابق مع env var |
| Subscribe to fields | ⏳ Requires Manual Action | messages, messaging_postbacks |
| Webhook Verification (GET) | ⏳ Not Implemented | Challenge response |
| Event Processing (POST) | ⏳ Not Implemented | Event handler |
| Idempotency | ⏳ Not Implemented | Event ID deduplication |

### 4. Instagram Integration Test Flow

| # | الاختبار | الحالة |
|---|----------|--------|
| 1 | ربط حساب Instagram تجريبي | ⏳ Requires Meta App |
| 2 | إرسال رسالة من حساب خارجي | ⏳ Requires Webhook |
| 3 | استقبال Webhook في Backend | ⏳ Not Implemented |
| 4 | حفظ الرسالة في Supabase | ⏳ Not Implemented |
| 5 | ربط الرسالة بالـ Workspace | ⏳ Not Implemented |
| 6 | تشغيل AI | ⏳ Not Implemented |
| 7 | إرسال رد عبر Graph API | ⏳ Not Implemented |
| 8 | ظهور الرد في Instagram | ⏳ Not Implemented |

### 5. Human Handoff Test

| # | الاختبار | الحالة |
|---|----------|--------|
| 1 | طلب موظف من العميل | ⏳ Not Implemented |
| 2 | إيقاف AI | ⏳ Not Implemented |
| 3 | تولي الموظف للمحادثة | ⏳ Not Implemented |
| 4 | إرسال رد يدوي | ⏳ Not Implemented |
| 5 | إعادة تفعيل AI | ⏳ Not Implemented |

### 6. Error Handling Tests

| # | الاختبار | الحالة |
|---|----------|--------|
| 1 | Token منتهي الصلاحية | ⏳ Not Implemented |
| 2 | فشل Meta API | ⏳ Not Implemented |
| 3 | Rate Limit | ⏳ Not Implemented |
| 4 | Webhook مكرر | ⏳ Not Implemented |
| 5 | Event غير معروف | ⏳ Not Implemented |

### 7. الحالات الحالية

| الحالة | الوصف |
|--------|-------|
| ✅ Implemented | مُنفذ ومُختبر |
| 🔶 Partially Implemented | مُنفذ جزئياً |
| ⏳ Requires Manual Action | يحتاج إعداد يدوي |
| 🚫 Blocked | محجوز بسبب اعتماد خارجي |
| ❌ Not Implemented | لم يُنفذ بعد |
| 🧪 Development Mode Only | يعمل في وضع التطوير فقط |
| 🔒 Requires App Review | يحتاج مراجعة Meta |
| 🔐 Requires Advanced Access | يحتاج صلاحية متقدمة |
| 🏢 Requires Business Verification | يحتاج توثيق نشاط |
| 🌐 Requires HTTPS | يحتاج نطاق HTTPS |
| 🏠 Requires Production Domain | يحتاج نطاق إنتاج |

### 8. ما يحتاج إعداد يدوي من المستخدم

1. **إنشاء Meta App** في Meta Developer Portal
2. **تفعيل منتجات Instagram** في Meta App
3. **إضافة Redirect URI** في OAuth Settings
4. **إضافة Webhook Callback URL** (HTTPS)
5. **إضافة Verify Token** في Webhook Settings
6. **ربط حساب Instagram Business** تجريبي
7. **تقديم طلب App Review** للإنتاج
8. **توثيق النشاط التجاري** (Business Verification)
9. **إعداد Supabase Project** وإضافة credentials
10. **إعداد Railway** أو استضافة Backend
11. **توفير AI Provider API Key**

### 9. ترتيب التنفيذ الموصى به

1. ✅ إعداد Supabase Project + Run Migrations
2. ✅ إعداد Frontend (مُنفذ)
3. ⏳ إعداد Meta App + Development Mode
4. ⏳ ربط حساب Instagram تجريبي
5. ⏳ تنفيذ Backend (Edge Functions)
6. ⏳ تنفيذ OAuth Callback
7. ⏳ تنفيذ Webhook Handler
8. ⏳ تنفيذ AI Integration
9. ⏳ اختبار End-to-End في Development Mode
10. ⏳ تقديم App Review
11. ⏳ Production Deployment
