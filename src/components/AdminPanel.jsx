import { useState, useRef, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Upload, CheckCircle,
  AlertCircle, Loader2, ArrowLeft, FolderOpen, LogOut, Package
} from 'lucide-react';
import './AdminPanel.css';

// ── Credenciales de demo ──────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Administrador_2026';

// ── Toast Component ──────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`toast toast--${toast.type}`}>
      {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span>{toast.message}</span>
    </div>
  );
};

// ── Product Form Modal ────────────────────────────────────────
const ProductModal = ({ product, categories, onSave, onClose, isSaving }) => {
  const isEditing = Boolean(product?.id);
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || (categories[0] || ''),
    image: product?.image || '',
    contactLink: product?.contactLink || '',
    newCategory: '',
  });
  const [useNewCat, setUseNewCat] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setForm((f) => ({ ...f, image: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
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
    const finalProduct = {
      id: product?.id || Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      category: useNewCat ? form.newCategory.trim() : form.category,
      image: form.image,
      contactLink: form.contactLink.trim(),
    };
    onSave(finalProduct);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-panel">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-name">
              Nombre del Producto <span className="required">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="Ej: Balanza Agrícola 3000kg"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">Descripción / Especificaciones</label>
            <textarea
              id="prod-desc"
              className="form-textarea"
              rows={3}
              placeholder="Descripción técnica del equipo, capacidades, marca, modelo..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-category">
              Categoría <span className="required">*</span>
            </label>
            {!useNewCat ? (
              <div className="form-row">
                <select
                  id="prod-category"
                  className={`form-select ${errors.category ? 'form-input--error' : ''}`}
                  value={form.category}
                  onChange={(e) => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }); }}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" className="btn-new-cat" onClick={() => setUseNewCat(true)}>
                  + Nueva
                </button>
              </div>
            ) : (
              <div className="form-row">
                <input
                  type="text"
                  className={`form-input ${errors.category ? 'form-input--error' : ''}`}
                  placeholder="Nombre de la nueva categoría"
                  value={form.newCategory}
                  onChange={(e) => { setForm({ ...form, newCategory: e.target.value }); setErrors({ ...errors, category: '' }); }}
                  autoFocus
                />
                <button type="button" className="btn-new-cat btn-new-cat--cancel" onClick={() => { setUseNewCat(false); setForm({ ...form, newCategory: '' }); }}>
                  <X size={15} />
                </button>
              </div>
            )}
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          {/* Imagen — Drag & Drop */}
          <div className="form-group">
            <label className="form-label">Imagen del Producto</label>
            <div
              className={`dropzone ${dragOver ? 'dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              role="button"
              tabIndex={0}
              aria-label="Zona de carga de imagen"
            >
              {form.image ? (
                <div className="dropzone__preview">
                  <img src={form.image} alt="Preview" className="dropzone__img" />
                  <button
                    type="button"
                    className="dropzone__remove"
                    onClick={(e) => { e.stopPropagation(); setForm({ ...form, image: '' }); }}
                    aria-label="Quitar imagen"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="dropzone__placeholder">
                  <Upload size={32} />
                  <p>Arrastrá una imagen o <span>hacé clic para seleccionar</span></p>
                  <small>PNG, JPG, WebP — Máx. 5MB</small>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={(e) => handleImageFile(e.target.files[0])}
            />
          </div>

          {/* Enlace Contacto */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-link">Enlace de Contacto (opcional)</label>
            <input
              id="prod-link"
              type="url"
              className="form-input"
              placeholder="https://wa.me/549XXXXXXXXXX?text=..."
              value={form.contactLink}
              onChange={(e) => setForm({ ...form, contactLink: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-save" disabled={isSaving} id="save-product-btn">
              {isSaving ? (
                <><Loader2 size={17} className="spin" /> Guardando...</>
              ) : (
                <><CheckCircle size={17} /> {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Login Screen ──────────────────────────────────────────────
const LoginScreen = ({ onLogin, onBack }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        onLogin();
      } else {
        setError('Usuario o contraseña incorrectos.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <button className="login-back" onClick={onBack}><ArrowLeft size={18} /> Volver al sitio</button>
        <div className="login-icon-wrap"><FolderOpen size={36} /></div>
        <h2 className="login-title">Panel de Administración</h2>
        <p className="login-subtitle">Cristian Heintz — Acceso privado</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-user">Usuario</label>
            <input id="login-user" type="text" className="form-input" placeholder="admin" value={user} onChange={(e) => { setUser(e.target.value); setError(''); }} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-pass">Contraseña</label>
            <input id="login-pass" type="password" className="form-input" placeholder="••••••••" value={pass} onChange={(e) => { setPass(e.target.value); setError(''); }} />
          </div>
          {error && <p className="login-error"><AlertCircle size={15} /> {error}</p>}
          <button type="submit" className="btn-modal-save w-full" disabled={loading} id="login-submit-btn">
            {loading ? <><Loader2 size={17} className="spin" /> Verificando...</> : 'Ingresar'}
          </button>
        </form>
        <p className="login-hint">Acceso solo para administradores autorizados</p>
      </div>
    </div>
  );
};

// ── Main Admin Panel ──────────────────────────────────────────
const AdminPanel = ({ products, onAdd, onEdit, onDelete, onExit }) => {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = useCallback((product) => {
    setIsSaving(true);
    setTimeout(() => {
      if (editProduct) {
        onEdit(product);
        showToast('¡Producto actualizado correctamente!');
      } else {
        onAdd(product);
        showToast('¡Producto agregado al catálogo!');
      }
      setIsSaving(false);
      setShowModal(false);
      setEditProduct(null);
    }, 900);
  }, [editProduct, onAdd, onEdit]);

  const handleDelete = (product) => {
    setConfirmDelete(product);
  };

  const confirmDeleteAction = () => {
    onDelete(confirmDelete.id);
    showToast(`"${confirmDelete.name}" eliminado del catálogo.`, 'error');
    setConfirmDelete(null);
  };

  const categories = [...new Set(products.map((p) => p.category))];

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => setIsLoggedIn(true)}
        onBack={onExit}
      />
    );
  }

  return (
    <div className="admin-panel">
      <Toast toast={toast} />

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header__left">
          <h1 className="admin-title">Panel de Administración</h1>
          <p className="admin-subtitle">{products.length} producto{products.length !== 1 ? 's' : ''} en catálogo</p>
        </div>
        <div className="admin-header__actions">
          <button
            id="add-product-btn"
            className="btn-add-product"
            onClick={() => { setEditProduct(null); setShowModal(true); }}
          >
            <Plus size={18} /> Agregar Producto
          </button>
          <button className="btn-exit" onClick={onExit} title="Salir del panel">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-wrapper">
        {products.length === 0 ? (
          <div className="admin-empty">
            <Package size={56} />
            <p>No hay productos aún. ¡Agregá el primero!</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="admin-table__row">
                  <td className="admin-table__thumb-cell">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="admin-table__thumb" />
                    ) : (
                      <div className="admin-table__thumb-placeholder">
                        <Package size={22} />
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="admin-table__name">{product.name}</span>
                    {product.description && (
                      <span className="admin-table__desc-preview">{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</span>
                    )}
                  </td>
                  <td>
                    <span className="admin-table__category">{product.category}</span>
                  </td>
                  <td className="admin-table__actions">
                    <button
                      className="btn-icon-edit"
                      onClick={() => { setEditProduct(product); setShowModal(true); }}
                      title="Editar producto"
                      id={`edit-btn-${product.id}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon-delete"
                      onClick={() => handleDelete(product)}
                      title="Eliminar producto"
                      id={`delete-btn-${product.id}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          isSaving={isSaving}
        />
      )}

      {/* Confirm Delete Dialog */}
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
