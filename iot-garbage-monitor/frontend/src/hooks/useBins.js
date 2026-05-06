import { useState, useEffect, useCallback } from 'react';
import { binsAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

function computeStats(bins) {
  return {
    total: bins.length,
    full: bins.filter(b => b.status === 'full').length,
    medium: bins.filter(b => b.status === 'medium').length,
    low: bins.filter(b => b.status === 'low').length,
  };
}

export const useBins = () => {
  const [bins, setBins] = useState([]);
  const [stats, setStats] = useState({ total: 0, full: 0, medium: 0, low: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await binsAPI.getAll();
      setBins(data.bins);
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBins(); }, [fetchBins]);

  // Real-time updates via WebSocket
  useEffect(() => {
    const socket = connectSocket();

    socket.on('bin:updated', (updatedBin) => {
      setBins(prev => {
        const next = prev.map(b => b._id === updatedBin._id ? updatedBin : b);
        setStats(computeStats(next));
        return next;
      });
    });

    socket.on('bin:created', (newBin) => {
      setBins(prev => {
        const next = [newBin, ...prev];
        setStats(computeStats(next));
        return next;
      });
    });

    socket.on('bin:deleted', (deletedId) => {
      setBins(prev => {
        const next = prev.filter(b => b._id !== deletedId);
        setStats(computeStats(next));
        return next;
      });
    });

    return () => {
      socket.off('bin:updated');
      socket.off('bin:created');
      socket.off('bin:deleted');
      disconnectSocket();
    };
  }, []);

  const createBin = async (binData) => {
    const { data } = await binsAPI.create(binData);
    // socket 'bin:created' event updates state; no local setState needed
    toast.success('Bin added successfully');
    return data.bin;
  };

  const updateBin = async (id, binData) => {
    const { data } = await binsAPI.update(id, binData);
    // socket 'bin:updated' event updates state
    toast.success('Bin updated successfully');
    return data.bin;
  };

  const deleteBin = async (id) => {
    await binsAPI.delete(id);
    // socket 'bin:deleted' event updates state
    toast.success('Bin removed');
  };

  return { bins, stats, loading, error, fetchBins, createBin, updateBin, deleteBin };
};
