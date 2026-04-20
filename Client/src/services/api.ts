const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 预设的高饱和度色相列表（避免暗淡和灰色）
const COLOR_PALETTE = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
  '#3498db', '#9b59b6', '#e91e63', '#00bcd4', '#ff5722',
  '#8bc34a', '#ff9800', '#607d8b', '#795548', '#009688',
  '#673ab7', '#03a9f4', '#cddc39', '#ff6f61', '#6b5b95',
];

// 基于标签名生成稳定的颜色（相同标签名始终返回相同颜色）
export function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

export interface Article {
  id: number | string;
  title: string | null;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

// Articles API
export const articlesApi = {
  // 获取文章列表
  getList: async (): Promise<Article[]> => {
    const res = await fetch(`${BASE_URL}/Articles`);
    return res.json();
  },

  // 按分类获取文章
  getByCategory: async (categoryId: number): Promise<Article[]> => {
    const res = await fetch(`${BASE_URL}/Articles/category/${categoryId}`);
    return res.json();
  },

  // 获取文章详情
  getById: async (id: number): Promise<Article> => {
    const res = await fetch(`${BASE_URL}/Articles/${id}`);
    return res.json();
  },

  // 创建文章
  create: async (data: Partial<Article>): Promise<Article> => {
    const res = await fetch(`${BASE_URL}/Articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 更新文章
  update: async (id: number, data: Partial<Article>): Promise<void> => {
    await fetch(`${BASE_URL}/Articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  // 删除文章
  delete: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/Articles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesApi = {
  // 获取分类列表
  getList: async (): Promise<Category[]> => {
    const res = await fetch(`${BASE_URL}/Categories`);
    return res.json();
  },

  // 获取分类详情
  getById: async (id: number): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/Categories/${id}`);
    return res.json();
  },

  // 创建分类
  create: async (data: Partial<Category>): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/Categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 更新分类
  update: async (id: number, data: Partial<Category>): Promise<void> => {
    await fetch(`${BASE_URL}/Categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  // 删除分类
  delete: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/Categories/${id}`, {
      method: 'DELETE',
    });
  },
};
