import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Layers } from 'lucide-react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';

const emptyCategoryForm = { name: '', description: '', icon: '', displayOrder: 0 };
const emptyElementForm = { name: '', defaultSize: 140, displayOrder: 0 };

const Kriya = () => {
  const { showToast } = useToast();

  // ---------- data ----------
  const [categories, setCategories] = useState([]);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elementsLoading, setElementsLoading] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // ---------- category modal ----------
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categoryImage, setCategoryImage] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // ---------- element modal ----------
  const [showElementModal, setShowElementModal] = useState(false);
  const [editingElementId, setEditingElementId] = useState(null);
  const [elementForm, setElementForm] = useState(emptyElementForm);
  const [elementImage, setElementImage] = useState(null);
  const [savingElement, setSavingElement] = useState(false);

  const fetchCategories = () =>
    api.get('/kriya/categories/admin/all').then((res) => {
      setCategories(res.data);
      setLoading(false);
      // Keep (or default to) a valid selection once categories load/change
      setActiveCategoryId((prev) => (prev && res.data.some((c) => c._id === prev) ? prev : res.data[0]?._id || null));
    });

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (!activeCategoryId) { setElements([]); return; }
    setElementsLoading(true);
    api.get(`/kriya/elements/admin/all?category=${activeCategoryId}`).then((res) => {
      setElements(res.data);
      setElementsLoading(false);
    });
  }, [activeCategoryId]);

  const activeCategory = categories.find((c) => c._id === activeCategoryId);

  /* ---------------- category CRUD ---------------- */

  const openNewCategory = () => { setCategoryForm(emptyCategoryForm); setCategoryImage(null); setEditingCategoryId(null); setShowCategoryModal(true); };
  const openEditCategory = (c) => {
    setCategoryForm({ name: c.name, description: c.description, icon: c.icon, displayOrder: c.displayOrder });
    setCategoryImage(null);
    setEditingCategoryId(c._id);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      const fd = new FormData();
      Object.entries(categoryForm).forEach(([k, v]) => fd.append(k, v));
      if (categoryImage) fd.append('coverImage', categoryImage);
      if (editingCategoryId) {
        await api.put(`/kriya/categories/${editingCategoryId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Category updated', 'success');
      } else {
        const { data } = await api.post('/kriya/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Category created — now add some elements to it', 'success');
        setActiveCategoryId(data._id);
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  const toggleCategoryActive = async (c) => {
    await api.put(`/kriya/categories/${c._id}`, { isActive: !c.isActive });
    fetchCategories();
  };

  const handleDeleteCategory = async (c) => {
    if (!confirm(`Delete category "${c.name}"? This only works if it has no elements left.`)) return;
    try {
      await api.delete(`/kriya/categories/${c._id}`);
      showToast('Category deleted', 'success');
      if (activeCategoryId === c._id) setActiveCategoryId(null);
      fetchCategories();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  /* ---------------- element CRUD ---------------- */

  const refetchElements = () => {
    if (!activeCategoryId) return;
    api.get(`/kriya/elements/admin/all?category=${activeCategoryId}`).then((res) => setElements(res.data));
  };

  const openNewElement = () => { setElementForm(emptyElementForm); setElementImage(null); setEditingElementId(null); setShowElementModal(true); };
  const openEditElement = (el) => {
    setElementForm({ name: el.name, defaultSize: el.defaultSize, displayOrder: el.displayOrder });
    setElementImage(null);
    setEditingElementId(el._id);
    setShowElementModal(true);
  };

  const handleElementSubmit = async (e) => {
    e.preventDefault();
    if (!editingElementId && !elementImage) {
      showToast('Please choose an image to upload', 'error');
      return;
    }
    setSavingElement(true);
    try {
      const fd = new FormData();
      Object.entries(elementForm).forEach(([k, v]) => fd.append(k, v));
      fd.append('category', activeCategoryId);
      if (elementImage) fd.append('image', elementImage);
      if (editingElementId) {
        await api.put(`/kriya/elements/${editingElementId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Element updated', 'success');
      } else {
        await api.post('/kriya/elements', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Element uploaded to Cloudinary ✅', 'success');
      }
      setShowElementModal(false);
      refetchElements();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingElement(false);
    }
  };

  const toggleElementActive = async (el) => {
    await api.put(`/kriya/elements/${el._id}`, { isActive: !el.isActive });
    refetchElements();
  };

  const handleDeleteElement = async (el) => {
    if (!confirm(`Delete "${el.name}"?`)) return;
    try {
      await api.delete(`/kriya/elements/${el._id}`);
      showToast('Element deleted', 'success');
      refetchElements();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink flex items-center gap-2"><Layers size={26} className="text-rani" /> Kriya Studio</h1>
          <p className="text-ink/50 text-sm mt-1">Manage the categories and element images customers drag onto the Kriya canvas.</p>
        </div>
        <button onClick={openNewCategory} className="btn-sticker bg-rani text-white px-5 py-2.5 text-sm hover:bg-rani-dark">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* ---------- category list ---------- */}
        <div className="bg-white rounded-3xl p-3 shadow-soft space-y-1">
          {categories.length === 0 && (
            <p className="text-ink/40 text-sm text-center py-8 px-3">No categories yet — add one to get started (e.g. "Flower" or "Paper").</p>
          )}
          {categories.map((c) => (
            <div
              key={c._id}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-2xl cursor-pointer transition-colors ${activeCategoryId === c._id ? 'bg-rani text-white' : 'hover:bg-blush text-ink'}`}
              onClick={() => setActiveCategoryId(c._id)}
            >
              <span className="text-lg shrink-0">{c.icon || '🗂️'}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-sm truncate">{c.name}</p>
                <p className={`text-[11px] truncate ${activeCategoryId === c._id ? 'text-white/70' : 'text-ink/40'}`}>{c.isActive ? 'Active' : 'Hidden'}</p>
              </div>
              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); openEditCategory(c); }} className={`w-7 h-7 rounded-full flex items-center justify-center ${activeCategoryId === c._id ? 'hover:bg-white/20' : 'hover:bg-white'}`}><Edit2 size={13} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(c); }} className={`w-7 h-7 rounded-full flex items-center justify-center ${activeCategoryId === c._id ? 'hover:bg-white/20' : 'hover:bg-white'}`}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- elements grid for selected category ---------- */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft min-h-[300px]">
          {!activeCategory ? (
            <p className="text-ink/40 text-sm text-center py-16">Select or create a category to manage its elements.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="font-display font-bold text-xl text-ink">{activeCategory.icon} {activeCategory.name}</h2>
                  <label className="flex items-center gap-2 text-xs font-semibold text-ink/60 cursor-pointer mt-1">
                    <input type="checkbox" checked={activeCategory.isActive} onChange={() => toggleCategoryActive(activeCategory)} className="accent-rani" />
                    Visible to customers
                  </label>
                </div>
                <button onClick={openNewElement} className="btn-sticker bg-indigo_ink text-white px-4 py-2.5 text-sm hover:opacity-90">
                  <Plus size={15} /> Upload Element
                </button>
              </div>

              {elementsLoading ? (
                <Loader />
              ) : elements.length === 0 ? (
                <div className="text-center py-14 text-ink/40">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No elements in "{activeCategory.name}" yet. Upload the first one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {elements.map((el) => (
                    <div key={el._id} className="group relative bg-blush/50 rounded-2xl p-2.5 aspect-square flex flex-col">
                      <div className="flex-1 flex items-center justify-center overflow-hidden">
                        <img src={el.image} alt={el.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                      </div>
                      <p className="text-[11px] font-semibold text-ink/70 truncate text-center mt-1">{el.name}</p>
                      {!el.isActive && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-ink/60 text-white px-1.5 py-0.5 rounded-full">Hidden</span>}
                      <div className="absolute top-1.5 right-1.5 hidden group-hover:flex flex-col gap-1">
                        <button onClick={() => openEditElement(el)} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-ink/60 hover:text-rani"><Edit2 size={11} /></button>
                        <button onClick={() => toggleElementActive(el)} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-ink/60 hover:text-rani" title={el.isActive ? 'Hide' : 'Show'}>
                          {el.isActive ? '🙈' : '👁️'}
                        </button>
                        <button onClick={() => handleDeleteElement(el)} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-ink/60 hover:text-rani"><Trash2 size={11} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---------- category modal ---------- */}
      {showCategoryModal && (
        <Modal title={editingCategoryId ? 'Edit Category' : 'Add Category'} onClose={() => setShowCategoryModal(false)}>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <input required placeholder="Category Name (e.g. Flower)" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            <textarea placeholder="Description (optional)" rows={2} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Icon (emoji, optional)" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              <input type="number" placeholder="Display Order" value={categoryForm.displayOrder} onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })} className="bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink/50 mb-1.5">Cover image (optional, shown in the sidebar tab)</label>
              <input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} className="text-sm" />
            </div>
            <div className="flex gap-2 pt-2">
              <button disabled={savingCategory} className="btn-sticker bg-rani text-white px-6 py-3 text-sm disabled:opacity-60">{savingCategory ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="btn-sticker bg-blush text-ink px-6 py-3 text-sm">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------- element modal ---------- */}
      {showElementModal && (
        <Modal title={editingElementId ? 'Edit Element' : `Upload to ${activeCategory?.name}`} onClose={() => setShowElementModal(false)}>
          <form onSubmit={handleElementSubmit} className="space-y-4">
            <input required placeholder="Element name" value={elementForm.name} onChange={(e) => setElementForm({ ...elementForm, name: e.target.value })} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink/50 mb-1.5">Default size on canvas (px)</label>
                <input type="number" value={elementForm.defaultSize} onChange={(e) => setElementForm({ ...elementForm, defaultSize: e.target.value })} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/50 mb-1.5">Display order</label>
                <input type="number" value={elementForm.displayOrder} onChange={(e) => setElementForm({ ...elementForm, displayOrder: e.target.value })} className="w-full bg-blush/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink/50 mb-1.5">
                Image{editingElementId ? ' (leave empty to keep current)' : ''} — transparent PNG works best
              </label>
              <input type="file" accept="image/*" onChange={(e) => setElementImage(e.target.files[0])} className="text-sm" />
            </div>
            <div className="flex gap-2 pt-2">
              <button disabled={savingElement} className="btn-sticker bg-rani text-white px-6 py-3 text-sm disabled:opacity-60">{savingElement ? 'Uploading…' : 'Save'}</button>
              <button type="button" onClick={() => setShowElementModal(false)} className="btn-sticker bg-blush text-ink px-6 py-3 text-sm">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Kriya;
