import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/worker');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

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
            Monitor your bins,<br />before they overflow.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Real-time IoT data meets smart waste management. Sign in to access your dashboard.
          </p>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} BinSense</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="size-7 rounded-lg bg-teal-600 flex items-center justify-center">
              <Activity size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">BinSense</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:underline font-medium">Sign up</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.submit && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errors.submit}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-slate-100 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-slate-400">Admin: admin@demo.com / admin123</p>
            <p className="text-xs text-slate-400">Worker: worker@demo.com / worker123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
