import { create } from 'zustand';
import { SafetyStatus } from '../constants/theme';
import { SensorNode, Worker, Alert } from '../services/mockData';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AppState {
  // Auth
  userRole: 'admin' | 'employee' | null;
  userId: string;
  isAuthenticated: boolean;

  // Language
  language: 'en' | 'ta' | 'hi';

  // Data
  nodes: SensorNode[];
  workers: Worker[];
  alerts: Alert[];
  selectedNodeRange: string;
  selectedNodeIds: number[];

  // UI
  darkMode: boolean;
  showFallAlert: boolean;
  fallAlertData: Alert | null;

  // Actions
  login: (role: 'admin' | 'employee', id: string) => void;
  logout: () => void;
  setLanguage: (lang: 'en' | 'ta' | 'hi') => void;
  setNodes: (nodes: SensorNode[]) => void;
  setWorkers: (workers: Worker[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setSelectedNodeRange: (range: string) => void;
  setSelectedNodeIds: (ids: number[]) => void;
  toggleDarkMode: () => void;
  triggerFallAlert: (alert: Alert) => void;
  dismissFallAlert: () => void;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
  syncWithSupabase: () => void;
  checkNodeConnectivity: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Auth defaults
  userRole: null,
  userId: '',
  isAuthenticated: false,

  // Language default
  language: 'en',

  // Data defaults
  nodes: [],
  workers: [],
  alerts: [],
  selectedNodeRange: '1-5',
  selectedNodeIds: [1, 2, 3, 4, 5],

  // UI defaults
  darkMode: false,
  showFallAlert: false,
  fallAlertData: null,

  // Actions
  login: (role, id) => set({ userRole: role, userId: id, isAuthenticated: true }),
  logout: () => set({ userRole: null, userId: '', isAuthenticated: false }),
  setLanguage: (lang) => set({ language: lang }),
  setNodes: (nodes) => set({ nodes }),
  setWorkers: (workers) => set({ workers }),
  setAlerts: (alerts) => set({ alerts }),
  setSelectedNodeRange: (range) => set({ selectedNodeRange: range }),
  setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  triggerFallAlert: (alert) => set({ showFallAlert: true, fallAlertData: alert }),
  dismissFallAlert: () => set({ showFallAlert: false, fallAlertData: null }),
  acknowledgeAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    })),
  clearAlerts: () => set({ alerts: [] }),
  syncWithSupabase: async () => {
    if (!isSupabaseConfigured || !supabase) return;

    // 1. Initial Fetch (Nodes 1 & 2)
    const { data: initialNodes } = await supabase
      .from('nodes')
      .select('*')
      .in('id', [1, 2]);

    if (initialNodes) {
      set((state) => ({
        nodes: state.nodes.map((n) => {
          const dbNode = initialNodes.find((dn) => dn.id === n.id);
          if (!dbNode && (n.id === 1 || n.id === 2)) {
             return { ...n, oxygen: null, toxicGas: null, temperature: null, humidity: null, status: 'safe', isPrototype: true };
          }
          if (dbNode) {
            // Check if data is stale (over 30s old)
            const lastUpdate = new Date(dbNode.updated_at);
            const isStale = (Date.now() - lastUpdate.getTime()) > 30000;

            // Normalize status (Jetson sends "active: safe", app needs "safe")
            let status = dbNode.status || 'safe';
            if (typeof status === 'string' && status.includes(':')) {
              status = status.split(':').pop()?.trim() || 'safe';
            }

            return { 
              ...n, 
              ...dbNode, 
              toxicGas: dbNode.id === 2 ? null : dbNode.toxicGas, // Node 2 is MQ135 (No Toxic Gas/Methane)
              status: isStale ? 'offline' : (status as any),
              lastUpdated: lastUpdate,
              isPrototype: true 
            };
          }
          return n;
        }),
      }));
    }

    const { data: initialWorkers } = await supabase
      .from('workers')
      .select('*');

    if (initialWorkers) {
      set((state) => ({
        workers: state.workers.map((w) => {
          const dbWorker = initialWorkers.find((dw) => dw.id === w.id);
          if (!dbWorker) return w;
          return {
            ...w,
            status: dbWorker.status || w.status,
            gps: dbWorker.latitude && dbWorker.longitude 
              ? { lat: dbWorker.latitude, lng: dbWorker.longitude }
              : w.gps,
            imu: dbWorker.imu || w.imu,
            nearestNode: dbWorker.nearestNode || w.nearestNode,
          };
        }),
      }));
    }

    // 2. Real-time Subscriptions (Cleanup first to avoid "already subscribed" errors)
    await supabase.removeChannel(supabase.channel('public:nodes'));
    await supabase.removeChannel(supabase.channel('public:workers'));

    supabase
      .channel('public:nodes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nodes' }, (payload) => {
        set((state) => {
          const updatedNode = payload.new as any;
          if (updatedNode.id !== 1 && updatedNode.id !== 2) return state;
          
          const lastUpdate = new Date(updatedNode.updated_at);
          const isStale = (Date.now() - lastUpdate.getTime()) > 30000;

          // Normalize status (Jetson sends "active: safe", app needs "safe")
          let status = updatedNode.status || 'safe';
          if (typeof status === 'string' && status.includes(':')) {
            status = status.split(':').pop()?.trim() || 'safe';
          }

          return {
            nodes: state.nodes.map((n) => 
              n.id === updatedNode.id ? { 
                ...n, 
                ...updatedNode, 
                toxicGas: updatedNode.id === 2 ? null : updatedNode.toxicGas,
                status: isStale ? 'offline' : status as any,
                lastUpdated: lastUpdate,
                isPrototype: true 
              } : n
            ),
          };
        });
      })
      .subscribe();

    supabase
      .channel('public:workers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, (payload) => {
        set((state) => {
          const updatedWorker = payload.new as any;
          return {
            workers: state.workers.map((w) => {
              if (w.id !== updatedWorker.id) return w;
              return {
                ...w,
                status: updatedWorker.status || w.status,
                gps: updatedWorker.latitude && updatedWorker.longitude 
                  ? { lat: updatedWorker.latitude, lng: updatedWorker.longitude }
                  : w.gps,
                imu: updatedWorker.imu || w.imu,
                nearestNode: updatedWorker.nearestNode || w.nearestNode,
              };
            }),
          };
        });
      })
      .subscribe();
  },
  checkNodeConnectivity: () => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (!n.isPrototype) return n;
        const isStale = (Date.now() - n.lastUpdated.getTime()) > 30000;
        if (isStale && n.status !== 'offline') {
          return { ...n, status: 'offline' };
        }
        return n;
      }),
    }));
  },
}));

// ── Parse Node Range ─────────────────────────────────────────────────
export function parseNodeRange(input: string): number[] {
  const ids: number[] = [];
  const parts = input.split(',').map((s) => s.trim());
  
  for (const part of parts) {
    if (part.includes('-') || part.includes('–')) {
      const [start, end] = part.split(/[-–]/).map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          if (!ids.includes(i)) ids.push(i);
        }
      }
    } else {
      const num = Number(part);
      if (!isNaN(num) && !ids.includes(num)) ids.push(num);
    }
  }
  
  return ids.sort((a, b) => a - b);
}
