import React from "react";
import PostCard, { type Post } from "../Componentes/PostCard";

const Home: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      user: "Sebastián",
      avatar: "https://i.pravatar.cc/150?img=3",
      content: "Hoy estuve trabajando en un proyecto con React 🚀",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      user: "Camila",
      avatar: "https://i.pravatar.cc/150?img=5",
      content: "El café de la mañana me salvó ☕",
      likes: 5,
      comments: 1,
    },
    {
      id: 3,
      user: "Juan",
      avatar: "https://i.pravatar.cc/150?img=8",
      content: "Estoy aprendiendo TailwindCSS y es genial 🎨",
      likes: 9,
      comments: 2,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
 