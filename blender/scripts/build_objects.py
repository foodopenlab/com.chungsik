"""blender -b --python-exit-code 1 --python blender/scripts/build_objects.py"""
import bpy
from mathutils import Vector
import bisect
import math
from pathlib import Path
import random
import subprocess
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from task2_glb import GLB
ROOT=HERE.parents[1]
OUT=ROOT/'frontend/public/models'
TEX=ROOT/'blender/textures'
RENDERS=ROOT/'blender/renders'
COLOR=tuple(((v/255+.055)/1.055)**2.4 for v in (113,197,232))
PARTS=[]
MATERIALS={}


def material(name,color,metal=0,rough=.5,texture=None):
    mat=bpy.data.materials.new(name); mat.diffuse_color=(*color,1); mat.use_nodes=True
    shader=mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=(*color,1)
    shader.inputs['Metallic'].default_value=metal
    shader.inputs['Roughness'].default_value=rough
    if texture:
        tex=mat.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image=bpy.data.images.load(str(TEX/texture))
        mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color'])
    MATERIALS[mat.name]=(color,metal,rough,texture)
    return mat


def finish(obj,name,mat):
    obj.name=name; obj.data.materials.append(mat); PARTS.append(obj)
    return obj


def box(name,loc,size,mat,bevel=.003):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    obj=bpy.context.object; obj.scale=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=obj.modifiers.new('실물 모서리','BEVEL'); mod.width=bevel; mod.segments=3
        bpy.context.view_layer.objects.active=obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return finish(obj,name,mat)


def surface(name,verts,faces,uv,mat):
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    layer=mesh.uv_layers.new()
    for poly in mesh.polygons:
        for li in poly.loop_indices: layer.data[li].uv=uv[mesh.loops[li].vertex_index]
    obj=bpy.data.objects.new(name,mesh); bpy.context.collection.objects.link(obj)
    return finish(obj,name,mat)


def clipboard():
    wood=material('클립보드 섬유판',(.26,.13,.055),rough=.72)
    paper=material('가상 클레임 기록지',(1,1,1),rough=.86,texture='clipboard.png')
    chrome=material('무광 스틸',(.48,.52,.55),metal=.88,rough=.26)
    box('clipboard_body',(0,0,.006),(.245,.34,.012),wood,.006)
    # 종이는 수평 실물 A4 비율. UV 상단이 클립 쪽이다.
    surface('claim_paper',[(-.106,-.145,.013),(.106,-.145,.013),(.106,.145,.013),(-.106,.145,.013)],[(0,1,2,3)],[(0,0),(1,0),(1,1),(0,1)],paper)
    box('clip_plate',(0,.144,.019),(.092,.038,.012),chrome,.006)
    box('clip_spring',(0,.156,.029),(.048,.017,.012),chrome,.005)
    box('clip_lip',(0,.123,.027),(.08,.005,.012),chrome,.002)


def blueprint():
    paper=material('공장 배관 도면',(1,1,1),rough=.82,texture='blueprint.png')
    verts=[]; uv=[]; faces=[]
    # 전체 종이 폭 594mm 중 230mm는 평평하고 나머지는 약 1.4회 말림.
    segments=150
    for i in range(segments+1):
        s=.594*i/segments
        if s<=.23: x,z=s,.001
        else:
            t=(s-.23)/.041
            radius=.041-.001*t
            x=.23+radius*math.sin(t)
            z=.042-radius*math.cos(t)
        for j in range(9):
            verts.append((x,-.21+.42*j/8,z)); uv.append((s/.594,j/8))
    for i in range(segments):
        for j in range(8):
            a=i*9+j; faces.append((a,a+9,a+10,a+1))
    obj=surface('half_rolled_blueprint',verts,faces,uv,paper)
    solid=obj.modifiers.new('종이 두께 0.25mm','SOLIDIFY'); solid.thickness=.00025
    bpy.context.view_layer.objects.active=obj; bpy.ops.object.modifier_apply(modifier=solid.name)
    for p in obj.data.polygons: p.use_smooth=True


def crt():
    shell=material('CRT 아이보리 ABS',(.54,.52,.44),rough=.6)
    dark=material('검은 유리 베젤',(.025,.034,.035),rough=.28)
    screen=material('로딩 스피너',(1,1,1),rough=.32,texture='crt-spinner.png')
    box('monitor_foot',(0,.03,.018),(.25,.24,.036),shell,.013)
    box('monitor_neck',(0,.035,.065),(.10,.10,.085),shell,.008)
    box('crt_housing',(0,.035,.265),(.39,.37,.33),shell,.026)
    box('front_bezel',(0,-.161,.267),(.40,.035,.33),shell,.014)
    box('screen_rim',(0,-.181,.285),(.335,.012,.255),dark,.016)
    verts=[]; uv=[]; faces=[]
    for j in range(25):
        for i in range(33):
            u,v=i/32,j/24; x=(u-.5)*.306; z=.285+(v-.5)*.226
            y=-.190-.010*(1-(2*u-1)**2)*(1-(2*v-1)**2)
            verts.append((x,y,z)); uv.append((u,v))
    for j in range(24):
        for i in range(32):
            a=j*33+i; faces.append((a,a+1,a+34,a+33))
    obj=surface('convex_spinner_screen',verts,faces,uv,screen)
    for p in obj.data.polygons: p.use_smooth=True
    for i in range(10):
        box(f'vent_{i:02d}',(.196,.015+i*.014,.29),(.002,.006,.14),dark,.001)
    box('power_switch',(.145,-.183,.145),(.022,.008,.012),dark,.004)


def bubble():
    # 바탕색까지 텍스처에 담는다(bubble_texture.py) — 손글씨 대사 "AI가 다 / 해줬으면"
    white=material('말풍선 손글씨 대사',(1,1,1),rough=.93,texture='bubble.png')
    # 하나의 닫힌 외곽선에 꼬리까지 포함한 압출 메쉬.
    outline=[]
    for i in range(96):
        t=math.tau*i/96
        x=.24*math.cos(t); z=.19+.145*math.sin(t)
        outline.append((x,z))
        if i==61: outline.extend([(-.16,.005),(-.078,.053)])
    verts=[(x,y,z) for y in (-.024,.024) for x,z in outline]
    n=len(outline)
    faces=[tuple(reversed(range(n))),tuple(range(n,2*n))]
    faces.extend((i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n))
    # 앞뒤 면은 x·z 평면 투영 UV(텍스처와 같은 틀). 옆면은 가장자리 바탕색이 늘어나 보인다
    uv=[((x+.24)/.48,(z-.005)/.33) for y in (-.024,.024) for x,z in outline]
    obj=surface('speech_bubble',verts,faces,uv,white)
    mod=obj.modifiers.new('부드러운 가장자리','BEVEL'); mod.width=.012; mod.segments=5
    bpy.context.view_layer.objects.active=obj; bpy.ops.object.modifier_apply(modifier=mod.name)


def evaluated_parts(parts):
    deps=bpy.context.evaluated_depsgraph_get()
    result=[]
    for obj in parts:
        evaluated=obj.evaluated_get(deps); mesh=evaluated.to_mesh(); mesh.calc_loop_triangles()
        positions=[obj.matrix_world @ v.co for v in mesh.vertices]
        result.append((obj,mesh,positions,evaluated))
    return result


def normalize(parts):
    bpy.context.view_layer.update()
    coords=[o.matrix_world @ v.co for o in parts for v in o.data.vertices]
    offset=Vector(((min(v.x for v in coords)+max(v.x for v in coords))/2,
                   (min(v.y for v in coords)+max(v.y for v in coords))/2,min(v.z for v in coords)))
    for obj in parts: obj.location-=offset
    bpy.context.view_layer.update()


def y_up(v): return (v.x,v.z,-v.y)


def export(name,parts):
    glb=GLB(); mats={}; primitives=[]; triangles=[]
    for obj,mesh,positions,evaluated in evaluated_parts(parts):
        mat=obj.data.materials[0]
        if mat.name not in mats:
            color,metal,rough,tex=MATERIALS[mat.name]
            mats[mat.name]=glb.material(mat.name,(*color,1),metal,rough,TEX/tex if tex else None)
        xyz=[]; normals=[]; uv=[]
        rotation=obj.matrix_world.to_3x3().inverted().transposed()
        for tri in mesh.loop_triangles:
            triangles.append(tuple(positions[k].copy() for k in tri.vertices))
            for li in tri.loops:
                loop=mesh.loops[li]
                xyz.append(y_up(positions[loop.vertex_index]))
                normal=mesh.vertices[loop.vertex_index].normal if mesh.polygons[tri.polygon_index].use_smooth else tri.normal
                normals.append(y_up((rotation@normal).normalized()))
                # glTF 이미지 좌표는 위쪽이 v=0이므로 Blender UV의 V를 반전한다.
                texcoord=mesh.uv_layers.active.data[li].uv if mesh.uv_layers.active else (0,0)
                uv.append((texcoord[0],1-texcoord[1]))
        attrs={'POSITION':glb.array(xyz),'NORMAL':glb.array(normals),'TEXCOORD_0':glb.array(uv,'VEC2')}
        primitives.append({'attributes':attrs,'indices':glb.array([(i,) for i in range(len(xyz))],'SCALAR',5125),'material':mats[mat.name],'mode':4})
        evaluated.to_mesh_clear()
    glb.mesh(name,primitives); glb.save(OUT/f'obj-{name}.glb')
    areas=[]; total=0
    for a,b,c in triangles:
        total+=(b-a).cross(c-a).length/2; areas.append(total)
    rng=random.Random(20261026)
    points=[]
    for _ in range(8000):
        a,b,c=triangles[bisect.bisect_left(areas,rng.random()*total)]
        u=math.sqrt(rng.random()); v=rng.random()
        points.append((1-u)*a+u*(1-v)*b+u*v*c)
    glb=GLB(); mat=glb.material('Scan71C5E8',(1,1,1,1),roughness=1,unlit=True)
    glb.mesh(name+'-points',[{'mode':0,'material':mat,'attributes':{'POSITION':glb.array([y_up(p) for p in points]),'COLOR_0':glb.array([COLOR]*8000)}}])
    glb.save(OUT/f'obj-{name}-points.glb')
    mesh=bpy.data.meshes.new(name+'_points'); mesh.from_pydata(points,[],[])
    obj=bpy.data.objects.new(name+'_points',mesh); bpy.context.collection.objects.link(obj)
    obj.hide_render=True; obj['point_count']=8000
    return points,obj


def dot_mesh(name,points,radius,mat):
    # Preview spheres: small octahedra leave the original point-only object intact.
    verts=[]; faces=[]
    for p in points:
        base=len(verts)
        verts.extend(tuple(p+Vector(d)*radius) for d in [(1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1)])
        faces.extend(tuple(base+j for j in f) for f in [(0,2,4),(2,1,4),(1,3,4),(3,0,4),(2,0,5),(1,2,5),(3,1,5),(0,3,5)])
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces)
    obj=bpy.data.objects.new(name,mesh); bpy.context.collection.objects.link(obj); mesh.materials.append(mat)
    return obj


def main():
    OUT.mkdir(parents=True,exist_ok=True); RENDERS.mkdir(parents=True,exist_ok=True)
    subprocess.run(['python',str(HERE/'object_textures.py')],check=True)
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    groups=[]
    for name,builder in [('clipboard',clipboard),('blueprint',blueprint),('crt',crt),('bubble',bubble)]:
        start=len(PARTS); builder(); parts=PARTS[start:]; normalize(parts)
        points,point_obj=export(name,parts); groups.append((name,parts,points,point_obj))
    scene=bpy.context.scene; scene.unit_settings.system='METRIC'
    scene.render.engine='BLENDER_EEVEE'; scene.render.resolution_x=1600; scene.render.resolution_y=1000; scene.render.resolution_percentage=100
    scene.world.color=(.16,.16,.16)
    scene.view_settings.view_transform='AgX'
    scan=bpy.data.materials.new('미리보기 점'); scan.use_nodes=True
    nodes=scan.node_tree.nodes; nodes.clear(); out=nodes.new('ShaderNodeOutputMaterial'); emission=nodes.new('ShaderNodeEmission'); emission.inputs['Color'].default_value=(*COLOR,1); emission.inputs['Strength'].default_value=1
    scan.node_tree.links.new(emission.outputs[0],out.inputs[0])
    # 상단은 PBR, 하단은 같은 표면에 정확히 겹친 점구름.
    for index,(name,parts,points,point_obj) in enumerate(groups):
        x=(index-1.5)*.64
        offset=Vector((x,.40,0))
        for obj in parts: obj.location+=offset
        point_obj.location+=offset
        for obj in parts:
            copy=obj.copy(); copy.data=obj.data.copy(); bpy.context.collection.objects.link(copy); copy.location.y-=.76
        dots=dot_mesh(name+'_overlay',points,.0015,scan); dots.location=(x,-.36,0)
        for row,label in [(.40,name.upper()),(-.36,'PBR + 8,000 POINTS')]:
            curve=bpy.data.curves.new('caption','FONT'); curve.body=label; curve.size=.032; curve.align_x='CENTER'
            text=bpy.data.objects.new('caption',curve); bpy.context.collection.objects.link(text); text.location=(x,row-.28,.002)
    floor=material('미리보기 배경',(.034,.045,.061),rough=.9)
    box('preview_floor',(0,0,-.024),(3.0,1.75,.04),floor,.01)
    bpy.ops.object.camera_add(location=(1.45,-2.65,2.65))
    cam=bpy.context.object; cam.name='objects_preview_camera'; cam.rotation_euler=(Vector((0,0,.10))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='ORTHO'; cam.data.ortho_scale=2.85; scene.camera=cam
    for location,power,size in [((0,-2,4),400,4),((-2,1,2),220,3)]:
        bpy.ops.object.light_add(type='AREA',location=location); light=bpy.context.object; light.data.energy=power; light.data.shape='DISK'; light.data.size=size; light.rotation_euler=(-light.location).to_track_quat('-Z','Y').to_euler()
    # 개별 원점·실물 크기를 보존하고 미리보기 배치만 부모에 둔다.
    for name,parts,points,point_obj in groups:
        collection=bpy.data.collections.new('obj-'+name); scene.collection.children.link(collection)
        offset=point_obj.location.copy()
        root=bpy.data.objects.new(name+'_preview_placement',None); collection.objects.link(root); root.location=offset
        for obj in [*parts,point_obj]:
            for existing in list(obj.users_collection): existing.objects.unlink(obj)
            collection.objects.link(obj); obj.parent=root; obj.location-=offset
    for image in bpy.data.images:
        if image.source=='FILE': image.filepath='//textures/'+Path(image.filepath).name
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'blender/objects.blend'))
    scene.render.image_settings.file_format='PNG'; scene.render.filepath=str(RENDERS/'objects_preview.png')
    bpy.ops.render.render(write_still=True)
    print('TASK2_OBJECTS_DONE',flush=True)


if __name__=='__main__': main()
