"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { SHOP_CONFIG } from "@/lib/config";
import { MENU_ITEMS, formatPrice } from "@/lib/menu-data";

// ============================================
// NAVBAR COMPONENT
// ============================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#cerita", label: "Cerita Kami" },
    { href: "#menu", label: "Menu" },
    { href: "#lokasi", label: "Lokasi" },
    { href: "/menu?meja=01", label: "Pesan Sekarang" },
  ];

  return (
    <>
      <nav
        className={`navbar ${
          scrolled ? "navbar-solid" : "navbar-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className={`font-bold text-xl tracking-tight transition-colors duration-300 ${
                scrolled ? "text-charcoal-900" : "text-white"
              }`}
            >
              {SHOP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  scrolled ? "text-charcoal-700" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/menu?meja=01"
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                scrolled
                  ? "bg-coffee-700 text-white hover:bg-coffee-800 shadow-md"
                  : "bg-white text-charcoal-900 hover:bg-cream-100"
              }`}
            >
              Pesan Sekarang
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center transition-colors ${
              scrolled ? "text-charcoal-900" : "text-white"
            }`}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? `rotate-45 translate-y-2 ${
                      scrolled ? "bg-charcoal-900" : "bg-charcoal-900"
                    }`
                  : scrolled
                  ? "bg-charcoal-900"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0"
                  : scrolled
                  ? "bg-charcoal-900"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? `-rotate-45 -translate-y-2 ${
                      scrolled ? "bg-charcoal-900" : "bg-charcoal-900"
                    }`
                  : scrolled
                  ? "bg-charcoal-900"
                  : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu animate-fade-in">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-coffee-100"
            aria-label="Tutup menu"
          >
            <svg
              className="w-5 h-5 text-charcoal-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================
// SCROLL REVEAL HOOK
// ============================================

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero-section" id="hero">
      {/* Background Image */}
      <div className="hero-bg-image">
        <Image
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80"
          alt="Kopi Mletre Interior"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl pt-32 pb-20 md:pt-40 md:pb-32">
          {/* Badge */}
          <div
            className={`mb-8 transition-all duration-700 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <span className="hero-badge">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
              Buka Sekarang • {SHOP_CONFIG.operationalHours}
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-6 transition-all duration-1000 delay-200 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Ngopi Santai,
            <br />
            <span className="text-coffee-300">Rasa Istimewa</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-cream-300 text-lg md:text-xl max-w-lg leading-relaxed mb-10 transition-all duration-1000 delay-400 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Kedai kopi modern dengan cita rasa autentik nusantara. 
            Setiap cangkir diracik dengan cinta dari biji pilihan terbaik.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link href="/menu?meja=01" className="btn-primary">
              Lihat Menu
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a href="#cerita" className="btn-outline-light">
              Cerita Kami
            </a>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#marquee"
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

// ============================================
// MARQUEE BANNER
// ============================================

function MarqueeBanner() {
  const items = [
    "Es Kopi Susu",
    "★",
    "Americano",
    "★",
    "Cafe Latte",
    "★",
    "Matcha Latte",
    "★",
    "Cappuccino",
    "★",
    "Nasi Goreng",
    "★",
    "Roti Bakar",
    "★",
  ];

  return (
    <div className="marquee-container" id="marquee">
      <div className="marquee-content">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STORY / ABOUT SECTION
// ============================================

function StorySection() {
  const revealTitle = useScrollReveal();
  const revealImage = useScrollReveal();
  const revealContent = useScrollReveal();

  return (
    <section
      id="cerita"
      className="section-padding bg-warm-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div
          ref={revealTitle.ref}
          className={`text-center mb-16 reveal ${
            revealTitle.visible ? "visible" : ""
          }`}
        >
          <span className="section-subtitle">Cerita Kami</span>
          <h2 className="section-title mt-4">
            Tetangga yang
            <br />
            <span className="text-coffee-600 italic">Selalu Menemani</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <div
            ref={revealImage.ref}
            className={`reveal-left ${
              revealImage.visible ? "visible" : ""
            }`}
          >
            <div className="story-image-frame">
              <div className="relative aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80"
                  alt="Cerita Kopi Mletre"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div
            ref={revealContent.ref}
            className={`reveal-right ${
              revealContent.visible ? "visible" : ""
            }`}
          >
            <div className="space-y-6">
              <p className="text-lg text-charcoal-700 leading-relaxed">
                <span className="font-display text-3xl text-charcoal-900 leading-snug block mb-4">
                  Berawal dari kecintaan akan kopi dan keinginan menciptakan ruang yang hangat.
                </span>
                Kopi Mletre lahir dari semangat sederhana: menyajikan kopi berkualitas
                dengan harga terjangkau di lingkungan yang nyaman. Kami percaya, 
                secangkir kopi terbaik adalah yang dinikmati bersama tetangga.
              </p>

              <p className="text-charcoal-600 leading-relaxed">
                Setiap biji kopi kami seleksi langsung dari petani lokal di berbagai
                daerah di Nusantara — dari dataran tinggi Gayo, lereng Ijen, hingga 
                kebun-kebun di Toraja. Diracik oleh barista berpengalaman yang memahami
                karakter setiap biji.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-coffee-200">
                <div>
                  <p className="font-display text-3xl md:text-4xl text-coffee-700">
                    100%
                  </p>
                  <p className="text-sm text-charcoal-600 mt-1">Biji Lokal</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-coffee-700">
                    12+
                  </p>
                  <p className="text-sm text-charcoal-600 mt-1">Menu Pilihan</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-coffee-700">
                    ♥
                  </p>
                  <p className="text-sm text-charcoal-600 mt-1">
                    Dibuat dengan Cinta
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <a href="#menu" className="btn-outline">
                  Jelajahi Menu Kami
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MENU HIGHLIGHTS SECTION
// ============================================

function MenuHighlights() {
  const revealTitle = useScrollReveal();
  const popularItems = MENU_ITEMS.filter((item) => item.isPopular || item.isNew).slice(0, 4);

  const categoryEmoji: Record<string, string> = {
    kopi: "☕",
    "non-kopi": "🥤",
    makanan: "🍛",
    camilan: "🍿",
  };

  const unsplashImages: Record<string, string> = {
    "1": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80", // Es Kopi Susu
    "3": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80", // Cafe Latte
    "5": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80", // Matcha Latte
    "8": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80", // Kentang Goreng
    "10": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80", // Mi Goreng
    "12": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80", // Nasi Goreng
  };

  return (
    <section id="menu" className="section-padding bg-cream-50">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div
          ref={revealTitle.ref}
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 reveal ${
            revealTitle.visible ? "visible" : ""
          }`}
        >
          <div>
            <span className="section-subtitle">Menu Pilihan</span>
            <h2 className="section-title mt-4">
              Yang Paling
              <br />
              <span className="text-coffee-600 italic">Digemari</span>
            </h2>
          </div>
          <Link
            href="/menu?meja=01"
            className="btn-outline mt-6 md:mt-0 self-start md:self-auto"
          >
            Lihat Semua Menu
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {popularItems.map((item, index) => (
              <ProductCardReveal key={item.id} index={index}>
                <Link href="/menu?meja=01" className="block product-card group">
                  <div className="product-card-image">
                    {unsplashImages[item.id] ? (
                      <Image
                        src={unsplashImages[item.id]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-coffee-100 to-coffee-200 flex items-center justify-center">
                        <span className="text-xl font-bold text-coffee-700 opacity-60">
                          KM
                        </span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {item.isPopular && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Populer
                        </span>
                      )}
                      {item.isNew && (
                        <span className="bg-olive-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Baru
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-coffee-500 font-medium uppercase tracking-wider mb-1">
                      {item.category === "kopi"
                        ? "Coffee"
                        : item.category === "non-kopi"
                        ? "Non-Coffee"
                        : item.category === "makanan"
                        ? "Food"
                        : "Snack"}
                    </p>
                    <h3 className="font-semibold text-charcoal-900 mb-1 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-sm text-charcoal-600 line-clamp-2 mb-3 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="font-bold text-coffee-700">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              </ProductCardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// IMAGE GALLERY SECTION
// ============================================

function ImageGallery() {
  const reveal = useScrollReveal();

  const images = [
    {
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
      alt: "Suasana Kedai",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&q=80",
      alt: "Latte Art",
      span: "",
    },
    {
      src: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&q=80",
      alt: "Coffee Beans",
      span: "",
    },
    {
      src: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=80",
      alt: "Cozy Corner",
      span: "",
    },
    {
      src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80",
      alt: "Barista at Work",
      span: "",
    },
  ];

  return (
    <section className="section-padding bg-warm-50 overflow-hidden">
      <div
        ref={reveal.ref}
        className={`max-w-7xl mx-auto reveal ${
          reveal.visible ? "visible" : ""
        }`}
      >
        <div className="text-center mb-12">
          <span className="section-subtitle">Suasana</span>
          <h2 className="section-title mt-4">
            Ruang yang <span className="text-coffee-600 italic">Hangat</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`image-grid-item ${img.span} ${
                i === 0 ? "aspect-square" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// LOCATION SECTION
// ============================================

function LocationSection() {
  const revealTitle = useScrollReveal();
  const revealCard = useScrollReveal();

  return (
    <section id="lokasi" className="section-padding bg-cream-50">
      <div className="max-w-7xl mx-auto">
        <div
          ref={revealTitle.ref}
          className={`text-center mb-16 reveal ${
            revealTitle.visible ? "visible" : ""
          }`}
        >
          <span className="section-subtitle">Temukan Kami</span>
          <h2 className="section-title mt-4">
            Kunjungi <span className="text-coffee-600 italic">Kedai Kami</span>
          </h2>
        </div>

        <div
          ref={revealCard.ref}
          className={`max-w-2xl mx-auto reveal ${
            revealCard.visible ? "visible" : ""
          }`}
        >
          <div className="location-card text-center">
            {/* Map Placeholder */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
              <Image
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
                alt="Lokasi Kopi Mletre"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-charcoal-900/40 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-coffee-700 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-charcoal-900">
                        {SHOP_CONFIG.name}
                      </p>
                      <p className="text-sm text-charcoal-600">
                        {SHOP_CONFIG.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-coffee-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-coffee-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-charcoal-900 text-sm">
                  Jam Buka
                </p>
                <p className="text-charcoal-600 text-sm mt-1">
                  {SHOP_CONFIG.operationalHours}
                </p>
              </div>

              <div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-coffee-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-coffee-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-charcoal-900 text-sm">
                  Alamat
                </p>
                <p className="text-charcoal-600 text-sm mt-1">
                  {SHOP_CONFIG.address}
                </p>
              </div>

              <div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-coffee-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-coffee-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <p className="font-semibold text-charcoal-900 text-sm">
                  WhatsApp
                </p>
                <p className="text-charcoal-600 text-sm mt-1">
                  Pesan & Reservasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  const reveal = useScrollReveal();

  return (
    <section className="cta-section bg-charcoal-900 section-padding">
      <div
        ref={reveal.ref}
        className={`max-w-4xl mx-auto text-center relative z-10 reveal ${
          reveal.visible ? "visible" : ""
        }`}
      >
        <span className="text-coffee-400 text-sm font-semibold tracking-widest uppercase">
          Siap Memesan?
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-white mt-4 mb-6">
          Mari Ngopi
          <br />
          <span className="text-coffee-300 italic">Bersama Kami</span>
        </h2>
        <p className="text-cream-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Scan QR Code di meja Anda atau klik tombol di bawah untuk mulai
          memesan dari perangkat Anda.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/menu?meja=01" className="btn-primary text-base px-8 py-4">
            Pesan Sekarang
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <a
            href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light text-base px-8 py-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================

function ProductCardReveal({ children, index }: { children: React.ReactNode; index: number }) {
  const reveal = useScrollReveal();
  return (
    <div
      ref={reveal.ref}
      className={`reveal ${reveal.visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {children}
    </div>
  );
}

// ============================================
// FOOTER
// ============================================

function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-bold text-xl text-white tracking-tight">
                {SHOP_CONFIG.name}
              </span>
            </div>
            <p className="text-cream-400 text-sm leading-relaxed max-w-sm mb-6">
              {SHOP_CONFIG.description}. Tempat terbaik untuk menikmati kopi
              berkualitas dengan suasana yang nyaman dan hangat.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              {["Instagram", "TikTok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social}
                >
                  <span className="text-sm font-bold text-cream-300">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Menu
            </h4>
            <ul className="space-y-3">
              {["Kopi", "Non-Kopi", "Makanan", "Camilan"].map((item) => (
                <li key={item}>
                  <Link
                    href="/menu?meja=01"
                    className="text-cream-400 text-sm hover:text-coffee-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-3 text-sm text-cream-400">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-0.5 text-coffee-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {SHOP_CONFIG.address}
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-0.5 text-coffee-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {SHOP_CONFIG.operationalHours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t footer-divider mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-500 text-xs">
            © {year} {SHOP_CONFIG.name}. Semua hak
            dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-cream-500 text-xs hover:text-cream-300 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <StorySection />
      <MenuHighlights />
      <ImageGallery />
      <LocationSection />
      <CTASection />
      <Footer />
    </>
  );
}
