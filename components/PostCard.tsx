
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { Post } from '../types';
import { CURRENT_USER } from '../constants';

interface PostCardProps {
  post: Post;
  onNavigateToProfile: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onNavigateToProfile }) => {
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  return (
    <div className="bg-radiy-card border-b-4 border-radiy-bg mb-6 rounded-none sm:rounded-3xl sm:border border-radiy-border/50 overflow-hidden shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-black/30 transition-shadow hover:border-radiy-border/80">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent hover:ring-radiy-mint transition-all cursor-pointer shadow-md hover:shadow-glow"
            onClick={() => onNavigateToProfile(post.author.id)}
          />
          <div>
            <h3
              className="font-bold text-radiy-text text-base hover:text-radiy-mint cursor-pointer transition-colors hover:text-glow"
              onClick={() => onNavigateToProfile(post.author.id)}
            >
              {post.author.name}
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
          {post.content.split(/(\*\*.*?\*\*|\*.*?\*|#\w+)/g).map((part, index) => {
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
      <div className="px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${liked ? 'text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-radiy-muted hover:text-radiy-text hover:bg-radiy-bg'}`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span>{post.likes + (liked ? 1 : 0)}</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-radiy-muted hover:text-radiy-text hover:bg-radiy-bg transition-all duration-200 hover:text-radiy-mint hover:shadow-glow">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-radiy-muted hover:text-radiy-text hover:bg-radiy-bg transition-all duration-200 ml-auto hover:text-radiy-mint hover:shadow-glow">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Section */}
      <div className="px-6 py-5 bg-radiy-bg/30 border-t border-radiy-border/30">
        {post.comments.length > 0 && (
          <div className="space-y-5 mb-6">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-4 group">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-2xl mt-1 opacity-90 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                  onClick={() => onNavigateToProfile(comment.user.id)}
                />
                <div className="flex-1">
                  <div className="bg-radiy-bg p-4 rounded-2xl rounded-tl-none border border-radiy-border/50 shadow-sm">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        className="text-xs font-bold text-radiy-text cursor-pointer hover:text-radiy-mint hover:text-glow transition-all"
                        onClick={() => onNavigateToProfile(comment.user.id)}
                      >
                        {comment.user.name}
                      </span>
                      <span className="text-[10px] text-radiy-muted">{comment.timestamp}</span>
                    </div>
                    <span className="text-sm text-gray-300 leading-snug block">{comment.text}</span>
                  </div>
                  <button className="text-[11px] font-bold text-radiy-muted hover:text-radiy-mint mt-1 ml-2 transition-colors">Ответить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <div className="flex gap-3 items-center">
          <img
            src={CURRENT_USER.avatar}
            alt="Me"
            className="w-10 h-10 rounded-2xl object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity shadow-glow"
            onClick={() => onNavigateToProfile(CURRENT_USER.id)}
          />
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Написать комментарий..."
              className="w-full bg-radiy-bg border border-radiy-border rounded-xl py-3 pl-5 pr-10 text-sm focus:outline-none focus:border-radiy-mint focus:ring-1 focus:ring-radiy-mint/50 transition-all group-hover:border-radiy-border/80 shadow-inner"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {commentText.length > 0 && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-radiy-mint text-radiy-bg rounded-lg hover:scale-110 transition-transform shadow-glow">
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
