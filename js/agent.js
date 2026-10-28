/**
 * AI Delivery Agent ("BiteBot / Aero")
 * Intelligent delivery assistant that tracks order status, driver telemetry,
 * answers customer questions, handles delivery updates, and speaks back.
 */

class DeliveryAIAgent {
  constructor(app) {
    this.app = app;
    this.name = 'BiteBot';
    this.title = 'AI Delivery Dispatcher';
    this.voiceEnabled = true;
    this.isListening = false;
    this.synth = window.speechSynthesis || null;
    this.recognition = null;
    this.messages = [];
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.app.updateMicState(true);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.app.sendChatMessage(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.app.updateMicState(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.app.updateMicState(false);
      };
    }
  }

  toggleVoiceInput() {
    if (!this.recognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  }

  speak(text) {
    if (!this.voiceEnabled || !this.synth) return;
    try {
      this.synth.cancel(); // Stop any pending utterance
      // Strip markdown/html tags for clean voice output
      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/[\*\_#`]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .slice(0, 220); // Keep speech concise

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      // Try to choose an English natural voice
      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en')) && !v.name.includes('Bad'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }

  /**
   * Main processing entry point for user chat input
   */
  async processQuery(userInput) {
    const rawInput = userInput.trim();
    if (!rawInput) return;

    const lower = rawInput.toLowerCase();
    const order = this.app.currentOrder;

    // Simulate AI thinking delay for realism
    await new Promise(r => setTimeout(r, 450));

    // Handle when there is no active order
    if (!order) {
      return {
        text: `You don't have an active food delivery order right now! You can explore our menu, add your favorite dishes to the cart, and checkout to see my live real-time tracking in action.`,
        quickReplies: ['Browse Popular Dishes 🍕', 'Show Italian Restaurants 🍝', 'Check Burger Deals 🍔']
      };
    }

    // 1. Where is my food / Status / Tracking
    if (
      lower.includes('where is my food') ||
      lower.includes('where is my order') ||
      lower.includes('status') ||
      lower.includes('track') ||
      lower.includes('where is it') ||
      lower.includes('location')
    ) {
      return this.handleStatusQuery(order);
    }

    // 2. ETA / When will it arrive / How long
    if (
      lower.includes('eta') ||
      lower.includes('when will it arrive') ||
      lower.includes('how long') ||
      lower.includes('time') ||
      lower.includes('when arrive') ||
      lower.includes('estimated')
    ) {
      return this.handleEtaQuery(order);
    }

    // 3. Driver / Courier information
    if (
      lower.includes('driver') ||
      lower.includes('courier') ||
      lower.includes('who is delivering') ||
      lower.includes('alex') ||
      lower.includes('rider') ||
      lower.includes('vehicle') ||
      lower.includes('contact driver') ||
      lower.includes('call driver')
    ) {
      return this.handleDriverQuery(order);
    }

    // 4. Food Temperature / Freshness / Insulation
    if (
      lower.includes('hot') ||
      lower.includes('cold') ||
      lower.includes('temperature') ||
      lower.includes('fresh') ||
      lower.includes('warm') ||
      lower.includes('spill') ||
      lower.includes('thermal')
    ) {
      return this.handleTemperatureQuery(order);
    }

    // 5. Order Contents / What did I order / Receipt
    if (
      lower.includes('what did i order') ||
      lower.includes('order details') ||
      lower.includes('receipt') ||
      lower.includes('items') ||
      lower.includes('bill') ||
      lower.includes('summary')
    ) {
      return this.handleSummaryQuery(order);
    }

    // 6. Delivery Instructions / Gate code / Notes update
    if (
      lower.includes('gate code') ||
      lower.includes('instruction') ||
      lower.includes('leave at door') ||
      lower.includes('porch') ||
      lower.includes('ring bell') ||
      lower.includes('doorstep') ||
      lower.includes('change note')
    ) {
      return this.handleInstructionsUpdate(order, rawInput);
    }

    // 7. Fast-forward / Advance stage simulation
    if (
      lower.includes('next stage') ||
      lower.includes('speed up') ||
      lower.includes('fast forward') ||
      lower.includes('simulate') ||
      lower.includes('advance') ||
      lower.includes('arrive') ||
      lower.includes('deliver')
    ) {
      return this.handleAdvanceSimulation(order);
    }

    // 8. Delays / Complaints / Compensation
    if (
      lower.includes('late') ||
      lower.includes('delay') ||
      lower.includes('taking long') ||
      lower.includes('slow') ||
      lower.includes('hurry') ||
      lower.includes('complaint')
    ) {
      return this.handleDelayQuery(order);
    }

    // 9. Cancel Order
    if (lower.includes('cancel')) {
      return this.handleCancelQuery(order);
    }

    // 10. Recommendations / Menu questions
    if (
      lower.includes('recommend') ||
      lower.includes('craving') ||
      lower.includes('eat') ||
      lower.includes('menu') ||
      lower.includes('pizza') ||
      lower.includes('burger') ||
      lower.includes('sushi')
    ) {
      return this.handleRecommendationQuery(lower);
    }

    // 11. Greeting / Pleasantries
    if (
      lower.startsWith('hi') ||
      lower.startsWith('hello') ||
      lower.startsWith('hey') ||
      lower.includes('who are you')
    ) {
      return {
        text: `Hey there! I am **${this.name}**, your dedicated AI Delivery Agent. I am monitoring your active order **#${order.id}** from **${order.restaurantName}** in real time. How can I help you today?`,
        quickReplies: ['Where is my food? 📍', 'Check exact ETA ⏱️', 'Driver details 🛵', 'Is my food hot? ♨️']
      };
    }

    // Default Fallback with intelligent context
    const stageObj = DELIVERY_STAGES[order.stageIndex] || { label: order.status };
    return {
      text: `I'm monitoring order **#${order.id}** from **${order.restaurantName}**. Currently, it is **${stageObj.label}** with approximately **${order.etaMinutes} minutes** remaining.\n\nYou can ask me things like *"Where is my food?"*, *"When will it arrive?"*, *"Show driver details"*, *"Check food temperature"*, or tell me to *"Leave it at the door"*.`,
      quickReplies: ['Where is my food? 📍', 'When will it arrive? ⏱️', 'Driver Details 🛵', 'Leave at door 🚪']
    };
  }

  handleStatusQuery(order) {
    const stage = DELIVERY_STAGES[order.stageIndex];
    let locationText = '';

    if (order.status === 'placed') {
      locationText = `Your order was received by **${order.restaurantName}** and is being queued for preparation.`;
    } else if (order.status === 'preparing') {
      locationText = `Chefs at **${order.restaurantName}** are actively preparing your dishes. The stone oven is hot and fresh!`;
    } else if (order.status === 'driver_assigned') {
      locationText = `Courier **${order.courier.name}** has accepted the delivery and is on their way to pick up your order from the restaurant.`;
    } else if (order.status === 'picked_up') {
      locationText = `Courier **${order.courier.name}** just secured your order in an insulated thermal pouch and is starting the trip!`;
    } else if (order.status === 'on_the_way') {
      locationText = `Courier **${order.courier.name}** is currently on the road on a **${order.courier.vehicle}**, approximately **${order.distanceRemainingKm} km** away from your address at **${order.deliveryAddress}**. Current speed: ~${order.courier.currentSpeed}.`;
    } else if (order.status === 'arrived') {
      locationText = `Ding dong! **${order.courier.name}** has just arrived outside your building at **${order.deliveryAddress}**!`;
    } else if (order.status === 'delivered') {
      locationText = `Your order was safely delivered to **${order.deliveryAddress}**. Enjoy your meal!`;
    }

    return {
      text: `📍 **Live Delivery Status for Order #${order.id}**:\n\n**Current Milestone:** ${stage.label}\n${locationText}\n\n⏱️ **ETA:** ~${order.etaMinutes} minutes\n🛵 **Courier:** ${order.courier.name} (${order.courier.rating} ★)`,
      cardType: 'status_card',
      quickReplies: ['Check ETA ⏱️', 'Driver info 🛵', 'Thermal temperature ♨️', 'Update instructions 📝']
    };
  }

  handleEtaQuery(order) {
    if (order.status === 'delivered') {
      return {
        text: `Your order **#${order.id}** has already arrived and was marked as **Delivered**! Bon Appétit!`,
        quickReplies: ['Rate Order ⭐', 'Order Summary 🧾', 'Browse Again 🍕']
      };
    }
    if (order.status === 'arrived') {
      return {
        text: `The driver is right outside now! Estimated time: **0 minutes** (At your door). Please be ready to collect.`,
        quickReplies: ['View Driver 🛵', 'Leave at door 🚪', 'I got it! ✅']
      };
    }

    let breakdown = '';
    if (order.status === 'preparing') {
      breakdown = `Food prep: ~${Math.max(1, order.etaMinutes - 8)} mins | Transit: ~8 mins`;
    } else {
      breakdown = `Distance: ${order.distanceRemainingKm} km | Moderate city traffic flow`;
    }

    return {
      text: `⏱️ **Estimated Arrival Time**: **${order.etaMinutes} minutes**\n\n${breakdown}\nWe're predicting arrival around **${new Date(Date.now() + order.etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}**.\n\nI will proactively notify you the moment your courier is 2 minutes away!`,
      quickReplies: ['Where is driver now? 🛵', 'Notify me at door 🔔', 'Simulate Next Stage ⏩']
    };
  }

  handleDriverQuery(order) {
    const c = order.courier;
    return {
      text: `🛵 **Courier Profile & Dispatch Details**:\n\n• **Name:** ${c.name}\n• **Customer Rating:** ${c.rating} ★ (${c.trips})\n• **Vehicle:** ${c.vehicle} (Plate: \`${c.plate}\`)\n• **Contact Phone:** ${c.phone}\n• **Insulation:** ${c.thermalBagTemperature}\n\nWould you like me to send an automated delivery note to ${c.name.split(' ')[0]}?`,
      cardType: 'courier_card',
      quickReplies: ['Leave at front door 🚪', 'Call Courier 📞', 'Add Gate Code 🔢']
    };
  }

  handleTemperatureQuery(order) {
    return {
      text: `♨️ **Thermal & Food Quality Monitor**:\n\n• **Bag Temperature Sensor:** ${order.courier.thermalBagTemperature}\n• **Container Seal:** Tamper-evident thermal seal verified\n• **Estimated Drop:** Less than 2°C during remaining transit\n\nRest assured, your pizza and pasta are staying piping hot and fresh!`,
      quickReplies: ['When will it arrive? ⏱️', 'Where is driver? 📍']
    };
  }

  handleSummaryQuery(order) {
    const itemsList = order.items.map(item => `• **${item.quantity}x ${item.name}** - $${(item.price * item.quantity).toFixed(2)} (${item.options || 'Standard'})`).join('\n');
    return {
      text: `🧾 **Order Breakdown #${order.id}** from **${order.restaurantName}**:\n\n${itemsList}\n\n────────────────\n**Subtotal:** $${order.subtotal.toFixed(2)}\n**Delivery Fee:** $${order.deliveryFee.toFixed(2)}\n**Taxes & Fees:** $${order.tax.toFixed(2)}\n**Driver Tip:** $${order.tip.toFixed(2)}\n**Total Paid:** **$${order.total.toFixed(2)}**\n\n📍 Delivering to: *${order.deliveryAddress}*`,
      quickReplies: ['Where is my food? 📍', 'When will it arrive? ⏱️']
    };
  }

  handleInstructionsUpdate(order, rawInput) {
    let updatedNote = '';
    if (rawInput.toLowerCase().includes('gate code')) {
      const match = rawInput.match(/\b\d{3,5}\b/);
      const code = match ? match[0] : '4092';
      order.gateCode = '#' + code;
      updatedNote = `Gate Code updated to **#${code}**.`;
    } else {
      updatedNote = `Delivery note updated to: "*${rawInput}*"`;
      order.specialInstructions = rawInput;
    }

    this.app.saveOrderState();

    return {
      text: `✅ **Delivery Instructions Synced**!\n\n${updatedNote}\n\nI've transmitted this high-priority update directly to courier **${order.courier.name}**'s navigation screen.`,
      quickReplies: ['Where is my food? 📍', 'Check ETA ⏱️']
    };
  }

  handleAdvanceSimulation(order) {
    const nextIndex = Math.min(DELIVERY_STAGES.length - 1, order.stageIndex + 1);
    this.app.setOrderStage(nextIndex);
    const stage = DELIVERY_STAGES[nextIndex];

    return {
      text: `⏩ **Fast-forwarded Simulation!**\n\nOrder #${order.id} is now in stage: **${stage.label}** (${stage.subtext}).\n\nWatch the live map and progress bar update!`,
      quickReplies: ['Where is my food? 📍', 'Driver status 🛵', 'Fast-forward again ⏩']
    };
  }

  handleDelayQuery(order) {
    return {
      text: `I completely understand your eagerness! ⏱️\n\nOur smart telemetry shows that **${order.courier.name}** is maintaining a safe pace of **${order.courier.currentSpeed}** and is currently **${order.distanceRemainingKm} km** away. All traffic lights on Market St are factoring into the ~**${order.etaMinutes} mins** ETA.\n\nIf the order takes longer than expected, our AI guarantee automatically credits you **$5 in delivery credits**!`,
      quickReplies: ['Live driver location 📍', 'Simulate Arrival ⏩']
    };
  }

  handleCancelQuery(order) {
    if (order.stageIndex >= 3) {
      return {
        text: `⚠️ **Order #${order.id}** is already in transit with courier **${order.courier.name}**, so automated cancellation is locked to avoid food waste.\n\nHowever, if there is a severe problem or incorrect address, I can connect you to our 24/7 Human Dispatch Support instantly!`,
        quickReplies: ['Update Delivery Address 📍', 'Where is my food? 🛵', 'Connect to Support 💬']
      };
    } else {
      return {
        text: `Your order is currently being prepared at the restaurant. If you wish to cancel, please confirm within 60 seconds.`,
        quickReplies: ['Keep my order 🍕', 'Cancel & Refund ❌']
      };
    }
  }

  handleRecommendationQuery(lower) {
    if (lower.includes('pizza') || lower.includes('italian')) {
      return {
        text: `🍕 For Italian, you can't beat **Trattoria Bella Napoli**! Try their *Margherita DOP Woodfired Pizza* ($16.50) or the *Truffle Fettuccine Alfredo* ($19.00). Freshly rolled dough and 24-month aged Parmigiano!`,
        quickReplies: ['Add Margherita to Cart 🛒', 'View Menu 📋']
      };
    } else if (lower.includes('burger')) {
      return {
        text: `🍔 If you're craving burgers, check out **Artisan Burger Co.**! Their *The Truffle Double Smash Burger* ($15.99) with gouda and caramelized onions is rated 4.9 stars by over 900 foodies!`,
        quickReplies: ['Add Truffle Burger 🛒', 'Check Deals 🔥']
      };
    } else if (lower.includes('sushi') || lower.includes('healthy')) {
      return {
        text: `🍣 For clean, wholesome flavors, **Sakura Blossom Sushi Bar** offers the *Dragon Roll Supreme* ($18.50) and *Tonkotsu Ramen* ($17.00). Or try **Green Oasis** for superfood quinoa bowls!`,
        quickReplies: ['Explore Sushi 🍣', 'Healthy Bowls 🥗']
      };
    } else {
      return {
        text: `😋 What are you in the mood for? Here are our top-rated categories right now:\n\n• **Gourmet Burgers** at Artisan Burger Co.\n• **Woodfired Neapolitan Pizza** at Trattoria Bella Napoli\n• **Artisanal Sushi & Ramen** at Sakura Blossom\n• **Authentic Birria Tacos** at El Fuego\n• **Organic Superfood Bowls** at Green Oasis`,
        quickReplies: ['Italian Pizza 🍕', 'Smash Burgers 🍔', 'Japanese Sushi 🍣', 'Street Tacos 🌮']
      };
    }
  }

  /**
   * Generates proactive notifications when status changes
   */
  generateProactiveNotice(stageIndex, order) {
    const stage = DELIVERY_STAGES[stageIndex];
    let message = '';
    let voiceText = '';

    switch (stage.id) {
      case 'placed':
        message = `🎉 **Order #${order.id} Confirmed!**\nWe've sent your ticket to **${order.restaurantName}**. I will keep you updated step-by-step.`;
        voiceText = `Order confirmed! We've sent your order to ${order.restaurantName}.`;
        break;
      case 'preparing':
        message = `🔥 **Cooking in Progress!**\nThe kitchen at **${order.restaurantName}** has started preparing your fresh dishes.`;
        voiceText = `The kitchen has started preparing your food.`;
        break;
      case 'driver_assigned':
        message = `🛵 **Courier Dispatched!**\n**${order.courier.name}** (${order.courier.rating}★) accepted your delivery and is en route to pick up.`;
        voiceText = `Courier ${order.courier.name} is on the way to pick up your order.`;
        break;
      case 'picked_up':
        message = `🛍️ **Order Picked Up!**\n**${order.courier.name}** has safely collected your food in an insulated thermal pouch.`;
        voiceText = `Your food has been picked up from the restaurant.`;
        break;
      case 'on_the_way':
        message = `🚀 **Out for Delivery!**\n**${order.courier.name}** is heading to your address. Estimated arrival in **${order.etaMinutes} minutes**!`;
        voiceText = `Your courier is on the way! ETA is approximately ${order.etaMinutes} minutes.`;
        break;
      case 'arrived':
        message = `🔔 **Courier Arrived!**\n**${order.courier.name}** has reached **${order.deliveryAddress}**. Please prepare to receive your order!`;
        voiceText = `Ding dong! Your courier has arrived at your address.`;
        break;
      case 'delivered':
        message = `✅ **Delivered!**\nOrder #${order.id} was delivered successfully. Enjoy your delicious meal!`;
        voiceText = `Your order has been delivered! Enjoy your meal.`;
        break;
    }

    return { message, voiceText };
  }
}

window.DeliveryAIAgent = DeliveryAIAgent;
