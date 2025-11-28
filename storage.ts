import { Asset, DailyLogItem, Ticket, Subscription } from '../types';
import { MOCK_TICKETS, MOCK_ASSETS, MOCK_DAILY_LOG, MOCK_SUBSCRIPTIONS } from '../constants';

const STORAGE_KEYS = {
  TICKETS: 'it_cc_tickets',
  ASSETS: 'it_cc_assets',
  LOGS: 'it_cc_logs',
  SUBSCRIPTIONS: 'it_cc_subs'
};

export const loadData = <T>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultData;
    return JSON.parse(stored);
  } catch (e) {
    console.error(`Failed to load ${key}`, e);
    return defaultData;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}`, e);
  }
};

export const storageService = {
  getTickets: () => loadData<Ticket[]>(STORAGE_KEYS.TICKETS, MOCK_TICKETS),
  saveTickets: (data: Ticket[]) => saveData(STORAGE_KEYS.TICKETS, data),

  getAssets: () => loadData<Asset[]>(STORAGE_KEYS.ASSETS, MOCK_ASSETS),
  saveAssets: (data: Asset[]) => saveData(STORAGE_KEYS.ASSETS, data),

  getLogs: () => loadData<DailyLogItem[]>(STORAGE_KEYS.LOGS, MOCK_DAILY_LOG),
  saveLogs: (data: DailyLogItem[]) => saveData(STORAGE_KEYS.LOGS, data),

  getSubscriptions: () => loadData<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, MOCK_SUBSCRIPTIONS),
  saveSubscriptions: (data: Subscription[]) => saveData(STORAGE_KEYS.SUBSCRIPTIONS, data),
};
