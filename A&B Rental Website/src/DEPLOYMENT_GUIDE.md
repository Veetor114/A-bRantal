# 🚀 Vercel Deployment Guide

This guide will help you deploy your A&B Rental Platform to Vercel.

## Prerequisites

Before deploying, ensure you have:

✅ A GitHub account  
✅ A Vercel account (sign up at [vercel.com](https://vercel.com))  
✅ Your Supabase project set up with Edge Function deployed  
✅ Stripe and Paystack accounts configured  

---

## ⚠️ IMPORTANT: Before Deploying

Make sure these files are committed to your repository:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `vercel.json`
- `index.html`
- `main.tsx`
- `.gitignore`
- `postcss.config.js`

---

## Step-by-Step Deployment

### 1️⃣ Push Your Code to GitHub

If you haven't already, create a GitHub repository:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - A&B Rental Platform"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

### 2️⃣ Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel will auto-detect your **Vite** configuration
6. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? (Your project name)
# - Directory? ./ (press Enter)
# - Override settings? No

# Deploy to production
vercel --prod
```

---

### 3️⃣ Configure Environment Variables (Optional)

If you add any frontend environment variables in the future:

1. Go to your project dashboard on Vercel
2. Click **Settings** → **Environment Variables**
3. Add your variables:
   - Variable name: `VITE_SOMETHING`
   - Value: `your-value`
4. Click **Save**
5. Redeploy for changes to take effect

**Note:** Backend environment variables (Stripe, Paystack keys) are already configured in your Supabase Edge Function and don't need to be added to Vercel.

---

### 4️⃣ Deploy Supabase Edge Function

Your backend server must be deployed to Supabase:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ykpirxstfagkspgxdvsm

# Deploy the edge function
supabase functions deploy make-server-0fe65257

# Verify deployment
supabase functions list
```

Check that your environment variables are set in Supabase:
- Go to Supabase Dashboard → Edge Functions → Secrets
- Verify these secrets exist:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `PAYSTACK_SECRET_KEY`

---

### 5️⃣ Verify Deployment

1. **Frontend Check:**
   - Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
   - Browse properties
   - Test navigation

2. **Backend Check:**
   - Open browser console (F12)
   - You should see: `Backend health check: { status: 'ok' }`
   - If you see connection errors, verify Step 4

3. **Authentication Check:**
   - Click "Sign In" 
   - Create an account
   - Verify email confirmation works

4. **Payment Check:**
   - Try to book a property
   - Test payment flow (use Stripe test card: 4242 4242 4242 4242)

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" errors

**Solution:**
- Ensure Supabase Edge Function is deployed (Step 4)
- Check browser console for API URL
- Verify all Supabase secrets are set

### Issue: Payment fails

**Solution:**
- Verify `STRIPE_SECRET_KEY` in Supabase secrets
- Verify `PAYSTACK_SECRET_KEY` in Supabase secrets  
- Check that keys are valid and not expired
- Use test cards for testing

### Issue: Authentication not working

**Solution:**
- Check Supabase Auth is enabled in dashboard
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check email confirmation settings

### Issue: Build fails on Vercel

**Solution:**
```bash
# Test build locally first
npm install
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build issues"
git push
```

---

## 📊 Post-Deployment Checklist

After successful deployment:

- [ ] Frontend loads correctly
- [ ] Properties display properly
- [ ] Navigation works (Home, Explore, Favorites, Account)
- [ ] User can sign up and log in
- [ ] Backend health check passes
- [ ] Payments work with test cards
- [ ] Voice assistant widget appears
- [ ] Mobile responsive design works
- [ ] Currency conversion works correctly

---

## 🔄 Updating Your Deployment

To update your live site after making changes:

```bash
# Make your changes to the code

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub (Vercel auto-deploys)
git push

# Or manually deploy with Vercel CLI
vercel --prod
```

---

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel project dashboard
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `www.abrentals.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## 📈 Monitoring & Analytics

### Vercel Analytics
1. Go to your project on Vercel
2. Click **Analytics** tab
3. View real-time traffic and performance

### Supabase Logs
1. Go to Supabase Dashboard
2. Click **Logs** → **Edge Functions**
3. Monitor API requests and errors

---

## 🎉 Success!

Your A&B Rental Platform is now live on Vercel! 

**Next Steps:**
- Share your Vercel URL
- Test all features thoroughly
- Set up custom domain (optional)
- Configure production payment keys (when ready)
- Enable Vapi AI production settings

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Paystack Docs:** https://paystack.com/docs

Happy deploying! 🚀