# Grind System v1.0.0

A gamified, interactive progression system that treats personal development as an RPG. Designed with a sleek, dark-themed, sci-fi aesthetic (utilizing "Orbitron" and "Rajdhani" fonts).

## Overview

The Grind System is a web-based application utilizing HTML, CSS, and Vanilla JavaScript. It uses `localStorage` for persistent state management and features a strict routing system based on user choices.

## Application Flow & Mechanics

The system employs a narrative-driven onboarding process across three main stages:

### 1. Initialization (`index.html` & `system.js`)
When a user first loads the application, they are presented with a delayed, typewriter-style text message system:
- It informs them they have completed the requirements of a secret quest ("courage of the weak").
- The system then asks if they will accept the right to become a "player".
- **Options:** 
  - **Accept:** Sets `localStorage.status = 'accepted'` and routes to the Dashboard.
  - **Refuse:** Sets `localStorage.status = 'rejected'` and routes to the Rejected page.
- *UX Feature:* Messages appear sequentially with timeouts. A click event listener allows users to skip the waiting period and auto-advance the text.

### 2. Second Chance (`rejected.html` & `system.js`)
If a user refuses the initial offer, they are sent to `rejected.html`. 
- The system acknowledges their refusal but detects a "remnant of potential".
- It offers one final opportunity to accept.
- **Options:**
  - **Accept:** Updates status to `'accepted'` and grants access to the Dashboard.
  - **Refuse (Final):** Sets `localStorage.status = 'banned'` and permanently locks the user out.

### 3. Lockdown Mode (`router.js`)
The `router.js` acts as a strict gatekeeper checking the `localStorage.status` before any page loads:
- If `status === 'banned'`, it halts the website load (`window.stop()`) and completely overwrites the document with a permanent, red "[ SYSTEM LOCKED ] - ACCESS PERMANENTLY REVOKED" screen.
- It also ensures users cannot manually navigate back to the initialization screen once they have accepted or rejected, forcing them to the appropriate route.

### 4. The Dashboard (`dashboard.html` & `home.js`)
Once accepted, the user accesses the Dashboard.
- **XP System:** Tracks the user's Experience Points (XP) via `localStorage.xp`. 
- If no XP exists, it welcomes the user and initializes XP to 0.
- If XP exists, it loads the saved value and greets the user with "I commend your determination!".
- Users can currently click an "add xp +5" button to increment and instantly save their progression to local storage.

## Project Structure
- `index.html`, `dashboard.html`, `rejected.html`: Core views.
- `assets/css/`: Modular stylesheets (`theme.css`, `main.css`, `components.css`) that drive the premium, immersive UI.
- `assets/js/router.js`: Core navigation and security logic.
- `assets/js/modules/`: Component-specific JavaScript logic (`system.js` for the interactive onboarding flow, `home.js` for dashboard mechanics).
- `data/`: JSON files (`exercises.json`, `meals.json`, `systemMessages.json`) structured for future features.
