"""작업 2 실제 파일 계약 검증. 시스템 Python + Pillow."""
import hashlib
import json
import math
from pathlib import Path
import struct
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MODELS = ROOT / 'frontend/public/models'


def read_glb(path):
    raw = path.read_bytes()
    assert struct.unpack_from('<4sII', raw) == (b'glTF', 2, len(raw))
    size, tag = struct.unpack_from('<I4s', raw, 12)
    assert tag == b'JSON'
    doc = json.loads(raw[20:20+size])
    pos = 20+size
    length, tag = struct.unpack_from('<I4s', raw, pos)
    assert tag == b'BIN\0' and pos+8+length == len(raw)
    return doc, raw[pos+8:]


def accessor(doc, binary, index):
    acc = doc['accessors'][index]
    view = doc['bufferViews'][acc['bufferView']]
    width = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[acc['type']]
    fmt = {5126: 'f', 5125: 'I', 5123: 'H'}[acc['componentType']]
    pack = struct.Struct('<' + fmt*width)
    start = view.get('byteOffset', 0)+acc.get('byteOffset', 0)
    stride = view.get('byteStride', pack.size)
    assert start % 4 == 0
    assert (acc['count']-1)*stride+pack.size <= view['byteLength']
    rows = [pack.unpack_from(binary, start+i*stride) for i in range(acc['count'])]
    assert all(math.isfinite(x) for row in rows for x in row)
    return rows


def verify_objects():
    report = {}
    expected_color = tuple(((v/255+.055)/1.055)**2.4 for v in (113,197,232))
    for name in ('clipboard', 'blueprint', 'crt', 'bubble'):
        path = MODELS / f'obj-{name}.glb'
        doc, binary = read_glb(path)
        assert path.stat().st_size <= 1_000_000
        assert all('matrix' not in n and 'translation' not in n and 'rotation' not in n and 'scale' not in n for n in doc['nodes'])
        vertices, triangles = [], []
        count = 0
        for mesh in doc['meshes']:
            for prim in mesh['primitives']:
                assert prim.get('mode', 4) == 4
                positions = accessor(doc, binary, prim['attributes']['POSITION'])
                indices = accessor(doc, binary, prim['indices'])
                vertices.extend(positions)
                triangles.extend(tuple(positions[indices[i+j][0]] for j in range(3)) for i in range(0,len(indices),3))
                count += len(indices)//3
                assert 'pbrMetallicRoughness' in doc['materials'][prim['material']]
        bounds = [[min(v[i] for v in vertices), max(v[i] for v in vertices)] for i in range(3)]
        assert abs(bounds[1][0]) < 1e-6
        assert abs(sum(bounds[0])) < 1e-5 and abs(sum(bounds[2])) < 1e-5
        for img in doc.get('images', []):
            import io
            view = doc['bufferViews'][img['bufferView']]
            im = Image.open(io.BytesIO(binary[view['byteOffset']:view['byteOffset']+view['byteLength']]))
            assert max(im.size) <= 1024
        points_path = MODELS / f'obj-{name}-points.glb'
        pts, buf = read_glb(points_path)
        prim = pts['meshes'][0]['primitives'][0]
        assert prim['mode'] == 0 and 'indices' not in prim
        xyz = accessor(pts, buf, prim['attributes']['POSITION'])
        colors = accessor(pts, buf, prim['attributes']['COLOR_0'])
        assert len(xyz) == len(colors) == 8000
        assert all(abs(a-b)<1e-6 for row in colors for a,b in zip(row,expected_color))
        assert all(bounds[i][0]-1e-6 <= p[i] <= bounds[i][1]+1e-6 for p in xyz for i in range(3))
        assert points_path.stat().st_size <= 1_000_000
        report[name] = {'mesh_bytes':path.stat().st_size, 'points_bytes':points_path.stat().st_size,'points':len(xyz),'triangles':count,'bounds_y_up_m':bounds}
    return report


def verify_sequence():
    frames = sorted((ROOT/'blender/renders/hero_seq').glob('frame_*.png'))
    assert len(frames) == 120
    hashes = set()
    for i,path in enumerate(frames,1):
        assert path.name == f'frame_{i:04d}.png'
        with Image.open(path) as im:
            assert im.size == (1600,900) and im.mode == 'RGBA'
            assert im.getchannel('A').getextrema() == (0,255)
            hashes.add(hashlib.sha256(im.tobytes()).hexdigest())
    assert len(hashes) == 120
    for png,webp in [(frames[0],'hero-fallback-start.webp'),(frames[-1],'hero-fallback.webp')]:
        with Image.open(png) as source, Image.open(MODELS/webp) as target:
            assert source.tobytes() == target.convert('RGBA').tobytes()
    return {'frames':120,'unique_frames':len(hashes),'resolution':[1600,900],'alpha':True}


if __name__ == '__main__':
    import sys
    result = {'objects':verify_objects()}
    if '--objects-only' not in sys.argv:
        result['hero_sequence'] = verify_sequence()
    dest = ROOT/'blender/renders/task_2_validation.json'
    dest.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))
