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
}

interface PostCardProps {
  post: Post;
  onLikeChange?: (postId: Post["id"], liked: boolean, likes: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLikeChange }) => {
  const storageKey = useMemo(() => `post_like_${post.id}`, [post.id]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.initialLikes ?? 0);
  const clickGuard = useRef(false);

  // Cargar estado guardado
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved) as { liked: boolean; likes: number };
        setLiked(!!data.liked);
        setLikes(typeof data.likes === "number" ? data.likes : (post.initialLikes ?? 0));
      }
    } catch {}
  }, [storageKey, post.initialLikes]);

  // Guardar estado
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ liked, likes })); } catch {}
  }, [liked, likes, storageKey]);

  // Antirrebote de clic (evita sumar de más)
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

  const href = post.href ?? "#";

  return (
    <>
      <style>{`
        .pc{display:flex;flex-direction:column;background:var(--card);border-radius:16px;overflow:hidden;
            border:1px solid var(--border);box-shadow:var(--shadow);transition:transform .15s,box-shadow .15s;}
        .pc:hover{transform:translateY(-4px);box-shadow:0 16px 38px rgba(0,0,0,.10);}
        .pc__imgw{position:relative;width:100%;padding-top:62%;background:var(--bg-soft);overflow:hidden;}
        .pc__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1);transition:transform .45s;}
        .pc:hover .pc__img{transform:scale(1.04);}
        .pc__badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.65);color:#fff;
                   padding:4px 10px;border-radius:999px;font-size:12px;letter-spacing:.2px}
        .pc__body{display:flex;flex-direction:column;gap:10px;padding:20px;}
        .pc__title{margin:0;font-size:20px;line-height:1.2;color:var(--text);font-weight:700;}
        .pc__ex{margin:0;color:var(--muted);font-size:14px;}
        .pc__meta{margin-top:8px;display:flex;align-items:center;gap:8px;color:var(--muted-2);font-size:12px;}
        .pc__foot{display:flex;justify-content:space-between;align-items:center;padding:12px 20px 18px;}
        .pc__tags{display:flex;gap:8px;flex-wrap:wrap;}
        .pc__tag{border:1px solid var(--border);padding:4px 10px;border-radius:999px;font-size:12px;color:var(--text);}
        .pc__like{display:inline-flex;align-items:center;gap:8px;border-radius:999px;border:1px solid var(--border);
                  background:transparent;color:var(--text);padding:8px 12px;cursor:pointer;font-weight:600;transition:background .2s,transform .06s;}
        .pc__like:active{transform:scale(.98);} .pc__like--on{background:var(--chip-bg);}
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
          <button type="button" className={`pc__like ${liked ? "pc__like--on" : ""}`} onClick={handleLike}
                  aria-pressed={liked} aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}>
            <span role="img" aria-hidden>♡</span><span>{likes}</span>
          </button>
        </div>
      </article>
    </>
  );
};

export default PostCard;
