import * as XLSX from 'xlsx';

/**
 * Normalisasi string key untuk pencocokan toleran
 */
const cleanKey = (str = '') =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Helper untuk membuat slug otomatis yang bersih dari nama pengantin
 */
export const generateSlugFromNames = (groom = '', bride = '') => {
  const g = groom.split(',')[0].trim().split(' ')[0] || '';
  const b = bride.split(',')[0].trim().split(' ')[0] || '';
  const combined = `${g}-${b}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return combined || 'happy-wedding';
};

/**
 * Normalisasi nama template yang ramah pengguna menjadi kode template internal
 */
export const normalizeTemplateCode = (input = '') => {
  if (!input) return 'forest-tropical';
  const cleaned = cleanKey(input);

  if (cleaned.includes('forest') || cleaned.includes('tropical') || cleaned.includes('hutan')) return 'forest-tropical';
  if (cleaned.includes('crimson') || cleaned.includes('rose') || cleaned.includes('marun') || cleaned.includes('merah')) return 'crimson-rose';
  if (cleaned.includes('royal') || cleaned.includes('gold') || cleaned.includes('emas') || cleaned.includes('kerajaan')) return 'royal-gold';
  if (cleaned.includes('sunda') || cleaned.includes('priangan') || cleaned.includes('bambu')) return 'sunda-priangan';
  if (cleaned.includes('jawa') || cleaned.includes('keraton') || cleaned.includes('batik') || cleaned.includes('sogan')) return 'jawa-keraton';
  if (cleaned.includes('rustic') || cleaned.includes('wood') || cleaned.includes('kayu')) return 'rustic-wood';
  if (cleaned.includes('mildness') || cleaned.includes('sage') || cleaned.includes('ivory')) return 'mildness';
  if (cleaned.includes('snap') || cleaned.includes('photo') || cleaned.includes('cinematic') || cleaned.includes('dark')) return 'snap-photo';
  if (cleaned.includes('serein') || cleaned.includes('minimalist') || cleaned.includes('chic')) return 'serein';
  if (cleaned.includes('timeless') || cleaned.includes('polaroid') || cleaned.includes('vintage') || cleaned.includes('sepia')) return 'timeless-snapshot';

  return 'forest-tropical';
};

/**
 * Daftar Field Formulir Undangan
 * Disusun berurutan dari yang paling penting bagi calon pengantin:
 * 1. Data Pengantin Pria
 * 2. Data Pengantin Wanita
 * 3. Jadwal Akad Nikah
 * 4. Jadwal Resepsi
 * 5. Rekening & Hadiah Kado
 * 6. Kutipan Ayat / Doa
 * 7. Pengaturan Sistem (Bisa Dikosongkan)
 */
export const INVITATION_EXCEL_FIELDS = [
  // --- BAGIAN 1: MEMPELAI PRIA ---
  {
    category: '1. Data Mempelai Pria',
    key: 'mempelai_pria',
    label: 'Nama Lengkap & Gelar Pria',
    required: true,
    hint: 'Contoh: Ahmad Fajar, S.T.',
    defaultValue: 'Ahmad Fajar, S.T.',
  },
  {
    category: '1. Data Mempelai Pria',
    key: 'ayah_pria',
    label: 'Nama Ayah Mempelai Pria',
    required: true,
    hint: 'Contoh: Bpk. H. Abdurrahman',
    defaultValue: 'Bpk. H. Abdurrahman',
  },
  {
    category: '1. Data Mempelai Pria',
    key: 'ibu_pria',
    label: 'Nama Ibu Mempelai Pria',
    required: true,
    hint: 'Contoh: Ibu Hj. Maryam',
    defaultValue: 'Ibu Hj. Maryam',
  },

  // --- BAGIAN 2: MEMPELAI WANITA ---
  {
    category: '2. Data Mempelai Wanita',
    key: 'mempelai_wanita',
    label: 'Nama Lengkap & Gelar Wanita',
    required: true,
    hint: 'Contoh: Siti Aminah, S.Pd.',
    defaultValue: 'Siti Aminah, S.Pd.',
  },
  {
    category: '2. Data Mempelai Wanita',
    key: 'ayah_wanita',
    label: 'Nama Ayah Mempelai Wanita',
    required: true,
    hint: 'Contoh: Bpk. H. Ahmad Dahlan',
    defaultValue: 'Bpk. H. Ahmad Dahlan',
  },
  {
    category: '2. Data Mempelai Wanita',
    key: 'ibu_wanita',
    label: 'Nama Ibu Mempelai Wanita',
    required: true,
    hint: 'Contoh: Ibu Hj. Fatimah',
    defaultValue: 'Ibu Hj. Fatimah',
  },

  // --- BAGIAN 3: AKAD NIKAH ---
  {
    category: '3. Acara Akad Nikah / Pemberkatan',
    key: 'akad_tanggal',
    label: 'Hari & Tanggal Akad Nikah',
    required: true,
    hint: 'Contoh: Minggu, 15 November 2026',
    defaultValue: 'Minggu, 15 November 2026',
  },
  {
    category: '3. Acara Akad Nikah / Pemberkatan',
    key: 'akad_waktu',
    label: 'Waktu / Jam Akad Nikah',
    required: true,
    hint: 'Contoh: 08:00 - 10:00 WIB',
    defaultValue: '08:00 - 10:00 WIB',
  },
  {
    category: '3. Acara Akad Nikah / Pemberkatan',
    key: 'akad_lokasi',
    label: 'Nama Tempat / Gedung / Masjid Akad',
    required: true,
    hint: 'Contoh: Masjid Agung Al-Akbar Surabaya',
    defaultValue: 'Masjid Agung Al-Akbar Surabaya',
  },
  {
    category: '3. Acara Akad Nikah / Pemberkatan',
    key: 'akad_alamat',
    label: 'Alamat Lengkap Lokasi Akad',
    required: false,
    hint: 'Contoh: Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya',
    defaultValue: 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya',
  },
  {
    category: '3. Acara Akad Nikah / Pemberkatan',
    key: 'akad_map_url',
    label: 'Link Google Maps Akad (Opsional)',
    required: false,
    hint: 'Contoh: https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
    defaultValue: 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
  },

  // --- BAGIAN 4: RESEPSI PERNIKAHAN ---
  {
    category: '4. Acara Resepsi Pernikahan',
    key: 'resepsi_tanggal',
    label: 'Hari & Tanggal Resepsi',
    required: true,
    hint: 'Contoh: Minggu, 15 November 2026',
    defaultValue: 'Minggu, 15 November 2026',
  },
  {
    category: '4. Acara Resepsi Pernikahan',
    key: 'resepsi_waktu',
    label: 'Waktu / Jam Resepsi',
    required: true,
    hint: 'Contoh: 11:00 - 14:00 WIB',
    defaultValue: '11:00 - 14:00 WIB',
  },
  {
    category: '4. Acara Resepsi Pernikahan',
    key: 'resepsi_lokasi',
    label: 'Nama Tempat / Gedung Resepsi',
    required: true,
    hint: 'Contoh: Grand Ballroom Hotel Majapahit, Surabaya',
    defaultValue: 'Grand Ballroom Hotel Majapahit, Surabaya',
  },
  {
    category: '4. Acara Resepsi Pernikahan',
    key: 'resepsi_alamat',
    label: 'Alamat Lengkap Lokasi Resepsi',
    required: false,
    hint: 'Contoh: Jl. Tunjungan No.65, Genteng, Surabaya',
    defaultValue: 'Jl. Tunjungan No.65, Genteng, Surabaya',
  },
  {
    category: '4. Acara Resepsi Pernikahan',
    key: 'resepsi_map_url',
    label: 'Link Google Maps Resepsi (Opsional)',
    required: false,
    hint: 'Contoh: https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
    defaultValue: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
  },

  // --- BAGIAN 5: REKENING & KADO ---
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'bank_1_nama',
    label: 'Nama Bank 1',
    required: false,
    hint: 'Contoh: BCA / Mandiri / BSI / BRI',
    defaultValue: 'BCA',
  },
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'bank_1_nomor',
    label: 'Nomor Rekening 1',
    required: false,
    hint: 'Contoh: 0182938192',
    defaultValue: '0182938192',
  },
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'bank_1_pemilik',
    label: 'Atas Nama Rekening 1',
    required: false,
    hint: 'Contoh: Ahmad Fajar',
    defaultValue: 'Ahmad Fajar',
  },
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'bank_2_nama',
    label: 'Nama Bank 2',
    required: false,
    hint: 'Contoh: BSI / Mandiri / BCA',
    defaultValue: 'BSI',
  },
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'bank_2_nomor',
    label: 'Nomor Rekening 2',
    required: false,
    hint: 'Contoh: 7192830192',
    defaultValue: '7192830192',
  },
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'bank_2_pemilik',
    label: 'Atas Nama Rekening 2',
    required: false,
    hint: 'Contoh: Siti Aminah',
    defaultValue: 'Siti Aminah',
  },
  {
    category: '5. Amplop Digital & Kado (Opsional)',
    key: 'alamat_kado',
    label: 'Alamat Kirim Kado Fisik',
    required: false,
    hint: 'Contoh: Perumahan Graha Asri Blok C No. 12, Surabaya (0812-3456-7890)',
    defaultValue: 'Perumahan Graha Asri Blok C No. 12, Surabaya (0812-3456-7890)',
  },
];

/**
 * Ekspor Template Excel (.xlsx) yang sangat simpel dan bersih untuk diisi client.
 * - Kolom E (KOLOM PENGISIAN ANDA) selalu DIKOSONGKAN bersih,
 *   sehingga client langsung mengetik tanpa repot menghapus teks contoh!
 * - Contoh pengisian ditaruh di Kolom F secara rapi sebagai panduan.
 */
export const exportInvitationExcelTemplate = (existingData = {}, customFilename = '') => {
  const wsData = [
    ['FORMULIR PENGISIAN DATA UNDANGAN PERNIKAHAN DIGITAL'],
    ['Petunjuk Pengisian: Cukup ketik data pernikahan Anda pada Kolom E [KOLOM PENGISIAN ANDA].'],
    ['Bagian yang bertanda [Opsional] boleh dikosongkan jika tidak ada/tidak diperlukan.'],
    [],
    [
      'No',
      'Kategori',
      'Informasi yang Diisi',
      'Status',
      'KOLOM PENGISIAN ANDA (Ketik di sini)',
      'Contoh Pengisian & Petunjuk',
    ],
  ];

  INVITATION_EXCEL_FIELDS.forEach((f, idx) => {
    // Kolom pengisian selalu murni dikosongkan agar bersih siap diisi oleh calon pengantin
    const val = '';
    wsData.push([
      idx + 1,
      f.category,
      f.label,
      f.required ? 'WAJIB' : 'Opsional',
      val,
      f.hint,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Atur lebar kolom yang nyaman dan lapang untuk pengguna
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 28 }, // Kategori
    { wch: 34 }, // Informasi yang Diisi
    { wch: 12 }, // Status
    { wch: 42 }, // KOLOM PENGISIAN ANDA
    { wch: 55 }, // Contoh Pengisian & Petunjuk
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Formulir Undangan');

  const filename =
    customFilename ||
    (existingData?.slug
      ? `Form_Undangan_${existingData.slug}.xlsx`
      : 'Form_Undangan_Pernikahan.xlsx');

  XLSX.writeFile(wb, filename);
};

/**
 * Parsing file Excel yang diunggah dan mengonversinya menjadi objek form state yang kompatibel.
 * Mendukung pembacaan toleran:
 * - Format Baru (Kolom E = nilai pengisian, Kolom C = nama field)
 * - Format Versi Sebelumnya (Kolom C = nilai pengisian, Kolom B = nama field)
 * - Format 2 Kolom (Kolom B = nilai pengisian, Kolom A = nama field)
 * - Format Tabel Horizontal (Baris header + baris data)
 */
export const parseInvitationExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];

        if (!ws) {
          throw new Error('Lembar kerja (sheet) tidak ditemukan di dalam file Excel.');
        }

        // Baca seluruh sel sheet sebagai array of array (AOA)
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (!rows || rows.length === 0) {
          throw new Error('File Excel kosong atau tidak memiliki data.');
        }

        const rawDataMap = {};

        // Loop baris untuk memetakan label -> nilai
        rows.forEach((row) => {
          if (!Array.isArray(row) || row.length === 0) return;

          // 1. Format Baru: Kolom C (idx 2) = Label, Kolom E (idx 4) = Nilai
          if (row.length >= 5 && row[2]) {
            const label = cleanKey(row[2]);
            const val = String(row[4] ?? '').trim();
            if (label && val !== '') {
              rawDataMap[label] = val;
            }
          }

          // 2. Format Lama: Kolom B (idx 1) = Label, Kolom C (idx 2) = Nilai
          if (row.length >= 3 && row[1]) {
            const label = cleanKey(row[1]);
            const val = String(row[2] ?? '').trim();
            if (label && val !== '' && !rawDataMap[label]) {
              rawDataMap[label] = val;
            }
          }

          // 3. Format Ringkas: Kolom A (idx 0) = Label, Kolom B (idx 1) = Nilai
          if (row.length >= 2 && row[0]) {
            const label = cleanKey(row[0]);
            const val = String(row[1] ?? '').trim();
            if (label && val !== '' && !rawDataMap[label]) {
              rawDataMap[label] = val;
            }
          }
        });

        // 4. Deteksi format tabel horizontal jika ada header row
        const headerRowIndex = rows.findIndex(
          (r) =>
            Array.isArray(r) &&
            r.some(
              (cell) =>
                cleanKey(cell).includes('client') ||
                cleanKey(cell).includes('mempelai') ||
                cleanKey(cell).includes('pria') ||
                cleanKey(cell).includes('slug')
            )
        );

        if (headerRowIndex !== -1 && rows[headerRowIndex + 1]) {
          const headers = rows[headerRowIndex];
          const values = rows[headerRowIndex + 1];
          headers.forEach((h, idx) => {
            const k = cleanKey(h);
            const v = values[idx] !== undefined ? String(values[idx]).trim() : '';
            if (k && v !== '' && !rawDataMap[k]) {
              rawDataMap[k] = v;
            }
          });
        }

        // Helper untuk mencari nilai dengan multiple alias pencocokan
        const getVal = (aliases, fallback = '') => {
          for (const alias of aliases) {
            const cleaned = cleanKey(alias);
            if (rawDataMap[cleaned] !== undefined && rawDataMap[cleaned] !== '') {
              return rawDataMap[cleaned];
            }
          }
          return fallback;
        };

        // Helper boolean (YA / TIDAK / TRUE / FALSE)
        const getBool = (aliases, fallback = true) => {
          const val = getVal(aliases, '');
          if (!val) return fallback;
          const lower = val.toLowerCase().trim();
          if (['ya', 'yes', 'true', '1', 'aktif', 'tampilkan', 'wajib'].includes(lower)) return true;
          if (['tidak', 'no', 'false', '0', 'sembunyikan', 'nonaktif'].includes(lower)) return false;
          return fallback;
        };

        // Ambil nama pengantin
        const groomVal = getVal([
          'namalengkapgelarpria',
          'namalengkapgelar',
          'mempelaipria',
          'namapria',
          'groomname',
          'groom',
          'pengantinpria',
        ], 'Ahmad Fajar, S.T.');

        const brideVal = getVal([
          'namalengkapgelarwanita',
          'mempelaiwanita',
          'namawanita',
          'bridename',
          'bride',
          'pengantinwanita',
        ], 'Siti Aminah, S.Pd.');

        // Generate clientName dan slug otomatis jika dikosongkan
        const clientNameVal = getVal([
          'namaundanganjudulacara',
          'namaundanganclient',
          'namaundangan',
          'namaclient',
          'clientname',
          'client',
          'judulundangan',
        ]);

        const rawSlug = getVal(['tautanurlsingkatslug', 'slugurlundangan', 'slugurl', 'slug', 'urlslug']);
        const slugVal = rawSlug ? rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') : generateSlugFromNames(groomVal, brideVal);

        const templateRaw = getVal([
          'pilihandesaintema',
          'kodetemplate',
          'template',
          'templatecode',
          'pilihantemplate',
          'tema',
        ]);
        const templateCodeVal = normalizeTemplateCode(templateRaw);

        // Buat objek form yang siap diserap oleh form state
        const parsedForm = {
          clientName: clientNameVal || `The Wedding of ${groomVal.split(',')[0].trim().split(' ')[0]} & ${brideVal.split(',')[0].trim().split(' ')[0]}`,
          slug: slugVal,
          templateCode: templateCodeVal,
          showQrCheckin: getBool([
            'tampilkanfloaterqrcheckin',
            'tampilkanfloaterqrcheckinyatidak',
            'tampilkanqr',
            'showqrcheckin',
            'showqr',
            'floaterqr',
          ], true),
          expiredAt: getVal([
            'masaaktifundangan',
            'masaaktif',
            'expiredat',
            'tanggalkadaluarsa',
          ]),

          // Mempelai Pria
          mempelaiPria: groomVal,
          ayahPria: getVal([
            'namaayahmempelaipria',
            'ayahpria',
            'ayahmempelaipria',
            'groomfather',
            'ayahpengantinpria',
          ], 'Bpk. H. Abdurrahman'),
          ibuPria: getVal([
            'namaibumempelaipria',
            'ibupria',
            'ibumempelaipria',
            'groommother',
            'ibupengantinpria',
          ], 'Ibu Hj. Maryam'),

          // Mempelai Wanita
          mempelaiWanita: brideVal,
          ayahWanita: getVal([
            'namaayahmempelaiwanita',
            'ayahwanita',
            'ayahmempelaiwanita',
            'bridefather',
            'ayahpengantinwanita',
          ], 'Bpk. H. Ahmad Dahlan'),
          ibuWanita: getVal([
            'namaibumempelaiwanita',
            'ibuwanita',
            'ibumempelaiwanita',
            'bridemother',
            'ibupengantinwanita',
          ], 'Ibu Hj. Fatimah'),

          // Ayat
          ayat: getVal([
            'kutipanayatsucidoa',
            'kutipanayatsuci',
            'kutipandoa',
            'ayat',
            'kutipan',
            'quote',
          ], 'QS. Ar-Rum: 21'),

          // Akad
          akadTanggal: getVal([
            'haritanggalakadnikah',
            'tanggalakadnikah',
            'tanggalakad',
            'akadnikah',
            'akadtanggal',
          ], 'Minggu, 15 November 2026'),
          akadWaktu: getVal([
            'waktujamakadnikah',
            'waktuakadnikah',
            'waktuakad',
            'akadwaktu',
            'jamakad',
          ], '08:00 - 10:00 WIB'),
          akadLokasi: getVal([
            'namatempatgedungmasjidakad',
            'tempatgedungakad',
            'tempatakad',
            'lokasiakad',
            'akadlokasi',
          ], 'Masjid Agung Al-Akbar Surabaya'),
          akadAlamat: getVal([
            'alamatlengkaplokasiakad',
            'alamatlengkapakad',
            'alamatakad',
            'akadalamat',
          ], 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya'),
          akadMapUrl: getVal([
            'linkgooglemapsakadopsional',
            'linkgooglemapsakad',
            'googlemapsakad',
            'mapsakad',
            'akadmapurl',
          ], 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya'),

          // Resepsi
          resepsiTanggal: getVal([
            'haritanggalresepsi',
            'tanggalresepsi',
            'tanggalresepsipernikahan',
            'resepsitanggal',
          ], 'Minggu, 15 November 2026'),
          resepsiWaktu: getVal([
            'waktujamresepsi',
            'wakturesepsi',
            'resepsiwaktu',
            'jamresepsi',
          ], '11:00 - 14:00 WIB'),
          resepsiLokasi: getVal([
            'namatempatgedungresepsi',
            'tempatgedungresepsi',
            'tempatresepsi',
            'lokasiresepsi',
            'resepsilokasi',
          ], 'Grand Ballroom Hotel Majapahit, Surabaya'),
          resepsiAlamat: getVal([
            'alamatlengkaplokasiresepsi',
            'alamatlengkapresepsi',
            'alamatresepsi',
            'resepsialamat',
          ], 'Jl. Tunjungan No.65, Genteng, Surabaya'),
          resepsiMapUrl: getVal([
            'linkgooglemapsresepsiopsional',
            'linkgooglemapsresepsi',
            'googlemapsresepsi',
            'mapsresepsi',
            'resepsimapurl',
          ], 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya'),

          // Rekening Bank
          bank1Nama: getVal(['namabank1', 'bank1nama', 'bank1', 'rekening1bank']),
          bank1Nomor: getVal(['nomorrekening1', 'rekening1', 'norek1', 'bank1nomor']),
          bank1Pemilik: getVal(['atasnamarekening1', 'atasnama1', 'bank1pemilik', 'namapemilikrekening1']),

          bank2Nama: getVal(['namabank2', 'bank2nama', 'bank2', 'rekening2bank']),
          bank2Nomor: getVal(['nomorrekening2', 'rekening2', 'norek2', 'bank2nomor']),
          bank2Pemilik: getVal(['atasnamarekening2', 'atasnama2', 'bank2pemilik', 'namapemilikrekening2']),

          // Alamat Kado
          alamatKado: getVal([
            'alamatkirimkadofisik',
            'alamatpengirimankadofisik',
            'alamatkado',
            'alamatpengirimankado',
            'kadofisik',
            'giftaddress',
          ]),
        };

        resolve(parsedForm);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
