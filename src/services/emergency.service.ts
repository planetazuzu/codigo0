export type EmergencySituation = 'medica' | 'accidente' | 'tecnico' | 'otro';

export interface EmergencyLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface EmergencyEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  situation?: EmergencySituation;
  status: 'active' | 'situation_selected' | 'instructions' | 'completed' | 'pending_sync';
  user?: string | null;
  location?: EmergencyLocation | null;
  connectivity: 'online' | 'offline';
}

const EVENTS_KEY = 'emergency_events_v1';
const PENDING_NOTIFICATIONS_KEY = 'emergency_pending_notifications_v1';

const getStoredEvents = (): EmergencyEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EmergencyEvent[];
  } catch {
    return [];
  }
};

const saveEvents = (events: EmergencyEvent[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Evitar romper el flujo si el storage falla
  }
};

const resolveCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;
  const candidates = ['user', 'currentUser', 'auth_user', 'username'];
  for (const key of candidates) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') return parsed;
      if (parsed && typeof parsed.name === 'string') return parsed.name;
      if (parsed && typeof parsed.username === 'string') return parsed.username;
    } catch {
      if (raw) return raw;
    }
  }
  return null;
};

export const createEmergencyEvent = (): EmergencyEvent => {
  const now = new Date().toISOString();
  const event: EmergencyEvent = {
    id: `emergency_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
    status: navigator.onLine ? 'active' : 'pending_sync',
    user: resolveCurrentUser(),
    connectivity: navigator.onLine ? 'online' : 'offline',
  };

  const events = getStoredEvents();
  events.unshift(event);
  saveEvents(events);
  return event;
};

export const updateEmergencyEvent = (id: string, updates: Partial<EmergencyEvent>) => {
  const events = getStoredEvents();
  const next = events.map((event) =>
    event.id === id
      ? { ...event, ...updates, updatedAt: new Date().toISOString() }
      : event
  );
  saveEvents(next);
};

export const getEmergencyEvent = (id: string): EmergencyEvent | undefined => {
  return getStoredEvents().find((event) => event.id === id);
};

export const getLocationSnapshot = (): Promise<EmergencyLocation | null> => {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 4000 }
    );
  });
};

const getPendingNotifications = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PENDING_NOTIFICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
};

const savePendingNotifications = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PENDING_NOTIFICATIONS_KEY, JSON.stringify(ids));
  } catch {
    // Silencioso
  }
};

export const queueCoordinatorNotification = (eventId: string) => {
  const pending = getPendingNotifications();
  if (!pending.includes(eventId)) {
    pending.push(eventId);
    savePendingNotifications(pending);
  }
};

export const notifyCoordinator = async (eventId: string): Promise<'sent' | 'queued'> => {
  const event = getEmergencyEvent(eventId);
  if (!event || typeof window === 'undefined') {
    return 'queued';
  }

  // Endpoint configurable sin tocar configuración global de la app
  const notifyUrl = window.localStorage.getItem('emergency_notify_url');

  if (!navigator.onLine || !notifyUrl) {
    queueCoordinatorNotification(eventId);
    return 'queued';
  }

  try {
    const response = await fetch(notifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('notification_failed');
    }
    return 'sent';
  } catch {
    queueCoordinatorNotification(eventId);
    return 'queued';
  }
};
