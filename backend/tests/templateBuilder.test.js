const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const templateController = require('../controllers/templateController');
const templateService = require('../services/templateService');

const createMockReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  protocol: 'https',
  get(header) {
    if (String(header).toLowerCase() === 'host') return 'api.tamuva.test';
    return undefined;
  },
  ...overrides,
});

const createMockRes = () => {
  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };
  return res;
};

describe('Backend Template Builder Controller Suite', () => {
  const restorers = [];

  afterEach(() => {
    while (restorers.length > 0) {
      const fn = restorers.pop();
      fn();
    }
  });

  it('createTemplate returns 400 when template_code or name is missing', async () => {
    const req = createMockReq({ body: { template_code: '', name: '' } });
    const res = createMockRes();

    await templateController.createTemplate(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.success, false);
  });

  it('createTemplate forwards default_content_json including customTheme, assetPositions & music', async () => {
    let capturedPayload = null;
    const origCreate = templateService.createTemplate;
    templateService.createTemplate = async (payload) => {
      capturedPayload = payload;
      return { id: 101, ...payload };
    };
    restorers.push(() => {
      templateService.createTemplate = origCreate;
    });

    const defaultContent = {
      baseLayout: 'custom-builder',
      templateEventType: 'wedding',
      styleCategory: 'modern',
      musicUrl: 'https://api.tamuva.test/uploads/templates/music/wedding-bgm.mp3',
      musicTitle: 'wedding-bgm',
      customTheme: {
        coverStyle: 'envelope',
        photoFrameShape: 'cameo-overlay',
        assetPositions: {
          cornerTopLeftImage: 'top-both',
          dividerImage: 'all-sections',
        },
      },
    };

    const req = createMockReq({
      body: {
        template_code: 'wedding-custom-rose',
        name: 'Wedding Custom Rose',
        thumbnail_url: '/uploads/templates/covers/rose.png',
        is_active: true,
        default_content_json: defaultContent,
      },
    });
    const res = createMockRes();

    await templateController.createTemplate(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.payload.success, true);
    assert.deepEqual(capturedPayload.default_content_json, defaultContent);
    assert.equal(res.payload.data.template_code, 'wedding-custom-rose');
  });

  it('uploadThumbnail validates req.file and updates template when id param exists', async () => {
    const missingRes = createMockRes();
    await templateController.uploadThumbnail(createMockReq(), missingRes);
    assert.equal(missingRes.statusCode, 400);

    let updatedArgs = null;
    const origUpdate = templateService.updateTemplate;
    templateService.updateTemplate = async (id, patch) => {
      updatedArgs = { id, patch };
      return { id, ...patch };
    };
    restorers.push(() => {
      templateService.updateTemplate = origUpdate;
    });

    const okReq = createMockReq({
      params: { id: '15' },
      file: { filename: 'ornamen-corner.png' },
    });
    const okRes = createMockRes();

    await templateController.uploadThumbnail(okReq, okRes);

    assert.equal(okRes.statusCode, 200);
    assert.equal(okRes.payload.success, true);
    assert.equal(okRes.payload.data.relativeUrl, '/uploads/templates/covers/ornamen-corner.png');
    assert.equal(
      okRes.payload.data.url,
      'https://api.tamuva.test/uploads/templates/covers/ornamen-corner.png'
    );
    assert.deepEqual(updatedArgs, {
      id: '15',
      patch: {
        thumbnail_url: 'https://api.tamuva.test/uploads/templates/covers/ornamen-corner.png',
      },
    });
  });

  it('uploadTemplateVideo validates req.file and returns video upload metadata', async () => {
    const missingRes = createMockRes();
    await templateController.uploadTemplateVideo(createMockReq(), missingRes);
    assert.equal(missingRes.statusCode, 400);

    const okReq = createMockReq({
      file: { filename: 'templates-video-123.mp4' },
    });
    const okRes = createMockRes();

    await templateController.uploadTemplateVideo(okReq, okRes);

    assert.equal(okRes.statusCode, 200);
    assert.equal(okRes.payload.success, true);
    assert.equal(
      okRes.payload.data.relativeUrl,
      '/uploads/templates/video/templates-video-123.mp4'
    );
    assert.equal(
      okRes.payload.data.url,
      'https://api.tamuva.test/uploads/templates/video/templates-video-123.mp4'
    );
  });

  it('uploadTemplateMusic validates req.file and returns music upload metadata', async () => {
    const missingRes = createMockRes();
    await templateController.uploadTemplateMusic(createMockReq(), missingRes);
    assert.equal(missingRes.statusCode, 400);
    assert.equal(missingRes.payload.success, false);

    const okReq = createMockReq({
      file: { filename: 'templates-music-romantic-999.mp3' },
    });
    const okRes = createMockRes();

    await templateController.uploadTemplateMusic(okReq, okRes);

    assert.equal(okRes.statusCode, 200);
    assert.equal(okRes.payload.success, true);
    assert.equal(
      okRes.payload.data.relativeUrl,
      '/uploads/templates/music/templates-music-romantic-999.mp3'
    );
    assert.equal(
      okRes.payload.data.url,
      'https://api.tamuva.test/uploads/templates/music/templates-music-romantic-999.mp3'
    );
  });
});
