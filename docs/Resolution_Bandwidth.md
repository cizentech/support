# Resolution, Megapixels & Bandwidth

"1-megapixel", "8MP", "4K", "Full HD" — the same camera is often described in several different ways. This page maps resolution to pixel count, pixel count to link bandwidth, and shows which MIG frame grabber and which SerDes link can carry each resolution / format / frame-rate combination.

> Use this page when choosing a board (MIG-S2 / S3 / S6) or a GMSL link rate for a given camera module.

## 1. Basics — pixel count = width × height

```text
pixel count = horizontal pixels × vertical pixels
1 MP (megapixel) = 1,000,000 pixels
```

| Megapixels | Pixel count | Also written as |
|---|---|---|
| 1 MP | 1,000,000 | 100만 화소 (Korean: "1 million pixels") |
| 2 MP | 2,000,000 | 200만 화소 |
| 5 MP | 5,000,000 | 500만 화소 |
| **8 MP** | 8,000,000 | **800만 화소** |
| 12 MP | 12,000,000 | 1200만 화소 |

> Korean, Japanese, and Chinese datasheets often count pixels in units of 10,000 (만). Divide by 100 to get MP: 800만 ÷ 100 = **8 MP**.

## 2. Resolution ↔ pixel count ↔ common name

| Resolution | Actual pixels | Nominal MP | Common names / examples |
|---|---|---|---|
| 1280×720 | 921,600 | ~0.9 MP | HD, 720p, "1-megapixel class" |
| 1280×960 | 1,228,800 | 1.2 MP | — |
| 1280×1024 | 1,310,720 | 1.3 MP | SXGA |
| **1920×1080** | **2,073,600** | **2 MP** | **Full HD, 1080p** |
| 1920×1200 | 2,304,000 | 2.3 MP | WUXGA |
| 1928×1208 | 2,329,024 | 2.3 MP | Common automotive sensor size |
| 1920×1536 | 2,949,120 | ~3 MP | 5:4-ish automotive sensors |
| 2688×1520 | 4,085,760 | 4 MP | QHD class |
| 3040×1520 | 4,620,800 | 4.6 MP | 2:1 surround-view sensors |
| **2592×1944** | **5,038,848** | **5 MP** | Common 5 MP automotive sensor size |
| **3840×2160** | **8,294,400** | **8 MP** | **4K UHD** |
| 4096×2160 | 8,847,360 | 8.8 MP | **DCI 4K** (cinema) |

> **"4K" means two different things.** **UHD 3840×2160** (broadcast, automotive) and **DCI 4K 4096×2160** (cinema). Unqualified "4K" almost always means **UHD**.

## 3. Pitfalls in the numbers

### Marketing rounding

- **8 MP** is really **8,294,400** (8.29 M), rounded down.
- **5 MP** is really 5,038,848 (5.04 M).
- **"1 megapixel"** (1280×720) is really 921,600 (0.92 M), rounded up.

For bandwidth and buffer calculations always use the **actual width × height**, never the nominal MP.

### Total vs. effective vs. output pixels

| Term | Meaning |
|---|---|
| **Total pixels** | Everything physically on the sensor, including dummy and optical-black pixels |
| **Effective / active** | Pixels that contribute to the image |
| **Output** | The resolution that actually comes out after crop / binning — **this is the value to configure** |

A datasheet may say "5.1 MP" while the streamed output is 2592×1944 (5.04 MP).

### Pixel count ≠ image quality

- **Sensor size (optical format)** and **pixel pitch** determine low-light performance and dynamic range.
- An optical format such as `1/2.44"` describes the sensor diagonal and is **independent of pixel count**.
- Two 8 MP sensors of different size have different pixel pitch, and the smaller one is noisier.

### Bayer / color filter

- The "8 MP" of an RGB sensor is the **total Bayer pixel count** (R, G, G, B together), not 8 M per color channel.
- Automotive variants (RCCB, RGB-IR, …) are counted the same way.

### Aspect ratio

| Ratio | Examples |
|---|---|
| 16:9 | 1920×1080, 3840×2160 |
| 4:3 | 2592×1944, 1280×960 |
| 5:4 | 1280×1024 |
| 2:1 | 3040×1520 |

The same MP figure can mean different resolutions when the aspect ratio differs.

## 4. In practice — pixel count is bandwidth

For GMSL / MIPI design what matters is not the MP label but **actual pixels × bits per pixel × frame rate**.

```text
bandwidth (bps) = width × height × bpp × fps × overhead
```

| Example | Calculation | Result |
|---|---|---|
| 2592×1944 RAW10 @ 30 fps | 5,038,848 × 10 × 30 | **1.51 Gbps** → fits a 3G link |
| 2592×1944 RAW10 @ 60 fps | × 60 | **3.02 Gbps** → **needs 6G** |
| 3840×2160 RAW12 @ 30 fps | 8,294,400 × 12 × 30 | **2.99 Gbps** → 6G recommended |
| 3040×1520 RGB888 @ 30 fps | 4,620,800 × 24 × 30 | **3.33 Gbps** → **6G required** |

> These are **pure payload** figures. Real links add blanking and packet overhead (×1.2–1.3).
> The effective GMSL2 payload limits used below are **3G = 2.6 Gbps, 6G = 5.2 Gbps**, the maximum video payload specified by the SerDes vendor. They already include margin for the sideband channels — see §4.2.

## 4.1 Frame size and bandwidth by pixel format

**Bits per pixel (bpp) by format**

| Format | **bpp** | Why |
|---|:---:|---|
| **Bayer 10-bit** | **10** | One color per pixel (R, G, or B) × 10 bits |
| **Bayer 12-bit** | **12** | One color per pixel × 12 bits |
| **YUV422** | **16** | Two pixels share `Y·Cb·Y·Cr` = 4 bytes → **2 bytes/pixel average** |
| **RGB888** | **24** | Three colors per pixel × 8 bits = 3 bytes/pixel |

```text
Bayer10 : Bayer12 : YUV422 : RGB888  =  10 : 12 : 16 : 24  =  1 : 1.2 : 1.6 : 2.4
```

> Bayer is small **not because it is compressed but because each pixel carries one color**. Demosaicing happens on the receiving side.

**Conversion table** (MB = 10⁶ bytes)

| Class<br>(resolution) | Format | **bpp** | **bits / frame** | **bytes / frame** | **30 fps**<br>MB/s | **30 fps**<br>Gbps | **60 fps**<br>MB/s | **60 fps**<br>Gbps |
|---|---|:---:|---:|---:|---:|---:|---:|---:|
| **2 MP**<br>1920×1080<br>2,073,600 px | Bayer10 | **10** | 20,736,000 | **2,592,000** | 77.8 | 0.62 | 155.5 | 1.24 |
| | Bayer12 | **12** | 24,883,200 | **3,110,400** | 93.3 | 0.75 | 186.6 | 1.49 |
| | YUV422 | **16** | 33,177,600 | **4,147,200** | 124.4 | 1.00 | 248.8 | 1.99 |
| | RGB888 | **24** | 49,766,400 | **6,220,800** | 186.6 | 1.49 | 373.2 | 2.99 |
| **3 MP**<br>2048×1536<br>3,145,728 px | Bayer10 | **10** | 31,457,280 | **3,932,160** | 118.0 | 0.94 | 235.9 | 1.89 |
| | Bayer12 | **12** | 37,748,736 | **4,718,592** | 141.6 | 1.13 | 283.1 | 2.26 |
| | YUV422 | **16** | 50,331,648 | **6,291,456** | 188.7 | 1.51 | 377.5 | 3.02 |
| | RGB888 | **24** | 75,497,472 | **9,437,184** | 283.1 | 2.26 | 566.2 | 4.53 |
| **4 MP**<br>2688×1520<br>4,085,760 px | Bayer10 | **10** | 40,857,600 | **5,107,200** | 153.2 | 1.23 | 306.4 | 2.45 |
| | Bayer12 | **12** | 49,029,120 | **6,128,640** | 183.9 | 1.47 | 367.7 | 2.94 |
| | YUV422 | **16** | 65,372,160 | **8,171,520** | 245.2 | 1.96 | 490.3 | 3.92 |
| | RGB888 | **24** | 98,058,240 | **12,257,280** | 367.7 | 2.94 | 735.4 | 5.88 |
| **8 MP**<br>3840×2160<br>8,294,400 px | Bayer10 | **10** | 82,944,000 | **10,368,000** | 311.0 | 2.49 | 622.1 | 4.98 |
| | Bayer12 | **12** | 99,532,800 | **12,441,600** | 373.2 | 2.99 | 746.5 | 5.97 |
| | YUV422 | **16** | 132,710,400 | **16,588,800** | 497.7 | 3.98 | 995.3 | 7.96 |
| | RGB888 | **24** | 199,065,600 | **24,883,200** | 746.5 | 5.97 | **1,493.0** | **11.94** |

```text
bits / frame  = width × height × bpp        bytes / frame = bits ÷ 8
MB/s          = bytes/frame × fps ÷ 1e6      Gbps          = bits/frame × fps ÷ 1e9
```

> The MP classes above are **nominal**. Real sensors differ (see the table in §2).
> Many "4 MP" products are actually **2560×1440 (3.69 MP)** — about **90 %** of the 4 MP figures above.

## 4.2 Effective interface bandwidth

GMSL2 links carry less video payload than their raw line rate. The vendor-specified maximum video payload is **3 Gbps mode → 2.6 Gbps, 6 Gbps mode → 5.2 Gbps** (86.7 %). The difference comes from 9b/10b encoding and guard-band protection, and the stated maximums already leave room for the sideband channels.

GMSL2 uses **9b/10b encoding, an 11 % overhead** (8b/10b would be 25 %) — which is why the efficiency is 86.7 % rather than 80 %.

| Link | **Raw rate** | **Effective** | MB/s | Basis |
|---|---:|---:|---:|---|
| **GMSL2 3G** | 3 Gbps | **2.60 Gbps** | 325 | Vendor specification |
| **GMSL2 6G** | 6 Gbps | **5.20 Gbps** | 650 | Vendor specification |
| GMSL1 | 3.12 Gbps | ~2.7 Gbps | ~338 | Estimate (86.7 % applied) |
| **GMSL3** | **12 Gbps** | **9.70 Gbps** | 1,213 | Vendor specification (80.8 %) |
| **FPD-Link III** | **4.16 Gbps** | **3.33 Gbps** | 416 | Vendor specification (80.0 %) |
| **FPD-Link IV** | **7.55 Gbps** | **6.00 Gbps** | 750 | Vendor specification (79.5 %) |
| USB 3.0 | 5 Gbps | **3.20 Gbps** | 400 | 8b/10b + protocol overhead |
| **Thunderbolt 3** | **40 Gbps** | **22 Gbps** | **2,750** | PCIe tunnel effective throughput (theoretical 32 Gbps) |

> **GMSL3** runs at a fixed 12 Gbps forward rate with a **9.7 Gbps video payload**.
> **GMSL3 is less efficient than GMSL2**: 80.8 % vs 86.7 %. The link doubles (6 → 12 Gbps) but the payload only grows **1.87×** (5.2 → 9.7). Assuming "12G = twice 6G" over-estimates capacity.
> **FPD-Link runs at about 80 % in both generations.** FPD-Link III packs 32 bits of video payload into each 40-bit frame — the same 20 % overhead as 8b/10b — so 4.16 × 0.8 = **3.33 Gbps**. FPD-Link IV carries a **6.0 Gbps video payload** on its 7.55 Gbps link (79.5 %).
> **Efficiency ranking: GMSL2 86.7 % > GMSL3 80.8 % ≈ FPD-Link III 80.0 % ≈ FPD-Link IV 79.5 %.** GMSL2 stands out because of its 9b/10b encoding (11 % overhead); the others all carry roughly 8b/10b-class 20 % overhead.
> The FPD-Link III figure is for the 4.16 Gbps class of deserializer. FPD-Link III parts range from 2.0 to 4.85 Gbps, so check the rate of the specific device.
> The Thunderbolt 3 figure of 22 Gbps reflects measured PCIe-tunnel throughput (external NVMe at 2.6–2.8 GB/s), not the 40 Gbps link rate.

### Applying a conservative 80 % rule instead

If you prefer a conservative **80 %** rule (3G = 2.4 / 6G = 4.8 Gbps) over the vendor values, **three combinations drop out**. All of them are Bayer10 with only 2–4 % headroom.

| Combination | Required | **Vendor value** | **Conservative ×0.8** |
|---|---:|:---:|:---:|
| **8 MP Bayer10 @ 30 fps** (3G) | 2.49 Gbps | ✅ (2.6) | 🔴 (2.4) |
| **4 MP Bayer10 @ 60 fps** (3G) | 2.45 Gbps | ✅ (2.6) | 🔴 (2.4) |
| **8 MP Bayer10 @ 60 fps** (6G) | 4.98 Gbps | ✅ (5.2) | 🔴 (4.8) |

> The vendor values (2.6 / 5.2) **already include the sideband margin**. Applying a further 80 % on top double-counts that margin.
> **Recommendation:** judge against the vendor values (2.6 / 5.2), and treat any combination with **less than 5 % headroom** as *borderline* — confirm it by measurement.

## 4.3 Link capacity matrix

**Criteria (all effective payload values):** GMSL2 = 3G 2.6 / 6G 5.2 · GMSL3 = 9.7 · FPD-Link III = 3.33 · FPD-Link IV = 6.0 · USB 3.0 (S2) = 3.2 · USB 3.2 (S3) = 8.0 · TB3 = 22

**Legend:** ✅ fits · 🟡 **borderline (under 5 % headroom — verify by measurement)** · 🔴 exceeds

**30 fps**

| MP | Format | Gbps | GMSL2<br>3G<br>(eff. 2.6G) | GMSL2<br>6G<br>(eff. 5.2G) | **GMSL3**<br>12G<br>(eff. 9.7G) | FPD-Link III<br>4.16G<br>(eff. 3.33G) | FPD-Link IV<br>7.55G<br>(eff. 6.0G) | USB3.0(S2)<br>5G<br>(eff. 3.2G) | USB3.2(S3)<br>10G<br>(eff. 8.0G) | **TB3**<br>40G<br>(eff. 22G) |
|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 2 MP | Bayer10 | 0.62 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | Bayer12 | 0.75 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | YUV422 | 1.00 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | RGB888 | 1.49 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer10 | 0.94 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer12 | 1.13 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | YUV422 | 1.51 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | RGB888 | 2.26 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | Bayer10 | 1.23 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | Bayer12 | 1.47 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | YUV422 | 1.96 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | RGB888 | 2.94 | 🔴 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 MP | Bayer10 | 2.49 | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 MP | Bayer12 | 2.99 | 🔴 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 MP | YUV422 | 3.98 | 🔴 | ✅ | ✅ | 🔴 | ✅ | 🔴 | ✅ | ✅ |
| 8 MP | RGB888 | 5.97 | 🔴 | 🔴 | ✅ | 🔴 | 🟡 | 🔴 | ✅ | ✅ |

**60 fps**

| MP | Format | Gbps | GMSL2<br>3G<br>(eff. 2.6G) | GMSL2<br>6G<br>(eff. 5.2G) | **GMSL3**<br>12G<br>(eff. 9.7G) | FPD-Link III<br>4.16G<br>(eff. 3.33G) | FPD-Link IV<br>7.55G<br>(eff. 6.0G) | USB3.0(S2)<br>5G<br>(eff. 3.2G) | USB3.2(S3)<br>10G<br>(eff. 8.0G) | **TB3**<br>40G<br>(eff. 22G) |
|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 2 MP | Bayer10 | 1.24 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | Bayer12 | 1.49 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | YUV422 | 1.99 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | RGB888 | 2.99 | 🔴 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer10 | 1.89 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer12 | 2.26 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | YUV422 | 3.02 | 🔴 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | RGB888 | 4.53 | 🔴 | ✅ | ✅ | 🔴 | ✅ | 🔴 | ✅ | ✅ |
| 4 MP | Bayer10 | 2.45 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | Bayer12 | 2.94 | 🔴 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | YUV422 | 3.92 | 🔴 | ✅ | ✅ | 🔴 | ✅ | 🔴 | ✅ | ✅ |
| 4 MP | RGB888 | 5.88 | 🔴 | 🔴 | ✅ | 🔴 | 🟡 | 🔴 | ✅ | ✅ |
| 8 MP | Bayer10 | 4.98 | 🔴 | 🟡 | ✅ | 🔴 | ✅ | 🔴 | ✅ | ✅ |
| 8 MP | Bayer12 | 5.97 | 🔴 | 🔴 | ✅ | 🔴 | 🟡 | 🔴 | ✅ | ✅ |
| 8 MP | YUV422 | 7.96 | 🔴 | 🔴 | ✅ | 🔴 | 🔴 | 🔴 | 🟡 | ✅ |
| 8 MP | RGB888 | 11.94 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | ✅ |

> **Borderline cases** — **8 MP Bayer10 @ 30 fps on GMSL2 3G (2.49)**, **8 MP Bayer10 @ 60 fps on GMSL2 6G (4.98)**, and on **FPD-Link IV (6.0)**: 8 MP RGB888 @ 30 fps, 4 MP RGB888 @ 60 fps, 8 MP Bayer12 @ 60 fps (5.88–5.97). With only **2–4 % headroom**, blanking and packet overhead can push them over. **Measure before committing.**
> GMSL3 (9.7) does not change any verdict, because no combination lands in the 9.7–10.4 range. It does make clear that **8 MP RGB888 @ 60 fps (11.94) is out of reach even for GMSL3**.
> **FPD-Link III (3.33) is narrower than its raw rate suggests** — 8 MP fits only up to **Bayer12 @ 30 fps (2.99)**; YUV422 and above are blocked.
> **FPD-Link IV (6.0) and GMSL2 6G (5.2) are in the same class.** The raw rates (7.55 vs 6.0) look far apart, but the effective payloads differ by only **15 %**.

## 4.4 What to take from the matrix

| Observation | Detail |
|---|---|
| **GMSL2 6G practical limit** | **5.2 Gbps**. 8 MP fits comfortably up to **Bayer12 @ 30 fps (2.99)**; **Bayer10 @ 60 fps (4.98)** is 🟡 borderline |
| **GMSL2 3G practical limit** | **2.6 Gbps**. Comfortable up to **4 MP**; 8 MP Bayer10 @ 30 fps (2.49) is 🟡 borderline |
| **GMSL3 practical limit** | **9.7 Gbps**. Covers up to **8 MP YUV422 @ 60 fps (7.96)** |
| **GMSL3 is less efficient** | **80.8 %** (9.7 / 12) vs GMSL2 **86.7 %** (5.2 / 6). **Double the link ≠ double the payload** (1.87×) |
| **The one case GMSL3 cannot carry** | **8 MP RGB888 @ 60 fps = 11.94 Gbps** — **only Thunderbolt 3 passes** in the whole table |
| **TB3 passes everything** | Even at the heaviest load (11.94 Gbps) utilisation is **54 %** |
| **The USB 3.0 wall** | **3.2 Gbps** — 8 MP only up to **Bayer12 @ 30 fps (2.99)**; YUV422 and above are blocked |
| **The cost of RGB888** | **2.4×** Bayer10. The standard approach is to **send Bayer over the link and run the ISP on the receiver** |
| **The "fixed rate" trap** | GMSL2 has **no intermediate rates**. If you need 5 Gbps you configure **6G and the remainder is idle** — so channel design must also assume **6G (f½ = 3 GHz)** |
| **FPD-Link III practical limit** | **3.33 Gbps** (4.16 × 80 %). 8 MP only up to **Bayer12 @ 30 fps (2.99)**; YUV422 and above are blocked — easy to miss when judging by the raw rate |
| **FPD-Link IV practical limit** | **6.0 Gbps** (7.55 × 79.5 %). **8 MP Bayer12 @ 60 fps (5.97)** is 🟡 borderline; YUV422 @ 60 fps (7.96) is 🔴 |
| **FPD-Link IV ≈ GMSL2 6G** | Raw 7.55 vs 6.0 looks like a big gap, but effective **6.0 vs 5.2 is only 15 %** |
| **Only GMSL2 is unusually efficient** | **GMSL2 86.7 % > GMSL3 80.8 % ≈ FPD-Link III 80.0 % ≈ FPD-Link IV 79.5 %.** GMSL2's 9b/10b (11 % overhead) is the only one outside the 8b/10b-class 20 % |

> These verdicts are for **pixel data only**. The vendor values include sideband margin but **blanking and CSI-2 packet overhead are extra**, so always measure the 🟡 borderline combinations.

## 4.5 MIG boards + GMSL capacity matrix

### Capture ceiling per board

| Board | Host link | **Capture ceiling** | Basis |
|---|---|---:|---|
| **MIG-S2** (FX3) | USB 3.0 | **3.2 Gbps** (400 MB/s) | 8b/10b + protocol overhead |
| **MIG-S3** (FX10) | USB 3.2 Gen 2 | **8.0 Gbps** (~1,000 MB/s) | USB 10 Gbps Gen 2 effective ≈ 1 GB/s; the GPIF III receive path (1,280 MB/s) is not the bottleneck |
| **MIG-S6** (PCIe FPGA) | Thunderbolt 3 | **22 Gbps** (2,750 MB/s) | PCIe tunnel effective throughput |

> **MIG-S3 has different limits per direction.**
> **Capture (RX):** GPIF III RX 1,280 MB/s is not limiting — **USB is the ceiling (~1 GB/s)**.
> **Playback (TX):** **GPIF III TX = SDR 100 MHz × 32 bit = 400 MB/s = 3.2 Gbps** — this is the bottleneck.
> **Used as a pattern generator, MIG-S3 is therefore equivalent to MIG-S2 (3.2 Gbps).** The tables below are for **capture**.

**Legend:** ✅ fits · 🟡 **borderline (under 5 % headroom — verify by measurement)** · 🔴 exceeds

**30 fps**

| MP | Format | Gbps | MB/s | **S2**<br>USB 3.0<br>3.2G | **S3**<br>USB 3.2<br>8.0G | **S6**<br>TB3<br>22G | GMSL2<br>3G<br>2.6 | GMSL2<br>6G<br>5.2 | **GMSL3**<br>9.7 |
|---|---|---:|---:|:-:|:-:|:-:|:-:|:-:|:-:|
| 2 MP | Bayer10 | 0.62 | 78 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | Bayer12 | 0.75 | 93 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | YUV422 | 1.00 | 124 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | RGB888 | 1.49 | 187 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer10 | 0.94 | 118 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer12 | 1.13 | 142 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | YUV422 | 1.51 | 189 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | RGB888 | 2.26 | 283 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | Bayer10 | 1.23 | 153 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | Bayer12 | 1.47 | 184 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | YUV422 | 1.96 | 245 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | RGB888 | 2.94 | 368 | ✅ | ✅ | ✅ | 🔴 | ✅ | ✅ |
| **8 MP** | Bayer10 | 2.49 | 311 | ✅ | ✅ | ✅ | 🟡 | ✅ | ✅ |
| **8 MP** | Bayer12 | 2.99 | 373 | ✅ | ✅ | ✅ | 🔴 | ✅ | ✅ |
| **8 MP** | YUV422 | 3.98 | 498 | 🔴 | ✅ | ✅ | 🔴 | ✅ | ✅ |
| **8 MP** | RGB888 | 5.97 | 746 | 🔴 | ✅ | ✅ | 🔴 | 🔴 | ✅ |

**60 fps**

| MP | Format | Gbps | MB/s | **S2**<br>USB 3.0<br>3.2G | **S3**<br>USB 3.2<br>8.0G | **S6**<br>TB3<br>22G | GMSL2<br>3G<br>2.6 | GMSL2<br>6G<br>5.2 | **GMSL3**<br>9.7 |
|---|---|---:|---:|:-:|:-:|:-:|:-:|:-:|:-:|
| 2 MP | Bayer10 | 1.24 | 156 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | Bayer12 | 1.49 | 187 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | YUV422 | 1.99 | 249 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 MP | RGB888 | 2.99 | 373 | ✅ | ✅ | ✅ | 🔴 | ✅ | ✅ |
| 3 MP | Bayer10 | 1.89 | 236 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | Bayer12 | 2.26 | 283 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 MP | YUV422 | 3.02 | 377 | ✅ | ✅ | ✅ | 🔴 | ✅ | ✅ |
| 3 MP | RGB888 | 4.53 | 566 | 🔴 | ✅ | ✅ | 🔴 | ✅ | ✅ |
| 4 MP | Bayer10 | 2.45 | 306 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 MP | Bayer12 | 2.94 | 368 | ✅ | ✅ | ✅ | 🔴 | ✅ | ✅ |
| 4 MP | YUV422 | 3.92 | 490 | 🔴 | ✅ | ✅ | 🔴 | ✅ | ✅ |
| 4 MP | RGB888 | 5.88 | 735 | 🔴 | ✅ | ✅ | 🔴 | 🔴 | ✅ |
| **8 MP** | Bayer10 | 4.98 | 622 | 🔴 | ✅ | ✅ | 🔴 | 🟡 | ✅ |
| **8 MP** | Bayer12 | 5.97 | 746 | 🔴 | ✅ | ✅ | 🔴 | 🔴 | ✅ |
| **8 MP** | YUV422 | 7.96 | 995 | 🔴 | 🟡 | ✅ | 🔴 | 🔴 | ✅ |
| **8 MP** | RGB888 | 11.94 | 1493 | 🔴 | 🔴 | ✅ | 🔴 | 🔴 | 🔴 |

### Coverage summary

| Board | 30 fps | 60 fps |
|---|---|---|
| **MIG-S2** (3.2 G) | ✅ up to **8 MP Bayer12** / 🔴 from 8 MP YUV422 | ✅ up to **4 MP Bayer12** / 🔴 from 3 MP RGB888 and 4 MP YUV422 |
| **MIG-S3** (8.0 G) | ✅ **all combinations** | ✅ up to **8 MP Bayer12** / 🟡 8 MP YUV422 / 🔴 **8 MP RGB888** |
| **MIG-S6** (22 G) | ✅ **all combinations** | ✅ **all combinations** (54 % utilisation at the heaviest load) |

| Link | 30 fps | 60 fps |
|---|---|---|
| **GMSL2 3G** (2.6) | up to **4 MP YUV422** / 🟡 8 MP Bayer10 | up to **4 MP Bayer10** |
| **GMSL2 6G** (5.2) | up to **8 MP YUV422** / 🔴 8 MP RGB888 | up to **4 MP YUV422** / 🟡 **8 MP Bayer10** |
| **GMSL3** (9.7) | ✅ **all combinations** | up to **8 MP YUV422** / 🔴 **8 MP RGB888** |

### Reading board and link together

| Observation | Detail |
|---|---|
| **Where MIG-S2 stops** | **8 MP Bayer12 @ 30 fps (2.99 G)** is the last combination that fits. That is almost exactly the GMSL2 6G limit, so **MIG-S2 + GMSL2 6G is a balanced pairing** |
| **What MIG-S3 unlocks** | **8 MP RGB888 @ 30 fps** and **8 MP Bayer12 @ 60 fps** (both 5.97 G) — not possible on MIG-S2 |
| **MIG-S3 + GMSL3: the board is the bottleneck** | GMSL3 can deliver 9.7 G but **MIG-S3 captures 8.0 G**. **8 MP YUV422 @ 60 fps (7.96)** is 🟡 borderline on MIG-S3 |
| **8 MP RGB888 @ 60 fps (11.94 G)** | **Only MIG-S6 (TB3) can capture it, and no SerDes link — not even GMSL3 — can deliver it.** The board could receive it but nothing can send it |
| **MIG-S6 is not overkill** | For multi-channel capture the headroom matters: **22 G ÷ 2.99 G ≈ 7 channels of 8 MP Bayer12 @ 30 fps** |
| **MIG-S3 as a generator** | Playback is limited by **GPIF TX 400 MB/s = 3.2 Gbps**, the same as MIG-S2. For playback, read the **S2 column** |

## 5. Quick conversions

```text
① pixels → MP           :  width × height ÷ 1,000,000
② MP → "만 화소" (Korean) :  MP × 100
③ 16:9, height known    :  width ≈ height × 16 / 9   (1080 → 1920,  2160 → 3840)
④ "4K is 4× Full HD"    :  3840×2160 = 1920×1080 × 4   (2× width × 2× height)
```

## Basis of the figures

| Figure | Status |
|---|---|
| Pixel counts, frame sizes, Gbps / MB/s in §4.1 | Arithmetic from width × height × bpp × fps — verifiable |
| GMSL2 3G = 2.6 / 6G = 5.2 Gbps | SerDes vendor specification |
| GMSL3 12 Gbps link / 9.7 Gbps payload | SerDes vendor specification |
| GMSL2 is a fixed-rate link (6G → f½ = 3 GHz) | SerDes vendor specification |
| GMSL1 ~2.7 Gbps effective | Estimate — 86.7 % applied by analogy with GMSL2 |
| FPD-Link III 3.33 Gbps / FPD-Link IV 6.0 Gbps effective | SerDes vendor specification — the III figure is for the 4.16 Gbps class (III parts range 2.0–4.85 Gbps) |
| USB 3.0 ≈ 400 MB/s, Thunderbolt 3 ≈ 22 Gbps | Industry rule of thumb / measured PCIe-tunnel throughput |
| Representative resolutions per MP class | Convention (2 MP = 1920×1080, 3 MP = 2048×1536, 4 MP = 2688×1520, 8 MP = 3840×2160) — real sensors differ |
| Overhead factor ×1.2–1.3, 5 % borderline threshold | Engineering rules of thumb |

Open items: measured verification of the borderline cases — 8 MP Bayer10 @ 30 fps on GMSL2 3G, 8 MP Bayer10 @ 60 fps on GMSL2 6G, and the three FPD-Link IV cases at 5.88–5.97 Gbps.

***

See also: [Frame Grabber](FrameGrabber.md) for board specifications and [Deserializer](Deserializer.md) for supported SerDes parts.
