import React, { useState, useEffect } from 'react';
import GuardadosDrawer from './GuardadosDrawer';
import PostViewPolish from './PostViewPolish';
import Shortcuts from './Shortcuts';

// ...existing code...
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [savedCount, setSavedCount] = useState(0);

  // ===== Tema persistente =====
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const t = prefersDark ? "dark" : "light";
      setTheme(t);
      document.documentElement.setAttribute("data-theme", t);
    }
  }, []);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  // ===== Sombra / fondo al hacer scroll =====
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== Guardados (contador) =====
  const computeSaved = () => {
    try { return (JSON.parse(localStorage.getItem("saved_posts_v1") || "[]") as any[]).length; } catch { return 0; }
  };
  useEffect(() => {
    setSavedCount(computeSaved());
    const onChange = () => setSavedCount(computeSaved());
    window.addEventListener("saved:changed", onChange as any);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("saved:changed", onChange as any);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  // ===== Drawer de Guardados =====
  const [openSaved, setOpenSaved] = useState(false);

  return (
    <>
      <style>{`
        :root {
          --bg:#fff; --bg-soft:#fafafa; --card:#fff; --text:#0f172a; --muted:#475569; --muted-2:#94a3b8;
          --border:rgba(0,0,0,.12); --chip-bg:#f8fafc; --primary:#111827; --primary-contrast:#fff;
          --shadow:0 10px 30px rgba(0,0,0,.06); --nav-glass:rgba(255,255,255,.25); --nav-glass-solid:rgba(255,255,255,.9);
        }
        [data-theme="dark"]{
          --bg:#0b1220; --bg-soft:#0f172a; --card:#0f172a; --text:#e5e7eb; --muted:#cbd5e1; --muted-2:#94a3b8;
          --border:rgba(255,255,255,.14); --chip-bg:rgba(255,255,255,.06); --primary:#e5e7eb; --primary-contrast:#0b1220;
          --shadow:0 10px 30px rgba(0,0,0,.5); --nav-glass:rgba(15,23,42,.45); --nav-glass-solid:rgba(15,23,42,.85);
        }

        .nv{position:sticky;top:0;z-index:40;border-bottom:1px solid var(--border);
            backdrop-filter:saturate(150%) blur(8px);transition:background .18s, box-shadow .18s;}
        .nv--t{background:var(--nav-glass);} .nv--s{background:var(--nav-glass-solid);}
        .nv__in{max-width:1240px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;}
        .brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);}
        .brand__m{font-size:18px;} .brand__t{font-size:18px;font-weight:700;}
        .nav{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
        .link{position:relative;text-decoration:none;color:var(--text);font-size:12px;letter-spacing:1.4px;padding:10px 6px;}
        .link::after{content:"";position:absolute;left:6px;right:6px;bottom:6px;height:2px;background:var(--text);transform:scaleX(0);transform-origin:left;transition:transform .2s;}
        .link:hover::after{transform:scaleX(1);}
        .cta{border:1px solid var(--text);padding:8px 10px;border-radius:10px;}
        .theme{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:12px;padding:8px 10px;cursor:pointer;font-weight:600;}
        .saved{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:12px;padding:8px 12px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:8px;}
        .badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 6px;border-radius:10px;background:var(--text);color:var(--bg);font-size:12px;font-weight:800;}

        /* ==== HOME / HERO FIXES (conservados) ==== */
        .hero{ position:relative; isolation:isolate; }
        .hero__imgw{ position:absolute; inset:0; z-index:0; pointer-events:none; }
        .hero__img{ opacity:.22; width:100%; height:100%; object-fit:cover; }
        .hero__content{ position:relative; z-index:2; text-align:center; }
        .hero__title{ font-size:clamp(28px,4.8vw,44px); margin:10px 0 8px; letter-spacing:-.3px; }
        .hero__sub{ color:var(--muted); margin:0; }
        .ctas{ display:flex; gap:10px; justify-content:center; margin-top:12px; flex-wrap:wrap; }
        .rv{ opacity:0; transform: translateY(8px); transition: all .28s ease; }
        .rv-show{ opacity:1; transform:none; }

        .controls{ max-width:980px; margin:14px auto 0; padding:0 20px; }
        .controls .search input{ max-width:760px; margin:0 auto; display:block; }
        .controls .chips{ display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }

        .btn{ display:inline-flex; align-items:center; justify-content:center; padding:12px 18px; border-radius:999px; font-weight:600; letter-spacing:.3px; background:transparent; border:0; cursor:pointer; text-decoration:none; }
        .btn--primary{ background:var(--primary); color:var(--primary-contrast); }
        .btn--ghost{ color:var(--text); border:1px solid var(--text); background:transparent; }

        .stats{ max-width:980px; margin:24px auto 0; padding:0 20px; }
        .stat__num{ font-weight:800; }
        .container:first-of-type{ margin-top:8px; }
      `}</style>

      <header className={`nv ${scrolled ? "nv--s" : "nv--t"}`}>
        <div className="nv__in">
          <a href="#inicio" className="brand"><span className="brand__m">◆</span><span className="brand__t">Mi Blog</span></a>
          <nav className="nav" aria-label="Principal">
            <a className="link" href="#inicio">INICIO</a>
            <a className="link" href="#crear">CREAR</a>
            <a className="link" href="#articulos">ARTÍCULOS</a>
            <a className="link cta" href="#suscribirse">SUSCRIBIRSE</a>

            <button type="button" className="saved" onClick={()=>setOpenSaved(true)} aria-label="Abrir guardados">
              <span role="img" aria-hidden>🔖</span>
              <span>Guardados</span>
              <span className="badge">{savedCount}</span>
            </button>

            <button type="button" className="theme" onClick={toggleTheme} aria-pressed={theme==="dark"}>
              {theme==="dark" ? "🌙 Oscuro" : "🌞 Claro"}
            </button>
          </nav>
        </div>
      </header>

      {/* Ajustes visuales para la vista de post (#/post/*) */}
      <PostViewPolish />

      {/* Drawer de guardados */}
      <GuardadosDrawer open={openSaved} onClose={()=>setOpenSaved(false)} />

      {/* Atajos de teclado globales (no toca Pages) */}
      <Shortcuts onKey={(cmd) => {
        if (cmd === "new") location.hash = "#crear";
        if (cmd === "home") location.hash = "#inicio";
        if (cmd === "articles") location.hash = "#articulos";
        if (cmd === "theme") toggleTheme();
        if (cmd === "help") alert("Atajos:\n n = crear\n g h = inicio\n g a = artículos\n k = tema\n ? = ayuda");
      }} />
    </>
  );
};

export default Navbar;
