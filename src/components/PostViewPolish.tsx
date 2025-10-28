import React, { useEffect, useRef, useState } from "react";

/**
 * Ajustes SOLO para rutas #/post/* sin tocar Pages:
 * - Título y artículo centrados, ancho 760px
 * - Portada grande y redondeada
 * - Barra de progreso de lectura
 */
const PostViewPolish: React.FC = () => {
  const [isPost, setIsPost] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateFlag = () => setIsPost(/^#\/post\//.test(location.hash));
    updateFlag();
    window.addEventListener("hashchange", updateFlag);
    return () => window.removeEventListener("hashchange", updateFlag);
  }, []);

  useEffect(() => {
    document.body.dataset.view = isPost ? "post" : "";
    if (!isPost) return;
    const decorate = () => {
      document.querySelector("main h1, h1")?.classList.add("post-title");
      document.querySelector("main article, article")?.classList.add("post-article");
      (document.querySelector("main img, article img") as HTMLImageElement | null)?.classList.add("post-cover");
    };
    const raf = requestAnimationFrame(decorate);
    const mo = new MutationObserver(() => decorate());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { cancelAnimationFrame(raf); mo.disconnect(); };
  }, [isPost]);

  useEffect(() => {
    if (!isPost) return;
    const onScroll = () => {
      const total = (document.documentElement.scrollHeight - document.documentElement.clientHeight) || 1;
      const p = Math.min(100, Math.max(0, ((window.scrollY || 0) / total) * 100));
      const el = barRef.current; if (el) el.style.width = `${p}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [isPost]);

  return (
    <>
      <style>{`
        body[data-view="post"] .post-title{
          text-align:center; font-size:clamp(30px,5.6vw,48px); line-height:1.12; letter-spacing:-.3px;
          margin:16px auto 8px; color:var(--text);
        }
        body[data-view="post"] .post-article{
          max-width:760px; margin:22px auto 70px; padding:0 20px;
        }
        body[data-view="post"] .post-article p{ margin:0 0 14px; line-height:1.8; color:var(--muted); font-size:18px; }
        body[data-view="post"] .post-article h2{ margin:26px 0 10px; font-size:28px; line-height:1.25; }
        body[data-view="post"] .post-article h3{ margin:22px 0 8px; font-size:22px; }
        body[data-view="post"] .post-article ul, body[data-view="post"] .post-article ol{ margin:0 0 16px 20px; color:var(--muted); }
        body[data-view="post"] .post-article blockquote{
          margin:16px 0; padding:12px 16px; border-left:4px solid var(--primary);
          background:var(--chip-bg); border-radius:6px; color:var(--text);
        }
        body[data-view="post"] .post-cover{ display:block; width:100%; max-width:1160px; margin:14px auto 0; border-radius:20px; object-fit:cover; }
        body[data-view="post"] .rp{ position:fixed; top:0; left:0; height:3px; width:0%; background:var(--primary); z-index:60; transition:width .1s linear; }
      `}</style>
      {isPost && <div ref={barRef} className="rp" />}
    </>
  );
};

export default PostViewPolish;
