import React, { useEffect, useMemo, useRef, useState } from "react";

export interface Post {
  id: string | number;
  title: string;
  coverUrl: string;
  excerpt: string;
  author?: string;
  date?: string;        // ISO o texto
  tags?: string[];
  initialLikes?: number;
  href?: string;        // hash/slug
  readingMins?: number; // opcional
  isUser?: boolean;     // creado por el usuario
  draft?: boolean;      // estado (borrador)
  body?: string;        // (por si viene del creador)
}

type Props = {
  post: Post;
  onLikeChange?: (id: Post["id"], liked: boolean, likes: number) => void;
};

const SAVED_KEY = "saved_posts_v1";

function readSaved(): Array<{id: string|number; title: string; href?: string; coverUrl?: string}> {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
}
function writeSaved(list: Array<{id: string|number; title: string; href?: string; coverUrl?: string}>) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch {}
}
function isSaved(id: string|number) {
  return readSaved().some(x => String(x.id) === String(id));
}

const PostCard: React.FC<Props> = ({ post, onLikeChange }) => {
  // === Likes (antirrebote) ===
  const storageKey = useMemo(() => `post:${post.id}`, [post.id]);
  const clickGuard = useRef(false);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(post.initialLikes ?? 0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        setLiked(!!data.liked);
        setLikes(typeof data.likes === "number" ? data.likes : (post.initialLikes ?? 0));
      }
    } catch {}
  }, [storageKey, post.initialLikes]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ liked, likes })); } catch {}
  }, [liked, likes, storageKey]);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (clickGuard.current) return;
    clickGuard.current = true;
    setLiked(prev => {
      const next = !prev;
      setLikes(prevLikes => {
        const nextLikes = next ? prevLikes + 1 : Math.max(0, prevLikes - 1);
        onLikeChange?.(post.id, next, nextLikes);
        return nextLikes;
      });
      return next;
    });
    setTimeout(() => { clickGuard.current = false; }, 200);
  };

  // === Guardar / Compartir ===
  const [saved, setSaved] = useState<boolean>(() => isSaved(post.id));
  useEffect(() => setSaved(isSaved(post.id)), [post.id]);

  const toggleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    const list = readSaved();
    const idx = list.findIndex(x => String(x.id) === String(post.id));
    if (idx >= 0) {
      list.splice(idx, 1);
      writeSaved(list);
      setSaved(false);
      window.dispatchEvent(new CustomEvent("saved:changed"));
      return;
    }
    list.unshift({ id: post.id, title: post.title, href: post.href, coverUrl: post.coverUrl });
    writeSaved(list);
    setSaved(true);
    window.dispatchEvent(new CustomEvent("saved:changed"));
  };

  const share = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    const url = post.href ? (new URL(post.href, location.href)).toString() : location.href;
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.excerpt, url });
      else {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado ✅");
      }
    } catch {}
  };

  const href = post.href ?? "#";

  return (
    <>
      <style>{`
        .pc{
          display:flex;flex-direction:column;background:var(--card);border-radius:16px;
          border:1px solid var(--border);box-shadow:var(--shadow);transition:transform .15s,box-shadow .15s;
          overflow:visible; /* << no recorta el contenido */
        }
        .pc:hover{transform:translateY(-4px);box-shadow:0 16px 38px rgba(0,0,0,.10);}

        .pc__imgw{
          position:relative;width:100%;padding-top:62%;background:var(--chip-bg);overflow:hidden;
          border-top-left-radius:16px;border-top-right-radius:16px; /* la imagen sí recorta esquinas */
        }
        .pc__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1);transition:transform .45s;}
        .pc:hover .pc__img{transform:scale(1.04);}
        .pc__badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.65);color:#fff;
                   padding:4px 10px;border-radius:999px;font-size:12px;letter-spacing:.2px}

        .pc__body{display:flex;flex-direction:column;gap:10px;padding:18px;}
        .pc__title{margin:0;font-size:20px;line-height:1.25;color:var(--text);font-weight:800;}
        .pc__ex{margin:0;color:var(--muted);font-size:14px;}
        .pc__meta{margin-top:8px;display:flex;align-items:center;gap:8px;color:var(--muted-2);font-size:12px;flex-wrap:wrap;}

        /* --- Footer flexible sin cortes --- */
        .pc__foot{
          display:flex;align-items:center;justify-content:space-between;padding:12px 18px 18px;
          flex-wrap:wrap; gap:10px; /* permite que baje a otra línea */
        }
        .pc__tags{display:flex;gap:8px;flex-wrap:wrap;flex:1 1 260px;min-width:200px;}
        .pc__tag{border:1px solid var(--border);padding:4px 10px;border-radius:999px;font-size:12px;color:var(--text);}

        .pc__btns{display:flex;gap:8px;align-items:center;flex:1 1 240px;justify-content:flex-end;flex-wrap:wrap;}
        .pc__btn{
          display:inline-flex;align-items:center;gap:8px;border-radius:999px;border:1px solid var(--border);
          background:transparent;color:var(--text);padding:8px 12px;cursor:pointer;font-weight:600;
          transition:background .2s,transform .06s; white-space:nowrap; /* no parte la palabra "Compartir" */
        }
        .pc__btn:active{transform:scale(.98);}
        .pc__like--on{background:var(--chip-bg);}
        .pc__save--on{outline:2px solid var(--primary);}

        @media (max-width: 1200px){
          .pc__btn{ padding:6px 10px; }
        }
      `}</style>

      <article className="pc" aria-label={`Post ${post.title}`}>
        <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="pc__imgw">
            {post.isUser && post.draft && <span className="pc__badge">Borrador</span>}
            <img className="pc__img" src={post.coverUrl} alt={post.title} loading="lazy" decoding="async" />
          </div>
          <div className="pc__body">
            <h3 className="pc__title">{post.title}</h3>
            <p className="pc__ex">{post.excerpt}</p>
            <div className="pc__meta">
              <span>{post.author ?? "Autor"}</span>
              {post.date && (<><span aria-hidden>•</span><span>{new Date(post.date).toLocaleDateString()}</span></>)}
              {typeof post.readingMins === "number" && (<><span aria-hidden>•</span><span>{post.readingMins} min</span></>)}
            </div>
          </div>
        </a>

        <div className="pc__foot">
          <div className="pc__tags">{post.tags?.map(t => <span className="pc__tag" key={t}>#{t}</span>)}</div>
          <div className="pc__btns">
            <button type="button" className={`pc__btn ${liked ? "pc__like--on" : ""}`} onClick={handleLike}
                    aria-pressed={liked} aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}>
              <span role="img" aria-hidden>♡</span><span>{likes}</span>
            </button>
            <button type="button" className={`pc__btn ${saved ? "pc__save--on" : ""}`} onClick={toggleSave}
                    aria-pressed={saved} aria-label={saved ? "Quitar guardado" : "Guardar"}>
              <span role="img" aria-hidden>🔖</span><span>{saved ? "Guardado" : "Guardar"}</span>
            </button>
            <button type="button" className="pc__btn" onClick={share} aria-label="Compartir">
              <span role="img" aria-hidden>↗</span><span>Compartir</span>
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostCard;
