import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all registration fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await register(name, email, 'student');
      navigate('/profile');
    } catch {
      setError('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-white flex items-center justify-center font-bold text-base mx-auto shadow-xs">
            SB
          </div>
          <h1 className="text-xl font-extrabold text-stone-900">Student Registration</h1>
          <p className="text-xs text-stone-500">
            Create your account to start diagnostic skill assessments and roadmap execution.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Smith"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jordan@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
            />
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
            Standard student registration creates a protected student role. Administrative roles are provisioned exclusively on the backend server.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Register as Student'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-[#0F382C] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
