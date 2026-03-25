import { useState, useEffect, useCallback } from 'react';
import { binsAPI } from '../services/api';
import toast from 'react-hot-toast';

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

  const createBin = async (binData) => {
    const { data } = await binsAPI.create(binData);
    setBins(prev => [data.bin, ...prev]);
    setStats(prev => ({ ...prev, total: prev.total + 1 }));
    toast.success('Bin added successfully');
    return data.bin;
  };

  const updateBin = async (id, binData) => {
    const { data } = await binsAPI.update(id, binData);
    setBins(prev => prev.map(b => b._id === id ? data.bin : b));
    toast.success('Bin updated successfully');
    return data.bin;
  };

  const deleteBin = async (id) => {
    await binsAPI.delete(id);
    setBins(prev => prev.filter(b => b._id !== id));
    setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    toast.success('Bin removed');
  };

  return { bins, stats, loading, error, fetchBins, createBin, updateBin, deleteBin };
};
