"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

// ── Data ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "twin", label: "Digital Twin" },
];

const SKILLS = {
  "AI / ML": ["RAG Systems", "Vector Embeddings", "LLM Prompting", "ChromaDB", "Upstash Vector", "Ollama", "Groq", "Object Detection"],
  "Web Dev": ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs", "Streaming / NDJSON"],
  "Tools": ["Git & GitHub", "Vercel", "GitHub Copilot", "VS Code", "Python", "Node.js"],
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
    desc: "Object Detection System with AI Application — capstone research project at St. Paul University Philippines applying computer vision to real-world problems.",
    tags: ["Computer Vision", "AI", "Object Detection"],
    url: "",
    github: "",
    highlight: false,
  },
  {
    name: "Digital Twin",
    badge: "In Progress",
    desc: "This portfolio itself — an AI agent that can answer questions about my professional background using RAG over my career knowledge base.",
    tags: ["Next.js", "Upstash Vector", "Groq", "RAG"],
    url: "",
    github: "",
    highlight: false,
  },
];

// ── Radial Nav ──────────────────────────────────────────────────────────────
function RadialNav() {
  const [open, setOpen] = useState(false);
  // Spread items in an upward arc: left-to-right from 160° → 20°
  const ANGLES = [160, 120, 90, 60, 20];
  const DIST = 180;
  const HALF = 36; // half of 72px orb

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div className="fixed bottom-8 z-50" style={{ left: "50%", transform: "translateX(-50%)" }}>
      {NAV_ITEMS.map((item, i) => {
        const rad = (ANGLES[i] * Math.PI) / 180;
        const x = Math.cos(rad) * DIST;
        const y = Math.sin(rad) * DIST;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="absolute flex items-center justify-center text-sm font-semibold text-white rounded-full px-4 py-2 whitespace-nowrap cursor-pointer"
            style={{
              bottom: `${HALF + y}px`,
              left: `${HALF + x}px`,
              transform: open ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.3)",
              opacity: open ? 1 : 0,
              transition: "all 300ms ease",
              transitionDelay: open ? `${i * 50}ms` : "0ms",
              pointerEvents: open ? "auto" : "none",
              border: "1px solid rgba(129,140,248,0.5)",
              background: "rgba(13,14,40,0.85)",
              backdropFilter: "blur(16px)",
            }}
          >
            {item.label}
          </button>
        );
      })}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-18 h-18 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
        style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg, #818cf8, #22d3ee)",
          boxShadow: open
            ? "0 0 0 6px rgba(129,140,248,0.2), 0 0 40px rgba(129,140,248,0.6)"
            : "0 0 32px rgba(129,140,248,0.5)",
        }}
      >
        <span
          className="text-white font-bold text-lg transition-transform duration-300 select-none"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}
        >
          {open ? "×" : "☰"}
        </span>
      </button>
    </div>
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
    <section id="hero" className="snap relative flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <Blobs />
      <div
        className="relative z-10 max-w-3xl transition-all duration-1000"
        style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(32px)" }}
      >
        <p className="text-xs font-semibold tracking-[4px] text-indigo-400 uppercase mb-6">
          Digital Twin Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4"
          style={{ textShadow: "0 0 40px rgba(129,140,248,0.6), 0 0 80px rgba(129,140,248,0.3)" }}>
          Adrian Kyle
          <br />
          <span style={{ WebkitTextStroke: "1px rgba(129,140,248,0.6)", color: "transparent" }}>
            T. Rapanut
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto mb-2 mt-4 leading-relaxed">
          Transforming ideas into technology-driven solutions.
        </p>
        <p className="text-sm text-indigo-300 mb-10">
          AI Builder · BSIT Student · RAG Developer
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", color: "#04081a" }}
          >
            View My Work →
          </button>
          <button
            onClick={() => document.getElementById("twin")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.4)", color: "#a5b4fc" }}
          >
            Talk to My Digital Twin ✦
          </button>
        </div>
        <div className="mt-16 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, transparent, #818cf8)" }} />
          <p className="text-xs text-indigo-400">scroll</p>
        </div>
      </div>
    </section>
  );
}

// ── Section: About ───────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="snap relative flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="blob w-[500px] h-[500px] top-0 right-0 opacity-50" style={{ background: "rgba(129,140,248,0.08)" }} />
      <div className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center md:justify-end">
          <div
            className="w-64 h-64 rounded-3xl flex items-center justify-center relative overflow-hidden"
            style={{ border: "1px solid rgba(129,140,248,0.3)", boxShadow: "0 0 60px rgba(129,140,248,0.1)", background: "rgba(255,255,255,0.04)" }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.08), rgba(34,211,238,0.06))" }} />
            <span className="text-7xl z-10">👨‍💻</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Building AI that<br />
            <span className="text-indigo-400">knows what it&apos;s talking about.</span>
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            I&apos;m a third-year IT student at St. Paul University Philippines, currently building RAG systems and intelligent agents at Ausbiz Consulting. I&apos;m passionate about applying AI to real-world problems — grounded in actual data, not hallucinations.
          </p>
          <p className="text-slate-400 leading-relaxed mb-8 text-sm">
            My research project, <em className="text-indigo-300">Paulicy</em>, explores object detection with AI. My internship work produced FoodRAG — a cloud-deployed RAG app with streaming responses and metadata filtering.
          </p>
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(129,140,248,0.2)" }}>
            <p className="text-xs text-indigo-400 font-semibold mb-1">Education</p>
            <p className="text-white font-semibold">St. Paul University Philippines</p>
            <p className="text-sm text-slate-400">BS Information Technology — 3rd Year</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Skills ───────────────────────────────────────────────────────────
function SkillsSection() {
  return (
    <section id="skills" className="snap relative flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="blob w-[600px] h-[600px] bottom-0 left-[-10%] opacity-50" style={{ background: "rgba(13,79,108,0.15)" }} />
      <div className="relative z-10 max-w-4xl w-full">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Toolkit</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Skills & Technologies</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(129,140,248,0.15)" }}>
              <p className="text-indigo-300 font-semibold text-sm mb-4">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1 rounded-full text-slate-300"
                    style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.15)" }}>
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
    <section id="projects" className="snap relative flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="blob w-[400px] h-[400px] top-0 right-0" style={{ background: "rgba(107,15,58,0.12)" }} />
      <div className="relative z-10 max-w-5xl w-full">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Work</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: p.highlight ? "1px solid rgba(129,140,248,0.4)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: p.highlight ? "0 0 40px rgba(129,140,248,0.08)" : "none",
              }}
            >
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full self-start"
                style={{
                  background: p.badge === "Live" ? "rgba(34,211,238,0.15)" : p.badge === "Research" ? "rgba(129,140,248,0.15)" : "rgba(255,255,255,0.07)",
                  color: p.badge === "Live" ? "#22d3ee" : p.badge === "Research" ? "#a5b4fc" : "#94a3b8",
                  border: `1px solid ${p.badge === "Live" ? "rgba(34,211,238,0.3)" : p.badge === "Research" ? "rgba(129,140,248,0.3)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {p.badge}
              </span>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{p.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs text-indigo-400" style={{ opacity: 0.7 }}>{t}</span>
                ))}
              </div>
              {(p.url || p.github) && (
                <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-white transition-colors">Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors">GitHub ↗</a>}
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
    <section id="experience" className="snap relative flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="blob w-[500px] h-[500px] top-[-5%] left-[40%]" style={{ background: "rgba(76,29,149,0.12)" }} />
      <div className="relative z-10 max-w-3xl w-full">
        <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-3 text-center">Journey</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Experience</h2>
        <div className="relative pl-8">
          <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: "linear-gradient(to bottom, #818cf8, rgba(129,140,248,0.1))" }} />
          {/* Internship */}
          <div className="relative mb-10">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full"
              style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", boxShadow: "0 0 12px rgba(129,140,248,0.6)" }} />
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(129,140,248,0.2)" }}>
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <p className="text-white font-bold">AI Builder Intern</p>
                  <p className="text-indigo-300 text-sm">Ausbiz Consulting</p>
                </div>
                <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>Mar 2026 – present</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Building production RAG systems from local Python prototypes to cloud-deployed Next.js applications. Progressed from ChromaDB + Ollama to Upstash Vector + Groq within three project cycles.
              </p>
              <div className="space-y-2 text-sm">
                {[
                  ["Week 1", "AI Agents & MCP server research; full dev environment setup"],
                  ["Week 2", "Built FoodRAG locally then migrated to Upstash + Groq + Next.js on Vercel"],
                  ["Week 3", "Added streaming responses, metadata pre-filtering, expanded to 55 foods/18 regions"],
                  ["Week 4", "Building Digital Twin portfolio — AI agent backed by RAG over career data"],
                ].map(([week, desc]) => (
                  <div key={week} className="flex gap-3">
                    <span className="text-indigo-400 font-semibold shrink-0 w-16">{week}</span>
                    <span className="text-slate-400">{desc}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {["Next.js", "TypeScript", "Upstash Vector", "Groq", "Python", "ChromaDB", "Ollama", "Vercel"].map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full text-indigo-400"
                    style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          {/* University */}
          <div className="relative">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full"
              style={{ background: "rgba(129,140,248,0.3)", border: "1px solid rgba(129,140,248,0.5)" }} />
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-white font-bold">BS Information Technology</p>
                  <p className="text-indigo-300 text-sm">St. Paul University Philippines</p>
                </div>
                <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>3rd Year</span>
              </div>
              <p className="text-slate-400 text-sm mt-3">
                Research: <em className="text-indigo-300">Paulicy — Object Detection System with AI Application</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Digital Twin Chat ────────────────────────────────────────────────
function TwinSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const seed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });
      const data = await res.json();
      if (res.ok) {
        setSeeded(true);
        setMessages([{ role: "assistant", content: `Hi! I'm Adrian's digital twin. ${data.message} Ask me anything about his background, skills, or projects.` }]);
      }
    } catch {
      setMessages([{ role: "assistant", content: "Couldn't initialise — please try again." }]);
    }
    setSeeding(false);
  };

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

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
            }
          } catch { /* skip */ }
        }
      }
      setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u; });
    } catch {
      setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: "Connection failed." }; return u; });
    }
    setLoading(false);
  }, [input, loading]);

  return (
    <section id="twin" className="snap relative flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="blob w-[600px] h-[600px] top-0 left-[-20%]" style={{ background: "rgba(76,29,149,0.15)" }} />
      <div className="blob w-[400px] h-[400px] bottom-0 right-[-10%]" style={{ background: "rgba(13,79,108,0.15)" }} />
      <div className="relative z-10 w-full max-w-2xl flex flex-col" style={{ height: "80vh" }}>
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-[3px] text-indigo-400 uppercase mb-2">AI Agent</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Talk to My <span style={{ color: "#a5b4fc", textShadow: "0 0 40px rgba(129,140,248,0.6)" }}>Digital Twin</span>
          </h2>
          <p className="text-slate-400 text-sm">Ask me about my skills, projects, or experience — I&apos;ll answer as Adrian.</p>
        </div>
        <div
          className="flex-1 rounded-3xl flex flex-col overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(129,140,248,0.2)", boxShadow: "0 0 60px rgba(129,140,248,0.05)" }}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
            {!seeded && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="text-5xl select-none">✦</div>
                <p className="text-slate-300 font-medium">Initialise the digital twin to begin.</p>
                <p className="text-slate-500 text-sm max-w-xs">This loads my knowledge base into the vector database so I can answer accurately.</p>
                <button
                  onClick={seed}
                  disabled={seeding}
                  className="mt-2 px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", color: "#04081a" }}
                >
                  {seeding ? "Initialising…" : "✦ Initialise Digital Twin"}
                </button>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg, rgba(129,140,248,0.4), rgba(34,211,238,0.3))", border: "1px solid rgba(129,140,248,0.3)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#cbd5e1" }
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
          {(seeded || messages.length > 0) && (
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask me anything…"
                  disabled={loading}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(129,140,248,0.2)" }}
                />
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ background: "#04081a" }}>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <TwinSection />
      <RadialNav />
      <footer className="text-center text-xs py-4" style={{ background: "#04081a", color: "#334155" }}>
        Adrian Kyle T. Rapanut · AI Builder Internship Week 4 · Ausbiz Consulting
      </footer>
    </main>
  );
}
