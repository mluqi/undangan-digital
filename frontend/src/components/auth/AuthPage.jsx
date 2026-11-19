import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { DelleaLogo } from '../ui/DelleaLogo';

export const AuthPage = ({ onSuccess, onBackToHome, hideBackToHome = false }) => {
  const { login, register } = useAuth();
  const toast = useToast();

  const [mode] = useState('login');
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
      setErrorMsg('Email dan kata sandi wajib diisi.');
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

  const handleBack = (e) => {
    e.preventDefault();
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      className="min-h-screen flex bg-[#E6D2BE] text-[#2B0C0C] selection:bg-[#4A1515] selection:text-[#E6D2BE]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Left Column: Official Mulberry Burgundy Brand Plate (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#4A1515] p-12 border-r border-[#C9A98B] flex-col justify-between">
        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-[#633A2C]">
          <a href="/" onClick={handleBack} className="focus:outline-none">
            <DelleaLogo variant="horizontal" theme="light" size="sm" />
          </a>

          {!hideBackToHome && (
            <a
              href="/"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#E6D2BE] hover:text-[#C9A98B] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </a>
          )}
        </div>

        {/* Center Stacked Official Brand Crest */}
        <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center">
          <DelleaLogo variant="stacked" theme="light" size="xl" />
        </div>

        {/* Bottom Editorial Caption */}
        <div className="relative z-10 max-w-md pt-6 border-t border-[#633A2C] space-y-2">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A98B]">
            Eternal ☾ Journeys — Digital &amp; Paper Invitations
          </p>
          <p className="text-xs text-[#D8BFA6] leading-relaxed">
            Ruang pengelolaan undangan pernikahan digital mandiri, sinkronisasi QR
            Check-In sistem eksternal, serta manajemen daftar tamu VVIP, VIP,
            Reguler, dan Grup.
          </p>
        </div>
      </div>

      {/* Right Column: Champagne Sand Architectural Sign-In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#E6D2BE]">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-[#C9A98B]">
          {!hideBackToHome ? (
            <a
              href="/"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#4A1515] hover:text-[#2B0C0C] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke SAMSKARA</span>
            </a>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#4A1515]">
              SAMSKARA Portal
            </span>
          )}
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#633A2C]">
            Akses Klien &amp; Admin
          </span>
        </div>

        {/* Center Sign-In Ledger */}
        <div className="w-full max-w-md mx-auto my-12">
          <div className="mb-8">
            <div className="mb-4 lg:hidden">
              <DelleaLogo variant="mark" theme="dark" size="lg" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#4A1515] font-semibold mb-2">
              Autentikasi Akun
            </p>
            <h1
              className="text-4xl sm:text-5xl font-normal text-[#2B0C0C] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Masuk ke <span className="italic text-[#4A1515]">SAMSKARA</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-[#3B1010] mt-2">
              Gunakan alamat email dan kata sandi yang terdaftar untuk mengelola
              undangan Anda.
            </p>
          </div>

          <div className="border border-[#C9A98B] bg-[#E0D6B8] p-7 sm:p-9">
            {errorMsg && (
              <div
                role="alert"
                className="mb-6 p-3.5 border border-[#800000] bg-[#4A1515] text-xs text-[#E6D2BE] font-medium leading-relaxed"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B1010] mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#E6D2BE] border border-[#C9A98B] text-sm text-[#2B0C0C] placeholder:text-[#633A2C]/60 focus:outline-none focus:border-[#3B1010] transition-colors"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B1010] mb-2"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  spellCheck="false"
                  enterKeyHint="next"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#E6D2BE] border border-[#C9A98B] text-sm text-[#2B0C0C] placeholder:text-[#633A2C]/60 focus:outline-none focus:border-[#3B1010] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="current-password"
                  className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B1010] mb-2"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    enterKeyHint="done"
                    required
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 bg-[#E6D2BE] border border-[#C9A98B] text-sm text-[#2B0C0C] placeholder:text-[#633A2C]/60 focus:outline-none focus:border-[#3B1010] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#633A2C] hover:text-[#2B0C0C] cursor-pointer"
                    aria-label={
                      showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                    title={
                      showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-4 px-6 bg-[#3B1010] hover:bg-[#4A1515] disabled:opacity-60 text-[#E6D2BE] text-xs uppercase tracking-[0.22em] font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Panel Akun'}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A98B]" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-[#C9A98B] flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#633A2C]">
          <span>© {new Date().getFullYear()} SAMSKARA</span>
          <span>Eternal ☾ Memories</span>
        </div>
      </div>
    </div>
  );
};
