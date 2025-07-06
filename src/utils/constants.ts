// Animation constants
export const ANIMATION_DELAYS = {
  PLACE_APPEAR: 500, // milliseconds delay between place animations
  STAGGER_BASE: 100, // milliseconds base delay for staggered animations
} as const;

// Processing statuses
export const PROCESSING_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

// Post statuses
export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

// UI constants
export const UI_CONSTANTS = {
  PROGRESS_POLL_INTERVAL: 2000, // milliseconds
  MAX_GMAPS_LINKS: 7,
  DEFAULT_PAGE_SIZE: 10,
} as const;

// Default fallback values
export const DEFAULTS = {
  POST_IMAGE:
    "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
  CITY_SEARCH: "Jakarta",
} as const;
