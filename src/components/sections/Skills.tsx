import React from "react";
import { motion as framerMotion } from "framer-motion";
const motion = framerMotion as any;

export function Skills() {
  return (
    <>
      <h2 className='section-title'>МОИ НАВЫКИ</h2>
      <div className='skills-list'>
        <div className='skill-item'>
          <p className='skill-name'>React / R3F</p>
          <div className='skill-bar-bg'>
            <motion.div
              className='skill-bar-fill'
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
        <div className='skill-item'>
          <p className='skill-name'>TypeScript</p>
          <div className='skill-bar-bg'>
            <motion.div
              className='skill-bar-fill'
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
