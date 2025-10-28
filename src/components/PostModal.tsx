import React, { useEffect, useMemo, useRef, useState } from "react";
import { type Post } from "./PostCard";

/* ================= Utilidades ================= */
const STORAGE_KEY = "user_posts_v3";
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop";

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

type PostWithContent = Post & { content: string[]; slug: string };

const getUserPosts = (): Post[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

/* =============== Datos demo (misma lista que Home) =============== */
const demoList: Post[] = [
  {
    id: 1,
    title: "Cómo empezar un blog en 2025",
    coverUrl: DEFAULT_COVER,
    excerpt:
      "Plataformas, dominios y primeros pasos para lanzar tu blog sin complicarte.",
    author: "Equipo Editorial",
    date: "2025-08-15",
    tags: ["blogging", "inicio"],
    initialLikes: 12,
    readingMins: 6,
    href: "#/post/como-empezar-un-blog-en-2025",
  },
  {
    id: 2,
    title: "Escribe mejores títulos: 7 fórmulas probadas",
    coverUrl:
      "https://images.unsplash.com/photo-1518933165971-611dbc9c412d?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Cómo llamar la atención sin caer en el clickbait. Ejemplos prácticos.",
    author: "Sebastián",
    date: "2025-07-03",
    tags: ["copywriting", "titulares"],
    initialLikes: 5,
    readingMins: 5,
    href: "#/post/escribe-mejores-titulos-7-formulas-probadas",
  },
  {
    id: 3,
    title: "Guía rápida de Markdown para tus artículos",
    coverUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Atajos, listas, código y tablas: formatea más rápido y mejor.",
    author: "Ana María",
    date: "2025-06-20",
    tags: ["markdown", "productividad"],
    initialLikes: 8,
    readingMins: 4,
    href: "#/post/guia-rapida-de-markdown-para-tus-articulos",
  },
  {
    id: 4,
    title: "SEO para principiantes: lo esencial",
    coverUrl:
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Keywords, estructura y velocidad: el ABC para posicionar tu blog.",
    author: "Equipo Contenidos",
    date: "2025-05-12",
    tags: ["seo", "guia"],
    initialLikes: 3,
    readingMins: 7,
    href: "#/post/seo-para-principiantes-lo-esencial",
  },
  {
    id: 5,
    title: "Fotografía para blogs: trucos sencillos",
    coverUrl:
      "https://images.unsplash.com/photo-1502899576159-f224dc2349fa?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Luz natural, encuadre y edición básica para imágenes que destaquen.",
    author: "Sebastián",
    date: "2025-04-30",
    tags: ["fotografia", "visual"],
    initialLikes: 1,
    readingMins: 3,
    href: "#/post/fotografia-para-blogs-trucos-sencillos",
  },
  {
    id: 6,
    title: "Gestión del tiempo para creadores",
    coverUrl:
      "https://images.unsplash.com/photo-1497215641119-bbe6d71ebaae?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Rutinas, bloques de tiempo y herramientas que sí ayudan.",
    author: "Equipo",
    date: "2025-03-10",
    tags: ["productividad", "habitos"],
    initialLikes: 9,
    readingMins: 6,
    href: "#/post/gestion-del-tiempo-para-creadores",
  },
  {
    id: 7,
    title: "Cómo elegir tu paleta de colores",
    coverUrl:
      "https://images.unsplash.com/photo-1526312426976-593c2c4b23f3?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Teoría del color y herramientas gratuitas para definir tu estilo.",
    author: "Lucía",
    date: "2025-02-17",
    tags: ["diseno", "branding"],
    initialLikes: 2,
    readingMins: 5,
    href: "#/post/como-elegir-tu-paleta-de-colores",
  },
  {
    id: 8,
    title: "Plantillas de contenido para publicar cada semana",
    coverUrl:
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Ideas repetibles para no quedarte en blanco: tutorial, lista, guía, opinión.",
    author: "Equipo",
    date: "2025-01-22",
    tags: ["planificacion", "contenidos"],
    initialLikes: 4,
    readingMins: 5,
    href: "#/post/plantillas-de-contenido-para-publicar-cada-semana",
  },
  {
    id: 9,
    title: "Mejores bancos de imágenes gratis",
    coverUrl:
      "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "Fuentes legales y tips para encontrar fotos que destaquen.",
    author: "Ana María",
    date: "2024-12-10",
    tags: ["recursos", "visual"],
    initialLikes: 6,
    readingMins: 4,
    href: "#/post/mejores-bancos-de-imagenes-gratis",
  },
];

/* ====== Cuerpos demo (sin propiedades calculadas) ====== */
const demoBodies = [
  {
    slug: "como-empezar-un-blog-en-2025",
    body: [
      "Empezar un blog es más fácil que nunca. Define el tema y el público: qué problema ayudas a resolver.",
      "Elige una plataforma simple y crea el hábito: un artículo por semana gana a diez en un día.",
      "Optimiza lo básico: imágenes livianas, títulos descriptivos y enlazado interno.",
    ],
  },
  {
    slug: "escribe-mejores-titulos-7-formulas-probadas",
    body: [
      "Los títulos deciden el clic. Usa números, promesas concretas y beneficios claros.",
      "Evita el clickbait. Cumple lo que prometes y mide el CTR para mejorar.",
    ],
  },
  {
    slug: "guia-rapida-de-markdown-para-tus-articulos",
    body: [
      "Markdown permite dar formato sin distraerte. Con pocos símbolos logras títulos, listas y citas.",
      "Usa almohadillas para títulos y asteriscos para énfasis. Mantén párrafos cortos.",
    ],
  },
  {
    slug: "seo-para-principiantes-lo-esencial",
    body: [
      "El SEO empieza con la intención de búsqueda. Responde preguntas reales con claridad.",
      "Cuida estructura (H1/H2), enlazado interno, velocidad y metadata. Actualiza tus guías.",
    ],
  },
  {
    slug: "fotografia-para-blogs-trucos-sencillos",
    body: [
      "La luz natural ayuda. Busca ventanas laterales y evita el mediodía.",
      "Cuida el encuadre y edita con ajustes sutiles de exposición y contraste.",
    ],
  },
  {
    slug: "gestion-del-tiempo-para-creadores",
    body: [
      "Reserva bloques sin interrupciones para investigar, escribir y editar.",
      "Agrupa tareas pequeñas para no perder foco y deja un siguiente paso claro.",
    ],
  },
  {
    slug: "como-elegir-tu-paleta-de-colores",
    body: [
      "Tu paleta define la personalidad del blog. Empieza con un color principal y uno de acento.",
      "Testea contraste para accesibilidad y sé consistente en botones y enlaces.",
    ],
  },
  {
    slug: "plantillas-de-contenido-para-publicar-cada-semana",
    body: [
      "Crea 4 formatos base: tutorial, lista, guía y opinión; rota cada semana.",
      "Usa una checklist de publicación para acelerar y mantener la calidad.",
    ],
  },
  {
    slug: "mejores-bancos-de-imagenes-gratis",
    body: [
      "Hay bancos con fotos de calidad y licencias claras. Guarda tus favoritos.",
      "Optimiza el peso antes de subir y respeta atribuciones cuando correspondan.",
    ],
  },
];

/* ===== Construcción de lista completa ===== */
const buildAllPosts = (): PostWithContent[] => {
  const users = getUserPosts().map<PostWithContent>((p) => ({
    ...p,
    slug: slugify(p.title),
    content:
      (p as any).content && typeof (p as any).content === "string"
        ? String((p as any).content)
            .split(/\n{2,}/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [
            p.excerpt,
            "Este es el cuerpo del artículo. Amplía tu resumen con ejemplos, pasos y recursos.",
            "Consejo: usa subtítulos, listas y una llamada a la acción al final.",
          ],
  }));

  const demos = demoList.map<PostWithContent>((p) => {
    const slug = p.href?.replace(/^#\/post\//, "") || slugify(p.title);
    const found = demoBodies.find((d) => d.slug === slug);
    return { ...p, slug, content: found ? found.body : [p.excerpt] };
  });

  return [...users.map((x) => ({ ...x, isUser: true })), ...demos];
};

/* ==================== Modal ==================== */
const PostModal: React.FC = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [all, setAll] = useState<PostWithContent[]>(() => buildAllPosts());
  const contentRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  // Detectar #/post/<slug>
  useEffect(() => {
    const handle = () => {
      const m = location.hash.match(/#\/post\/([^?]+)/i);
      setSlug(m ? decodeURIComponent(m[1]) : null);
    };
    handle();
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);

  // Refrescar si cambia localStorage
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setAll(buildAllPosts());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Bloquear scroll fondo
  useEffect(() => {
    if (slug) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-modal", "1");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal");
    };
  }, [slug]);

  const post = useMemo(
    () => (slug ? all.find((p) => p.slug === slug) ?? null : null),
    [slug, all]
  );

  const idx = useMemo(
    () => (post ? all.findIndex((p) => p.slug === post.slug) : -1),
    [post, all]
  );

  const close = () => {
    location.hash = "#articulos";
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: post?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles.");
      }
    } catch {
      /* noop */
    }
  };

  // Progreso de lectura interno
  useEffect(() => {
    if (!slug) return;
    const el = contentRef.current;
    const bar = barRef.current;
    const onScroll = () => {
      if (!el || !bar) return;
      const total = el.scrollHeight - el.clientHeight || 1;
      const p = Math.min(100, Math.max(0, (el.scrollTop / total) * 100));
      bar.style.width = `${p}%`;
    };
    onScroll();
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, [slug]);

  // Accesos rápidos
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && slug) close();
      if (!post) return;
      if (e.key === "ArrowRight" && idx < all.length - 1)
        location.hash = `#/post/${all[idx + 1].slug}`;
      if (e.key === "ArrowLeft" && idx > 0)
        location.hash = `#/post/${all[idx - 1].slug}`;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, idx, all, post]);

  if (!slug || !post) return null;

  return (
    <>
      <style>{`
        body[data-modal="1"] .rp{ display:none !important; }

        .pm{ position:fixed; inset:0; z-index:70; display:grid; place-items:center; }
        .pm__bg{ position:absolute; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(2px); }
        .pm__dlg{
          position:relative; width:min(940px, 94vw); max-height:calc(100vh - 80px);
          background:var(--card); color:var(--text); border:1px solid var(--border);
          border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,.25); overflow:hidden;
          display:flex; flex-direction:column;
        }
        .pm__bar{ position:absolute; top:0; left:0; height:3px; width:0%; background:var(--primary); }
        .pm__cover{ width:100%; aspect-ratio:21/9; object-fit:cover; display:block; }
        .pm__inner{ padding:16px; overflow:auto; }
        .pm__head{ text-align:center; padding:6px 10px 2px; }
        .pm__title{ margin:8px 0 6px; font-size:clamp(26px, 4.8vw, 38px); line-height:1.15; letter-spacing:-.2px; }
        .pm__meta{ color:var(--muted-2); font-size:14px; }
        .pm__tags{ display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin:8px 0 14px; }
        .pm__tag{ border:1px solid var(--border); padding:6px 10px; border-radius:999px; font-size:12px; color:var(--text); }

        .pm__content{ max-width:760px; margin:0 auto; }
        .pm__content p{ margin:0 0 14px; line-height:1.8; color:var(--muted); font-size:18px; }
        .pm__content h2{ margin:22px 0 8px; font-size:24px; line-height:1.25; }

        .pm__actions{ display:flex; gap:8px; justify-content:space-between; align-items:center; margin:8px 0 14px; }
        .pm__btn{ border:1px solid var(--border); background:transparent; color:var(--text);
                  border-radius:12px; padding:10px 12px; font-weight:600; cursor:pointer; }
        .pm__btn--primary{ background:var(--primary); color:var(--primary-contrast); border-color:var(--primary); }
        .pm__close{ position:absolute; top:10px; right:10px; border:0; background:rgba(0,0,0,.5); color:#fff;
                    width:36px; height:36px; border-radius:999px; font-size:18px; cursor:pointer; }

        @media (max-width:700px){
          .pm__inner{ padding:10px; }
          .pm__title{ font-size:clamp(22px, 6vw, 30px); }
        }
      `}</style>

      <div className="pm" role="dialog" aria-modal="true" aria-label={post.title}>
        <div className="pm__bg" onClick={close} />
        <div className="pm__dlg">
          <div ref={barRef} className="pm__bar" />
          <button className="pm__close" onClick={close} aria-label="Cerrar">✕</button>

          <img className="pm__cover" src={post.coverUrl || DEFAULT_COVER} alt={post.title} />

          <div ref={contentRef} className="pm__inner">
            <header className="pm__head">
              <div className="pm__tags">
                {(post.tags ?? []).map((t) => (
                  <span key={t} className="pm__tag">#{t}</span>
                ))}
              </div>
              <h1 className="pm__title">{post.title}</h1>
              <div className="pm__meta">
                {post.author ?? "Autor"} ·{" "}
                {post.date ? new Date(post.date).toLocaleDateString() : ""} ·{" "}
                {(post.readingMins ??
                  Math.max(
                    1,
                    Math.round(post.content.join(" ").split(/\s+/).length / 180)
                  ))}{" "}
                min de lectura
              </div>
            </header>

            <div className="pm__actions">
              <button className="pm__btn" onClick={close}>← Volver</button>
              <div style={{display:"flex", gap:8}}>
                {idx > 0 && (
                  <button
                    className="pm__btn"
                    onClick={() => (location.hash = `#/post/${all[idx - 1].slug}`)}
                  >
                    ← Anterior
                  </button>
                )}
                {idx < all.length - 1 && (
                  <button
                    className="pm__btn"
                    onClick={() => (location.hash = `#/post/${all[idx + 1].slug}`)}
                  >
                    Siguiente →
                  </button>
                )}
                <button className="pm__btn pm__btn--primary" onClick={share}>
                  Compartir
                </button>
              </div>
            </div>

            <section className="pm__content">
              {post.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModal;
