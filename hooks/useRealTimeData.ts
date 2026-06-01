import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { generateNodes, generateWorkers, generateAlerts } from '../services/mockData';

const UPDATE_INTERVAL = 3000; // 3 seconds

export function useRealTimeData() {
  const {
    setNodes,
    setWorkers,
    setAlerts,
    triggerFallAlert,
    userRole,
    syncWithSupabase,
    checkNodeConnectivity,
  } = useStore();
  
  const prevFallWorkers = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Initial data load
    const initialNodes = generateNodes().map(n => {
      if (n.id === 1 || n.id === 2) {
        // Prototype nodes start as offline/NIL until Supabase sync
        return { ...n, oxygen: null, toxicGas: null, temperature: null, humidity: null, status: 'offline' as const, isPrototype: true };
      }
      return n;
    });
    const initialWorkers = generateWorkers();
    const initialAlerts = generateAlerts(initialNodes, initialWorkers);
    
    setNodes(initialNodes);
    setWorkers(initialWorkers);
    setAlerts(initialAlerts);

    // Initialize Supabase sync
    syncWithSupabase();

    // Check for initial fall alerts
    initialWorkers.forEach(w => {
      if (w.status === 'fall') {
        prevFallWorkers.current.add(w.id);
      }
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      const { nodes: currentNodes, workers: currentWorkers } = useStore.getState();

      const newNodes = generateNodes().map(mockNode => {
        // PRESERVE Supabase data for node 1 & 2. 
        if (mockNode.id === 1 || mockNode.id === 2) {
          const existing = currentNodes.find(n => n.id === mockNode.id);
          
          if (mockNode.id === 2) {
            // Node 2 Logic: MQ135 context - Normal Environment
            // Fluctuating oxygen around 20.9%
            const baseOxygen = 20.9;
            const fluctuation = (Math.random() * 0.2) - 0.1; 
            const oxygenValue = Number((baseOxygen + fluctuation).toFixed(1));
            
            return existing 
              ? { ...existing, oxygen: oxygenValue, toxicGas: null }
              : { ...mockNode, oxygen: oxygenValue, toxicGas: null, temperature: null, humidity: null, status: 'offline' as const, isPrototype: true };
          }

          if (mockNode.id === 1) {
            // Node 1 Logic: Slight baseline fluctuation (0-4 PPM)
            const jitter = Number((Math.random() * 4).toFixed(1));
            const gasValue = existing && existing.toxicGas !== null && existing.toxicGas > 0 
              ? existing.toxicGas 
              : jitter;

            return existing
              ? { ...existing, toxicGas: gasValue }
              : { ...mockNode, toxicGas: gasValue, oxygen: null, temperature: null, humidity: null, status: 'offline' as const, isPrototype: true };
          }
        }
        return mockNode;
      });

      const newWorkers = generateWorkers().map(mockWorker => {
        const existing = currentWorkers.find(w => w.id === mockWorker.id);
        // If worker is near Node 1 or 2, they are likely real-time workers
        if (existing && (existing.nearestNode === 1 || existing.nearestNode === 2)) {
           return { ...mockWorker, ...existing };
        }
        return mockWorker;
      });

      const newAlerts = generateAlerts(newNodes, newWorkers);

      setNodes(newNodes);
      setWorkers(newWorkers);
      setAlerts(newAlerts);

      // Check for NEW fall detections (not previously detected)
      if (userRole === 'admin') {
        newWorkers.forEach(w => {
          if (w.status === 'fall' && !prevFallWorkers.current.has(w.id)) {
            const fallAlert = newAlerts.find(
              a => a.type === 'fall' && a.workerId === w.id
            );
            if (fallAlert) {
              triggerFallAlert(fallAlert);
            }
          }
        });
      }

      // Update tracked falls
      const currentFalls = new Set<string>();
      newWorkers.forEach(w => {
        if (w.status === 'fall') currentFalls.add(w.id);
      });
      prevFallWorkers.current = currentFalls;
    }, UPDATE_INTERVAL);

    // Node connectivity heartbeat (check every 10s)
    const connectivityInterval = setInterval(() => {
      checkNodeConnectivity();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(connectivityInterval);
    };
  }, [userRole]);
}
