import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";

function App() {
  // Создаем стандартный React-стейт для хранения имени текущей анимации
  const [currentAnim, setCurrentAnim] = React.useState<string>("typing");

  return (
    <main style={{ width: "100vw", height: "100vh", background: "#101010", position: "relative" }}>
      {/* HTML ИНТЕРФЕЙС: Панель управления кнопками поверх 3D сцены (Таймкод: ~11:00) */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "12px 24px",
          borderRadius: "16px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
        <button
          onClick={() => setCurrentAnim("typing")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            background: currentAnim === "typing" ? "#fff" : "#222",
            color: currentAnim === "typing" ? "#000" : "#fff",
            border: "none",
            fontWeight: "bold",
          }}>
          Typing
        </button>
        <button
          onClick={() => setCurrentAnim("standing")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            background: currentAnim === "standing" ? "#fff" : "#222",
            color: currentAnim === "standing" ? "#000" : "#fff",
            border: "none",
            fontWeight: "bold",
          }}>
          Standing
        </button>
        <button
          onClick={() => setCurrentAnim("falling")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            background: currentAnim === "falling" ? "#fff" : "#222",
            color: currentAnim === "falling" ? "#000" : "#fff",
            border: "none",
            fontWeight: "bold",
          }}>
          Falling
        </button>
      </div>

      <Canvas dpr={[1, 2]} camera={{ position: [0, 1, 3.5], fov: 45 }} shadows>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        {/* Передаем наш стейт в пропс компонента Аватара */}
        <Avatar position={[0, -1, 0]} animation={currentAnim} />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </main>
  );
}

export default App;
