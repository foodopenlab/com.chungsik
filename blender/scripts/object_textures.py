"""교체본을 보존하며 없는 임시 PNG만 생성한다 (시스템 Python + Pillow)."""
from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1]/'textures'
OUT.mkdir(exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'


def generate():
    rng = random.Random(283)
    im = Image.new('RGB',(768,1024),(239,233,214)); d = ImageDraw.Draw(im)
    d.text((55,55),'CLAIM / FIELD RECORD',font=ImageFont.truetype(FONT,30),fill=(44,56,64))
    d.text((55,110),'DEMO  /  2026.10  /  No. 024',font=ImageFont.truetype(FONT,19),fill=(80,86,91))
    for y in range(180,950,70):
        d.line((48,y,720,y),fill=(153,168,173),width=2)
        if y < 880:
            for x in range(80,rng.randint(370,640),24):
                # 가상의 현장 메모: 글자를 흉내 내는 비언어적 필기.
                pts=[(x+j*4,y+25+rng.randint(-9,9)) for j in range(5)]
                d.line(pts,fill=(46,66,89),width=2)
                d.line((x+4,y+16,x+6,y+39),fill=(46,66,89),width=2)
    d.line((200,180,200,950),fill=(153,168,173),width=2)
    d.ellipse((570,850,681,958),outline=(164,74,58),width=4)
    save(im,'clipboard.png')
    im = Image.new('RGB',(1024,724),(22,57,83)); d=ImageDraw.Draw(im)
    for x in range(0,1024,24): d.line((x,0,x,724),fill=(34,73,97))
    for y in range(0,724,24): d.line((0,y,1024,y),fill=(34,73,97))
    d.rectangle((32,32,992,692),outline=(176,211,218),width=3)
    for i in range(5):
        x=90+i*175
        d.rectangle((x,140,x+120,370),outline=(187,222,225),width=3)
        d.ellipse((x,110,x+120,170),outline=(187,222,225),width=3)
        d.line((x+60,370,x+60,460,900,460),fill=(187,222,225),width=4)
        d.line((x-15,90,x+135,90),fill=(114,170,190),width=2)
        d.text((x,70),f'T-{i+1:02d}',font=ImageFont.truetype(FONT,15),fill=(187,222,225))
    d.rectangle((650,550,975,675),outline=(176,211,218),width=2)
    d.text((670,570),'FACTORY / DEMO',font=ImageFont.truetype(FONT,24),fill=(187,222,225))
    d.text((670,620),'PIPING PLAN  1:100',font=ImageFont.truetype(FONT,17),fill=(187,222,225))
    save(im,'blueprint.png')
    im=Image.new('RGB',(512,512),(8,18,22)); d=ImageDraw.Draw(im)
    for i in range(12):
        a=i*math.tau/12
        x,y=256+70*math.sin(a),225-70*math.cos(a)
        shade=int(60+195*i/11)
        d.ellipse((x-7,y-7,x+7,y+7),fill=(int(shade*.48),int(shade*.85),shade))
    d.text((165,340),'LOADING...',font=ImageFont.truetype(FONT,26),fill=(113,197,232))
    save(im,'crt-spinner.png')


def save(im,name):
    path=OUT/name
    if not path.exists(): im.save(path)


if __name__ == '__main__': generate()
