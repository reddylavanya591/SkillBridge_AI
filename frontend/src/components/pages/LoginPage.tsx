import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogIn, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await login(email);
      navigate('/dashboard');
    } catch {
      setError('Failed to sign in. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, role: 'student' | 'admin') => {
    setIsLoading(true);
    await login(demoEmail, role);
    setIsLoading(false);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-white flex items-center justify-center font-bold text-base mx-auto shadow-xs">
            SB
          </div>
          <h1 className="text-xl font-extrabold text-stone-900">Sign in to SkillBridge AI</h1>
          <p className="text-xs text-stone-500">
            Access your assessments, skill gap matrices, and personalized roadmaps.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            Password reset link dispatched to {email || 'your registered address'}.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@skillbridge.io"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => setResetSent(true)}
                className="text-[11px] text-[#0F382C] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Roles for Rapid Verification */}
        <div className="pt-4 border-t border-stone-200 space-y-2.5">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center">
            Instant Demo Profiles
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('student@skillbridge.io', 'student')}
              className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left transition-colors text-xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <UserCheck className="w-3.5 h-3.5 text-[#0F382C]" />
                <span>Alex Rivera</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Role: Student</p>
            </button>

            <button
              onClick={() => handleDemoLogin('rajusurna18@gmail.com', 'admin')}
              className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left transition-colors text-xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Raju Surna</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Role: Administrator</p>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500">
          <span>New student? </span>
          <Link to="/register" className="font-bold text-[#0F382C] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
