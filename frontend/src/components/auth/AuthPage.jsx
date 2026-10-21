import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Button, Input, Card } from '../ui';
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const AuthPage = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register' (mode register di-hide)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-lg font-bold text-slate-900">Masuk ke Akun</h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan email dan kata sandi untuk mengakses dashboard
            </p>
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
              Masuk ke Dashboard
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
