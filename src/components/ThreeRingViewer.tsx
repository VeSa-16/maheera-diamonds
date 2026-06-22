import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeRingViewerProps {
  metalColor: string;
  diamondShape: string;
  caratSize: number;
  settingType?: string;
  engraving?: string;
  enableZoom?: boolean;
  autoRotate?: boolean;
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1: DIAMOND CUT GEOMETRY BUILDERS
   Each function returns accurate BufferGeometry for the cut.
   ═══════════════════════════════════════════════════════════ */

/**
 * Round Brilliant Cut — 58 facets
 * Crown: 1 table + 8 star + 8 bezel (kite) + 16 upper-girdle
 * Pavilion: 8 main + 16 lower-girdle + culet point
 */
function buildRoundBrilliant(s: number): THREE.BufferGeometry {
  const v: number[] = [];
  const f: number[] = [];
  const add = (x: number, y: number, z: number) => { const i = v.length / 3; v.push(x, y, z); return i; };
  const tri = (a: number, b: number, c: number) => f.push(a, b, c);

  // GIA ideal proportions (diameter = 2s)
  const R = s;                // girdle radius
  const Rt = 0.53 * s;       // table radius (53%)
  const Hc = 0.162 * s;      // crown height
  const Hp = 0.431 * s;      // pavilion depth
  const G = 0.025 * s;       // girdle thickness

  // Vertices —
  const culet = add(0, -Hp, 0);

  // 16 girdle-bottom vertices
  const gb: number[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    gb.push(add(Math.cos(a) * R, 0, Math.sin(a) * R));
  }

  // 16 girdle-top vertices
  const gt: number[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    gt.push(add(Math.cos(a) * R, G, Math.sin(a) * R));
  }

  // 8 bezel (kite) vertices — between girdle and table, offset half-step
  const bz: number[] = [];
  const Rb = R * 0.72;
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * Math.PI * 2;
    bz.push(add(Math.cos(a) * Rb, G + Hc * 0.62, Math.sin(a) * Rb));
  }

  // 8 star vertices — near table edge, aligned with main facets
  const st: number[] = [];
  const Rs = Rt * 1.12;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    st.push(add(Math.cos(a) * Rs, G + Hc * 0.82, Math.sin(a) * Rs));
  }

  // 8 table-edge vertices
  const tb: number[] = [];
  const Yt = G + Hc;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    tb.push(add(Math.cos(a) * Rt, Yt, Math.sin(a) * Rt));
  }

  // Table center
  const tc = add(0, Yt, 0);

  // — PAVILION —
  // 8 main pavilion facets (culet → girdle pairs, every other girdle vert)
  for (let i = 0; i < 8; i++) {
    const gi = i * 2;
    const gn = ((i + 1) * 2) % 16;
    tri(culet, gb[gn], gb[gi]);
  }
  // 16 lower-girdle facets
  for (let i = 0; i < 16; i++) {
    const n = (i + 1) % 16;
    tri(culet, gb[n], gb[i]);
  }

  // — GIRDLE — 16 quads
  for (let i = 0; i < 16; i++) {
    const n = (i + 1) % 16;
    tri(gb[i], gb[n], gt[n]);
    tri(gb[i], gt[n], gt[i]);
  }

  // — CROWN — upper-girdle → bezel → star → table
  // Upper-girdle facets: gt → bezel
  for (let i = 0; i < 8; i++) {
    const g0 = i * 2;
    const g1 = i * 2 + 1;
    const g2 = ((i + 1) * 2) % 16;
    // Two triangles per bezel facet section
    tri(gt[g0], gt[g1], bz[i]);
    tri(gt[g1], gt[g2], bz[i]);
  }

  // Bezel → star facets
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    tri(bz[i], st[n], st[i]);
    // Connect bezel to next bezel through upper girdle
    const g2 = ((i + 1) * 2) % 16;
    tri(gt[g2], bz[(i + 1) % 8], bz[i]);
  }

  // Star → table edge
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    tri(st[i], st[n], tb[n]);
    tri(st[i], tb[n], tb[i]);
  }

  // Table face (octagonal fan)
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    tri(tc, tb[i], tb[n]);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.setIndex(f);
  const flatG = g.toNonIndexed();
  flatG.computeVertexNormals();
  return flatG;
}

/**
 * Oval — stretched round brilliant
 */
function buildOval(s: number): THREE.BufferGeometry {
  const g = buildRoundBrilliant(s);
  g.scale(0.7, 1, 1.35);
  return g;
}

/**
 * Princess — square brilliant, 57 facets
 * We build it as a four-sided brilliant (like round but with 4-fold symmetry)
 */
function buildPrincess(s: number): THREE.BufferGeometry {
  const v: number[] = [];
  const f: number[] = [];
  const add = (x: number, y: number, z: number) => { const i = v.length / 3; v.push(x, y, z); return i; };
  const tri = (a: number, b: number, c: number) => f.push(a, b, c);

  const hw = s * 0.85;       // half-width (square)
  const Hp = 0.42 * s;       // pavilion depth
  const Hc = 0.17 * s;       // crown height
  const G = 0.02 * s;        // girdle thickness
  const Rt = 0.5 * s;        // table half-width

  const culet = add(0, -Hp, 0);

  // Girdle bottom — 4 corners + 4 midpoints = 8 verts
  const corners = [[-hw, 0, -hw], [hw, 0, -hw], [hw, 0, hw], [-hw, 0, hw]];
  const mids = [[0, 0, -hw], [hw, 0, 0], [0, 0, hw], [-hw, 0, 0]];
  const girdleB: number[] = [];
  for (let i = 0; i < 4; i++) {
    girdleB.push(add(...corners[i] as [number, number, number]));
    girdleB.push(add(...mids[i] as [number, number, number]));
  }

  // Girdle top
  const girdleT: number[] = [];
  for (let i = 0; i < 4; i++) {
    girdleT.push(add(corners[i][0], G, corners[i][2]));
    girdleT.push(add(mids[i][0], G, mids[i][2]));
  }

  // Crown kite points (between girdle and table)
  const kiteR = hw * 0.72;
  const kiteY = G + Hc * 0.6;
  const kites: number[] = [];
  const kitePos = [[kiteR, kiteY, -kiteR], [kiteR, kiteY, kiteR], [-kiteR, kiteY, kiteR], [-kiteR, kiteY, -kiteR]];
  for (const p of kitePos) kites.push(add(...p as [number, number, number]));

  // Table corners
  const tableY = G + Hc;
  const tblPts: number[] = [];
  const tblPos = [[-Rt, tableY, -Rt], [Rt, tableY, -Rt], [Rt, tableY, Rt], [-Rt, tableY, Rt]];
  for (const p of tblPos) tblPts.push(add(...p as [number, number, number]));
  const tblCenter = add(0, tableY, 0);

  // Pavilion — chevron pattern from culet to girdle
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    tri(culet, girdleB[n], girdleB[i]);
  }

  // Girdle quads
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    tri(girdleB[i], girdleB[n], girdleT[n]);
    tri(girdleB[i], girdleT[n], girdleT[i]);
  }

  // Crown: girdle-top → kites
  for (let i = 0; i < 4; i++) {
    const g0 = i * 2;
    const g1 = i * 2 + 1;
    const g2 = ((i + 1) * 2) % 8;
    tri(girdleT[g0], girdleT[g1], kites[i]);
    tri(girdleT[g1], girdleT[g2], kites[i]);
  }

  // Kites → table
  for (let i = 0; i < 4; i++) {
    const n = (i + 1) % 4;
    tri(kites[i], tblPts[i], tblPts[n]);
    tri(kites[i], tblPts[n], kites[n]);
  }

  // Table
  for (let i = 0; i < 4; i++) {
    const n = (i + 1) % 4;
    tri(tblCenter, tblPts[i], tblPts[n]);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.setIndex(f);
  const flatG = g.toNonIndexed();
  flatG.computeVertexNormals();
  return flatG;
}

/**
 * Cushion — rounded-square brilliant (8-sided symmetry)
 */
function buildCushion(s: number): THREE.BufferGeometry {
  const g = buildRoundBrilliant(s * 0.95);
  // Slightly squash to make it pillowy/rounded-square
  g.scale(0.88, 0.95, 0.88);
  return g;
}

/**
 * Emerald — step-cut, rectangular, "hall of mirrors" look
 * Flat parallel facets, chamfered corners
 */
function buildEmerald(s: number): THREE.BufferGeometry {
  const v: number[] = [];
  const f: number[] = [];
  const add = (x: number, y: number, z: number) => { const i = v.length / 3; v.push(x, y, z); return i; };
  const tri = (a: number, b: number, c: number) => f.push(a, b, c);

  const W = 0.45 * s;   // half-width
  const L = 0.62 * s;   // half-length (rectangular 1:1.38 ratio)
  const Hp = 0.36 * s;  // pavilion depth
  const Hc = 0.14 * s;  // crown height
  const G = 0.02 * s;   // girdle
  const cr = 0.14 * s;  // corner chamfer

  // Build rectangular ring with chamfered corners (8 vertices per ring)
  function ring8(hw: number, hl: number, y: number): number[] {
    return [
      add(-hw + cr, y, -hl),    // top-left chamfer right
      add(hw - cr, y, -hl),     // top-right chamfer left
      add(hw, y, -hl + cr),     // top-right chamfer bottom
      add(hw, y, hl - cr),      // bottom-right chamfer top
      add(hw - cr, y, hl),      // bottom-right chamfer left
      add(-hw + cr, y, hl),     // bottom-left chamfer right
      add(-hw, y, hl - cr),     // bottom-left chamfer top
      add(-hw, y, -hl + cr),    // top-left chamfer bottom
    ];
  }

  // Step ratios for emerald step-cut (3 pavilion steps + culet line)
  const pavSteps = [
    ring8(W, L, 0),                          // girdle bottom
    ring8(W * 0.72, L * 0.72, -Hp * 0.4),   // step 1
    ring8(W * 0.4, L * 0.4, -Hp * 0.75),    // step 2
  ];
  // Culet (line for emerald, not point)
  const culetLine = [
    add(-W * 0.08, -Hp, 0),
    add(W * 0.08, -Hp, 0),
  ];

  const crownSteps = [
    ring8(W, L, G),                           // girdle top
    ring8(W * 0.82, L * 0.82, G + Hc * 0.45), // crown step 1
    ring8(W * 0.6, L * 0.6, G + Hc * 0.8),    // crown step 2 (table border)
  ];
  // Table
  const tableR = ring8(W * 0.5, L * 0.5, G + Hc);
  const tableC = add(0, G + Hc, 0);

  // Connect rings with quads
  function connectRings(a: number[], b: number[]) {
    for (let i = 0; i < a.length; i++) {
      const n = (i + 1) % a.length;
      tri(a[i], a[n], b[n]);
      tri(a[i], b[n], b[i]);
    }
  }

  // Pavilion steps
  connectRings(pavSteps[0], pavSteps[1]);
  connectRings(pavSteps[1], pavSteps[2]);

  // Bottom step to culet line (fan)
  const lastPav = pavSteps[2];
  for (let i = 0; i < lastPav.length; i++) {
    const n = (i + 1) % lastPav.length;
    // Alternate connection to culet endpoints
    const ci = i < lastPav.length / 2 ? culetLine[0] : culetLine[1];
    tri(lastPav[i], lastPav[n], ci);
  }
  // Close culet
  tri(culetLine[0], lastPav[0], lastPav[lastPav.length - 1]);
  tri(culetLine[1], lastPav[3], lastPav[4]);

  // Girdle
  connectRings(pavSteps[0], crownSteps[0]);

  // Crown steps
  connectRings(crownSteps[0], crownSteps[1]);
  connectRings(crownSteps[1], crownSteps[2]);
  connectRings(crownSteps[2], tableR);

  // Table face
  for (let i = 0; i < tableR.length; i++) {
    const n = (i + 1) % tableR.length;
    tri(tableC, tableR[i], tableR[n]);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.setIndex(f);
  const flatG = g.toNonIndexed();
  flatG.computeVertexNormals();
  return flatG;
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2: DIAMOND MESH COMPONENT
   ═══════════════════════════════════════════════════════════ */

function DiamondMesh({ shape, scale }: { shape: string; scale: number }) {
  const geometry = useMemo(() => {
    switch (shape) {
      case 'round':    return buildRoundBrilliant(scale);
      case 'oval':     return buildOval(scale);
      case 'princess': return buildPrincess(scale);
      case 'cushion':  return buildCushion(scale);
      case 'emerald':  return buildEmerald(scale);
      default:         return buildRoundBrilliant(scale);
    }
  }, [shape, scale]);

  return (
    <mesh geometry={geometry} castShadow>
      <MeshTransmissionMaterial
        backside
        backsideThickness={1.2}
        thickness={1.5}
        ior={2.417}
        chromaticAberration={0.15}
        anisotropy={0.3}
        distortion={0.05}
        clearcoat={1}
        clearcoatRoughness={0}
        color="#ffffff"
        envMapIntensity={6.0}
        resolution={1024}
        transmissionSampler
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3: RING STRUCTURE COMPONENTS
   Shank (band), Head (setting), Gallery, Prongs
   ═══════════════════════════════════════════════════════════ */

/** Metal material shared across all ring parts */
function useMetalMaterial(color: string) {
  return useMemo(() => new THREE.MeshStandardMaterial({
    color,
    metalness: 0.95,
    roughness: 0.06,
    envMapIntensity: 2,
  }), [color]);
}

/**
 * Prong — elegant sweeping claw using a Cubic Bezier Curve
 */
function Prong({
  angle, baseY, baseR, gripY, gripR, metalColor
}: {
  angle: number;
  baseY: number;   
  baseR: number;   
  gripY: number;   
  gripR: number;   
  metalColor: string;
}) {
  const geom = useMemo(() => {
    // Start at the bridge (shank base)
    const p1 = new THREE.Vector3(Math.cos(angle) * baseR, baseY, Math.sin(angle) * baseR);
    
    // Bow out slightly to gracefully accommodate the diamond's deep pavilion
    const bulgeR = baseR + (gripR - baseR) * 0.6 + 0.05;
    const cp1 = new THREE.Vector3(Math.cos(angle) * bulgeR, baseY + (gripY - baseY) * 0.4, Math.sin(angle) * bulgeR);
    
    // Approach the diamond girdle
    const cp2 = new THREE.Vector3(Math.cos(angle) * (gripR + 0.02), gripY - 0.1, Math.sin(angle) * (gripR + 0.02));
    
    // Hook over the crown (top edge of the diamond)
    const p2 = new THREE.Vector3(Math.cos(angle) * gripR * 0.88, gripY + 0.04, Math.sin(angle) * gripR * 0.88);

    const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2);
    // Thin, delicate, highly-polished tube
    return new THREE.TubeGeometry(curve, 24, 0.035, 16, false);
  }, [angle, baseY, baseR, gripY, gripR]);

  return (
    <group>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.04} envMapIntensity={2.5} />
      </mesh>
      {/* Delicate Claw Tip */}
      <mesh position={[Math.cos(angle) * gripR * 0.88, gripY + 0.04, Math.sin(angle) * gripR * 0.88]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.04} envMapIntensity={2.5} />
      </mesh>
    </group>
  );
}

/**
 * Halo ring — small accent diamonds circling the center stone
 */
function HaloRing({ y, radius, metalColor }: { y: number; radius: number; metalColor: string }) {
  const count = 16;
  const accents = useMemo(() => {
    const arr: { pos: [number, number, number] }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push({ pos: [Math.cos(a) * radius, y, Math.sin(a) * radius] });
    }
    return arr;
  }, [y, radius]);

  return (
    <group>
      {/* Halo ring band */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, y, 0]}>
        <torusGeometry args={[radius, 0.018, 12, 64]} />
        <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Accent diamonds */}
      {accents.map((a, i) => (
        <mesh key={i} position={a.pos} scale={[0.035, 0.025, 0.035]}>
          <octahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            transmission={0.85}
            transparent
            ior={2.42}
            roughness={0}
            clearcoat={1}
            color="#f0f4ff"
            envMapIntensity={3}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Pavé band — small diamonds embedded along the shank shoulders
 */
function PaveBand({ bandRadius, bandTube, metalColor }: { bandRadius: number; bandTube: number; metalColor: string }) {
  const count = 24;
  const paveStones = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    // Only on the top-facing arc (120° spread, centered at top)
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * (Math.PI * 0.7) - Math.PI * 0.35;
      const x = Math.sin(t) * (bandRadius + bandTube * 0.95);
      const y = Math.cos(t) * (bandRadius + bandTube * 0.95);
      arr.push({
        pos: [x, y, 0],
        rot: [0, 0, -t]
      });
    }
    return arr;
  }, [bandRadius, bandTube]);

  return (
    <group>
      {paveStones.map((stone, i) => (
        <mesh key={i} position={stone.pos} rotation={stone.rot} scale={[0.025, 0.018, 0.025]}>
          <octahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            transmission={0.85}
            transparent
            ior={2.42}
            roughness={0}
            clearcoat={1}
            color="#f0f4ff"
            envMapIntensity={3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4: COMPLETE RING MODEL
   Assembles: Shank + Gallery + Head + Prongs + Diamond
   Setting types: solitaire / halo / pave / three-stone
   ═══════════════════════════════════════════════════════════ */

function RingModel({ metalColor, diamondShape, caratSize, settingType = 'solitaire', engraving }: ThreeRingViewerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.3;
  });

  // ─── Dimensions ───
  const dScale = 0.5 + caratSize * 0.22;  // diamond scale from carat
  const bandR = 0.72;                       // shank radius
  const bandT = 0.085;                      // shank tube thickness

  // Diamond sits high above band — like the reference sketch
  const headBaseY = bandR + bandT;                // top of shank
  const galleryH = dScale * 0.35;                 // gallery height
  const diamondY = headBaseY + galleryH + 0.02;   // diamond rests here
  const diamondGirdleR = dScale * 1.0;            // girdle radius of diamond

  // Prong count varies by shape
  const prongCount = diamondShape === 'round' ? 6 : 4;
  const prongAngles = Array.from({ length: prongCount }, (_, i) => (i / prongCount) * Math.PI * 2);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} rotation={[0.45, 0, 0]}>

      {/* ═══ SHANK / BAND (Comfort-Fit Tapered Profile) ═══ */}
      {/* Scale Z flattens the band against the finger for a realistic jewelry profile */}
      <mesh rotation={[0, 0, 0]} castShadow receiveShadow scale={[1, 1, 0.6]}>
        <torusGeometry args={[bandR, bandT, 32, 128]} />
        <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.06} envMapIntensity={2} />
      </mesh>

      {/* ═══ HEAD & GALLERY (Basket Setting) ═══ */}
      
      {/* The Bridge (base of the gallery resting on the shank) */}
      <mesh position={[0, headBaseY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[bandT * 1.8, 0.035, 16, 32]} />
        <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.06} envMapIntensity={2} />
      </mesh>

      {/* The Gallery Rail (hidden halo ring just below the diamond girdle) */}
      <mesh position={[0, diamondY - dScale * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[diamondGirdleR * 0.75, 0.025, 16, 32]} />
        <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.06} envMapIntensity={2} />
      </mesh>

      {/* ═══ PRONGS — sweeping curved claws holding the diamond ═══ */}
      {prongAngles.map((angle, i) => (
        <Prong
          key={i}
          angle={angle}
          baseY={headBaseY}
          baseR={bandT * 1.8}
          gripY={diamondY}
          gripR={diamondGirdleR}
          metalColor={metalColor}
        />
      ))}

      {/* ═══ CENTER DIAMOND ═══ */}
      <group position={[0, diamondY, 0]}>
        <DiamondMesh shape={diamondShape} scale={dScale} />
      </group>

      {/* ═══ SETTING-SPECIFIC ADDITIONS ═══ */}

      {/* Halo: ring of small accent diamonds around center stone */}
      {settingType === 'halo' && (
        <HaloRing
          y={diamondY + 0.01}
          radius={diamondGirdleR * 1.15}
          metalColor={metalColor}
        />
      )}

      {/* Pavé: small diamonds embedded along the top arc of the shank */}
      {settingType === 'pave' && (
        <PaveBand bandRadius={bandR} bandTube={bandT} metalColor={metalColor} />
      )}

      {/* Three-stone: two flanking side stones */}
      {settingType === 'three-stone' && (
        <>
          {/* Left side stone */}
          <group position={[diamondGirdleR * 1.5, diamondY - dScale * 0.1, 0]} scale={[0.6, 0.6, 0.6]}>
            <DiamondMesh shape={diamondShape} scale={dScale * 0.7} />
          </group>
          {/* Right side stone */}
          <group position={[-diamondGirdleR * 1.5, diamondY - dScale * 0.1, 0]} scale={[0.6, 0.6, 0.6]}>
            <DiamondMesh shape={diamondShape} scale={dScale * 0.7} />
          </group>
          {/* Side prongs for flanking stones */}
          {[1, -1].map((side) => (
            <React.Fragment key={side}>
              {[0, Math.PI].map((a, j) => (
                <Prong
                  key={`side-${side}-${j}`}
                  angle={a}
                  baseY={headBaseY + galleryH * 0.15}
                  baseR={bandT * 1.5}
                  gripY={diamondY - dScale * 0.1}
                  gripR={diamondGirdleR * 0.5}
                  metalColor={metalColor}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      )}

      {/* ═══ ENGRAVING — inside the band ═══ */}
      {engraving && (
        <Text
          position={[0, 0, -(bandR - bandT + 0.005)]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.055}
          color="#999999"
          anchorX="center"
          anchorY="middle"
        >
          {engraving}
        </Text>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5: CANVAS & VIEWER
   Jewelry-showcase lighting, orbit controls
   ═══════════════════════════════════════════════════════════ */

export default function ThreeRingViewer(props: ThreeRingViewerProps) {
  const { enableZoom = true, autoRotate = false } = props;

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Warm ambient fill */}
        <ambientLight intensity={0.5} color="#ffffff" />
        {/* Key light — bright white from upper right */}
        <spotLight position={[4, 8, 4]} angle={0.25} penumbra={1} intensity={8} castShadow color="#ffffff" />
        {/* Fill light — warm from left */}
        <spotLight position={[-3, 5, -2]} angle={0.4} penumbra={0.8} intensity={4} color="#ffe8cc" />
        {/* Top down light for diamond fire */}
        <pointLight position={[0, 6, 0]} intensity={3} color="#ffffff" />
        {/* Backlight for diamond dispersion effect */}
        <pointLight position={[0, -2, -3]} intensity={2} color="#cce0ff" />
        {/* Extra highlight point light near camera */}
        <pointLight position={[0, 2, 4]} intensity={2} color="#ffffff" />

        {/* Studio HDR environment for realistic metal/diamond reflections */}
        <Environment preset="studio" />

        <RingModel {...props} />

        <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={5} blur={2.5} far={3} />
        <OrbitControls
          enableZoom={enableZoom}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minDistance={2}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}
