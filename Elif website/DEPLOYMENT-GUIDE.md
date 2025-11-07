# 🚀 **DEPLOYMENT GUIDE - Elif College Website**
## Step-by-Step Guide for Non-Technical Users

This guide will help you deploy your Elif College website online using **Railway** - the easiest platform for beginners.

---

## 📋 **WHAT YOU'LL NEED**

- [ ] A GitHub account (free)
- [ ] A Railway account (free)
- [ ] Your email and password for Gmail App Password
- [ ] 30-45 minutes of time

**Total Cost:** $0 to start (Railway gives $5 free credit/month)

---

## 🎯 **STEP 1: CREATE GITHUB ACCOUNT**

### 1.1 Go to GitHub
- Open your browser
- Go to: **https://github.com**
- Click the **"Sign up"** button (top right corner)

### 1.2 Fill in the form
- **Email:** Use your personal email
- **Password:** Create a strong password
- **Username:** Choose a username (e.g., `elifcollege`)
- Click **"Continue"** and **"Create account"**

### 1.3 Verify your email
- Check your email inbox
- Click the verification link GitHub sent you
- **✅ CHECKPOINT:** You should now see your GitHub homepage

---

## 🎯 **STEP 2: CREATE A NEW REPOSITORY**

### 2.1 Create Repository
- On GitHub homepage, click **"+"** button (top right)
- Select **"New repository"**

### 2.2 Fill in repository details
- **Repository name:** `elif-college-website`
- **Description:** `Elif College School Management System`
- **Visibility:** Select **"Private"** (recommended)
- **DO NOT** check "Add a README file"
- **DO NOT** check "Add .gitignore"
- **DO NOT** check "Choose a license"
- Click **"Create repository"**

### 2.3 Keep this page open
- You'll see a page with commands and a URL
- **Keep this tab open** - we'll need it later
- **✅ CHECKPOINT:** You should see your empty repository

---

## 🎯 **STEP 3: INSTALL GITHUB DESKTOP (EASIEST METHOD)**

### 3.1 Download GitHub Desktop
- Go to: **https://desktop.github.com**
- Click **"Download for Windows"**
- Wait for download to complete

### 3.2 Install GitHub Desktop
- Open the downloaded file
- Click **"Install"**
- Wait for installation to complete
- Click **"Finish"**

### 3.3 Sign in to GitHub Desktop
- When GitHub Desktop opens, click **"Sign in to GitHub.com"**
- Enter your GitHub username and password
- Click **"Authorize desktop"**
- **✅ CHECKPOINT:** GitHub Desktop should now be logged in

---

## 🎯 **STEP 4: UPLOAD YOUR PROJECT TO GITHUB**

### 4.1 Add your project to GitHub Desktop
- In GitHub Desktop, click **"File"** → **"Add Local Repository"**
- Click **"Choose..."** button
- Navigate to: `C:\Users\mukta\OneDrive\Desktop\Elif website`
- Click **"Select Folder"**
- If it says "not a git repository", click **"create a repository"**

### 4.2 Create the repository
- **Name:** `elif-college-website`
- **Description:** `Elif College School Management System`
- **Git Ignore:** Leave as "None"
- **License:** Leave as "None"
- Click **"Create Repository"**

### 4.3 Publish to GitHub
- Click the **"Publish repository"** button (top right)
- **Uncheck** "Keep this code private" if you want it public (or keep checked for private)
- Click **"Publish Repository"**
- Wait for upload to complete (may take 2-5 minutes)
- **✅ CHECKPOINT:** Your code is now on GitHub!

---

## 🎯 **STEP 5: CREATE RAILWAY ACCOUNT**

### 5.1 Go to Railway
- Open a new tab
- Go to: **https://railway.app**
- Click **"Login"** or **"Start a New Project"**

### 5.2 Sign up with GitHub
- Click **"Login with GitHub"**
- Click **"Authorize Railway"**
- **✅ CHECKPOINT:** You're now logged into Railway

---

## 🎯 **STEP 6: CREATE MYSQL DATABASE**

### 6.1 Create new project
- Click **"New Project"** button
- Select **"Provision MySQL"**
- Wait a few seconds for database to be created

### 6.2 Get database credentials
- Click on the **MySQL** service card
- Click the **"Variables"** tab
- You'll see these variables (KEEP THIS TAB OPEN):
  - `MYSQLHOST` (looks like: `containers-us-west-123.railway.app`)
  - `MYSQLUSER` (looks like: `root`)
  - `MYSQLPASSWORD` (looks like: `a1b2c3d4e5f6`)
  - `MYSQLDATABASE` (looks like: `railway`)
  - `MYSQLPORT` (looks like: `6543`)
- **✅ CHECKPOINT:** You can see these 5 values

---

## 🎯 **STEP 7: DEPLOY YOUR APPLICATION**

### 7.1 Add your app to Railway
- In Railway, click **"New"** button in your project
- Select **"GitHub Repo"**
- Click **"Configure GitHub App"**
- Select **"Only select repositories"**
- Choose **"elif-college-website"**
- Click **"Install & Authorize"**

### 7.2 Select your repository
- Back in Railway, you'll see your repository
- Click on **"elif-college-website"**
- Wait for Railway to detect it (about 10 seconds)

### 7.3 Configure the service
- Click on the **service card** that appears
- Click **"Settings"** tab
- Scroll down to **"Root Directory"**
- Type: `Backend`
- Click **"Deploy"** if it asks

### 7.4 Add environment variables
- Click the **"Variables"** tab
- Click **"+ New Variable"** for each of these:

**Add these variables ONE BY ONE:**

1. **DB_HOST**
   - Click "+ New Variable"
   - Variable name: `DB_HOST`
   - Value: Copy the `MYSQLHOST` value from your MySQL service
   - Click "Add"

2. **DB_USER**
   - Variable name: `DB_USER`
   - Value: Copy the `MYSQLUSER` value from your MySQL service
   - Click "Add"

3. **DB_PASSWORD**
   - Variable name: `DB_PASSWORD`
   - Value: Copy the `MYSQLPASSWORD` value from your MySQL service
   - Click "Add"

4. **DB_NAME**
   - Variable name: `DB_NAME`
   - Value: Copy the `MYSQLDATABASE` value from your MySQL service
   - Click "Add"

5. **DB_PORT**
   - Variable name: `DB_PORT`
   - Value: Copy the `MYSQLPORT` value from your MySQL service
   - Click "Add"

6. **JWT_SECRET**
   - Variable name: `JWT_SECRET`
   - Value: `elif-college-super-secret-jwt-key-2024-change-this`
   - Click "Add"

7. **EMAIL_USER**
   - Variable name: `EMAIL_USER`
   - Value: `Ayoubadamupdy@gmail.com` (or your email)
   - Click "Add"

8. **EMAIL_PASS**
   - Variable name: `EMAIL_PASS`
   - Value: `cucpmsqqjgiguduj` (or your Gmail App Password)
   - Click "Add"

9. **NODE_ENV**
   - Variable name: `NODE_ENV`
   - Value: `production`
   - Click "Add"

### 7.5 Wait for deployment
- Railway will automatically rebuild and deploy
- Watch the **"Deployments"** tab - you'll see logs scrolling
- Wait for "✓ Success" message (usually 2-5 minutes)
- **✅ CHECKPOINT:** Deployment shows "Success"

---

## 🎯 **STEP 8: GET YOUR WEBSITE URL**

### 8.1 Generate public URL
- Click on your **service card** (your app, not MySQL)
- Click **"Settings"** tab
- Scroll to **"Networking"** section
- Click **"Generate Domain"**
- You'll get a URL like: `your-app-name.up.railway.app`

### 8.2 Test your website
- Click on the generated URL
- Your website should open!
- Try: `https://your-app-name.up.railway.app/HTML/admin-login.html`

### 8.3 Create admin user
- You'll need to create an admin user
- Use the Railway MySQL console or run the create-admin script

**✅ CHECKPOINT:** Your website is live on the internet!

---

## 🎯 **STEP 9: CREATE ADMIN USER ON PRODUCTION**

### Option A: Using Railway Console
1. Go to your Railway MySQL service
2. Click "Data" tab
3. Click "Query" tab
4. Run this SQL:
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@elifcollege.com', '$2b$10$passwordhash', 'Admin');
```

### Option B: Use the web interface
1. Go to: `https://your-app-name.up.railway.app/HTML/admin-register.html`
2. Fill in the form
3. Create your first admin

---

## 🎯 **STEP 10: ADD CUSTOM DOMAIN (OPTIONAL)**

### 10.1 Buy a domain
- Go to Namecheap, GoDaddy, or Cloudflare
- Buy a domain (e.g., `elifcollege.com`)
- Cost: $10-15/year

### 10.2 Add domain to Railway
- In Railway service settings
- Scroll to "Networking"
- Click "Custom Domain"
- Enter your domain: `elifcollege.com`
- Railway will show you DNS settings

### 10.3 Update DNS
- Go to your domain registrar
- Add these DNS records:
  - **Type:** CNAME
  - **Name:** www
  - **Value:** (the value Railway shows you)
- Wait 5-60 minutes for DNS to propagate

**✅ CHECKPOINT:** Your site is accessible at your custom domain!

---

## 🎉 **YOU'RE DONE!**

Your Elif College website is now:
- ✅ Live on the internet
- ✅ Secured with HTTPS
- ✅ Running with MySQL database
- ✅ Protected with security features
- ✅ Backed up automatically

**Your live website:** `https://your-app-name.up.railway.app`
**Admin login:** `https://your-app-name.up.railway.app/HTML/admin-login.html`

---

## 🆘 **TROUBLESHOOTING**

### Problem: "Application Error" on Railway
**Solution:** 
- Check "Deployments" tab for error logs
- Make sure all environment variables are set correctly
- Restart the service

### Problem: "Database connection failed"
**Solution:**
- Verify DB_HOST, DB_USER, DB_PASSWORD match MySQL service variables
- Make sure MySQL service is running

### Problem: Can't login
**Solution:**
- Create admin user using Railway MySQL console
- Or use the admin-register.html page

---

## 📞 **NEED HELP?**
If you get stuck at any step, take a screenshot and ask for help!
