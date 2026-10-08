# 🎂 Naina's Birthday Surprise Website 🐧💗

A mobile-first, interactive static birthday surprise website made with love by **Nihal** for **Naina**.

---

## 🚀 Quick Start (Running Locally)

This is a 100% static frontend project with **zero dependencies** and **no build steps**.

To preview locally:
1. Simply double-click `index.html` in your file explorer, OR
2. Run any local static server:
   ```bash
   # Using Python:
   python -m http.server 8000

   # Or using Node:
   npx serve .
   ```
3. Open `http://localhost:8000` on your computer or phone!

---

## 📸 How to Add Your Photos & Cards

1. Save your photos or card designs into the folder:
   ```text
   assets/cards/
   ```
   Recommended formats: `.webp`, `.png`, or `.jpg`.

2. Name them sequentially:
   - `card-01.webp`
   - `card-02.webp`
   - `card-03.webp`
   - ...and so on.

3. Open `script.js` and edit the `CONFIG` object at the very top:
   ```javascript
   const CONFIG = {
     recipientName: "Naina",
     senderName: "Nihal",

     cards: [
       {
         src: "assets/cards/card-01.webp",
         caption: "To the sweetest person in my life ✨",
         note: "Your personal note here..."
       },
       // Add as many cards as you want!
     ],

     finalMessage: `Your custom birthday letter for Naina here 💕`
   };
   ```

*Note: If any card image is not yet added, the website automatically displays an adorable fallback message with the penguin and your sweet note, so nothing ever looks broken!*

---

## 🎨 Features & Flow

- 🐧 **Interactive Penguin Mascot:** Reacts to her choices with cute expressions (happy jumping, sad crying with streaming tears, playful recovery).
- 🎁 **Tactile Game-Like UI:** Chunky 3D buttons with touch feedback.
- 💖 **Playful "NO" Button:** Won't break the mood—crying penguin and "TAP HERE 🥺" brings her right back to the celebration.
- ✨ **Gift Box Unwrapping:** Shakes and pops open with celebratory pastel confetti.
- 📱 **Mobile Touch Swipe:** Seamless swipe-left and swipe-right support on iOS/Android.
- 💌 **Romantic Final Letter:** Beautiful stationery card with Nihal's personal birthday message and extra confetti shower!
- 🔊 **Offline Web Audio:** Kawaii chimes and pops using Web Audio API—no external audio files required.

---

## 🌐 Deploying to the Web

Since this is pure static HTML/CSS/JS, you can deploy it in 30 seconds for free to:
- **Vercel:** Drag and drop the folder at [vercel.com](https://vercel.com) or run `npx vercel`.
- **Netlify:** Drag and drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages:** Push to a GitHub repository and turn on Pages in Settings.
