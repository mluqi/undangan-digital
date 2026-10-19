import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Send,
  Navigation,
  Bell,
  ArrowDown,
} from 'lucide-react';
import { Badge } from '../../ui';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { GalleryLightbox } from '../GalleryLightbox';
import { Reveal } from '../Reveal';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';

/**
 * TEMA SUNDA — "Priangan Hijau"
 * Palet: hijau daun, putih tulang, madu/terakota.
 * Motif: rumpun bambu bergoyang, bentuk daun, gelombang lembut.
 * Kode template di database: `sunda-priangan`
 */

const C = {
  forest: '#17402F',
  leaf: '#2F6B4F',
  sage: '#DCE9DB',
  mist: '#F1F6EF',
  bone: '#FAF8F0',
  honey: '#C98B3B',
  clay: '#A9623A',
  ink: '#1D2B24',
};

const LEAF_SHAPE = 'rounded-[3rem_0.75rem_3rem_0.75rem]';

const Bamboo = ({ flip = false, className = '' }) => (
  <svg
    viewBox="0 0 80 400"
    className={`${className} ${flip ? '-scale-x-100' : ''}`}
    fill="none"
    aria-hidden="true"
  >
    {[18, 44].map((x, k) => (
      <g key={x} className="animate-sway" style={{ animationDelay: `${k * 0.8}s` }}>
        <rect x={x} y="0" width="9" height="400" rx="4" fill={C.leaf} opacity={k ? 0.55 : 0.85} />
        {[60, 130, 200, 270, 340].map((y) => (
          <rect key={y} x={x - 1} y={y + k * 14} width="11" height="3" rx="1.5" fill={C.forest} opacity="0.7" />
        ))}
        {[90, 190, 290].map((y, i) => (
          <path
            key={y}
            d={`M${x + 9} ${y + k * 10} q 28 -8 34 -30 q -26 2 -34 30z`}
            fill={C.leaf}
            opacity={0.6 + i * 0.1}
          />
        ))}
      </g>
    ))}
  </svg>
);

const Wave = ({ fill, flip = false }) => (
  <svg
    viewBox="0 0 400 30"
    preserveAspectRatio="none"
    className={`block w-full h-6 ${flip ? 'rotate-180' : ''}`}
    aria-hidden="true"
  >
    <path d="M0 30V14C40 0 70 0 110 12s70 16 110 4S300 0 340 8s40 6 60 4V30Z" fill={fill} />
  </svg>
);

const Eyebrow = ({ children, light }) => (
  <p
    className="font-nunito text-[11px] font-bold tracking-[0.3em] uppercase"
    style={{ color: light ? '#BFD8C5' : C.honey }}
  >
    {children}
  </p>
);

const EVENT_TABS = [
  { key: 'akad', label: 'Akad Nikah' },
  { key: 'resepsi', label: 'Resepsi' },
];

export const SundaneseTheme = (props) => {
  const d = useInvitationData(props);
  const [activeEvent, setActiveEvent] = useState('akad');
  const event = activeEvent === 'akad' ? d.akad : d.resepsi;

  const countdown = [
    ['Hari', d.timeLeft.days],
    ['Jam', d.timeLeft.hours],
    ['Menit', d.timeLeft.minutes],
    ['Detik', d.timeLeft.seconds],
  ];

  return (
    <div
      className={`relative w-full max-w-lg lg:max-w-none lg:w-[480px] xl:w-[520px] ${d.isOpened ? 'min-h-screen lg:ml-auto lg:mr-0' : 'h-screen max-h-screen overflow-hidden mx-auto'} font-nunito shadow-2xl scroll-smooth`}
      style={{ background: C.bone, color: C.ink }}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="sunda"
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
          position="bottom-left"
          theme="forest"
          accentColor={C.leaf}
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
        theme="sage"
        accentColor={C.honey}
      />

      {/* ===================== COVER ===================== */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-[1300ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
          d.isOpened ? '-translate-y-full pointer-events-none' : 'translate-y-0'
        }`}
        style={{ background: C.forest }}
      >
        <img src={d.photoCover} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${C.forest}cc 0%, ${C.forest}55 40%, ${C.forest} 100%)` }}
        />
        <Bamboo className="absolute left-0 top-0 h-[70%] w-auto opacity-90" />
        <Bamboo flip className="absolute right-0 top-0 h-[55%] w-auto opacity-70" />

        <div className="relative z-10 h-full w-full max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between justify-end px-6 sm:px-8 pb-10 md:pb-16 gap-6 md:gap-12">
          {/* Left Column: Salam & Nama Mempelai */}
          <div className="space-y-2 text-left md:w-1/2">
            <Eyebrow light>Assalamu&apos;alaikum</Eyebrow>
            <p className="font-fraunces italic text-lg" style={{ color: '#D7E7DB' }}>
              Selamat datang di hari bahagia kami
            </p>
            <h1 className="font-fraunces text-5xl sm:text-6xl md:text-7xl leading-[0.95]" style={{ color: C.bone }}>
              {d.groomShort}
              <span className="block text-3xl sm:text-4xl italic -my-1" style={{ color: C.honey }}>
                dan
              </span>
              {d.brideShort}
            </h1>
            <p className="text-sm tracking-wide pt-1" style={{ color: '#BFD8C5' }}>
              {d.akad.tanggal}
            </p>
          </div>

          {/* Right Column: Tamu Undangan & Tombol */}
          <div className="space-y-4 w-full md:w-5/12 max-w-sm">
            <div className="rounded-2xl p-5 backdrop-blur-md" style={{ background: '#ffffff14', border: '1px solid #ffffff24' }}>
              <p className="text-[11px]" style={{ color: '#BFD8C5' }}>Kepada Yth. Bapak/Ibu/Saudara/i:</p>
              <p className="font-fraunces text-2xl flex items-center gap-2 mt-1" style={{ color: C.bone }}>
                {d.guestName}
                {d.isVip && <Badge variant="warning" size="sm" className="font-sans text-[10px]">VIP</Badge>}
              </p>
              <p className="text-[10px] italic mt-1" style={{ color: '#BFD8C5' }}>
                *Di Tempat / Mohon maaf bila ada kesalahan penulisan gelar
              </p>
            </div>

            <button
              type="button"
              onClick={d.openInvitation}
              className="w-full py-4 rounded-full font-bold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-[0.98] hover:brightness-105 shadow-xl"
              style={{ background: C.honey, color: C.forest }}
            >
              <span>Buka Undangan</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== HERO ===================== */}
      <section className="relative" style={{ background: C.forest }}>
        <div className="relative h-[78vh] min-h-[480px]">
          <img src={d.photoCover} alt="Foto mempelai" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${C.forest} 100%)` }} />
          <Bamboo className="absolute left-0 top-0 h-2/3 w-auto opacity-80" />
          <div className="absolute bottom-0 inset-x-0 px-8 pb-12 space-y-2">
            <Reveal>
              <Eyebrow light>Pernikahan</Eyebrow>
              <h2 className="font-fraunces text-5xl leading-none mt-1" style={{ color: C.bone }}>
                {d.groomShort} <span className="italic text-3xl" style={{ color: C.honey }}>&amp;</span> {d.brideShort}
              </h2>
              <p className="text-sm mt-2" style={{ color: '#BFD8C5' }}>{d.akad.tanggal}</p>
            </Reveal>
          </div>
        </div>
        <Wave fill={C.bone} />
      </section>

      {/* ===================== SALAM ===================== */}
      <section className="px-7 py-12 space-y-6 bg-leaf text-center">
        <Reveal>
          <p className="font-arabic text-3xl leading-loose" style={{ color: C.forest }}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="font-fraunces text-3xl mt-2">Assalamu&apos;alaikum</p>
          <p className="text-[15px] leading-relaxed mt-3 text-[#3E5249]">
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir
            dalam hari bahagia pernikahan putra-putri kami, serta berkenan memberikan doa restu.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-3xl p-6 space-y-3" style={{ background: C.sage }}>
            <p className="font-arabic text-xl leading-loose" style={{ color: C.forest }}>
              وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            </p>
            <p className="text-sm italic leading-relaxed text-[#3E5249]">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
              agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
            </p>
            <p className="text-xs font-bold tracking-[0.25em]" style={{ color: C.clay }}>{d.ayatQuote}</p>
          </div>
        </Reveal>
      </section>

      {/* ===================== MEMPELAI (ZIGZAG) ===================== */}
      <section className="px-6 py-12 space-y-12" style={{ background: C.mist }}>
        <div className="space-y-1">
          <Eyebrow>Yang Berbahagia</Eyebrow>
          <h2 className="font-fraunces text-4xl">Mempelai</h2>
        </div>

        {[
          { photo: d.bride, img: d.photoBride, role: 'Mempelai Wanita', f: d.brideFather, m: d.brideMother, kid: 'Putri' },
          { photo: d.groom, img: d.photoGroom, role: 'Mempelai Pria', f: d.groomFather, m: d.groomMother, kid: 'Putra' },
        ].map((p, i) => (
          <Reveal key={p.role}>
            <div className={`flex items-center gap-5 ${i % 2 ? 'flex-row-reverse text-right' : ''}`}>
              <div className={`shrink-0 w-40 h-52 overflow-hidden ${LEAF_SHAPE} shadow-lg`} style={{ border: `4px solid ${C.bone}` }}>
                <img src={p.img} alt={p.photo} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: C.honey }}>{p.role}</p>
                <h3 className="font-fraunces text-2xl leading-tight">{p.photo}</h3>
                <p className="text-[13px] leading-relaxed text-[#4A5E54]">
                  {p.kid} dari Bapak <b>{p.f}</b> dan Ibu <b>{p.m}</b>
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ===================== ACARA (TAB) ===================== */}
      <section className="relative" style={{ background: C.forest, color: C.bone }}>
        <Wave fill={C.mist} flip />
        <div className="px-6 pt-4 pb-14 space-y-8">
          <div className="text-center space-y-1">
            <Eyebrow light>Waktu &amp; Tempat</Eyebrow>
            <h2 className="font-fraunces text-4xl">Rangkaian Acara</h2>
          </div>

          <Reveal>
            <div className="grid grid-cols-4 gap-2.5">
              {countdown.map(([label, val]) => (
                <div
                  key={label}
                  className="aspect-square rounded-full flex flex-col items-center justify-center"
                  style={{ border: `1.5px solid ${C.honey}`, background: '#ffffff0d' }}
                >
                  <span className="font-fraunces text-2xl leading-none">{String(val).padStart(2, '0')}</span>
                  <span className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: '#BFD8C5' }}>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="flex p-1 rounded-full" style={{ background: '#ffffff14' }} role="tablist">
            {EVENT_TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeEvent === t.key}
                onClick={() => setActiveEvent(t.key)}
                className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer"
                style={activeEvent === t.key ? { background: C.honey, color: C.forest } : { color: '#BFD8C5' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div key={activeEvent} className={`rounded-3xl p-6 space-y-4 animate-[fadeUp_0.5s_ease] ${LEAF_SHAPE}`} style={{ background: C.bone, color: C.ink }}>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2 font-bold"><Calendar className="w-4 h-4" style={{ color: C.honey }} />{event.tanggal}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: C.honey }} />{event.waktu}</p>
            </div>
            <div className="h-px" style={{ background: C.sage }} />
            <div>
              <p className="font-fraunces text-xl flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1.5 shrink-0" style={{ color: C.clay }} />
                {event.lokasi}
              </p>
              {event.alamat && <p className="text-[13px] mt-1 pl-6 text-[#4A5E54] leading-relaxed">{event.alamat}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(event.lokasi)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5"
                style={{ background: C.forest, color: C.bone }}
              >
                <Navigation className="w-3.5 h-3.5" /> Peta Lokasi
              </a>
              <a
                href={d.googleCalUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5"
                style={{ background: C.sage, color: C.forest }}
              >
                <Bell className="w-3.5 h-3.5" /> Kalender
              </a>
            </div>
          </div>
        </div>
        <Wave fill={C.bone} />
      </section>

      {/* ===================== KISAH ===================== */}
      {d.loveStories.length > 0 && (
        <section className="px-6 py-12 space-y-8 bg-leaf">
          <div className="space-y-1">
            <Eyebrow>Cerita Kami</Eyebrow>
            <h2 className="font-fraunces text-4xl">Kisah Kasih</h2>
          </div>
          <div className="space-y-5">
            {d.loveStories.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="relative pl-16">
                  <span
                    className="absolute left-0 top-0 font-fraunces text-6xl leading-none"
                    style={{ color: C.sage, WebkitTextStroke: `1px ${C.leaf}` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[11px] font-bold tracking-[0.25em]" style={{ color: C.honey }}>{s.tahun}</p>
                  <h3 className="font-fraunces text-xl">{s.judul}</h3>
                  <p className="text-[14px] leading-relaxed text-[#4A5E54] mt-0.5">{s.cerita}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===================== GALERI (STAGGER) ===================== */}
      <section className="px-5 py-12 space-y-6" style={{ background: C.mist }}>
        <div className="text-center space-y-1">
          <Eyebrow>Galeri</Eyebrow>
          <h2 className="font-fraunces text-4xl">Foto Kenangan</h2>
        </div>
        <div className="columns-2 gap-3 [column-fill:_balance]">
          {d.gallery.map((photo, i) => (
            <Reveal key={i} delay={(i % 2) * 120} className="mb-3 break-inside-avoid">
              <button
                onClick={() => d.openLightbox(i)}
                className={`block w-full overflow-hidden cursor-pointer group ${i % 2 ? 'rounded-[2rem_0.5rem_2rem_0.5rem]' : 'rounded-[0.5rem_2rem_0.5rem_2rem]'}`}
                aria-label={`Lihat foto ${i + 1}`}
              >
                <img
                  src={photo}
                  alt={`Galeri ${i + 1}`}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}
                />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== TANDA KASIH ===================== */}
      <section className="px-6 py-12 space-y-6" style={{ background: C.sage }}>
        <div className="text-center space-y-2">
          <Eyebrow>Tanda Kasih</Eyebrow>
          <h2 className="font-fraunces text-4xl">Amplop Digital</h2>
          <p className="text-sm leading-relaxed text-[#3E5249]">
            Doa restu Bapak/Ibu adalah hadiah terindah bagi kami. Bila berkenan memberikan tanda kasih, dapat disalurkan melalui:
          </p>
        </div>
        {d.bankAccounts.map((acc, i) => (
          <Reveal key={i}>
            <div className="rounded-3xl p-5 space-y-2 shadow-sm" style={{ background: C.bone }}>
              <p className="text-xs font-bold tracking-[0.25em]" style={{ color: C.honey }}>{acc.bank}</p>
              <p className="font-fraunces text-3xl tracking-wide">{acc.nomor}</p>
              <p className="text-xs text-[#4A5E54]">a.n {acc.nama}</p>
              <button
                onClick={() => d.copyBank(acc.nomor, i)}
                className="w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: C.forest, color: C.bone }}
              >
                {d.copiedBankIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {d.copiedBankIndex === i ? 'Tersalin' : 'Salin Nomor Rekening'}
              </button>
            </div>
          </Reveal>
        ))}
        {d.giftAddress && (
          <div className="rounded-3xl p-5 space-y-2 border-2 border-dashed text-center" style={{ borderColor: `${C.leaf}66` }}>
            <p className="text-xs font-bold tracking-[0.25em]" style={{ color: C.clay }}>KIRIM KADO</p>
            <p className="text-sm leading-relaxed">{d.giftAddress}</p>
            <button
              onClick={d.copyAddress}
              className="py-2 px-4 rounded-full text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              style={{ background: C.leaf, color: C.bone }}
            >
              {d.copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {d.copiedAddress ? 'Alamat Tersalin' : 'Salin Alamat'}
            </button>
          </div>
        )}
      </section>



      {/* ===================== BUKU TAMU ===================== */}
      <section className="px-6 py-12 space-y-6" style={{ background: C.mist }}>
        <div className="space-y-1">
          <Eyebrow>Doa &amp; Ucapan</Eyebrow>
          <h2 className="font-fraunces text-4xl">Buku Tamu</h2>
        </div>

        <form onSubmit={d.rsvp.send} className="rounded-3xl p-5 space-y-4 shadow-sm" style={{ background: C.bone }}>
          <label className="block text-xs font-bold">
            Nama
            <input
              value={d.rsvp.name}
              onChange={(e) => d.rsvp.setName(e.target.value)}
              placeholder="Nama lengkap"
              required
              className="w-full mt-1 px-4 py-3 rounded-2xl text-sm outline-none border focus:border-[#2F6B4F]"
              style={{ borderColor: C.sage, background: C.mist }}
            />
          </label>

          <div>
            <p className="text-xs font-bold mb-1">Kehadiran</p>
            <div className="grid grid-cols-3 gap-2">
              {['Hadir', 'Ragu-ragu', 'Tidak Hadir'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => d.rsvp.setStatus(s)}
                  className="py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors"
                  style={d.rsvp.status === s ? { background: C.forest, color: C.bone } : { background: C.sage, color: C.forest }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {d.rsvp.status !== 'Tidak Hadir' && (
            <div>
              <p className="text-xs font-bold mb-1">Jumlah Tamu</p>
              <div className="grid grid-cols-2 gap-2">
                {['1 Orang', '2 Orang'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => d.rsvp.setPax(p)}
                    className="py-2.5 rounded-full text-xs font-bold cursor-pointer"
                    style={d.rsvp.pax === p ? { background: C.honey, color: C.forest } : { background: C.sage, color: C.forest }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="block text-xs font-bold">
            Ucapan &amp; Doa
            <textarea
              rows={3}
              value={d.rsvp.message}
              onChange={(e) => d.rsvp.setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa terbaik..."
              required
              className="w-full mt-1 px-4 py-3 rounded-2xl text-sm outline-none border resize-none focus:border-[#2F6B4F] font-normal"
              style={{ borderColor: C.sage, background: C.mist }}
            />
          </label>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
            style={{ background: C.forest, color: C.bone }}
          >
            <Send className="w-4 h-4" /> Kirim Ucapan
          </button>
        </form>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: C.leaf }}>{d.rsvp.list.length} Ucapan</p>
          {d.rsvp.list.length === 0 && (
            <p className="text-sm italic text-center py-6 text-[#4A5E54]">Belum ada ucapan. Jadilah yang pertama.</p>
          )}
          {d.rsvp.list.map((r, i) => (
            <div key={r.id || i} className="rounded-2xl p-4 space-y-1" style={{ background: C.bone }}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: C.sage, color: C.forest }}>
                    {(r.guest_name || 'T').charAt(0).toUpperCase()}
                  </span>
                  <p className="font-bold text-sm">{r.guest_name}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: C.sage, color: C.forest }}>{r.attendance_status}</span>
              </div>
              <p className="text-sm leading-relaxed text-[#3E5249] pl-10">{r.message}</p>
              <p className="text-[10px] pl-10 text-[#7A8C82]">{formatRsvpDate(r.created_at)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PENUTUP ===================== */}
      <section className="relative" style={{ background: C.forest, color: C.bone }}>
        <Wave fill={C.mist} flip />
        <Bamboo className="absolute right-0 bottom-0 h-64 w-auto opacity-40" flip />
        <div className="relative px-8 pt-6 pb-28 space-y-4">
          <Reveal>
            <p className="font-fraunces italic text-2xl" style={{ color: C.honey }}>Terima Kasih</p>
            <p className="text-[15px] leading-relaxed mt-2" style={{ color: '#D7E7DB' }}>
              Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih yang sebesar-besarnya. Semoga Allah SWT melimpahkan berkah kepada kita semua.
            </p>
            <p className="text-sm mt-3" style={{ color: '#BFD8C5' }}>Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</p>
            <div className="pt-6">
              <p className="text-[11px] tracking-[0.25em] uppercase" style={{ color: '#BFD8C5' }}>Kami yang berbahagia</p>
              <p className="font-fraunces text-4xl mt-1">
                {d.groomShort} &amp; {d.brideShort}
              </p>
              <p className="text-sm mt-1" style={{ color: '#BFD8C5' }}>Keluarga {d.groomFather} &amp; {d.brideFather}</p>
            </div>
          </Reveal>
        </div>
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
