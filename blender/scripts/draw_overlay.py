"""Blender가 계산한 카메라 투영선을 원본 포스터 위에 합성한다."""
import json
from pathlib import Path
import sys
from PIL import Image, ImageDraw

path = Path(sys.argv[1])
data = json.loads(path.read_text())
plate = Image.open(data['poster']).convert('RGBA')
layer = Image.new('RGBA',plate.size)
draw = ImageDraw.Draw(layer)
for obj in data['objects']:
    color = (255,180,65,210) if 'equipment' in obj['name'] or 'gauge' in obj['name'] else (113,197,232,185)
    for a,b in obj['edges']:
        p,q = obj['vertices'][a],obj['vertices'][b]
        if p[2] <= .1 or q[2] <= .1: continue
        draw.line((p[0],p[1],q[0],q[1]),fill=color,width=2)
Image.alpha_composite(plate,layer).convert('RGB').save(path.parent/f"overlay_{data['suffix']}.png")
cloud = Image.new('RGB',plate.size,(5,10,14))
draw = ImageDraw.Draw(cloud)
w,h = plate.size
for x,y,z in sorted(data['points'],key=lambda p:-p[2]):
    if .1 < z and 0 <= x < w and 0 <= y < h:
        draw.ellipse((x-1,y-1,x+1,y+1),fill=(113,197,232))
cloud.save(path.parent/f"pointcloud_{data['suffix']}.png")
Image.blend(plate.convert('RGB'),cloud,.6).save(path.parent/f"scan_preview_{data['suffix']}.png")
