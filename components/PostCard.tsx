
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { Post } from '../types';
import { CURRENT_USER } from '../constants';
import { api } from '../api';

interface PostCardProps {
  post: Post;
  onNavigateToProfile: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onNavigateToProfile }) => {
  // State
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(post.user_reaction || null);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [commentText, setCommentText] = useState('');

  const handleReaction = async (type: 'like' | 'dislike') => {
    // Optimistic UI Update Logic
    const oldReaction = reaction;
    const oldLikes = likes;
    const oldDislikes = dislikes;

    let newReaction: 'like' | 'dislike' | null = null;
    let newLikes = likes;
    let newDislikes = dislikes;

    if (type === 'like') {
      if (oldReaction === 'like') {
        // Toggle off
        newReaction = null;
        newLikes = Math.max(0, likes - 1);
      } else {
        // Toggle on (switch from dislike if necessary)
        newReaction = 'like';
        newLikes = likes + 1;
        if (oldReaction === 'dislike') {
          newDislikes = Math.max(0, dislikes - 1);
        }
      }
    } else { // type === 'dislike'
      if (oldReaction === 'dislike') {
        // Toggle off
        newReaction = null;
        newDislikes = Math.max(0, dislikes - 1);
      } else {
        // Toggle on (switch from like if necessary)
        newReaction = 'dislike';
        newDislikes = dislikes + 1;
        if (oldReaction === 'like') {
          newLikes = Math.max(0, likes - 1);
        }
      }
    }

    // Apply Optimistic State
    setReaction(newReaction);
    setLikes(newLikes);
    setDislikes(newDislikes);

    // API Call
    try {
      if (type !== oldReaction)
        await api.posts.removeReaction(post.id);

      if (type === 'like') {
        await api.posts.like(post.id);
      } else {
        await api.posts.dislike(post.id);
      }
    } catch (error) {
      console.error("Failed to react:", error);
      // Revert on Error
      setReaction(oldReaction);
      setLikes(oldLikes);
      setDislikes(oldDislikes);
    }
  };

  return (
    <div className="bg-radiy-card border-b-4 border-radiy-bg mb-6 rounded-none sm:rounded-3xl sm:border border-radiy-border/50 overflow-hidden shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-black/30 transition-shadow hover:border-radiy-border/80">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={post.creator.avatar_url}
            alt={post.creator.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent hover:ring-radiy-mint transition-all cursor-pointer shadow-md hover:shadow-glow"
            onClick={() => onNavigateToProfile(post.creator.id)}
          />
          <div>
            <h3
              className="font-bold text-radiy-text text-base hover:text-radiy-mint cursor-pointer transition-colors hover:text-glow"
              onClick={() => onNavigateToProfile(post.creator.id)}
            >
              {post.creator.name}
            </h3>
            <p className="text-xs text-radiy-muted font-medium mt-0.5">{post.timestamp}</p>
          </div>
        </div>
        <button className="text-radiy-muted hover:text-radiy-text p-2 hover:bg-radiy-bg rounded-xl transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-5">
        {/* Simple Markdown Simulation */}
        <p className="text-radiy-text whitespace-pre-wrap leading-relaxed text-[15px]">
          {post.text.split(/(\*\*.*?\*\*|\*.*?\*|#\w+)/g).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={index} className="text-gray-300 italic">{part.slice(1, -1)}</em>;
            }
            if (part.startsWith('#')) {
              return <span key={index} className="text-radiy-mint font-medium cursor-pointer hover:underline opacity-90 hover:text-glow transition-shadow">{part}</span>;
            }
            return part;
          })}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="w-full bg-black/20 border-y border-radiy-border/30 relative group">
          <img src={post.image} alt="Post Content" className="w-full h-auto max-h-[600px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      )}

      {/* Actions Bar */}
      <div className="px-6 py-4 flex items-center gap-2 sm:gap-3">

        {/* Like Button */}
        <button
          onClick={() => handleReaction('like')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${reaction === 'like' ? 'text-radiy-mint bg-radiy-mint/10 shadow-glow' : 'text-radiy-muted hover:text-radiy-mint hover:bg-radiy-bg'}`}
        >
          <ThumbsUp className={`w-5 h-5 ${reaction === 'like' ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>

        {/* Dislike Button */}
        <button
          onClick={() => handleReaction('dislike')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${reaction === 'dislike' ? 'text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-radiy-muted hover:text-red-500 hover:bg-radiy-bg'}`}
        >
          <ThumbsDown className={`w-5 h-5 ${reaction === 'dislike' ? 'fill-current' : ''}`} />
          <span>{dislikes}</span>
        </button>

        {/* Share Button */}
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-radiy-muted hover:text-radiy-text hover:bg-radiy-bg transition-all duration-200 ml-auto hover:text-radiy-mint hover:shadow-glow">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};