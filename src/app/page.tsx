"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Scroll Reveal hook ─────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

// ── Theme helpers ──────────────────────────────────────────────────────────
const THEME_KEY = "dt-theme";
function getStoredTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(THEME_KEY) as "dark" | "light") || "dark";
}
function storeTheme(theme: "dark" | "light") {
  localStorage.setItem(THEME_KEY, theme);
}

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface QueryRecord {
  q: string;
  ts: number;
  ms: number;
  cats: string[];
  rq?: string;
}

// ── Data ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "interview", label: "Q&A" },
  { id: "twin", label: "Digital Twin" },
  { id: "analytics", label: "Analytics" },
  { id: "contact", label: "Contact" },
];

const SKILLS: Record<string, { icon: string; items: string[] }> = {
  "AI / ML": { icon: "🧠", items: ["RAG Systems", "Vector Embeddings", "LLM Prompting", "ChromaDB", "Upstash Vector", "Ollama", "Groq", "Object Detection", "Semantic Search"] },
  "Web Development": { icon: "⚡", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs", "Streaming / NDJSON", "Server Actions"] },
  "Data": { icon: "📊", items: ["JSON Pipelines", "Data Structuring", "STAR Annotation", "Metadata Filtering"] },
  "Tools & Cloud": { icon: "☁️", items: ["Git & GitHub", "Vercel", "GitHub Copilot", "VS Code", "MCP Servers", "CI/CD"] },
  "Languages": { icon: "💻", items: ["Python", "TypeScript", "JavaScript"] },
};

const PROJECTS = [
  {
    name: "FoodRAG",
    badge: "Live",
    desc: "Cloud-hosted RAG app answering natural language questions about 55 global cuisines. Features real-time streaming, metadata pre-filtering, and a custom NDJSON protocol.",
    tags: ["Next.js", "Upstash Vector", "Groq", "Vercel"],
    url: "https://foodrag-n6ntcajca-adrianrapanut4-cmyks-projects.vercel.app",
    github: "https://github.com/adrianrapanut4-cmyk/foodrag-web",
    highlight: true,
  },
  {
    name: "Paulicy",
    badge: "Research",
    desc: "AI-powered object detection system that scans bags to detect prohibited objects like weapons, enhancing campus safety at St. Paul University Philippines. Co-researched with Kier Tacus.",
    tags: ["Computer Vision", "AI", "Object Detection", "Campus Safety"],
    url: "",
    github: "",
    highlight: false,
  },
  {
    name: "Digital Twin",
    badge: "Live",
    desc: "This portfolio itself — an AI agent that answers questions about my professional background using RAG over a 22-chunk career knowledge base.",
    tags: ["Next.js", "Upstash Vector", "Groq", "RAG"],
    url: "https://digital-twin-web-hazel.vercel.app",
    github: "https://github.com/adrianrapanut4-cmyk/digital-twin-web",
    highlight: true,
  },
];

const INTERVIEW_QA = [
  { q: "Why do you want to work in AI?", a: "I'm intrigued by the fact that AI can be used to address real-life issues and make people live better. I like systems that are learnable and make decisions, and I want to apply AI to real life — automation, object detection, and data analysis in particular." },
  { q: "What has been your greatest technical accomplishment?", a: "Creating an AI-based object detection application where I used computer vision methods to recognize and follow objects. It allowed me to develop my abilities in programming, debugging, and working with real-world data." },
  { q: "How do you approach a problem you don't know how to solve?", a: "I divide the problem into smaller segments, research possible solutions and test each step at a time. I learn fast with documentation, online sources, and testing. When necessary, I seek advice, but I always attempt to deeply understand the solution." },
  { q: "What makes you stand out?", a: "I'm extremely motivated to study and develop — a mixture of technical skills and persistence. I don't give up easily when facing challenges. I'm more interested in building and putting into practice what I learn rather than just studying theory." },
  { q: "Where do you see yourself in 3 years?", a: "I envision myself as an experienced AI developer, engaged in practical projects, constantly enhancing my knowledge, and developing new solutions — possibly as a leader or part of an effective AI-based system." },
];

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ theme, toggleTheme }: { theme: "dark" | "light"; toggleTheme: () => void }) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      let current = "";
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top <= 150) {
          current = section.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? theme === "dark" ? "rgba(4,8,26,0.85)" : "rgba(248,250,252,0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme === "dark" ? "rgba(129,140,248,0.1)" : "rgba(129,140,248,0.15)"}` : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="font-bold text-lg tracking-tight flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", color: "#04081a" }}>
            AR
          </span>
          <span className="hidden sm:inline">Adrian<span className="text-indigo-400">.</span></span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: active === item.id ? "#818cf8" : "var(--text-muted)",
                background: active === item.id ? "rgba(129,140,248,0.1)" : "transparent",
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="text-sm">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}
          >
            <span className="text-sm">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-xl cursor-pointer p-2"
            style={{ color: "var(--text-primary)" }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-1" style={{ background: theme === "dark" ? "rgba(4,8,26,0.95)" : "rgba(248,250,252,0.95)" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: active === item.id ? "#818cf8" : "var(--text-muted)" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Background Blobs ─────────────────────────────────────────────────────────
function Blobs() {
  return (
    <>
      <div className="blob w-[600px] h-[600px] top-[-10%] left-[-15%]" style={{ background: "rgba(76,29,149,0.18)" }} />
      <div className="blob w-[500px] h-[500px] top-[30%] right-[-10%]" style={{ background: "rgba(13,79,108,0.18)" }} />
      <div className="blob w-[400px] h-[400px] bottom-[10%] left-[20%]" style={{ background: "rgba(107,15,58,0.14)" }} />
    </>
  );
}

// ── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  const [shown, setShown] = useState(false);
  useEffect(() => { setTimeout(() => setShown(true), 100); }, []);

  return (
    <section id="hero" className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen">
      <Blobs />
      <div
        className="relative z-10 max-w-3xl transition-all duration-1000"
        style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(32px)" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-300">Available for opportunities</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4"
          style={{ color: "var(--text-primary)", textShadow: "0 0 40px rgba(129,140,248,0.5), 0 0 80px rgba(129,140,248,0.2)" }}>
          Adrian Kyle
          <br />
          <span className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>
            T. Rapanut
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-2 mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Transforming ideas into technology-driven solutions.
        </p>
        <p className="text-sm mb-10" style={{ color: "var(--text-dim)" }}>
          AI Builder · BSIT Student · RAG Developer
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#projects"
            className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", color: "#04081a", boxShadow: "0 4px 24px rgba(129,140,248,0.3)" }}>
            View My Work →
          </a>
          <a href="#twin"
            className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.3)", color: "#a5b4fc" }}>
            Talk to My Digital Twin ✦
          </a>
        </div>
        <div className="mt-20 flex flex-col items-center gap-2 opacity-30">
          <div className="w-5 h-8 rounded-full border-2 border-indigo-400 flex justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-indigo-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: About ───────────────────────────────────────────────────────────
function AboutSection() {
  const revealRef = useScrollReveal();
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="blob w-[500px] h-[500px] top-0 right-0 opacity-50" style={{ background: "rgba(129,140,248,0.08)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2 flex justify-center">
          <div
            className="w-64 h-72 rounded-3xl flex items-center justify-center relative overflow-hidden group animate-float hover-lift"
            style={{ border: "1px solid var(--card-border-highlight)", background: "var(--card-bg)" }}
          >
            <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-50"
              style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(34,211,238,0.08))" }} />
            <span className="text-8xl z-10 select-none">👨‍💻</span>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>3rd Year BSIT</p>
              <p className="text-xs text-indigo-400">St. Paul University Philippines</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
            Building AI that<br />
            <span className="text-indigo-400">knows what it&apos;s talking about.</span>
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            I&apos;m a third-year IT student at St. Paul University Philippines, currently building RAG systems and intelligent agents at Ausbiz Consulting. I&apos;m passionate about applying AI to real-world problems — grounded in actual data, not hallucinations.
          </p>
          <p className="leading-relaxed mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
            My research project, <em className="text-indigo-300">Paulicy</em>, is an AI-powered object detection system that scans bags to detect prohibited items like weapons, enhancing campus safety. My internship work produced FoodRAG — a cloud-deployed RAG app with streaming responses and metadata filtering.
          </p>
          <div className="grid grid-cols-3 gap-3 stagger-children revealed">
            {[
              { label: "Projects", value: "3+" },
              { label: "RAG Systems", value: "2" },
              { label: "Knowledge Chunks", value: "25" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-3 text-center hover-glow" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Skills ───────────────────────────────────────────────────────────
function SkillsSection() {
  const revealRef = useScrollReveal();
  return (
    <section id="skills" className="relative px-6 py-28">
      <div className="blob w-[600px] h-[600px] bottom-0 left-[-10%] opacity-50" style={{ background: "rgba(13,79,108,0.12)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Toolkit</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: "var(--text-primary)" }}>Skills & Technologies</h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>Technologies I&apos;ve worked with across AI, web development, and data engineering.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children revealed">
          {Object.entries(SKILLS).map(([category, { icon, items }]) => (
            <div key={category} className="rounded-2xl p-5 hover-lift hover-glow"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{icon}</span>
                <p className="text-indigo-300 font-semibold text-sm">{category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.12)", color: "var(--text-secondary)" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Projects ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const revealRef = useScrollReveal();
  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="blob w-[400px] h-[400px] top-0 right-0" style={{ background: "rgba(107,15,58,0.1)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Work</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: "var(--text-primary)" }}>Projects</h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>From RAG systems to computer vision — projects that solve real problems.</p>
        <div className="grid md:grid-cols-3 gap-6 stagger-children revealed">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 flex flex-col gap-4 hover-lift hover-glow"
              style={{
                background: "var(--card-bg)",
                border: p.highlight ? "1px solid var(--card-border-highlight)" : "1px solid var(--glass-border)",
                boxShadow: p.highlight ? "0 8px 40px rgba(129,140,248,0.06)" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: p.badge === "Live" ? "rgba(34,211,238,0.12)" : "rgba(129,140,248,0.12)",
                    color: p.badge === "Live" ? "#22d3ee" : "#a5b4fc",
                    border: `1px solid ${p.badge === "Live" ? "rgba(34,211,238,0.25)" : "rgba(129,140,248,0.25)"}`,
                  }}
                >
                  {p.badge === "Live" && "● "}{p.badge}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs text-indigo-400/70">{t}</span>
                ))}
              </div>
              {(p.url || p.github) && (
                <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-white transition-colors font-medium">Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-xs font-medium transition-colors" style={{ color: "var(--text-dim)" }}>GitHub ↗</a>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Experience ───────────────────────────────────────────────────────
function ExperienceSection() {
  const revealRef = useScrollReveal();
  return (
    <section id="experience" className="relative px-6 py-28">
      <div className="blob w-[500px] h-[500px] top-[-5%] left-[40%]" style={{ background: "rgba(76,29,149,0.1)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Journey</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "var(--text-primary)" }}>Experience</h2>
        <div className="relative pl-8">
          <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: "linear-gradient(to bottom, #818cf8, rgba(129,140,248,0.05))" }} />
          {/* Internship */}
          <div className="relative mb-10">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full"
              style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", boxShadow: "0 0 12px rgba(129,140,248,0.5)" }} />
            <div className="rounded-2xl p-6 hover-glow" style={{ background: "var(--card-bg)", border: "1px solid rgba(129,140,248,0.15)" }}>
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <p className="font-bold" style={{ color: "var(--text-primary)" }}>AI Builder Intern</p>
                  <p className="text-indigo-300 text-sm">Ausbiz Consulting</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--glass)", color: "var(--text-dim)" }}>Mar 2026 – present</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                Building production RAG systems from local Python prototypes to cloud-deployed Next.js applications. Progressed from ChromaDB + Ollama to Upstash Vector + Groq within eight project cycles.
              </p>
              <div className="space-y-2 text-sm">
                {[
                  ["Week 1", "AI Agents & MCP server research; full dev environment setup"],
                  ["Week 2", "Built FoodRAG locally then migrated to Upstash + Groq + Next.js on Vercel"],
                  ["Week 3", "Added streaming responses, metadata pre-filtering, expanded to 55 foods/18 regions"],
                  ["Week 4", "Built Digital Twin portfolio — AI agent backed by RAG over career data"],
                  ["Week 5", "UI/UX overhaul, expanded knowledge base to 22 chunks, added interview Q&A"],
                  ["Week 6", "Chat history, voice input, MCP Server integration for agent-to-agent access"],
                  ["Week 7", "LLM-enhanced RAG with query rewriting, analytics dashboard with usage insights"],
                  ["Week 8", "Multi-language support, UI animations & polish, theme toggle (dark/light)"],
                ].map(([week, desc]) => (
                  <div key={week} className="flex gap-3">
                    <span className="text-indigo-400 font-semibold shrink-0 w-16">{week}</span>
                    <span style={{ color: "var(--text-muted)" }}>{desc}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
                {["Next.js", "TypeScript", "Upstash Vector", "Groq", "Python", "ChromaDB", "Ollama", "Vercel"].map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full text-indigo-400"
                    style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.12)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          {/* University */}
          <div className="relative">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full"
              style={{ background: "rgba(129,140,248,0.3)", border: "1px solid rgba(129,140,248,0.5)" }} />
            <div className="rounded-2xl p-6 hover-glow" style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold" style={{ color: "var(--text-primary)" }}>BS Information Technology</p>
                  <p className="text-indigo-300 text-sm">St. Paul University Philippines</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--glass)", color: "var(--text-dim)" }}>3rd Year</span>
              </div>
              <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
                Research: <em className="text-indigo-300">Paulicy — Object Detection System with AI Application</em>
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>Co-researcher: Kier Tacus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Interview Q&A ────────────────────────────────────────────────────
function InterviewSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const revealRef = useScrollReveal();

  return (
    <section id="interview" className="relative px-6 py-28">
      <div className="blob w-[400px] h-[400px] bottom-0 right-[-5%]" style={{ background: "rgba(76,29,149,0.1)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Personality</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: "var(--text-primary)" }}>Interview Q&A</h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>Get to know how I think, solve problems, and what drives me — straight from my own words.</p>
        <div className="space-y-3">
          {INTERVIEW_QA.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover-glow"
              style={{
                background: openIdx === i ? "rgba(129,140,248,0.06)" : "var(--card-bg)",
                border: openIdx === i ? "1px solid var(--card-border-highlight)" : "1px solid var(--glass-border)",
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{item.q}</span>
                <span
                  className="text-indigo-400 text-lg shrink-0 transition-transform duration-300"
                  style={{ transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIdx === i ? "200px" : "0px", opacity: openIdx === i ? 1 : 0 }}
              >
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Chat History helpers ──────────────────────────────────────────────────────
const CHAT_STORAGE_KEY = "dt-chat-history";
const MAX_STORED_MESSAGES = 50;

function loadChatHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((m: Message) => ({ ...m, streaming: false }));
  } catch { /* corrupted — ignore */ }
  return [];
}

function saveChatHistory(messages: Message[]) {
  try {
    const toSave = messages
      .filter((m) => m.content)
      .map(({ role, content }) => ({ role, content }))
      .slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* storage full — ignore */ }
}

function clearChatHistory() {
  try { localStorage.removeItem(CHAT_STORAGE_KEY); } catch {}
}

// ── Analytics helpers ─────────────────────────────────────────────────────────
const ANALYTICS_KEY = "dt-analytics";
const MAX_ANALYTICS_RECORDS = 200;

function trackQuery(record: QueryRecord) {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const data: QueryRecord[] = raw ? JSON.parse(raw) : [];
    data.push(record);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data.slice(-MAX_ANALYTICS_RECORDS)));
  } catch { /* ignore */ }
}

function getAnalytics(): QueryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Voice Input hook ─────────────────────────────────────────────────────────
function useVoiceInput(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const recognitionRef = useRef<any>(null);

  function getSR(): any {
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
  }

  const toggle = useCallback(() => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SR = getSR();
    if (!SR) { alert("Voice input is not supported in this browser."); return; }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    recognitionRef.current = r;
    r.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) onResult(text);
      setListening(false);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    setListening(true);
  }, [listening, onResult]);

  const supported = typeof window !== "undefined" && !!getSR();
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return { listening, toggle, supported };
}

// ── Section: Digital Twin Chat ────────────────────────────────────────────────
function TwinSection({ theme }: { theme: "dark" | "light" }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = loadChatHistory();
    if (saved.length > 0) {
      setMessages(saved);
      setSeeded(true);
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Persist messages to localStorage when they change (skip empty / streaming)
  useEffect(() => {
    if (messages.length > 0 && !messages.some((m) => m.streaming)) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const seed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setSeeded(true);
        setMessages([{ role: "assistant", content: `Hey! I'm Adrian's digital twin. ${data.message} Ask me anything about my background, skills, or projects.` }]);
      }
    } catch {
      setMessages([{ role: "assistant", content: "Couldn't initialise — please try again." }]);
    }
    setSeeding(false);
  };

  const handleClearChat = () => {
    clearChatHistory();
    setMessages([{ role: "assistant", content: "Chat cleared! Ask me anything about my background, skills, or projects." }]);
  };

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

    const startTime = Date.now();
    let rewrittenQuery = "";
    let categories: string[] = [];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok || !res.body) {
        setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: "Something went wrong. Try again." }; return u; });
        setLoading(false); return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === "token") {
              setMessages((prev) => {
                const u = [...prev];
                const last = u[u.length - 1];
                u[u.length - 1] = { ...last, content: last.content + parsed.token };
                return u;
              });
            } else if (parsed.type === "meta") {
              rewrittenQuery = parsed.rewrittenQuery || "";
            } else if (parsed.type === "sources") {
              categories = (parsed.sources || []).map((s: { category: string }) => s.category).filter(Boolean);
            }
          } catch { /* skip */ }
        }
      }
      setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u; });
      trackQuery({ q: question, ts: Date.now(), ms: Date.now() - startTime, cats: categories, rq: rewrittenQuery });
    } catch {
      setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: "Connection failed." }; return u; });
    }
    setLoading(false);
  }, [input, loading]);

  // Voice input
  const handleVoiceResult = useCallback((text: string) => { setInput(text); }, []);
  const { listening, toggle: toggleVoice, supported: voiceSupported } = useVoiceInput(handleVoiceResult);

  const suggestions = ["What projects have you built?", "Tell me about your internship", "What are your AI skills?"];

  return (
    <section id="twin" className="relative px-6 py-28">
      <div className="blob w-[600px] h-[600px] top-0 left-[-20%]" style={{ background: "rgba(76,29,149,0.12)" }} />
      <div className="blob w-[400px] h-[400px] bottom-0 right-[-10%]" style={{ background: "rgba(13,79,108,0.12)" }} />
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col" style={{ minHeight: "70vh" }}>
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-2">AI Agent</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Talk to My <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>Digital Twin</span>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Powered by RAG — ask anything about my background and get grounded answers.</p>
        </div>
        <div
          className="flex-1 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)", border: "1px solid rgba(129,140,248,0.15)", minHeight: "500px" }}
        >
          {/* Chat header bar */}
          {(seeded || messages.length > 0) && (
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs" style={{ color: "var(--text-dim)" }}>Chat history saved locally</span>
              </div>
              <button
                onClick={handleClearChat}
                className="text-xs hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded"
                style={{ color: "var(--text-dim)" }}
              >
                Clear chat
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
            {!seeded && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.15), rgba(34,211,238,0.1))", border: "1px solid rgba(129,140,248,0.2)" }}>
                  <span className="text-2xl">✦</span>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Initialise the Digital Twin</p>
                  <p className="text-sm max-w-xs" style={{ color: "var(--text-dim)" }}>This seeds knowledge chunks into the vector database so I can answer accurately.</p>
                </div>
                <button
                  onClick={seed}
                  disabled={seeding}
                  className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", color: "#04081a", boxShadow: "0 4px 20px rgba(129,140,248,0.3)" }}
                >
                  {seeding ? "Initialising…" : "✦ Initialise"}
                </button>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 mt-1 shrink-0 text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", color: "#04081a" }}>
                    AR
                  </div>
                )}
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.25)", color: "var(--text-primary)" }
                    : { background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, color: "var(--text-secondary)" }
                  }
                >
                  {msg.content || (msg.streaming && (
                    <span className="flex gap-1">
                      {[0, 1, 2].map((j) => <span key={j} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${j * 150}ms` }} />)}
                    </span>
                  ))}
                  {msg.content && msg.streaming && (
                    <span className="inline-block w-0.5 h-3.5 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {seeded && messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setInput(s); }} className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors hover:bg-indigo-400/20"
                  style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", color: "#a5b4fc" }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {(seeded || messages.length > 0) && (
            <div className="p-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={listening ? "Listening…" : "Ask me anything…"}
                  disabled={loading}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm placeholder-slate-500 outline-none transition-colors"
                  style={{
                    background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    border: listening ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(129,140,248,0.15)",
                    color: "var(--text-primary)",
                  }}
                />
                {voiceSupported && (
                  <button
                    onClick={toggleVoice}
                    disabled={loading}
                    className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-40 shrink-0"
                    style={{
                      background: listening ? "rgba(239,68,68,0.2)" : theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                      border: listening ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(129,140,248,0.15)",
                    }}
                    title={listening ? "Stop listening" : "Voice input"}
                  >
                    <span className="text-sm" style={{ color: listening ? "#ef4444" : "#94a3b8" }}>
                      {listening ? "⏹" : "🎤"}
                    </span>
                  </button>
                )}
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-40 shrink-0"
                  style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }}
                >
                  <span className="text-sm font-bold" style={{ color: "#04081a" }}>↑</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Section: Analytics Dashboard ──────────────────────────────────────────────
function AnalyticsSection() {
  const [records, setRecords] = useState<QueryRecord[]>([]);
  const revealRef = useScrollReveal();

  useEffect(() => { setRecords(getAnalytics()); }, []);

  // Refresh analytics data when localStorage changes (same tab)
  useEffect(() => {
    const interval = setInterval(() => setRecords(getAnalytics()), 3000);
    return () => clearInterval(interval);
  }, []);

  const totalQueries = records.length;
  const avgResponseTime = totalQueries > 0 ? Math.round(records.reduce((a, r) => a + r.ms, 0) / totalQueries) : 0;

  // Category breakdown
  const catCounts: Record<string, number> = {};
  records.forEach((r) => r.cats.forEach((c) => { catCounts[c] = (catCounts[c] || 0) + 1; }));
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const maxCatCount = sortedCats.length > 0 ? sortedCats[0][1] : 1;

  // Unique days
  const uniqueDays = new Set(records.map((r) => new Date(r.ts).toDateString())).size;

  // Last 5 queries (most recent first)
  const recentQueries = [...records].reverse().slice(0, 5);

  // Latest rewritten query example
  const lastRewritten = [...records].reverse().find((r) => r.rq && r.rq !== r.q);

  const CATEGORY_LABELS: Record<string, string> = {
    experience: "Experience",
    project: "Projects",
    skills: "Skills",
    identity: "Identity",
    education: "Education",
    interview: "Interview",
    about: "About",
    personality: "Personality",
  };

  return (
    <section id="analytics" className="relative px-6 py-28">
      <div className="blob w-[500px] h-[500px] top-0 left-[-10%]" style={{ background: "rgba(76,29,149,0.1)" }} />
      <div className="blob w-[400px] h-[400px] bottom-0 right-[-5%]" style={{ background: "rgba(13,79,108,0.1)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Insights</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: "var(--text-primary)" }}>
          Analytics <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>Dashboard</span>
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
          Real-time usage insights from your interactions with the Digital Twin — tracked locally in your browser.
        </p>

        {/* ─ Stat cards ─ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Queries", value: totalQueries, icon: "💬" },
            { label: "Avg Response", value: avgResponseTime > 0 ? `${(avgResponseTime / 1000).toFixed(1)}s` : "—", icon: "⚡" },
            { label: "Topics Hit", value: sortedCats.length, icon: "🏷️" },
            { label: "Active Days", value: uniqueDays, icon: "📅" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 text-center hover-lift hover-glow"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-extrabold mt-2" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ─ Topic Distribution ─ */}
          <div className="rounded-2xl p-6 hover-glow" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <h3 className="font-bold text-sm mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }} />
              Topic Distribution
            </h3>
            {sortedCats.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-dim)" }}>No data yet — ask the Digital Twin some questions!</p>
            ) : (
              <div className="space-y-3">
                {sortedCats.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{CATEGORY_LABELS[cat] || cat}</span>
                      <span className="text-indigo-400 font-semibold">{count}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxCatCount) * 100}%`,
                          background: "linear-gradient(135deg, #818cf8, #22d3ee)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─ Recent Queries ─ */}
          <div className="rounded-2xl p-6 hover-glow" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <h3 className="font-bold text-sm mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }} />
              Recent Queries
            </h3>
            {recentQueries.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-dim)" }}>No queries recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentQueries.map((r, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>&ldquo;{r.q}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-indigo-400">{(r.ms / 1000).toFixed(1)}s</span>
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>{new Date(r.ts).toLocaleDateString()}</span>
                      {r.cats.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(129,140,248,0.08)", color: "#a5b4fc" }}>
                          {CATEGORY_LABELS[r.cats[0]] || r.cats[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─ Query Enhancement example ─ */}
        {lastRewritten && (
          <div className="mt-6 rounded-2xl p-6 hover-glow" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.15)" }}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span>🔄</span> LLM Query Enhancement (Latest)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: "var(--text-dim)" }}>Original Query</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>&ldquo;{lastRewritten.q}&rdquo;</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)" }}>
                <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2 font-semibold">Rewritten for Search</p>
                <p className="text-indigo-200 text-sm">&ldquo;{lastRewritten.rq}&rdquo;</p>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: "var(--text-dim)" }}>The LLM rewrites your question into a keyword-rich query before semantic search — improving retrieval accuracy.</p>
          </div>
        )}

        {/* ─ Knowledge base breakdown ─ */}
        <div className="mt-6 rounded-2xl p-6 hover-glow" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }} />
            Knowledge Base
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Chunks", value: "25", sub: "Embedded vectors" },
              { label: "Categories", value: "8", sub: "Topic categories" },
              { label: "Embedding Model", value: "BGE", sub: "large-en-v1.5" },
              { label: "LLM Model", value: "LLaMA", sub: "3.3-70B" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl p-3 text-center" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{k.value}</p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>{k.label}</p>
                <p className="text-xs text-indigo-400/60 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Contact ──────────────────────────────────────────────────────────
function ContactSection() {
  const revealRef = useScrollReveal();
  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="blob w-[300px] h-[300px] top-0 left-[30%]" style={{ background: "rgba(129,140,248,0.08)" }} />
      <div ref={revealRef} className="scroll-reveal relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3">Get In Touch</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Let&apos;s Connect</h2>
        <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          I&apos;m always open to new opportunities, collaborations, and conversations about AI.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:adrianrapanut4@gmail.com"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover-glow"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", color: "#a5b4fc" }}>
            ✉ Email
          </a>
          <a href="https://github.com/adrianrapanut4-cmyk" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover-glow"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    storeTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <InterviewSection />
      <TwinSection theme={theme} />
      <AnalyticsSection />
      <ContactSection />
      <footer className="text-center text-xs py-8 border-t" style={{ background: "var(--bg)", color: "var(--text-dim)", borderColor: "var(--glass-border)" }}>
        <p>Adrian Kyle T. Rapanut · AI Builder Internship · Ausbiz Consulting</p>
        <p className="mt-1" style={{ color: "var(--text-dim)" }}>Built with Next.js, Upstash Vector, and Groq — powered by RAG</p>
      </footer>
    </main>
  );
}
