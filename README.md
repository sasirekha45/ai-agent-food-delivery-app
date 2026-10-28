# 🍕 BiteAgent • AI-Powered Food Delivery Web Application

A full-stack interactive web application featuring an autonomous **AI Delivery Agent ("BiteBot")** that provides live delivery status telemetry, driver tracking, ETA forecasts, voice queries, and order management.

---

## 🌟 Key Features

### 1. 🤖 Dedicated AI Delivery Agent ("BiteBot")
- **Natural Language Understanding**: Understands queries about order milestones, courier location, delays, receipts, and menu recommendations.
- **Voice Speech Recognition & Voice Synthesis**: Speak your queries directly to the AI agent by tapping the microphone icon, and listen to the agent speak back answers out loud!
- **Dynamic Delivery Actions**:
  - Update gate codes and delivery instructions on the fly (*e.g., "Change gate code to 5021"* or *"Leave on porch"*).
  - Telemetry checks (*e.g., "Is my food hot?"* queries simulated thermal pouch sensors).
  - Fast-forward stages via chat (*e.g., "Simulate courier arrival"*).

### 2. 🗺️ Live GPS Courier Map (Leaflet.js)
- Real-time street route rendering between the restaurant, courier scooter, and customer residence.
- Animated pulsing courier beacon with live jitter and movement simulation.
- Live telemetry badge showing dynamic ETA countdown and distance in kilometers.

### 3. ⏱️ 7-Stage Delivery State Machine
The delivery progress tracks across 7 stages:
1. **Order Placed**: Ticket received and confirmed by restaurant.
2. **Kitchen Preparing**: Chefs cooking in woodfired ovens / pans.
3. **Courier Dispatched**: Courier accepted route and heading to restaurant.
4. **Order Picked Up**: Packed inside temperature-controlled thermal pouch.
5. **Out for Delivery**: Zooming towards customer with live GPS route.
6. **Arrived at Door**: Courier parked outside building.
7. **Delivered**: Safe handover with confirmation.

### 4. 🛒 Full Food Delivery Experience
- **Cuisine Filters**: Pizza, Gourmet Burgers, Asian Sushi, Street Tacos, Wellness Bowls.
- **Interactive Cart & Checkout**: Calculate subtotal, delivery fee, taxes, driver tip.
- **Instant Order Creation**: Placing a new order assigns a courier and boots a fresh live tracking session.
- **Audio Sound Effects**: Built-in Web Audio API chimes for status transitions, messages, and checkout.

---

## 🚀 How to Run

### Option 1: Instant Launch (No Server Needed)
Simply **double-click** `index.html` in file explorer or right-click and open with **Google Chrome**, **Microsoft Edge**, or any modern browser.

### Option 2: Python Local Server
Open your terminal in this project folder and run:
```bash
python server.py
```
This automatically starts a local server on `http://localhost:8000` and launches your default web browser!

---

## 🗣️ Sample Prompts to Try with BiteBot

Open the AI Agent drawer (click **"Ask BiteBot"** or the floating robot icon) and try asking:

1. *"Where is my food right now?"*
2. *"When will my order arrive?"*
3. *"Who is delivering my food?"*
4. *"Is my pizza staying hot?"*
5. *"Update my gate code to #5021"*
6. *"Tell the driver to leave the order on the porch"*
7. *"What did I order again?"*
8. *"Fast-forward to next stage"*
9. *"Recommend something Italian"*

---

## 📂 Project Structure

```
ai-agent fd app/
├── index.html          # Main HTML structure, layout, modals, and drawers
├── server.py           # Zero-dependency Python local HTTP server
├── README.md           # Documentation and usage guide
├── css/
│   └── styles.css      # Glassmorphism, animations, soundwave, and map styling
└── js/
    ├── data.js         # Restaurants, dishes, delivery stages, and demo orders
    ├── agent.js        # AI Delivery Agent brain, speech synthesis/recognition
    ├── map.js          # Leaflet GPS map route tracker & courier marker animation
    └── app.js          # Main controller: cart, checkout, audio, and state sync
```
