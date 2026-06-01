import { SafetyStatus } from '../constants/theme';

// ── Types ────────────────────────────────────────────────────────────
export interface SensorNode {
  id: number;
  name: string;
  oxygen: number | null;       // percentage (normal ~20.9%)
  toxicGas: number | null;     // ppm
  temperature: number | null;  // °C
  humidity: number | null;     // percentage
  status: SafetyStatus | 'offline';
  lastUpdated: Date;
  position: { x: number; y: number }; // for network graph
  connections: number[]; // connected node IDs
  isPrototype?: boolean;
}

export interface Worker {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'fall';
  gps: { lat: number; lng: number };
  imu: {
    accelerationX: number;
    accelerationY: number;
    accelerationZ: number;
  };
  wristbandConnected: boolean;
  lastMotion: Date;
  assignedNodes: number[];
  nearestNode?: number;
}

export interface Alert {
  id: string;
  type: 'fall' | 'gas' | 'oxygen' | 'temperature';
  priority: 'critical' | 'high' | 'medium' | 'low';
  workerId?: string;
  workerName?: string;
  nodeId?: number;
  message: string;
  timestamp: Date;
  gps?: { lat: number; lng: number };
  acknowledged: boolean;
}

// ── Safety Classification ────────────────────────────────────────────
export function classifySafety(oxygen: number, toxicGas: number, temperature: number): SafetyStatus {
  // DANGER thresholds
  if (oxygen < 16 || toxicGas > 50 || temperature > 50) return 'danger';
  // WARNING thresholds
  if (oxygen < 19 || toxicGas > 25 || temperature > 40) return 'warning';
  // SAFE
  return 'safe';
}

// ── Network Topology ────────────────────────────────────────────────
const NODE_POSITIONS: { x: number; y: number }[] = [
  { x: 60,  y: 80  },   // Node 1
  { x: 180, y: 50  },   // Node 2
  { x: 300, y: 80  },   // Node 3
  { x: 120, y: 180 },   // Node 4
  { x: 240, y: 160 },   // Node 5
  { x: 60,  y: 280 },   // Node 6
  { x: 180, y: 260 },   // Node 7
  { x: 300, y: 280 },   // Node 8
  { x: 120, y: 360 },   // Node 9
  { x: 240, y: 340 },   // Node 10
  { x: 60,  y: 440 },   // Node 11
  { x: 300, y: 440 },   // Node 12
];

const NODE_CONNECTIONS: number[][] = [
  [2, 4],        // Node 1 → 2, 4
  [1, 3, 5],     // Node 2 → 1, 3, 5
  [2, 5, 8],     // Node 3 → 2, 5, 8
  [1, 6, 7],     // Node 4 → 1, 6, 7
  [2, 3, 7],     // Node 5 → 2, 3, 7
  [4, 7, 9, 11], // Node 6 → 4, 7, 9, 11
  [4, 5, 6, 8],  // Node 7 → 4, 5, 6, 8
  [3, 7, 10],    // Node 8 → 3, 7, 10
  [6, 10, 11],   // Node 9 → 6, 10, 11
  [8, 9, 12],    // Node 10 → 8, 9, 12
  [6, 9],        // Node 11 → 6, 9
  [10],          // Node 12 → 10
];

const WORKER_NAMES = [
  'Rajesh Kumar',
  'Suresh Babu',
  'Manikandan S',
  'Arun Prasad',
  'Venkatesh R',
  'Dinesh Kumar',
];

const WORKER_GPS_BASE: { lat: number; lng: number }[] = [
  { lat: 13.0827, lng: 80.2707 }, // Chennai
  { lat: 13.0802, lng: 80.2720 },
  { lat: 13.0850, lng: 80.2690 },
  { lat: 13.0815, lng: 80.2735 },
  { lat: 13.0840, lng: 80.2710 },
  { lat: 13.0795, lng: 80.2680 },
];

// ── Random Helpers ──────────────────────────────────────────────────
function randomInRange(min: number, max: number, decimals = 1): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Generate Node Data ──────────────────────────────────────────────
export function generateNodes(count: number = 12): SensorNode[] {
  const nodes: SensorNode[] = [];
  for (let i = 0; i < count; i++) {
    const id = i + 1;
    // Mostly safe data with some variance
    const baseOxygen = 20.9;
    const oxygenVariance = Math.random() > 0.8 ? randomInRange(-6, -1) : randomInRange(-1, 0.5);
    const oxygen = Math.max(12, Number((baseOxygen + oxygenVariance).toFixed(1)));

    const toxicGas = Math.random() > 0.85 
      ? randomInRange(20, 80) 
      : randomInRange(0, 25);

    const temperature = Math.random() > 0.9 
      ? randomInRange(38, 55) 
      : randomInRange(22, 38);

    const humidity = randomInRange(40, 95);
    const status = classifySafety(oxygen, toxicGas, temperature);

    nodes.push({
      id,
      name: `Sewer Node ${id}`,
      oxygen,
      toxicGas,
      temperature,
      humidity,
      status,
      lastUpdated: new Date(),
      position: NODE_POSITIONS[i] || { x: 180, y: 50 + i * 40 },
      connections: NODE_CONNECTIONS[i] || [],
    });
  }
  return nodes;
}

// ── Generate Worker Data ────────────────────────────────────────────
let fallCount = 0;

export function generateWorkers(): Worker[] {
  return WORKER_NAMES.map((name, i) => {
    let hasFall = false;
    if (fallCount < 2 && Math.random() > 0.5) {
      hasFall = true;
      fallCount++;
    } else if (fallCount < 2 && i >= WORKER_NAMES.length - (2 - fallCount)) {
      // Force fall if we haven't reached 2 by the end
      hasFall = true;
      fallCount++;
    }

    const isIdle = !hasFall && Math.random() > 0.7;
    const baseGps = WORKER_GPS_BASE[i];
    
    return {
      id: `WRK-${String(i + 1).padStart(3, '0')}`,
      name,
      status: hasFall ? 'fall' : isIdle ? 'idle' : 'active',
      gps: {
        lat: baseGps.lat + randomInRange(-0.002, 0.002, 4),
        lng: baseGps.lng + randomInRange(-0.002, 0.002, 4),
      },
      imu: {
        accelerationX: hasFall ? randomInRange(8, 15, 2) : randomInRange(0, 2, 2),
        accelerationY: hasFall ? randomInRange(6, 12, 2) : randomInRange(0, 2, 2),
        accelerationZ: hasFall ? randomInRange(7, 14, 2) : randomInRange(9, 11, 2),
      },
      wristbandConnected: Math.random() > 0.1,
      lastMotion: new Date(Date.now() - Math.random() * (hasFall ? 300000 : 30000)),
      assignedNodes: [
        i * 2 + 1,
        Math.min(i * 2 + 2, 12),
      ],
      nearestNode: i * 2 + 1,
    };
  });
}

// ── Generate Alerts ─────────────────────────────────────────────────
let alertCounter = 0;

export function generateAlerts(nodes: SensorNode[], workers: Worker[]): Alert[] {
  const alerts: Alert[] = [];

  // Node-based alerts
  nodes.forEach(node => {
    if (node.status === 'danger') {
      if (node.oxygen !== null && node.oxygen < 16) {
        alerts.push({
          id: `ALT-${++alertCounter}`,
          type: 'oxygen',
          priority: 'critical',
          nodeId: node.id,
          message: `Low oxygen (${node.oxygen}%) at Node ${node.id}`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
      if (node.toxicGas !== null && node.toxicGas > 50) {
        alerts.push({
          id: `ALT-${++alertCounter}`,
          type: 'gas',
          priority: 'critical',
          nodeId: node.id,
          message: `High toxic gas (${node.toxicGas} ppm) at Node ${node.id}`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
      if (node.temperature !== null && node.temperature > 50) {
        alerts.push({
          id: `ALT-${++alertCounter}`,
          type: 'temperature',
          priority: 'high',
          nodeId: node.id,
          message: `High temperature (${node.temperature}°C) at Node ${node.id}`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
    } else if (node.status === 'warning') {
      const type = (node.oxygen !== null && node.oxygen < 19) ? 'oxygen' : (node.toxicGas !== null && node.toxicGas > 25) ? 'gas' : 'temperature';
      alerts.push({
        id: `ALT-${++alertCounter}`,
        type,
        priority: 'medium',
        nodeId: node.id,
        message: `Warning at Node ${node.id} — check conditions`,
        timestamp: new Date(),
        acknowledged: false,
      });
    }
  });

  // Worker fall alerts
  workers.forEach(worker => {
    if (worker.status === 'fall') {
      alerts.push({
        id: `ALT-${++alertCounter}`,
        type: 'fall',
        priority: 'critical',
        workerId: worker.id,
        workerName: worker.name,
        message: `Fall detected for ${worker.name} (${worker.id})`,
        timestamp: new Date(),
        gps: worker.gps,
        acknowledged: false,
      });
    }
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return alerts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
