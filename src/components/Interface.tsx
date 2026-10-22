import React from "react";
import { motion } from "motion/react";
import styles from "./Interface.module.scss";

import { Info } from "./sections/Info";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { Contacts } from "./sections/Contacts";

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={styles.sectionContainer}>
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.2 }}
        className={`${styles.textBlock} ${className || ""}`}>
        {children}
      </motion.div>
    </div>
  );
}

export function Interface() {
  return (
    <div className={styles.wrapper}>
      <Section className={styles.mobileBottom}>
        <Info />
      </Section>
      <Section className={styles.mobileTop}>
        <Skills />
      </Section>
      <Section className={styles.mobileTop}>
        <Projects />
      </Section>
      <Section className={styles.mobileTop}>
        <Contacts />
      </Section>
    </div>
  );
}
