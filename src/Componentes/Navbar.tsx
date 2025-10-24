import React, { useEffect, useState } from "react";
import PostViewPolish from "./PostViewPolish";
import PostModal from "./PostModal";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Tema persistente
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  // Sombra / fondo al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

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
        .nav{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
        .link{position:relative;text-decoration:none;color:var(--text);font-size:12px;letter-spacing:1.4px;padding:10px 6px;}
        .link::after{content:"";position:absolute;left:6px;right:6px;bottom:6px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .2s;}
        .link:hover::after{transform:scaleX(1);}
        .cta{border:1px solid var(--text);padding:8px 10px;border-radius:10px;}
        .theme{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:12px;padding:8px 10px;cursor:pointer;font-weight:600;}

        /* ==== HOME / HERO FIXES ==== */
        .hero{ position:relative; isolation:isolate; }
        .hero__imgw{ position:absolute; inset:0; z-index:0; pointer-events:none; }
        .hero__img{ opacity:.22; }
        .hero__content{ position:relative; z-index:2; text-align:center; }

        .hero::after{
          content:""; position:absolute; inset:0; z-index:1; pointer-events:none;
          background: linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 34%);
        }
        [data-theme="dark"] .hero::after{
          background: linear-gradient(180deg, rgba(0,0,0,.28) 0%, rgba(0,0,0,0) 34%);
        }

        .ctas{ margin-top:24px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .btn{ display:inline-flex; align-items:center; justify-content:center;
              padding:12px 18px; border-radius:999px; font-weight:600; letter-spacing:.3px;
              background:transparent; border:0; cursor:pointer; text-decoration:none; }
        .btn--primary{ background:var(--primary); color:var(--primary-contrast); }
        .btn--ghost{ color:var(--text); border:1px solid var(--text); background:transparent; }

        .controls .search input{ max-width:760px; margin:0 auto; display:block; }
        .controls .chips{ justify-content:center; }

        .stats{ max-width:980px; margin:24px auto 0; }
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
            <button type="button" className="theme" onClick={toggleTheme} aria-pressed={theme==="dark"}>
              {theme==="dark" ? "🌙 Oscuro" : "🌞 Claro"}
            </button>
          </nav>
        </div>
      </header>

      {/* Pulido visual de la vista de post (#/post/*) sin tocar Pages */}
      <PostViewPolish />
      <PostModal />

    </>
  );
};

export default Navbar;
