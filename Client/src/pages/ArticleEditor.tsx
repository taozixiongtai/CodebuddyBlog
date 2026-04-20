import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Select, Input, Button, message } from 'antd';
import { articlesApi, categoriesApi, Category } from '@/services/api';
import './ArticleEditor.css';

interface ArticleForm {
  title: string;
  content: string;
  categoryIds: number[] | null;
}

function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ArticleForm>({
    title: '',
    content: '',
    categoryIds: null,
  });
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '在这里输入文章内容...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setForm(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getList();
      setCategories(data);
    } catch (e) {
      console.error('加载分类失败', e);
    }
  }, []);

  const loadArticle = useCallback(async () => {
    if (!id) return;
    try {
      const data = await articlesApi.getById(Number(id));
      setForm({
        title: data.title || '',
        content: data.content || '',
        categoryIds: data.categories?.map(c => c.id) || null,
      });
      editor?.commands.setContent(data.content || '');
    } catch (e) {
      console.error('加载文章失败', e);
    }
  }, [id, editor]);

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadArticle();
    }
  }, [isEdit, loadArticle, loadCategories]);

  const handleSubmit = async () => {
    if (!form.title) {
      message.warning('请输入标题');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await articlesApi.update(Number(id), form);
        message.success('文章已更新');
      } else {
        await articlesApi.create(form);
        message.success('文章已保存');
      }
      navigate('/admin');
    } catch (e) {
      console.error('保存失败', e);
      message.error('保存失败，请重试');
    }
    setSaving(false);
  };

  return (
    <div className="editor-page">
      <nav className="editor-nav">
        <Link to="/admin" className="editor-nav-logo">Blog</Link>
      </nav>

      <div className="editor-container">
        <div className="editor-header">
          <h1>{isEdit ? '编辑文章' : '新增文章'}</h1>
          <div className="editor-actions">
            <Button size="large" onClick={() => navigate('/admin')}>
              返回
            </Button>
            <Button size="large" type="primary" onClick={handleSubmit} loading={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>

        <div className="editor-form">
          <div className="editor-form-group">
            <Input
              className="editor-title-input"
              placeholder="文章标题"
              variant="borderless"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="editor-form-group editor-content-group">
            <label>内容</label>
            <div className="editor-toolbar">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'is-active' : ''}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'is-active' : ''}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={editor?.isActive('strike') ? 'is-active' : ''}
              >
                ~
              </button>
              <span className="editor-toolbar-divider"></span>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
              >
                H3
              </button>
              <span className="editor-toolbar-divider"></span>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'is-active' : ''}
              >
                •
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'is-active' : ''}
              >
                1.
              </button>
              <span className="editor-toolbar-divider"></span>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={editor?.isActive('codeBlock') ? 'is-active' : ''}
              >
                {'</>'}
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={editor?.isActive('blockquote') ? 'is-active' : ''}
              >
                "
              </button>
            </div>
            <EditorContent editor={editor} className="editor-content" />
          </div>

          <div className="editor-form-group editor-tags-group">
            <label>标签</label>
            <Select
              mode="multiple"
              placeholder="搜索或选择标签"
              value={form.categoryIds || []}
              onChange={(values) => setForm(prev => ({ ...prev, categoryIds: values }))}
              style={{ width: '100%' }}
              options={categories.map(c => ({ label: c.name, value: c.id }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleEditor;
