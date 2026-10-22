import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { Avatar } from "./components/scene/Avatar";
import { Office } from "./components/scene/Office";
import { Interface } from "./components/layout/Interface";
import { Navigation } from "./components/ui/Navigation";
import { ScrollTracker } from "./components/scene/ScrollTracker";
import { SpeedLines } from "./components/ui/SpeedLines";
import { useStepScroll } from "./hooks/useStepScroll";
import { FloatingShapes } from "./components/scene/FloatingShapes";

function Scene() {
  useStepScroll();

  return (
    <>
      <ScrollTracker />
      <Office />
      <Avatar />
      <FloatingShapes />
      <Scroll html style={{ width: "100%", scrollbarWidth: "none" }}>
        <Interface />
      </Scroll>
    </>
  );
}

function App() {
  return (
    <main
      className='app-container'
      style={{
        backgroundImage: 'url("/textures/space.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <SpeedLines />
      <Navigation />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1.5, 1.2, 3.0], fov: 50 }}
        // УБРАЛИ ПРОПС shadows ЗДЕСЬ
        gl={{ alpha: true }}
        style={{ background: "transparent" }}>
        <ambientLight intensity={0.8} />
        {/* 
          УБРАЛИ castShadow у света. 
          Интенсивность 0.8 даст хорошее равномерное освещение, 
          чтобы Аватар не был слишком темным без теней.
        */}
        <directionalLight position={[5, 5, 5]} intensity={1.0} />

        <ScrollControls pages={4} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </main>
  );
}

export default App;
