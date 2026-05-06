import { useState, useEffect, useCallback } from 'react';
import { workerAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
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

  // Real-time updates: patch any task that was updated by IoT or admin
  useEffect(() => {
    const socket = connectSocket();

    socket.on('bin:updated', (updatedBin) => {
      setTasks(prev => prev.map(t => t._id === updatedBin._id ? updatedBin : t));
    });

    return () => {
      socket.off('bin:updated');
      disconnectSocket();
    };
  }, []);

  const markCleaned = async (id) => {
    const { data } = await workerAPI.markCleaned(id);
    // socket 'bin:updated' event will patch the task in state
    toast.success('Bin marked as cleaned! 🗑️');
    return data.bin;
  };

  return { tasks, loading, error, fetchTasks, markCleaned };
};
