// Local Storage utilities with error handling and type safety

export class StorageManager {
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('LocalStorage is not available');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      console.warn('LocalStorage is not available');
      return defaultValue || null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  static getAllKeys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  static getStorageSize(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }
}

// Specific storage keys and types
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'gmtrip_user_preferences',
  RECENT_SEARCHES: 'gmtrip_recent_searches',
  DRAFT_TRIPS: 'gmtrip_draft_trips',
  VISITED_PAGES: 'gmtrip_visited_pages',
  THEME_PREFERENCE: 'gmtrip_theme_preference',
  LANGUAGE_PREFERENCE: 'gmtrip_language_preference',
} as const;

// User preferences interface
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    tripReminders: boolean;
  };
  privacy: {
    shareLocation: boolean;
    sharePhotos: boolean;
    publicProfile: boolean;
  };
}

// Recent search interface
export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

// Draft trip interface
export interface DraftTrip {
  id: string;
  title: string;
  region: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string[];
  lastModified: number;
}

// Storage helpers for specific data types
export const userPreferencesStorage = {
  get: (): UserPreferences => {
    const defaultPreferences: UserPreferences = {
      theme: 'light',
      language: 'ko',
      notifications: {
        email: true,
        push: true,
        tripReminders: true,
      },
      privacy: {
        shareLocation: false,
        sharePhotos: true,
        publicProfile: false,
      },
    };
    return StorageManager.getItem(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences) || defaultPreferences;
  },

  set: (preferences: UserPreferences): boolean => {
    return StorageManager.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  update: (updates: Partial<UserPreferences>): boolean => {
    const current = userPreferencesStorage.get();
    return userPreferencesStorage.set({ ...current, ...updates });
  },
};

export const recentSearchesStorage = {
  get: (): RecentSearch[] => {
    return StorageManager.getItem(STORAGE_KEYS.RECENT_SEARCHES, []) || [];
  },

  add: (query: string, resultCount?: number): boolean => {
    const searches = recentSearchesStorage.get();
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      resultCount,
    };

    // Remove duplicate searches
    const filteredSearches = searches.filter(search => search.query !== query);
    
    // Add new search at the beginning
    const updatedSearches = [newSearch, ...filteredSearches].slice(0, 10); // Keep only 10 recent searches

    return StorageManager.setItem(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
  },

  clear: (): boolean => {
    return StorageManager.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  },

  remove: (id: string): boolean => {
    const searches = recentSearchesStorage.get();
    const updatedSearches = searches.filter(search => search.id !== id);
    return StorageManager.setItem(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
  },
};

export const draftTripsStorage = {
  get: (): DraftTrip[] => {
    return StorageManager.getItem(STORAGE_KEYS.DRAFT_TRIPS, []) || [];
  },

  save: (draft: Omit<DraftTrip, 'id' | 'lastModified'>): boolean => {
    const drafts = draftTripsStorage.get();
    const newDraft: DraftTrip = {
      ...draft,
      id: Date.now().toString(),
      lastModified: Date.now(),
    };

    const updatedDrafts = [newDraft, ...drafts].slice(0, 5); // Keep only 5 drafts
    return StorageManager.setItem(STORAGE_KEYS.DRAFT_TRIPS, updatedDrafts);
  },

  update: (id: string, updates: Partial<Omit<DraftTrip, 'id'>>): boolean => {
    const drafts = draftTripsStorage.get();
    const updatedDrafts = drafts.map(draft => 
      draft.id === id 
        ? { ...draft, ...updates, lastModified: Date.now() }
        : draft
    );
    return StorageManager.setItem(STORAGE_KEYS.DRAFT_TRIPS, updatedDrafts);
  },

  remove: (id: string): boolean => {
    const drafts = draftTripsStorage.get();
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    return StorageManager.setItem(STORAGE_KEYS.DRAFT_TRIPS, updatedDrafts);
  },

  clear: (): boolean => {
    return StorageManager.removeItem(STORAGE_KEYS.DRAFT_TRIPS);
  },
};
