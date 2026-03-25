import { Link } from 'react-router-dom';
import {
  Activity, Wifi, Bell, BarChart3, Zap, Shield, Globe,
  ArrowRight, CheckCircle, ChevronRight, Recycle
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    desc: 'Track fill levels across all bins in your city with live sensor data updated every few seconds.',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    desc: 'Get notified the moment a bin exceeds threshold — preventing overflows before they happen.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    desc: 'Understand usage patterns, peak hours, and optimize collection routes with data insights.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Admins manage the full fleet. Workers see only their assigned tasks. Clean, secure separation.',
  },
  {
    icon: Zap,
    title: 'Efficient Routing',
    desc: 'Stop wasting fuel on half-empty bins. Only dispatch trucks when bins actually need collection.',
  },
  {
    icon: Globe,
    title: 'Smart City Ready',
    desc: 'Built with open IoT standards and REST APIs, ready to integrate into any smart city platform.',
  },
];

const steps = [
  { num: '01', title: 'Sensors Installed', desc: 'Ultrasonic sensors fitted inside each bin measure garbage height in real time.' },
  { num: '02', title: 'Data Transmitted', desc: 'Microcontrollers (ESP32/Arduino) send fill-level data to our cloud API via Wi-Fi or GPRS.' },
  { num: '03', title: 'Dashboard Updated', desc: 'The BinSense dashboard processes, stores and visualizes the sensor readings instantly.' },
  { num: '04', title: 'Workers Dispatched', desc: 'When a bin turns red, the nearest available worker is automatically notified and assigned.' },
];

const benefits = [
  'Reduce collection cost by up to 40%',
  'Eliminate overflowing bins',
  'Lower carbon emissions',
  'Data-driven route optimization',
  'Improve citizen satisfaction',
  'Scale to thousands of bins',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Activity size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">BinSense</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient grid-pattern relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-xs font-medium mb-8">
            <Wifi size={12} />
            IoT-Powered Smart Waste Management
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-6">
            Smarter bins.<br />
            <span className="text-teal-600">Cleaner cities.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            BinSense connects IoT sensors to a real-time monitoring dashboard — so your waste
            management team collects bins only when they're full, never before.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 hover:-translate-y-0.5"
            >
              Start monitoring free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm transition-all hover:bg-slate-50"
            >
              Sign in
              <ChevronRight size={14} className="text-slate-400" />
            </Link>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 overflow-hidden">
              {/* Mock dashboard header */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
                <div className="size-3 rounded-full bg-red-300" />
                <div className="size-3 rounded-full bg-yellow-300" />
                <div className="size-3 rounded-full bg-green-300" />
                <span className="ml-3 text-xs text-slate-400 font-mono">binsense.io/dashboard</span>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Total Bins', value: '48', color: 'teal' },
                    { label: 'Full Bins', value: '7', color: 'red' },
                    { label: 'Pending', value: '12', color: 'yellow' },
                  ].map((card) => (
                    <div key={card.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.color === 'teal' ? 'text-teal-600' : card.color === 'red' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Mock table rows */}
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    {['Bin ID', 'Location', 'Fill Level', 'Status'].map(h => (
                      <span key={h} className="text-xs font-medium text-slate-400">{h}</span>
                    ))}
                  </div>
                  {[
                    { id: 'BIN-001', loc: 'Main Street', level: 87, status: 'full' },
                    { id: 'BIN-002', loc: 'Park Avenue', level: 52, status: 'medium' },
                    { id: 'BIN-003', loc: 'Bus Terminal', level: 18, status: 'low' },
                  ].map((row) => (
                    <div key={row.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-slate-50 items-center">
                      <span className="text-xs font-mono text-slate-700">{row.id}</span>
                      <span className="text-xs text-slate-500">{row.loc}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${row.status === 'full' ? 'bg-red-400' : row.status === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`}
                            style={{ width: `${row.level}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-500">{row.level}%</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'full' ? 'status-full' : row.status === 'medium' ? 'status-medium' : 'status-low'}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage waste, smarter</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From real-time sensor data to worker dispatch — BinSense gives your team complete operational control.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="size-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <Icon size={18} className="text-teal-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">From sensor to action in seconds</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              A simple, reliable flow that keeps your city clean without wasted effort.
            </p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ num, title, desc }) => (
                <div key={num} className="text-center">
                  <div className="size-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold shadow-lg shadow-slate-900/10">
                    {num}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-3">Benefits</p>
              <h2 className="text-3xl font-bold mb-5 leading-tight">
                Built for the cities of tomorrow
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Smart waste management isn't just about cleanliness — it's about sustainability,
                efficiency, and using data to make better decisions for your community.
              </p>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle size={16} className="text-teal-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:flex items-center justify-center hidden">
              <div className="relative size-64">
                <div className="absolute inset-0 rounded-full bg-teal-600/10 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-4 rounded-full bg-teal-600/15" />
                <div className="absolute inset-8 rounded-full bg-teal-600/20 flex items-center justify-center">
                  <Recycle size={64} className="text-teal-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to modernize your waste management?</h2>
          <p className="text-slate-500 mb-8">Set up your monitoring dashboard in minutes. No hardware required to get started.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-0.5"
          >
            Create your account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-teal-600 flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">BinSense</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} BinSense — IoT-Based Garbage Level Monitoring System
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-700 transition-colors">Login</Link>
            <Link to="/signup" className="text-xs text-slate-400 hover:text-slate-700 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
