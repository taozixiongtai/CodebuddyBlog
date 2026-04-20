import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { articlesApi } from '../services/api';
import './ArticleEditor.css';

interface ArticleForm {
  title: string;
  content: string;
}

function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ArticleForm>({
    title: '',
    content: '',
  });
  const [saving, setSaving] = useState(false);

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

  const loadArticle = useCallback(async () => {
    if (!id) return;
    try {
      const data = await articlesApi.getById(Number(id));
      setForm({
        title: data.title || '',
        content: data.content || '',
      });
      editor?.commands.setContent(data.content || '');
    } catch (e) {
      console.error('加载文章失败', e);
    }
  }, [id, editor]);

  useEffect(() => {
    if (isEdit) {
      loadArticle();
    }
  }, [isEdit, loadArticle]);

  const handleSubmit = async () => {
    if (!form.title) {
      alert('请输入标题');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await articlesApi.update(Number(id), form);
      } else {
        await articlesApi.create(form);
      }
      navigate('/admin');
    } catch (e) {
      console.error('保存失败', e);
    }
    setSaving(false);
  };

  return (
    <div className="editor-page">
      <nav className="editor-nav">
        <Link to="/admin" className="editor-nav-logo">Blog</Link>
        <Link to="/admin" className="editor-nav-back">返回</Link>
      </nav>

      <div className="editor-container">
        <div className="editor-header">
          <h1>{isEdit ? '编辑文章' : '新增文章'}</h1>
          <button className="editor-save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>

        <div className="editor-form">
          <div className="editor-form-group">
            <input
              type="text"
              className="editor-title-input"
              placeholder="文章标题"
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
        </div>
      </div>
    </div>
  );
}

export default ArticleEditor;
