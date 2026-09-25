# LIMIT

A four-minute film that is computed, not played. Every frame is rendered live on your GPU and every note is synthesized in your browser. There is no video, no image and no audio file: the whole film is one HTML page of about 140 KB.

**Watch:** https://limit-film.fly.dev · in Mongolian: https://limit-film.fly.dev/mn/

Best on a desktop, with headphones. It needs WebGL2 with floating-point render targets, which any recent desktop Chrome, Edge, Firefox or Safari has.

## The five acts

| Act | Limit | What happens |
|---|---|---|
| I | lim n→∞ | Archimedes squeezes π between two polygons. Each doubling of the sides is a click, and the clicks speed up until they fuse into a pitch. |
| II | t → ∞ | The circle breaks into 1,048,576 particles that flow into the Lorenz attractor. |
| III | ε → 0 | A Mandelbrot dive. Near ×10⁶, 32-bit floats run out of digits and the image breaks into blocks. Perturbation theory carries the zoom on to about ×10³². |
| IV | r → rₛ | A Schwarzschild black hole, ray traced per pixel. As you fall in, the soundtrack takes the same gravitational redshift. |
| Coda | | Back to the single point the film opened on. |

## How it works

- **Rendering:** WebGL2 with floating-point HDR buffers, bloom and ACES tone mapping. The render resolution adapts to GPU timer measurements, so slower machines get softer frames instead of a lower frame rate.
- **Mandelbrot:** one reference orbit is computed in 256-bit fixed point with JavaScript `BigInt`. Every pixel iterates a float32 difference from it, with rebasing and a bilinear-approximation table that skips up to 4,096 iterations in one step. The dive ends on the nucleus of a period-8007 mini-Mandelbrot about 10⁻³² wide.
- **Particles:** each particle is integrated with fourth-order Runge–Kutta on the GPU every frame and drawn as a streak along its velocity.
- **Black hole:** light paths in Schwarzschild spacetime are integrated per pixel. The disk has a blackbody color, Doppler beaming and gravitational redshift over a lensed starfield.
- **Sound:** a small Web Audio synthesizer written for the film: oscillators, filters, a generated reverb and a score scheduled against the audio clock. The arpeggio notes come from the logistic map.

## Files

| File | Purpose |
|---|---|
| `limit.html` | The film, and the single source of truth. Opens in English by default. |
| `build.mjs` | Builds the Mongolian version and the standalone pages from `limit.html`. |
| `Dockerfile`, `nginx.conf`, `fly.toml` | Serve the film on Fly.io. |

## Build and run locally

```bash
node build.mjs
```

This writes `site/index.html` (English) and `site/mn/index.html` (Mongolian). Both open directly in a browser. It also writes `limit-mn.html`.

## Deploy to Fly.io

```bash
fly apps create limit-film
```

```bash
fly deploy
```

If `limit-film` is taken, pick another name and change `app` in `fly.toml`. The Docker build runs `build.mjs` itself, so the deployed site always matches `limit.html`.

Viewers only download one page, and their own devices do the rendering and the sound. One small machine can therefore serve any size of audience; each view costs about 44 KB of bandwidth.

## Language

The film plays in English or Mongolian. There is a switch on the start and end screens. Adding `#mn` or `#en` to a link also chooses the language, for example `https://limit-film.fly.dev/#mn-act3` plays in Mongolian starting from Act III. All on-screen text lives in the `I18N` table in `limit.html`.

---

Made with [Claude](https://claude.ai).
