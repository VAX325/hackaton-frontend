
export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: 'online' | 'offline';
  // Profile specific fields
  coverImage: string;
  bio: string;
  username: string;
  stats: {
    friends: number;
    followers: number;
    posts: number;
  }
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
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
  author: User;
  content: string; // Markdown compatible string
  image?: string;
  likes: number;
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
