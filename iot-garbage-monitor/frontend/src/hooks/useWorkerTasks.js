import { useState, useEffect, useCallback } from 'react';
import { workerAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useWorkerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await workerAPI.getTasks();
      setTasks(data.bins);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const markCleaned = async (id) => {
    const { data } = await workerAPI.markCleaned(id);
    setTasks(prev => prev.map(t => t._id === id ? data.bin : t));
    toast.success('Bin marked as cleaned! 🗑️');
    return data.bin;
  };

  return { tasks, loading, error, fetchTasks, markCleaned };
};
