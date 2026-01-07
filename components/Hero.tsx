"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";

// 상수 정의
const SCROLL_THRESHOLD = 0.1; // Hero 섹션의 10% 이상 스크롤 시 About으로 이동
const ROLE_ANIMATION_DELAY = 2500; // 역할 애니메이션 시작 딜레이 (ms)
const ROLE_SWITCH_INTERVAL = 2500; // 역할 전환 간격 (ms)

const Hero = () => {
  const greetingRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const isScrollingToAbout = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".greeting-line-1", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".greeting-line-2",
          {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".greeting-line-3",
          {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        );

      // 롤링 애니메이션
      const roles = ["모션그래픽 디자이너", "개발자"];
      let currentIndex = 0;
      const nameElement = greetingRef.current?.querySelector(
        ".greeting-name"
      ) as HTMLElement | null;
      const line2Element = greetingRef.current?.querySelector(
        ".greeting-line-2"
      ) as HTMLElement | null;
      const line3Element = greetingRef.current?.querySelector(
        ".greeting-line-3"
      ) as HTMLElement | null;

      // 요소들이 모두 존재하는지 확인
      if (
        !roleRef.current ||
        !nameRef.current ||
        !nameElement ||
        !line2Element ||
        !line3Element
      ) {
        return;
      }

      const animateRole = () => {
        // ref가 존재하고 DOM에 연결되어 있는지 확인
        if (
          !roleRef.current ||
          !nameRef.current ||
          !roleRef.current.isConnected ||
          !nameRef.current.isConnected
        ) {
          return;
        }

        // 유효한 요소만 배열에 포함
        const targets = [roleRef.current, nameRef.current].filter(Boolean);
        if (targets.length === 0) {
          return;
        }

        // 역할 텍스트와 이름 텍스트를 동시에 위로 올리며 페이드 아웃
        gsap.to(targets, {
          y: -30,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // onComplete 내부에서도 ref 확인
            if (
              !roleRef.current ||
              !nameRef.current ||
              !roleRef.current.isConnected ||
              !nameRef.current.isConnected
            ) {
              return;
            }

            currentIndex = (currentIndex + 1) % roles.length;
            roleRef.current.textContent = roles[currentIndex];

            // 개발자일 때는 이름을 line2로 옮기고 중앙 정렬
            if (roles[currentIndex] === "개발자") {
              if (nameElement && nameElement.parentElement === line3Element) {
                line3Element.removeChild(nameElement);
                line2Element.appendChild(nameElement);
                line3Element.style.display = "none";
              }
              line2Element.classList.add("developer-layout");
            } else {
              // 모션그래픽 디자이너일 때는 이름을 line3로 옮기고 세로 배치
              if (nameElement && nameElement.parentElement === line2Element) {
                line2Element.removeChild(nameElement);
                line3Element.appendChild(nameElement);
                line3Element.style.display = "block";
              }
              line2Element.classList.remove("developer-layout");
            }

            // 역할 텍스트가 먼저 아래에서 위로 올라오며 페이드 인
            if (roleRef.current && roleRef.current.isConnected) {
              gsap.fromTo(
                roleRef.current,
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.3,
                  ease: "power2.out",
                }
              );
            }
            // 이름 텍스트는 딜레이 후에 아래에서 위로 올라오며 페이드 인
            if (nameRef.current && nameRef.current.isConnected) {
              gsap.fromTo(
                nameRef.current,
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.3,
                  ease: "power2.out",
                  delay: 0.15,
                  onComplete: () => {
                    setTimeout(animateRole, ROLE_SWITCH_INTERVAL);
                  },
                }
              );
            }
          },
        });
      };

      setTimeout(() => {
        // setTimeout 내부에서도 ref와 DOM 연결 상태 확인
        if (
          roleRef.current &&
          nameRef.current &&
          roleRef.current.isConnected &&
          nameRef.current.isConnected
        ) {
          animateRole();
        }
      }, ROLE_ANIMATION_DELAY);
    }, greetingRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = useCallback(() => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const heroSection = heroSectionRef.current;
          if (!heroSection) {
            ticking = false;
            return;
          }

          const heroRect = heroSection.getBoundingClientRect();
          const heroTop = heroRect.top + window.scrollY;
          const heroHeight = heroSection.offsetHeight;
          const scrollY = window.scrollY || window.pageYOffset;

          // 스크롤 방향 감지 (아래로 스크롤: true, 위로 스크롤: false)
          const isScrollingDown = scrollY > lastScrollY.current;
          lastScrollY.current = scrollY;

          // Hero 섹션 범위 안에 있는지 확인
          const isInHeroSection =
            scrollY >= heroTop && scrollY < heroTop + heroHeight;

          // Hero 섹션을 벗어나면 플래그 리셋
          if (!isInHeroSection) {
            isScrollingToAbout.current = false;
            ticking = false;
            return;
          }

          // 아래로 스크롤할 때만 Hero 섹션 안에서 일정 이상 스크롤하면 About으로 자동 스크롤
          const scrollInHero = scrollY - heroTop;
          const threshold = heroHeight * SCROLL_THRESHOLD;

          if (
            isScrollingDown &&
            scrollInHero > threshold &&
            !isScrollingToAbout.current
          ) {
            isScrollingToAbout.current = true;
            scrollToAbout();
          } else if (!isScrollingDown && scrollInHero <= threshold) {
            // 위로 스크롤해서 임계값 이하로 돌아오면 플래그 리셋
            isScrollingToAbout.current = false;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    lastScrollY.current = window.scrollY || window.pageYOffset;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollToAbout]);

  return (
    <section id="home" className="hero" ref={heroSectionRef}>
      <div className="container">
        <div className="hero-video-container">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/background.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
        </div>
        <div className="hero-content" ref={greetingRef}>
          <div className="greeting-animation">
            <div className="greeting-line-1">안녕하세요</div>
            <div className="greeting-line-2">
              <span ref={roleRef}>모션그래픽 디자이너</span>
            </div>
            <div className="greeting-line-3">
              <span ref={nameRef} className="greeting-name">
                루멜입니다
              </span>
            </div>
          </div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.button
              className="btn btn-primary"
              onClick={scrollToAbout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              소개 보기
            </motion.button>
            <Link href="/portfolio">
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                포트폴리오 보기
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
