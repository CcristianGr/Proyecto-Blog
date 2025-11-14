import { AnimateOnVisible } from "./AnimateOnVisible";
import { DEFAULT_COVER, estimateReadingMins } from "../utils/postUtils";
import type { Post } from "../TypeScript/Entities";

interface PostFormProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: {
    title: string;
    coverUrl: string;
    excerpt: string;
    tags: string;
    isDraft: boolean;
  };
  error: string | null;
  dropRef: React.RefObject<HTMLDivElement>;
  onTitleChange: (title: string) => void;
  onCoverUrlChange: (url: string) => void;
  onExcerptChange: (excerpt: string) => void;
  onTagsChange: (tags: string) => void;
  onIsDraftChange: (isDraft: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onCancel?: () => void;
}

/**
 * Componente de formulario para crear/editar posts
 */
export const PostForm: React.FC<PostFormProps> = ({
  isOpen,
  isEditing,
  formData,
  error,
  dropRef,
  onTitleChange,
  onCoverUrlChange,
  onExcerptChange,
  onTagsChange,
  onIsDraftChange,
  onSubmit,
  onClear,
  onCancel,
}) => {
  if (!isOpen) return null;

  const wordCount = formData.excerpt.trim().split(/\s+/).filter(Boolean).length;
  const readingMins = estimateReadingMins(formData.excerpt);

  return (
    <AnimateOnVisible>
      <form className="create" onSubmit={onSubmit}>
        <h3>{isEditing ? "Editar artículo" : "Nuevo artículo"}</h3>

        <div className="row">
          <div className="field">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              value={formData.title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              placeholder="Ej: Mi primer post"
            />
          </div>
          <div className="field">
            <label htmlFor="tags">Etiquetas (coma, máx. 5)</label>
            <input
              id="tags"
              value={formData.tags}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="blogging, productividad"
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="cover">Imagen (URL o suéltala debajo)</label>
            <input
              id="cover"
              value={formData.coverUrl}
              onChange={(e) => onCoverUrlChange(e.target.value)}
              placeholder="https://..."
            />
            <div ref={dropRef} className="dz" style={{ marginTop: 8 }}>
              Arrastra una imagen aquí o pega una URL arriba
            </div>
          </div>
          <div className="field">
            <label>Preview</label>
            <div
              style={{
                border: `1px solid var(--border)`,
                borderRadius: 12,
                overflow: "hidden",
                background: "var(--bg-soft)",
              }}
            >
              <div style={{ position: "relative", paddingTop: "56%" }}>
                <img
                  src={formData.coverUrl || DEFAULT_COVER}
                  alt="Preview"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row-1" style={{ marginTop: 10 }}>
          <div className="field">
            <label htmlFor="excerpt">Resumen / Intro *</label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              rows={3}
              required
              placeholder="Escribe un resumen breve..."
            />
            <span className="count">
              {wordCount} palabras · {readingMins} min
            </span>
          </div>
        </div>

        <div className="check" style={{ marginTop: 6 }}>
          <input
            id="draft"
            type="checkbox"
            checked={formData.isDraft}
            onChange={(e) => onIsDraftChange(e.target.checked)}
          />
          <label htmlFor="draft">Guardar como borrador</label>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="actions">
          {isEditing && onCancel && (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancelar edición
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={onClear}>
            Limpiar
          </button>
          <button type="submit" className="btn btn--primary">
            {isEditing ? "Guardar cambios" : formData.isDraft ? "Guardar borrador" : "Publicar"}
          </button>
        </div>
      </form>
    </AnimateOnVisible>
  );
};

