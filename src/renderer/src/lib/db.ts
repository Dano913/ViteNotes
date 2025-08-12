import { Event } from '../types/time';

const DB_NAME = 'calendar-events-db';
const DB_VERSION = 1;
const EVENTS_STORE = 'events';

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening the database:', event);
      reject('Failed to open the database');
    };

    request.onsuccess = (event: IDBRequestEventMap['success']) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log('Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create the object store for events if it doesn't exist
      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        const store = db.createObjectStore(EVENTS_STORE, { keyPath: 'id' });

        // Create indexes for efficient searches
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('title', 'title', { unique: false });

        console.log('Event store created');
      }
    };
  });
};

// Serialize Date to string for storage in IndexedDB
const serializeDate = (date: Date): string => {
  return date instanceof Date ? date.toISOString() : date;
};

// Deserialize string to Date when retrieving from IndexedDB
const deserializeDate = (data: any): Event => {
  if (data && data.date) {
    return {
      ...data,
      date: new Date(data.date)
    };
  }
  return data;
};

// CRUD operations for events

// Create or update an event
export const saveEvent = async (event: Event): Promise<Event> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);

    // Serialize the date before saving
    const eventToSave = {
      ...event,
      date: serializeDate(event.date)
    };

    const request = store.put(eventToSave);

    request.onsuccess = () => {
      resolve(event);
    };

    request.onerror = (error) => {
      console.error('Error saving the event:', error);
      reject('Failed to save the event');
    };
  });
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      // Deserialize the dates before returning
      const events = request.result.map(deserializeDate);
      resolve(events);
    };

    request.onerror = (error) => {
      console.error('Error retrieving the events:', error);
      reject('Failed to retrieve the events');
    };
  });
};

// Get events for a specific month
export const getEventsForMonth = async (year: number, month: number): Promise<Event[]> => {
  const events = await getAllEvents();

  return events.filter(event => {
    const eventDate = event.date;
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};

// Delete an event
export const deleteEvent = async (id: string): Promise<string> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve(id);
    };

    request.onerror = (error) => {
      console.error('Error deleting the event:', error);
      reject('Failed to delete the event');
    };
  });
};
