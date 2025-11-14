import { useEffect, useRef} from "react";
import type { ReactNode } from "react"; 

interface AnimateOnVisibleProps {
  delay?: number;
  children: ReactNode;
}

/**
 * Componente que anima su contenido cuando se hace visible en el viewport
 */
export const AnimateOnVisible: React.FC<AnimateOnVisibleProps> = ({ delay = 0, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("rv-show");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="rv" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

