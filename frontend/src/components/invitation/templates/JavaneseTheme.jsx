import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Send,
  Navigation,
  Bell,
} from 'lucide-react';
import { Badge } from '../../ui';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { GalleryLightbox } from '../GalleryLightbox';
import { Reveal } from '../Reveal';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';

/**
 * TEMA JAWA — "Keraton Jawa"
 * Palet: coklat sogan, emas, krem gading, merah bata.
 * Motif: batik kawung, gunungan, panel tirai pembuka.
 * Kode template di database: `jawa-keraton`
 */

const C = {
  sogan: '#2A1810',
  soganSoft: '#3B2416',
  gold: '#C9A24B',
  goldSoft: '#E3C987',
  cream: '#F3E7CF',
  creamDeep: '#EADBBC',
  maroon: '#7A2E2A',
};

const Gunungan = ({ className = '', size = 120 }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 100 140"
    fill="none"
    stroke={C.gold}
    strokeWidth="1.3"
    className={className}
    aria-hidden="true"
  >
    <path d="M50 4C58 24 74 34 80 56c6 24 4 52-4 80H24c-8-28-10-56-4-80C26 34 42 24 50 4Z" />
    <path d="M50 22c5 14 16 22 20 38 4 18 3 44-3 66H33c-6-22-7-48-3-66 4-16 15-24 20-38Z" strokeOpacity="0.6" />
    <path d="M50 52c-8 8-12 18-10 30 1 8 5 14 10 18 5-4 9-10 10-18 2-12-2-22-10-30Z" fill={C.gold} fillOpacity="0.12" />
    <circle cx="50" cy="78" r="3.2" fill={C.gold} />
    <path d="M24 136h52M30 126h40" strokeOpacity="0.5" />
  </svg>
);

const Divider = ({ light = false }) => (
  <div className="flex items-center justify-center gap-3 my-4" aria-hidden="true">
    <span className="h-px w-14" style={{ background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
    <span
      className="w-2 h-2 rotate-45"
      style={{ background: light ? C.goldSoft : C.gold }}
    />
    <span className="h-px w-14" style={{ background: `linear-gradient(270deg, transparent, ${C.gold})` }} />
  </div>
);

const SectionTitle = ({ aksara, eyebrow, title, light = false }) => (
  <div className="text-center space-y-1">
    {aksara && (
      <p className="font-javanese text-xl" style={{ color: C.gold }}>
        {aksara}
      </p>
    )}
    <p
      className="font-cinzel text-[11px] tracking-[0.35em] uppercase"
      style={{ color: light ? C.goldSoft : C.maroon }}
    >
      {eyebrow}
    </p>
    <h2
      className="font-editorial text-4xl leading-tight"
      style={{ color: light ? C.cream : C.sogan }}
    >
      {title}
    </h2>
    <Divider light={light} />
  </div>
);

const GoldFrame = ({ children, className = '' }) => (
  <div className={`relative p-1.5 ${className}`} style={{ border: `1px solid ${C.gold}` }}>
    <div className="p-5 relative" style={{ border: `1px solid ${C.gold}66` }}>
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} w-2 h-2 rotate-45 -m-1`}
          style={{ background: C.gold }}
        />
      ))}
      {children}
    </div>
  </div>
);

const EventCard = ({ label, info, mapLabel, calendarUrl }) => (
  <Reveal>
    <GoldFrame className="bg-[#FBF3E1]">
      <div className="text-center space-y-3">
        <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: C.maroon }}>
          {label.eyebrow}
        </p>
        <h3 className="font-editorial text-3xl" style={{ color: C.sogan }}>
          {label.title}
        </h3>
        <div className="space-y-1.5 text-sm" style={{ color: C.soganSoft }}>
          <p className="flex items-center justify-center gap-2 font-semibold">
            <Calendar className="w-4 h-4" style={{ color: C.gold }} />
            {info.tanggal}
          </p>
          <p className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" style={{ color: C.gold }} />
            {info.waktu}
          </p>
        </div>
        <Divider />
        <div className="space-y-1">
          <p className="font-semibold text-sm flex items-center justify-center gap-1.5" style={{ color: C.sogan }}>
            <MapPin className="w-4 h-4" style={{ color: C.maroon }} />
            {info.lokasi}
          </p>
          {info.alamat && <p className="text-xs leading-relaxed text-[#6B5242]">{info.alamat}</p>}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <a
            href={info.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(info.lokasi)}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors"
            style={{ background: C.sogan, color: C.cream }}
          >
            <Navigation className="w-3.5 h-3.5" /> {mapLabel}
          </a>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors hover:bg-[#EADBBC]"
            style={{ border: `1px solid ${C.gold}`, color: C.sogan }}
          >
            <Bell className="w-3.5 h-3.5" /> Simpan ke Kalender
          </a>
        </div>
      </div>
    </GoldFrame>
  </Reveal>
);

export const JavaneseTheme = (props) => {
  const d = useInvitationData(props);
  const [coverGone, setCoverGone] = useState(false);

  useEffect(() => {
    if (!d.isOpened) return;
    const t = setTimeout(() => setCoverGone(true), 1700);
    return () => clearTimeout(t);
  }, [d.isOpened]);

  const countdown = [
    ['Hari', d.timeLeft.days],
    ['Jam', d.timeLeft.hours],
    ['Menit', d.timeLeft.minutes],
    ['Detik', d.timeLeft.seconds],
  ];

  return (
    <div
      className={`relative w-full max-w-lg md:max-w-none md:w-full lg:max-w-none lg:w-[480px] xl:w-[520px] ${d.isOpened ? 'min-h-screen md:w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0' : 'h-screen max-h-screen overflow-hidden mx-auto md:w-full lg:w-[480px] xl:w-[520px]'} font-editorial shadow-2xl selection:bg-[#C9A24B]/40 scroll-smooth`}
      style={{ background: C.cream, color: C.sogan }}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="jawa"
        invitationData={d}
        isOpened={d.isOpened}
        isModalView={props?.isModalView}
      />
      {d.isOpened && (
        <MusicVinylPlayer
          musicUrl={d.musicUrl}
          musicTitle={d.musicTitle}
          isPlaying={d.isPlayingMusic}
          onToggle={d.toggleMusic}
          position="bottom-right"
          theme="gold"
          accentColor="#C9A24B"
        />
      )}

      {/* Floating Bookmark QR Pass & Floating Scroll To Top */}
      <InvitationFloatingControls
        qrValue={d.qrValue}
        guestName={d.guestName}
        guestCategory={d.guestCategory}
        guestPax={d.guestPax}
        isOpened={d.isOpened}
        showQr={d.showQr}
        theme="gold"
        accentColor={C.gold}
      />

      {/* ===================== COVER: TIRAI PEMBUKA ===================== */}
      {!coverGone && (
        <div className={`fixed inset-0 z-50 ${d.isOpened ? 'curtain-open pointer-events-none' : ''}`}>
          <div
            className="curtain-left absolute inset-y-0 left-0 w-1/2 bg-kawung"
            style={{ background: C.sogan, borderRight: `1px solid ${C.gold}` }}
          >
            <div className="absolute inset-0 bg-kawung" />
          </div>
          <div
            className="curtain-right absolute inset-y-0 right-0 w-1/2"
            style={{ background: C.sogan, borderLeft: `1px solid ${C.gold}` }}
          >
            <div className="absolute inset-0 bg-kawung" />
          </div>

          <div
            className={`relative z-10 h-full w-full max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between py-8 sm:py-10 md:py-16 px-6 sm:px-8 gap-8 text-center md:text-left transition-opacity duration-500 overflow-y-auto ${
              d.isOpened ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Left Column: Gunungan & Mempelai */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-4 my-auto">
              <Gunungan className="animate-breathe" size={110} />
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-1" style={{ color: C.goldSoft }}>
                  Pawiwahan Ageng
                </p>
                <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl leading-[1.05]" style={{ color: C.cream }}>
                  {d.groomShort}
                  <span className="block md:inline-block text-2xl sm:text-3xl md:text-4xl italic my-1 md:my-0 md:mx-2" style={{ color: C.gold }}>
                    &amp;
                  </span>
                  {d.brideShort}
                </h1>
                <p className="pt-2 text-xs sm:text-sm tracking-wider" style={{ color: C.goldSoft }}>
                  {d.akad.tanggal}
                </p>
              </div>
            </div>

            {/* Right Column: Tamu & Tombol Buka Undangan */}
            <div className="w-full md:w-5/12 max-w-sm mx-auto md:mx-0 space-y-5 my-auto">
              <div className="py-4 px-5 rounded-xl space-y-2 text-center md:text-left shadow-2xl" style={{ border: `1px solid ${C.gold}88`, background: '#00000045' }}>
                <p className="text-[11px] tracking-wide" style={{ color: C.goldSoft }}>
                  Katur Dumateng Panjenenganipun:
                </p>
                <p className="font-editorial text-2xl sm:text-3xl mt-1 flex items-center justify-center md:justify-start gap-2" style={{ color: C.cream }}>
                  {d.guestName}
                  {d.isVip && <Badge variant="warning" size="sm" className="font-sans text-[10px]">VIP</Badge>}
                </p>
                <p className="text-[10px] italic" style={{ color: '#D5C4A1' }}>
                  *Wonten ing Palenggahan / Nyuwun pangapunten menawi wonten kalepatan asma/gelar
                </p>
              </div>

              <button
                type="button"
                onClick={d.openInvitation}
                className="w-full py-4 font-cinzel text-xs tracking-[0.35em] uppercase font-bold cursor-pointer transition-all active:scale-[0.98] hover:brightness-110 shadow-2xl flex items-center justify-center gap-2"
                style={{ background: C.gold, color: C.sogan }}
              >
                <span>Buka Undangan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== HERO ===================== */}
      <section className="relative" style={{ background: C.sogan }}>
        <div className="absolute inset-0 bg-kawung opacity-70" />
        <div className="relative px-8 pt-14 pb-20 text-center space-y-6">
          <Reveal>
            <p className="font-cinzel text-[11px] tracking-[0.4em] uppercase" style={{ color: C.goldSoft }}>
              Hari Bahagia
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div
              className="mx-auto w-56 h-72 p-1.5 rounded-t-[999px] animate-drift-slow"
              style={{ border: `1px solid ${C.gold}` }}
            >
              <div className="w-full h-full rounded-t-[999px] overflow-hidden" style={{ border: `1px solid ${C.gold}88` }}>
                <img src={d.photoCover} alt="Foto mempelai" className="w-full h-full object-cover" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <h2 className="font-editorial text-5xl leading-tight" style={{ color: C.cream }}>
              {d.groomShort} <span className="italic" style={{ color: C.gold }}>&amp;</span> {d.brideShort}
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase mt-2" style={{ color: C.goldSoft }}>
              {d.akad.tanggal}
            </p>
          </Reveal>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 24" preserveAspectRatio="none" height="24" aria-hidden="true">
          <path d="M0 24V12c25 0 25-12 50-12s25 12 50 12 25-12 50-12 25 12 50 12 25-12 50-12 25 12 50 12 25-12 50-12 25 12 50 12V24Z" fill={C.cream} />
        </svg>
      </section>

      {/* ===================== SALAM & AYAT ===================== */}
      <section className="px-7 py-14 bg-kawung-dark text-center space-y-5">
        <Reveal>
          <p className="font-arabic text-3xl leading-loose" style={{ color: C.maroon }}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p className="font-cinzel text-sm tracking-[0.15em] uppercase">Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
          <p className="text-[15px] leading-relaxed mt-3 text-[#5A4333]">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan
            kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mx-auto max-w-sm space-y-2 pt-2">
            <p className="font-arabic text-xl leading-loose" style={{ color: C.soganSoft }}>
              وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            </p>
            <p className="text-sm italic text-[#6B5242] leading-relaxed">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
              agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
            </p>
            <p className="font-cinzel text-xs tracking-[0.25em]" style={{ color: C.maroon }}>
              {d.ayatQuote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ===================== MEMPELAI ===================== */}
      <section className="px-7 py-14 space-y-12" style={{ background: C.soganSoft }}>
        <SectionTitle eyebrow="Kedua Mempelai" title="Mempelai" light />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
        {[
          { photo: d.photoBride, name: d.bride, role: 'Mempelai Wanita', parent: 'Putri dari Bapak/Ibu', f: d.brideFather, m: d.brideMother },
          { photo: d.photoGroom, name: d.groom, role: 'Mempelai Pria', parent: 'Putra dari Bapak/Ibu', f: d.groomFather, m: d.groomMother },
        ].map((p, i) => (
          <Reveal key={p.role} delay={i * 100}>
            <div className="text-center space-y-4">
              <div className="mx-auto w-48 h-60 p-1 rounded-t-[999px]" style={{ border: `1px solid ${C.gold}` }}>
                <div className="w-full h-full rounded-t-[999px] overflow-hidden">
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: C.goldSoft }}>
                {p.role}
              </p>
              <h3 className="font-editorial text-3xl" style={{ color: C.cream }}>
                {p.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#D9C8A4' }}>
                {p.parent}
                <br />
                <span className="font-semibold" style={{ color: C.cream }}>{p.f}</span> &amp;{' '}
                <span className="font-semibold" style={{ color: C.cream }}>{p.m}</span>
              </p>
            </div>
            {i === 0 && <div className="md:hidden lg:block"><Divider light /></div>}
          </Reveal>
        ))}
        </div>
      </section>

      {/* ===================== ACARA ===================== */}
      <section className="px-6 py-14 bg-kawung-dark space-y-8">
        <SectionTitle eyebrow="Rangkaian Acara" title="Waktu & Tempat" />

        <Reveal>
          <div className="grid grid-cols-4 gap-2 text-center">
            {countdown.map(([label, val]) => (
              <div key={label} className="py-3" style={{ background: C.sogan, border: `1px solid ${C.gold}` }}>
                <p className="font-editorial text-3xl leading-none" style={{ color: C.gold }}>
                  {String(val).padStart(2, '0')}
                </p>
                <p className="font-cinzel text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: C.goldSoft }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
          <EventCard
            label={{ eyebrow: 'Acara Pertama', title: 'Akad Nikah' }}
            info={d.akad}
            mapLabel="Petunjuk Lokasi"
            calendarUrl={d.googleCalUrl}
          />
          <EventCard
            label={{ eyebrow: 'Acara Kedua', title: 'Resepsi Pernikahan' }}
            info={d.resepsi}
            mapLabel="Petunjuk Lokasi"
            calendarUrl={d.googleCalUrl}
          />
        </div>
      </section>

      {/* ===================== KISAH ===================== */}
      {d.loveStories.length > 0 && (
        <section className="px-7 py-14" style={{ background: C.sogan }}>
          <SectionTitle eyebrow="Perjalanan Kami" title="Kisah Kasih" light />
          <div className="relative mt-8 space-y-10">
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: `${C.gold}66` }} />
            {d.loveStories.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`relative w-[46%] ${i % 2 === 0 ? 'mr-auto text-right pr-2' : 'ml-auto text-left pl-2'}`}>
                  <span
                    className="absolute top-1.5 w-2.5 h-2.5 rotate-45"
                    style={{ background: C.gold, [i % 2 === 0 ? 'right' : 'left']: 'calc(-8.7% - 0.3rem)' }}
                  />
                  <p className="font-cinzel text-xs tracking-[0.2em]" style={{ color: C.gold }}>{s.tahun}</p>
                  <h3 className="font-editorial text-xl leading-tight" style={{ color: C.cream }}>{s.judul}</h3>
                  <p className="text-[13px] leading-relaxed mt-1" style={{ color: '#CDBB96' }}>{s.cerita}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===================== GALERI ===================== */}
      <section className="py-14 bg-kawung-dark">
        <SectionTitle eyebrow="Galeri" title="Kenangan Indah" />
        <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory px-7 pb-4 [scrollbar-width:none]">
          {d.gallery.map((photo, i) => (
            <button
              key={i}
              onClick={() => d.openLightbox(i)}
              className="snap-center shrink-0 w-52 h-72 p-1 rounded-t-[999px] cursor-pointer group"
              style={{ border: `1px solid ${C.gold}`, background: C.creamDeep }}
              aria-label={`Lihat foto ${i + 1}`}
            >
              <div className="w-full h-full rounded-t-[999px] overflow-hidden">
                <img
                  src={photo}
                  alt={`Galeri ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-[11px] tracking-widest uppercase mt-2" style={{ color: C.maroon }}>
          Geser untuk melihat
        </p>
      </section>

      {/* ===================== TANDA ASIH ===================== */}
      <section className="px-7 py-14 space-y-6" style={{ background: C.soganSoft }}>
        <SectionTitle eyebrow="Tanda Kasih" title="Amplop Digital" light />
        <p className="text-sm text-center leading-relaxed" style={{ color: '#D9C8A4' }}>
          Doa restu Bapak/Ibu merupakan anugerah terindah bagi kami. Namun bila berkenan memberikan tanda kasih,
          dapat disalurkan melalui:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
          {d.bankAccounts.map((acc, i) => (
            <Reveal key={i}>
              <div className="p-5 text-center space-y-1.5" style={{ border: `1px solid ${C.gold}`, background: '#00000025' }}>
                <p className="font-cinzel text-xs tracking-[0.3em]" style={{ color: C.gold }}>{acc.bank}</p>
                <p className="font-editorial text-3xl tracking-wider" style={{ color: C.cream }}>{acc.nomor}</p>
                <p className="text-xs" style={{ color: '#D9C8A4' }}>a.n {acc.nama}</p>
                <button
                  onClick={() => d.copyBank(acc.nomor, i)}
                  className="mt-2 w-full py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: C.gold, color: C.sogan }}
                >
                  {d.copiedBankIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {d.copiedBankIndex === i ? 'Tersalin' : 'Salin Nomor Rekening'}
                </button>
              </div>
            </Reveal>
          ))}
          {d.giftAddress && (
            <div className="p-5 text-center space-y-2 md:col-span-2 lg:col-span-1" style={{ border: `1px dashed ${C.gold}99` }}>
              <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase" style={{ color: C.gold }}>Kirim Kado</p>
              <p className="text-sm leading-relaxed" style={{ color: C.cream }}>{d.giftAddress}</p>
              <button
                onClick={d.copyAddress}
                className="py-2 px-4 text-xs flex items-center gap-2 mx-auto cursor-pointer"
                style={{ border: `1px solid ${C.gold}`, color: C.goldSoft }}
              >
                {d.copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {d.copiedAddress ? 'Alamat Tersalin' : 'Salin Alamat'}
              </button>
            </div>
          )}
        </div>
      </section>



      {/* ===================== BUKU TAMU ===================== */}
      <section className="px-6 py-14 space-y-6" style={{ background: C.sogan }}>
        <SectionTitle eyebrow="Doa & Restu" title="Buku Tamu" light />
        <form onSubmit={d.rsvp.send} className="space-y-4 p-5" style={{ border: `1px solid ${C.gold}`, background: '#00000030' }}>
          {[
            { label: 'Nama', el: (
              <input
                value={d.rsvp.name}
                onChange={(e) => d.rsvp.setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full mt-1 px-3 py-2.5 text-sm bg-transparent outline-none focus:border-[#E3C987]"
                style={{ border: `1px solid ${C.gold}88`, color: C.cream }}
                required
              />
            ) },
          ].map((f) => (
            <label key={f.label} className="block text-xs font-cinzel tracking-widest uppercase" style={{ color: C.goldSoft }}>
              {f.label}
              {f.el}
            </label>
          ))}

          <div>
            <p className="text-xs font-cinzel tracking-widest uppercase mb-1" style={{ color: C.goldSoft }}>Kehadiran</p>
            <div className="grid grid-cols-3 gap-2">
              {['Hadir', 'Ragu-ragu', 'Tidak Hadir'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => d.rsvp.setStatus(s)}
                  className="py-2 text-xs cursor-pointer transition-colors"
                  style={
                    d.rsvp.status === s
                      ? { background: C.gold, color: C.sogan, fontWeight: 700 }
                      : { border: `1px solid ${C.gold}88`, color: C.cream }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {d.rsvp.status !== 'Tidak Hadir' && (
            <div>
              <p className="text-xs font-cinzel tracking-widest uppercase mb-1" style={{ color: C.goldSoft }}>Jumlah Tamu</p>
              <div className="grid grid-cols-2 gap-2">
                {['1 Orang', '2 Orang'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => d.rsvp.setPax(p)}
                    className="py-2 text-xs cursor-pointer"
                    style={
                      d.rsvp.pax === p
                        ? { background: C.gold, color: C.sogan, fontWeight: 700 }
                        : { border: `1px solid ${C.gold}88`, color: C.cream }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="block text-xs font-cinzel tracking-widest uppercase" style={{ color: C.goldSoft }}>
            Ucapan & Doa
            <textarea
              rows={3}
              value={d.rsvp.message}
              onChange={(e) => d.rsvp.setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa terbaik..."
              className="w-full mt-1 px-3 py-2.5 text-sm bg-transparent outline-none resize-none normal-case tracking-normal font-editorial"
              style={{ border: `1px solid ${C.gold}88`, color: C.cream }}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 font-cinzel text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
            style={{ background: C.gold, color: C.sogan }}
          >
            <Send className="w-3.5 h-3.5" /> Kirim
          </button>
        </form>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          <p className="text-xs font-cinzel tracking-[0.25em] uppercase" style={{ color: C.goldSoft }}>
            {d.rsvp.list.length} Ucapan
          </p>
          {d.rsvp.list.length === 0 && (
            <p className="text-sm italic text-center py-6" style={{ color: '#CDBB96' }}>
              Belum ada ucapan. Jadilah yang pertama.
            </p>
          )}
          {d.rsvp.list.map((r, i) => (
            <div key={r.id || i} className="p-4 space-y-1" style={{ border: `1px solid ${C.gold}55`, background: '#00000020' }}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-editorial text-lg" style={{ color: C.cream }}>{r.guest_name}</p>
                <span className="text-[10px] px-2 py-0.5 font-cinzel tracking-wider" style={{ border: `1px solid ${C.gold}88`, color: C.goldSoft }}>
                  {r.attendance_status}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#D9C8A4' }}>{r.message}</p>
              <p className="text-[10px]" style={{ color: '#9C8A68' }}>{formatRsvpDate(r.created_at)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PENUTUP ===================== */}
      <section className="px-8 pt-14 pb-28 text-center space-y-4 bg-kawung-dark">
        <Reveal>
          <Gunungan className="mx-auto" size={64} />
          <h2 className="font-editorial text-4xl">Terima Kasih</h2>
          <p className="text-[15px] leading-relaxed text-[#5A4333]">
            Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih yang sebesar-besarnya.
          </p>
          <p className="font-cinzel text-xs tracking-[0.15em] uppercase">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
          <Divider />
          <p className="text-xs tracking-[0.3em] uppercase font-cinzel" style={{ color: C.maroon }}>Kami yang berbahagia</p>
          <p className="font-editorial text-4xl">
            {d.groomShort} &amp; {d.brideShort}
          </p>
          <p className="text-sm text-[#6B5242]">Keluarga {d.groomFather} &amp; {d.brideFather}</p>
          <p className="font-cinzel text-[11px] tracking-[0.4em] pt-6" style={{ color: C.gold }}>
            SEMOGA BERKAH & BAHAGIA
          </p>
        </Reveal>
      </section>

      <GalleryLightbox
        photos={d.gallery}
        activeIndex={d.gallerySelected}
        isOpen={d.isLightboxOpen}
        onClose={() => d.setIsLightboxOpen(false)}
        onIndexChange={d.setGallerySelected}
      />
    </div>
  );
};
