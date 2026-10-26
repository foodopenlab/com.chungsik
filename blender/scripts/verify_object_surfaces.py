"""독립 GLB 재파싱 + Blender BVH로 실제 내보낸 삼각형과 모든 점의 정합 확인."""
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import json
from pathlib import Path
import struct

ROOT=Path(__file__).resolve().parents[2]


def load(path):
    raw=path.read_bytes(); n=struct.unpack_from('<I',raw,12)[0]
    return json.loads(raw[20:20+n]),raw[28+n:]


def read(doc,buf,index):
    a=doc['accessors'][index]; v=doc['bufferViews'][a['bufferView']]
    width={'VEC3':3,'SCALAR':1}[a['type']]
    fmt={5126:'f',5125:'I'}[a['componentType']]
    s=struct.Struct('<'+fmt*width); start=v.get('byteOffset',0)+a.get('byteOffset',0)
    return [s.unpack_from(buf,start+i*v.get('byteStride',s.size)) for i in range(a['count'])]


report={}
for name in ('clipboard','blueprint','crt','bubble'):
    doc,buf=load(ROOT/f'frontend/public/models/obj-{name}.glb')
    verts=[]; faces=[]
    for mesh in doc['meshes']:
        for primitive in mesh['primitives']:
            offset=len(verts)
            verts.extend(read(doc,buf,primitive['attributes']['POSITION']))
            ids=[r[0] for r in read(doc,buf,primitive['indices'])]
            faces.extend(tuple(offset+k for k in ids[i:i+3]) for i in range(0,len(ids),3))
    bvh=BVHTree.FromPolygons([Vector(v)*1000 for v in verts],faces,all_triangles=True)
    doc,buf=load(ROOT/f'frontend/public/models/obj-{name}-points.glb')
    positions=read(doc,buf,doc['meshes'][0]['primitives'][0]['attributes']['POSITION'])
    def distance_to_triangle(p,a,b,c):
        sub=lambda x,y: tuple(u-v for u,v in zip(x,y))
        dot=lambda x,y: sum(u*v for u,v in zip(x,y))
        ab,ac,ap=sub(b,a),sub(c,a),sub(p,a)
        normal=(ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0])
        nn=dot(normal,normal)
        if nn:
            height=dot(ap,normal)/nn
            projected=tuple(p[i]-height*normal[i] for i in range(3))
            v=sub(projected,a)
            aa,bb,cc=dot(ab,ab),dot(ab,ac),dot(ac,ac)
            denominator=aa*cc-bb*bb
            if denominator>0:
                u=(cc*dot(v,ab)-bb*dot(v,ac))/denominator
                w=(aa*dot(v,ac)-bb*dot(v,ab))/denominator
                if u>=-1e-6 and w>=-1e-6 and u+w<=1+1e-6:
                    return abs(dot(ap,normal))/nn**.5
        distances=[]
        for x,y in [(a,b),(b,c),(c,a)]:
            edge=sub(y,x); length=dot(edge,edge)
            t=max(0,min(1,dot(sub(p,x),edge)/length)) if length else 0
            delta=tuple(p[i]-x[i]-t*edge[i] for i in range(3))
            distances.append(dot(delta,delta)**.5)
        return min(distances)
    distances=[]
    triangles=[tuple(verts[k] for k in face) for face in faces]
    for row in positions:
        distance=bvh.find_nearest(Vector(row)*1000)[3]/1000
        if distance>1e-6:
            # 얇은 베벨은 float32 최근접 계산 대신 double 정밀도로 대조한다.
            distance=min(distance_to_triangle(row,*tri) for tri in triangles)
        distances.append(distance)
    maximum=max(distances)
    assert maximum < 1e-6,(name,maximum)
    report[name]={'checked_points':len(positions),'max_surface_distance_m':maximum}
print(json.dumps(report,indent=2))
(ROOT/'blender/renders/object_surface_validation.json').write_text(json.dumps(report,indent=2)+'\n')
