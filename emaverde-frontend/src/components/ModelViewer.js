import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";

function Modelo({ url }) {
  const { scene } = useGLTF(url);

  return (
    <Center>
      <primitive object={scene} scale={30} />
    </Center>
  );
}

export default function ModelViewer({ modelo }) {
  return (
    <Canvas
      style={{ height: "400px" }}
      camera={{
        position: [0, 10, 20],
        fov: 50,
        near: 0.1,
        far: 2000
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <OrbitControls minDistance={2} maxDistance={100} />

      <Modelo url={modelo} />
    </Canvas>
  );
}