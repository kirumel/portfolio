"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  tags: string[];
}

const About = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [previewProjects, setPreviewProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 포트폴리오 미리보기 로드
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const projects: Project[] = await response.json();
          setPreviewProjects(projects.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const socialLinks = [
    {
      name: "YouTube",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      href: "#",
    },
    {
      name: "Twitter",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      href: "#",
    },
    {
      name: "Discord",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      href: "#",
    },
  ];

  const skillCategories = [
    {
      title: "mv",
      skills: [
        { name: "Adobe After Effects" },
        { name: "blender" },
        { name: "c4d" },
        { name: "unreal" },
        { name: "unity" },
      ],
    },
    {
      title: "frontend",
      skills: [
        { name: "HTML" },
        { name: "CSS" },
        { name: "Typescript" },
        { name: "React" },
        { name: "Next.js" },
      ],
    },
    {
      title: "backend",
      skills: [
        { name: "nodejs" },
        { name: "express" },
        { name: "python" },
        { name: "java" },
        { name: "mongodb" },
        { name: "supabase" },
      ],
    },
  ];

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <div className="about-main">
          <motion.div
            className="about-info"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="about-profile">
              <div className="profile-header">
                <div className="profile-image-wrapper">
                  <Image
                    src="/profile.jpg"
                    alt="프로필 사진"
                    width={60}
                    height={60}
                    className="profile-image"
                  />
                </div>
                <div>
                  <h3>kirumel</h3>
                  <p>@kirumel</p>
                </div>
              </div>
              <div className="profile-description">
                <p>
                  안녕하세요 모션그래픽 디자이너 & 개발자 키루멜입니다! <br />
                  こんにちは、モーショングラフィックデザイナー兼デベロッパーのキルメルです！
                  <br />
                  hello! i&apos;m kirumel, a motion graphic designer &
                  developer!
                  <br />
                  <br />
                  영상과 코딩으로 상상을 현실로 구현하고 있습니다 <br />
                  映像とコーディングで、想像を現実にしています
                  <br />
                  i&apos;m implementing my ideas into reality through video and
                  coding
                  <br />
                </p>
              </div>
            </div>

            <div className="social-links-about">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="social-link-about"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="about-video-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <iframe
              src="https://www.youtube.com/embed/4X0_VwKBu6M?si=1h65M1zEx_VbDahz"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>

        {/* 기술 스택 - 간결하게 */}
        <motion.div
          className="about-skills-compact"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {skillCategories.map((category, categoryIndex) => (
            <div key={category.title} className="skill-category-compact">
              <h4 className="skill-category-title-compact">{category.title}</h4>
              <div className="skill-tags">
                {category.skills.map((skill) => (
                  <span key={skill.name} className="skill-tag">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 포트폴리오 미리보기 */}
        <motion.div
          className="portfolio-preview"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="portfolio-preview-header">
            <h3 className="portfolio-preview-title">MV WORKS</h3>
            <Link href="/portfolio" className="portfolio-preview-link">
              전체 보기 →
            </Link>
          </div>
          <div className="portfolio-preview-grid">
            {previewProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="portfolio-preview-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href="/portfolio">
                  <div className="portfolio-preview-image">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="portfolio-preview-info">
                    <span className="portfolio-preview-category">
                      {project.category}
                    </span>
                    <h4>{project.title}</h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
