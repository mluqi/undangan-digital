import { MildnessTheme } from './MildnessTheme';
import { SnapPhotoTheme } from './templates/SnapPhotoTheme';
import { TimelessSnapshotTheme } from './templates/TimelessSnapshotTheme';
import { SereinTheme } from './templates/SereinTheme';
import { JavaneseTheme } from './templates/JavaneseTheme';
import { SundaneseTheme } from './templates/SundaneseTheme';
import { RusticWoodTheme } from './templates/RusticWoodTheme';
import { RoyalGoldTheme } from './templates/RoyalGoldTheme';
import { CrimsonRoseTheme } from './templates/CrimsonRoseTheme';
import { ForestTropicalTheme } from './templates/ForestTropicalTheme';

/**
 * TEMPLATE REGISTRY
 * 
 * Sistem registrasi template undangan digital.
 * 
 * CARA MENAMBAH TEMPLATE BARU KE DEPANNYA:
 * 1. Buat file komponen tema baru di folder `templates/` (misal: RoyalBlueTheme.jsx)
 * 2. Import komponen tersebut di file registry ini.
 * 3. Daftarkan di objek TEMPLATE_REGISTRY dengan key yang sesuai dengan `template_code` di database.
 * 4. Selesai! Semua halaman (halaman publik, modal preview, & tab preview detail) 
 *    secara otomatis akan memuat komponen tema baru tersebut saat client memilih template bersangkutan.
 */

export const TEMPLATE_REGISTRY = {
  // 1. Mildness - Earthy Sage & Luxury Ivory (Wevitation Demo: Mildness)
  mildness: {
    code: 'mildness',
    name: 'Mildness Earthy Sage & Luxury Ivory',
    component: MildnessTheme,
  },

  // 2. Snap Photo - Dark Mode Cinematic Photography (Wevitation Demo: Snap Photo)
  'snap-photo': {
    code: 'snap-photo',
    name: 'Snap Photo Cinematic Dark',
    component: SnapPhotoTheme,
  },

  // 3. Timeless Snapshot - Vintage Polaroid & Warm Sepia Romance (Wevitation Demo: Timeless Snapshot)
  'timeless-snapshot': {
    code: 'timeless-snapshot',
    name: 'Timeless Snapshot Vintage Polaroid',
    component: TimelessSnapshotTheme,
  },

  // 4. Serein - Minimalist Luxury & French Chic Pastel (Wevitation Demo: Serein)
  serein: {
    code: 'serein',
    name: 'Serein Minimalist Luxury',
    component: SereinTheme,
  },

  // 5. Keraton Jawa - Batik Kawung, Gunungan, Coklat Sogan & Emas
  'jawa-keraton': {
    code: 'jawa-keraton',
    name: 'Keraton Jawa Sogan & Emas',
    component: JavaneseTheme,
  },

  // 6. Priangan Hijau - Bambu, Daun & Hijau Segar khas Sunda
  'sunda-priangan': {
    code: 'sunda-priangan',
    name: 'Priangan Hijau Sunda',
    component: SundaneseTheme,
  },

  // 7. Rustic Wood & Botanical - Kayu Walnut, Kraft, Lampu Fairy & Dedaunan
  'rustic-wood': {
    code: 'rustic-wood',
    name: 'Rustic Wood & Botanical',
    component: RusticWoodTheme,
  },

  // 8. Royal Gold & Black Velvet - Mahkota Kerajaan, Obsidian & Emas Berkilau
  'royal-gold': {
    code: 'royal-gold',
    name: 'Royal Gold & Black Velvet',
    component: RoyalGoldTheme,
  },
  'elegant-gold': {
    code: 'elegant-gold',
    name: 'Royal Gold & Black Velvet',
    component: RoyalGoldTheme,
  },

  // 9. Crimson Rose & Pure Elegance - Merah Marun & Putih Elegan (Wevitation Demo: Simple Rustic 4)
  'crimson-rose': {
    code: 'crimson-rose',
    name: 'Crimson Rose & Pure Elegance',
    component: CrimsonRoseTheme,
  },
  'simple-rustic-4': {
    code: 'simple-rustic-4',
    name: 'Crimson Rose & Pure Elegance',
    component: CrimsonRoseTheme,
  },
  // 10. Forest Tropical (Lush Botanical Elegance)
  'forest-tropical': {
    code: 'forest-tropical',
    name: 'Forest Tropical Lush Botanical',
    component: ForestTropicalTheme,
  },
  tropical: {
    code: 'tropical',
    name: 'Forest Tropical Lush Botanical',
    component: ForestTropicalTheme,
  },
  'tropical-forest': {
    code: 'tropical-forest',
    name: 'Forest Tropical Lush Botanical',
    component: ForestTropicalTheme,
  },
  'red-white': {
    code: 'red-white',
    name: 'Crimson Rose & Pure Elegance',
    component: CrimsonRoseTheme,
  },
  'minimalist-mono': {
    code: 'minimalist-mono',
    name: 'Modern Minimalist Pure',
    component: SereinTheme,
  },
  'floral-blossom': {
    code: 'floral-blossom',
    name: 'Floral Blossom Pastel',
    component: MildnessTheme,
  },
  'javanese-heritage': {
    code: 'javanese-heritage',
    name: 'Javanese Traditional Heritage',
    component: JavaneseTheme,
  },
  'sundanese-classic': {
    code: 'sundanese-classic',
    name: 'Sundanese Classic Emerald',
    component: SundaneseTheme,
  },
};

/**
 * Helper untuk mengambil komponen React tema berdasarkan kode template.
 * Jika kode template belum memiliki JSX khusus, otomatis fallback ke MildnessTheme.
 */
export const getTemplateComponent = (templateCode) => {
  if (!templateCode) return MildnessTheme;
  const normalized = templateCode.toLowerCase().trim();
  const entry = TEMPLATE_REGISTRY[normalized];
  return entry?.component || MildnessTheme;
};
