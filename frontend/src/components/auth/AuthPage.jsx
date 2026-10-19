import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const AuthPage = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Quick fill demo accounts from the backend seeders
  const fillDemoAccount = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg('');
    toast.info(`Kredensial ${demoRole} terisi otomatis: ${demoEmail}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        toast.success(`Selamat datang kembali, ${res.data.name}!`);
      } else {
        const res = await register(name, email, password);
        toast.success(`Registrasi berhasil! Selamat datang, ${res.data.name}.`);
      }

      onSuccess && onSuccess();
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.message || 'Gagal memproses autentikasi.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand / Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            NikahDigital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Platform manajemen undangan digital & RSVP pernikahan
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-6 sm:p-8 shadow-xl border-slate-200/90 backdrop-blur-xs bg-white/95">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={User}
                required
              />
            )}

            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
              required
            />

            <div className="relative">
              <Input
                label="Kata Sandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              {mode === 'login' ? 'Masuk ke Dashboard' : 'Buat Akun Saya'}
            </Button>
          </form>

          {/* Quick Demo Seeders Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Akun Demo dari Seeder Database:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@undangan.id', 'Admin')}
                className="p-2.5 text-left rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-bold text-indigo-900">Admin</span>
                  <Badge variant="primary" size="sm">Admin</Badge>
                </div>
                <p className="text-[10px] text-slate-500 truncate">admin@undangan.id</p>
                <p className="text-[10px] text-indigo-600 font-mono mt-0.5">password123</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('client@undangan.id', 'User')}
                className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-bold text-slate-800">User / Client</span>
                  <Badge variant="default" size="sm">User</Badge>
                </div>
                <p className="text-[10px] text-slate-500 truncate">client@undangan.id</p>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">password123</p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
