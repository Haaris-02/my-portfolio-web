import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Code, ExternalLink, Globe, Send } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "project", label: "PROJECT" },
  { id: "contact", label: "CONTACT" },
];

const SKILLS = [
  "Python",
  "Django",
  "HTML/CSS",
  "Git/GitHub",
  "PythonAnywhere",
];

const PROJECTS = [
  {
    title: "Construction Management System",
    stack: ["Python", "Django"],
    github: "https://github.com/Haaris-02/Smartbuildes",
    live: "https://haaris2003.pythonanywhere.com",
    description:
      "A full-featured Django platform to streamline project tracking, documents, resource planning, and progress visibility for construction teams.",
  },
  {
    title: "Online Masala Store",
    stack: ["Python", "Django", "HTML/CSS"],
    github: "https://github.com/Haaris-02/Masala_Store",
    live: "",
    description:
      "A responsive e-commerce storefront with product browsing, account flows, and admin updates powered by Django.",
  },
];

const STAR_COLORS = [
  [255, 255, 255],
  [197, 228, 255],
  [255, 214, 235],
  [255, 246, 196],
];

function WarpStarfield() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const stars = [];
    const meteors = [];
    const impacts = [];
    const baseSpeed = 2.4;
    const warpSpeed = 24;
    let speed = baseSpeed;
    let targetSpeed = baseSpeed;
    let stretch = 0;
    let targetStretch = 0;
    let lastScrollAt = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let focalLength = Math.max(width, height) * 0.8;
    let maxDepth = Math.max(width, height) * 1.8;
    let rafId = 0;
    const count = Math.min(2000, Math.floor((width * height) / 1300) + 420);

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      focalLength = Math.max(width, height) * 0.8;
      maxDepth = Math.max(width, height) * 1.8;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resetStar = (star) => {
      const [r, g, b] = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      star.x = (Math.random() - 0.5) * width * 1.7;
      star.y = (Math.random() - 0.5) * height * 1.7;
      star.z = Math.random() * maxDepth + 1;
      star.prevZ = star.z;
      star.size = 0.45 + Math.random() * 1.8;
      star.r = r;
      star.g = g;
      star.b = b;
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < count; i += 1) {
        const star = {};
        resetStar(star);
        stars.push(star);
      }
    };

    const onResize = () => {
      setupCanvas();
      initStars();
    };
    const onScroll = () => {
      lastScrollAt = performance.now();
      targetSpeed = warpSpeed;
      targetStretch = 1;
    };
    const spawnImpact = (x, y) => {
      const count = 14 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 1.8 + Math.random() * 4.4;
        impacts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.025 + Math.random() * 0.03,
          size: 1.2 + Math.random() * 2.8,
        });
      }
    };
    const spawnMeteor = (targetX, targetY) => {
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft
        ? -90 - Math.random() * 260
        : width + 90 + Math.random() * 260;
      const startY = -120 - Math.random() * 260;
      const dx = targetX - startX;
      const dy = targetY - startY;
      const distance = Math.hypot(dx, dy) || 1;
      const speedBoost = stretch > 0.2 ? 6 : 0;
      const speed = 22 + Math.random() * 10 + speedBoost;
      meteors.push({
        x: startX,
        y: startY,
        vx: (dx / distance) * speed,
        vy: (dy / distance) * speed,
        targetX,
        targetY,
        tailLength: 75 + Math.random() * 70,
        headSize: 2.8 + Math.random() * 2.4,
      });
    };
    const onClick = (event) => {
      spawnMeteor(event.clientX, event.clientY);
    };

    const draw = (now) => {
      if (now - lastScrollAt > 140) {
        targetSpeed = baseSpeed;
        targetStretch = 0;
      }
      speed += (targetSpeed - speed) * 0.08;
      stretch += (targetStretch - stretch) * 0.1;

      ctx.fillStyle = "#02030a";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        star.prevZ = star.z;
        star.z -= speed;
        if (star.z <= 1) {
          resetStar(star);
          continue;
        }

        const x = (star.x / star.z) * focalLength + centerX;
        const y = (star.y / star.z) * focalLength + centerY;
        const px = (star.x / star.prevZ) * focalLength + centerX;
        const py = (star.y / star.prevZ) * focalLength + centerY;

        if (x < -120 || x > width + 120 || y < -120 || y > height + 120) {
          resetStar(star);
          continue;
        }

        const depth = 1 - star.z / maxDepth;
        const alpha = Math.min(1, 0.25 + depth * 0.95);
        const radius = Math.max(0.5, star.size * (0.25 + depth * 1.6));
        const color = `rgba(${star.r},${star.g},${star.b},${alpha})`;

        if (stretch > 0.08) {
          const lx = x + (x - px) * (0.9 + stretch * 1.8);
          const ly = y + (y - py) * (0.9 + stretch * 1.8);
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(0.7, radius * (0.55 + stretch * 0.45));
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(lx, ly);
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = meteors.length - 1; i >= 0; i -= 1) {
        const meteor = meteors[i];
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        const tailX = meteor.x - (meteor.vx / 8) * meteor.tailLength;
        const tailY = meteor.y - (meteor.vy / 8) * meteor.tailLength;

        const trail = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          tailX,
          tailY
        );
        trail.addColorStop(0, "rgba(255, 248, 215, 0.98)");
        trail.addColorStop(0.4, "rgba(145, 220, 255, 0.68)");
        trail.addColorStop(1, "rgba(145, 220, 255, 0)");
        ctx.strokeStyle = trail;
        ctx.lineWidth = meteor.headSize * 1.55;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        const glow = ctx.createRadialGradient(
          meteor.x,
          meteor.y,
          0,
          meteor.x,
          meteor.y,
          meteor.headSize * 5.6
        );
        glow.addColorStop(0, "rgba(255, 255, 255, 1)");
        glow.addColorStop(0.35, "rgba(183, 236, 255, 0.9)");
        glow.addColorStop(1, "rgba(183, 236, 255, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.headSize * 5.6, 0, Math.PI * 2);
        ctx.fill();

        const impactDistance = Math.hypot(
          meteor.targetX - meteor.x,
          meteor.targetY - meteor.y
        );
        if (impactDistance <= Math.max(14, meteor.headSize * 3.8)) {
          spawnImpact(meteor.targetX, meteor.targetY);
          meteors.splice(i, 1);
        }
      }

      for (let i = impacts.length - 1; i >= 0; i -= 1) {
        const p = impacts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy = p.vy * 0.98 + 0.05;
        p.life -= p.decay;
        if (p.life <= 0) {
          impacts.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(178, 234, 255, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    setupCanvas();
    initStars();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    />
  );
}

function ParticleNameCanvas({ text }) {
  const canvasRef = React.useRef(null);
  const mouseRef = React.useRef({ x: -10_000, y: -10_000, active: false });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let animationId = 0;
    const particles = [];
    const staticCanvas = document.createElement("canvas");
    const staticCtx = staticCanvas.getContext("2d");
    if (!staticCtx) return undefined;

    const createParticles = () => {
      particles.length = 0;
      staticCtx.clearRect(0, 0, width, height);
      const fontSize = Math.max(36, Math.min(84, width * 0.095));
      staticCtx.font = `700 ${fontSize}px Orbitron, Segoe UI, sans-serif`;
      staticCtx.textAlign = "center";
      staticCtx.textBaseline = "middle";
      staticCtx.fillStyle = "#ffffff";
      staticCtx.fillText(text, width / 2, height / 2);
      const { data } = staticCtx.getImageData(0, 0, width, height);
      const gap = Math.max(4, Math.round(width / 180));

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 120) {
            particles.push({
              x: x + (Math.random() - 0.5) * 6,
              y: y + (Math.random() - 0.5) * 6,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              size: 1.3 + Math.random() * 1.8,
            });
          }
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.max(280, Math.floor((rect?.width || window.innerWidth) - 24));
      height = Math.max(180, Math.floor(width * 0.33));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      staticCanvas.width = width;
      staticCanvas.height = height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        const spreadRadius = 85;

        if (mouse.active && dist < spreadRadius) {
          const force = (spreadRadius - dist) / spreadRadius;
          p.vx += (dx / dist) * force * 2.4;
          p.vy += (dy / dist) * force * 2.4;
        }

        p.vx += (p.tx - p.x) * 0.035;
        p.vy += (p.ty - p.y) * 0.035;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = "rgba(174, 240, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -10_000;
      mouseRef.current.y = -10_000;
    };

    resize();
    animate();
    window.addEventListener("resize", resize, { passive: true });
    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave, { passive: true });
    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      onMove({ clientX: touch.clientX, clientY: touch.clientY });
    });
    canvas.addEventListener("touchend", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchend", onLeave);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive particle text"
      style={{
        maxWidth: "980px",
        width: "100%",
        borderRadius: 20,
      }}
    />
  );
}

function ProjectCard({ title, stack, github, live, description }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = (0.5 - py) * 14;
    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      onTouchEnd={resetTilt}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
        width: "min(100%, 460px)",
        minHeight: 270,
        borderRadius: 18,
        padding: "1.35rem 1.3rem",
        border: "1px solid rgba(133, 228, 255, 0.38)",
        background:
          "linear-gradient(145deg, rgba(11, 20, 40, 0.72), rgba(20, 35, 63, 0.58))",
        boxShadow: "0 10px 36px rgba(0, 214, 255, 0.18)",
        backdropFilter: "blur(8px)",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#c6f6ff",
          fontSize: "1.2rem",
          letterSpacing: "0.03em",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {stack.map((item) => (
          <span
            key={item}
            style={{
              fontSize: "0.78rem",
              padding: "4px 9px",
              borderRadius: 999,
              border: "1px solid rgba(126, 223, 255, 0.45)",
              color: "#8ee6ff",
              backgroundColor: "rgba(10, 23, 40, 0.6)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <p style={{ color: "#d9f6ff", lineHeight: 1.55, marginTop: 14 }}>{description}</p>
      <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
        <LinkButton href={github} icon={<Code size={15} />} label="GitHub" />
        {live ? <LinkButton href={live} icon={<ExternalLink size={15} />} label="Live" /> : null}
      </div>
    </motion.article>
  );
}

function LinkButton({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        textDecoration: "none",
        color: "#b7f2ff",
        padding: "0.4rem 0.72rem",
        borderRadius: 8,
        border: "1px solid rgba(141, 226, 255, 0.42)",
        backgroundColor: "rgba(6, 15, 30, 0.58)",
      }}
    >
      {icon}
      {label}
    </a>
  );
}

export default function App() {
  const sectionRefs = React.useRef({});
  const [activeSection, setActiveSection] = React.useState("home");
  const [hoveredNavItem, setHoveredNavItem] = React.useState(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.4, 0.6] }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 900);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#eefbff",
        fontFamily: "'Orbitron', 'Segoe UI', sans-serif",
        background: "transparent",
      }}
    >
      <WarpStarfield />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 10%, rgba(0, 150, 255, 0.1), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255, 110, 218, 0.08), transparent 40%)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: "blur(11px)",
          background: "rgba(2, 8, 22, 0.62)",
        }}
      >
        <nav
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 15 : 28,
            fontSize: isMobile ? "0.8rem" : "0.92rem",
            letterSpacing: "0.17em",
            fontWeight: 700,
            padding: "0 0.5rem",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onMouseEnter={() => setHoveredNavItem(item.id)}
              onMouseLeave={() => setHoveredNavItem(null)}
              style={{
                textDecoration: "none",
                color:
                  activeSection === item.id
                    ? "#f0fdff"
                    : hoveredNavItem === item.id
                      ? "#e7fbff"
                      : "rgba(228, 248, 255, 0.74)",
                padding: isMobile ? "0.45rem 0.8rem" : "0.48rem 0.92rem",
                borderRadius: 999,
                border:
                  activeSection === item.id
                    ? "1px solid rgba(143, 235, 255, 0.7)"
                    : hoveredNavItem === item.id
                      ? "1px solid rgba(136, 231, 255, 0.45)"
                      : "1px solid transparent",
                background:
                  activeSection === item.id
                    ? "linear-gradient(135deg, rgba(132, 224, 255, 0.2), rgba(125, 124, 255, 0.1))"
                    : hoveredNavItem === item.id
                      ? "linear-gradient(135deg, rgba(150, 231, 255, 0.14), rgba(103, 121, 255, 0.06))"
                      : "transparent",
                boxShadow:
                  activeSection === item.id
                    ? "0 0 20px rgba(97, 233, 255, 0.26), inset 0 0 14px rgba(185, 243, 255, 0.13)"
                    : hoveredNavItem === item.id
                      ? "0 0 16px rgba(95, 224, 255, 0.2)"
                      : "none",
                backdropFilter: hoveredNavItem === item.id ? "blur(10px)" : "none",
                transition:
                  "color 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                transform: hoveredNavItem === item.id ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "88px 18px 56px" }}>
        <section
          id="home"
          ref={(el) => {
            sectionRefs.current.home = el;
          }}
          style={{
            minHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              transform: isMobile ? "scale(1.12)" : "scale(1.25)",
              transformOrigin: "center",
              marginBottom: 0,
            }}
          >
            <ParticleNameCanvas text="MOHAMAD ALHARIS" />
          </div>
          <p
            style={{
              marginTop: 2,
              color: "#9de8ff",
              fontSize: isMobile ? "1rem" : "1.2rem",
              letterSpacing: "0.1em",
            }}
          >
            Python Developer | Web Technologies
          </p>
        </section>

        <section
          id="about"
          ref={(el) => {
            sectionRefs.current.about = el;
          }}
          style={{ minHeight: "85vh", paddingTop: "5rem" }}
        >
          <SectionHeading title="ABOUT ME" />
          <div
            style={{
              marginTop: 22,
              border: "1px solid rgba(125, 220, 255, 0.35)",
              borderRadius: 18,
              padding: isMobile ? "1.2rem" : "1.8rem",
              background:
                "linear-gradient(150deg, rgba(10, 24, 45, 0.66), rgba(8, 22, 40, 0.38))",
              boxShadow: "0 10px 32px rgba(26, 212, 255, 0.12)",
            }}
          >
            <h3 style={aboutSubHeadingStyle}>BIO</h3>
            <p style={aboutLineStyle}>
              B.Sc. Computer Science graduate and Python developer passionate about building
              practical, user-focused web solutions.
            </p>
            <h3 style={aboutSubHeadingStyle}>EDUCATION</h3>
            <p style={aboutLineStyle}>
              B.Sc. Computer Science (2021-2024) from Sadakathullah Appa College
            </p>
            <h3 style={aboutSubHeadingStyle}>SKILLS</h3>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: 12,
              }}
            >
              {SKILLS.map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "0.75rem 0.7rem",
                    textAlign: "center",
                    borderRadius: 10,
                    border: "1px solid rgba(121, 217, 255, 0.35)",
                    backgroundColor: "rgba(6, 20, 36, 0.62)",
                    color: "#d7f7ff",
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
            <h3 style={aboutSubHeadingStyle}>CURRENTLY LEARNING</h3>
            <p style={aboutLineStyle}>
              Actively exploring AI/ML fundamentals and applications
            </p>
          </div>
        </section>

        <section
          id="project"
          ref={(el) => {
            sectionRefs.current.project = el;
          }}
          style={{ minHeight: "90vh", paddingTop: "5rem" }}
        >
          <SectionHeading title="PROJECT" />
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {PROJECTS.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        <section
          id="contact"
          ref={(el) => {
            sectionRefs.current.contact = el;
          }}
          style={{ minHeight: "80vh", paddingTop: "5rem" }}
        >
          <SectionHeading title="CONTACT" />
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
              gap: 20,
            }}
          >
            <form
              style={{
                borderRadius: 16,
                padding: isMobile ? "1rem" : "1.25rem",
                border: "1px solid rgba(109, 220, 255, 0.45)",
                background:
                  "linear-gradient(145deg, rgba(8, 17, 36, 0.84), rgba(8, 25, 45, 0.56))",
                boxShadow:
                  "0 0 16px rgba(0, 183, 255, 0.18), inset 0 0 14px rgba(136, 236, 255, 0.05)",
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input label="Name" type="text" placeholder="Your name" />
              <Input label="Email" type="email" placeholder="Your email" />
              <Input label="Message" textarea placeholder="Type your message..." />
              <button
                type="submit"
                style={{
                  marginTop: 6,
                  width: "100%",
                  borderRadius: 10,
                  border: "1px solid rgba(134, 235, 255, 0.65)",
                  background:
                    "linear-gradient(90deg, rgba(24, 139, 255, 0.45), rgba(0, 225, 255, 0.3))",
                  color: "#f2fcff",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  padding: "0.75rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <Send size={16} />
                Send
              </button>
            </form>

            <div
              style={{
                borderRadius: 16,
                padding: "1.25rem",
                border: "1px solid rgba(124, 217, 255, 0.38)",
                backgroundColor: "rgba(8, 21, 40, 0.65)",
                display: "grid",
                gap: 14,
                alignContent: "start",
              }}
            >
              <ContactLine icon={<Phone size={18} />} text="8056328106" href="tel:8056328106" />
              <ContactLine
                icon={<Mail size={18} />}
                text="haarishaaris64@gmail.com"
                href="mailto:haarishaaris64@gmail.com"
              />
              <ContactLine
                icon={<Code size={18} />}
                text="GitHub"
                href="https://github.com/Haaris-02"
              />
              <ContactLine
                icon={<Globe size={18} />}
                text="LinkedIn"
                href="https://linkedin.com/in/mohamad-alharis-978627224"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ title }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
        color: "#d5f8ff",
        letterSpacing: "0.16em",
        textShadow: "0 0 12px rgba(118, 227, 255, 0.85)",
      }}
    >
      {title}
    </h2>
  );
}

function Input({ label, type = "text", placeholder, textarea = false }) {
  const baseStyle = {
    width: "100%",
    borderRadius: 10,
    padding: "0.74rem 0.85rem",
    color: "#e5fbff",
    backgroundColor: "rgba(4, 11, 22, 0.78)",
    border: "1px solid rgba(127, 222, 255, 0.4)",
    outline: "none",
    boxShadow: "inset 0 0 7px rgba(79, 214, 255, 0.15)",
  };

  return (
    <label
      style={{
        display: "grid",
        gap: 8,
        marginBottom: 12,
        color: "#c7f5ff",
        letterSpacing: "0.05em",
      }}
    >
      {label}
      {textarea ? (
        <textarea placeholder={placeholder} rows={4} style={{ ...baseStyle, resize: "vertical" }} />
      ) : (
        <input type={type} placeholder={placeholder} style={baseStyle} />
      )}
    </label>
  );
}

function ContactLine({ icon, text, href }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
        color: "#d5f7ff",
        wordBreak: "break-word",
      }}
    >
      <span style={{ color: "#92ebff" }}>{icon}</span>
      {text}
    </a>
  );
}

const aboutLineStyle = {
  margin: 0,
  color: "#ddf7ff",
  lineHeight: 1.6,
  letterSpacing: "0.04em",
};

const aboutSubHeadingStyle = {
  marginTop: 24,
  marginBottom: 10,
  color: "#b8f4ff",
  letterSpacing: "0.08em",
  fontSize: "0.98rem",
};