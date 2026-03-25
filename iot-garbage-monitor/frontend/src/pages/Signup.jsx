import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'worker' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await signup(form);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/worker');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed';
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[420px] bg-slate-900 p-10 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 mb-auto">
          <div className="size-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">BinSense</span>
        </Link>
        <div className="py-12">
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            Join teams already running smarter cities.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Set up your BinSense account and start connecting IoT sensors to your waste management workflow.
          </p>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} BinSense</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="size-7 rounded-lg bg-teal-600 flex items-center justify-center">
              <Activity size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">BinSense</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
          <p className="text-sm text-slate-500 mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-teal-600 hover:underline font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Select
              label="Role"
              value={form.role}
              onChange={set('role')}
              options={[
                { value: 'worker', label: 'Worker' },
                { value: 'admin', label: 'Admin' },
              ]}
            />

            {errors.submit && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errors.submit}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
