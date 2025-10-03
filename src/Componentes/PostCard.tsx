import React from "react";

export type Post = {
  id: number;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
};

interface Props {
  post: Post;
  onLike: (id: number) => void;
}


const PostCard: React.FC<Props> = ({ post, onLike }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
      <div className="flex items-center mb-2">
        <img
          src={post.avatar}
          alt={post.user}
          className="w-10 h-10 rounded-full mr-3"
        />
        <h3 className="font-semibold">{post.user}</h3>
      </div>
      <p className="mb-2">{post.content}</p>
      <div className="text-sm text-gray-500 flex justify-between items-center">
        <button
          onClick={() => onLike(post.id)}
          className="text-blue-500 font-semibold hover:underline"
        >
          👍 {post.likes}
        </button>
        <span>💬 {post.comments}</span>
      </div>
    </div>
  );
};
export default PostCard;
