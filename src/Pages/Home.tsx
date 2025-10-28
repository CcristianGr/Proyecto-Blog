import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard, { type Post } from "../components/PostCard";

/* ===== Helpers ===== */
const STORAGE_KEY = "user_posts_v3";
const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .toLowerCase().replace(/[^a-z0-9\s-]/g, "")
   .trim().replace(/\s+/g, "-");

const estimateReadingMins = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 180));

const loadUserPosts = (): Post[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};
const saveUserPosts = (list: Post[]) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {} };

const DEFAULT_COVER = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop";

/* ===== Demo (9 posts) ===== */
const demo: Post[] = [
  { id: 1, title:"Cómo empezar un blog en 2025", coverUrl:DEFAULT_COVER,
    excerpt:"Plataformas, dominios y primeros pasos para lanzar tu blog sin complicarte.",
    author:"Equipo Editorial", date:"2025-08-15", tags:["blogging","inicio"], initialLikes:12,
    readingMins:6, href:`#/post/${slugify("Cómo empezar un blog en 2025")}` },
  { id: 2, title:"Escribe mejores títulos: 7 fórmulas probadas",
    coverUrl:"https://images.unsplash.com/photo-1518933165971-611dbc9c412d?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Cómo llamar la atención sin caer en el clickbait. Ejemplos prácticos.",
    author:"Sebastián", date:"2025-07-03", tags:["copywriting","titulares"], initialLikes:5,
    readingMins:5, href:`#/post/${slugify("Escribe mejores títulos: 7 fórmulas probadas")}` },
  { id: 3, title:"Guía rápida de Markdown para tus artículos",
    coverUrl:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Atajos, listas, código y tablas: formatea más rápido y mejor.",
    author:"Ana María", date:"2025-06-20", tags:["markdown","productividad"], initialLikes:8,
    readingMins:4, href:`#/post/${slugify("Guía rápida de Markdown para tus artículos")}` },
  { id: 4, title:"SEO para principiantes: lo esencial",
    coverUrl:"https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Keywords, estructura y velocidad: el ABC para posicionar tu blog.",
    author:"Equipo Contenidos", date:"2025-05-12", tags:["seo","guía"], initialLikes:3,
    readingMins:7, href:`#/post/${slugify("SEO para principiantes: lo esencial")}` },
  { id: 5, title:"Fotografía para blogs: trucos sencillos",
    coverUrl:"https://images.unsplash.com/photo-1502899576159-f224dc2349fa?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Luz natural, encuadre y edición básica para imágenes que destaquen.",
    author:"Sebastián", date:"2025-04-30", tags:["fotografía","visual"], initialLikes:1,
    readingMins:3, href:`#/post/${slugify("Fotografía para blogs: trucos sencillos")}` },
  { id: 6, title:"Gestión del tiempo para creadores",
    coverUrl:"https://images.unsplash.com/photo-1497215641119-bbe6d71ebaae?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Rutinas, bloques de tiempo y herramientas que sí ayudan.",
    author:"Equipo", date:"2025-03-10", tags:["productividad","hábitos"], initialLikes:9,
    readingMins:6, href:`#/post/${slugify("Gestión del tiempo para creadores")}` },
  { id: 7, title:"Cómo elegir tu paleta de colores",
    coverUrl:"https://images.unsplash.com/photo-1526312426976-593c2c4b23f3?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Teoría del color básica y herramientas gratuitas para definir tu estilo.",
    author:"Lucía", date:"2025-02-17", tags:["diseño","branding"], initialLikes:2,
    readingMins:5, href:`#/post/${slugify("Cómo elegir tu paleta de colores")}` },
  { id: 8, title:"Plantillas de contenido para publicar cada semana",
    coverUrl:"https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Ideas repetibles para no quedarte en blanco: tutorial, lista, guía, opinión.",
    author:"Equipo", date:"2025-01-22", tags:["planificación","contenidos"], initialLikes:4,
    readingMins:5, href:`#/post/${slugify("Plantillas de contenido para publicar cada semana")}` },
  { id: 9, title:"Mejores bancos de imágenes gratis",
    coverUrl:"https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1600&auto=format&fit=crop",
    excerpt:"Fuentes legales y tips para encontrar fotos que destaquen.",
    author:"Ana María", date:"2024-12-10", tags:["recursos","visual"], initialLikes:6,
    readingMins:4, href:`#/post/${slugify("Mejores bancos de imágenes gratis")}` },
];

/* ===== Aparición on-scroll ===== */
const AnimateOnVisible: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("rv-show"); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="rv" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};

type SortKey = "new" | "likes" | "alpha" | "short";

/* ===== Home ===== */
export const Home: React.FC = () => {
  /* Estado */
  const [userPosts, setUserPosts] = useState<Post[]>(() => loadUserPosts());
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("new");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showDrafts, setShowDrafts] = useState(true);

  // edición
  const [editId, setEditId] = useState<string | number | null>(null);
  const isEditing = editId !== null;

  /* Mezcla: marcamos los del usuario */
  const posts = useMemo(() => {
    const withMark = userPosts.map(p => ({ ...p, isUser: true }));
    return [...withMark, ...demo];
  }, [userPosts]);

  /* Tags únicos para chips */
  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach(p => p.tags?.forEach(t => s.add(t)));
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [posts]);

  /* Búsqueda + filtros + ordenado */
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    let list = posts.filter(p => {
      const inText =
        !text ||
        p.title.toLowerCase().includes(text) ||
        p.excerpt.toLowerCase().includes(text) ||
        (p.author ?? "").toLowerCase().includes(text) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(text));
      const inTags = activeTags.length === 0 || (p.tags ?? []).some(t => activeTags.includes(t));
      const inDraft = showDrafts || !p.draft;
      return inText && inTags && inDraft;
    });

    list = [...list].sort((a, b) => {
      if (sort === "new") return (new Date(b.date||0).getTime()) - (new Date(a.date||0).getTime());
      if (sort === "likes") return (b.initialLikes ?? 0) - (a.initialLikes ?? 0);
      if (sort === "alpha") return a.title.localeCompare(b.title);
      if (sort === "short") return (a.readingMins ?? 0) - (b.readingMins ?? 0);
      return 0;
    });
    return list;
  }, [posts, q, activeTags, showDrafts, sort]);

  useEffect(() => { saveUserPosts(userPosts); }, [userPosts]);

  /* Parallax del hero */
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const el = imgRef.current;
        if (el) el.style.transform = `translateY(${Math.min(40, y * 0.15)}px) scale(1.05)`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ===== Formulario (crear/editar) ===== */
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (location.hash === "#crear") setFormOpen(true); }, []);
  const validate = () => {
    if (title.trim().length < 4) return "El título debe tener al menos 4 caracteres.";
    if (excerpt.trim().length < 20) return "El resumen debe tener al menos 20 caracteres.";
    const tagList = tags.split(",").map(s => s.trim()).filter(Boolean);
    if (tagList.length > 5) return "Máximo 5 etiquetas.";
    if (coverUrl && !/^https?:\/\/.+/i.test(coverUrl.trim()) && !coverUrl.startsWith("data:image/")) return "La URL de imagen no es válida.";
    return null;
  };
  const clearForm = () => { setTitle(""); setCoverUrl(""); setExcerpt(""); setTags(""); setIsDraft(false); setEditId(null); setError(null); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(); setError(err);
    if (err) return;

    const now = new Date();
    const tagList = tags.split(",").map(s => s.trim()).filter(Boolean);
    const base: Post = {
      id: isEditing ? (editId as number) : Date.now(),
      title: title.trim(),
      coverUrl: coverUrl.trim() || DEFAULT_COVER,
      excerpt: excerpt.trim(),
      author: "Tú",
      date: now.toISOString(),
      tags: tagList,
      initialLikes: isEditing ? (userPosts.find(p => p.id === editId)?.initialLikes ?? 0) : 0,
      href: `#/post/${slugify(title)}`,
      readingMins: estimateReadingMins(excerpt),
      draft: isDraft,
    };

    if (isEditing) {
      setUserPosts(prev => prev.map(p => (p.id === editId ? base : p)));
      alert("Artículo actualizado ✔");
    } else {
      setUserPosts(prev => [base, ...prev]);
      alert(isDraft ? "Borrador guardado ✔" : "Artículo publicado ✔");
    }
    clearForm();
    setFormOpen(false);
    document.getElementById("articulos")?.scrollIntoView({ behavior: "smooth" });
  };

  const startEdit = (p: Post) => {
    setTitle(p.title); setCoverUrl(p.coverUrl); setExcerpt(p.excerpt); setTags((p.tags ?? []).join(", "));
    setIsDraft(!!p.draft); setEditId(p.id); setFormOpen(true);
    document.getElementById("crear")?.scrollIntoView({ behavior: "smooth" });
  };
  const removePost = (p: Post) => {
    if (!confirm(`¿Eliminar "${p.title}"?`)) return;
    setUserPosts(prev => prev.filter(x => x.id !== p.id));
  };

  const dropRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = dropRef.current; if (!el) return;
    const over = (e: DragEvent) => { e.preventDefault(); el.classList.add("dz--on"); };
    const leave = (e: DragEvent) => { e.preventDefault(); el.classList.remove("dz--on"); };
    const drop = (e: DragEvent) => {
      e.preventDefault(); el.classList.remove("dz--on");
      const f = e.dataTransfer?.files?.[0];
      if (f && f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setCoverUrl(String(reader.result));
        reader.readAsDataURL(f);
      }
    };
    el.addEventListener("dragover", over); el.addEventListener("dragleave", leave); el.addEventListener("drop", drop);
    return () => { el.removeEventListener("dragover", over); el.removeEventListener("dragleave", leave); el.removeEventListener("drop", drop); };
  }, []);

  /* Contadores */
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [animateStats, setAnimateStats] = useState(false);
  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting){ setAnimateStats(true); io.disconnect(); } }, {threshold:0.3});
    io.observe(el); return () => io.disconnect();
  }, []);
  const totalUser = userPosts.length;
  const totalAll = posts.length;
  const totalTags = allTags.length;

  return (
    <>
      {/* NAV */}
      <Navbar />

      <style>{`
        .rv{opacity:0;transform:translateY(16px);transition:opacity .5s,transform .5s;}
        .rv-show{opacity:1;transform:none;}
        @media (prefers-reduced-motion:reduce){.rv{transition:none;transform:none;opacity:1}}

        .container{width:100%;max-width:1160px;margin:0 auto;padding:0 20px;}

        .hero{position:relative;background:linear-gradient(180deg,var(--bg-soft) 0%,var(--bg) 100%);overflow:clip;}
        .hero__imgw{position:absolute;inset:0;pointer-events:none;}
        .hero__img{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(1.05);
          min-width:110%;min-height:110%;object-fit:cover;opacity:.25;transition:transform .2s linear;filter:saturate(115%);}
        .hero__content{position:relative;z-index:1;text-align:center;padding:96px 20px 64px;}
        .hero__title{margin:0;font-size:clamp(32px,6vw,56px);line-height:1.1;letter-spacing:-.5px;color:var(--text);}
        .hero__sub{margin:16px auto 0;font-size:18px;color:var(--muted);max-width:780px;}
        .ctas{margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .btn{text-decoration:none;display:inline-block;padding:12px 18px;border-radius:999px;font-weight:600;letter-spacing:.3px;}
        .btn--primary{color:var(--primary-contrast);background:var(--primary);}
        .btn--ghost{color:var(--text);border:1px solid var(--text);}

        .controls{display:grid;gap:12px;grid-template-columns:1fr;padding:16px 0 0;}
        .controls__bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between;margin-top:8px;}
        .search input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--text);}
        .select{border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--card);color:var(--text);}
        .chips{display:flex;gap:8px;flex-wrap:wrap;}
        .chip{border:1px solid var(--border);padding:7px 12px;border-radius:999px;font-size:13px;color:var(--text);background:transparent;cursor:pointer;transition:transform .12s,background .2s;}
        .chip:hover{transform:translateY(-2px);background:var(--chip-bg);} .chip--on{background:var(--primary);color:var(--primary-contrast);border-color:var(--primary);}

        .create{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--shadow);margin-top:10px;}
        .create h3{margin:0 0 8px;color:var(--text);}
        .row{display:grid;gap:10px;grid-template-columns:1fr 1fr;}
        .row-1{display:grid;gap:10px;grid-template-columns:1fr;}
        .field{display:flex;flex-direction:column;gap:6px;}
        .field label{font-size:13px;color:var(--muted-2);}
        .field input,.field textarea{padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);}
        .check{display:flex;align-items:center;gap:8px;color:var(--muted);}
        .count{font-size:12px;color:var(--muted-2);}
        .actions{display:flex;gap:10px;justify-content:flex-end;margin-top:10px;}
        .error{color:#b91c1c;font-size:13px;margin-top:6px;}
        .dz{border:1px dashed var(--border);border-radius:12px;padding:10px;text-align:center;color:var(--muted);font-size:13px;}
        .dz--on{background:var(--bg-soft);}

        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:22px 0 6px;text-align:center;}
        .stat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--shadow);}
        .stat__num{font-size:28px;font-weight:800;color:var(--text);} .stat__sub{color:var(--muted);}
        @media (max-width:900px){ .stats{grid-template-columns:1fr;} }

        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
        .user-toolbar{display:flex;gap:10px;margin-top:8px;justify-content:flex-end;}
        .link-reset{background:transparent;border:0;text-decoration:underline;color:var(--text);cursor:pointer;}
        .metaBar{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;align-items:center;color:var(--muted);font-size:14px;margin:8px 0 18px;}
      `}</style>

      {/* HERO */}
      <section id="inicio" className="hero">
        <div className="hero__imgw" aria-hidden>
          <img ref={imgRef} className="hero__img" src={DEFAULT_COVER} alt="" />
        </div>
        <div className="hero__content">
          <h1 className="hero__title rv rv-show">Ideas, historias y recursos para crear</h1>
          <p className="hero__sub rv rv-show" style={{ transitionDelay: "120ms" }}>
            Diseño limpio, animaciones sutiles y herramientas listas para hacer crecer tu blog.
          </p>
          <div className="ctas rv rv-show" style={{ transitionDelay: "220ms" }}>
            <a href="#articulos" className="btn btn--primary">Ver artículos</a>
            <a href="#crear" className="btn btn--ghost" onClick={() => setFormOpen(true)}>Crear artículo</a>
          </div>
        </div>
      </section>

      {/* CONTROLES */}
      <section className="container">
        <div className="controls">
          <div className="search" role="search">
            <input type="search" placeholder="Buscar (título, autor o etiqueta)…" value={q}
                   onChange={(e) => setQ(e.target.value)} aria-label="Buscar artículos" />
          </div>

          <div className="controls__bar">
            <div className="chips" aria-label="Filtrar por etiquetas">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`chip ${activeTags.includes(tag) ? "chip--on" : ""}`}
                  onClick={() => setActiveTags(p => p.includes(tag) ? p.filter(t => t!==tag) : [...p, tag])}
                  aria-pressed={activeTags.includes(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <label htmlFor="sort" style={{ color:"var(--muted-2)", fontSize:13 }}>Ordenar</label>
              <select id="sort" className="select" value={sort} onChange={(e)=>setSort(e.target.value as SortKey)}>
                <option value="new">Más recientes</option>
                <option value="likes">Más gustados</option>
                <option value="alpha">A → Z</option>
                <option value="short">Lectura corta</option>
              </select>
              <label className="check">
                <input type="checkbox" checked={showDrafts} onChange={(e)=>setShowDrafts(e.target.checked)} />
                Mostrar borradores
              </label>
            </div>
          </div>

          <div id="crear" />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setFormOpen(v => !v)}
            aria-expanded={formOpen}
            style={{ alignSelf:"flex-start", marginTop: 8 }}
          >
            {formOpen ? "Ocultar formulario" : "Crear artículo"}
          </button>
        </div>

        {/* FORM (crear/editar) */}
        {formOpen && (
          <AnimateOnVisible>
            <form className="create" onSubmit={submit}>
              <h3>{isEditing ? "Editar artículo" : "Nuevo artículo"}</h3>
              <div className="row">
                <div className="field">
                  <label htmlFor="title">Título *</label>
                  <input id="title" value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Ej: Mi primer post" />
                </div>
                <div className="field">
                  <label htmlFor="tags">Etiquetas (coma, máx. 5)</label>
                  <input id="tags" value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="blogging, productividad" />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label htmlFor="cover">Imagen (URL o suéltala debajo)</label>
                  <input id="cover" value={coverUrl} onChange={(e)=>setCoverUrl(e.target.value)} placeholder="https://..." />
                  <div ref={dropRef} className="dz" style={{ marginTop: 8 }}>
                    Arrastra una imagen aquí o pega una URL arriba
                  </div>
                </div>
                <div className="field">
                  <label>Preview</label>
                  <div style={{ border:`1px solid var(--border)`, borderRadius:12, overflow:"hidden", background:"var(--bg-soft)" }}>
                    <div style={{ position:"relative", paddingTop:"56%" }}>
                      <img src={coverUrl || DEFAULT_COVER} alt="Preview" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row-1" style={{ marginTop: 10 }}>
                <div className="field">
                  <label htmlFor="excerpt">Resumen / Intro *</label>
                  <textarea id="excerpt" value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} rows={3} required placeholder="Escribe un resumen breve..." />
                  <span className="count">{excerpt.trim().split(/\s+/).filter(Boolean).length} palabras · {estimateReadingMins(excerpt)} min</span>
                </div>
              </div>

              <div className="check" style={{ marginTop: 6 }}>
                <input id="draft" type="checkbox" checked={isDraft} onChange={(e)=>setIsDraft(e.target.checked)} />
                <label htmlFor="draft">Guardar como borrador</label>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="actions">
                {isEditing && <button type="button" className="btn btn--ghost" onClick={clearForm}>Cancelar edición</button>}
                <button type="button" className="btn btn--ghost" onClick={()=>{ setTitle(""); setCoverUrl(""); setExcerpt(""); setTags(""); setIsDraft(false); }}>Limpiar</button>
                <button type="submit" className="btn btn--primary">{isEditing ? "Guardar cambios" : (isDraft ? "Guardar borrador" : "Publicar")}</button>
              </div>
            </form>
          </AnimateOnVisible>
        )}
      </section>

      {/* MÉTRICAS */}
      <section className="container" ref={statsRef} style={{ padding: "20px 0 6px" }}>
        <div className="stats">
          <div className="stat"><div className="stat__num">{animateStats ? totalAll : 0}+</div><div className="stat__sub">Artículos disponibles</div></div>
          <div className="stat"><div className="stat__num">{animateStats ? totalUser : 0}</div><div className="stat__sub">Artículos creados por ti</div></div>
          <div className="stat"><div className="stat__num">{animateStats ? totalTags : 0}</div><div className="stat__sub">Etiquetas activas</div></div>
        </div>
      </section>

      {/* LISTA */}
      <section id="articulos" className="container" style={{ padding: "12px 0 70px" }}>
        <div className="metaBar" aria-live="polite">
          <span>{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</span>
          {(q || activeTags.length>0) ? (
            <button className="link-reset" onClick={() => { setQ(""); setActiveTags([]); }}>Limpiar filtros</button>
          ) : <span />}
        </div>

        <div className="grid">
          {filtered.map((p, i) => (
            <AnimateOnVisible key={p.id} delay={i * 60}>
              <div>
                <PostCard post={p} />
                {p.isUser && (
                  <div className="user-toolbar">
                    <button className="link-reset" onClick={() => startEdit(p)}>{p.draft ? "Editar borrador" : "Editar"}</button>
                    {p.draft ? (
                      <button className="link-reset" onClick={() => { setEditId(p.id); setIsDraft(false); setFormOpen(true); }}>Publicar</button>
                    ) : null}
                    <button className="link-reset" onClick={() => removePost(p)}>Eliminar</button>
                  </div>
                )}
              </div>
            </AnimateOnVisible>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="suscribirse" className="container" style={{ padding: "0 0 60px" }}>
        <AnimateOnVisible>
          <div style={{
            background:"var(--card)", border:`1px solid var(--border)`, borderRadius:16,
            padding:20, boxShadow:"var(--shadow)", display:"flex", gap:12, alignItems:"center",
            justifyContent:"space-between", flexWrap:"wrap"
          }}>
            <div style={{ color:"var(--muted)" }}>
              <strong style={{ color:"var(--text)" }}>¿Listo para escribir?</strong> Crea tu primer artículo en minutos.
            </div>
            <form onSubmit={(e)=>{e.preventDefault(); alert("¡Gracias! Revisa tu correo para confirmar.");}}>
              <input required type="email" placeholder="tu@email"
                     style={{ padding:"10px 12px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", marginRight:8 }} />
              <button className="btn btn--primary" type="submit" style={{ textDecoration:"none" }}>Suscribirme</button>
            </form>
          </div>
        </AnimateOnVisible>
      </section>
    </>
  );
};
