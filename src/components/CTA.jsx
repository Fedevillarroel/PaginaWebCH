import { Phone, MessageCircle } from 'lucide-react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content fade-in">
          <h2 className="cta-title">¿Necesitás asistencia técnica para tu equipo?</h2>
          <p className="cta-text">
            Contactanos hoy mismo y obtené una solución rápida y profesional.
          </p>
          <div className="cta-buttons">
            <a href="tel:+5493434059997" className="btn btn-primary btn-large">
              <Phone size={20} className="btn-icon" /> Llamar ahora
            </a>
            <a href="https://wa.me/5493434059997" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-large">
              <MessageCircle size={20} className="btn-icon" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
