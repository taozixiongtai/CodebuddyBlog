export interface Blog {
  id: number;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  content: string;
}

export const tagColors: Record<string, string> = {
  React: '#f97316',
  Hooks: '#8b5cf6',
  Vite: '#3b82f6',
  工程化: '#10b981',
  TypeScript: '#3b82f6',
  类型系统: '#6366f1',
  Git: '#ef4444',
  协作: '#ec4899',
  CSS: '#8b5cf6',
  布局: '#14b8a6',
};

export const allTags = ['React', 'Hooks', 'Vite', '工程化', 'TypeScript', '类型系统', 'Git', '协作', 'CSS', '布局'];

const blogs: Blog[] = [
  {
    id: 1,
    title: 'React Hooks 使用心得',
    summary: '在实际项目中总结的 React Hooks 使用技巧和常见陷阱，帮助你在开发中少走弯路。',
    date: '2026-04-15',
    tags: ['React', 'Hooks'],
    content: `## 前言

React Hooks 自 16.8 版本引入以来，已经成为 React 开发的核心范式。在实际项目中，我踩过不少坑，也总结了一些实用的经验。

## useEffect 的依赖陷阱

最常见的错误就是在 useEffect 中遗漏依赖项。很多人习惯写空数组 \`[]\`，但这往往会导致闭包问题——在回调中拿到的是旧的 state 值。

\`\`\`jsx
// 错误写法
useEffect(() => {
  setCount(count + 1);
}, []); // count 永远是初始值 0

// 正确写法
useEffect(() => {
  setCount(prev => prev + 1);
}, []); // 使用函数式更新，不依赖外部 count
\`\`\`

## 自定义 Hook 的抽取原则

当你在多个组件中发现重复的逻辑时，就应该考虑抽取自定义 Hook。原则是：

1. **单一职责**：一个 Hook 只做一件事
2. **命名清晰**：以 \`use\` 开头，名称体现功能
3. **返回值简洁**：返回 [state, actions] 或对象，保持一致性

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

## useMemo 和 useCallback 的使用时机

不要过度优化。只有在以下场景才需要使用：

- 计算开销较大时使用 \`useMemo\`
- 传递给子组件的回调，且子组件使用了 \`React.memo\` 时使用 \`useCallback\`

记住：**过早优化是万恶之源**。

## 总结

Hooks 让函数组件拥有了完整的能力，但也带来了新的心智负担。理解其原理，遵循最佳实践，才能写出优雅的 React 代码。`
  },
  {
    id: 2,
    title: 'Vite 构建优化实战',
    summary: '分享 Vite 项目构建优化的实践经验，包括分包策略、资源压缩和构建速度提升。',
    date: '2026-04-10',
    tags: ['Vite', '工程化'],
    content: `## 为什么选择 Vite

Vite 利用浏览器原生 ES Module，实现了极速的开发体验。但生产构建的优化仍需我们手动配置。

## 分包策略

默认情况下，Vite 会将所有依赖打包到一个 vendor chunk 中。对于大型项目，这会导致单个文件过大。

\`\`\`js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'utils': ['lodash-es', 'dayjs'],
        }
      }
    }
  }
});
\`\`\`

## 资源压缩

\`\`\`js
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // 大于 10KB 才压缩
    })
  ]
});
\`\`\`

## 构建速度优化

1. 使用 \`esbuild\` 替代 \`terser\` 进行代码压缩（Vite 默认行为）
2. 关闭 \`sourcemap\` 生产环境
3. 使用 \`rollup-plugin-visualizer\` 分析包体积

\`\`\`js
build: {
  sourcemap: false,
  minify: 'esbuild',
}
\`\`\`

## 总结

Vite 的构建优化并不复杂，关键在于理解分包原则和按需配置。合理的优化策略能显著提升用户体验。`
  },
  {
    id: 3,
    title: 'TypeScript 泛型入门到实践',
    summary: '从基础概念到实际应用，带你掌握 TypeScript 泛型的核心用法。',
    date: '2026-04-05',
    tags: ['TypeScript', '类型系统'],
    content: `## 什么是泛型

泛型就是"类型的参数化"。它允许我们在定义函数、接口或类时，不预先指定具体类型，而在使用时再指定。

## 基础语法

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>('hello'); // 类型为 string
const result2 = identity(42); // 自动推断为 number
\`\`\`

## 常用工具类型

TypeScript 内置了许多实用的工具类型：

\`\`\`typescript
// Partial - 将所有属性变为可选
type PartialUser = Partial<User>;

// Pick - 选取部分属性
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - 排除部分属性
type UserWithoutPassword = Omit<User, 'password'>;

// Record - 构造键值对类型
type PageInfo = Record<string, { title: string; url: string }>;
\`\`\`

## 实际应用：API 请求封装

\`\`\`typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function request<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// 使用
interface User {
  id: number;
  name: string;
}

const res = await request<User>('/api/user/1');
// res.data 的类型为 User
\`\`\`

## 约束泛型

使用 extends 关键字约束泛型的范围：

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: '桃子兄台', age: 25 };
getProperty(user, 'name'); // ✅ 正确
getProperty(user, 'job');  // ❌ 编译错误
\`\`\`

## 总结

泛型是 TypeScript 最强大的特性之一，掌握它能让你写出更安全、更灵活的代码。`
  },
  {
    id: 4,
    title: 'Git 工作流最佳实践',
    summary: '团队协作中 Git 分支管理和提交规范的经验总结。',
    date: '2026-03-28',
    tags: ['Git', '协作'],
    content: `## 分支策略

推荐使用 Git Flow 的简化版：

- \`main\` - 生产分支，只接受 merge
- \`develop\` - 开发分支，日常集成
- \`feature/*\` - 功能分支，从 develop 创建
- \`hotfix/*\` - 紧急修复，从 main 创建

## Commit 规范

遵循 Conventional Commits 规范：

\`\`\`
feat: 添加用户登录功能
fix: 修复首页滚动卡顿问题
docs: 更新 API 文档
style: 调整按钮样式
refactor: 重构数据请求逻辑
test: 添加用户模块单元测试
chore: 升级依赖版本
\`\`\`

## 常用技巧

### 交互式变基

\`\`\`bash
git rebase -i HEAD~3
\`\`\`

可以合并、编辑、重排最近 3 次提交。

### 暂存工作

\`\`\`bash
git stash        # 暂存当前修改
git stash pop    # 恢复暂存
git stash list   # 查看暂存列表
\`\`\`

### 查找问题提交

\`\`\`bash
git bisect start
git bisect bad          # 当前版本有问题
git bisect good v1.0    # v1.0 没问题
# Git 会自动二分查找问题提交
\`\`\`

## 总结

规范的 Git 工作流能极大提升团队协作效率。关键是统一规范，并借助工具（如 commitlint、husky）强制执行。`
  },
  {
    id: 5,
    title: 'CSS 布局从 Flex 到 Grid',
    summary: '现代 CSS 布局方案的对比与选择，帮你做出更好的技术决策。',
    date: '2026-03-20',
    tags: ['CSS', '布局'],
    content: `## Flexbox vs Grid

一个简单的选择原则：

- **一维布局**用 Flexbox
- **二维布局**用 Grid
- **不确定就用 Flexbox**

## Flexbox 常见模式

### 居中

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

### 等间距分布

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
}
\`\`\`

### 侧边栏布局

\`\`\`css
.layout {
  display: flex;
}
.sidebar {
  width: 240px;
  flex-shrink: 0;
}
.main {
  flex: 1;
}
\`\`\`

## Grid 常见模式

### 响应式网格

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

### 经典页面布局

\`\`\`css
.page {
  display: grid;
  grid-template:
    "header header" 60px
    "sidebar main" 1fr
    / 240px 1fr;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
\`\`\`

## 组合使用

Flexbox 和 Grid 不是互斥的，可以组合使用。比如用 Grid 做页面整体布局，用 Flexbox 处理组件内部对齐。

## 总结

两者都是现代 CSS 的核心布局方案，理解各自的特点，才能在项目中做出最佳选择。`
  }
];

export default blogs;
