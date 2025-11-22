
export interface User {
  username: string;
  visible_name: string,
  avatar_url: string;
  status?: 'online' | 'offline';
  coverImage: string;
  bio: string;
  stats: {
    friends: number;
    followers: number;
    posts: number;
  }
}

export interface Group {
  id: string;
  name: string;
  avatar_url: string;
  coverImage: string;
  description: string;
  stats: {
    subscribers: number;
    posts: number;
  };
  details: {
    createdDate: string;
    admin: User;
    moderators: User[];
  }
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  creator: User;
  text: string; // Markdown compatible string
  image?: string;
  likes: number;
  dislikes: number;
  user_reaction?: 'like' | 'dislike' | null;
  creation_datetime: Date;
  comments: Comment[];
  timestamp: string;
  groupId?: string; // Optional: if post belongs to a group
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'user' | 'community';
  image: string;
  entityId?: string; // ID to navigate to
}
