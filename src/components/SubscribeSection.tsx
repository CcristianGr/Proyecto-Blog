import { AnimateOnVisible } from "./AnimateOnVisible";

/**
 * Componente de suscripción/newsletter
 */
export const SubscribeSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Gracias! Revisa tu correo para confirmar.");
  };

  return (
    <section id="suscribirse" className="container" style={{ padding: "0 0 60px" }}>
      <AnimateOnVisible>
        <div
          style={{
            background: "var(--card)",
            border: `1px solid var(--border)`,
            borderRadius: 16,
            padding: 20,
            boxShadow: "var(--shadow)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>¿Listo para escribir?</strong> Crea tu
            primer artículo en minutos.
          </div>
          <form onSubmit={handleSubmit}>
            <input
              required
              type="email"
              placeholder="tu@email"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                marginRight: 8,
              }}
            />
            <button className="btn btn--primary" type="submit" style={{ textDecoration: "none" }}>
              Suscribirme
            </button>
          </form>
        </div>
      </AnimateOnVisible>
    </section>
  );
};

