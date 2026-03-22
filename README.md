# PakNikahPoint (PNP) — Professional Matchmaking System
## Complete Installation & Setup Guide

---

```
بسم الله الرحمن الرحيم
```

---

## 📁 Folder Structure

```
PakNikahPoint/
├── index.html              ← Main Dashboard (start here)
├── css/
│   └── main.css            ← All styles
├── js/
│   ├── db.js               ← Database layer (localStorage + GAS sync)
│   ├── app.js              ← Core utilities & shared functions
│   └── dashboard.js        ← Dashboard logic
├── pages/
│   ├── register-boy.html   ← Boy registration form
│   ├── register-girl.html  ← Girl registration form
│   ├── profiles.html       ← All profiles grid view
│   ├── matching.html       ← Smart matching engine
│   ├── search.html         ← Advanced search filters
│   ├── admin.html          ← Admin panel + data management
│   └── gallery.html        ← Photo gallery
├── gas/
│   └── Code.gs             ← Google Apps Script (backend)
└── README.md               ← This file
```

---

## 🚀 Quick Start — Run Locally (No Server Needed)

1. **Download** the entire `PakNikahPoint` folder
2. **Open** `index.html` in any modern browser (Chrome, Firefox, Edge)
3. The system works **immediately** — no installation required
4. Sample data is auto-loaded on first launch
5. All data is saved in your **browser's localStorage**

> ✅ Works 100% offline — no internet required for core features

---

## ☁️ Connect Google Sheets (Optional — For Cloud Storage)

### Step 1: Create Google Apps Script

1. Open [https://script.google.com](https://script.google.com)
2. Click **New Project**
3. Name it: `PakNikahPoint`
4. Delete the default code
5. Copy the entire contents of `gas/Code.gs` and paste it
6. Click **Save** (Ctrl+S)

### Step 2: Run Initial Setup

1. In the toolbar, select function: `setup`
2. Click ▶ **Run**
3. Grant permissions when prompted
4. Check the **Logs** — you'll see: `PakNikahPoint setup complete`
5. This creates a Google Sheet named `PakNikahPoint Database` in your Drive

### Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙ > **Web app**
3. Set:
   - Description: `PakNikahPoint API`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/ABC.../exec`)

### Step 4: Configure in PNP Admin

1. Open PakNikahPoint → **Admin Panel** → **Settings & GAS** tab
2. Paste the Web App URL in the **GAS Web App URL** field
3. Click **Save GAS Config**
4. Click **Test Connection** — you should see "GAS connected!"
5. All new registrations will now automatically sync to Google Sheets

---

## 📊 Google Sheets Structure

The system creates these sheets in Google Drive:

| Sheet Name | Contents |
|---|---|
| `Boys_Profiles` | All boy registrations with 27 columns |
| `Girls_Profiles` | All girl registrations with 27 columns |
| `Saved_Matches` | Match history with scores |
| `Settings` | System configuration |

### Column Layout (Boys & Girls sheets):
```
PNP Code | Name | Age | City | Education | Religious Edu | Profession |
Marital Status | Caste | Residence | Height | Weight | Complexion |
Sect | Religion | Disability | Disease | Addiction |
Father Name | Father Prof | Mother Name | Contact |
Preferences | Additional Info | Photo URL | Status | Registered At
```

---

## 🌐 Deploy Online (Free Options)

### Option A: GitHub Pages
```bash
1. Create a GitHub account (free)
2. Create a new repository named: paknikahpoint
3. Upload all files from the PakNikahPoint folder
4. Go to Settings > Pages > Source: main branch
5. Your site will be at: https://yourusername.github.io/paknikahpoint
```

### Option B: Netlify (Drag & Drop)
```
1. Go to https://netlify.com
2. Drag the entire PakNikahPoint folder onto the Netlify dashboard
3. Your site is live in seconds at a .netlify.app URL
```

### Option C: Local Network (Office Use)
```bash
# Using Python (if installed)
cd PakNikahPoint
python -m http.server 8080
# Access at: http://localhost:8080
# Or from any office computer: http://YOUR-IP:8080
```

---

## 🔑 Features Guide

### PNP Codes
- Boys get: `L-001`, `L-002`, `L-003`… (L = Larka)
- Girls get: `G-001`, `G-002`, `G-003`… (G = Gargi)
- Auto-generated, never duplicated

### Smart Matching Engine (100-Point System)
| Criteria | Points | How Scored |
|---|---|---|
| City | 10 | Same city = 10 pts |
| Age Difference | 10 | ≤2 yrs = 10, ≤4 = 8, ≤6 = 6, ≤8 = 4, ≤10 = 2, >10 = 0 |
| Education | 10 | Same level = 10, 1 level diff = 7, 2 levels = 4 |
| Religious Education | 10 | Same = 10, Both have = 5 |
| Caste | 10 | Same = 10, Different = 4 |
| Sect | 10 | Same = 10, Different = 0 |
| Marital Status | 10 | Both single = 10, Same = 8 |
| Profession | 10 | Same = 10, Similar = 8 |
| Residence | 10 | Same type = 10 |
| Height | 10 | Boy 2-12 cm taller = 10 |

### Rishta Card
- Click any profile → "Rishta Card" button
- Opens a printable PDF-ready page
- Print directly from browser or Save as PDF
- Includes bureau contact info

### WhatsApp Integration
- Click "WhatsApp" on any profile card
- Auto-generates a professional message with all details
- Opens WhatsApp Web ready to send

### Export / Import
- Admin Panel → Export/Import tab
- Export as JSON (full backup)
- Export as CSV (for Excel/Sheets)
- Import from JSON backup

---

## 🔒 Data Privacy

- All data stored in browser localStorage (private, on your computer)
- Google Sheets sync is optional and controlled by you
- Photos stored as base64 in localStorage (or Google Drive if GAS connected)
- No data is sent anywhere without GAS URL configured

---

## 📱 Mobile Usage

The system is fully responsive. To use on mobile:
1. Host online (Netlify/GitHub Pages)
2. Open on any mobile browser
3. Add to Home Screen for app-like experience

---

## 🆘 Troubleshooting

| Problem | Solution |
|---|---|
| Data lost | Check if browser cache was cleared; use Export before clearing |
| GAS not connecting | Ensure Web App is deployed with "Anyone" access |
| Photos not saving | Photos saved as base64; large images may cause slowness |
| Urdu text not showing | Ensure internet connection (Google Fonts) |
| Print not working | Use Chrome for best PDF output |

---

## 📞 System Info

```
System:     PakNikahPoint (PNP)
Version:    2.0
Technology: HTML5 + CSS3 + Vanilla JavaScript + Google Apps Script
Database:   localStorage (offline) + Google Sheets (cloud sync)
License:    For use by licensed marriage bureaus only
```

---

*اللهم بارك لهم وبارك عليهم وجمع بينهما في خير*

**PakNikahPoint — Rishtay with Respect & Responsibility**
