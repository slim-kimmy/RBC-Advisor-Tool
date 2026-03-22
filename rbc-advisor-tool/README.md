# RBC Advisor Workspace — Email Composer Tool

A mock CRM tool for RBC financial advisors to compose and send personalized client emails using AI.

---

## Features

- **Client List View** — Browse mock client records in a Salesforce-style table
- **Client Detail View** — Full financial profile, portfolio overview, and advisor notes
- **Email Composer** — Prompt-based email generation using Anthropic Claude
- **Enhance with Insights** — A second AI pass that weaves financial data into a personalized, client-friendly email
- **Download Email** — Save as `.txt` file
- **Send Email** — Simulated send with browser alert confirmation

---

## Prerequisites

Make sure you have the following installed on Windows:

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - After install, open a new Command Prompt and verify:
     ```
     node --version
     npm --version
     ```

2. **An Anthropic API Key**
   - Sign up at: https://console.anthropic.com/
   - Go to API Keys → Create Key
   - Copy the key (starts with `sk-ant-...`)

---

## Setup Instructions (Windows)

### Step 1 — Open Command Prompt or PowerShell

Press `Win + R`, type `cmd`, press Enter. Or search for "PowerShell" in the Start menu.

### Step 2 — Navigate to the project folder

```cmd
cd path\to\rbc-advisor-tool
```

For example, if you extracted the project to your Desktop:
```cmd
cd C:\Users\YourName\Desktop\rbc-advisor-tool
```

### Step 3 — Install the React frontend dependencies

```cmd
npm install
```

This will take 1–3 minutes. You'll see a `node_modules` folder appear.

### Step 4 — Set up the backend server

The backend is a small Node.js server that handles the Anthropic API calls (this keeps your API key off the browser).

Open a **second** Command Prompt window. Navigate to the same project folder, then:

```cmd
npm install express cors @anthropic-ai/sdk
```

### Step 5 — Set your Anthropic API key

**In Windows Command Prompt:**
```cmd
set ANTHROPIC_API_KEY=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
```

**In Windows PowerShell:**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

> Important: You must set this in the same window you'll use to start the server (Step 7).

### Step 6 — Start the backend server

In the second Command Prompt window (where you set the API key):

```cmd
node server.js
```

You should see:
```
RBC Advisor API server running on port 3001
```

Keep this window open.

### Step 7 — Start the React frontend

In your first Command Prompt window:

```cmd
npm start
```

This will open http://localhost:3000 in your browser automatically.

---

## How to Use

1. **Browse Clients** — The home screen shows your client list. Click any row to open a client.
2. **View Client Profile** — Review the full CRM profile, portfolio, and advisor notes.
3. **Compose Email** — Click the "Compose Email" button.
4. **Enter a Prompt** — Type something like:
   - `"I want to send Herschel a Christmas email"`
   - `"Send a portfolio review follow-up"`
   - `"Write a birthday note"`
5. **Click "Generate Email"** — Claude writes a warm, professional email using basic client fields.
6. **Click "Enhance with Client Insights"** (optional) — Claude re-analyzes the financial profile and produces a more personalized version with subtle product recommendations woven in naturally.
7. **Review & Edit** — The subject line and body are both editable.
8. **Send or Download** — "Send Email" triggers a confirmation alert. "Download" saves a `.txt` file.

---

## Project Structure

```
rbc-advisor-tool/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── clients.ts        # Mock client data
│   ├── App.tsx               # Main CRM UI
│   ├── App.css               # Styles
│   ├── index.tsx             # Entry point
│   └── index.css             # Global styles & CSS vars
├── server.js                 # Express backend (Anthropic API)
├── package.json              # Frontend dependencies
├── server-package.json       # Reference for server deps
└── tsconfig.json
```

---

## Troubleshooting

**"Cannot find module" or npm errors**
- Make sure you ran `npm install` in the project root
- Make sure you ran `npm install express cors @anthropic-ai/sdk` for the server

**"Failed to generate email. Is the server running?"**
- Check that the `node server.js` window is still open and shows port 3001
- Make sure `ANTHROPIC_API_KEY` was set in the same window before running the server

**Port 3000 or 3001 already in use**
- Kill the conflicting process or use: `set PORT=3002` before `npm start`

**API Key errors from Anthropic**
- Double check your key at https://console.anthropic.com/
- Make sure billing is set up on the Anthropic account

---

## Notes

- This is a **prototype/demo** — no data is stored, no real emails are sent.
- The "Send" button triggers a browser `alert()` to simulate the action.
- Client data (Herschel Walker, Miriam Goldstein) is entirely fictional.
- The tool uses `claude-opus-4-5` via the Anthropic SDK.
