import type { SortKey } from "../TypeScript/Entities";

interface SearchControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTags: string[];
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  showDrafts: boolean;
  onShowDraftsChange: (show: boolean) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

/**
 * Componente de controles de búsqueda y filtros
 */
export const SearchControls: React.FC<SearchControlsProps> = ({
  searchQuery,
  onSearchChange,
  allTags,
  activeTags,
  onTagToggle,
  sortKey,
  onSortChange,
  showDrafts,
  onShowDraftsChange,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="controls">
      <div className="search" role="search">
        <input
          type="search"
          placeholder="Buscar (título, autor o etiqueta)…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar artículos"
        />
      </div>

      <div className="controls__bar">
        <div className="chips" aria-label="Filtrar por etiquetas">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`chip ${activeTags.includes(tag) ? "chip--on" : ""}`}
              onClick={() => onTagToggle(tag)}
              aria-pressed={activeTags.includes(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label htmlFor="sort" style={{ color: "var(--muted-2)", fontSize: 13 }}>
            Ordenar
          </label>
          <select
            id="sort"
            className="select"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
          >
            <option value="new">Más recientes</option>
            <option value="likes">Más gustados</option>
            <option value="alpha">A → Z</option>
            <option value="short">Lectura corta</option>
          </select>

          <label className="check">
            <input
              type="checkbox"
              checked={showDrafts}
              onChange={(e) => onShowDraftsChange(e.target.checked)}
            />
            Mostrar borradores
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="link-reset"
          onClick={onClearFilters}
          style={{ alignSelf: "flex-start", marginTop: 8 }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

