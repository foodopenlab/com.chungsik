"""기존 HERO를 수정하지 않는 Eevee 폴백 렌더.
blender -b --python-exit-code 1 --python blender/scripts/render_hero_seq.py
"""
import bpy
import json
import math
from mathutils import Vector
from pathlib import Path
import struct
import subprocess
import sys

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
MODELS=ROOT/'frontend/public/models'
SEQ=ROOT/'blender/renders/hero_seq'


def read_attributes():
    raw=(MODELS/'hero-pointcloud.glb').read_bytes()
    length=struct.unpack_from('<I',raw,12)[0]
    doc=json.loads(raw[20:20+length]); binary=raw[28+length:]
    attrs=doc['meshes'][0]['primitives'][0]['attributes']
    def read(name):
        acc=doc['accessors'][attrs[name]]; view=doc['bufferViews'][acc['bufferView']]
        start=view.get('byteOffset',0)+acc.get('byteOffset',0); stride=view.get('byteStride',12)
        # glTF Y-up -> Blender Z-up. Same transform as build_hero.py, inverted.
        return [Vector((x,-z,y)) for x,y,z in (struct.unpack_from('<3f',binary,start+i*stride) for i in range(acc['count']))]
    return read('POSITION'),read('_TARGET_POS')


def main():
    SEQ.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'blender/hero.blend'))
    scene=bpy.context.scene
    for obj in scene.objects: obj.hide_render=True
    cam=bpy.data.objects['landscape']; cam.hide_render=False; scene.camera=cam
    scene.render.engine='BLENDER_EEVEE'
    scene.render.resolution_x=1600; scene.render.resolution_y=900; scene.render.resolution_percentage=100
    scene.render.film_transparent=True
    scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGBA'; scene.render.image_settings.color_depth='8'
    scene.render.image_settings.compression=30
    scene.render.fps=30; scene.frame_start=1; scene.frame_end=120
    scene.view_settings.view_transform='Standard'; scene.view_settings.look='None'; scene.view_settings.exposure=0; scene.view_settings.gamma=1
    scene.eevee.taa_render_samples=16
    source,target=read_attributes()
    rotation=cam.rotation_euler.to_matrix(); right=rotation@Vector((1,0,0)); up=rotation@Vector((0,1,0)); forward=rotation@Vector((0,0,-1))
    # 육각형 빌보드: 깊이에 비례해 크기를 조절하여 지름 1.6px 유지.
    corners=[right*math.cos(i*math.tau/6)+up*math.sin(i*math.tau/6) for i in range(6)]
    pixel_scale=2*math.tan(math.atan(20.25/70))*.8/900
    def billboards(points):
        return [tuple(p+corner*((p-cam.location).dot(forward)*pixel_scale)) for p in points for corner in corners]
    verts=billboards(source); ends=billboards(target)
    faces=[tuple(i*6+j for j in range(6)) for i in range(len(source))]
    mesh=bpy.data.meshes.new('HeroFallbackBillboards'); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new('HeroFallbackBillboards',mesh); scene.collection.objects.link(obj)
    obj.shape_key_add(name='POSITION'); key=obj.shape_key_add(name='_TARGET_POS')
    key.data.foreach_set('co',[c for row in ends for c in row])
    key.value=0; key.keyframe_insert(data_path='value',frame=1)
    key.value=1; key.keyframe_insert(data_path='value',frame=120)
    mat=bpy.data.materials.new('Scan71C5E8'); mat.use_nodes=True
    nodes=mat.node_tree.nodes; nodes.clear(); out=nodes.new('ShaderNodeOutputMaterial'); emission=nodes.new('ShaderNodeEmission')
    color=tuple(((v/255+.055)/1.055)**2.4 for v in (113,197,232))
    emission.inputs['Color'].default_value=(*color,1); emission.inputs['Strength'].default_value=1
    mat.node_tree.links.new(emission.outputs[0],out.inputs[0]); mesh.materials.append(mat)
    # 단일 호출에서 120프레임을 렌더한다. Blender 모션 블러는 사용하지 않는다.
    for frame in range(1,121):
        scene.frame_set(frame)
        scene.render.filepath=str(SEQ/f'frame_{frame:04d}.png')
        bpy.ops.render.render(write_still=True)
        print(f'HERO_FRAME {frame}/120',flush=True)
    subprocess.run(['python',str(HERE/'hero_webp.py')],check=True)
    (SEQ.parent/'hero_sequence_manifest.json').write_text(json.dumps({'engine':scene.render.engine,'camera':cam.name,'frames':120,'resolution':[1600,900],'points':len(source),'color':'#71C5E8','radius_pixels':.8,'interpolation':'Blender default Bezier ease-in/out','source':'POSITION','target':'_TARGET_POS'},indent=2)+'\n')
    print('HERO_SEQUENCE_DONE',flush=True)


if __name__=='__main__': main()
