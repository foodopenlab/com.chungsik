"""실제 GLB 바이트 및 카메라 계약 검증: python blender/scripts/verify_glb.py."""
import json
import math
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parents[2]
MODELS = ROOT / 'frontend/public/models'


def verify():
    path = MODELS / 'hero-pointcloud.glb'
    data = path.read_bytes()
    magic, version, length = struct.unpack_from('<4sII', data)
    assert (magic, version, length) == (b'glTF', 2, len(data))
    assert len(data) <= 3_000_000
    json_length, kind = struct.unpack_from('<I4s', data, 12)
    assert kind == b'JSON'
    doc = json.loads(data[20:20 + json_length])
    offset = 20 + json_length
    bin_length, kind = struct.unpack_from('<I4s', data, offset)
    assert kind == b'BIN\x00'
    binary = data[offset + 8:offset + 8 + bin_length]
    assert len(binary) >= doc['buffers'][0]['byteLength']
    primitive = doc['meshes'][0]['primitives'][0]
    assert primitive['mode'] == 0, 'POINTS 필요'
    attrs = primitive['attributes']
    assert {'POSITION', 'COLOR_0', '_TARGET_BAR', '_TARGET_POS', '_BAR_HEIGHT'} <= attrs.keys()

    def read(name):
        acc = doc['accessors'][attrs[name]]
        view = doc['bufferViews'][acc['bufferView']]
        fmt = {5126: 'f', 5123: 'H'}[acc['componentType']]
        width = {'SCALAR': 1, 'VEC3': 3}[acc['type']]
        start = view.get('byteOffset', 0) + acc.get('byteOffset', 0)
        size = width * struct.calcsize(fmt)
        stride = view.get('byteStride',size)
        assert start % 4 == 0 and stride % 4 == 0, '정점 속성은 원소마다 4바이트 정렬 필요'
        assert (acc['count']-1)*stride + size <= view['byteLength']
        return [struct.unpack_from('<' + fmt * width,binary,start+i*stride) for i in range(acc['count'])]

    values = {name: read(name) for name in attrs}
    count = len(values['POSITION'])
    assert 39_000 <= count <= 41_000 or count == 25_000
    assert all(len(v) == count for v in values.values())
    assert doc['accessors'][attrs['_TARGET_BAR']]['componentType'] == 5123
    assert all(math.isfinite(x) for v in values.values() for row in v for x in row)
    bars = [row[0] for row in values['_TARGET_BAR']]
    assert set(bars) == set(range(10))
    assert all(0 <= row[0] <= 1 for row in values['_BAR_HEIGHT'])
    linear = tuple(((v / 255 + 0.055) / 1.055) ** 2.4 for v in (113, 197, 232))
    assert all(abs(a-b) < 1e-6 for a,b in zip(values['COLOR_0'][0], linear))
    cameras = json.loads((MODELS / 'hero-cameras.json').read_text())
    assert cameras['coordinate_system'] == 'glTF right-handed Y-up'
    for name, aspect in [('landscape', 16/9), ('portrait', 9/16)]:
        cam = cameras['cameras'][name]
        assert abs(sum(x*x for x in cam['quaternion']) - 1) < 1e-6
        assert abs(cam['aspect'] - aspect) < 1e-8
        assert 0 < cam['near'] < cam['far']
        assert 0 < cam['fov_y_radians'] < math.pi
    cam = cameras['cameras']['landscape']
    x,y,z,w = cam['quaternion']
    # Inverse camera rotation = transpose of the normalized quaternion matrix.
    norm = math.sqrt(x*x+y*y+z*z+w*w)
    x,y,z,w = [v/norm for v in (x,y,z,w)]
    rot = [[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],
           [2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],
           [2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]]
    def local(point):
        delta = [a-b for a,b in zip(point,cam['position'])]
        return [sum(rot[j][i]*delta[j] for j in range(3)) for i in range(3)]
    chart = cameras['chart']
    for bar, target, height, position in zip(bars, values['_TARGET_POS'], values['_BAR_HEIGHT'], values['POSITION']):
        px,py,pz = local(target)
        assert abs(px - (bar - 4.5)*chart['center_spacing']) <= chart['width']/2 + 1e-5
        assert abs(py - (chart['baseline_camera_y'] + chart['heights'][bar]*height[0])) < 1e-5
        assert abs(pz + chart['depth']) < 1e-5
        ox,oy,oz = local(position)
        sx = .5 + ox/(-oz*math.tan(cam['fov_y_radians']/2)*cam['aspect'])/2
        assert bar == max(0,min(9,int(sx*10)))
    report = {'point_count': count, 'glb_bytes': len(data), 'mode': primitive['mode'],
              'attributes': {name: doc['accessors'][i] for name, i in attrs.items()},
              'bar_counts': [bars.count(i) for i in range(10)], 'cameras': cameras}
    (ROOT / 'blender/renders/validation.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    verify()
