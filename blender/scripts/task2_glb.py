"""표준 라이브러리 GLB 작성기. 모든 메쉬 좌표는 이미 glTF Y-up이다."""
import json
import struct


class GLB:
    def __init__(self):
        self.binary=bytearray()
        self.doc={'asset':{'version':'2.0','generator':'SCAN task 2'},'scene':0,'scenes':[{'nodes':[]}],
                  'nodes':[],'meshes':[],'materials':[],'buffers':[],'bufferViews':[],'accessors':[]}

    def view(self,data,target=None):
        self.binary.extend(b'\0'*(-len(self.binary)%4))
        view={'buffer':0,'byteOffset':len(self.binary),'byteLength':len(data)}
        if target: view['target']=target
        self.binary.extend(data)
        self.doc['bufferViews'].append(view)
        return len(self.doc['bufferViews'])-1

    def array(self,rows,typ='VEC3',component=5126):
        fmt={5126:'f',5125:'I'}[component]
        pack=struct.Struct('<'+fmt*len(rows[0]))
        index=self.view(b''.join(pack.pack(*r) for r in rows),34963 if component==5125 else 34962)
        acc={'bufferView':index,'componentType':component,'count':len(rows),'type':typ}
        if typ=='VEC3':
            acc['min']=[min(r[i] for r in rows) for i in range(3)]
            acc['max']=[max(r[i] for r in rows) for i in range(3)]
        self.doc['accessors'].append(acc)
        return len(self.doc['accessors'])-1

    def material(self,name,color,metallic=0,roughness=.5,texture=None,unlit=False):
        pbr={'baseColorFactor':list(color),'metallicFactor':metallic,'roughnessFactor':roughness}
        mat={'name':name,'pbrMetallicRoughness':pbr,'doubleSided':True}
        if texture:
            images=self.doc.setdefault('images',[])
            images.append({'bufferView':self.view(texture.read_bytes()),'mimeType':'image/png'})
            textures=self.doc.setdefault('textures',[])
            textures.append({'source':len(images)-1})
            pbr['baseColorTexture']={'index':len(textures)-1}
        if unlit:
            mat['extensions']={'KHR_materials_unlit':{}}
            self.doc['extensionsUsed']=['KHR_materials_unlit']
        self.doc['materials'].append(mat)
        return len(self.doc['materials'])-1

    def mesh(self,name,primitives):
        idx=len(self.doc['meshes'])
        self.doc['meshes'].append({'name':name,'primitives':primitives})
        self.doc['scenes'][0]['nodes'].append(len(self.doc['nodes']))
        self.doc['nodes'].append({'name':name,'mesh':idx})

    def save(self,path):
        self.doc['buffers']=[{'byteLength':len(self.binary)}]
        encoded=json.dumps(self.doc,separators=(',',':')).encode()
        encoded+=b' '*(-len(encoded)%4)
        self.binary+=b'\0'*(-len(self.binary)%4)
        raw=struct.pack('<4sII',b'glTF',2,28+len(encoded)+len(self.binary))
        raw+=struct.pack('<I4s',len(encoded),b'JSON')+encoded
        raw+=struct.pack('<I4s',len(self.binary),b'BIN\0')+self.binary
        path.write_bytes(raw)
