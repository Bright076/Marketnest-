# Authentication Flow Diagram

## Current Signup Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER FILLS SIGNUP FORM                    │
│  • Full Name: "John Doe"                                    │
│  • Phone: "+234 800 000 0000"                               │
│  • Email: "john@example.com"                                │
│  • Password: "******"                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE AUTH SIGNUP REQUEST                    │
│  supabase.auth.signUp({                                     │
│    email: "john@example.com",                               │
│    password: "******",                                      │
│    options: {                                               │
│      data: {                                                │
│        full_name: "John Doe",                               │
│        phone: "+234 800 000 0000"                           │
│      }                                                      │
│    }                                                        │
│  })                                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  EMAIL CONFIRMATION?  │
                └───────────────────────┘
                    ↓               ↓
            DISABLED            ENABLED
                ↓                   ↓
    ┌──────────────────┐   ┌──────────────────┐
    │ ✅ Session Created│   │ ⏳ Pending Email │
    │ Metadata Saved   │   │ No Session Yet   │
    │ Redirect to      │   │ Metadata May Not │
    │ Dashboard        │   │ Persist          │
    └──────────────────┘   └──────────────────┘
            ↓                       ↓
    ┌──────────────────┐   ┌──────────────────┐
    │ DASHBOARD LOADS  │   │ USER MUST CONFIRM│
    │ Shows:           │   │ EMAIL FIRST      │
    │ • Name ✅        │   │ Then Login       │
    │ • Phone ✅       │   │ Manually         │
    │ • Email ✅       │   └──────────────────┘
    └──────────────────┘
```

## Dashboard Data Loading

```
┌─────────────────────────────────────────────────────────────┐
│                   DASHBOARD PAGE LOADS                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              CHECK AUTHENTICATION STATUS                     │
│  const { data: { session } } =                              │
│    await supabase.auth.getSession()                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │   SESSION EXISTS?     │
                └───────────────────────┘
                    ↓               ↓
                  YES              NO
                    ↓               ↓
    ┌──────────────────────┐   ┌──────────────────┐
    │ GET USER DATA        │   │ REDIRECT TO      │
    │ supabase.auth        │   │ /login           │
    │   .getUser()         │   └──────────────────┘
    └──────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│                    USER OBJECT STRUCTURE                     │
│  {                                                          │
│    id: "uuid",                                              │
│    email: "john@example.com",                               │
│    user_metadata: {                                         │
│      full_name: "John Doe",        ← THIS IS WHAT WE NEED  │
│      phone: "+234 800 000 0000"    ← THIS IS WHAT WE NEED  │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│                  DISPLAY ON DASHBOARD                        │
│  • Full Name: user.user_metadata.full_name                  │
│  • Phone: user.user_metadata.phone                          │
│  • Email: user.email                                        │
└─────────────────────────────────────────────────────────────┘
```

## Problem Scenarios

### Scenario 1: Email Confirmation Enabled ❌
```
Signup → No Session → Metadata Not Saved → Dashboard Shows "N/A"
```

### Scenario 2: Wrong API Key ❌
```
Signup → API Error → No User Created → Dashboard Redirect to Login
```

### Scenario 3: Correct Setup ✅
```
Signup → Session Created → Metadata Saved → Dashboard Shows Data
```

## The Fix

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DASHBOARD                        │
│                                                             │
│  1. Authentication → Providers → Email                      │
│     • Disable "Confirm email" ✅                            │
│                                                             │
│  2. Settings → API                                          │
│     • Copy correct "anon public" key ✅                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    UPDATE .env.local                         │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...correct_key            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  RESTART DEV SERVER                          │
│  Ctrl+C → npm run dev                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    TEST SIGNUP                               │
│  /signup → Create Account → Dashboard Shows Data ✅          │
└─────────────────────────────────────────────────────────────┘
```

## Debug Flow

```
┌─────────────────────────────────────────────────────────────┐
│              OPEN BROWSER CONSOLE (F12)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  GO TO DASHBOARD                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              LOOK FOR DEBUG LOGS                             │
│  === USER DEBUG INFO ===                                    │
│  User metadata: { full_name: "...", phone: "..." }          │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  METADATA PRESENT?    │
                └───────────────────────┘
                    ↓               ↓
                  YES              NO
                    ↓               ↓
        ┌──────────────────┐   ┌──────────────────┐
        │ ✅ WORKING!      │   │ ❌ CHECK:        │
        │ Data displays    │   │ • Email confirm  │
        │ correctly        │   │ • API key        │
        └──────────────────┘   │ • Supabase logs  │
                               └──────────────────┘
```

## Test Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│              GO TO /test-auth PAGE                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              CLICK "TEST SIGNUP" BUTTON                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              VIEW JSON RESPONSE                              │
│  {                                                          │
│    "success": true,                                         │
│    "user": {                                                │
│      "user_metadata": {                                     │
│        "full_name": "Test User",                            │
│        "phone": "+234 800 000 0000"                         │
│      }                                                      │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  METADATA VISIBLE?    │
                └───────────────────────┘
                    ↓               ↓
                  YES              NO
                    ↓               ↓
        ┌──────────────────┐   ┌──────────────────┐
        │ ✅ SETUP CORRECT │   │ ❌ FIX NEEDED    │
        │ Try real signup  │   │ Check Supabase   │
        └──────────────────┘   │ settings         │
                               └──────────────────┘
```

## Summary

**The Issue:** Configuration, not code
**The Fix:** 2 steps in Supabase dashboard
**The Test:** Use /test-auth page
**The Result:** Name and phone display correctly ✅
