import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, X, Upload, CheckCircle,
  AlertCircle, Loader2, ArrowLeft, ShieldCheck, LogOut, Package,
  User, Lock, Eye, EyeOff
} from 'lucide-react';
import './AdminPanel.css';
import { supabase } from '../lib/supabase';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Administrador_2026';
const BUCKET     = 'product-images';

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`toast toast--${toast.type}`}>
      {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span>{toast.message}</span>
    </div>
  );
};

// ── Product Modal ─────────────────────────────────────────────
const ProductModal = ({ product, categories, onSave, onClose, isSaving }) => {
  const isEditing = Boolean(product?.id);
  const [form, setForm] = useState({
    name:         product?.name || '',
    description:  product?.description || '',
    category:     product?.category || (categories[0] || ''),
    imageUrl:     product?.image_url || '',
    imageFile:    null,
    imagePreview: product?.image_url || '',
    contactLink:  product?.contact_link || '',
    newCategory:  '',
  });
  const [useNewCat, setUseNewCat] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [errors, setErrors]       = useState({});
  const fileRef = useRef();

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setForm(f => ({ ...f, imageFile: file, imagePreview: e.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio.';
    const cat = useNewCat ? form.newCategory.trim() : form.category;
    if (!cat) errs.category = 'La categoría es obligatoria.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      id:          product?.id,
      name:        form.name.trim(),
      description: form.description.trim(),
      category:    useNewCat ? form.newCategory.trim() : form.category,
      imageUrl:    form.imageUrl,
      imageFile:   form.imageFile,
      contact_link: form.contactLink.trim(),
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-panel">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-name">Nombre <span className="required">*</span></label>
            <input id="prod-name" type="text" className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="Ej: Balanza Agrícola 3000kg" value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">Descripción</label>
            <textarea id="prod-desc" className="form-textarea" rows={3}
              placeholder="Descripción técnica del equipo..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-category">Categoría <span className="required">*</span></label>
            {!useNewCat ? (
              <div className="form-row">
                <select id="prod-category" className={`form-select ${errors.category ? 'form-input--error' : ''}`}
                  value={form.category} onChange={(e) => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }); }}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" className="btn-new-cat" onClick={() => setUseNewCat(true)}>+ Nueva</button>
              </div>
            ) : (
              <div className="form-row">
                <input type="text" className={`form-input ${errors.category ? 'form-input--error' : ''}`}
                  placeholder="Nombre de la nueva categoría" value={form.newCategory} autoFocus
                  onChange={(e) => { setForm({ ...form, newCategory: e.target.value }); setErrors({ ...errors, category: '' }); }} />
                <button type="button" className="btn-new-cat btn-new-cat--cancel"
                  onClick={() => { setUseNewCat(false); setForm({ ...form, newCategory: '' }); }}><X size={15} /></button>
              </div>
            )}
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          {/* Imagen */}
          <div className="form-group">
            <label className="form-label">Imagen del Producto</label>
            <div className={`dropzone ${dragOver ? 'dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current.click()} role="button" tabIndex={0} aria-label="Zona de carga de imagen">
              {form.imagePreview ? (
                <div className="dropzone__preview">
                  <img src={form.imagePreview} alt="Preview" className="dropzone__img" />
                  <button type="button" className="dropzone__remove"
                    onClick={(e) => { e.stopPropagation(); setForm({ ...form, imageUrl: '', imageFile: null, imagePreview: '' }); }}
                    aria-label="Quitar imagen"><X size={16} /></button>
                </div>
              ) : (
                <div className="dropzone__placeholder">
                  <Upload size={32} />
                  <p>Arrastrá una imagen o <span>hacé clic para seleccionar</span></p>
                  <small>PNG, JPG, WebP — Máx. 5MB</small>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden-file-input"
              onChange={(e) => handleImageFile(e.target.files[0])} />
          </div>

          {/* Enlace Contacto */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-link">Enlace de Contacto (opcional)</label>
            <input id="prod-link" type="url" className="form-input"
              placeholder="https://wa.me/549XXXXXXXXXX?text=..."
              value={form.contactLink} onChange={(e) => setForm({ ...form, contactLink: e.target.value })} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-modal-save" disabled={isSaving} id="save-product-btn">
              {isSaving ? <><Loader2 size={17} className="spin" /> Guardando...</> : <><CheckCircle size={17} /> {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Login Screen ──────────────────────────────────────────────
const LoginScreen = ({ onLogin, onBack }) => {
  const [user, setUser]         = useState('');
  const [pass, setPass]         = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        onLogin();
      } else {
        setError('Usuario o contraseña incorrectos.');
        setPass('');
        setLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 800);
  };

  return (
    <div className="login-screen">
      <div className={`login-card ${shake ? 'login-card--shake' : ''}`}>
        <button className="login-back" onClick={onBack}><ArrowLeft size={16} /> Volver al sitio</button>
        <div className="login-icon-wrap"><ShieldCheck size={32} /></div>
        <h2 className="login-title">Panel de Administración</h2>
        <p className="login-subtitle">Cristian Heintz &mdash; Acceso restringido</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="login-user">Usuario</label>
            <div className="login-input-wrap">
              <User size={15} className="login-input-icon" />
              <input id="login-user" type="text" className="form-input login-input-padded"
                placeholder="Ingresá tu usuario" value={user} autoFocus
                onChange={(e) => { setUser(e.target.value); setError(''); }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-pass">Contraseña</label>
            <div className="login-input-wrap">
              <Lock size={15} className="login-input-icon" />
              <input id="login-pass" type={showPass ? 'text' : 'password'}
                className="form-input login-input-padded login-input-padded--right"
                placeholder="Ingresá tu contraseña" value={pass}
                onChange={(e) => { setPass(e.target.value); setError(''); }} />
              <button type="button" className="login-toggle-pass" onClick={() => setShowPass(v => !v)}
                tabIndex={-1} aria-label={showPass ? 'Ocultar' : 'Mostrar'}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <div className="login-error"><AlertCircle size={15} />{error}</div>}
          <button type="submit" className="btn-modal-save w-full" disabled={loading || !user || !pass} id="login-submit-btn">
            {loading ? <><Loader2 size={17} className="spin" /> Verificando...</> : <><ShieldCheck size={17} /> Ingresar al panel</>}
          </button>
        </form>
        <p className="login-hint">Acceso solo para administradores autorizados</p>
      </div>
    </div>
  );
};

// ── Main Admin Panel ──────────────────────────────────────────
const AdminPanel = ({ onExit, onRefresh }) => {
  const [products, setProducts]       = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isSaving, setIsSaving]       = useState(false);
  const [toast, setToast]             = useState(null);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('products').select('*').order('created_at', { ascending: true });
    if (!error && data) setProducts(data);
    setLoadingData(false);
  }, []);

  useEffect(() => { if (isLoggedIn) fetchProducts(); }, [isLoggedIn, fetchProducts]);

  const handleSave = useCallback(async (formData) => {
    setIsSaving(true);
    try {
      let imageUrl = formData.imageUrl || '';

      // Convertir imagen a base64 y guardar en DB (sin depender de Storage)
      if (formData.imageFile) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.imageFile);
        });
      }

      const payload = {
        name:         formData.name,
        description:  formData.description,
        category:     formData.category,
        image_url:    imageUrl,
        contact_link: formData.contact_link,
      };

      if (formData.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', formData.id);
        if (error) throw error;
        showToast('¡Producto actualizado correctamente!');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        showToast('¡Producto agregado al catálogo!');
      }

      await fetchProducts();
      setShowModal(false);
      setEditProduct(null);
    } catch (err) {
      showToast('Error al guardar. Intentá de nuevo.', 'error');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [fetchProducts]);


  const confirmDeleteAction = async () => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', confirmDelete.id);
      if (error) throw error;
      showToast(`"${confirmDelete.name}" eliminado.`, 'error');
      setConfirmDelete(null);
      await fetchProducts();
    } catch {
      showToast('Error al eliminar. Intentá de nuevo.', 'error');
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} onBack={onExit} />;
  }

  return (
    <div className="admin-panel">
      <Toast toast={toast} />
      <div className="admin-header">
        <div className="admin-header__left">
          <h1 className="admin-title">Panel de Administración</h1>
          <p className="admin-subtitle">{products.length} producto{products.length !== 1 ? 's' : ''} en catálogo</p>
        </div>
        <div className="admin-header__actions">
          <button id="add-product-btn" className="btn-add-product"
            onClick={() => { setEditProduct(null); setShowModal(true); }}>
            <Plus size={18} /> Agregar Producto
          </button>
          <button className="btn-exit" onClick={onExit} title="Salir del panel"><LogOut size={18} /></button>
        </div>
      </div>

      <div className="admin-table-wrapper">
        {loadingData ? (
          <div className="admin-empty"><Loader2 size={36} className="spin" /><p>Cargando productos...</p></div>
        ) : products.length === 0 ? (
          <div className="admin-empty"><Package size={56} /><p>No hay productos aún. ¡Agregá el primero!</p></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Acciones</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="admin-table__row">
                  <td className="admin-table__thumb-cell">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="admin-table__thumb" />
                    ) : (
                      <div className="admin-table__thumb-placeholder"><Package size={22} /></div>
                    )}
                  </td>
                  <td>
                    <span className="admin-table__name">{product.name}</span>
                    {product.description && (
                      <span className="admin-table__desc-preview">
                        {product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}
                      </span>
                    )}
                  </td>
                  <td><span className="admin-table__category">{product.category}</span></td>
                  <td className="admin-table__actions">
                    <button className="btn-icon-edit" onClick={() => { setEditProduct(product); setShowModal(true); }}
                      title="Editar" id={`edit-btn-${product.id}`}><Pencil size={16} /></button>
                    <button className="btn-icon-delete" onClick={() => setConfirmDelete(product)}
                      title="Eliminar" id={`delete-btn-${product.id}`}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <ProductModal product={editProduct} categories={categories}
          onSave={handleSave} onClose={() => { setShowModal(false); setEditProduct(null); }} isSaving={isSaving} />
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <AlertCircle size={40} className="confirm-icon" />
            <h3>¿Eliminár este producto?</h3>
            <p>Se va a quitar <strong>"{confirmDelete.name}"</strong> del catálogo. Esta acción no se puede deshacer.</p>
            <div className="confirm-actions">
              <button className="btn-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-delete-confirm" onClick={confirmDeleteAction} id="confirm-delete-btn">
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
