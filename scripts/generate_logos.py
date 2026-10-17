import os
import shutil
import subprocess
import tempfile
from PIL import Image

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "public", "brand"))
ARTIFACT_DIR = r"C:\Users\phlim\.gemini\antigravity\brain\f5c3474a-34e6-4310-b970-13900fcf9d71"
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

# 1. Monogram - Flat Gold (Original)
SVG_MONOGRAM_FLAT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- LinkMolay Monogram - Flat Colors -->
  <path d="M 200 210 H 360 V 670 H 640 V 830 H 200 Z" fill="#C9A038"/>
  <circle cx="750" cy="290" r="95" fill="#E0BF5C"/>
</svg>"""

# 2. Monogram - Luxury Gold Gradient
SVG_MONOGRAM_GRADIENT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE382"/>
      <stop offset="25%" stop-color="#E5BE53"/>
      <stop offset="70%" stop-color="#C49A2E"/>
      <stop offset="100%" stop-color="#936D19"/>
    </linearGradient>
    <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0A5"/>
      <stop offset="60%" stop-color="#E5BE53"/>
      <stop offset="100%" stop-color="#B88A24"/>
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#C9A038" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#subtleGlow)">
    <path d="M 200 210 H 360 V 670 H 640 V 830 H 200 Z" fill="url(#goldGradient)"/>
    <circle cx="750" cy="290" r="95" fill="url(#dotGradient)"/>
  </g>
</svg>"""

# 3. Monogram - Modern Rounded (Smooth vertices)
SVG_MONOGRAM_ROUNDED = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="goldGradientSmooth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE382"/>
      <stop offset="30%" stop-color="#E5BE53"/>
      <stop offset="75%" stop-color="#C49A2E"/>
      <stop offset="100%" stop-color="#936D19"/>
    </linearGradient>
    <linearGradient id="dotSmooth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0A5"/>
      <stop offset="70%" stop-color="#E5BE53"/>
      <stop offset="100%" stop-color="#B88A24"/>
    </linearGradient>
  </defs>
  <!-- Rounded L Path -->
  <path d="
    M 230 210
    H 330
    A 30 30 0 0 1 360 240
    V 640
    A 30 30 0 0 0 390 670
    H 610
    A 30 30 0 0 1 640 700
    V 800
    A 30 30 0 0 1 610 830
    H 230
    A 30 30 0 0 1 200 800
    V 240
    A 30 30 0 0 1 230 210
    Z"
    fill="url(#goldGradientSmooth)"
  />
  <circle cx="750" cy="290" r="95" fill="url(#dotSmooth)"/>
</svg>"""

# 4. App Badge (The Favicon Squircle in Ultra-HD, transparent outside)
SVG_BADGE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111B38"/>
      <stop offset="100%" stop-color="#070D1E"/>
    </linearGradient>
    <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE382"/>
      <stop offset="35%" stop-color="#E5BE53"/>
      <stop offset="80%" stop-color="#C49A2E"/>
      <stop offset="100%" stop-color="#936D19"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect x="64" y="64" width="896" height="896" rx="256" fill="url(#bgGrad)" stroke="#C9A038" stroke-width="12" stroke-opacity="0.35" filter="url(#cardShadow)"/>
  <path d="M 270 270 H 390 V 630 H 610 V 750 H 270 Z" fill="url(#badgeGold)"/>
  <circle cx="710" cy="330" r="75" fill="url(#badgeGold)"/>
</svg>"""

# 5. Full Horizontal Logo - Dark Version (Transparent background)
SVG_HORIZONTAL_DARK = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 600" width="1920" height="600">
  <defs>
    <linearGradient id="goldH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE382"/>
      <stop offset="40%" stop-color="#E5BE53"/>
      <stop offset="85%" stop-color="#C49A2E"/>
      <stop offset="100%" stop-color="#936D19"/>
    </linearGradient>
  </defs>
  <!-- Monogram -->
  <g transform="translate(80, 50)">
    <path d="M 100 100 H 200 V 390 H 380 V 490 H 100 Z" fill="url(#goldH)"/>
    <circle cx="450" cy="150" r="60" fill="url(#goldH)"/>
  </g>
  <!-- Typography -->
  <g transform="translate(640, 320)">
    <text font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="140" letter-spacing="-2">
      <tspan fill="#FFFFFF">LINK</tspan><tspan fill="#E5BE53">MOLAY</tspan>
    </text>
    <text y="70" font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="34" letter-spacing="14" fill="#94A3B8">
      REDE PROFISSIONAL
    </text>
  </g>
</svg>"""

# 6. Full Horizontal Logo - Light Version (Transparent background)
SVG_HORIZONTAL_LIGHT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 600" width="1920" height="600">
  <defs>
    <linearGradient id="goldHL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5BE53"/>
      <stop offset="60%" stop-color="#C49A2E"/>
      <stop offset="100%" stop-color="#8F6814"/>
    </linearGradient>
  </defs>
  <!-- Monogram -->
  <g transform="translate(80, 50)">
    <path d="M 100 100 H 200 V 390 H 380 V 490 H 100 Z" fill="url(#goldHL)"/>
    <circle cx="450" cy="150" r="60" fill="url(#goldHL)"/>
  </g>
  <!-- Typography -->
  <g transform="translate(640, 320)">
    <text font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="140" letter-spacing="-2">
      <tspan fill="#0B132B">LINK</tspan><tspan fill="#C49A2E">MOLAY</tspan>
    </text>
    <text y="70" font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="34" letter-spacing="14" fill="#64748B">
      REDE PROFISSIONAL
    </text>
  </g>
</svg>"""

VARIANTS = [
    {
        "id": "linkmolay-monogram-flat",
        "title": "Monograma Clássico (Cores Originais)",
        "svg": SVG_MONOGRAM_FLAT,
        "aspect": (1024, 1024),
        "sizes": [512, 1024, 2048]
    },
    {
        "id": "linkmolay-monogram-gold",
        "title": "Monograma Ouro Realista (Degradê Dourado)",
        "svg": SVG_MONOGRAM_GRADIENT,
        "aspect": (1024, 1024),
        "sizes": [512, 1024, 2048]
    },
    {
        "id": "linkmolay-monogram-rounded",
        "title": "Monograma Moderno Suavizado (Cantos Arredondados)",
        "svg": SVG_MONOGRAM_ROUNDED,
        "aspect": (1024, 1024),
        "sizes": [512, 1024, 2048]
    },
    {
        "id": "linkmolay-app-badge",
        "title": "Badge / Ícone do App (Fundo Navy Escuro, Transparente Externo)",
        "svg": SVG_BADGE,
        "aspect": (1024, 1024),
        "sizes": [512, 1024]
    },
    {
        "id": "linkmolay-horizontal-dark",
        "title": "Logo Completo Horizontal (Para Fundos Escuros)",
        "svg": SVG_HORIZONTAL_DARK,
        "aspect": (1920, 600),
        "sizes": [(1920, 600), (960, 300)]
    },
    {
        "id": "linkmolay-horizontal-light",
        "title": "Logo Completo Horizontal (Para Fundos Claros)",
        "svg": SVG_HORIZONTAL_LIGHT,
        "aspect": (1920, 600),
        "sizes": [(1920, 600), (960, 300)]
    }
]

def render_svg_to_png(svg_str, out_png_path, width, height):
    tmp_html = os.path.join(tempfile.gettempdir(), f"render_{os.path.basename(out_png_path)}.html")
    html_code = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{
    width: {width}px;
    height: {height}px;
    background: transparent !important;
    overflow: hidden;
  }}
  svg {{
    width: {width}px;
    height: {height}px;
    display: block;
  }}
</style>
</head>
<body>
{svg_str}
</body>
</html>"""
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html_code)

    tmp_out = os.path.join(tempfile.gettempdir(), f"tmp_{os.path.basename(out_png_path)}")
    if os.path.exists(tmp_out):
        os.remove(tmp_out)

    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--disable-gpu",
        "--default-background-color=00000000",
        f"--window-size={width},{height}",
        f"--screenshot={tmp_out}",
        "file:///" + tmp_html.replace("\\", "/")
    ]
    subprocess.run(cmd, capture_output=True)

    if os.path.exists(tmp_out):
        im = Image.open(tmp_out)
        # Ensure exact requested size and transparency
        if im.size != (width, height):
            im = im.resize((width, height), Image.Resampling.LANCZOS)
        im.save(out_png_path, "PNG")
        try:
            os.remove(tmp_out)
            os.remove(tmp_html)
        except Exception:
            pass
        return True
    return False

def main():
    print("Generating vector SVGs and ultra high-res PNGs...")
    generated_files = []

    for item in VARIANTS:
        var_id = item["id"]
        svg_content = item["svg"]
        base_w, base_h = item["aspect"]

        # 1. Save SVG in public/brand/
        svg_path = os.path.join(OUTPUT_DIR, f"{var_id}.svg")
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        generated_files.append(svg_path)

        # Also copy SVG to artifact dir
        shutil.copy2(svg_path, os.path.join(ARTIFACT_DIR, f"{var_id}.svg"))

        # 2. Render PNGs
        for s in item["sizes"]:
            if isinstance(s, int):
                w, h = s, s
                png_name = f"{var_id}-{w}x{h}.png"
            else:
                w, h = s
                png_name = f"{var_id}-{w}x{h}.png"

            out_png = os.path.join(OUTPUT_DIR, png_name)
            success = render_svg_to_png(svg_content, out_png, w, h)
            if success:
                print(f"[OK] Rendered {png_name} ({w}x{h})")
                generated_files.append(out_png)
                # Copy primary preview to artifact dir
                shutil.copy2(out_png, os.path.join(ARTIFACT_DIR, png_name))
            else:
                print(f"[ERR] Failed to render {png_name}")

    print("\nSummary of generated assets:")
    for f in generated_files:
        print(" -", f)

if __name__ == "__main__":
    main()
