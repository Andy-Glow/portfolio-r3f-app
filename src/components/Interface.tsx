import React from "react";
import { motion as framerMotion } from "framer-motion";
import "../styles/interface.scss";

import { Info } from "./sections/Info";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { Contacts } from "./sections/Contacts";

const motion = framerMotion as any;

interface SectionProps {
  children: React.ReactNode;
}

function Section({ children }: SectionProps) {
  return (
    <div className='section-container'>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='text-block'>
        {children}
      </motion.div>
    </div>
  );
}

export function Interface() {
  return (
    <div className='interface-wrapper'>
      <Section>
        <Info />
      </Section>
      <Section>
        <Skills />
      </Section>
      <Section>
        <Projects />
      </Section>
      <Section>
        <Contacts />
      </Section>
    </div>
  );
}
