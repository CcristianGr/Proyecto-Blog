import React from "react";

export interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <h2 className="font-semibold">{post.user}</h2>
      </div>
      <p className="text-gray-700">{post.content}</p>
      <div className="mt-3 flex gap-4 text-sm text-gray-500">
        <span>👍 {post.likes}</span>
        <span>💬 {post.comments}</span>
      </div>
    </div>
  );
};

export default PostCard;
