// Mock Data for AI Food Delivery App

const RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Trattoria Bella Napoli',
    cuisine: 'Italian • Woodfired Pizza • Pasta',
    rating: 4.9,
    reviews: 1420,
    deliveryTime: '25-35 min',
    deliveryFee: '$2.49',
    minOrder: '$15',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular • Best Pizza',
    address: '45 Via Roma Blvd, Downtown',
    lat: 37.7749,
    lng: -122.4194,
    tags: ['Pizza', 'Italian', 'Vegetarian Friendly'],
    menu: [
      {
        id: 'dish-101',
        name: 'Margherita DOP Woodfired Pizza',
        price: 16.50,
        description: 'San Marzano tomatoes, fresh buffalo mozzarella, fresh basil, extra virgin olive oil.',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
        calories: '820 kcal',
        prepTime: '12 min',
        popular: true,
        category: 'Pizza'
      },
      {
        id: 'dish-102',
        name: 'Truffle Fettuccine Alfredo',
        price: 19.00,
        description: 'Handmade fettuccine, black summer truffles, 24-month aged Parmigiano Reggiano cream.',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
        calories: '940 kcal',
        prepTime: '15 min',
        popular: true,
        category: 'Pasta'
      },
      {
        id: 'dish-103',
        name: 'Crispy Calamari Fritti',
        price: 13.50,
        description: 'Golden fried calamari rings served with lemon garlic aioli and marinara dip.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        calories: '520 kcal',
        prepTime: '10 min',
        popular: false,
        category: 'Starters'
      },
      {
        id: 'dish-104',
        name: 'Classic Venetian Tiramisu',
        price: 8.50,
        description: 'Espresso-soaked ladyfingers, mascarpone sabayon, dusted with Valrhona cocoa powder.',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
        calories: '480 kcal',
        prepTime: '5 min',
        popular: true,
        category: 'Desserts'
      },
      {
        id: 'dish-105',
        name: 'San Pellegrino Blood Orange',
        price: 3.50,
        description: 'Chilled 330ml can of sparkling Italian citrus beverage.',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
        calories: '130 kcal',
        prepTime: '2 min',
        popular: false,
        category: 'Drinks'
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Artisan Burger Co.',
    cuisine: 'Gourmet Smash Burgers • Shakes',
    rating: 4.8,
    reviews: 980,
    deliveryTime: '20-30 min',
    deliveryFee: '$1.99',
    minOrder: '$12',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending 🔥',
    address: '112 Market Street',
    lat: 37.7790,
    lng: -122.4140,
    tags: ['Burgers', 'American', 'Fast Delivery'],
    menu: [
      {
        id: 'dish-201',
        name: 'The Truffle Double Smash Burger',
        price: 15.99,
        description: 'Two wagyu patties, smoked gouda, black truffle mayo, caramelized onions on brioche.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        calories: '890 kcal',
        prepTime: '10 min',
        popular: true,
        category: 'Burgers'
      },
      {
        id: 'dish-202',
        name: 'Nashville Hot Crispy Chicken',
        price: 14.50,
        description: 'Spicy cayenne buttermilk fried breast, dill pickles, comeback slaw on toasted bun.',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        calories: '840 kcal',
        prepTime: '12 min',
        popular: true,
        category: 'Burgers'
      },
      {
        id: 'dish-203',
        name: 'Parmesan Rosemary Truffle Fries',
        price: 6.99,
        description: 'Hand-cut russet potatoes tossed in white truffle oil, rosemary, and freshly grated parmesan.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        calories: '450 kcal',
        prepTime: '6 min',
        popular: true,
        category: 'Sides'
      },
      {
        id: 'dish-204',
        name: 'Salted Caramel Pretzel Shake',
        price: 7.50,
        description: 'House-churned vanilla bean custard, Fleur de Sel caramel, pretzel crunch, whipped cream.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        calories: '610 kcal',
        prepTime: '5 min',
        popular: false,
        category: 'Drinks'
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Sakura Blossom Sushi Bar',
    cuisine: 'Japanese • Hand Rolls • Sashimi',
    rating: 4.9,
    reviews: 1850,
    deliveryTime: '30-45 min',
    deliveryFee: '$2.99',
    minOrder: '$20',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    badge: 'Chef Choice 🍣',
    address: '88 Geary Ave',
    lat: 37.7885,
    lng: -122.4075,
    tags: ['Sushi', 'Healthy', 'Japanese'],
    menu: [
      {
        id: 'dish-301',
        name: 'Dragon Roll Supreme (8 pcs)',
        price: 18.50,
        description: 'Eel, cucumber, topped with avocado, tobiko caviar, unagi glaze, and sesame seeds.',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80',
        calories: '540 kcal',
        prepTime: '14 min',
        popular: true,
        category: 'Sushi Rolls'
      },
      {
        id: 'dish-302',
        name: 'Spicy Salmon Crunch Roll',
        price: 15.00,
        description: 'Fresh Atlantic salmon, spicy sriracha mayo, cucumber, topped with tempura flakes.',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
        calories: '490 kcal',
        prepTime: '12 min',
        popular: true,
        category: 'Sushi Rolls'
      },
      {
        id: 'dish-303',
        name: 'Tonkotsu Ramen with Chashu',
        price: 17.00,
        description: 'Rich 24-hr pork bone broth, springy ramen noodles, marinated soft egg, tender pork belly, nori.',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        calories: '780 kcal',
        prepTime: '12 min',
        popular: true,
        category: 'Mains'
      },
      {
        id: 'dish-304',
        name: 'Steamed Edamame with Sea Salt',
        price: 5.50,
        description: 'Tender steamed young soybean pods sprinkled with Maldon flaked sea salt.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        calories: '180 kcal',
        prepTime: '4 min',
        popular: false,
        category: 'Starters'
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'El Fuego Street Tacos',
    cuisine: 'Mexican • Birria • Burritos',
    rating: 4.8,
    reviews: 730,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.49',
    minOrder: '$10',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    badge: 'Super Fast ⚡',
    address: '220 Mission St',
    lat: 37.7812,
    lng: -122.4022,
    tags: ['Tacos', 'Mexican', 'Fast Food'],
    menu: [
      {
        id: 'dish-401',
        name: 'Trio of Quesabirria Tacos with Consomé',
        price: 15.50,
        description: 'Slow-braised beef brisket, melted oaxaca cheese, cilantro, onions in crispy grilled corn tortillas with hot dipping broth.',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
        calories: '790 kcal',
        prepTime: '8 min',
        popular: true,
        category: 'Tacos'
      },
      {
        id: 'dish-402',
        name: 'Carne Asada California Burrito',
        price: 14.00,
        description: 'Charred skirt steak, french fries, guacamole, pico de gallo, and crema in a giant flour tortilla.',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
        calories: '920 kcal',
        prepTime: '10 min',
        popular: true,
        category: 'Burritos'
      },
      {
        id: 'dish-403',
        name: 'Churros with Dulce de Leche',
        price: 6.50,
        description: 'Crispy fried dough sticks rolled in cinnamon sugar, served with warm dulce de leche dipping sauce.',
        image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=600&q=80',
        calories: '420 kcal',
        prepTime: '5 min',
        popular: true,
        category: 'Desserts'
      }
    ]
  },
  {
    id: 'rest-5',
    name: 'Green Oasis Wellness Bowls',
    cuisine: 'Organic • Vegan • Superfood Bowls',
    rating: 4.9,
    reviews: 620,
    deliveryTime: '20-30 min',
    deliveryFee: '$2.00',
    minOrder: '$14',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    badge: 'Health Choice 🥗',
    address: '730 Polk Street',
    lat: 37.7830,
    lng: -122.4180,
    tags: ['Vegan', 'Salad', 'Healthy', 'Gluten-Free'],
    menu: [
      {
        id: 'dish-501',
        name: 'Mediterranean Rainbow Quinoa Bowl',
        price: 14.50,
        description: 'Organic tri-color quinoa, roasted chickpeas, cucumber, cherry tomatoes, kalamata olives, tahini dressing.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        calories: '510 kcal',
        prepTime: '8 min',
        popular: true,
        category: 'Bowls'
      },
      {
        id: 'dish-502',
        name: 'Amazonian Dragonfruit Acai Bowl',
        price: 12.50,
        description: 'Pure organic acai blend topped with chia seeds, sliced bananas, fresh berries, toasted coconut flakes.',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80',
        calories: '390 kcal',
        prepTime: '6 min',
        popular: true,
        category: 'Bowls'
      }
    ]
  }
];

// Delivery Stages Definition
const DELIVERY_STAGES = [
  {
    id: 'placed',
    label: 'Order Placed',
    subtext: 'Your order was received and confirmed',
    icon: 'fa-receipt',
    color: '#3b82f6'
  },
  {
    id: 'preparing',
    label: 'Kitchen Preparing',
    subtext: 'Chefs are crafting your meal with fresh ingredients',
    icon: 'fa-fire-burner',
    color: '#f59e0b'
  },
  {
    id: 'driver_assigned',
    label: 'Courier Dispatched',
    subtext: 'Courier is heading to restaurant for pickup',
    icon: 'fa-user-astronaut',
    color: '#8b5cf6'
  },
  {
    id: 'picked_up',
    label: 'Order Picked Up',
    subtext: 'Packed securely in insulated thermal bag',
    icon: 'fa-bag-shopping',
    color: '#ec4899'
  },
  {
    id: 'on_the_way',
    label: 'Out for Delivery',
    subtext: 'Courier is zooming towards your address',
    icon: 'fa-motorcycle',
    color: '#10b981'
  },
  {
    id: 'arrived',
    label: 'Arrived at Door',
    subtext: 'Courier is outside your building / doorstep',
    icon: 'fa-bell-concierge',
    color: '#06b6d4'
  },
  {
    id: 'delivered',
    label: 'Delivered',
    subtext: 'Bon Appétit! Order completed safely',
    icon: 'fa-circle-check',
    color: '#22c55e'
  }
];

// Initial Active Order for Instant Testing & Demo
const INITIAL_ORDER = {
  id: 'FD-8492',
  placedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  restaurantId: 'rest-1',
  restaurantName: 'Trattoria Bella Napoli',
  restaurantAddress: '45 Via Roma Blvd, Downtown',
  deliveryAddress: '742 Evergreen Terrace, Apt 4B',
  gateCode: '#4092',
  specialInstructions: 'Please leave on porch table and ring bell.',
  status: 'on_the_way', // Current demo stage
  stageIndex: 4, // 0: placed, 1: preparing, 2: driver_assigned, 3: picked_up, 4: on_the_way, 5: arrived, 6: delivered
  etaMinutes: 7,
  distanceRemainingKm: 1.2,
  items: [
    {
      id: 'dish-101',
      name: 'Margherita DOP Woodfired Pizza',
      price: 16.50,
      quantity: 1,
      options: 'Extra basil, crispy crust'
    },
    {
      id: 'dish-102',
      name: 'Truffle Fettuccine Alfredo',
      price: 19.00,
      quantity: 1,
      options: 'Extra parmigiano'
    },
    {
      id: 'dish-105',
      name: 'San Pellegrino Blood Orange',
      price: 3.50,
      quantity: 2,
      options: 'Chilled'
    }
  ],
  subtotal: 42.50,
  tax: 3.83,
  deliveryFee: 2.49,
  tip: 5.00,
  total: 53.82,
  courier: {
    name: 'Alex Rivera',
    rating: 4.96,
    trips: '2,480 deliveries',
    phone: '+1 (555) 382-9011',
    vehicle: 'Electric SuperSoco Scooter (Matte Crimson)',
    plate: 'NY-882-EV',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    thermalBagTemperature: '68°C (Optimal Heat Retention)',
    currentSpeed: '28 km/h'
  },
  // Map points [lat, lng]
  restaurantCoords: [37.7749, -122.4194],
  customerCoords: [37.7650, -122.4350],
  // Interpolated courier coordinates
  courierCoords: [37.7695, -122.4278],
  routeWaypoints: [
    [37.7749, -122.4194], // Rest
    [37.7735, -122.4215],
    [37.7718, -122.4242],
    [37.7695, -122.4278], // Current
    [37.7675, -122.4310],
    [37.7660, -122.4332],
    [37.7650, -122.4350]  // Customer
  ],
  currentWaypointIndex: 3,
  timeline: [
    { time: '14 mins ago', title: 'Order Placed & Paid', detail: 'Received by Trattoria Bella Napoli' },
    { time: '11 mins ago', title: 'Chefs Began Cooking', detail: 'Pizza entered woodfired stone oven' },
    { time: '8 mins ago', title: 'Courier Alex Dispatched', detail: 'Alex accepted delivery route' },
    { time: '5 mins ago', title: 'Food Picked Up', detail: 'Sealed inside temperature-controlled pouch' },
    { time: 'Just now', title: 'On the Way (1.2 km away)', detail: 'Navigating via Market & Castro St' }
  ]
};
