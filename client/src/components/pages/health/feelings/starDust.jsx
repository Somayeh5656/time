import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber'; // React hook animaation pyörittämiseen
import { PointMaterial, Points } from '@react-three/drei'; // Valmiita komponentteja partikkeleihin
import * as THREE from 'three';
import { AdditiveBlending } from 'three'; // Visuaalinen efekti jossa värit "lisääntyvät"


// Määritetään tunnetilakohtaiset värit partikkelisumulle
const emotionColors = {
  sadness: ['#55768b', '#83b5d2', '#cce7ff'],
  anger: ['#8b0000', '#ff4d4d', '#ffaaaa'],
  joy: ['#fff176', '#ffd54f', '#ffee58'],
  fear: ['#800080', '#dda0dd', '#ffccff'],
  neutral: ['#ffffff', '#ffffff', '#ffffff'],
};

// StarDust-komponentti vastaanottaa propina tunnetilan
export default function StarDust({ emotion = 'neutral' }) {
  const particlesRef = useRef(); // Ref partikkeliobjektin pyörittämiseen
  const colorSet = emotionColors[emotion] || emotionColors.neutral;

  // Lasketaan partikkelien kolmiulotteiset sijainnit kerran (useMemo säilyttää ne)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 4000; i++) {
      // Luodaan satunnaisesti pallon pinnalle pisteitä
      const r = Math.random() * 40;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      temp.push(x, y, z);
    }
    return new Float32Array(temp); // Palautetaan float-array (Three.js käyttää tätä)
  }, []);

  // Animoidaan partikkeleita: pyöritetään partikkelipilveä ajan funktiona
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1; // Hidas pyöritys y-akselilla
    }
  });

  return (
    <group>
      {/* Alhaalta valaiseva valopiste lisää "avaruus"-tunnelmaa */}
      <pointLight position={[0, -1, 0]} intensity={2} distance={5} />

      {/* Ensimmäinen partikkelikerros: pyörii */}
      <Points
        ref={particlesRef}
        positions={particles}
        rotation={[0, 0, 0]}
        stride={3} // Kolme arvoa (x, y, z) per piste
        frustumCulled={false} // Estää näkymättömyyden rajauksesta
      >
        <PointMaterial
          transparent
          color={colorSet[1]} // Toinen väri tunnetilasta
          size={0.005}
          sizeAttenuation // Etäisyys vaikuttaa kokoon
          depthWrite={false}
          blending={AdditiveBlending} // Summaa värejä (hehkuva efekti)
        />
      </Points>

      {/* Toinen kerros partikkelia (ei pyöri, hieman isommat pisteet) */}
      <Points
        positions={particles}
        rotation={[Math.PI / 2, 0, 0]} // Pyöräytetään kohtisuoraan
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color={colorSet[2]} // Kolmas väri tunnetilasta
          size={0.0099}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
