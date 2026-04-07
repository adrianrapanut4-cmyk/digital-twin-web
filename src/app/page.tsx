"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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
function Navbar() {
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
        background: scrolled ? "rgba(4,8,26,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(129,140,248,0.1)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>
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
                color: active === item.id ? "#a5b4fc" : "#94a3b8",
                background: active === item.id ? "rgba(129,140,248,0.1)" : "transparent",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-white text-xl cursor-pointer p-2"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-1" style={{ background: "rgba(4,8,26,0.95)" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: active === item.id ? "#a5b4fc" : "#94a3b8" }}
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
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4"
          style={{ textShadow: "0 0 40px rgba(129,140,248,0.5), 0 0 80px rgba(129,140,248,0.2)" }}>
          Adrian Kyle
          <br />
          <span className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>
            T. Rapanut
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto mb-2 mt-4 leading-relaxed">
          Transforming ideas into technology-driven solutions.
        </p>
        <p className="text-sm text-slate-500 mb-10">
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
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="blob w-[500px] h-[500px] top-0 right-0 opacity-50" style={{ background: "rgba(129,140,248,0.08)" }} />
      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2 flex justify-center">
          <div
            className="w-64 h-72 rounded-3xl flex items-center justify-center relative overflow-hidden group"
            style={{ border: "1px solid rgba(129,140,248,0.2)", background: "rgba(255,255,255,0.03)" }}
          >
            <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-50"
              style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(34,211,238,0.08))" }} />
            <span className="text-8xl z-10 select-none">👨‍💻</span>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-xs text-slate-500">3rd Year BSIT</p>
              <p className="text-xs text-indigo-400">St. Paul University Philippines</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Building AI that<br />
            <span className="text-indigo-400">knows what it&apos;s talking about.</span>
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            I&apos;m a third-year IT student at St. Paul University Philippines, currently building RAG systems and intelligent agents at Ausbiz Consulting. I&apos;m passionate about applying AI to real-world problems — grounded in actual data, not hallucinations.
          </p>
          <p className="text-slate-400 leading-relaxed mb-6 text-sm">
            My research project, <em className="text-indigo-300">Paulicy</em>, is an AI-powered object detection system that scans bags to detect prohibited items like weapons, enhancing campus safety. My internship work produced FoodRAG — a cloud-deployed RAG app with streaming responses and metadata filtering.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Projects", value: "3+" },
              { label: "RAG Systems", value: "2" },
              { label: "Knowledge Chunks", value: "24" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.1)" }}>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
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
  return (
    <section id="skills" className="relative px-6 py-28">
      <div className="blob w-[600px] h-[600px] bottom-0 left-[-10%] opacity-50" style={{ background: "rgba(13,79,108,0.12)" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Toolkit</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Skills & Technologies</h2>
        <p className="text-slate-400 text-sm text-center mb-12 max-w-lg mx-auto">Technologies I&apos;ve worked with across AI, web development, and data engineering.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(SKILLS).map(([category, { icon, items }]) => (
            <div key={category} className="rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.1)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{icon}</span>
                <p className="text-indigo-300 font-semibold text-sm">{category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1 rounded-full text-slate-300"
                    style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.12)" }}>
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
  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="blob w-[400px] h-[400px] top-0 right-0" style={{ background: "rgba(107,15,58,0.1)" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Work</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Projects</h2>
        <p className="text-slate-400 text-sm text-center mb-12 max-w-lg mx-auto">From RAG systems to computer vision — projects that solve real problems.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:translate-y-[-4px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: p.highlight ? "1px solid rgba(129,140,248,0.3)" : "1px solid rgba(255,255,255,0.06)",
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
                <h3 className="text-white font-bold text-lg mb-2">{p.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs text-indigo-400/70">{t}</span>
                ))}
              </div>
              {(p.url || p.github) && (
                <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-white transition-colors font-medium">Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors font-medium">GitHub ↗</a>}
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
  return (
    <section id="experience" className="relative px-6 py-28">
      <div className="blob w-[500px] h-[500px] top-[-5%] left-[40%]" style={{ background: "rgba(76,29,149,0.1)" }} />
      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Journey</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Experience</h2>
        <div className="relative pl-8">
          <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: "linear-gradient(to bottom, #818cf8, rgba(129,140,248,0.05))" }} />
          {/* Internship */}
          <div className="relative mb-10">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full"
              style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", boxShadow: "0 0 12px rgba(129,140,248,0.5)" }} />
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.15)" }}>
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <p className="text-white font-bold">AI Builder Intern</p>
                  <p className="text-indigo-300 text-sm">Ausbiz Consulting</p>
                </div>
                <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>Mar 2026 – present</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Building production RAG systems from local Python prototypes to cloud-deployed Next.js applications. Progressed from ChromaDB + Ollama to Upstash Vector + Groq within seven project cycles.
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
                ].map(([week, desc]) => (
                  <div key={week} className="flex gap-3">
                    <span className="text-indigo-400 font-semibold shrink-0 w-16">{week}</span>
                    <span className="text-slate-400">{desc}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
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
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-white font-bold">BS Information Technology</p>
                  <p className="text-indigo-300 text-sm">St. Paul University Philippines</p>
                </div>
                <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>3rd Year</span>
              </div>
              <p className="text-slate-400 text-sm mt-3">
                Research: <em className="text-indigo-300">Paulicy — Object Detection System with AI Application</em>
              </p>
              <p className="text-slate-500 text-xs mt-1">Co-researcher: Kier Tacus</p>
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

  return (
    <section id="interview" className="relative px-6 py-28">
      <div className="blob w-[400px] h-[400px] bottom-0 right-[-5%]" style={{ background: "rgba(76,29,149,0.1)" }} />
      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Personality</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Interview Q&A</h2>
        <p className="text-slate-400 text-sm text-center mb-12 max-w-lg mx-auto">Get to know how I think, solve problems, and what drives me — straight from my own words.</p>
        <div className="space-y-3">
          {INTERVIEW_QA.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: openIdx === i ? "rgba(129,140,248,0.06)" : "rgba(255,255,255,0.03)",
                border: openIdx === i ? "1px solid rgba(129,140,248,0.25)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-white font-medium text-sm">{item.q}</span>
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
                <p className="px-6 pb-5 text-slate-300 text-sm leading-relaxed">{item.a}</p>
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
function TwinSection() {
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Talk to My <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>Digital Twin</span>
          </h2>
          <p className="text-slate-400 text-sm">Powered by RAG — ask anything about my background and get grounded answers.</p>
        </div>
        <div
          className="flex-1 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(129,140,248,0.15)", minHeight: "500px" }}
        >
          {/* Chat header bar */}
          {(seeded || messages.length > 0) && (
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-500">Chat history saved locally</span>
              </div>
              <button
                onClick={handleClearChat}
                className="text-xs text-slate-600 hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded"
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
                  <p className="text-white font-semibold mb-1">Initialise the Digital Twin</p>
                  <p className="text-slate-500 text-sm max-w-xs">This seeds knowledge chunks into the vector database so I can answer accurately.</p>
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
                    ? { background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.25)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#cbd5e1" }
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
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={listening ? "Listening…" : "Ask me anything…"}
                  disabled={loading}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: listening ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(129,140,248,0.15)",
                  }}
                />
                {voiceSupported && (
                  <button
                    onClick={toggleVoice}
                    disabled={loading}
                    className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-40 shrink-0"
                    style={{
                      background: listening ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)",
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
      <div className="relative z-10 max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Insights</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          Analytics <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}>Dashboard</span>
        </h2>
        <p className="text-slate-400 text-sm text-center mb-12 max-w-lg mx-auto">
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
            <div key={s.label} className="rounded-2xl p-5 text-center transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.15)" }}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-extrabold text-white mt-2">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ─ Topic Distribution ─ */}
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.1)" }}>
            <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }} />
              Topic Distribution
            </h3>
            {sortedCats.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No data yet — ask the Digital Twin some questions!</p>
            ) : (
              <div className="space-y-3">
                {sortedCats.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">{CATEGORY_LABELS[cat] || cat}</span>
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
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.1)" }}>
            <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }} />
              Recent Queries
            </h3>
            {recentQueries.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No queries recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentQueries.map((r, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p className="text-slate-300 text-sm truncate">&ldquo;{r.q}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-indigo-400">{(r.ms / 1000).toFixed(1)}s</span>
                      <span className="text-xs text-slate-600">{new Date(r.ts).toLocaleDateString()}</span>
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
          <div className="mt-6 rounded-2xl p-6" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.15)" }}>
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span>🔄</span> LLM Query Enhancement (Latest)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Original Query</p>
                <p className="text-slate-300 text-sm">&ldquo;{lastRewritten.q}&rdquo;</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)" }}>
                <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2 font-semibold">Rewritten for Search</p>
                <p className="text-indigo-200 text-sm">&ldquo;{lastRewritten.rq}&rdquo;</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">The LLM rewrites your question into a keyword-rich query before semantic search — improving retrieval accuracy.</p>
          </div>
        )}

        {/* ─ Knowledge base breakdown ─ */}
        <div className="mt-6 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.1)" }}>
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)" }} />
            Knowledge Base
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Chunks", value: "24", sub: "Embedded vectors" },
              { label: "Categories", value: "8", sub: "Topic categories" },
              { label: "Embedding Model", value: "BGE", sub: "large-en-v1.5" },
              { label: "LLM Model", value: "LLaMA", sub: "3.3-70B" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-bold text-white">{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
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
  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="blob w-[300px] h-[300px] top-0 left-[30%]" style={{ background: "rgba(129,140,248,0.08)" }} />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3">Get In Touch</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let&apos;s Connect</h2>
        <p className="text-slate-400 text-sm mb-10 max-w-md mx-auto">
          I&apos;m always open to new opportunities, collaborations, and conversations about AI.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:adrianrapanut4@gmail.com"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", color: "#a5b4fc" }}>
            ✉ Email
          </a>
          <a href="https://github.com/adrianrapanut4-cmyk" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ background: "#04081a" }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <InterviewSection />
      <TwinSection />
      <AnalyticsSection />
      <ContactSection />
      <footer className="text-center text-xs py-8 border-t" style={{ background: "#04081a", color: "#334155", borderColor: "rgba(255,255,255,0.05)" }}>
        <p>Adrian Kyle T. Rapanut · AI Builder Internship · Ausbiz Consulting</p>
        <p className="mt-1 text-slate-600">Built with Next.js, Upstash Vector, and Groq — powered by RAG</p>
      </footer>
    </main>
  );
}
