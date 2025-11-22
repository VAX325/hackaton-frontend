import axios from 'axios';
import { User, Post, Group, ChatMessage, SearchResult } from './types';

// Create axios instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to attach token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_access_radiy_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    auth: {
        login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
            const response = await apiClient.post('/auth/signin', { username, password });
            return response.data;
        },
        register: async (data: any): Promise<{ user: User; token: string }> => {
            const response = await apiClient.post('/auth/signup', data);
            return response.data;
        },
        getMe: async (): Promise<User> => {
            const response = await apiClient.get('/user_me');
            return response.data;
        },
        logout: async (): Promise<void> => {
            const response = await apiClient.post('/auth/signout', { "refresh_token": localStorage.getItem("jwt_refresh_radiy_token") });
            if (response.status == 200) {
                localStorage.removeItem('jwt_access_radiy_token');
                localStorage.removeItem('jwt_refresh_radiy_token');
            }
        }
    },

    users: {
        getFollowers: async (): Promise<User[]> => {
            const response = await apiClient.get('/user_me/followers');
            return response.data;
        },
        getById: async (username: string): Promise<User> => {
            const response = await apiClient.get(`/user/${username}`);
            return response.data;
        }
    },

    posts: {
        getAll: async (): Promise<Post[]> => {
            const response = await apiClient.get('/posts');
            return response.data;
        },
        getByUser: async (userId: string): Promise<Post[]> => {
            const response = await apiClient.get(`/user/${userId}/posts`);
            return response.data;
        },
        getByCommunity: async (community: string): Promise<Post[]> => {
            const response = await apiClient.get(`/community/${community}/posts`);
            return response.data;
        },
        create: async (text: string, image?: string, community?: string): Promise<Post> => {
            const response = await apiClient.post('/post/create', { text, image, community });
            return response.data;
        },
        like: async (postId: string): Promise<void> => {
            await apiClient.post(`/post/${postId}/like`);
        },
        dislike: async (postId: string): Promise<void> => {
            await apiClient.post(`/post/${postId}/dislike`);
        },
        removeReaction: async (postId: string): Promise<void> => {
            await apiClient.post(`/post/${postId}/remove_reaction`);
        },
        comment: async (postId: string, text: string): Promise<void> => {
            await apiClient.post(`/post/${postId}/comments`, { text });
        }
    },

    communities: {
        getAll: async (): Promise<Group[]> => {
            const response = await apiClient.get('user_me/communities');
            return response.data;
        },
        getById: async (id: string): Promise<Group> => {
            const response = await apiClient.get(`/community/${id}`);
            return response.data;
        },
        join: async (community: string): Promise<void> => {
            await apiClient.post(`/community/${community}/join`);
        }
    },

    search: {
        query: async (q: string): Promise<SearchResult[]> => {
            const response = await apiClient.get(`/search`, { params: { q } });
            return response.data;
        }
    },

    chat: {
        getHistory: async (userId: string): Promise<ChatMessage[]> => {
            const response = await apiClient.get(`/chats/${userId}`);
            return response.data;
        },
        sendMessage: async (userId: string, text: string): Promise<ChatMessage> => {
            const response = await apiClient.post(`/chats/${userId}`, { text });
            return response.data;
        }
    }
};