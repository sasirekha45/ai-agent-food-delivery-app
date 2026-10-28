/**
 * Main App Controller
 * Manages UI State, Food Browsing, Cart, Live Delivery Simulation, Audio, and AI Agent
 */

class FoodDeliveryApp {
  constructor() {
    this.restaurants = RESTAURANTS;
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.cart = [];
    this.currentOrder = null;
    this.orderHistory = [];
    
    // Modules
    this.agent = new DeliveryAIAgent(this);
    this.mapTracker = new DeliveryMapTracker('map-container');
    
    // Auto-advance timer for simulation
    this.simulationInterval = null;
    this.audioContext = null;

    this.init();
  }

  init() {
    // Load from storage or default
    this.loadState();

    // Render Initial UI
    this.renderCategories();
    this.renderRestaurants();
    this.renderActiveOrderBanner();
    this.updateCartCount();

    // Setup initial chat welcome message if empty
    if (!this.agent.messages || this.agent.messages.length === 0) {
      this.agent.messages = [
        {
          sender: 'agent',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `👋 Hi! I'm **BiteBot**, your real-time AI Delivery Assistant.\n\nI'm tracking order **#${this.currentOrder ? this.currentOrder.id : 'FD-8492'}** right now! Ask me *"Where is my food?"*, *"Check ETA"*, or *"Who is my driver?"*. You can also tap the mic icon to talk to me!`,
          quickReplies: ['Where is my food? 📍', 'When will it arrive? ⏱️', 'Driver info 🛵', 'Leave at door 🚪']
        }
      ];
    }
    this.renderChatMessages();

    // Setup Event Listeners
    this.bindEvents();

    // Initialize Map with current order
    if (this.currentOrder) {
      setTimeout(() => {
        this.mapTracker.init(this.currentOrder);
        this.mapTracker.startLiveSimulation();
      }, 500);
    }
  }

  loadState() {
    try {
      const savedOrder = localStorage.getItem('ai_fd_current_order');
      if (savedOrder) {
        this.currentOrder = JSON.parse(savedOrder);
      } else {
        this.currentOrder = JSON.parse(JSON.stringify(INITIAL_ORDER));
      }

      const savedCart = localStorage.getItem('ai_fd_cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    } catch (e) {
      this.currentOrder = JSON.parse(JSON.stringify(INITIAL_ORDER));
      this.cart = [];
    }
  }

  saveOrderState() {
    if (this.currentOrder) {
      localStorage.setItem('ai_fd_current_order', JSON.stringify(this.currentOrder));
    }
  }

  saveCartState() {
    localStorage.setItem('ai_fd_cart', JSON.stringify(this.cart));
  }

  // Web Audio Synthesizer for high-tech chimes without external mp3s
  playChime(type = 'ping') {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'ping') {
        // High soft chime for message
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'success') {
        // Upward melody
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'arrive') {
        // Doorbell double ding
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(523.25, now + 0.25); // C5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      // Audio not permitted yet before user interaction
    }
  }

  // ---------------- UI RENDERING ---------------- //

  renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categories = [
      { id: 'all', label: 'All Cuisines', icon: 'fa-utensils' },
      { id: 'Pizza', label: 'Pizza & Italian', icon: 'fa-pizza-slice' },
      { id: 'Burgers', label: 'Burgers & Fries', icon: 'fa-burger' },
      { id: 'Sushi', label: 'Sushi & Asian', icon: 'fa-fish' },
      { id: 'Mexican', label: 'Tacos & Bowls', icon: 'fa-pepper-hot' },
      { id: 'Healthy', label: 'Healthy & Vegan', icon: 'fa-leaf' }
    ];

    container.innerHTML = categories.map(cat => {
      const activeClass = this.selectedCategory === cat.id 
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
        : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200';

      return `
        <button onclick="app.setCategory('${cat.id}')" class="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeClass}">
          <i class="fa-solid ${cat.icon}"></i>
          <span>${cat.label}</span>
        </button>
      `;
    }).join('');
  }

  setCategory(catId) {
    this.selectedCategory = catId;
    this.renderCategories();
    this.renderRestaurants();
  }

  renderRestaurants() {
    const container = document.getElementById('restaurants-container');
    if (!container) return;

    let filtered = this.restaurants;

    // Filter category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.tags.some(t => t.toLowerCase().includes(this.selectedCategory.toLowerCase())));
    }

    // Filter search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisine.toLowerCase().includes(q) ||
        r.menu.some(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <i class="fa-solid fa-bowl-food text-4xl text-gray-300 mb-3"></i>
          <h3 class="text-lg font-bold text-gray-700">No restaurants or dishes found</h3>
          <p class="text-sm text-gray-500">Try adjusting your search terms or cuisine filters</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(rest => `
      <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover-lift flex flex-col">
        <!-- Restaurant Header Image -->
        <div class="relative h-48 overflow-hidden group">
          <img src="${rest.image}" alt="${rest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-full text-emerald-800 shadow">
            ${rest.badge}
          </span>
          <span class="absolute bottom-3 right-3 bg-gray-900/85 backdrop-blur-md text-xs text-white font-medium px-2.5 py-1 rounded-full">
            <i class="fa-solid fa-clock mr-1 text-emerald-400"></i>${rest.deliveryTime}
          </span>
        </div>

        <!-- Info Bar -->
        <div class="p-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-lg leading-snug">${rest.name}</h3>
            <p class="text-xs text-gray-500">${rest.cuisine}</p>
          </div>
          <div class="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
            <i class="fa-solid fa-star text-amber-400"></i>
            <span>${rest.rating}</span>
            <span class="text-gray-400 font-normal">(${rest.reviews})</span>
          </div>
        </div>

        <!-- Menu Highlights List -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3 bg-gray-50/50">
          <div class="space-y-2.5">
            ${rest.menu.slice(0, 3).map(dish => `
              <div class="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors">
                <div class="flex items-center gap-3">
                  <img src="${dish.image}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" alt="${dish.name}">
                  <div>
                    <h4 class="font-semibold text-gray-800 text-sm line-clamp-1">${dish.name}</h4>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                      <span class="font-bold text-emerald-600">$${dish.price.toFixed(2)}</span>
                      <span>•</span>
                      <span>${dish.prepTime}</span>
                    </div>
                  </div>
                </div>
                <button onclick="app.addToCart('${rest.id}', '${dish.id}')" class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0" title="Add to Order">
                  <i class="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            `).join('')}
          </div>

          <div class="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
            <span>Delivery: <strong class="text-gray-800">${rest.deliveryFee}</strong></span>
            <span>Min: <strong class="text-gray-800">${rest.minOrder}</strong></span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ---------------- CART MANAGEMENT ---------------- //

  addToCart(restId, dishId) {
    const rest = this.restaurants.find(r => r.id === restId);
    if (!rest) return;
    const dish = rest.menu.find(d => d.id === dishId);
    if (!dish) return;

    // Check if adding from a different restaurant
    if (this.cart.length > 0 && this.cart[0].restaurantId !== restId) {
      if (!confirm(`Your cart already contains items from "${this.cart[0].restaurantName}". Start a new order from "${rest.name}"?`)) {
        return;
      }
      this.cart = [];
    }

    const existingIndex = this.cart.findIndex(i => i.dishId === dishId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({
        restaurantId: rest.id,
        restaurantName: rest.name,
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: 1,
        options: 'Standard prep'
      });
    }

    this.saveCartState();
    this.updateCartCount();
    this.playChime('ping');

    // Subtle notification
    this.showToast(`Added "${dish.name}" to cart! 🛒`);
  }

  updateCartCount() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    const bottomBadge = document.getElementById('mobile-cart-badge');
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
    if (bottomBadge) {
      bottomBadge.textContent = totalCount;
      bottomBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }
  }

  openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.renderCartItems();
  }

  closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const emptyNotice = document.getElementById('cart-empty-state');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    const summary = document.getElementById('cart-summary-section');

    if (!list) return;

    if (this.cart.length === 0) {
      list.innerHTML = '';
      emptyNotice.classList.remove('hidden');
      if (checkoutBtn) checkoutBtn.disabled = true;
      if (summary) summary.classList.add('hidden');
      return;
    }

    emptyNotice.classList.add('hidden');
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (summary) summary.classList.remove('hidden');

    let subtotal = 0;

    list.innerHTML = this.cart.map((item, idx) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
        <div class="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover" alt="${item.name}">
          <div class="flex-1">
            <h4 class="font-bold text-gray-800 text-sm">${item.name}</h4>
            <p class="text-xs text-emerald-600 font-semibold">$${item.price.toFixed(2)} each</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="app.changeCartQty(${idx}, -1)" class="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold hover:bg-gray-100">-</button>
            <span class="text-sm font-bold w-5 text-center">${item.quantity}</span>
            <button onclick="app.changeCartQty(${idx}, 1)" class="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold hover:bg-gray-100">+</button>
          </div>
          <div class="text-right">
            <span class="font-bold text-gray-900 text-sm">$${itemTotal.toFixed(2)}</span>
          </div>
        </div>
      `;
    }).join('');

    const deliveryFee = 2.49;
    const tax = subtotal * 0.09;
    const tip = 4.00;
    const total = subtotal + deliveryFee + tax + tip;

    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-delivery').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-tip').textContent = `$${tip.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
  }

  changeCartQty(index, change) {
    if (this.cart[index]) {
      this.cart[index].quantity += change;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
      this.saveCartState();
      this.updateCartCount();
      this.renderCartItems();
    }
  }

  checkout() {
    if (this.cart.length === 0) return;

    this.closeCartModal();

    // Create fresh order
    const rest = this.restaurants.find(r => r.id === this.cart[0].restaurantId) || this.restaurants[0];
    const subtotal = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const deliveryFee = 2.49;
    const tax = subtotal * 0.09;
    const tip = 4.00;
    const total = subtotal + deliveryFee + tax + tip;

    const newOrderId = `FD-${Math.floor(1000 + Math.random() * 9000)}`;

    this.currentOrder = {
      id: newOrderId,
      placedAt: new Date().toISOString(),
      restaurantId: rest.id,
      restaurantName: rest.name,
      restaurantAddress: rest.address,
      deliveryAddress: '742 Evergreen Terrace, Apt 4B',
      gateCode: '#4092',
      specialInstructions: 'Please leave at front doorstep.',
      status: 'placed',
      stageIndex: 0,
      etaMinutes: 28,
      distanceRemainingKm: 2.8,
      items: JSON.parse(JSON.stringify(this.cart)),
      subtotal,
      deliveryFee,
      tax,
      tip,
      total,
      courier: {
        name: 'Jordan Miller',
        rating: 4.94,
        trips: '1,320 deliveries',
        phone: '+1 (555) 782-4419',
        vehicle: 'Vespa Elettrica (Mint White)',
        plate: 'CA-918-DL',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        thermalBagTemperature: '70°C (Pre-warmed Thermal Bag)',
        currentSpeed: '0 km/h (At Restaurant)'
      },
      restaurantCoords: [rest.lat || 37.7749, rest.lng || -122.4194],
      customerCoords: [37.7650, -122.4350],
      courierCoords: [rest.lat || 37.7749, rest.lng || -122.4194],
      routeWaypoints: [
        [rest.lat || 37.7749, rest.lng || -122.4194],
        [37.7735, -122.4215],
        [37.7718, -122.4242],
        [37.7695, -122.4278],
        [37.7675, -122.4310],
        [37.7660, -122.4332],
        [37.7650, -122.4350]
      ],
      currentWaypointIndex: 0,
      timeline: [
        { time: 'Just now', title: 'Order Placed & Paid', detail: `Confirmed by ${rest.name}` }
      ]
    };

    // Clear cart
    this.cart = [];
    this.saveCartState();
    this.saveOrderState();
    this.updateCartCount();

    this.playChime('success');
    this.showToast(`Order #${newOrderId} successfully placed! 🚀`);

    // Proactive message from BiteBot
    const notice = this.agent.generateProactiveNotice(0, this.currentOrder);
    this.agent.messages.push({
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: notice.message,
      quickReplies: ['Where is my food? 📍', 'When will it arrive? ⏱️', 'Fast-forward simulation ⏩']
    });
    this.renderChatMessages();
    this.agent.speak(notice.voiceText);

    // Update banner & map
    this.renderActiveOrderBanner();
    this.mapTracker.init(this.currentOrder);
    this.openTrackingModal();
  }

  // ---------------- ORDER SIMULATION & STAGES ---------------- //

  setOrderStage(newStageIndex) {
    if (!this.currentOrder) return;

    this.currentOrder.stageIndex = newStageIndex;
    const stage = DELIVERY_STAGES[newStageIndex];
    this.currentOrder.status = stage.id;

    // Adjust ETA & Distance dynamically
    if (newStageIndex === 0) {
      this.currentOrder.etaMinutes = 28;
      this.currentOrder.distanceRemainingKm = 2.8;
      this.currentOrder.courier.currentSpeed = '0 km/h';
    } else if (newStageIndex === 1) {
      this.currentOrder.etaMinutes = 22;
      this.currentOrder.distanceRemainingKm = 2.8;
      this.currentOrder.courier.currentSpeed = '0 km/h';
    } else if (newStageIndex === 2) {
      this.currentOrder.etaMinutes = 18;
      this.currentOrder.distanceRemainingKm = 2.5;
      this.currentOrder.courier.currentSpeed = '25 km/h';
    } else if (newStageIndex === 3) {
      this.currentOrder.etaMinutes = 14;
      this.currentOrder.distanceRemainingKm = 2.2;
      this.currentOrder.courier.currentSpeed = '20 km/h';
    } else if (newStageIndex === 4) {
      this.currentOrder.etaMinutes = 6;
      this.currentOrder.distanceRemainingKm = 0.9;
      this.currentOrder.courier.currentSpeed = '32 km/h';
    } else if (newStageIndex === 5) {
      this.currentOrder.etaMinutes = 1;
      this.currentOrder.distanceRemainingKm = 0.05;
      this.currentOrder.courier.currentSpeed = '0 km/h';
    } else {
      this.currentOrder.etaMinutes = 0;
      this.currentOrder.distanceRemainingKm = 0.0;
      this.currentOrder.courier.currentSpeed = '0 km/h';
    }

    // Add to order timeline
    this.currentOrder.timeline.unshift({
      time: 'Just now',
      title: stage.label,
      detail: stage.subtext
    });

    this.saveOrderState();
    this.renderActiveOrderBanner();
    this.renderTrackingModal();

    // Animate map courier position
    this.mapTracker.animateCourierToStage(newStageIndex);

    // Play stage chimes
    if (stage.id === 'arrived' || stage.id === 'delivered') {
      this.playChime('arrive');
    } else {
      this.playChime('ping');
    }

    // Proactive Agent Notice
    const notice = this.agent.generateProactiveNotice(newStageIndex, this.currentOrder);
    this.agent.messages.push({
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: notice.message,
      quickReplies: ['Where is my food? 📍', 'Check ETA ⏱️', 'Driver details 🛵']
    });
    this.renderChatMessages();
    this.agent.speak(notice.voiceText);
  }

  nextStage() {
    if (!this.currentOrder) return;
    const nextIdx = Math.min(DELIVERY_STAGES.length - 1, this.currentOrder.stageIndex + 1);
    this.setOrderStage(nextIdx);
  }

  prevStage() {
    if (!this.currentOrder) return;
    const prevIdx = Math.max(0, this.currentOrder.stageIndex - 1);
    this.setOrderStage(prevIdx);
  }

  resetDemoOrder() {
    this.currentOrder = JSON.parse(JSON.stringify(INITIAL_ORDER));
    this.saveOrderState();
    this.renderActiveOrderBanner();
    this.mapTracker.init(this.currentOrder);
    this.renderTrackingModal();
    this.showToast('Reset order to demo state! 🔄');
  }

  // ---------------- ORDER TRACKER UI & MODALS ---------------- //

  renderActiveOrderBanner() {
    const banner = document.getElementById('active-order-banner');
    if (!banner || !this.currentOrder) {
      if (banner) banner.classList.add('hidden');
      return;
    }

    banner.classList.remove('hidden');
    const stage = DELIVERY_STAGES[this.currentOrder.stageIndex] || DELIVERY_STAGES[0];

    document.getElementById('banner-order-id').textContent = `#${this.currentOrder.id}`;
    document.getElementById('banner-restaurant').textContent = this.currentOrder.restaurantName;
    document.getElementById('banner-status').textContent = stage.label;
    document.getElementById('banner-eta').textContent = this.currentOrder.etaMinutes > 0 ? `${this.currentOrder.etaMinutes} mins` : 'Arrived';
  }

  openTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.renderTrackingModal();
    setTimeout(() => {
      this.mapTracker.refresh();
    }, 250);
  }

  closeTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderTrackingModal() {
    if (!this.currentOrder) return;

    const order = this.currentOrder;
    const stage = DELIVERY_STAGES[order.stageIndex];

    document.getElementById('track-order-id').textContent = `#${order.id}`;
    document.getElementById('track-restaurant').textContent = order.restaurantName;
    document.getElementById('track-status-heading').textContent = stage.label;
    document.getElementById('track-status-sub').textContent = stage.subtext;
    document.getElementById('track-eta-display').textContent = `${order.etaMinutes} mins`;
    document.getElementById('track-distance-display').textContent = `${order.distanceRemainingKm} km away`;

    // Driver details
    document.getElementById('track-courier-name').textContent = order.courier.name;
    document.getElementById('track-courier-rating').textContent = `${order.courier.rating} ★`;
    document.getElementById('track-courier-vehicle').textContent = `${order.courier.vehicle} • Plate: ${order.courier.plate}`;
    document.getElementById('track-courier-temp').textContent = order.courier.thermalBagTemperature;
    document.getElementById('track-courier-img').src = order.courier.photo;

    // Delivery Address
    document.getElementById('track-address').textContent = order.deliveryAddress;
    document.getElementById('track-gate-code').textContent = order.gateCode || 'None';
    document.getElementById('track-instructions').textContent = order.specialInstructions || 'None';

    // Step indicators
    const stepsContainer = document.getElementById('track-steps-bar');
    if (stepsContainer) {
      stepsContainer.innerHTML = DELIVERY_STAGES.map((s, idx) => {
        const isDone = idx < order.stageIndex;
        const isCurrent = idx === order.stageIndex;

        let circleClass = 'bg-gray-100 text-gray-400 border-2 border-gray-200';
        if (isCurrent) {
          circleClass = 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-100 animate-pulse';
        } else if (isDone) {
          circleClass = 'bg-emerald-500 text-white';
        }

        return `
          <div class="flex-1 flex flex-col items-center text-center relative z-10 cursor-pointer" onclick="app.setOrderStage(${idx})" title="Jump to ${s.label}">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${circleClass}">
              ${isDone ? '<i class="fa-solid fa-check"></i>' : idx + 1}
            </div>
            <span class="text-[11px] mt-1 font-semibold ${isCurrent ? 'text-emerald-700 font-bold' : isDone ? 'text-gray-700' : 'text-gray-400'} hidden sm:block">
              ${s.label}
            </span>
          </div>
        `;
      }).join('');
    }

    // Timeline Log
    const timelineContainer = document.getElementById('track-timeline-list');
    if (timelineContainer) {
      timelineContainer.innerHTML = order.timeline.map((entry, idx) => `
        <div class="flex items-start gap-3">
          <div class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-gray-300'}"></div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-800">${entry.title}</span>
              <span class="text-[10px] text-gray-400 font-mono">${entry.time}</span>
            </div>
            <p class="text-xs text-gray-500">${entry.detail}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // ---------------- AI AGENT CHAT & VOICE ---------------- //

  openChatDrawer() {
    const drawer = document.getElementById('chat-drawer');
    if (!drawer) return;
    drawer.classList.remove('translate-x-full');
    drawer.classList.remove('hidden');
    this.renderChatMessages();
    setTimeout(() => {
      const input = document.getElementById('chat-input');
      if (input) input.focus();
    }, 200);
  }

  closeChatDrawer() {
    const drawer = document.getElementById('chat-drawer');
    if (drawer) {
      drawer.classList.add('translate-x-full');
    }
  }

  toggleChatDrawer() {
    const drawer = document.getElementById('chat-drawer');
    if (!drawer) return;
    if (drawer.classList.contains('translate-x-full')) {
      this.openChatDrawer();
    } else {
      this.closeChatDrawer();
    }
  }

  async sendChatMessage(text) {
    const input = document.getElementById('chat-input');
    const query = text || (input ? input.value : '');
    if (!query.trim()) return;

    if (input) input.value = '';

    // Add user message
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.agent.messages.push({
      sender: 'user',
      time,
      text: query
    });

    this.renderChatMessages();
    this.showAgentTyping(true);

    // Call agent
    const response = await this.agent.processQuery(query);

    this.showAgentTyping(false);

    if (response) {
      this.agent.messages.push({
        sender: 'agent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        cardType: response.cardType,
        quickReplies: response.quickReplies
      });

      this.renderChatMessages();
      this.playChime('ping');

      if (this.agent.voiceEnabled) {
        this.agent.speak(response.text);
      }
    }
  }

  showAgentTyping(show) {
    const indicator = document.getElementById('agent-typing-indicator');
    if (indicator) {
      indicator.style.display = show ? 'flex' : 'none';
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }
  }

  renderChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = this.agent.messages.map(msg => {
      const isAgent = msg.sender === 'agent';
      const formattedText = this.formatMarkdown(msg.text);

      return `
        <div class="flex flex-col ${isAgent ? 'items-start' : 'items-end'} mb-4">
          <div class="flex items-end gap-2 max-w-[85%] ${isAgent ? 'flex-row' : 'flex-row-reverse'}">
            ${isAgent ? `
              <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                <i class="fa-solid fa-robot"></i>
              </div>
            ` : ''}

            <div class="p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isAgent ? 'chat-bubble-agent text-gray-800' : 'chat-bubble-user'}">
              ${formattedText}
            </div>
          </div>

          <span class="text-[10px] text-gray-400 mt-1 px-2 font-mono">
            ${msg.time}
          </span>

          ${isAgent && msg.quickReplies ? `
            <div class="flex flex-wrap gap-1.5 mt-2 pl-9">
              ${msg.quickReplies.map(qr => `
                <button onclick="app.sendChatMessage('${qr.replace(/'/g, "\\'")}')" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full transition-all active:scale-95">
                  ${qr}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  }

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-emerald-700 px-1 py-0.5 rounded text-xs">$1</code>')
      .replace(/\n\n/g, '<div class="h-2"></div>')
      .replace(/\n/g, '<br/>');
  }

  toggleVoiceSpeech() {
    this.agent.voiceEnabled = !this.agent.voiceEnabled;
    const btn = document.getElementById('voice-speech-toggle');
    if (btn) {
      btn.innerHTML = this.agent.voiceEnabled 
        ? '<i class="fa-solid fa-volume-high text-emerald-600"></i>' 
        : '<i class="fa-solid fa-volume-xmark text-gray-400"></i>';
      btn.title = this.agent.voiceEnabled ? 'Voice Response: ON' : 'Voice Response: MUTED';
    }
    this.showToast(this.agent.voiceEnabled ? 'Voice responses unmuted 🔊' : 'Voice responses muted 🔇');
  }

  updateMicState(isListening) {
    const micBtn = document.getElementById('chat-mic-btn');
    if (micBtn) {
      if (isListening) {
        micBtn.classList.add('bg-red-500', 'text-white', 'mic-listening');
        micBtn.classList.remove('bg-emerald-50', 'text-emerald-600');
        this.showToast('Listening... Speak your question! 🎙️');
      } else {
        micBtn.classList.remove('bg-red-500', 'text-white', 'mic-listening');
        micBtn.classList.add('bg-emerald-50', 'text-emerald-600');
      }
    }
  }

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl z-50 transition-all duration-300 opacity-0 pointer-events-none flex items-center gap-2';
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2800);
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderRestaurants();
      });
    }

    // Chat form submit
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendChatMessage();
      });
    }
  }
}

// Global instance
window.app = null;
window.addEventListener('DOMContentLoaded', () => {
  window.app = new FoodDeliveryApp();
});
