import { useState, useMemo, useEffect, useRef } from 'react';
import { MessageCircle, Tag, Package } from 'lucide-react';
import './Catalog.css';

const WHATSAPP_NUMBER = '5493435348834'; // Cristian Heintz

const ProductCard = ({ product }) => {
  const message = encodeURIComponent(
    `Hola Cristian! Me interesa consultar sobre: *${product.name}*. ¿Podrías darme más información?`
  );
  const whatsappUrl = product.contact_link || `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <article className="product-card product-card--animate">
      <div className="product-card__image-wrapper">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
          />
        ) : (
          <div className="product-card__image-placeholder">
            <Package size={48} />
          </div>
        )}
        <span className="product-card__category-tag">
          <Tag size={11} />
          {product.category}
        </span>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
      </div>

      <div className="product-card__footer">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="product-card__cta"
          id={`whatsapp-btn-${product.id}`}
        >
          <MessageCircle size={17} />
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
};

const Catalog = ({ products }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const headerRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    const elements = [headerRef.current, filtersRef.current].filter(Boolean);
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['Todos', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <section className="catalog-section section" id="catalogo">
      <div className="container">
        {/* Header */}
        <div className="catalog-header fade-in" ref={headerRef}>
          <span className="catalog-header__eyebrow">Nuestros Equipos</span>
          <h2 className="catalog-header__title">Catálogo de Productos</h2>
          <p className="catalog-header__subtitle">
            Tecnología de precisión para el campo. Consultá disponibilidad y precios directamente con nosotros.
          </p>
        </div>

        {/* Category Pills */}
        <div className="catalog-filters fade-in" role="tablist" aria-label="Filtrar por categoría" ref={filtersRef}>
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`catalog-filter-pill ${activeCategory === cat ? 'catalog-filter-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="catalog-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <Package size={56} />
            <p>No hay productos en esta categoría todavía.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
