import { Canvas } from "@react-three/fiber";
import { Avatar } from "./components/scene/Avatar";
import { Office } from "./components/scene/Office";
import { FloatingShapes } from "./components/scene/FloatingShapes";
import { Navigation } from "./components/ui/Navigation";
import { SpeedLines } from "./components/ui/SpeedLines";
import { Interface } from "./components/layout/Interface";
import { useStepScroll } from "./hooks/useStepScroll";
import { ScrollProvider } from "./providers/ScrollProvider";
import { CameraParallax } from "./components/scene/CameraParallax";

// Компонент Scene инкапсулирует всё, что должно находиться внутри 3D-контекста (Canvas)
function Scene() {
  // Хук подписывается на события скролла, колесика и свайпов
  useStepScroll();

  return (
    <>
      <CameraParallax intensity={0.2} /> // Эффект "живой" камеры
      <Office />
      <Avatar />
      <FloatingShapes />
    </>
  );
}

function App() {
  return (
    // ScrollProvider инициализирует Lenis (плавный скролл) и передает прогресс скролла внутрь 3D
    <ScrollProvider>
      {/* СЛОЙ -1: Фиксированный фон с космосом */}
      {/* Он не скроллится, всегда на заднем плане, картинка не растягивается */}
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
          zIndex: -1, // Уходит на самый задний план
        }}
      />

      <main className='app-container' style={{ background: "transparent" }}>
        {/* UI-элементы поверх сцены (слои скорости, навигация) */}
        <SpeedLines />
        <Navigation />

        {/* СЛОЙ 0: Фиксированная 3D-сцена */}
        {/* position: fixed гарантирует, что Аватар и Офис не будут скроллиться вместе с текстом */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            pointerEvents: "none", // Позволяет кликать по тексту "сквозь" пустые места Canvas
          }}>
          <Canvas
            dpr={[1, 2]} // Адаптивное качество (от 1x до 2x в зависимости от экрана)
            camera={{ position: [1.2, 1.0, 2.5], fov: 50 }}
            gl={{ alpha: true }} // Включаем прозрачность фона 3D-сцены
            style={{ background: "transparent", pointerEvents: "auto" }}>
            {/* Освещение сцены */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            {/* Внутренние 3D-объекты */}
            <Scene />
          </Canvas>
        </div>

        {/* СЛОЙ 1: Скроллящийся HTML-контент */}
        {/* Здесь лежат все секции с текстом. Они имеют высоту 400vh и скроллятся поверх 3D */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Interface />
        </div>
      </main>
    </ScrollProvider>
  );
}

export default App;
