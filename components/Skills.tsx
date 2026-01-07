"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Skills = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: "편집 소프트웨어",
      skills: [
        { name: "Adobe Premiere Pro", level: 95 },
        { name: "Adobe After Effects", level: 90 },
        { name: "Final Cut Pro", level: 85 },
        { name: "DaVinci Resolve", level: 80 },
      ],
    },
    {
      title: "3D & 모션",
      skills: [
        { name: "Cinema 4D", level: 85 },
        { name: "Blender", level: 80 },
        { name: "Maya", level: 70 },
        { name: "Houdini", level: 65 },
      ],
    },
  ];

  return (
    <section id="skills" className="skills" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">기술</h2>
          <p className="section-subtitle">사용 가능한 도구와 기술</p>
        </motion.div>

        <div className="skills-content">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="skill-category"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            >
              <h3 className="category-title">{category.title}</h3>
              <div className="skill-list">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0, x: -30 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    }}
                  >
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-progress"
                        initial={{ width: 0 }}
                        animate={
                          isInView ? { width: `${skill.level}%` } : { width: 0 }
                        }
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.3,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

