import { AnimateOnVisible } from "./AnimateOnVisible";
import PostCard, { type Post } from "./PostCard";

interface PostGridProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onPublish: (post: Post) => void;
}

/**
 * Componente que muestra una grilla de posts
 */
export const PostGrid: React.FC<PostGridProps> = ({ posts, onEdit, onDelete, onPublish }) => {
  return (
    <div className="grid">
      {posts.map((post, i) => (
        <AnimateOnVisible key={post.id} delay={i * 60}>
          <div>
            <PostCard post={post} />
            {post.isUser && (
              <div className="user-toolbar">
                <button className="link-reset" onClick={() => onEdit(post)}>
                  {post.draft ? "Editar borrador" : "Editar"}
                </button>
                {post.draft && (
                  <button className="link-reset" onClick={() => onPublish(post)}>
                    Publicar
                  </button>
                )}
                <button className="link-reset" onClick={() => onDelete(post)}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </AnimateOnVisible>
      ))}
    </div>
  );
};

