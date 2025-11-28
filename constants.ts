import { Asset, DailyLogItem, LocationType, Priority, Subscription, TaskStatus, Ticket } from "./types";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-1042',
    createdUtc: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    priority: Priority.P1,
    category: 'AWS',
    description: 'Production DB Latency Spike',
    location: LocationType.CLOUD,
    status: TaskStatus.IN_PROGRESS,
    dueLocal: 'Today 14:00',
    notes: 'Investigating RDS metrics. CPU usage high.',
    timeEstimate: '2h',
    isRecurring: false,
  },
  {
    id: 'TKT-1043',
    createdUtc: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    priority: Priority.P2,
    category: 'Network',
    description: 'Office Wi-Fi Intermittent in Conf Room B',
    location: LocationType.OFFICE,
    status: TaskStatus.OPEN,
    dueLocal: 'Today 16:00',
    timeEstimate: '45m',
    isRecurring: false,
  },
  {
    id: 'MAIN-001',
    createdUtc: new Date().toISOString(),
    priority: Priority.P2,
    category: 'Security',
    description: 'Review Firewall Deny Logs',
    location: LocationType.CLOUD,
    status: TaskStatus.OPEN,
    dueLocal: 'Today 10:00',
    isRecurring: true,
    timeEstimate: '15m'
  },
  {
    id: 'MAIN-002',
    createdUtc: new Date().toISOString(),
    priority: Priority.P3,
    category: 'AWS',
    description: 'Verify Daily Backup Snapshots',
    location: LocationType.CLOUD,
    status: TaskStatus.RESOLVED,
    dueLocal: 'Today 09:00',
    isRecurring: true,
    timeEstimate: '10m'
  },
  {
    id: 'TKT-1044',
    createdUtc: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    priority: Priority.P3,
    category: 'Hardware',
    description: 'Setup New Hire Laptop (Marketing)',
    location: LocationType.OFFICE,
    status: TaskStatus.WAITING,
    dueLocal: 'Tomorrow 09:00',
    notes: 'Waiting for monitor delivery.',
    timeEstimate: '1.5h',
    isRecurring: false,
  },
  {
    id: 'TKT-1045',
    createdUtc: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    priority: Priority.P4,
    category: 'O365',
    description: 'Cleanup inactive SharePoint sites',
    location: LocationType.CLOUD,
    status: TaskStatus.OPEN,
    dueLocal: 'Friday 17:00',
    timeEstimate: '1h',
    isRecurring: false,
  },
  {
    id: 'TKT-1046',
    createdUtc: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    priority: Priority.P3,
    category: 'General',
    description: 'Weekly Server Reboot - APAC Region',
    location: LocationType.SERVER_ROOM,
    status: TaskStatus.HANDOVER,
    dueLocal: 'Today 20:00',
    region: 'APAC',
    handoverNote: 'Server A rebooted successfully. Server B pending updates.',
    isRecurring: true,
    timeEstimate: '30m'
  },
];

export const MOCK_ASSETS: Asset[] = [
  { tag: 'LPT-091', model: 'MacBook Pro M2', type: 'Laptop', purchaseDate: '2021-05-10', costUsd: 2400, assignedUser: 'CEO', location: 'Office', status: 'Deployed', lifecycleStatus: 'Healthy' },
  { tag: 'SVR-004', model: 'Dell PowerEdge R740', type: 'Server', purchaseDate: '2018-11-15', costUsd: 8500, assignedUser: 'IT Admin', location: 'Server Room', status: 'Deployed', lifecycleStatus: 'Overdue' },
  { tag: 'LPT-022', model: 'Lenovo X1 Carbon', type: 'Laptop', purchaseDate: '2020-01-20', costUsd: 1800, assignedUser: 'Sales Rep', location: 'Remote', status: 'Deployed', lifecycleStatus: 'Plan Refresh' },
  { tag: 'MOB-112', model: 'iPhone 14', type: 'Mobile', purchaseDate: '2023-02-15', costUsd: 999, assignedUser: 'Inventory', location: 'IT Cabinet', status: 'In Stock', lifecycleStatus: 'Healthy' },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { vendor: 'Microsoft O365', owner: 'IT', costMonthly: 12500, renewalDate: '2024-01-01', category: 'SaaS' },
  { vendor: 'AWS', owner: 'IT', costMonthly: 8400, renewalDate: 'Monthly', category: 'Cloud' },
  { vendor: 'Salesforce', owner: 'Sales', costMonthly: 4200, renewalDate: '2023-12-15', category: 'SaaS' },
  { vendor: 'Slack', owner: 'HR', costMonthly: 1800, renewalDate: '2024-03-10', category: 'SaaS' },
];

export const MOCK_DAILY_LOG: DailyLogItem[] = [
  { id: '1', task: 'Review Risky Sign-ins', status: 'Complete', timestamp: '08:15' },
  { id: '2', task: 'Verify Backups (Prod)', status: 'Complete', timestamp: '08:30' },
  { id: '3', task: 'Check Firewall Logs', status: 'Pending' },
  { id: '4', task: 'Server Room Temp Check', status: 'Failed', timestamp: '09:00' },
];