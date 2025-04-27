
// Predefined buildings available in the system
export const predefinedBuildings = [
  {
    id: 1,
    name: "Town Hall",
    imageUrl: "/buildings/town-hall.png",
    description: "Administrative center of the town"
  },
  {
    id: 2,
    name: "House",
    imageUrl: "/buildings/house.png",
    description: "Residential building"
  },
  {
    id: 3,
    name: "Shop",
    imageUrl: "/buildings/shop.png",
    description: "Commercial building for retail"
  },
  {
    id: 4,
    name: "Factory",
    imageUrl: "/buildings/factory.png",
    description: "Industrial building"
  },
  {
    id: 5,
    name: "Park",
    imageUrl: "/buildings/park.png",
    description: "Recreational area with trees"
  }
];

// Authentication related functions
const ADMIN_PASSWORD = "townbuilder123"; // This would ideally be hashed in a real app

export const verifyPassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "townbuilder_auth_token",
  GRID_DATA: "townGridBuildings",
  GRID_STYLE: "townGridStyle"
};

// Simple token generation for authentication
export const generateAuthToken = (): string => {
  return `auth_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) !== null;
};

// Login user
export const loginUser = (password: string): boolean => {
  if (verifyPassword(password)) {
    const token = generateAuthToken();
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  }
  return false;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};
