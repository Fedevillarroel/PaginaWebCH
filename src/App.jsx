import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import BrandsCarousel from './components/BrandsCarousel';
import WorkProcess from './components/WorkProcess';
import CTA from './components/CTA';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

import balanzasImg from './assets/images/balanzas_agricolas.png';
import vhfImg from './assets/images/equipos_vhf.png';
import monitorImg from './assets/images/monitor_siembra.png';

// ── Initial demo products ─────────────────────────────────
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Balanza Agrícola Rango 3000 kg',
    description: 'Sistema de pesaje de alta precisión para cosechadoras y tractores. Certificación OIML. Pantalla digital de alta legibilidad en campo.',
    category: 'Balanzas Agrícolas',
    image: balanzasImg,
    contactLink: '',
  },
  {
    id: 2,
    name: 'Equipo VHF Radio Frecuencia Campo',
    description: 'Comunicación de largo alcance para operaciones en lote. Frecuencia 136–174 MHz, antena omnidireccional, resistente a polvo y agua (IP67).',
    category: 'Equipos VHF',
    image: vhfImg,
    contactLink: '',
  },
  {
    id: 3,
    name: 'Monitor de Siembra Precision 12 surcos',
    description: 'Control en tiempo real de dosificación, obturaciones y velocidad de siembra. Pantalla táctil 7", compatible con la mayoría de las sembradoras del mercado.',
    category: 'Monitores de Siembra',
    image: monitorImg,
    contactLink: '',
  },
];

// ── localStorage helpers ──────────────────────────────────
const STORAGE_KEY = 'ch_catalog_products';

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    console.warn('Error al guardar en localStorage.');
  }
}

// ── Admin route paths ────────────────────────────────────
const ADMIN_PATHS = ['/admin', '/dashboard-manager'];
const ADMIN_HASH  = '#/admin';

// ── App ───────────────────────────────────────────────────
// ── Verificar sesión guardada ────────────────────────────
function isAuthenticated() {
  return sessionStorage.getItem('ch_admin_auth') === 'true';
}

function App() {
  const [products, setProducts]     = useState(loadProducts);
  const [showAdmin, setShowAdmin]   = useState(false);
  const [isAuthed,  setIsAuthed]    = useState(isAuthenticated);

  // ── 1. URL path (/admin) y hash (#/admin) ───────────────
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (ADMIN_PATHS.includes(path) || hash === ADMIN_HASH) {
        setShowAdmin(true);
      }
    };

    checkRoute(); // on first load
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Limpiar la URL al salir del admin
  const handleAdminExit = useCallback(() => {
    setShowAdmin(false);
    setIsAuthed(false);
    sessionStorage.removeItem('ch_admin_auth');
    // Si estamos en /admin, volvemos a /
    if (ADMIN_PATHS.includes(window.location.pathname) || window.location.hash === ADMIN_HASH) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  // ── 2. Teclado: Ctrl + Shift + A (robusto, acepta 'a' y 'A') ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      // e.key puede ser 'a' o 'A' según el navegador cuando Shift está activo
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Persist products to localStorage ────────────────────
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // ── Intersection Observer for fade-in animations ─────────
  useEffect(() => {
    if (showAdmin) return;
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [showAdmin, products]);

  // ── CRUD handlers ────────────────────────────────────────
  const handleAdd = useCallback((product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const handleEdit = useCallback((updated) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  }, []);

  const handleDelete = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // ── Admin View (con login guard) ────────────────────────
  if (showAdmin) {
    if (!isAuthed) {
      return <AdminLogin onSuccess={() => setIsAuthed(true)} />;
    }
    return (
      <AdminPanel
        products={products}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExit={handleAdminExit}
      />
    );
  }

  // ── Public Landing ──────────────────────────────────────
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Catalog products={products} />
        <Services />
        <WhyChooseUs />
        <BrandsCarousel />
        <WorkProcess />
        <CTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default App;
