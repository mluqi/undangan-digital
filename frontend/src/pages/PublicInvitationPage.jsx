import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Spinner, Button } from '../components/ui';
import { invitationService } from '../services/invitationService';
import { rsvpService } from '../services/rsvpService';
import { getTemplateComponent } from '../components/invitation/templateRegistry';
import { useToast } from '../components/ui/Toast';

export const PublicInvitationPage = ({ slug }) => {
  const toast = useToast();
  const [invitation, setInvitation] = useState(null);
  const [guest, setGuest] = useState(null);
  const [rsvpsList, setRsvpsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvitation();
  }, [slug]);

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
      setGuest(data?.guest || (to ? { name: to, category: 'Reguler', pax: 1 } : null));
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
    <div className="min-h-screen w-full bg-stone-950 flex justify-center lg:block overflow-x-hidden">
      <TemplateComponent
        invitation={invitation}
        guest={guest}
        rsvps={rsvpsList}
        onSubmitRsvp={handleRsvpSubmit}
      />
    </div>
  );
};
