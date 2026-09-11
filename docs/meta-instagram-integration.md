# تكامل Instagram الرسمي عبر Meta API
## إدارة سوشيال - Social Management

### 1. المسار الرسمي للربط

```
المستخدم → إدارة سوشيال → Meta OAuth → Instagram Login → Callback → Token Exchange → ربط القناة
```

### 2. إصدار Graph API

- الإصدار الموصى به: **v19.0** أو أحدث إصدار مستقر
- يجب تحديد الإصدار في كل استدعاء API

### 3. الصلاحيات المطلوبة (Permissions)

| الصلاحية | الوصف | الحالة |
|----------|--------|--------|
| `instagram_basic` | قراءة البيانات الأساسية | Development Mode |
| `instagram_manage_messages` | إرسال واستقبال الرسائل | يحتاج App Review |
| `instagram_manage_comments` | إدارة التعليقات | يحتاج App Review |
| `pages_show_list` | عرض الصفحات المرتبطة | Development Mode |
| `pages_messaging` | رسائل الصفحات | يحتاج App Review |
| `pages_read_engagement` | قراءة التفاعل | Development Mode |

### 4. تدفق OAuth

#### الخطوة 1: بدء OAuth
```
GET https://www.facebook.com/v19.0/dialog/oauth
  ?client_id={APP_ID}
  &redirect_uri={REDIRECT_URI}
  &state={CSRF_TOKEN}
  &scope=instagram_basic,instagram_manage_messages,pages_show_list
  &response_type=code
```

#### الخطوة 2: Callback
```
GET {REDIRECT_URI}?code={CODE}&state={STATE}
```

#### الخطوة 3: Token Exchange
```
GET https://graph.facebook.com/v19.0/oauth/access_token
  ?client_id={APP_ID}
  &redirect_uri={REDIRECT_URI}
  &client_secret={APP_SECRET}
  &code={CODE}
```

#### الخطوة 4: Long-lived Token
```
GET https://graph.facebook.com/v19.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={SHORT_LIVED_TOKEN}
```

#### الخطوة 5: Instagram Account Info
```
GET https://graph.facebook.com/v19.0/{PAGE_ID}
  ?fields=instagram_business_account
  &access_token={ACCESS_TOKEN}
```

### 5. Webhooks

#### إعداد Webhook
- Callback URL: `https://{DOMAIN}/api/webhooks/meta`
- Verify Token: قيمة عشوائية آمنة مخزنة في المتغيرات البيئية
- HTTPS مطلوب في الإنتاج

#### حقول Webhook المطلوبة
- `messages` - الرسائل الواردة والصادرة
- `messaging_postbacks` - أزرار الرد السريع
- `comments` - التعليقات على المنشورات (اختياري)

#### التحقق من Webhook (GET)
```
GET /api/webhooks/meta
  ?hub.mode=subscribe
  &hub.challenge={CHALLENGE}
  &hub.verify_token={VERIFY_TOKEN}
```

#### استقبال الأحداث (POST)
```
POST /api/webhooks/meta
Content-Type: application/json
X-Hub-Signature-256: sha256={HMAC}

{
  "object": "instagram",
  "entry": [...]
}
```

### 6. إرسال الرسائل

```
POST https://graph.facebook.com/v19.0/{IG_USER_ID}/messages
  ?access_token={ACCESS_TOKEN}

{
  "recipient": {"id": "{SENDER_ID}"},
  "message": {"text": "نص الرسالة"}
}
```

### 7. متطلبات Advanced Access

للعمل في الإنتاج (خارج Development Mode):

| المتطلب | الحالة |
|---------|--------|
| Meta App Review | مطلوب |
| Business Verification | مطلوب |
| Privacy Policy URL | مطلوب |
| Terms of Service URL | مطلوب |
| App Icon & Screenshots | مطلوب |
| استخدام واضح للصلاحيات | مطلوب |
| فيديو يوضح الاستخدام | مطلوب لـ instagram_manage_messages |

### 8. القيود

- **Development Mode**: 5 حسابات اختبار فقط
- **Rate Limiting**: 200 رسالة/ساعة لكل حساب Instagram
- **Message Tags**: يجب استخدام Message Tags للرسائل بعد 24 ساعة
- **24-Hour Window**: يمكن الرد بحرية خلال 24 ساعة من آخر رسالة من العميل
- **Human Agent**: يجب تفعيل الميزة في Meta Business Suite

### 9. الأمان

- ✅ `APP_SECRET` في Backend فقط (Environment Variable)
- ✅ `APP_SECRET_PROOF` مع كل استدعاء Graph API
- ✅ CSRF Token في OAuth State
- ✅ Webhook Signature Verification (X-Hub-Signature-256)
- ✅ Token Encryption في قاعدة البيانات
- ✅ لا يتم تخزين كلمات مرور Instagram
- ✅ HTTPS مطلوب في كل الاتصالات

### 10. ما لم يُنفذ بعد

- [ ] Meta App Setup في Meta Developer Portal
- [ ] Webhook Production URL (يحتاج HTTPS domain)
- [ ] App Review submission
- [ ] Business Verification
- [ ] Advanced Access approval
- [ ] Human Agent activation
- [ ] Message Tags implementation
- [ ] Token refresh automation

### 11. ملاحظات مهمة

- هذا التكامل يستخدم **فقط** الطرق الرسمية من Meta
- لا يتم تخزين كلمة مرور Instagram أبداً
- لا يتم استخدام أي API غير رسمي
- لا يتم محاكاة تطبيق Instagram
- كل العمليات تتم عبر Graph API الرسمي
- يجب الحصول على موافقة Meta قبل الإنتاج
