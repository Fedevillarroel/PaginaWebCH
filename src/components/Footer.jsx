import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer" id="contacto">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">Cristian Heintz</h3>
            <p className="footer-desc">
              Soluciones tecnológicas para el agro. Expertos en reparación de balanzas, equipos VHF y monitores de siembra.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Servicios</h4>
            <ul>
              <li><a href="#servicios">Balanzas Agrícolas</a></li>
              <li><a href="#servicios">Equipos VHF</a></li>
              <li><a href="#servicios">Monitores de Siembra</a></li>
              <li><a href="#servicios">Servicio Técnico</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contacto</h4>
            <ul className="contact-info">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>Viale, Entre Ríos, Argentina</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <a href="https://wa.me/5493434059997" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                  +54 9 3434 059997
                </a>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>contacto@cristianheintz.com</span>
              </li>
            </ul>
          </div>

          <div className="footer-map">
            {/* Simple placeholder for Google Maps iframe */}
            <div className="map-placeholder">
              <iframe
                src="https://maps.google.com/maps?q=-31.866479,-59.9929181&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Cristian Heintz - Gualeguaychú"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cristian Heintz. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
