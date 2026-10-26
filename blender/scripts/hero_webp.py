"""시퀀스 양 끝을 픽셀 손실 없이 WebP로 저장한다."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
for frame,name in [(1,'hero-fallback-start.webp'),(120,'hero-fallback.webp')]:
    with Image.open(ROOT/f'blender/renders/hero_seq/frame_{frame:04d}.png') as im:
        im.save(ROOT/'frontend/public/models'/name,format='WEBP',lossless=True,exact=True,method=6)
