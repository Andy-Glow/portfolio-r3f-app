import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
}

function Section({ children }: SectionProps) {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: "absolute",
          top: "12vh", // Отступ от верхнего края
          left: "10%", // Отступ слева
          maxWidth: "40vw", // Ограничиваем ширину, чтобы не налезало на аватара
        }}>
        {children}
      </motion.div>
    </div>
  );
}

export function Interface() {
  return (
    <div style={{ width: "100%", color: "#fff" }}>
      <Section>
        <motion.h1 style={{ fontSize: "3.5rem", margin: "0 0 10px 0", fontWeight: "bold" }}>
          ПРИВЕТ, Я РАЗРАБОТЧИК
        </motion.h1>
        <p style={{ color: "#aaa", fontSize: "1.2rem", margin: 0 }}>
          Создаю интерактивные 3D веб-приложения на React и Three.js.
        </p>
      </Section>

      <Section>
        <h2 style={{ fontSize: "2.5rem", margin: "0 0 20px 0" }}>МОИ НАВЫКИ</h2>
        <div style={{ width: "100%", maxWidth: "300px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>React / TypeScript / R3F</p>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              height: "10px",
              borderRadius: "5px",
              overflow: "hidden",
            }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ background: "#3b82f6", height: "100%", width: "90%", originX: 0 }}
            />
          </div>
        </div>
      </Section>

      <Section>
        <h2 style={{ fontSize: "2.5rem", margin: "0 0 10px 0" }}>МОИ ПРОЕКТЫ</h2>
        <p style={{ color: "#aaa" }}>
          Интерактивная выставка кейсов будет добавлена в следующем уроке.
        </p>
      </Section>

      <Section>
        <h2 style={{ fontSize: "2.5rem", margin: "0 0 10px 0" }}>КОНТАКТЫ</h2>
        <p style={{ color: "#aaa" }}>Вы сможете отправить мне сообщение прямо отсюда.</p>
      </Section>
    </div>
  );
}
