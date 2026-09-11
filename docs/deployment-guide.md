# دليل النشر - Deployment Guide
## إدارة سوشيال - Social Management

### البنية المطلوبة

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend       │     │   Supabase      │
│   (Vite/React)  │────▶│   (Edge Func)   │────▶│   (PostgreSQL)  │
│   Railway/Vercel│     │   Supabase/Rail │     │   Auth/Storage  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        │                        ▼
        │               ┌─────────────────┐
        │               │   Meta API      │
        └──────────────▶│   Graph API     │
                        │   Webhooks      │
                        └─────────────────┘
```

### 1. Supabase Setup

```bash
# 1. إنشاء مشروع Supabase جديد
# https://supabase.com/dashboard/new

# 2. تشغيل Migrations
# من SQL Editor في Supabase Dashboard:
# انسخ محتوى supabase/migrations/001_initial_schema.sql

# 3. إنشاء Storage Bucket
# Name: knowledge-files
# Public: false
# File size limit: 50MB

# 4. إعداد Environment Variables
# في Project Settings > API:
# - Project URL
# - Anon Key (Public)
# - Service Role Key (Secret - Backend only)
```

### 2. Frontend Deployment (Vercel / Railway)

```bash
# Environment Variables المطلوبة في Frontend:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Build Command:
npm run build

# Output Directory:
dist

# Framework Preset:
Vite
```

### 3. Backend (Supabase Edge Functions)

```bash
# إنشاء Edge Functions:
# supabase/functions/meta-oauth/index.ts
# supabase/functions/meta-webhook/index.ts
# supabase/functions/ai-handler/index.ts

# Deploy:
supabase functions deploy meta-oauth
supabase functions deploy meta-webhook
supabase functions deploy ai-handler

# Set Secrets:
supabase secrets set META_APP_ID=xxx
supabase secrets set META_APP_SECRET=xxx
supabase secrets set ENCRYPTION_KEY=xxx
supabase secrets set AI_PROVIDER_API_KEY=xxx
```

### 4. Meta App Configuration

```
1. Meta Developer Portal → My Apps → Create App
2. App Type: Business
3. Products → Add: Instagram
4. Settings → Basic:
   - App Domain: your-domain.com
   - Privacy Policy URL: https://your-domain.com/privacy
   - Terms of Service URL: https://your-domain.com/terms
5. Instagram → Settings:
   - Webhook Callback URL: https://your-backend-url/functions/v1/meta-webhook
   - Verify Token: your-random-token
   - Fields: messages, messaging_postbacks
6. OAuth Settings:
   - Redirect URI: https://your-backend-url/functions/v1/meta-oauth/callback
7. App Review:
   - Submit for instagram_manage_messages
   - Provide video demo
   - Provide use case description
```

### 5. Environment Variables Checklist

| Variable | Frontend | Backend | Railway |
|----------|----------|---------|---------|
| VITE_SUPABASE_URL | ✅ | - | - |
| VITE_SUPABASE_ANON_KEY | ✅ | - | - |
| SUPABASE_SERVICE_ROLE_KEY | - | ✅ | ✅ |
| META_APP_ID | - | ✅ | ✅ |
| META_APP_SECRET | - | ✅ | ✅ |
| META_WEBHOOK_VERIFY_TOKEN | - | ✅ | ✅ |
| ENCRYPTION_KEY | - | ✅ | ✅ |
| AI_PROVIDER_API_KEY | - | ✅ | ✅ |
| FRONTEND_URL | - | ✅ | ✅ |
| BACKEND_URL | - | ✅ | ✅ |

### 6. Health Check

```
GET /health
Response: { "status": "ok", "version": "1.0.0" }
```

### 7. Webhook URL

```
Production: https://your-backend.com/functions/v1/meta-webhook
Development: https://your-ngrok-url.ngrok.io/functions/v1/meta-webhook
```

### 8. Domain & HTTPS

- Frontend: `app.socialmgmt.com` أو `socialmgmt.vercel.app`
- Backend: `api.socialmgmt.com` أو Supabase Edge Functions URL
- Webhook: يجب أن يكون HTTPS
- لا يمكن استخدام localhost في Webhook للإنتاج

### 9. Monitoring

- Supabase Dashboard → Database → Performance
- Supabase Dashboard → Logs → Edge Functions
- Railway Dashboard → Logs
- Meta Developer Portal → App Dashboard → Webhook status

### 10. Backups

- Supabase: Daily automatic backups (Pro plan)
- Manual: `supabase db dump` قبل أي migration
- Edge Functions: Version control in Git

### 11. Rollback Plan

1. Frontend: Vercel/Railway → Deployments → Rollback
2. Database: Supabase → Restore from backup
3. Edge Functions: `supabase functions deploy` بالنسخة السابقة
4. Meta: لا يوجد rollback - تغييرات Meta دائمة

### 12. Production Checklist

- [ ] Supabase Project مُعد
- [ ] Migrations مُطبقة
- [ ] RLS Policies مفعّلة
- [ ] Storage Policies مفعّلة
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Environment Variables مُعدة
- [ ] Meta App مُعد
- [ ] Webhook URL مُعد (HTTPS)
- [ ] OAuth Redirect URI مُعد
- [ ] App Review مُقدمة
- [ ] Business Verification مكتمل
- [ ] Domain + SSL مُعد
- [ ] Monitoring مُفعّل
- [ ] Backups مُفعّلة
- [ ] Error tracking مُفعّل
