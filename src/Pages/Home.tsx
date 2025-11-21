import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { SearchControls } from "../components/SearchControls";
import { PostForm } from "../components/PostForm";
import { PostGrid } from "../components/PostGrid";
import { StatsSection } from "../components/StatsSection";
import { SubscribeSection } from "../components/SubscribeSection";
import type { Post } from "../TypeScript/Entities";
import { usePosts } from "../hooks/usePosts";
import { usePostFilters } from "../hooks/usePostFilters";
import { usePostForm } from "../hooks/usePostForm";
import { homeStyles } from "../styles/homeStyles";
import { DEFAULT_COVER, generatePostHref, estimateReadingMins } from "../utils/postUtils";
import { createPublicacionFormData } from "../utils/postMappers";
import { getUserId as getUserIdFromAuth } from "../utils/authUtils";

// Componente principal de la página Home: muestra y gestiona todas las publicaciones
export const Home: React.FC = () => {
  const userId = getUserIdFromAuth() ?? 1;
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Gestiona la carga y operaciones de posts desde la API
  const {
    allPosts,
    userPosts,
    isLoading,
    error: postsError,
    createPost,
    updatePost,
    deletePost,
  } = usePosts({ userId });

  // Combina posts del usuario (marcados como isUser) con posts generales, evitando duplicados
  const allAvailablePosts = useMemo(() => {
    const userPostsMarked = userPosts.map((p) => ({ ...p, isUser: true }));
    const userPostIds = new Set(userPosts.map((p) => p.id));
    const generalPosts = allPosts.filter((p) => !userPostIds.has(p.id));
    return [...userPostsMarked, ...generalPosts];
  }, [allPosts, userPosts]);

  // Gestiona búsqueda, filtros por etiquetas y ordenamiento de posts
  const {
    searchQuery,
    setSearchQuery,
    activeTags,
    toggleTag,
    sortKey,
    setSortKey,
    showDrafts,
    setShowDrafts,
    filteredPosts,
    allTags,
    clearFilters,
  } = usePostFilters({ posts: allAvailablePosts });

  // Gestiona el formulario de crear/editar posts
  const {
    formData,
    error: formError,
    isEditing,
    dropRef,
    setTitle,
    setCoverUrl,
    setExcerpt,
    setTags,
    setIsDraft,
    setImageFile,
    setCategoryId,
    handleSubmit,
    clearForm,
  } = usePostForm({
    initialPost: editingPost,
    onSubmit: async (data) => {
      const now = new Date();
      const tagList = data.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      try {
        // Si está editando, actualiza el post existente (usando JSON como antes)
        if (isEditing && editingPost) {
          const postId = typeof editingPost.id === "number" ? editingPost.id : parseInt(String(editingPost.id), 10);
          if (!isNaN(postId)) {
            // Para editar, mantenemos el formato JSON por ahora
            const newPost: Omit<Post, "id"> = {
              title: data.title.trim(),
              coverUrl: data.coverUrl.trim() || DEFAULT_COVER,
              excerpt: data.excerpt.trim(),
              contenido: data.excerpt.trim(),
              author: "Tú",
              date: now.toISOString(),
              tags: tagList,
              initialLikes: editingPost?.initialLikes ?? 0,
              href: generatePostHref(data.title),
              readingMins: estimateReadingMins(data.excerpt),
              draft: data.isDraft,
              idUsuario: userId,
              idCategoria: data.categoryId,
            };
            await updatePost(postId, newPost);
            alert("Artículo actualizado ✔");
            
            clearForm();
            setFormOpen(false);
            setEditingPost(null);
            document.getElementById("articulos")?.scrollIntoView({ behavior: "smooth" });
          } else {
            throw new Error("ID de post inválido para actualizar en API");
          }
        } else {
          // Si no está editando, crea un nuevo post usando FormData
          // Validar que haya título, contenido y categoría
          if (!data.title.trim()) {
            throw new Error("El título es requerido");
          }
          if (!data.excerpt.trim()) {
            throw new Error("El contenido es requerido");
          }
          if (!data.categoryId || data.categoryId < 1 || data.categoryId > 5) {
            throw new Error("Debes seleccionar una categoría válida (1-5)");
          }
          
          // Crea el FormData con los datos del formulario
          const formDataToSend = createPublicacionFormData({
            titulo: data.title.trim(),
            contenido: data.excerpt.trim(),
            etiqueta: tagList.join(", "), // Une las etiquetas con comas
            idCategoria: data.categoryId,
            idUsuario: userId,
            imagen: data.imageFile,
          });
          
          await createPost(formDataToSend);
          alert(data.isDraft ? "Borrador guardado ✔" : "Artículo publicado ✔");
          
          clearForm();
          setFormOpen(false);
          setEditingPost(null);
          document.getElementById("articulos")?.scrollIntoView({ behavior: "smooth" });
        }
      } catch (err) {
        // Fallback: si falla la API, guarda en localStorage solo para edición
        if (isEditing && editingPost) {
          try {
            const fallbackPost: Omit<Post, "id"> = {
              title: data.title.trim(),
              coverUrl: data.coverUrl.trim() || DEFAULT_COVER,
              excerpt: data.excerpt.trim(),
              contenido: data.excerpt.trim(),
              author: "Tú",
              date: now.toISOString(),
              tags: tagList,
              initialLikes: editingPost?.initialLikes ?? 0,
              href: generatePostHref(data.title),
              readingMins: estimateReadingMins(data.excerpt),
              draft: data.isDraft,
              idUsuario: userId,
              idCategoria: data.categoryId,
            };
            const updatedPost: Post = {
              ...editingPost,
              ...fallbackPost,
              id: editingPost.id,
            };
            const currentPosts = JSON.parse(localStorage.getItem("user_posts_v3") || "[]");
            const updatedPosts = currentPosts.map((p: Post) =>
              p.id === editingPost.id ? updatedPost : p
            );
            localStorage.setItem("user_posts_v3", JSON.stringify(updatedPosts));
            alert("Artículo actualizado ✔ (guardado localmente)");
            clearForm();
            setFormOpen(false);
            setEditingPost(null);
          } catch (localErr) {
            console.error("Error saving to localStorage:", localErr);
            throw err;
          }
        } else {
          throw err;
        }
      }
    },
    onCancel: () => {
      setEditingPost(null);
      setFormOpen(false);
    },
  });

  // Abre el formulario automáticamente si la URL tiene el hash #crear
  useEffect(() => {
    if (window.location.hash === "#crear") {
      setFormOpen(true);
    }
  }, []);

  // Inicia la edición de un post: carga sus datos en el formulario
  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormOpen(true);
    document.getElementById("crear")?.scrollIntoView({ behavior: "smooth" });
  };

  // Elimina un post después de confirmar
  const handleDelete = async (post: Post) => {
    if (!confirm(`¿Eliminar "${post.title}"?`)) return;

    const postId = typeof post.id === "number" ? post.id : parseInt(String(post.id), 10);
    
    try {
      if (!isNaN(postId) && post.isUser) {
        await deletePost(postId);
      } else {
        // Si no es válido o no es del usuario, elimina de localStorage
        const currentPosts = JSON.parse(localStorage.getItem("user_posts_v3") || "[]");
        const filteredPosts = currentPosts.filter((p: Post) => p.id !== post.id);
        localStorage.setItem("user_posts_v3", JSON.stringify(filteredPosts));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error al eliminar el artículo");
    }
  };

  // Publica un borrador: abre el formulario con el post y desmarca el draft
  const handlePublish = (post: Post) => {
    setEditingPost(post);
    setIsDraft(false);
    setFormOpen(true);
  };

  // Muestra u oculta el formulario de crear/editar
  const handleToggleForm = () => {
    setFormOpen((prev) => !prev);
    if (formOpen) {
      setEditingPost(null);
      clearForm();
    }
  };

  // Calcula las estadísticas para mostrar en la sección de métricas
  const totalPosts = allAvailablePosts.length;
  const totalUserPosts = userPosts.length;
  const totalTagsCount = allTags.length;
  const hasActiveFilters = searchQuery.trim() !== "" || activeTags.length > 0;

  return (
    <>
      <Navbar />

      <style>{homeStyles}</style>

      {/* Sección hero con imagen de fondo y botones de acción */}
      <HeroSection onCreateClick={() => setFormOpen(true)} />

      {/* Sección de controles: búsqueda, filtros y formulario */}
      <section className="container">
        <div id="crear" />
        <SearchControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          allTags={allTags}
          activeTags={activeTags}
          onTagToggle={toggleTag}
          sortKey={sortKey}
          onSortChange={setSortKey}
          showDrafts={showDrafts}
          onShowDraftsChange={setShowDrafts}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <button
          type="button"
          className="btn btn--ghost"
          onClick={handleToggleForm}
          aria-expanded={formOpen}
          style={{ alignSelf: "flex-start", marginTop: 8 }}
        >
          {formOpen ? "Ocultar formulario" : "Crear artículo"}
        </button>

        {/* Formulario para crear o editar posts */}
          <PostForm
          isOpen={formOpen}
          isEditing={isEditing}
          formData={formData}
          error={formError || postsError}
          dropRef={dropRef}
          onTitleChange={setTitle}
          onCoverUrlChange={setCoverUrl}
          onExcerptChange={setExcerpt}
          onTagsChange={setTags}
          onIsDraftChange={setIsDraft}
          onImageFileChange={setImageFile}
          onCategoryIdChange={setCategoryId}
          onSubmit={handleSubmit}
          onClear={clearForm}
          onCancel={() => {
            setEditingPost(null);
            clearForm();
          }}
        />
      </section>

      {/* Sección de estadísticas: total de posts, posts del usuario y etiquetas */}
      <StatsSection
        totalPosts={totalPosts}
        userPosts={totalUserPosts}
        totalTags={totalTagsCount}
      />

      {/* Sección principal: lista de posts filtrados */}
      <section id="articulos" className="container" style={{ padding: "12px 0 70px" }}>
        <div className="metaBar" aria-live="polite">
          <span>
            {filteredPosts.length} resultado{filteredPosts.length === 1 ? "" : "s"}
          </span>
          {hasActiveFilters ? (
            <button className="link-reset" onClick={clearFilters}>
              Limpiar filtros
            </button>
          ) : (
            <span />
          )}
        </div>

        {/* Estados de carga: loading, error o sin resultados */}
        {(() => {
          if (isLoading) {
            return (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                Cargando publicaciones...
              </div>
            );
          }
          
          if (postsError) {
            return (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                <p style={{ marginBottom: "12px", color: "#b91c1c" }}>{postsError}</p>
                <p style={{ fontSize: "14px" }}>
                  No se pudieron cargar las publicaciones. Por favor, intenta recargar la página.
                </p>
              </div>
            );
          }
          
          if (filteredPosts.length === 0) {
            const emptyMessage = hasActiveFilters 
              ? "No se encontraron publicaciones con los filtros seleccionados" 
              : "No hay publicaciones disponibles";
            
            return (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
                <p style={{ fontSize: "18px", marginBottom: "12px", color: "var(--text)" }}>
                  {emptyMessage}
                </p>
                {hasActiveFilters ? (
                  <button className="btn btn--primary" onClick={clearFilters}>
                    Limpiar filtros
                  </button>
                ) : (
                  <p style={{ fontSize: "14px" }}>
                    Sé el primero en crear una publicación
                  </p>
                )}
              </div>
            );
          }
          
          return (
            <PostGrid
              posts={filteredPosts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPublish={handlePublish}
            />
          );
        })()}
      </section>

      {/* Sección de suscripción/newsletter */}
      <SubscribeSection />
    </>
  );
};
