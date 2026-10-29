"""말풍선 앞면 텍스처 — 손글씨 대사 "AI가 다 / 해줬으면" (시스템 Python + Pillow + fontTools)

글꼴은 사이트 01 GAP 현장 말투와 같은 Gaegu. next/font가 빌드 때 받은 조각(frontend/.next/static/media)에서
대사 글자가 든 조각을 골라 쓰므로 `npm run build` 뒤에 실행한다.
UV는 build_objects.bubble()의 앞면 평면 투영(x -0.24~0.24, z 0.005~0.335)과 같은 틀이다.
"""
from pathlib import Path
import glob
import io
import re
import sys
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
NEXT = ROOT/'frontend/.next'
LINES = ['AI가 다', '해줬으면']
W, H = 1024, 704  # 0.48 × 0.33 비율
CENTER = (W*.5, H*(.335-.19)/.33)  # 타원 중심(꼬리 제외)
SIZE = 180


def gaegu_fonts():
    css = ''.join(Path(f).read_text() for f in glob.glob(str(NEXT/'static/chunks/*.css')))
    files = {u.split('/')[-1] for b in re.findall(r'@font-face\{([^}]*)\}', css) if 'Gaegu' in b
             for u in re.findall(r'url\(([^)]*\.woff2)\)', b)}
    fonts = []
    for name in sorted(files):
        f = TTFont(NEXT/'static/media'/name); cmap = f.getBestCmap()
        f.flavor = None; buf = io.BytesIO(); f.save(buf)
        fonts.append((set(cmap), ImageFont.truetype(io.BytesIO(buf.getvalue()), SIZE)))
    return fonts


def draw_line(d, fonts, text, cy, ink):
    glyphs = [(ch, next(font for cmap, font in fonts if ord(ch) in cmap)) for ch in text]
    width = sum(font.getlength(ch) for ch, font in glyphs)
    x = CENTER[0]-width/2
    for ch, font in glyphs:
        d.text((x, cy), ch, font=font, fill=ink, anchor='lm'); x += font.getlength(ch)


def render(base, ink, out):
    im = Image.new('RGB', (W, H), base); d = ImageDraw.Draw(im)
    fonts = gaegu_fonts()
    for i, line in enumerate(LINES):
        draw_line(d, fonts, line, CENTER[1]+(i-.5)*SIZE*.95, ink)
    # 펜 번짐 정도만 — 선명한 인쇄처럼 보이지 않게
    im = im.filter(ImageFilter.GaussianBlur(.8))
    im.save(out)


if __name__ == '__main__':
    # 기본: 지금 말풍선 색(흰 세라믹) 바탕 + 먹색 글씨. 인자로 바탕·글씨 색(R,G,B)과 출력 경로를 바꿀 수 있다(시안용)
    if len(sys.argv) == 4:
        render(tuple(map(int, sys.argv[1].split(','))), tuple(map(int, sys.argv[2].split(','))), sys.argv[3])
    else:
        render((246, 246, 244), (38, 40, 44), ROOT/'blender/textures/bubble.png')
