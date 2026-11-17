"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./eco-landing.css";

function RecycleIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  );
}

export function EcoRewardLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("eco-menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("eco-menu-open");
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`eco-landing${menuOpen ? " menu-open" : ""}`}>
      {menuOpen ? <div className="nav-overlay" onClick={closeMenu} aria-hidden="true" /> : null}

      <nav className="eco-nav" aria-label="EcoReward">
        <Link href="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">
            <RecycleIcon className="icon-green" />
          </div>
          EcoReward
        </Link>

        <ul className={`nav-links${menuOpen ? " active" : ""}`}>
          <li>
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <a href="#features" onClick={closeMenu}>
              About
            </a>
          </li>
          <li>
            <a href="#rewards" onClick={closeMenu}>
              Rewards
            </a>
          </li>
          <li>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
          </li>
          <li className="mobile-auth">
            <Link href="/admin/login" className="btn btn-login w-full" onClick={closeMenu}>
              Sign In
            </Link>
            <Link href="/admin/login" className="btn btn-register w-full" onClick={closeMenu}>
              Register
            </Link>
          </li>
        </ul>

        <div className="auth-buttons">
          <Link href="/admin/login" className="btn btn-login">
            Sign In
          </Link>
          <Link href="/admin/login" className="btn btn-register">
            Register
          </Link>
        </div>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          )}
        </button>
      </nav>

      <main className="eco-main">
        <section className="hero">
          <div className="hero-copy">
            <h1>
              Turn Your <span className="accent">Waste</span>
              <br />
              Into <span className="accent">Rewards!</span>
            </h1>
            <p className="hero-sub">Recycle &amp; Earn Points for Great Rewards</p>
            <div className="hero-actions">
              <Link href="/admin/login" className="cta-primary">
                Join Now
              </Link>
              <a href="#features" className="cta-secondary">
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-media">
            <Image
              src="https://img.freepik.com/free-vector/recycling-concept-illustration_114360-9851.jpg"
              alt="Recycling illustration"
              width={448}
              height={448}
              priority
              unoptimized
            />
          </div>
        </section>

        <div className="feature-strip" id="features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </div>
            <div>
              <h3>Recycle Your Waste</h3>
              <p>Dispose of recyclables and earn points.</p>
            </div>
          </div>
          <div className="feature-item feature-mid">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                <circle cx="12" cy="8" r="6" />
              </svg>
            </div>
            <div>
              <h3>Earn Points</h3>
              <p>Get points for every item you recycle.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
              </svg>
            </div>
            <div>
              <h3>Get Rewards</h3>
              <p>Exchange points for exciting rewards.</p>
            </div>
          </div>
        </div>

        <section className="rewards-section" id="rewards">
          <div className="section-head">
            <h2>Your Rewards Await!</h2>
            <p>Redeem your points for amazing rewards.</p>
          </div>

          <div className="rewards-grid">
            <div className="reward-card">
              <div className="reward-preview reward-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h4>Gift Cards</h4>
              <p>Shop with popular gift cards.</p>
            </div>
            <div className="reward-card">
              <div className="reward-preview reward-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
              <h4>Eco Gadgets</h4>
              <p>Sustainable products &amp; gadgets.</p>
            </div>
            <div className="reward-card">
              <div className="reward-preview reward-red">
                <span className="discount-badge">20% OFF</span>
              </div>
              <h4>Discount Vouchers</h4>
              <p>Save on dining, shopping &amp; more.</p>
            </div>
          </div>
        </section>

        <div className="cta-panels" id="contact">
          <div className="panel panel-green">
            <div>
              <h3>Track Your Progress</h3>
              <p>View your recycling stats and points.</p>
              <Link href="/admin/login" className="panel-btn panel-btn-green">
                My Dashboard
              </Link>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="panel-decor panel-decor-green">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <div className="panel panel-slate">
            <div>
              <h3>Eco Tips &amp; News</h3>
              <p>Learn how to live greener.</p>
              <button type="button" className="panel-btn panel-btn-slate" onClick={() => setShowTips(true)}>
                Read Tips
              </button>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="panel-decor panel-decor-slate">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.25 12 13 13 12" />
            </svg>
          </div>
        </div>
      </main>

      <footer className="eco-footer">
        <div className="footer-inner">
          <div className="footer-item">
            <RecycleIcon size={16} className="icon-green" />
            Reduce Waste
          </div>
          <div className="footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-green">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
            Earn Points
          </div>
          <div className="footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-green">
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
            Get Rewards
          </div>
        </div>
      </footer>

      {showTips ? (
        <div
          className="modal-backdrop"
          onClick={() => setShowTips(false)}
          role="presentation"
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eco-tips-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-green">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.25 12 13 13 12" />
                </svg>
              </div>
              <h2 id="eco-tips-title">Eco Tips</h2>
              <p>Simple ways to help the planet</p>
            </div>
            <div className="tips-list">
              <div className="tip">
                <h4>Proper Sorting</h4>
                <p>Always rinse your plastic bottles before recycling to prevent contamination.</p>
              </div>
              <div className="tip">
                <h4>Reduce &amp; Reuse</h4>
                <p>Switch to reusable bags and containers to minimize the amount of waste generated.</p>
              </div>
              <div className="tip">
                <h4>Energy Saving</h4>
                <p>Unplug electronics when not in use to reduce phantom energy consumption.</p>
              </div>
            </div>
            <button type="button" className="cta-primary modal-confirm" onClick={() => setShowTips(false)}>
              Got it!
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
