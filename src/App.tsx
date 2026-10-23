import { Canvas } from "@react-three/fiber";
import { Avatar } from "./components/scene/Avatar";
import { Office } from "./components/scene/Office";
import { FloatingShapes } from "./components/scene/FloatingShapes";
import { Navigation } from "./components/ui/Navigation";
import { SpeedLines } from "./components/ui/SpeedLines";
import { Interface } from "./components/layout/Interface";
import { useStepScroll } from "./hooks/useStepScroll";
import { ScrollProvider } from "./components/ScrollProvider";

function Scene() {
  useStepScroll();

  return (
    <>
      <Office />
      <Avatar />
      <FloatingShapes />
    </>
  );
}

function App() {
  return (
    <ScrollProvider>
      {/* ФОН (Фиксированный слой) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: 'url("/textures/space.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1, // Уходит за 3D-сцену и текст
        }}
      />

      <main className='app-container' style={{ background: "transparent" }}>
        <SpeedLines />
        <Navigation />

        {/* 3D-СЦЕНА */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
          }}>
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [1.5, 1.2, 3.0], fov: 50 }}
            gl={{ alpha: true }}
            style={{ background: "transparent", pointerEvents: "auto" }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <Scene />
          </Canvas>
        </div>

        {/* HTML-КОНТЕНТ */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Interface />
        </div>
      </main>
    </ScrollProvider>
  );
}

export default App;
