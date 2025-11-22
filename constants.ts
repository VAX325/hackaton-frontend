
import { Post, User, SearchResult, ChatMessage, Group } from './types';

// SVG Background Patterns (Atom Theme)
// 1. Dark Grey Background, Red Atoms
const BG_DARK_GREY = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%232D2D32'/%3E%3Cg stroke='%23EF4444' stroke-width='2' fill='none'%3E%3Cpath d='M200,180 A20,50 0 0 1 200,280 A20,50 0 0 1 200,180' transform='rotate(0 200 230)' opacity='0.8'/%3E%3Cpath d='M200,180 A20,50 0 0 1 200,280 A20,50 0 0 1 200,180' transform='rotate(60 200 230)' opacity='0.8'/%3E%3Cpath d='M200,180 A20,50 0 0 1 200,280 A20,50 0 0 1 200,180' transform='rotate(120 200 230)' opacity='0.8'/%3E%3Ccircle cx='200' cy='230' r='6' fill='%23EF4444'/%3E%3Cpath d='M50,50 A15,40 0 0 1 50,130 A15,40 0 0 1 50,50' transform='rotate(45 50 90)' opacity='0.5'/%3E%3Cpath d='M50,50 A15,40 0 0 1 50,130 A15,40 0 0 1 50,50' transform='rotate(105 50 90)' opacity='0.5'/%3E%3Cpath d='M50,50 A15,40 0 0 1 50,130 A15,40 0 0 1 50,50' transform='rotate(165 50 90)' opacity='0.5'/%3E%3Ccircle cx='50' cy='90' r='4' fill='%23EF4444'/%3E%3Cpath d='M350,50 A15,40 0 0 1 350,130 A15,40 0 0 1 350,50' transform='rotate(-45 350 90)' opacity='0.5'/%3E%3Cpath d='M350,50 A15,40 0 0 1 350,130 A15,40 0 0 1 350,50' transform='rotate(15 350 90)' opacity='0.5'/%3E%3Cpath d='M350,50 A15,40 0 0 1 350,130 A15,40 0 0 1 350,50' transform='rotate(75 350 90)' opacity='0.5'/%3E%3Ccircle cx='350' cy='90' r='4' fill='%23EF4444'/%3E%3C/g%3E%3C/svg%3E`;

// 2. Light Green Background, Red Atoms
const BG_LIGHT_GREEN = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23A7F3D0'/%3E%3Cg stroke='%23EF4444' stroke-width='2' fill='none'%3E%3Cpath d='M100,100 A20,50 0 0 1 100,200 A20,50 0 0 1 100,100' transform='rotate(30 100 150)' opacity='0.7'/%3E%3Cpath d='M100,100 A20,50 0 0 1 100,200 A20,50 0 0 1 100,100' transform='rotate(90 100 150)' opacity='0.7'/%3E%3Cpath d='M100,100 A20,50 0 0 1 100,200 A20,50 0 0 1 100,100' transform='rotate(150 100 150)' opacity='0.7'/%3E%3Ccircle cx='100' cy='150' r='5' fill='%23EF4444'/%3E%3C/g%3E%3C/svg%3E`;

// 3. Dark Teal Background, Red Atoms
const BG_DARK_TEAL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23115E59'/%3E%3Cg stroke='%23EF4444' stroke-width='2' fill='none'%3E%3Cpath d='M200,50 A20,50 0 0 1 200,150 A20,50 0 0 1 200,50' transform='rotate(0 200 100)' opacity='0.9'/%3E%3Cpath d='M200,50 A20,50 0 0 1 200,150 A20,50 0 0 1 200,50' transform='rotate(60 200 100)' opacity='0.9'/%3E%3Cpath d='M200,50 A20,50 0 0 1 200,150 A20,50 0 0 1 200,50' transform='rotate(120 200 100)' opacity='0.9'/%3E%3Ccircle cx='200' cy='100' r='6' fill='%23EF4444'/%3E%3C/g%3E%3C/svg%3E`;


export const CURRENT_USER: User = {
  id: 'me',
  name: 'Алексей С.',
  username: '@alex_design',
  avatar_url: 'https://picsum.photos/id/1005/200/200',
  coverImage: BG_DARK_GREY,
  status: 'online',
  bio: 'UI/UX Дизайнер | Фронтенд Разработчик ⚛️ | Люблю минимализм и мятный цвет.',
  stats: {
    friends: 142,
    followers: 853,
    posts: 24
  }
};

export const RECENT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Марина В.',
    avatar_url: 'https://picsum.photos/id/338/200/200',
    status: 'online',
    username: '@marina_art',
    coverImage: BG_LIGHT_GREEN,
    bio: 'Графический дизайнер. Рисую логотипы и иллюстрации.',
    stats: { friends: 320, followers: 1200, posts: 142 }
  },
  {
    id: 'u2',
    name: 'Иван Д.',
    avatar_url: 'https://picsum.photos/id/1025/200/200',
    status: 'offline',
    username: '@ivan_dev',
    coverImage: BG_DARK_TEAL,
    bio: 'Fullstack Developer. JS, Python, Go.',
    stats: { friends: 80, followers: 230, posts: 15 }
  },
  {
    id: 'u3',
    name: 'Светлана К.',
    avatar_url: 'https://picsum.photos/id/237/200/200',
    status: 'online',
    username: '@svetlana_k',
    coverImage: BG_DARK_GREY,
    bio: 'Люблю собак и утренний кофе. 🐶☕',
    stats: { friends: 450, followers: 890, posts: 330 }
  },
  {
    id: 'u4',
    name: 'Дмитрий П.',
    avatar_url: 'https://picsum.photos/id/1012/200/200',
    status: 'offline',
    username: '@dimap',
    coverImage: BG_LIGHT_GREEN,
    bio: 'Фотограф. Снимаю портреты и пейзажи.',
    stats: { friends: 120, followers: 3400, posts: 56 }
  },
  {
    id: 'u5',
    name: 'Елена О.',
    avatar_url: 'https://picsum.photos/id/449/200/200',
    status: 'online',
    username: '@elena_o',
    coverImage: BG_DARK_TEAL,
    bio: 'Менеджер проектов. Организую хаос.',
    stats: { friends: 560, followers: 110, posts: 8 }
  },
  {
    id: 'u6',
    name: 'Кирилл М.',
    avatar_url: 'https://picsum.photos/id/1062/200/200',
    status: 'offline',
    username: '@kirill_m',
    coverImage: BG_DARK_GREY,
    bio: 'Музыкант. Играю на гитаре.',
    stats: { friends: 90, followers: 150, posts: 12 }
  },
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'UI/UX Design Community',
    avatar_url: 'https://picsum.photos/id/4/200/200',
    coverImage: BG_LIGHT_GREEN,
    description: 'Сообщество дизайнеров интерфейсов. Делимся опытом, макетами и вдохновением.',
    stats: { subscribers: 12500, posts: 3420 },
    details: {
      createdDate: '12 марта 2020',
      admin: RECENT_USERS[0],
      moderators: [RECENT_USERS[2], RECENT_USERS[4]]
    }
  },
  {
    id: 'g2',
    name: 'React & Next.js',
    avatar_url: 'https://picsum.photos/id/60/200/200',
    coverImage: BG_DARK_TEAL,
    description: 'Все о React экосистеме. Хуки, стейт-менеджмент, оптимизация и новости.',
    stats: { subscribers: 8400, posts: 1205 },
    details: {
      createdDate: '5 сентября 2019',
      admin: RECENT_USERS[1],
      moderators: [RECENT_USERS[3]]
    }
  },
  {
    id: 'g3',
    name: 'Путешествия по миру',
    avatar_url: 'https://picsum.photos/id/74/200/200',
    coverImage: BG_DARK_GREY,
    description: 'Фотографии с самых красивых уголков планеты. Советы туристам.',
    stats: { subscribers: 45000, posts: 8900 },
    details: {
      createdDate: '20 января 2018',
      admin: RECENT_USERS[5],
      moderators: [RECENT_USERS[0], RECENT_USERS[1]]
    }
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_me',
    author: CURRENT_USER,
    content: "Наконец-то обновил свой профиль! Как вам дизайн? 🎨\nРешил добавить немного атомов в оформление.",
    likes: 10,
    timestamp: 'Только что',
    comments: []
  },
  {
    id: 'p1',
    author: RECENT_USERS[0],
    content: "Сегодня отличный день для **дизайна**! 🎨\n\nРаботая над новым проектом, я поняла, насколько важен правильный выбор цветовой палитры. Мятный и темно-серый — отличное сочетание для снижения нагрузки на глаза.",
    image: 'https://picsum.photos/id/20/800/400',
    likes: 142,
    timestamp: '2 часа назад',
    comments: [
      { id: 'c1', user: RECENT_USERS[2], text: 'Полностью согласна! Выглядит супер.', timestamp: '1 час назад' }
    ]
  },
  {
    id: 'p2',
    author: RECENT_USERS[3],
    content: "#Путешествия\n\nВид из моего окна сегодня просто завораживает. Горы всегда вдохновляют на новые свершения. 🏔️",
    image: 'https://picsum.photos/id/29/800/450',
    likes: 89,
    timestamp: '5 часов назад',
    comments: [
      { id: 'c2', user: CURRENT_USER, text: 'Где это? Хочу туда!', timestamp: '30 мин назад' },
      { id: 'c3', user: RECENT_USERS[3], text: 'Это Алтай, присоединяйся в следующий раз!', timestamp: '5 мин назад' }
    ]
  },
  {
    id: 'p3',
    author: RECENT_USERS[5],
    content: "Изучаю новые возможности *React 19*. Кто уже пробовал Server Components в продакшене? Есть подводные камни?",
    likes: 56,
    timestamp: 'Вчера',
    comments: []
  }
];

export const MOCK_GROUP_POSTS: Record<string, Post[]> = {
  'g1': [
    {
      id: 'gp1',
      author: RECENT_USERS[2],
      content: "Ребята, оцените концепт нового мобильного приложения для доставки еды. Старалась использовать **неоморфизм**.",
      image: 'https://picsum.photos/id/48/800/500',
      likes: 320,
      timestamp: '15 мин назад',
      comments: [],
      groupId: 'g1'
    },
    {
      id: 'gp2',
      author: RECENT_USERS[0],
      content: "Полезная статья про доступность (a11y) в интерфейсах. Всем рекомендую к прочтению!",
      likes: 150,
      timestamp: '3 часа назад',
      comments: [],
      groupId: 'g1'
    }
  ],
  'g2': [
    {
      id: 'gp3',
      author: RECENT_USERS[1],
      content: "Вышел новый патч для Next.js. Исправили баги с роутингом.",
      likes: 88,
      timestamp: '1 час назад',
      comments: [],
      groupId: 'g2'
    }
  ],
  'g3': [
    {
      id: 'gp4',
      author: RECENT_USERS[5],
      content: "Норвегия - это что-то невероятное! 🇳🇴",
      image: 'https://picsum.photos/id/85/800/450',
      likes: 1200,
      timestamp: '1 день назад',
      comments: [],
      groupId: 'g3'
    }
  ]
};

export const SEARCH_RESULTS: SearchResult[] = [
  { id: 's1', title: 'Дизайн Интерфейсов', type: 'community', image: 'https://picsum.photos/id/3/50/50', entityId: 'g1' },
  { id: 's2', title: 'Марина В.', type: 'user', image: 'https://picsum.photos/id/64/50/50', entityId: 'u1' },
  { id: 's3', title: 'React Developers', type: 'community', image: 'https://picsum.photos/id/60/50/50', entityId: 'g2' },
  { id: 's4', title: 'Иван Д.', type: 'user', image: 'https://picsum.photos/id/91/50/50', entityId: 'u2' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { id: 'm1', senderId: 'u1', text: 'Привет! Как тебе новый дизайн?', timestamp: '10:00' },
  { id: 'm2', senderId: 'me', text: 'Привет, Марина! Очень нравится, цвета приятные.', timestamp: '10:05' },
  { id: 'm3', senderId: 'u1', text: 'Рада слышать! Скоро выкатим обновление.', timestamp: '10:06' },
];
