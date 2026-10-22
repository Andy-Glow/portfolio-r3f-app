import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { Avatar } from "./components/Avatar";
import { Office } from "./components/Office";
import { Interface } from "./components/Interface";
import { useStepScroll } from "./hooks/useStepScroll";

function Scene() {
  useStepScroll(); // Подключаем наш строгий скролл

  return (
    <>
      <Office />
      <Avatar />
      <Scroll html style={{ width: "100%", height: "100vh", scrollbarWidth: "none" }}>
        <Interface />
      </Scroll>
    </>
  );
}

function App() {
  return (
    <main className='app-container'>
      {/* Камера опущена и повернута, чтобы захватить левую стену */}
      <Canvas dpr={[1, 2]} camera={{ position: [1.5, 1.2, 3.0], fov: 50 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />

        <ScrollControls pages={4} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </main>
  );
}

export default App;
