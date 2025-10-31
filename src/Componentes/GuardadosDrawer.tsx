import React, { useEffect, useState } from 'react';

interface GuardadosDrawerProps {
  open: boolean;
  onClose: () => void;
}

const GuardadosDrawer: React.FC<GuardadosDrawerProps> = ({ open, onClose }) => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_posts_v1') || '[]');
      setPosts(saved);
    } catch {
      setPosts([]);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="drawer">
      <style>{`
        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          background: var(--card);
          box-shadow: var(--shadow);
          z-index: 50;
          border-left: 1px solid var(--border);
          padding: 20px;
        }
        .drawer__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .drawer__title {
          margin: 0;
          font-size: 1.2rem;
        }
        .drawer__close {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>

      <div className="drawer__header">
        <h2 className="drawer__title">Posts Guardados</h2>
        <button className="drawer__close" onClick={onClose}>Cerrar</button>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No hay posts guardados</p>
        ) : (
          posts.map((post: any) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              {/* Aquí puedes agregar más detalles del post */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuardadosDrawer;