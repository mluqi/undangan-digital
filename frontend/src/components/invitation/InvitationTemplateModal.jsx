import React, { useState } from 'react';
import { X, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { getTemplateComponent } from './templateRegistry';

export const InvitationTemplateModal = ({
  isOpen,
  onClose,
  invitation,
  guest,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen || !invitation) return null;

  const templateCode = invitation?.template?.template_code || invitation?.template_code || 'mildness';
  const TemplateComponent = getTemplateComponent(templateCode);

  const handleClose = () => {
    document.querySelectorAll('audio').forEach((el) => {
      try {
        el.pause();
      } catch {}
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div
        className={`relative w-full ${
          isFullScreen ? 'max-w-4xl h-[95vh]' : 'max-w-md h-[90vh]'
        } bg-stone-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-700 transition-all`}
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-950/90 border-b border-stone-800 text-stone-300 z-50">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-white">
              Preview Template: {invitation.client_name || templateCode}
            </span>
            {guest?.name && (
              <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium border border-amber-500/30">
                Tamu: {guest.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              title={isFullScreen ? 'Mode Ponsel' : 'Mode Layar Penuh'}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              title="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Dynamic Template View */}
        <div className="flex-1 overflow-y-auto bg-stone-900">
          <TemplateComponent
            invitation={invitation}
            guest={guest}
            rsvps={invitation.rsvps || []}
            isModalView={true}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

