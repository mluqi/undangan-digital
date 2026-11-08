import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

const escapeAttr = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = (env.VITE_API_URL || "http://localhost:8001/api").replace(/\/api\/?$/, "");

  return {
    plugins: [
      {
        name: "whatsapp-og-html-injector",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            try {
              const rawUrl = req.url || "/";
              const urlObj = new URL(rawUrl, `http://${req.headers.host || "localhost"}`);
              const match = urlObj.pathname.match(/^\/(?:invitation|u|p|preview)\/([^/?#]+)/);
              if (!match) return next();

              const slug = decodeURIComponent(match[1]);
              const apiRes = await fetch(`${apiTarget}/api/invitations/slug/${encodeURIComponent(slug)}`);
              if (!apiRes.ok) return next();

              const json = await apiRes.json();
              const invitation = json?.data;
              if (!invitation) return next();

              const content = invitation.content_json || {};
              const groom = content.panggilanPria || content.mempelaiPria || "Ahmad";
              const bride = content.panggilanWanita || content.mempelaiWanita || "Aminah";

              const title = `Undangan Pernikahan ${groom} dan ${bride}`;

              const akadDate = (content.akad?.tanggal || "").trim();
              const resepsiDate = (content.resepsi?.tanggal || "").trim();
              let desc = "";
              if (akadDate && resepsiDate) {
                desc =
                  akadDate === resepsiDate
                    ? `Akad & Resepsi: ${akadDate}`
                    : `Akad: ${akadDate} & Resepsi: ${resepsiDate}`;
              } else if (akadDate) {
                desc = `Akad: ${akadDate}`;
              } else if (resepsiDate) {
                desc = `Resepsi: ${resepsiDate}`;
              } else {
                desc = `Undangan Pernikahan ${groom} dan ${bride}`;
              }

              let cover = content.fotoWhatsapp || content.fotoCover;
              if (!cover && Array.isArray(content.galeri) && content.galeri.length > 0) {
                cover = content.galeri[0];
              }
              if (!cover) {
                cover =
                  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80";
              }

              const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:5173";
              const proto = (req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
              const uploadsIdx = cover.indexOf("/uploads/");
              if (uploadsIdx !== -1) {
                cover = `${proto}://${host}${cover.substring(uploadsIdx)}`;
              } else if (cover.startsWith("/")) {
                cover = `${proto}://${host}${cover}`;
              }

              const fs = await import("node:fs/promises");
              const path = await import("node:path");
              let html = await fs.readFile(path.resolve(process.cwd(), "index.html"), "utf-8");
              html = await server.transformIndexHtml(rawUrl, html, req.originalUrl);

              html = html
                .replace(/<title>.*?<\/title>/i, `<title>${escapeAttr(title)}</title>`)
                .replace(
                  /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
                  `<meta property="og:title" content="${escapeAttr(title)}" />`
                )
                .replace(
                  /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
                  `<meta property="og:description" content="${escapeAttr(desc)}" />`
                )
                .replace(
                  /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
                  `<meta property="og:image" content="${escapeAttr(cover)}" />`
                )
                .replace(
                  /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i,
                  `<meta property="og:image:secure_url" content="${escapeAttr(cover)}" />`
                )
                .replace(
                  /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
                  `<meta name="twitter:title" content="${escapeAttr(title)}" />`
                )
                .replace(
                  /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
                  `<meta name="twitter:description" content="${escapeAttr(desc)}" />`
                )
                .replace(
                  /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
                  `<meta name="twitter:image" content="${escapeAttr(cover)}" />`
                );

              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              return res.end(html);
            } catch {
              return next();
            }
          });
        },
      },
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/uploads": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
