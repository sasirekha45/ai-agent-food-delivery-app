/**
 * Interactive Leaflet Map Manager for Live Delivery Tracking
 */

class DeliveryMapTracker {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.restaurantMarker = null;
    this.customerMarker = null;
    this.courierMarker = null;
    this.routePolyline = null;
    this.activeOrder = null;
    this.animationTimer = null;
  }

  init(order) {
    this.activeOrder = order;
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Check if Leaflet is available
    if (typeof L === 'undefined') {
      console.warn('Leaflet JS is not loaded yet');
      return;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    // Default center
    const centerLat = (order.restaurantCoords[0] + order.customerCoords[0]) / 2;
    const centerLng = (order.restaurantCoords[1] + order.customerCoords[1]) / 2;

    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([centerLat, centerLng], 14);

    // CartoDB Positron clean map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    this.renderMarkersAndRoute();
  }

  createCustomIcon(htmlClass, iconClass, bgColor, pulse = false) {
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${pulse ? '<span class="absolute inline-flex h-12 w-12 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>' : ''}
          <div class="relative w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl ${bgColor} ring-4 ring-white">
            <i class="fa-solid ${iconClass} text-base"></i>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  }

  renderMarkersAndRoute() {
    if (!this.map || !this.activeOrder) return;

    const order = this.activeOrder;

    // 1. Restaurant Marker
    const restIcon = this.createCustomIcon('rest-pin', 'fa-utensils', 'bg-orange-500');
    this.restaurantMarker = L.marker(order.restaurantCoords, { icon: restIcon })
      .addTo(this.map)
      .bindPopup(`<b>${order.restaurantName}</b><br><span class="text-xs text-gray-500">Pick-up Location</span>`);

    // 2. Customer Home Marker
    const homeIcon = this.createCustomIcon('home-pin', 'fa-house-user', 'bg-indigo-600');
    this.customerMarker = L.marker(order.customerCoords, { icon: homeIcon })
      .addTo(this.map)
      .bindPopup(`<b>Your Address</b><br><span class="text-xs text-gray-500">${order.deliveryAddress}</span>`);

    // 3. Route Polyline
    this.routePolyline = L.polyline(order.routeWaypoints, {
      color: '#10b981',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(this.map);

    // 4. Courier Marker
    this.updateCourierPosition(order.courierCoords);

    // Fit bounds to fit route
    const bounds = L.latLngBounds([order.restaurantCoords, order.customerCoords, order.courierCoords]);
    this.map.fitBounds(bounds, { padding: [50, 50] });

    // Invalidate size in case rendered in drawer/hidden container
    setTimeout(() => {
      this.map && this.map.invalidateSize();
    }, 250);
  }

  updateCourierPosition(coords) {
    if (!this.map || !this.activeOrder) return;

    const courierIcon = this.createCustomIcon('courier-pin', 'fa-motorcycle', 'bg-emerald-600', true);

    if (this.courierMarker) {
      this.courierMarker.setLatLng(coords);
    } else {
      this.courierMarker = L.marker(coords, { icon: courierIcon })
        .addTo(this.map)
        .bindPopup(`<b>${this.activeOrder.courier.name}</b><br>🛵 ${this.activeOrder.courier.vehicle}<br>Speed: ~${this.activeOrder.courier.currentSpeed}`);
    }
  }

  animateCourierToStage(stageIndex) {
    if (!this.activeOrder || !this.map) return;

    const waypoints = this.activeOrder.routeWaypoints;
    let targetIndex = 0;

    if (stageIndex <= 1) {
      targetIndex = 0; // At restaurant
    } else if (stageIndex === 2) {
      targetIndex = 1;
    } else if (stageIndex === 3) {
      targetIndex = 2;
    } else if (stageIndex === 4) {
      targetIndex = 4; // midway
    } else if (stageIndex === 5) {
      targetIndex = waypoints.length - 2; // nearly arrived
    } else {
      targetIndex = waypoints.length - 1; // at home
    }

    const targetCoords = waypoints[targetIndex];
    this.activeOrder.courierCoords = targetCoords;

    if (this.courierMarker) {
      this.courierMarker.setLatLng(targetCoords);
      this.map.panTo(targetCoords, { animate: true, duration: 1.0 });
    }
  }

  startLiveSimulation() {
    if (this.animationTimer) clearInterval(this.animationTimer);

    // Subtle micro-movement simulation to mimic live GPS updates
    this.animationTimer = setInterval(() => {
      if (!this.activeOrder || this.activeOrder.status !== 'on_the_way' || !this.courierMarker) return;

      const current = this.courierMarker.getLatLng();
      const jitterLat = (Math.random() - 0.5) * 0.0003;
      const jitterLng = (Math.random() - 0.5) * 0.0003;

      const newLat = current.lat + jitterLat;
      const newLng = current.lng + jitterLng;

      this.courierMarker.setLatLng([newLat, newLng]);
    }, 3000);
  }

  stopLiveSimulation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  refresh() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
}

window.DeliveryMapTracker = DeliveryMapTracker;
