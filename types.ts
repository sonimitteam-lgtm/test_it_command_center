export enum LocationType {
  OFFICE = 'Main Office',
  SERVER_ROOM = 'Server Room',
  CLOUD = 'Cloud (AWS/Azure)',
  REMOTE = 'Remote Worker',
}

export enum Priority {
  P1 = 'P1 - Critical',
  P2 = 'P2 - High',
  P3 = 'P3 - Standard',
  P4 = 'P4 - Low',
}

export enum TaskStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  WAITING = 'Waiting for Vendor',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  HANDOVER = 'Handover',
}

export interface Ticket {
  id: string;
  createdUtc: string;
  priority: Priority;
  category: 'Network' | 'O365' | 'AWS' | 'Hardware' | 'Security' | 'General';
  description: string;
  location: LocationType;
  status: TaskStatus;
  dueLocal: string;
  notes?: string;
  handoverNote?: string;
  region?: string;
  isRecurring?: boolean; // For daily reminders
  timeEstimate?: string; // e.g. "30m", "2h"
  timeSpent?: string;
}

export interface Asset {
  tag: string;
  model: string;
  type: 'Laptop' | 'Server' | 'Mobile' | 'License' | 'Networking';
  purchaseDate: string;
  costUsd: number;
  assignedUser: string; // The end user who has the device
  location: string;
  status: 'Deployed' | 'In Stock' | 'Repair' | 'Retired';
  lifecycleStatus: 'Healthy' | 'Plan Refresh' | 'Overdue';
}

export interface Subscription {
  vendor: string;
  owner: string; // Business owner (e.g., Sales Dept)
  costMonthly: number;
  renewalDate: string;
  category: 'SaaS' | 'Cloud';
}

export interface DailyLogItem {
  id: string;
  task: string;
  status: 'Pending' | 'Complete' | 'Failed';
  timestamp?: string;
}