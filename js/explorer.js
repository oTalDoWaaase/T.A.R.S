"use strict";
// Renderizador local sem biblioteca: esfera texturizada em WebGL e nuvens de pontos 3D.
// Não simula órbitas, relatividade ou a evolução real das estruturas cósmicas.
window.TARSExplorer = (() => {
  const specs = {
    terra: {
      texture: "terra",
      color: [0.35, 0.65, 1],
      yaw: -0.9,
      pitch: 0.12,
      atmosphere: 0.8,
      note: "Mapa terrestre · modelo educativo · rotação acelerada",
    },
    lua: {
      texture: "lua",
      color: [0.8, 0.8, 0.83],
      note: "Mapa lunar · modelo educativo · rotação acelerada",
    },
    marte: {
      texture: "marte",
      color: [0.8, 0.4, 0.25],
      note: "Mapa NASA · modelo educativo · rotação acelerada",
    },
    jupiter: {
      texture: "jupiter",
      color: [0.8, 0.7, 0.6],
      note: "Mapa NASA · atmosfera histórica · rotação acelerada",
    },
    saturno: {
      texture: "saturno",
      color: [0.8, 0.72, 0.58],
      rings: true,
      pitch: 0.6,
      note: "Mapa NASA · anéis ilustrativos · rotação acelerada",
    },
    encelado: {
      texture: "encelado",
      color: [0.8, 0.85, 0.93],
      note: "Mapa NASA · modelo educativo · rotação acelerada",
    },
    mercurio: {
      kind: 3,
      color: [0.59, 0.56, 0.52],
      note: "Superfície procedural · não mapeia crateras reais",
    },
    venus: {
      texture: "venus",
      kind: 5,
      color: [0.85, 0.73, 0.52],
      reverse: true,
      atmosphere: 0.2,
      note: "Nuvens ilustrativas · alterne para superfície de radar",
    },
    urano: {
      kind: 4,
      color: [0.57, 0.78, 0.81],
      pitch: 1.5,
      note: "Atmosfera procedural · modelo ilustrativo",
    },
    netuno: {
      texture: "netuno",
      color: [0.35, 0.55, 0.85],
      atmosphere: 0.3,
      note: "Mapa NASA em cores processadas · modelo educativo",
    },
    proxima: {
      kind: 1,
      color: [1, 0.38, 0.16],
      note: "Estrela ilustrativa · brilho e dimensões sem escala",
    },
    sirio: {
      kind: 1,
      color: [0.68, 0.83, 1],
      note: "Estrela ilustrativa · não representa um mapa observado",
    },
    sagitario: {
      kind: 2,
      color: [0.95, 0.62, 0.34],
      pitch: 0.52,
      rings: true,
      note: "Representação artística · não é simulação relativística",
    },
    campo: {
      mode: "stellar",
      note: "Campo estelar ilustrativo · não mapeia a posição real desta estrela",
    },
    vialactea: {
      mode: "galaxy",
      note: "Galáxia espiral ilustrativa · não é fotografia da Via Láctea",
    },
    andromeda: {
      mode: "galaxy",
      pitch: 0.6,
      note: "Galáxia espiral ilustrativa · posições sem escala",
    },
    teia: {
      mode: "web",
      note: "Filamentos ilustrativos · não é um levantamento do universo",
    },
    observavel: {
      mode: "horizon",
      note: "Metáfora do horizonte observável · não é uma parede física",
    },
  };
  let mapPromise;
  const imageCache = new Map();
  function loadMaps() {
    if (window.TARS_TEXTURES) return Promise.resolve(window.TARS_TEXTURES);
    if (!mapPromise)
      mapPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "assets/textures/maps.js";
        script.onload = () => resolve(window.TARS_TEXTURES);
        script.onerror = () => {
          mapPromise = null;
          script.remove();
          reject(new Error("Mapas indisponíveis"));
        };
        document.head.append(script);
      });
    return mapPromise;
  }
  function loadImage(id) {
    if (!imageCache.has(id))
      imageCache.set(
        id,
        loadMaps().then(
          (maps) =>
            new Promise((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = reject;
              image.src = maps[id];
            }),
        ),
      );
    return imageCache.get(id);
  }
  function rotation(yaw, pitch) {
    const c = Math.cos(yaw),
      s = Math.sin(yaw),
      a = Math.cos(pitch),
      b = Math.sin(pitch);
    return new Float32Array([c, 0, -s, s * b, a, c * b, s * a, -b, c * a]);
  }
  const vertex = `attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragment = `precision highp float;
    varying vec2 v_uv;uniform sampler2D u_texture;uniform mat3 u_rotation;
    uniform vec3 u_color;uniform float u_aspect,u_zoom,u_spin,u_kind,u_rings,u_mapped,u_detail,u_atmosphere;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 a=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(a),hash(a+vec2(1.,0.)),f.x),mix(hash(a+vec2(0.,1.)),hash(a+1.),f.x),f.y);}
    mat3 inverseR(mat3 r){return mat3(vec3(r[0].x,r[1].x,r[2].x),vec3(r[0].y,r[1].y,r[2].y),vec3(r[0].z,r[1].z,r[2].z));}
    void main(){
      vec2 p=(v_uv*2.-1.)*vec2(u_aspect,1.)/u_zoom;
      float radius=u_rings>.5?.34:.63;
      float dist=length(p),z=sqrt(max(0.,radius*radius-dot(p,p)));
      bool sphere=dist<radius;vec3 light=normalize(vec3(-.65,.55,1.));
      vec3 col=vec3(0.);float alpha=0.;
      if(sphere){
        vec3 normal=vec3(p,z)/radius,local=inverseR(u_rotation)*normal;
        vec2 uv=vec2(fract(.5-atan(local.z,local.x)/6.2831853-u_spin),asin(clamp(local.y,-1.,1.))/3.14159265+.5);
        vec3 surface=u_mapped>.5?texture2D(u_texture,uv).rgb:u_color;
        if(u_kind>2.5&&u_kind<3.5){
          vec2 grid=uv*vec2(48.,24.);vec2 cell=floor(grid),center=.2+.6*vec2(hash(cell),hash(cell+7.));
          float crater=length(fract(grid)-center),rim=exp(-pow((crater-.23)*30.,2.));
          float texture=.74+noise(uv*150.)*.18+rim*.2-(1.-smoothstep(.05,.24,crater))*.16;surface=u_color*texture;
        }
        if(u_kind>3.5&&u_kind<4.5)surface=u_color*(.94+.05*sin(local.y*45.)+.025*noise(uv*25.));
        if(u_kind>4.5&&u_kind<5.5&&u_detail<.5){float clouds=noise(uv*vec2(15.,25.))*.6+noise(uv*vec2(40.,35.))*.25;surface=u_color*(.78+clouds*.35);}
        float diffuse=max(dot(normal,light),0.),ambient=u_detail>.5?.52:.16;
        col=surface*(ambient+(1.-ambient)*diffuse);
        if(u_atmosphere>.7&&surface.b>surface.r*1.15)col+=vec3(.3,.4,.5)*pow(max(dot(normal,normalize(light+vec3(0.,0.,1.))),0.),60.);
        if(u_kind>.5&&u_kind<1.5){float mottled=.78+.2*noise(uv*160.);col=u_color*(u_detail>.5?(.5+noise(uv*160.)*.6):mottled)*(.68+.32*z/radius);}
        if(u_kind>1.5&&u_kind<2.5)col=vec3(.006,.004,.01);
        if(u_atmosphere>0.)col+=vec3(.16,.37,.65)*pow(1.-z/radius,3.)*u_atmosphere*(.5+.5*diffuse);
        alpha=1.;
      }
      if(u_rings>.5){
        vec3 n=u_rotation*vec3(0.,1.,0.);
        if(abs(n.z)>.03){float ringZ=-(n.x*p.x+n.y*p.y)/n.z;
          vec3 hit=inverseR(u_rotation)*vec3(p,ringZ);float r=length(hit.xz)/radius;
          if(r>1.22&&r<2.27&&(!sphere||ringZ>z)){
            float bands=.66+.08*sin(r*60.)+.025*sin(r*190.);float gap=smoothstep(1.88,1.9,r)*(1.-smoothstep(1.96,1.99,r));
            col=vec3(.72,.65,.54)*bands*(.65+.35*abs(dot(n,light)))*(1.-gap*.85);alpha=.95;
            if(u_kind>1.5&&u_kind<2.5){col=u_color*(.8+.4*sin(r*23.))*(u_detail>.5?1.35:1.);alpha=exp(-(r-1.2)*1.7);}
          }
        }
      }
      if(!sphere&&alpha==0.){
        float d=max(0.,dist-radius);float glow=exp(-d*35.)*.22*u_atmosphere;
        if(u_kind>.5&&u_kind<1.5)glow=exp(-d*9.)*.45;
        if(u_kind>1.5&&u_kind<2.5)glow=exp(-pow(d*30.,2.))*.65;
        col=u_color;alpha=glow;
      }
      gl_FragColor=vec4(col,alpha);
    }`;
  const particleVertex = `attribute vec3 a_position;attribute vec3 a_color;uniform mat3 u_rotation;uniform float u_zoom,u_aspect,u_size;varying vec3 v_color;void main(){vec3 p=u_rotation*a_position;float depth=4.8-p.z;gl_Position=vec4(p.x/depth*u_zoom*1.4/u_aspect,p.y/depth*u_zoom*1.4,0.,1.);gl_PointSize=clamp(u_size*4.8/depth,1.,22.);v_color=a_color;}`;
  const particleFragment = `precision mediump float;varying vec3 v_color;uniform float u_lines,u_opacity;void main(){float d=length(gl_PointCoord-.5);float alpha=u_lines>.5?.23:exp(-d*d*18.);if(u_lines<.5&&d>.5)discard;gl_FragColor=vec4(v_color,alpha*u_opacity);}`;
  function makeProgram(gl, vs, fs) {
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw Error(message);
      }
      return shader;
    };
    const program = gl.createProgram(),
      v = compile(gl.VERTEX_SHADER, vs),
      f = compile(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    gl.deleteShader(v);
    gl.deleteShader(f);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program));
    return program;
  }
  function clouds(mode, variation = 0) {
    let seed = (mode === "web" ? 193 : 91) + variation * 7919;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const points = [],
      colors = [],
      lines = [],
      add = (x, y, z, r, g, b) => {
        points.push(x, y, z);
        colors.push(r, g, b);
      };
    if (mode === "web") {
      const nodes = Array.from({ length: 55 }, () => [
        (random() - 0.5) * 5,
        (random() - 0.5) * 4,
        (random() - 0.5) * 4,
      ]);
      nodes.forEach((a, index) => {
        add(...a, 0.85, 0.76, 1);
        const near = nodes
          .map((b, j) => ({
            b,
            j,
            d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
          }))
          .filter((x) => x.j !== index)
          .sort((x, y) => x.d - y.d)
          .slice(0, 3);
        near.forEach(({ b, j }) => {
          if (j < index) return;
          lines.push(...a, ...b);
          for (let i = 0; i < 35; i++) {
            const t = i / 35;
            add(
              a[0] * (1 - t) + b[0] * t + (random() - 0.5) * 0.05,
              a[1] * (1 - t) + b[1] * t + (random() - 0.5) * 0.05,
              a[2] * (1 - t) + b[2] * t + (random() - 0.5) * 0.05,
              0.48,
              0.56,
              0.82,
            );
          }
        });
      });
    } else if (mode === "stellar" || mode === "nebula") {
      // New deterministic scenery at each depth. This is an artistic journey,
      // not an astronomical catalogue or a physical scale model.
      for (let i = 0; i < 5200; i++) {
        const angle = random() * Math.PI * 2;
        const radius = Math.pow(random(), 0.65) * 2.8;
        const dust = mode === "nebula" && i % 3 !== 0;
        const x = Math.cos(angle) * radius;
        const y = dust
          ? Math.sin(x * 2.2 + variation) * 0.45 + (random() - 0.5) * 0.35
          : (random() - 0.5) * 3.4;
        const z = Math.sin(angle) * radius;
        const warm = random();
        add(
          x,
          y,
          z,
          dust ? 0.34 + warm * 0.22 : 0.65 + warm * 0.35,
          dust ? 0.3 + warm * 0.15 : 0.65 + warm * 0.3,
          dust ? 0.65 + warm * 0.25 : 0.8 + warm * 0.2,
        );
      }
      // A central cluster anchors the next descent, so no level becomes empty.
      for (let i = 0; i < 500; i++) {
        const radius = Math.pow(random(), 2) * 0.25,
          a = random() * Math.PI * 2;
        add(
          Math.cos(a) * radius,
          (random() - 0.5) * radius,
          Math.sin(a) * radius,
          0.8,
          0.85,
          1,
        );
      }
    } else if (mode === "horizon") {
      for (let i = 0; i < 2600; i++) {
        const a = random() * Math.PI * 2,
          b = Math.acos(random() * 2 - 1),
          r = 1.9 + random() * 0.2;
        add(
          r * Math.sin(b) * Math.cos(a),
          r * Math.cos(b),
          r * Math.sin(b) * Math.sin(a),
          0.48 + random() * 0.35,
          0.5 + random() * 0.3,
          0.75 + random() * 0.25,
        );
      }
    } else {
      for (let i = 0; i < 6500; i++) {
        const r = Math.pow(random(), 0.7) * 2.8,
          arm = i % 4,
          a = (arm * Math.PI) / 2 + r * 1.8 + (random() - 0.5) * 0.32;
        const y = (random() - 0.5) * (0.09 + 0.06 * r);
        add(
          Math.cos(a) * r,
          y,
          Math.sin(a) * r,
          0.7 + random() * 0.3,
          0.6 + random() * 0.25,
          0.75 + random() * 0.25,
        );
      }
      for (let i = 0; i < 1600; i++) {
        const a = random() * Math.PI * 2,
          r = Math.pow(random(), 1.8) * 0.7,
          y = (random() - 0.5) * 0.5;
        add(Math.cos(a) * r, y, Math.sin(a) * r, 1, 0.88, 0.67);
      }
      for (let arm = 0; arm < 4; arm++)
        for (let i = 1; i < 65; i++) {
          const r = (i / 65) * 2.7,
            a = (arm * Math.PI) / 2 + r * 1.8,
            previous = ((i - 1) / 65) * 2.7,
            pa = (arm * Math.PI) / 2 + previous * 1.8;
          lines.push(
            Math.cos(pa) * previous,
            0,
            Math.sin(pa) * previous,
            Math.cos(a) * r,
            0,
            Math.sin(a) * r,
          );
        }
    }
    return {
      points: new Float32Array(points),
      colors: new Float32Array(colors),
      lines: new Float32Array(lines),
    };
  }
  class Explorer {
    constructor(canvas, { id, reduced = false, onChange = () => {} }) {
      this.canvas = canvas;
      this.id = id;
      this.spec = specs[id] || {};
      this.reduced = reduced;
      this.onChange = onChange;
      this.yaw = this.spec.yaw ?? -0.35;
      this.pitch = this.spec.pitch ?? 0.48;
      this.spin = 0;
      this.zoom = 1;
      this.auto = !reduced;
      this.detail = this.spec.mode === "web";
      this.dead = false;
      this.frame = 0;
      this.last = 0;
      this.pointers = new Map();
      this.listeners = [];
      this.resources = [];
      this.layers = new Map();
      if (this.spec.mode) this.cloud = this.layer(0);
      try {
        this.gl = canvas.getContext("webgl", {
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: false,
        });
        if (this.gl) this.setupGL();
      } catch {
        this.gl = null;
        const replacement = canvas.cloneNode(false);
        canvas.replaceWith(replacement);
        this.canvas = replacement;
      }
      if (!this.gl) this.ctx = this.canvas.getContext("2d");
      this.canvas.dataset.engine = this.gl ? "webgl" : "canvas2d";
      this.bind();
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.canvas);
      this.resize();
      this.update();
      if (this.spec.texture)
        loadImage(this.spec.texture)
          .then((image) => {
            if (this.dead) return;
            this.image = image;
            if (this.gl) this.uploadTexture(image);
            else {
              const c = document.createElement("canvas");
              c.width = image.width;
              c.height = image.height;
              const ctx = c.getContext("2d");
              ctx.drawImage(image, 0, 0);
              this.imagePixels = {
                data: ctx.getImageData(0, 0, c.width, c.height).data,
                width: c.width,
                height: c.height,
              };
            }
            this.update();
          })
          .catch(() => {
            if (!this.dead) {
              this.canvas.dataset.texture = "unavailable";
              this.update();
            }
          });
    }
    layer(index) {
      if (!this.layers.has(index)) {
        const modes =
          this.spec.mode === "web" || this.spec.mode === "horizon"
            ? [this.spec.mode, "galaxy", "stellar", "nebula"]
            : this.spec.mode === "stellar"
              ? ["stellar", "nebula", "stellar"]
              : ["galaxy", "stellar", "nebula"];
        const mode = modes[index] || (index % 2 ? "nebula" : "stellar");
        this.layers.set(index, { ...clouds(mode, index), mode, index });
      }
      return this.layers.get(index);
    }
    depthScene() {
      const depth = Math.log(this.zoom) / Math.log(8);
      const index = Math.min(9, Math.floor(depth));
      const fraction = depth - index;
      const t = Math.max(0, Math.min(1, (fraction - 0.2) / 0.8));
      const blend = t * t * (3 - 2 * t);
      for (const key of this.layers.keys())
        if (key < index - 1 || key > index + 1) this.layers.delete(key);
      return [
        { cloud: this.layer(index), zoom: 8 ** fraction, opacity: 1 - blend },
        {
          cloud: this.layer(index + 1),
          zoom: 8 ** (fraction - 1),
          opacity: blend,
        },
      ];
    }
    setupGL() {
      const gl = this.gl;
      this.program = makeProgram(
        gl,
        this.cloud ? particleVertex : vertex,
        this.cloud ? particleFragment : fragment,
      );
      this.resources.push(["deleteProgram", this.program]);
      this.buffer = gl.createBuffer();
      this.resources.push(["deleteBuffer", this.buffer]);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.cloud
          ? this.cloud.points
          : new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      if (this.cloud) {
        this.colorBuffer = gl.createBuffer();
        this.resources.push(["deleteBuffer", this.colorBuffer]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cloud.colors, gl.STATIC_DRAW);
        this.lineBuffer = gl.createBuffer();
        this.resources.push(["deleteBuffer", this.lineBuffer]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cloud.lines, gl.STATIC_DRAW);
      } else {
        this.texture = gl.createTexture();
        this.resources.push(["deleteTexture", this.texture]);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          1,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array([180, 180, 180, 255]),
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }
    uploadTexture(image) {
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      this.canvas.dataset.texture = "ready";
    }
    listen(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      this.listeners.push(() =>
        target.removeEventListener(type, handler, options),
      );
    }
    bind() {
      this.listen(this.canvas, "pointerdown", (event) => {
        this.canvas.focus({ preventScroll: true });
        this.canvas.setPointerCapture(event.pointerId);
        this.pointers.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
        this.auto = false;
        this.update();
      });
      this.listen(this.canvas, "pointermove", (event) => {
        const before = this.pointers.get(event.pointerId);
        if (!before) return;
        if (this.pointers.size === 2) {
          const other = [...this.pointers.entries()].find(
            ([key]) => key !== event.pointerId,
          )[1];
          const oldDistance = Math.hypot(
              before.x - other.x,
              before.y - other.y,
            ),
            newDistance = Math.hypot(
              event.clientX - other.x,
              event.clientY - other.y,
            );
          if (oldDistance > 5)
            this.setZoom((this.zoom * newDistance) / oldDistance);
        } else {
          this.yaw += (event.clientX - before.x) * 0.009;
          this.pitch = Math.max(
            -1.55,
            Math.min(1.55, this.pitch + (event.clientY - before.y) * 0.009),
          );
        }
        this.pointers.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
        this.update();
      });
      for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
        this.listen(this.canvas, event, (e) => {
          this.pointers.delete(e.pointerId);
        });
      this.listen(
        this.canvas,
        "wheel",
        (event) => {
          event.preventDefault();
          this.setZoom(
            this.cloud
              ? this.zoom * Math.exp(-event.deltaY * 0.003)
              : this.zoom - event.deltaY * 0.0015,
          );
        },
        { passive: false },
      );
      this.listen(this.canvas, "keydown", (event) => {
        if (
          ![
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "+",
            "=",
            "-",
            "Home",
            " ",
          ].includes(event.key)
        )
          return;
        event.preventDefault();
        this.auto = false;
        if (event.key === "ArrowLeft") this.yaw -= 0.15;
        if (event.key === "ArrowRight") this.yaw += 0.15;
        if (event.key === "ArrowUp")
          this.pitch = Math.max(-1.55, this.pitch - 0.12);
        if (event.key === "ArrowDown")
          this.pitch = Math.min(1.55, this.pitch + 0.12);
        if (event.key === "+" || event.key === "=")
          this.setZoom(this.cloud ? this.zoom * 1.5 : this.zoom + 0.1);
        if (event.key === "-")
          this.setZoom(this.cloud ? this.zoom / 1.5 : this.zoom - 0.1);
        if (event.key === "Home") this.reset();
        if (event.key === " ") this.toggleAuto();
        this.update();
      });
      this.listen(document, "visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(this.frame);
          this.frame = 0;
        } else this.update();
      });
      this.listen(this.canvas, "webglcontextlost", (event) => {
        event.preventDefault();
        this.auto = false;
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.canvas.dataset.engine = "context-lost";
        this.onChange(this.snapshot());
      });
      this.listen(this.canvas, "webglcontextrestored", () => {
        if (this.dead) return;
        this.resources = [];
        this.canvas.dataset.engine = "webgl";
        this.setupGL();
        if (this.image) this.uploadTexture(this.image);
        this.update();
      });
    }
    resize() {
      const box = this.canvas.getBoundingClientRect(),
        ratio = Math.min(devicePixelRatio || 1, 1.5);
      this.canvas.width = Math.max(1, Math.round(box.width * ratio));
      this.canvas.height = Math.max(1, Math.round(box.height * ratio));
      this.update();
    }
    snapshot() {
      return {
        yaw: this.yaw,
        pitch: this.pitch,
        zoom: this.zoom,
        auto: this.auto,
        detail: this.detail,
        note: this.cloud
          ? `${this.spec.note} · exploração procedural em camadas`
          : this.spec.note,
        depth: this.cloud ? Math.log(this.zoom) / Math.log(8) : 0,
        layer: this.cloud
          ? this.layer(
              Math.min(10, Math.floor(Math.log(this.zoom) / Math.log(8))),
            ).mode
          : null,
        mode: this.spec.mode || "planet",
        engine: this.canvas.dataset.engine,
        texture: this.canvas.dataset.texture || "loading",
      };
    }
    update() {
      if (this.dead || document.hidden) return;
      this.onChange(this.snapshot());
      if (!this.frame)
        this.frame = requestAnimationFrame((time) => this.tick(time));
    }
    tick(time) {
      this.frame = 0;
      if (this.dead || document.hidden) return;
      const delta = this.last ? Math.min((time - this.last) / 1000, 0.06) : 0;
      this.last = time;
      if (this.auto && !this.pointers.size) {
        if (this.cloud) this.yaw += delta * 0.035;
        else this.spin += delta * 0.012 * (this.spec.reverse ? -1 : 1);
      }
      if (!this.auto || time - (this.lastRender || 0) >= (this.gl ? 32 : 80)) {
        this.render();
        this.lastRender = time;
      }
      if (time - (this.hudAt || 0) > 500) {
        this.onChange(this.snapshot());
        this.hudAt = time;
      }
      if (this.auto) this.frame = requestAnimationFrame((t) => this.tick(t));
    }
    setZoom(value) {
      this.zoom = Math.max(
        1,
        Math.min(
          this.cloud ? 8 ** 10 : 1.8,
          Number.isFinite(value) ? value : 1,
        ),
      );
      this.update();
    }
    turn(amount) {
      this.auto = false;
      this.yaw += amount;
      this.update();
    }
    toggleAuto() {
      this.auto = !this.auto;
      this.last = 0;
      this.update();
    }
    toggleDetail() {
      this.detail = !this.detail;
      this.update();
    }
    reset() {
      this.yaw = this.spec.yaw ?? -0.35;
      this.pitch = this.spec.pitch ?? 0.48;
      this.zoom = 1;
      this.spin = 0;
      this.auto = !this.reduced;
      this.detail = this.spec.mode === "web";
      this.update();
    }
    render() {
      if (this.gl) this.renderGL();
      else if (this.ctx) this.renderCPU();
    }
    renderGL() {
      const gl = this.gl;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      const uniform = (name) => gl.getUniformLocation(this.program, name);
      gl.uniformMatrix3fv(
        uniform("u_rotation"),
        false,
        rotation(this.yaw, this.pitch),
      );
      gl.uniform1f(uniform("u_aspect"), this.canvas.width / this.canvas.height);
      gl.uniform1f(uniform("u_zoom"), this.zoom);
      const position = gl.getAttribLocation(this.program, "a_position");
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(
        position,
        this.cloud ? 3 : 2,
        gl.FLOAT,
        false,
        0,
        0,
      );
      if (this.cloud) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        const color = gl.getAttribLocation(this.program, "a_color");
        for (const scene of this.depthScene()) {
          if (scene.opacity <= 0) continue;
          // Reuse three GPU buffers; only the two neighboring levels are drawn.
          gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
          gl.bufferData(gl.ARRAY_BUFFER, scene.cloud.points, gl.DYNAMIC_DRAW);
          gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, scene.cloud.colors, gl.DYNAMIC_DRAW);
          gl.enableVertexAttribArray(color);
          gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
          gl.uniform1f(uniform("u_zoom"), scene.zoom);
          gl.uniform1f(uniform("u_opacity"), scene.opacity);
          gl.uniform1f(
            uniform("u_size"),
            Math.min(devicePixelRatio || 1, 1.5) *
              (scene.cloud.mode === "nebula"
                ? 12
                : scene.cloud.mode === "stellar"
                  ? 3.6
                  : 2.8),
          );
          gl.uniform1f(uniform("u_lines"), 0);
          gl.drawArrays(gl.POINTS, 0, scene.cloud.points.length / 3);
          if (this.detail && scene.cloud.lines.length) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, scene.cloud.lines, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
            gl.disableVertexAttribArray(color);
            gl.vertexAttrib3f(color, 0.6, 0.65, 0.9);
            gl.uniform1f(uniform("u_lines"), 1);
            gl.drawArrays(gl.LINES, 0, scene.cloud.lines.length / 3);
          }
        }
        gl.disable(gl.BLEND);
        this.canvas.dataset.depth = String(
          Math.floor(Math.log(this.zoom) / Math.log(8)),
        );
      } else {
        gl.uniform3fv(uniform("u_color"), this.spec.color || [0.6, 0.7, 0.9]);
        gl.uniform1f(uniform("u_spin"), this.spin);
        gl.uniform1f(uniform("u_kind"), this.spec.kind || 0);
        gl.uniform1f(uniform("u_rings"), this.spec.rings ? 1 : 0);
        gl.uniform1f(uniform("u_mapped"), this.image ? 1 : 0);
        gl.uniform1f(uniform("u_detail"), this.detail ? 1 : 0);
        gl.uniform1f(uniform("u_atmosphere"), this.spec.atmosphere || 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(uniform("u_texture"), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      this.canvas.dataset.rendered = "true";
    }
    renderCPU() {
      const ctx = this.ctx,
        w = this.canvas.width,
        h = this.canvas.height,
        r = rotation(this.yaw, this.pitch);
      ctx.clearRect(0, 0, w, h);
      if (this.cloud) {
        for (const scene of this.depthScene()) {
          if (scene.opacity <= 0) continue;
          ctx.globalAlpha = scene.opacity;
          const project = (x, y, z) => {
            const a = r[0] * x + r[3] * y + r[6] * z,
              b = r[1] * x + r[4] * y + r[7] * z,
              c = r[2] * x + r[5] * y + r[8] * z;
            const scale = ((h / 2) * scene.zoom * 1.4) / (4.8 - c);
            return [w / 2 + a * scale, h / 2 - b * scale];
          };
          if (this.detail) {
            ctx.strokeStyle = "#988de045";
            ctx.beginPath();
            for (let i = 0; i < scene.cloud.lines.length; i += 6) {
              const a = project(...scene.cloud.lines.subarray(i, i + 3)),
                b = project(...scene.cloud.lines.subarray(i + 3, i + 6));
              ctx.moveTo(...a);
              ctx.lineTo(...b);
            }
            ctx.stroke();
          }
          const p = scene.cloud.points,
            c = scene.cloud.colors;
          for (let i = 0; i < p.length; i += 3) {
            const [x, y] = project(p[i], p[i + 1], p[i + 2]);
            ctx.fillStyle = `rgba(${c[i] * 255},${c[i + 1] * 255},${c[i + 2] * 255},.65)`;
            ctx.fillRect(x, y, 1.5, 1.5);
          }
        }
        ctx.globalAlpha = 1;
        this.canvas.dataset.depth = String(
          Math.floor(Math.log(this.zoom) / Math.log(8)),
        );
      } else {
        const size = 240,
          aspect = w / h,
          radius = this.spec.rings ? 0.34 : 0.63,
          buffer = ctx.createImageData(size, size),
          pixels = buffer.data,
          tex = this.imagePixels;
        for (let y = 0; y < size; y++)
          for (let x = 0; x < size; x++) {
            const nx = (((x / size) * 2 - 1) * aspect) / this.zoom,
              ny = (1 - (y / size) * 2) / this.zoom,
              d = nx * nx + ny * ny;
            if (d > radius * radius) continue;
            const nz = Math.sqrt(radius * radius - d),
              localX = (r[0] * nx + r[1] * ny + r[2] * nz) / radius,
              localY = (r[3] * nx + r[4] * ny + r[5] * nz) / radius,
              localZ = (r[6] * nx + r[7] * ny + r[8] * nz) / radius;
            const u =
                (((0.5 -
                  Math.atan2(localZ, localX) / (Math.PI * 2) -
                  this.spin) %
                  1) +
                  1) %
                1,
              v = 0.5 - Math.asin(Math.max(-1, Math.min(1, localY))) / Math.PI;
            let color = (
              this.spec.kind === 2
                ? [0.007, 0.007, 0.012]
                : this.spec.color || [0.6, 0.7, 0.9]
            ).map((value) => value * 255);
            if (tex && !(this.id === "venus" && !this.detail)) {
              const t =
                (Math.min(tex.height - 1, Math.floor(v * tex.height)) *
                  tex.width +
                  Math.min(tex.width - 1, Math.floor(u * tex.width))) *
                4;
              color = tex.data.subarray(t, t + 3);
            }
            const light =
                this.spec.kind === 1
                  ? 0.9
                  : Math.max(0.17, (nx * -0.5 + ny * 0.4 + nz * 0.9) / radius),
              i = (y * size + x) * 4;
            pixels[i] = color[0] * light;
            pixels[i + 1] = color[1] * light;
            pixels[i + 2] = color[2] * light;
            pixels[i + 3] = 255;
          }
        if (!this.lowCanvas) this.lowCanvas = document.createElement("canvas");
        this.lowCanvas.width = size;
        this.lowCanvas.height = size;
        this.lowCanvas.getContext("2d").putImageData(buffer, 0, 0);
        if (this.spec.rings) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate(this.yaw * 0.15);
          ctx.strokeStyle = "#b8a48b";
          ctx.lineWidth = h * 0.03;
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            h * 0.36 * this.zoom,
            h * 0.1 * this.zoom,
            0,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          ctx.restore();
        }
        ctx.drawImage(this.lowCanvas, 0, 0, w, h);
      }
      this.canvas.dataset.rendered = "true";
      if (this.image) this.canvas.dataset.texture = "ready";
    }
    destroy() {
      this.dead = true;
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.observer.disconnect();
      this.listeners.forEach((remove) => remove());
      if (this.gl) {
        this.resources.forEach(([method, resource]) =>
          this.gl[method](resource),
        );
        this.gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    }
  }
  Explorer.loadMaps = loadMaps;
  Explorer.specs = specs;
  return Explorer;
})();
