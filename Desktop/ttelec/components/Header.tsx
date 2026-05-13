"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header id="header" className={scrolled ? "scrolled" : ""}>
      <div className="container">
        <nav className="nav-inner">
          <a href="#hero" className="nav-logo">
            <div className="logo-mark">⚡</div>
            <div className="logo-text">
              TT<span>ELEC</span>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#realisations">Réalisations</a></li>
            <li><a href="#pourquoi">À propos</a></li>
            <li><a href="#zone">Zone d&apos;intervention</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div className="nav-cta">
            <div className="nav-phone">
              <div className="nav-phone-dot" />
              0465 90 43 72
            </div>
            <a
              href="#contact"
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: "13px" }}
            >
              Devis gratuit
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
