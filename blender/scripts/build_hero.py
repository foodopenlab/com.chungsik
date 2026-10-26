"""재현: blender -b --python blender/scripts/build_hero.py (시스템 python + Pillow 필요)."""
import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree
import json
import math
from pathlib import Path
import random
import struct
import subprocess

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'frontend/public/models'
RENDERS = ROOT / 'blender/renders'
COUNT = 40_000
COLOR = (113, 197, 232)
PROXIES = []
CONVERT = Matrix.Rotation(-math.pi / 2, 4, 'X')


def proxy(name, center, size, weight=1, cylinder=False):
    if cylinder:
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=1, depth=2, location=center)
    else:
        bpy.ops.mesh.primitive_cube_add(size=2, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.scale = Vector(size) / 2
    if cylinder:
        obj.rotation_euler.x = math.pi / 2
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj['sampling_weight'] = weight
    PROXIES.append(obj)
    return obj


def camera(name, resolution, position, direction, vertical_fov=None):
    data = bpy.data.cameras.new(name)
    data.lens = 35
    data.sensor_width = 36
    data.sensor_fit = 'HORIZONTAL'
    if vertical_fov is not None:
        data.sensor_fit = 'VERTICAL'
        data.sensor_height = 2 * data.lens * math.tan(vertical_fov / 2)
    data.clip_start, data.clip_end = 0.1, 150
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = Vector(direction).to_track_quat('-Z', 'Y').to_euler()
    data.show_background_images = True
    bg = data.background_images.new()
    poster = 'hero-poster.png' if name == 'landscape' else 'hero-portrait-poster.png'
    bg.image = bpy.data.images.load(str(ROOT / 'frontend/public/video' / poster))
    bg.alpha = 0.65
    bg.display_depth = 'BACK'
    obj['resolution'] = list(resolution)
    return obj


def set_camera(cam):
    scene = bpy.context.scene
    scene.camera = cam
    scene.render.resolution_x, scene.render.resolution_y = cam['resolution']
    scene.render.resolution_percentage = 100
    scene.render.pixel_aspect_x = scene.render.pixel_aspect_y = 1
    bpy.context.view_layer.update()


def make_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    proxy('floor', (0, 19, -0.12), (22, 62, 0.24), 0.3)
    proxy('back_wall', (0, 49, 5.5), (22, 0.3, 11), 0.35)
    proxy('left_wall', (-8, 20, 5.5), (0.25, 58, 11), 0.2)
    proxy('right_wall', (8, 20, 5.5), (0.25, 58, 11), 0.2)
    for i, y in enumerate((0, 6.0, 11.3, 16.4, 21.3, 26.2, 31.1)):
        proxy(f'left_tank_{i+1}', (-5.8, y, 4.35), (3.9, 4.8, 8.5), 2)
    for i, y in enumerate((1.5, 7.3, 13.1, 18.9, 24.7, 30.5)):
        proxy(f'right_tank_{i+1}', (5.4, y, 4.35), (2.8, 4.8, 8.5), 2)
    proxy('left_pipe_rack', (-3.95, 0.5, 1.675), (1.5, 3.4, 3.35), 4)
    proxy('left_inner_rack', (-3.1, 12.0, 1.65), (0.8, 2, 2.5), 5)
    proxy('back_equipment', (1.4, 20, 1.35), (1.6, 2, 2.7), 2)
    # 전경은 박스 골격에 저해상 압력계 원판만 보조한다.
    proxy('equipment_body', (-.08, -3.1, 0.4), (1.9, 2.25, .8), 12)
    proxy('equipment_crossbar', (-.08, -4.2, .28), (2.08, 0.16, 0.16), 16)
    for i, (x, y, z, radius) in enumerate(((-0.55,-3.0,1.8,.23),(-.19,-2.8,1.98,.12),(.28,-2.55,2.22,.24),(.64,-2.42,2.12,.12),(.87,-2.9,1.84,.24))):
        proxy(f'gauge_stem_{i}', (x,y,1.3), (.065,.065,1.0), 15)
        # Cylinder local Z is rotated to face the camera (negative world Y).
        proxy(f'gauge_{i}', (x,y,z), (radius*2,radius*2,.095), 24, cylinder=True)
    landscape = camera('landscape', (1920,1080), (0,-12,1.7), (-.048,1,.059))
    vfov = 2 * math.atan((36 / (16/9)) / (2*35))
    portrait = camera('portrait', (1080,1920), (0,-12,1.7), (-.048,1,.059), vfov)
    set_camera(landscape)
    # 포스터에서 읽은 중심/반지름을 35mm 카메라의 광선으로 역투영한다.
    landmarks = [(894,779,46),(966,745,22),(1068,731,46),(1142,731,22),(1179,773,47)]
    for i, (px, py, radius_px) in enumerate(landmarks):
        obj = bpy.data.objects[f'gauge_{i}']
        ray = landscape.rotation_euler.to_matrix() @ Vector(((px-960)/1866.6666667,(540-py)/1866.6666667,-1))
        distance = (obj.location.y-landscape.location.y)/ray.y
        obj.location = landscape.location + distance*ray
        obj.scale.x = obj.scale.y = radius_px*distance/1866.6666667 / (obj.dimensions.x/2)
        stem = bpy.data.objects[f'gauge_stem_{i}']
        stem.location.x, stem.location.y = obj.location.x, obj.location.y
        stem.location.z = (obj.location.z-.22+.6)/2
        stem.scale.z = (obj.location.z-.22-.6)
    bpy.context.view_layer.update()
    return landscape, portrait


def sampling_mesh():
    verts, faces, weights = [], [], []
    for obj in PROXIES:
        base = len(verts)
        verts.extend(obj.matrix_world @ v.co for v in obj.data.vertices)
        faces.extend(tuple(base + i for i in p.vertices) for p in obj.data.polygons)
        weights.extend([obj['sampling_weight']] * len(obj.data.polygons))
    mesh = bpy.data.meshes.new('ProxySurface')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    attr = mesh.attributes.new('sampling_weight', 'FLOAT', 'FACE')
    for item, weight in zip(attr.data, weights):
        item.value = weight
    obj = bpy.data.objects.new('GN_SurfaceSampler', mesh)
    bpy.context.collection.objects.link(obj)
    obj.hide_render = True
    tree = bpy.data.node_groups.new('Hero_Distribute_Points_on_Faces', 'GeometryNodeTree')
    tree.interface.new_socket(name='Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    tree.interface.new_socket(name='Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    nodes, links = tree.nodes, tree.links
    inp = nodes.new('NodeGroupInput')
    out = nodes.new('NodeGroupOutput')
    distribute = nodes.new('GeometryNodeDistributePointsOnFaces')
    distribute.distribute_method = 'RANDOM'
    distribute.inputs['Seed'].default_value = 20261026
    weight = nodes.new('GeometryNodeInputNamedAttribute')
    weight.data_type = 'FLOAT'
    weight.inputs['Name'].default_value = 'sampling_weight'
    multiply = nodes.new('ShaderNodeMath')
    multiply.operation = 'MULTIPLY'
    multiply.inputs[1].default_value = 24
    vertices = nodes.new('GeometryNodePointsToVertices')
    for node, location in ((inp,(-600,160)),(weight,(-600,-80)),(multiply,(-350,-80)),
                           (distribute,(-100,160)),(vertices,(160,160)),(out,(400,160))):
        node.location = location
    links.new(inp.outputs['Geometry'], distribute.inputs['Mesh'])
    links.new(weight.outputs['Attribute'], multiply.inputs[0])
    links.new(multiply.outputs[0], distribute.inputs['Density'])
    links.new(distribute.outputs['Points'], vertices.inputs['Points'])
    links.new(vertices.outputs['Mesh'], out.inputs['Geometry'])
    mod = obj.modifiers.new('Distribute Points on Faces', 'NODES')
    mod.node_group = tree
    bvh = BVHTree.FromPolygons(verts, faces)
    return obj, multiply, bvh


def points_from_nodes(sampler, density, bvh, cameras):
    for attempt in range(5):
        bpy.context.view_layer.update()
        evaluated = sampler.evaluated_get(bpy.context.evaluated_depsgraph_get())
        mesh = evaluated.to_mesh()
        candidates = [v.co.copy() for v in mesh.vertices]
        evaluated.to_mesh_clear()
        visible = []
        for cam in cameras:
            set_camera(cam)
            visible.append([])
            for i, p in enumerate(candidates):
                ndc = world_to_camera_view(bpy.context.scene, cam, p)
                if ndc.z <= .1 or not (0 <= ndc.x <= 1 and 0 <= ndc.y <= 1):
                    continue
                ray = p - cam.location
                distance = ray.length
                hit = bvh.ray_cast(cam.location, ray.normalized(), distance + .01)
                if hit[0] is not None and abs(hit[3] - distance) < .008:
                    visible[-1].append(i)
        indices = sorted(set().union(*map(set, visible)))
        print(f'SAMPLE attempt={attempt} candidates={len(candidates)} visible={len(indices)}', flush=True)
        if len(indices) >= COUNT:
            random.Random(20261026).shuffle(indices)
            selected = [candidates[i] for i in indices[:COUNT]]
            sampler['candidate_count'] = len(candidates)
            sampler['visible_count'] = len(indices)
            return selected
        density.inputs[1].default_value *= COUNT / max(len(indices), 1) * 1.06
        sampler.data.update()
        sampler.update_tag()
    raise RuntimeError('40,000 visible samples unavailable')


def write_glb(points, cam):
    set_camera(cam)
    rng = random.Random(73)
    heights = [1.2,1.9,1.5,2.4,1.7,2.8,2.1,3.0,2.3,1.6]
    # Targets are in a camera-facing plane 12m from the landscape camera.
    # The baseline is at NDC y=.08, all bars have .4m width + .6m clear gap.
    rotation = cam.rotation_euler.to_matrix()
    vfov = 2 * math.atan(20.25 / 70)
    half_height = 12 * math.tan(vfov/2)
    baseline = -half_height * .84
    positions, targets, bars, normalized = [], [], [], []
    for p in points:
        screen = world_to_camera_view(bpy.context.scene, cam, p)
        bar = max(0, min(9, int(screen.x * 10)))
        h = rng.random()
        local = Vector(((bar - 4.5) + rng.uniform(-.2,.2), baseline + heights[bar]*h, -12))
        target = cam.location + rotation @ local
        positions.append(tuple(CONVERT @ p))
        targets.append(tuple(CONVERT @ target))
        bars.append((bar,))
        normalized.append((h,))
    # Keep bar coordinates in the camera-facing plane, but verify in world via metadata.
    colors = [tuple(((v/255+.055)/1.055)**2.4 for v in COLOR)] * len(points)
    arrays = [('POSITION',positions,'VEC3',5126,'f'), ('COLOR_0',colors,'VEC3',5126,'f'),
              ('_TARGET_BAR',bars,'SCALAR',5123,'H'), ('_TARGET_POS',targets,'VEC3',5126,'f'),
              ('_BAR_HEIGHT',normalized,'SCALAR',5126,'f')]
    blob = bytearray()
    doc = {'asset':{'version':'2.0','generator':'SCAN Blender Geometry Nodes + POINTS writer'},
           'scene':0,'scenes':[{'nodes':[0]}], 'nodes':[{'mesh':0,'name':'HeroPointCloud'}],
           'meshes':[{'primitives':[{'attributes':{},'mode':0,'material':0}]}],
           'materials':[{'name':'ScanData71C5E8','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':0,'roughnessFactor':1},'extensions':{'KHR_materials_unlit':{}}}],
           'extensionsUsed':['KHR_materials_unlit'], 'buffers':[], 'bufferViews':[], 'accessors':[]}
    for name, rows, typ, component, fmt in arrays:
        while len(blob)%4: blob.append(0)
        start = len(blob)
        # U16 scalar vertex elements need 2 padding bytes (glTF 4-byte alignment).
        packer = struct.Struct('<' + fmt * len(rows[0]) + ('2x' if component == 5123 else ''))
        for row in rows: blob.extend(packer.pack(*row))
        idx = len(doc['accessors'])
        doc['bufferViews'].append({'buffer':0,'byteOffset':start,'byteLength':len(blob)-start,'target':34962})
        if component == 5123:
            doc['bufferViews'][-1]['byteStride'] = 4
        acc = {'bufferView':idx,'componentType':component,'count':len(rows),'type':typ}
        if name == 'POSITION':
            acc['min'] = [min(v[i] for v in rows) for i in range(3)]
            acc['max'] = [max(v[i] for v in rows) for i in range(3)]
        doc['accessors'].append(acc)
        doc['meshes'][0]['primitives'][0]['attributes'][name] = idx
    doc['buffers'] = [{'byteLength':len(blob)}]
    encoded = json.dumps(doc,separators=(',',':')).encode()
    encoded += b' ' * (-len(encoded)%4)
    blob += b'\0' * (-len(blob)%4)
    result = struct.pack('<4sII',b'glTF',2,28+len(encoded)+len(blob))
    result += struct.pack('<I4s',len(encoded),b'JSON') + encoded
    result += struct.pack('<I4s',len(blob),b'BIN\0') + blob
    (OUT / 'hero-pointcloud.glb').write_bytes(result)
    mesh = bpy.data.meshes.new('HeroPointCloud')
    mesh.from_pydata(points, [], [])
    for name, typ, rows in [('target_bar','INT',bars),('target_pos','FLOAT_VECTOR',targets),('bar_height','FLOAT',normalized)]:
        attr = mesh.attributes.new(name,typ,'POINT')
        for item,row in zip(attr.data,rows):
            if typ == 'FLOAT_VECTOR':
                item.vector = CONVERT.inverted() @ Vector(row)
            else:
                item.value = row[0]
    color = mesh.color_attributes.new('Color','FLOAT_COLOR','POINT')
    for item in color.data: item.color = (*colors[0],1)
    obj = bpy.data.objects.new('HeroPointCloud_40000',mesh)
    bpy.context.collection.objects.link(obj)
    obj.hide_render = True
    return {'width':.4,'gap':.6,'center_spacing':1,'heights':heights,'depth':12,
            'baseline_camera_y':baseline,'camera':'landscape','plane':'camera local XY',
            'target_pos_space':'glTF world Y-up; same as POSITION'}


def camera_json(cameras, chart):
    result = {'coordinate_system':'glTF right-handed Y-up', 'quaternion_order':'xyzw',
              'fov_unit':'radians (also provided in degrees)', 'point_color_srgb':'#71C5E8',
              'chart':chart,'cameras':{}}
    for cam in cameras:
        set_camera(cam)
        world = CONVERT @ cam.matrix_world
        q = world.to_quaternion()
        w,h = cam['resolution']
        vfov = 2*math.atan((cam.data.sensor_width/(w/h) if cam.data.sensor_fit == 'HORIZONTAL' else cam.data.sensor_height)/(2*cam.data.lens))
        result['cameras'][cam.name] = {'position':list(world.translation), 'quaternion':[q.x,q.y,q.z,q.w],
            'fov_y_radians':vfov,'fov_y_degrees':math.degrees(vfov),'aspect':w/h,
            'near':cam.data.clip_start,'far':cam.data.clip_end,'resolution':[w,h],
            'lens_mm':cam.data.lens,'sensor_width_mm':cam.data.sensor_width,'sensor_height_mm':cam.data.sensor_height,
            'sensor_fit':cam.data.sensor_fit,'poster':cam.data.background_images[0].image.filepath.replace(str(ROOT)+'/','')}
    (OUT / 'hero-cameras.json').write_text(json.dumps(result,indent=2)+'\n')


def overlays(cameras, points):
    for cam, suffix in zip(cameras, ('16x9','9x16')):
        set_camera(cam)
        w,h = cam['resolution']
        def project(p):
            v = world_to_camera_view(bpy.context.scene,cam,p)
            return [v.x*w,(1-v.y)*h,v.z]
        objects = []
        for obj in PROXIES:
            objects.append({'name':obj.name,'vertices':[project(obj.matrix_world @ v.co) for v in obj.data.vertices],
                            'edges':[list(e.vertices) for e in obj.data.edges]})
        metadata = {'poster':cam.data.background_images[0].image.filepath,'objects':objects,
                    'points':[project(p) for p in points], 'suffix':suffix}
        path = RENDERS / f'projection_{suffix}.json'
        path.write_text(json.dumps(metadata))
        subprocess.run(['python',str(ROOT/'blender/scripts/draw_overlay.py'),str(path)],check=True)


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    RENDERS.mkdir(parents=True,exist_ok=True)
    cameras = make_scene()
    sampler,density,bvh = sampling_mesh()
    points = points_from_nodes(sampler,density,bvh,cameras)
    chart = write_glb(points,cameras[0])
    camera_json(cameras,chart)
    overlays(cameras,points)
    sampler.hide_set(True)
    set_camera(cameras[0])
    bpy.context.preferences.filepaths.save_version = 0
    for cam in cameras:
        image = cam.data.background_images[0].image
        image.filepath = '//../' + str(Path(image.filepath).relative_to(ROOT))
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'blender/hero.blend'))
    subprocess.run(['python',str(ROOT/'blender/scripts/verify_glb.py')],check=True)


if __name__ == '__main__':
    main()
