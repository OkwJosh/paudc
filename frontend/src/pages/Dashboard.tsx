import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Building,
  Trophy,
  Mic,
  Lightbulb,
  Globe,
  GraduationCap,
  MessageSquare,
  Palette,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import paudcLogo from "../assets/paudc-logo.png";
import debaters from "../assets/debaters.jpg";
import continent from "../assets/continent.jpg";
import heroThree from "../assets/hero-three.jpg";
import heroFour from "../assets/hero-four.jpg";
import LOGO_URL from "../assets/paudc.png";
import vunalogo from "../assets/vunalogo.jpg";
import vuef from "../assets/vuef.jpg";
import kakaki from "../assets/kakaki.png";

/* ─── simple SVG trophy illustration ─── */
function TrophyIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M28 35C12 35 6 50 10 65C14 78 25 80 30 75" stroke="#A4372C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M92 35C108 35 114 50 110 65C106 78 95 80 90 75" stroke="#A4372C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M30 20H90V60C90 85 75 100 60 100C45 100 30 85 30 60V20Z" fill="#A4372C" />
      <rect x="25" y="15" width="70" height="10" rx="3" fill="#C45A4C" />
      <path d="M45 30V55C45 65 50 72 55 75" stroke="#D4817A" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <rect x="52" y="100" width="16" height="15" rx="2" fill="#A4372C" />
      <rect x="38" y="115" width="44" height="8" rx="4" fill="#A4372C" />
      <ellipse cx="60" cy="128" rx="30" ry="4" fill="#A4372C" opacity="0.15" />
    </svg>
  );
}

/* ─── Animated Number Helper (Scroll-Triggered) ─── */
function AnimatedNumber({ end, prefix = "", suffix = "", duration = 2000 }: {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const numberRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (numberRef.current) observer.observe(numberRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={numberRef}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const heroImages = [debaters, continent, heroThree, heroFour];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const targetDate = new Date("December 5, 2026 00:00:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Schedule", path: "/schedule" },
    { name: "Civic Panel", path: "/speakers" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  const countdownItems = [
    { label: "D", value: timeLeft.days },
    { label: "H", value: timeLeft.hours },
    { label: "M", value: timeLeft.minutes },
    { label: "S", value: timeLeft.seconds },
  ];

  return (
    <div className="bg-[#f6f0e1] w-full min-h-screen relative overflow-x-hidden text-[#022512]">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 w-full bg-[#F6F0E1]/90 backdrop-blur-md border-b border-[#022512]/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-3 shrink-0">
              <img src={LOGO_URL} alt="PAUDC Logo" className="h-10 md:h-16 w-auto object-contain" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm text-[#022512] font-semibold transition-colors hover:text-[#1B5E3B]"
                >
                  {item.name}
                </Link>
              ))}
              <a href="/login">
                <Button className="bg-[#F6F0E1] border-[0.5px] border-[#022512] text-[#022512] hover:bg-[#022512] hover:text-[#F6F0E1] transition-colors duration-300 font-bold shadow-sm rounded-xl px-6">
                  LMS Portal
                </Button>
              </a>
              <a href="/register">
                <Button className="bg-[#C8A046] hover:bg-[#b08c3e] text-[#022512] font-bold shadow-sm rounded-xl px-6">
                  Request an Invite
                </Button>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[#022512]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#F6F0E1] border-b border-[#022512]/10 px-4 pt-2 pb-6 flex flex-col space-y-3 shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-base font-bold py-2 border-b border-black/5"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-3">
              <Button variant="outline" className="w-full border-[#022512] rounded-xl">LMS Portal</Button>
              <Button className="w-full bg-[#C8A046] text-[#022512] rounded-xl">Request an Invite</Button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Shared background */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={image}
                alt={`Hero background ${index + 1}`}
                className="w-full h-full object-cover scale-105"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-[#022512]/50" />
          {/* Mobile gradient: heavier at bottom for CTA legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#022512]/20 to-[#022512]/80 md:to-[#f6f0e1]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
        </div>

        {/* ══ MOBILE HERO ══ */}
        <div className="relative z-10 flex flex-col min-h-[100svh] pt-16 md:hidden">

          {/* Top: badge, logo, tagline, meta */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5 pt-6 pb-2 text-center">

            {/* Badge */}
            <div className="bg-white/15 backdrop-blur-md rounded-full border border-white/25 px-4 py-1.5">
              <span className="text-white text-[10px] tracking-widest font-bold uppercase">
                Pan-African University Debating Championship
              </span>
            </div>

            {/* Logo */}
            <img
              src={paudcLogo}
              alt="PAUDC 2026"
              className="h-24 w-auto object-contain drop-shadow-2xl"
            />

            {/* Tagline */}
            <p className="text-lg text-[#F6F0E1] italic font-serif leading-snug">
              <span className="font-thin">The Sound of </span>
              <span className="font-bold text-[#C8A046]">Africa's Resolve</span>
            </p>

            {/* Date + Location row */}
            <div className="flex items-center justify-center gap-5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C8A046] shrink-0" />
                <span className="text-[11px] text-white font-semibold uppercase tracking-wider whitespace-nowrap">
                  Dec 5–12, 2026
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C8A046] shrink-0" />
                <span className="text-[11px] text-white font-semibold uppercase tracking-wider whitespace-nowrap">
                  Abuja, Nigeria
                </span>
              </div>
            </div>
          </div>

          {/* Bottom: countdown, dots, CTAs */}
          <div className="flex flex-col items-center gap-5 px-5 pb-12">

            {/* Countdown */}
            <div className="flex items-end justify-center gap-3">
              {countdownItems.map((t, i) => (
                <div key={i} className="flex items-end gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl font-black text-white leading-none tracking-tighter">
                      {String(t.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 mt-1">
                      {t.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <span className="text-3xl font-thin text-white/30 mb-5 leading-none">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* Slider dots */}
            <div className="flex items-center justify-center gap-2">
              {heroImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-500 ${index === currentImage ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 w-full max-w-xs">
              <Link to="/register" className="flex-1">
                <button className="w-full h-12 bg-white/15 backdrop-blur-md border border-white/25 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  Request Invite
                </button>
              </Link>
              <Link to="/about" className="flex-1">
                <button className="w-full h-12 bg-[#C8A046] text-[#022512] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Explore Vision
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ══ DESKTOP HERO ══ */}
        <div className="relative z-10 hidden md:flex items-center justify-center min-h-screen pt-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col items-center text-center gap-8">

              {/* Badge */}
              <div className="mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-full border border-white/20 h-10 px-6 flex items-center justify-center shadow-lg">
                  <span className="text-white/90 text-sm tracking-wider font-medium">
                    Pan-African University Debating Championship
                  </span>
                </div>
              </div>

              {/* Logo */}
              <h1 className="flex justify-center">
                <img src={paudcLogo} alt="PAUDC 2026" className="h-32 lg:h-40 w-auto object-contain" />
              </h1>

              {/* Tagline */}
              <p
                className="text-2xl md:text-3xl text-[#F6F0E1] text-center italic drop-shadow-sm"
                style={{ fontFamily: "'Gobold Lowplus', sans-serif" }}
              >
                <span className="font-thin">The Sound of </span>
                <span className="font-bold text-[#A4372C]">Africa&apos;s Resolve</span>
              </p>

              {/* Event details */}
              <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-5 shadow-2xl">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 md:w-7 md:h-7 text-[#C8A046]" />
                    <span className="text-base md:text-lg text-white/90">December 5–12, 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 md:w-7 md:h-7 text-[#C8A046]" />
                    <span className="text-base md:text-lg text-white/90">Abuja, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 md:w-7 md:h-7 text-[#C8A046]" />
                    <span className="text-base md:text-lg text-white/90">Hosted by Veritas University</span>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl divide-x divide-white/20 overflow-hidden">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds },
                ].map((t, i) => (
                  <div key={i} className="flex-1 px-2 py-4 md:py-5 text-center">
                    <div className="text-2xl md:text-4xl font-extrabold text-white mb-1">
                      {String(t.value).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/70">
                      {t.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link to="/register">
                  <button className="bg-[#C8A046] hover:bg-[#b08c3e] text-[#022512] rounded-full px-10 h-14 text-lg font-bold shadow-xl transition-colors">
                    Request an invite
                  </button>
                </Link>
                <Link to="/about">
                  <button className="bg-white/10 backdrop-blur-md border border-white/25 text-white hover:bg-white/20 rounded-full px-10 h-14 text-lg font-bold shadow-xl transition-colors">
                    Explore Vision
                  </button>
                </Link>
              </div>

              {/* Slider dots */}
              <div className="flex items-center justify-center gap-2">
                {heroImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-500 ${index === currentImage ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>

              {/* Animated stats strip */}
              <div className="w-full max-w-4xl bg-[#022512]/75 backdrop-blur-xl border border-white/20 rounded-3xl py-6 md:py-8 px-6 md:px-10 shadow-2xl flex flex-wrap justify-around items-center text-center gap-6 mt-4 mb-24 relative z-10">
                <div>
                  <div className="text-3xl md:text-5xl font-extrabold text-white mb-1">
                    <AnimatedNumber end={1000} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest font-semibold">Delegates Expected</div>
                </div>
                <div>
                  <div className="text-3xl md:text-5xl font-extrabold text-white mb-1">
                    <AnimatedNumber end={50} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest font-semibold">Africa Nations</div>
                </div>
                <div>
                  <div className="text-3xl md:text-5xl font-extrabold text-[#C8A046] mb-1">
                    <AnimatedNumber end={9} suffix=" Days+" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[#C8A046]/80 uppercase tracking-widest font-semibold">Of Excellence</div>
                </div>
                <div>
                  <div className="text-3xl md:text-5xl font-extrabold text-[#C8A046] mb-1">
                    <AnimatedNumber prefix="$" end={20} suffix="k" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[#C8A046]/80 uppercase tracking-widest font-semibold">Prize Money</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fade into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#f6f0e1] via-[#f6f0e1]/80 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:pb-24 text-center">
        <TrophyIllustration className="w-24 h-28 mx-auto mb-6" />
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[#022512]">
          Compete for Glory &amp; Global Recognition
        </h2>
        <p className="text-base md:text-lg text-[#022512]/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          PAUDC 2026 offers not just prestige,
          <br className="hidden md:inline" />
          but life-changing opportunities for Africa&apos;s brightest minds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#C8A046] text-[#022512] rounded-3xl p-10 flex flex-col justify-center items-center shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-3xl font-extrabold mb-2">$20,000 USD</h3>
            <p className="text-sm font-semibold opacity-90 mb-6 uppercase tracking-wider">Total Prize Money</p>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs font-medium">
              Substantial cash prizes distributed among top-performing teams, recognizing excellence in debate and argumentation.
            </p>
          </div>
          <div className="bg-[#1B5E3B] text-[#f6f0e1] rounded-3xl p-10 flex flex-col justify-center items-center shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <Globe className="w-12 h-12 mb-4 opacity-80" />
            <h3 className="text-3xl font-extrabold mb-2">WUDC Sponsorship</h3>
            <p className="text-sm font-semibold opacity-90 mb-6 uppercase tracking-wider">Full Tournament Package</p>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
              Winning team and top judge receive complete sponsorship to represent Africa at the World Universities Debating Championship.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTINENTAL HOMECOMING ─── */}
      <section className="relative z-10 bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-[#022512]">
              A Continental Homecoming of Thought
            </h2>
            <p className="text-lg text-[#022512]/80 mb-6 leading-relaxed">
              PAUDC 2026 is more than a tournament, it is a continental homecoming of thought. It represents a revival of Africa&apos;s intellectual identity, where youth gather not only to debate but to define the moral and civic fabric of the continent.
            </p>
            <p className="text-lg text-[#022512]/80 mb-8 leading-relaxed">
              At its heart, <span className="font-bold text-[#A4372C]">The Republic of Reason</span> captures the idea of an Africa governed by intellect rather than impulse — a place where dialogue shapes destiny.
            </p>
            <Link to="/about">
              <button className="px-8 py-3 bg-[#1B5E3B] text-[#F6F0E1] rounded-full font-bold hover:bg-[#A4372C] transition-colors shadow-lg">
                Discover Our Vision
              </button>
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <img src={continent} alt="Students gathering" className="rounded-3xl shadow-2xl w-full object-cover h-[400px]" />
          </div>
        </div>
      </section>

      {/* ─── EVENT PILLARS ─── */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#022512]">Event Pillars</h2>
        <p className="text-lg text-[#022512]/70 mb-16">
          Ten days of intellectual excellence, cultural celebration, and Pan-African unity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: <Trophy className="w-7 h-7 text-[#A4372C]" />, bg: "bg-[#A4372C]/10", title: "Debate Championship", desc: "Ten days of British Parliamentary debate rounds testing reasoning, persuasion, and teamwork." },
            { icon: <MessageSquare className="w-7 h-7 text-[#C8A046]" />, bg: "bg-[#C8A046]/10", title: "Public Speaking", desc: "Celebrating clarity, persuasion, and thought leadership through speech." },
            { icon: <GraduationCap className="w-7 h-7 text-[#1B5E3B]" />, bg: "bg-[#1B5E3B]/10", title: "Adjudicators Academy", desc: "Training and certification program for over 200 judges." },
            { icon: <Mic className="w-7 h-7 text-[#A4372C]" />, bg: "bg-[#A4372C]/10", title: "Civic Panels", desc: "Voices of a Continent – Rethinking Pan-Africanism for a New Generation." },
            { icon: <Lightbulb className="w-7 h-7 text-[#1B5E3B]" />, bg: "bg-[#1B5E3B]/10", title: "The Legacy Lab", desc: "Youth-led innovation space transforming debate insights into actionable initiatives." },
            { icon: <Palette className="w-7 h-7 text-[#C8A046]" />, bg: "bg-[#C8A046]/10", title: "Cultural Exhibition", desc: "Celebrating Africa's artistic diversity and shared identity as One Africa." },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-[#022512]/5 hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#022512]">{item.title}</h3>
              <p className="text-[#022512]/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE KAKAKI ─── */}
      <section className="relative z-10 bg-[#1B5E3B] text-[#F6F0E1] py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-5/12">
            <img src={kakaki} alt="Trumpet / Kakaki placeholder" className="rounded-3xl shadow-2xl w-full object-cover h-[450px]" />
          </div>
          <div className="w-full md:w-7/12 text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-6">The Kakaki: Our Symbol</h2>
            <p className="text-lg opacity-90 mb-6 leading-relaxed">
              The Kakaki, the long royal trumpet of Northern Nigeria, has historically been used to herald kings, announce victories, and summon communities. It is both sound and statement, a call that commands attention and conveys dignity.
            </p>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              Its place as the central emblem of PAUDC 2026 connects deeply with the spirit of debate itself. The Kakaki does not whisper; it declares. It carries both grace and power, its voice traveling across distance to gather people, unite them, and remind them that something meaningful is unfolding.
            </p>
            <blockquote className="border-l-4 border-[#C8A046] pl-6 py-2 text-2xl font-semibold italic text-[#C8A046]">
              "When the Kakaki sounds in Abuja, it will awaken a generation."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="relative z-10 py-24 text-center overflow-hidden">
        <h2 className="text-3xl font-black mb-2 text-[#022512]">Our Partners</h2>
        <p className="text-[#022512]/70 mb-12">Proudly supported by leading institutions and organizations</p>
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f6f0e1] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f6f0e1] to-transparent z-10 pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 px-8">
            <div className="flex items-center gap-3 font-bold text-lg text-[#022512]">
              <img src={vuef} alt="VUEF Logo" className="w-10 h-auto object-contain" />
              Veritas University Endowment Fund
            </div>
            <div className="flex items-center gap-3 font-bold text-lg text-[#022512]">
              <img src={vunalogo} alt="Veritas Logo" className="w-10 h-auto object-contain" />
              Veritas University
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 bg-white py-24 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#022512]">Join the Republic of Reason</h2>
        <p className="text-lg text-[#022512]/70 max-w-2xl mx-auto mb-10">
          Be part of Africa&apos;s most prestigious intellectual gathering. Request an invite to secure your place in history as we build Africa&apos;s future through debate.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <a href="/register">
            <button className="px-8 py-3 bg-[#C8A046] text-[#022512] rounded-full font-bold hover:bg-[#b08c3e] transition shadow-lg">
              Request an Invite
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}