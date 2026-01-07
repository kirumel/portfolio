"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Footer = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const isPortfolioPage = pathname === "/portfolio";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="footer-logo"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {isPortfolioPage && !isLoggedIn ? (
                <a href="/api/auth/signin" className="logo-text login-in-logo">
                  kirumel
                </a>
              ) : (
                <span className="logo-text">kirumel</span>
              )}
            </motion.div>
            <p>&copy; 2025 kirumel All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

