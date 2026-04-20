const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// --- 基础请求封装 ---
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // 处理可能为空的响应体 (例如 DELETE 请求)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// 预设的高饱和度色相列表（避免暗淡和灰色）
const COLOR_PALETTE = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
  '#3498db', '#9b59b6', '#e91e63', '#00bcd4', '#ff5722',
  '#8bc34a', '#ff9800', '#607d8b', '#795548', '#009688',
  '#673ab7', '#03a9f4', '#cddc39', '#ff6f61', '#6b5b95',
];

// 基于标签名生成稳定的颜色
export function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

// --- DTO 类型定义 ---
export interface CategoryDto {
  id: number;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateDto {
  name: string;
}

export interface CategoryUpdateDto {
  name: string;
}

export interface ArticleDto {
  id: number;
  title: string | null;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  categories: CategoryDto[] | null;
}

export interface ArticleCreateDto {
  title: string;
  content: string;
  categoryIds: number[] | null;
}

export interface ArticleUpdateDto {
  title: string;
  content: string;
  categoryIds: number[] | null;
}

export interface PagedResultOfArticleDto {
  items: ArticleDto[] | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Article = ArticleDto;
export type Category = CategoryDto;

// --- Articles API ---
export const articlesApi = {
  getList: (page: number = 1, pageSize: number = 10, categoryId?: number, key?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (categoryId !== undefined) {
      params.append('categoryId', categoryId.toString());
    }
    if (key) {
      params.append('key', key);
    }
    return request<PagedResultOfArticleDto>(`/Articles?${params.toString()}`);
  },

  getById: (id: number | string) => 
    request<ArticleDto>(`/Articles/${id}`),

  create: (data: ArticleCreateDto) => 
    request<ArticleDto>('/Articles', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number | string, data: ArticleUpdateDto) => 
    request<void>(`/Articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number | string) => 
    request<void>(`/Articles/${id}`, { method: 'DELETE' }),
};

// --- Categories API ---
export const categoriesApi = {
  getList: () => 
    request<CategoryDto[]>('/Categories'),

  getById: (id: number | string) => 
    request<CategoryDto>(`/Categories/${id}`),

  create: (data: CategoryCreateDto) => 
    request<CategoryDto>('/Categories', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number | string, data: CategoryUpdateDto) => 
    request<void>(`/Categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number | string) => 
    request<void>(`/Categories/${id}`, { method: 'DELETE' }),
};
