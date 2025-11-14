import { useEffect, useRef } from "react";
import { DEFAULT_COVER } from "../utils/postUtils";

interface HeroSectionProps {
  onCreateClick: () => void;
}

/**
 * Componente Hero con efecto parallax
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateClick }) => {
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
        if (el) {
          el.style.transform = `translateY(${Math.min(40, y * 0.15)}px) scale(1.05)`;
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
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
          <a href="#articulos" className="btn btn--primary">
            Ver artículos
          </a>
          <a 
            href="#crear" 
            className="btn btn--ghost" 
            onClick={(e) => {
              e.preventDefault();
              onCreateClick();
            }}
          >
            Crear artículo
          </a>
        </div>
      </div>
    </section>
  );
};

