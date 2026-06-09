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
import { supabase } from './lib/supabase';

const ADMIN_PATHS = ['/admin', '/dashboard-manager'];
const ADMIN_HASH  = '#/admin';

function App() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  // ── Fetch products from Supabase ──────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Routing /admin ────────────────────────────────────────
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (ADMIN_PATHS.includes(path) || hash === ADMIN_HASH) setShowAdmin(true);
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const handleAdminExit = useCallback(() => {
    setShowAdmin(false);
    if (ADMIN_PATHS.includes(window.location.pathname) || window.location.hash === ADMIN_HASH) {
      window.history.replaceState(null, '', '/');
    }
    fetchProducts();
  }, [fetchProducts]);

  // ── Ctrl + Shift + A ──────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Fade-in animations ────────────────────────────────────
  useEffect(() => {
    if (showAdmin) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    const timer = setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [showAdmin, products]);

  if (showAdmin) {
    return <AdminPanel onExit={handleAdminExit} onRefresh={fetchProducts} />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Catalog products={products} loading={loading} />
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
