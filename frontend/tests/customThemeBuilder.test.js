import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createServer } from 'vite';

const frontendRoot = path.resolve(import.meta.dirname, '..');

let viteServer;
let CustomThemeBuilder;
let DEFAULT_CUSTOM_THEME;
let CUSTOM_THEME_PRESETS;
let getTemplateComponent;
let ToastProvider;

const renderTheme = (props = {}) => {
  const element = React.createElement(
    ToastProvider,
    null,
    React.createElement(CustomThemeBuilder, props)
  );
  return ReactDOMServer.renderToStaticMarkup(element);
};

const makeInvitation = ({
  templateCode = 'wedding-custom-test',
  baseLayout = 'custom-builder',
  customTheme = {},
  contentOverrides = {},
  defaultOverrides = {},
} = {}) => ({
  template_code: templateCode,
  template: {
    id: 99,
    template_code: templateCode,
    name: 'Test Custom Template',
    default_content_json: {
      baseLayout,
      templateEventType: 'wedding',
      ...defaultOverrides,
      customTheme: {
        ...customTheme,
        colors: {
          ...DEFAULT_CUSTOM_THEME.colors,
          ...(customTheme.colors || {}),
        },
        typography: {
          ...DEFAULT_CUSTOM_THEME.typography,
          ...(customTheme.typography || {}),
        },
        assets: {
          ...DEFAULT_CUSTOM_THEME.assets,
          ...(customTheme.assets || {}),
        },
        assetPositions: {
          ...DEFAULT_CUSTOM_THEME.assetPositions,
          ...(customTheme.assetPositions || {}),
        },
        animations: {
          ...DEFAULT_CUSTOM_THEME.animations,
          ...(customTheme.animations || {}),
        },
      },
    },
  },
  content_json: {
    eventType: 'wedding',
    showSecondEvent: true,
    mempelaiPria: 'Arya Bimantara',
    panggilanPria: 'Arya',
    mempelaiWanita: 'Bella Maharani',
    panggilanWanita: 'Bella',
    fotoCover: '/test-hero.jpg',
    fotoPria: '/test-groom.jpg',
    fotoWanita: '/test-bride.jpg',
    rekening: [{ bank: 'BCA', nomor: '1234567890', nama: 'Arya' }],
    ...contentOverrides,
  },
  rsvps: [
    {
      id: 1,
      guest_name: 'Tamu Kehormatan',
      attendance_status: 'Hadir',
      message: 'Selamat berbahagia!',
    },
  ],
});

describe('Custom Template Builder Suite', () => {
  before(async () => {
    viteServer = await createServer({
      root: frontendRoot,
      logLevel: 'error',
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'custom',
    });

    const builderMod = await viteServer.ssrLoadModule(
      '/src/components/invitation/templates/CustomThemeBuilder.jsx'
    );
    const registryMod = await viteServer.ssrLoadModule(
      '/src/components/invitation/templateRegistry.js'
    );
    const toastMod = await viteServer.ssrLoadModule('/src/components/ui/Toast.jsx');

    CustomThemeBuilder = builderMod.CustomThemeBuilder;
    DEFAULT_CUSTOM_THEME = builderMod.DEFAULT_CUSTOM_THEME;
    CUSTOM_THEME_PRESETS = builderMod.CUSTOM_THEME_PRESETS;
    getTemplateComponent = registryMod.getTemplateComponent;
    ToastProvider = toastMod.ToastProvider;
  });

  after(async () => {
    if (viteServer) {
      await viteServer.close();
    }
  });

  describe('1. Schema & Presets', () => {
    it('exports DEFAULT_CUSTOM_THEME with all required keys', () => {
      assert.ok(['envelope', 'arch-curtain', 'cinematic'].includes(DEFAULT_CUSTOM_THEME.coverStyle));
      assert.ok(
        ['cameo-overlay', 'arch', 'oval', 'circle', 'polaroid', 'rounded'].includes(
          DEFAULT_CUSTOM_THEME.photoFrameShape
        )
      );

      const colorKeys = [
        'bgPrimary',
        'bgSecondary',
        'textPrimary',
        'textMuted',
        'accent',
        'buttonBg',
        'buttonText',
      ];
      for (const key of colorKeys) {
        assert.match(DEFAULT_CUSTOM_THEME.colors[key], /^#[0-9a-fA-F]{3,8}$/);
      }

      const fontKeys = ['scriptFont', 'headingFont', 'bodyFont'];
      for (const key of fontKeys) {
        assert.ok(DEFAULT_CUSTOM_THEME.typography[key]);
      }

      const assetKeys = [
        'coverBgImage',
        'bodyBgImage',
        'envelopeClosedImage',
        'coupleFrameImage',
        'cornerTopLeftImage',
        'bottomPillarImage',
        'floatingAccentImage',
        'headerCalligraphyImage',
        'dividerImage',
        'venueIllustrationImage',
      ];
      for (const key of assetKeys) {
        assert.ok(Object.hasOwn(DEFAULT_CUSTOM_THEME.assets, key), `Missing assets.${key}`);
        assert.ok(
          Object.hasOwn(DEFAULT_CUSTOM_THEME.assetPositions, key),
          `Missing assetPositions.${key}`
        );
      }

      const animationKeys = [
        'coverTransition',
        'particleType',
        'particleColor',
        'ornamentMotion',
        'scrollReveal',
        'revealDuration',
      ];
      for (const key of animationKeys) {
        assert.ok(Object.hasOwn(DEFAULT_CUSTOM_THEME.animations, key), `Missing animations.${key}`);
      }
    });

    it('exports all 4 starter presets in CUSTOM_THEME_PRESETS', () => {
      for (const presetKey of ['romantic-cameo', 'noir-cinematic', 'royal-gold', 'botanical-sage']) {
        const preset = CUSTOM_THEME_PRESETS[presetKey];
        assert.ok(preset, `Preset ${presetKey} should exist`);
        assert.ok(preset.label);
        assert.ok(preset.theme.colors.bgPrimary);
        assert.ok(preset.theme.typography.scriptFont);
      }
    });
  });

  describe('2. Template Registry Routing', () => {
    it('routes custom-builder and unknown DB template codes to CustomThemeBuilder', () => {
      assert.equal(getTemplateComponent('custom-builder'), CustomThemeBuilder);
      assert.equal(getTemplateComponent('wedding-pearl-custom-new'), CustomThemeBuilder);
    });

    it('keeps built-in themes unless baseLayout overrides to custom-builder', () => {
      assert.notEqual(getTemplateComponent('drapery-pink'), CustomThemeBuilder);
      assert.notEqual(getTemplateComponent('noir-velvet'), CustomThemeBuilder);
      assert.notEqual(getTemplateComponent('mildness'), CustomThemeBuilder);

      assert.equal(
        getTemplateComponent('drapery-pink', {
          template: { default_content_json: { baseLayout: 'custom-builder' } },
        }),
        CustomThemeBuilder
      );
      assert.equal(
        getTemplateComponent('wedding-custom', {
          content_json: { baseLayout: 'custom-builder' },
        }),
        CustomThemeBuilder
      );
    });
  });

  describe('3. Cover Styles, Photo Frames, Colors, Typography & defaultOpened', () => {
    it('renders envelope, arch-curtain, and cinematic cover modes', () => {
      const envHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            coverStyle: 'envelope',
            assets: { envelopeClosedImage: '/env-custom.png' },
            assetPositions: { envelopeClosedImage: 'center' },
          },
        }),
        isModalView: true,
      });
      assert.match(envHtml, /Ketuk Amplop Untuk Membuka/);
      assert.match(envHtml, /\/env-custom\.png/);

      const archHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: { coverStyle: 'arch-curtain' },
        }),
        isModalView: true,
      });
      assert.match(archHtml, /rounded-t-\[110px\]/);
      assert.doesNotMatch(archHtml, /Ketuk Amplop Untuk Membuka/);

      const cinematicHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: { coverStyle: 'cinematic' },
        }),
        isModalView: true,
      });
      assert.match(cinematicHtml, /rgba\(10,8,7,0\.88\)/);
    });

    it('renders all 6 photoFrameShape options cleanly', () => {
      const shapeExpectations = {
        'cameo-overlay': /aspect-\[3\/4\]/,
        arch: /rounded-t-\[130px\]/,
        oval: /rounded-full p-2/,
        circle: /w-48 h-48 mx-auto rounded-full/,
        polaroid: /aspect-\[4\/5\]/,
        rounded: /w-52 h-68 mx-auto rounded-3xl/,
      };

      for (const [shape, pattern] of Object.entries(shapeExpectations)) {
        const html = renderTheme({
          invitation: makeInvitation({
            customTheme: { photoFrameShape: shape },
          }),
        });
        assert.match(html, pattern, `Expected markup match for photoFrameShape=${shape}`);
      }
    });

    it('applies custom colors, typography classes, mobile framing, and defaultOpened toggle', () => {
      const commonProps = {
        invitation: makeInvitation({
          customTheme: {
            colors: {
              bgPrimary: '#123456',
              bgSecondary: '#234567',
              accent: '#abcdef',
              buttonBg: '#fedcba',
              buttonText: '#111111',
            },
            typography: {
              scriptFont: 'font-amoresa',
              headingFont: 'font-cinzel',
              bodyFont: 'font-quicksand',
            },
          },
        }),
        isModalView: true,
      };

      const closedHtml = renderTheme({ ...commonProps, defaultOpened: false });
      assert.match(closedHtml, /#123456/);
      assert.match(closedHtml, /#abcdef/);
      assert.match(closedHtml, /font-amoresa/);
      assert.match(closedHtml, /font-cinzel/);
      assert.match(closedHtml, /font-quicksand/);
      assert.match(closedHtml, /left-1\/2 -translate-x-1\/2 w-full max-w-\[430px\]/);
      assert.match(closedHtml, /opacity-100 translate-y-0 scale-100/);

      const openedHtml = renderTheme({ ...commonProps, defaultOpened: true });
      assert.match(openedHtml, /-translate-y-full opacity-0 pointer-events-none/);
    });
  });

  describe('4. 4-Option Positions for All 10 PNG Ornament Slots', () => {
    it('coverBgImage supports center, top, bottom, and contain-center', () => {
      const expectations = {
        center: /src="\/pos-cover\.png"[^>]*class="[^"]*object-cover object-center/,
        top: /src="\/pos-cover\.png"[^>]*class="[^"]*object-cover object-top/,
        bottom: /src="\/pos-cover\.png"[^>]*class="[^"]*object-cover object-bottom/,
        'contain-center': /src="\/pos-cover\.png"[^>]*class="[^"]*object-contain object-center/,
      };

      for (const [pos, regex] of Object.entries(expectations)) {
        const html = renderTheme({
          invitation: makeInvitation({
            customTheme: {
              assets: { coverBgImage: '/pos-cover.png' },
              assetPositions: { coverBgImage: pos },
            },
            contentOverrides: { backgroundVideoUrl: 'none' },
          }),
        });
        assert.match(html, regex, `coverBgImage=${pos}`);
      }
    });

    it('bodyBgImage supports repeat-y, cover-fixed, top-banner, and tile-all', () => {
      const repeatY = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            assets: { bodyBgImage: '/pos-body.jpg' },
            assetPositions: { bodyBgImage: 'repeat-y' },
          },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
      });
      assert.match(repeatY, /background-repeat:repeat-y/);

      const coverFixed = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            assets: { bodyBgImage: '/pos-body.jpg' },
            assetPositions: { bodyBgImage: 'cover-fixed' },
          },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
        isModalView: true,
      });
      assert.match(coverFixed, /fixed inset-y-0 left-1\/2 -translate-x-1\/2 w-full max-w-\[430px\] z-0 opacity-75/);
      assert.match(coverFixed, /background-repeat:no-repeat/);

      const topBanner = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            assets: { bodyBgImage: '/pos-body.jpg' },
            assetPositions: { bodyBgImage: 'top-banner' },
          },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
      });
      assert.match(topBanner, /h-\[420px\]/);
      assert.match(topBanner, /background-size:100% auto/);

      const tileAll = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            assets: { bodyBgImage: '/pos-body.jpg' },
            assetPositions: { bodyBgImage: 'tile-all' },
          },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
      });
      assert.match(tileAll, /background-size:260px auto/);
      assert.match(tileAll, /background-repeat:repeat(?!-)/);
    });

    it('envelopeClosedImage supports center, top-curtain, bottom-stage, and full-frame', () => {
      const center = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            coverStyle: 'envelope',
            assets: { envelopeClosedImage: '/pos-env.png' },
            assetPositions: { envelopeClosedImage: 'center' },
          },
        }),
      });
      assert.match(center, /Ketuk Amplop Untuk Membuka/);

      const topCurtain = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            coverStyle: 'envelope',
            assets: { envelopeClosedImage: '/pos-env.png' },
            assetPositions: { envelopeClosedImage: 'top-curtain' },
          },
        }),
      });
      assert.match(topCurtain, /max-h-48 object-cover object-top z-10/);

      const bottomStage = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            coverStyle: 'envelope',
            assets: { envelopeClosedImage: '/pos-env.png' },
            assetPositions: { envelopeClosedImage: 'bottom-stage' },
          },
        }),
      });
      assert.match(bottomStage, /max-h-56 object-contain object-bottom z-10/);

      const fullFrame = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            coverStyle: 'envelope',
            assets: { envelopeClosedImage: '/pos-env.png' },
            assetPositions: { envelopeClosedImage: 'full-frame' },
          },
        }),
      });
      assert.match(fullFrame, /src="\/pos-env\.png"[^>]*inset-0 w-full h-full object-contain z-10/);
    });

    it('coupleFrameImage supports couple-only, couple-and-hero, couple-and-cover, and all-photos', () => {
      const countFrames = (pos) => {
        const html = renderTheme({
          invitation: makeInvitation({
            customTheme: {
              coverStyle: 'arch-curtain',
              photoFrameShape: 'cameo-overlay',
              assets: { coupleFrameImage: '/pos-frame.png' },
              assetPositions: { coupleFrameImage: pos },
            },
          }),
        });
        return (html.match(/src="\/pos-frame\.png"/g) || []).length;
      };

      assert.equal(countFrames('couple-only'), 2);
      assert.equal(countFrames('couple-and-hero'), 3);
      assert.equal(countFrames('couple-and-cover'), 3);
      assert.equal(countFrames('all-photos'), 4);
    });

    it('cornerTopLeftImage supports top-corners, top-both, top-left-only, and top-right-only', () => {
      const renderCorners = (pos) =>
        renderTheme({
          invitation: makeInvitation({
            customTheme: {
              assets: {
                cornerTopLeftImage: '/pos-corner.png',
                bottomPillarImage: '',
                floatingAccentImage: '',
              },
              assetPositions: { cornerTopLeftImage: pos },
            },
          }),
        });

      const corners = renderCorners('top-corners');
      assert.equal((corners.match(/src="\/pos-corner\.png"/g) || []).length, 2);
      assert.match(corners, /-top-6 -left-6/);
      assert.match(corners, /-top-4 -right-6/);

      const both = renderCorners('top-both');
      assert.equal((both.match(/src="\/pos-corner\.png"/g) || []).length, 4);

      const leftOnly = renderCorners('top-left-only');
      assert.equal((leftOnly.match(/src="\/pos-corner\.png"/g) || []).length, 2);
      assert.doesNotMatch(leftOnly, /-scale-x-100/);

      const rightOnly = renderCorners('top-right-only');
      assert.equal((rightOnly.match(/src="\/pos-corner\.png"/g) || []).length, 2);
      assert.doesNotMatch(rightOnly, /-top-[46] -left-6/);
    });

    it('bottomPillarImage supports bottom-center, bottom-corners, bottom-left, and bottom-right', () => {
      const renderPillar = (pos) =>
        renderTheme({
          invitation: makeInvitation({
            customTheme: {
              assets: {
                bottomPillarImage: '/pos-pillar.png',
                cornerTopLeftImage: '',
                floatingAccentImage: '',
              },
              assetPositions: { bottomPillarImage: pos },
            },
          }),
        });

      const center = renderPillar('bottom-center');
      assert.equal((center.match(/src="\/pos-pillar\.png"/g) || []).length, 1);
      assert.match(center, /mx-auto w-56 h-auto/);

      const corners = renderPillar('bottom-corners');
      assert.equal((corners.match(/src="\/pos-pillar\.png"/g) || []).length, 4);

      const left = renderPillar('bottom-left');
      assert.equal((left.match(/src="\/pos-pillar\.png"/g) || []).length, 2);
      assert.match(left, /-bottom-[34] -left-6/);
      assert.doesNotMatch(left, /-bottom-[34] -right-6/);

      const right = renderPillar('bottom-right');
      assert.equal((right.match(/src="\/pos-pillar\.png"/g) || []).length, 2);
      assert.match(right, /-bottom-[34] -right-6/);
      assert.doesNotMatch(right, /-bottom-[34] -left-6/);
    });

    it('floatingAccentImage supports all 4 corner positions on portraits & cover', () => {
      const cornerRegexes = {
        'bottom-right': /-bottom-2 -right-2/,
        'top-right': /-top-3 -right-2/,
        'top-left': /-top-3 -left-2 -scale-x-100/,
        'bottom-left': /-bottom-2 -left-2 -scale-x-100/,
      };

      for (const [pos, regex] of Object.entries(cornerRegexes)) {
        const html = renderTheme({
          invitation: makeInvitation({
            customTheme: {
              photoFrameShape: 'oval',
              assets: { floatingAccentImage: '/pos-butter.gif' },
              assetPositions: { floatingAccentImage: pos },
            },
          }),
        });
        assert.match(html, regex, `floatingAccentImage=${pos}`);
      }
    });

    it('headerCalligraphyImage supports above-greeting, above-hero-photo, cover-top, and above-couple', () => {
      const renderHeader = (pos) =>
        renderTheme({
          invitation: makeInvitation({
            customTheme: {
              assets: { headerCalligraphyImage: '/pos-bismillah.png' },
              assetPositions: { headerCalligraphyImage: pos },
            },
          }),
          isModalView: true,
        });

      const aboveGreeting = renderHeader('above-greeting');
      assert.equal((aboveGreeting.match(/src="\/pos-bismillah\.png"/g) || []).length, 1);
      assert.ok(aboveGreeting.indexOf('src="/test-hero.jpg"') !== -1);
      assert.ok(
        aboveGreeting.indexOf('src="/test-hero.jpg"') <
          aboveGreeting.indexOf('src="/pos-bismillah.png"')
      );

      const aboveHero = renderHeader('above-hero-photo');
      assert.equal((aboveHero.match(/src="\/pos-bismillah\.png"/g) || []).length, 1);
      assert.ok(aboveHero.indexOf('src="/pos-bismillah.png"') !== -1);
      assert.ok(
        aboveHero.indexOf('src="/pos-bismillah.png"') <
          aboveHero.indexOf('src="/test-hero.jpg"')
      );

      const coverTop = renderHeader('cover-top');
      assert.equal((coverTop.match(/src="\/pos-bismillah\.png"/g) || []).length, 2);

      const aboveCouple = renderHeader('above-couple');
      assert.equal((aboveCouple.match(/src="\/pos-bismillah\.png"/g) || []).length, 1);
      assert.ok(
        aboveCouple.indexOf('Mempelai Berbahagia') >
          aboveCouple.indexOf('src="/pos-bismillah.png"')
      );
      assert.ok(
        aboveCouple.indexOf('src="/pos-bismillah.png"') >
          aboveCouple.indexOf('src="/test-hero.jpg"')
      );
    });

    it('dividerImage supports between-events, all-sections, couple-and-events, and top-and-bottom', () => {
      const countDividers = (pos) => {
        const html = renderTheme({
          invitation: makeInvitation({
            customTheme: {
              assets: { dividerImage: '/pos-div.png' },
              assetPositions: { dividerImage: pos },
            },
          }),
        });
        return (html.match(/src="\/pos-div\.png"/g) || []).length;
      };

      assert.equal(countDividers('between-events'), 1);
      assert.equal(countDividers('couple-and-events'), 2);
      assert.equal(countDividers('top-and-bottom'), 2);
      assert.ok(countDividers('all-sections') >= 5);
    });

    it('venueIllustrationImage supports above-title, below-countdown, inside-event-card, and below-events', () => {
      const renderVenue = (pos) =>
        renderTheme({
          invitation: makeInvitation({
            customTheme: {
              assets: { venueIllustrationImage: '/pos-venue.png' },
              assetPositions: { venueIllustrationImage: pos },
            },
          }),
          isModalView: true,
        });

      const aboveTitle = renderVenue('above-title');
      assert.ok(aboveTitle.indexOf('src="/pos-venue.png"') !== -1);
      assert.ok(aboveTitle.indexOf('src="/pos-venue.png"') < aboveTitle.indexOf('Save The Date'));

      const belowCountdown = renderVenue('below-countdown');
      assert.ok(belowCountdown.indexOf('src="/pos-venue.png"') !== -1);
      assert.ok(belowCountdown.indexOf('Detik') < belowCountdown.indexOf('src="/pos-venue.png"'));
      assert.ok(
        belowCountdown.indexOf('src="/pos-venue.png"') < belowCountdown.indexOf('Google Maps')
      );

      const insideCard = renderVenue('inside-event-card');
      assert.match(insideCard, /src="\/pos-venue\.png"[^>]*class="[^"]*w-40 h-auto/);

      const belowEvents = renderVenue('below-events');
      assert.ok(belowEvents.indexOf('src="/pos-venue.png"') !== -1);
      assert.ok(
        belowEvents.lastIndexOf('Google Maps') < belowEvents.indexOf('src="/pos-venue.png"')
      );
      assert.ok(
        belowEvents.indexOf('src="/pos-venue.png"') <
          belowEvents.indexOf('Tampilkan Kartu QR Tamu')
      );
    });
  });

  describe('5. Media (MP3 Audio, Videos) & Multi-Event Mode', () => {
    it('renders uploaded MP3 musicUrl, background video, and YouTube Shorts embed', () => {
      const html = renderTheme({
        invitation: makeInvitation({
          defaultOverrides: {
            musicUrl: 'https://api.tamuva.test/uploads/templates/music/romantic.mp3',
            musicTitle: 'Romantic Song',
            backgroundVideoUrl: 'https://api.tamuva.test/uploads/templates/video/bg.mp4',
            preweddingVideoUrl: 'https://www.youtube.com/shorts/abc123XYZ00',
          },
        }),
        defaultOpened: true,
      });

      assert.match(html, /src="https:\/\/api\.tamuva\.test\/uploads\/templates\/music\/romantic\.mp3"/);
      assert.match(html, /src="https:\/\/api\.tamuva\.test\/uploads\/templates\/video\/bg\.mp4"/);
      assert.match(html, /https:\/\/www\.youtube\.com\/embed\/abc123XYZ00/);
    });

    it('adapts cleanly for single-person birthday event', () => {
      const html = renderTheme({
        invitation: makeInvitation({
          contentOverrides: {
            eventType: 'birthday',
            showSecondEvent: false,
            mempelaiPria: 'Clara Putri Maharani',
            panggilanPria: 'Clara',
            mempelaiWanita: '',
            panggilanWanita: '',
          },
        }),
      });

      assert.match(html, /Clara/);
      assert.doesNotMatch(html, /Kedua Mempelai/);
    });
  });

  describe('6. Opening Video Transition, Gate Curtains, Intimate Tier & Builder Enhancements', () => {
    it('exports forest-opening-video preset mapped to intimate (Undangan Saja) & /videos/forest-intro.mp4', () => {
      const preset = CUSTOM_THEME_PRESETS['forest-opening-video'];
      assert.ok(preset);
      assert.equal(preset.defaultContentPatch.introVideoUrl, '/videos/forest-intro.mp4');
      assert.equal(preset.defaultContentPatch.packageTier, 'intimate');
      assert.equal(preset.defaultContentPatch.showQr, false);
      assert.equal(preset.theme.coverStyle, 'gate-curtain');
      assert.equal(preset.theme.cardStyle, 'glass');
    });

    it('renders Opening Video (#t=0.001) and parting gate curtains on cover when introVideoUrl is set', () => {
      const preset = CUSTOM_THEME_PRESETS['forest-opening-video'];
      const html = renderTheme({
        invitation: makeInvitation({
          customTheme: preset.theme,
          defaultOverrides: preset.defaultContentPatch,
        }),
        isModalView: true,
        defaultOpened: false,
      });

      assert.match(html, /src="\/videos\/forest-intro\.mp4#t=0\.001"/);
      assert.match(html, /src="\/images\/forest-foliage-left\.png"/);
      assert.match(html, /src="\/images\/forest-foliage-right\.png"/);
      assert.match(html, /cb-firefly-item/);
      // Intimate tier ("Undangan Saja") hides QR Check-in button by default
      assert.doesNotMatch(html, /Tampilkan Kartu QR Tamu/);
    });

    it('automatically hides QR Check-in when packageTier is intimate even without explicit showQr', () => {
      const html = renderTheme({
        invitation: makeInvitation({
          defaultOverrides: {
            packageTier: 'intimate',
          },
        }),
        defaultOpened: true,
      });
      assert.doesNotMatch(html, /Tampilkan Kartu QR Tamu/);
    });

    it('supports carousel gallery layout, glass card style, and section toggles', () => {
      const html = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            cardStyle: 'glass',
            galleryStyle: 'carousel',
          },
          defaultOverrides: {
            showCountdown: false,
            showLoveStory: false,
            showSeatPlan: true,
            seatPlanImage: '/images/test-seatplan.png',
          },
        }),
        defaultOpened: true,
      });

      assert.match(html, /snap-x snap-mandatory/);
      assert.match(html, /backdrop-blur-md/);
      assert.match(html, /src="\/images\/test-seatplan\.png"/);
      assert.doesNotMatch(html, /Timeline/);
    });

    it('renders all 6 heroLayoutStyle options and all 5 bodyStyleMode options cleanly', () => {
      const heroMatchers = {
        'arch-frame': /rounded-t-\[150px\]/,
        'fullscreen-photo': /cb-hero-fullscreen/,
        'cameo-royal': /cb-hero-cameo/,
        'polaroid-collage': /cb-hero-polaroid/,
        'magazine-split': /cb-hero-magazine/,
        'minimal-typographic': /cb-hero-typographic/,
      };

      for (const [heroStyle, regex] of Object.entries(heroMatchers)) {
        const html = renderTheme({
          invitation: makeInvitation({
            customTheme: { heroLayoutStyle: heroStyle },
          }),
          defaultOpened: true,
        });
        assert.match(html, regex, `Expected heroLayoutStyle=${heroStyle} to match`);
      }

      const photoBackdropHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: { bodyStyleMode: 'photo-backdrop' },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
        defaultOpened: true,
      });
      assert.match(photoBackdropHtml, /cb-photo-backdrop/);

      const slideshowBackdropHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: { bodyStyleMode: 'slideshow-backdrop' },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
        defaultOpened: true,
      });
      assert.match(slideshowBackdropHtml, /cb-slideshow-backdrop/);

      const ornateFrameHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: { bodyStyleMode: 'ornate-frame' },
        }),
        defaultOpened: true,
      });
      assert.match(ornateFrameHtml, /cb-ornate-page-frame/);

      const cleanEditorialHtml = renderTheme({
        invitation: makeInvitation({
          customTheme: {
            bodyStyleMode: 'clean-editorial',
            assets: { bodyBgImage: '/should-not-render.jpg' },
          },
          contentOverrides: { backgroundVideoUrl: 'none' },
        }),
        defaultOpened: true,
      });
      assert.doesNotMatch(cleanEditorialHtml, /should-not-render\.jpg/);
    });
  });
});
