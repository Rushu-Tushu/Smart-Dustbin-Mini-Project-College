import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const empty = { binId: '', location: '', fillLevel: 0, assignedWorker: '' };

export default function BinFormModal({ isOpen, onClose, onSubmit, bin = null }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);

  const isEdit = Boolean(bin);

  useEffect(() => {
    if (isOpen) {
      setForm(
        bin
          ? {
              binId: bin.binId,
              location: bin.location,
              fillLevel: bin.fillLevel,
              assignedWorker: bin.assignedWorker?._id || '',
            }
          : empty
      );
      setErrors({});
    }
  }, [isOpen, bin]);

  useEffect(() => {
    authAPI.getWorkers()
      .then(({ data }) => setWorkers(data.workers))
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!isEdit && !form.binId.trim()) errs.binId = 'Bin ID is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (form.fillLevel < 0 || form.fillLevel > 100) errs.fillLevel = 'Must be 0–100';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        fillLevel: Number(form.fillLevel),
        assignedWorker: form.assignedWorker || null,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const workerOptions = workers.map(w => ({ value: w._id, label: `${w.name} (${w.email})` }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Bin' : 'Add New Bin'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <Input
            label="Bin ID"
            placeholder="e.g. BIN-001"
            value={form.binId}
            onChange={set('binId')}
            error={errors.binId}
            hint="Unique identifier (will be uppercased)"
          />
        )}
        <Input
          label="Location"
          placeholder="e.g. Main Street, Gate 2"
          value={form.location}
          onChange={set('location')}
          error={errors.location}
        />
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">
            Fill Level: <span className="font-mono text-teal-600">{form.fillLevel}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={form.fillLevel}
            onChange={set('fillLevel')}
            className="w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
          {errors.fillLevel && <p className="text-xs text-red-500 mt-1">{errors.fillLevel}</p>}
        </div>
        <Select
          label="Assign Worker (optional)"
          value={form.assignedWorker}
          onChange={set('assignedWorker')}
          placeholder="— Unassigned —"
          options={workerOptions}
        />

        {errors.submit && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.submit}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {isEdit ? 'Save changes' : 'Add bin'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
