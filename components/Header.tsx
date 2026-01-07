"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolledToAbout, setIsScrolledToAbout] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.querySelector("#about");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        // About 섹션이 화면 상단에 도달했는지 확인
        setIsScrolledToAbout(rect.top <= 100);
      }
    };

    // 포트폴리오 페이지인 경우 항상 검은색 텍스트
    if (pathname === "/portfolio") {
      setIsScrolledToAbout(true);
    } else {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // 초기 체크
    }

    return () => {
      if (pathname !== "/portfolio") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [pathname]);

  // 메뉴가 열렸을 때 body 스크롤 막기
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const menuItems = [
    { name: "홈", href: "/" },
    { name: "소개", href: "/#about" },
    { name: "포트폴리오", href: "/portfolio" },
  ];

  return (
    <motion.header
      className={`header ${isScrolledToAbout ? "dark-text" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-text">kirumel</span>
          </Link>

          {isMenuOpen && (
            <div
              className="menu-overlay"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 토글"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
