import { useEffect, useRef, useState } from "react";

interface StatsSectionProps {
  totalPosts: number;
  userPosts: number;
  totalTags: number;
}

/**
 * Componente que muestra estadísticas con animación
 */
export const StatsSection: React.FC<StatsSectionProps> = ({
  totalPosts,
  userPosts,
  totalTags,
}) => {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="container" ref={statsRef} style={{ padding: "20px 0 6px" }}>
      <div className="stats">
        <div className="stat">
          <div className="stat__num">{animateStats ? totalPosts : 0}+</div>
          <div className="stat__sub">Artículos disponibles</div>
        </div>
        <div className="stat">
          <div className="stat__num">{animateStats ? userPosts : 0}</div>
          <div className="stat__sub">Artículos creados por ti</div>
        </div>
        <div className="stat">
          <div className="stat__num">{animateStats ? totalTags : 0}</div>
          <div className="stat__sub">Etiquetas activas</div>
        </div>
      </div>
    </section>
  );
};

