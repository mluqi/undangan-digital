import React, { useState, useEffect } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Spinner, Button } from '../components/ui';
import { invitationService } from '../services/invitationService';
import { rsvpService } from '../services/rsvpService';
import { getTemplateComponent } from '../components/invitation/templateRegistry';
import { useToast } from '../components/ui/Toast';

export const PublicInvitationPage = ({ slug }) => {
  const toast = useToast();
  const [invitation, setInvitation] = useState(null);
  const [guest, setGuest] = useState(null);
  const [isGuestLocked, setIsGuestLocked] = useState(false);
  const [attemptedGuestName, setAttemptedGuestName] = useState('');
  const [rsvpsList, setRsvpsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvitation();
  }, [slug]);

  // Update dynamic Open Graph meta tags (OG Image, Title, Description) for WhatsApp/Social sharing
  useEffect(() => {
    if (!invitation) return;

    const content = invitation.content_json || {};
    const groom = content.mempelaiPria || 'Ahmad';
    const bride = content.mempelaiWanita || 'Aminah';
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('to');

    const pageTitle = guestParam
      ? `Undangan Pernikahan ${groom} & ${bride} — Khusus untuk ${guestParam}`
      : `The Wedding of ${groom} & ${bride}`;

    document.title = pageTitle;

    // Foto cover hero utama
    let coverImage = content.fotoCover;
    if (!coverImage && Array.isArray(content.galeri) && content.galeri.length > 0) {
      coverImage = content.galeri[0];
    }
    if (!coverImage) {
      coverImage =
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80';
    }

    // Pastikan foto cover ber-URL absolut (protokol http/https) agar dapat diambil oleh scraper WhatsApp
    if (coverImage.startsWith('/')) {
      const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
      coverImage = `${apiBase || window.location.origin}${coverImage}`;
    }

    const dateStr = content.akad?.tanggal || content.resepsi?.tanggal || '';
    const locStr = content.akad?.lokasi || content.resepsi?.lokasi || '';
    const desc = dateStr
      ? `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami pada ${dateStr} di ${locStr}.`
      : 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu di hari bahagia kami.';

    const setMetaTag = (attr, key, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    setMetaTag('property', 'og:site_name', 'NikahDigital');
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:image', coverImage);
    setMetaTag('property', 'og:image:secure_url', coverImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:type', 'image/jpeg');
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', window.location.href);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', coverImage);
  }, [invitation]);

  const loadInvitation = async () => {
    setIsLoading(true);
    setError(null);

    // Parse URL search parameters (?to=...&code=...&guestId=...)
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to') || '';
    const code = params.get('code') || '';
    const guestId = params.get('guestId') || '';

    try {
      const res = await invitationService.getBySlug(slug, { to, code, guestId });
      const data = res?.data;
      setInvitation(data);

      const isLocked = Boolean(data?.content_json?.lockGuestList || data?.guest_locked);
      // Jika proteksi lockGuestList aktif dan data tamu tidak terdaftar di database (dan bukan live demo id === 0)
      if (isLocked && !data?.guest && data?.id !== 0) {
        setIsGuestLocked(true);
        setAttemptedGuestName(to);
        setGuest(null);
      } else {
        setIsGuestLocked(false);
        setAttemptedGuestName('');
        setGuest(data?.guest || (to ? { name: to, category: 'Reguler', pax: 1 } : null));
      }

      setRsvpsList(data?.rsvps || []);
    } catch (err) {
      console.error('Error fetching invitation:', err);
      setError(err.message || 'Undangan tidak ditemukan atau telah kedaluwarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRsvpSubmit = async (newRsvp) => {
    if (!invitation?.id) return;
    try {
      await rsvpService.submit({
        invitation_id: invitation.id,
        guest_name: newRsvp.guest_name,
        attendance_status: newRsvp.attendance_status,
        message: newRsvp.message,
      });
    } catch (err) {
      console.error('Failed to persist RSVP to backend:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-800">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm font-serif text-stone-600 tracking-wider">
            Mempersiapkan Undangan Pernikahan...
          </p>
        </div>
      </div>
    );
  }

  if (isGuestLocked && invitation) {
    const groom = invitation.content_json?.mempelaiPria || 'Mempelai Pria';
    const bride = invitation.content_json?.mempelaiWanita || 'Mempelai Wanita';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-950 text-center text-white relative overflow-hidden select-none">
        {/* Background decorative ambiance */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-widest font-mono text-amber-400 font-semibold">
              Privasi & Keamanan Undangan
            </p>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
              Akses Undangan Terkunci
            </h2>
            <p className="text-xs text-stone-400 font-serif italic">
              The Wedding of {groom} & {bride}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-stone-300 text-xs leading-relaxed space-y-2 text-left">
            {attemptedGuestName ? (
              <p>
                Mohon maaf, nama <span className="font-semibold text-amber-300 font-sans">"{attemptedGuestName}"</span> tidak ditemukan dalam daftar tamu resmi mempelai.
              </p>
            ) : (
              <p>
                Undangan ini dikhususkan secara privat hanya bagi tamu undangan yang telah terdaftar secara resmi oleh mempelai.
              </p>
            )}
            <p className="text-stone-400 text-[11px]">
              Demi kenyamanan dan ketertiban acara, mohon pastikan Anda membuka tautan resmi yang telah dibagikan langsung oleh mempelai melalui pesan WhatsApp.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="outline"
              className="w-full text-xs text-stone-300 border-white/15 hover:bg-white/10"
              onClick={() => (window.location.href = '/')}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-900 text-center text-white">
        <div className="max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-amber-200">Undangan Tidak Ditemukan</h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            {error || 'Tautan undangan yang Anda tuju mungkin salah atau telah dinonaktifkan.'}
          </p>
          <Button variant="primary" onClick={() => (window.location.href = '/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const templateCode = invitation?.template?.template_code || 'mildness';
  const TemplateComponent = getTemplateComponent(templateCode);

  return (
    <div className="min-h-screen w-full bg-stone-950 flex justify-center md:block lg:block overflow-x-hidden">
      <TemplateComponent
        invitation={invitation}
        guest={guest}
        rsvps={rsvpsList}
        onSubmitRsvp={handleRsvpSubmit}
      />
    </div>
  );
};
