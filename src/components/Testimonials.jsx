import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: "Martín Rossi",
    role: "Productor Agropecuario",
    text: "Excelente servicio. Repararon el monitor de siembra en tiempo récord justo cuando más lo necesitábamos para la campaña. Muy profesionales.",
    rating: 5
  },
  {
    id: 2,
    name: "Estancia La Candelaria",
    role: "Empresa Agrícola",
    text: "Confiamos todo el mantenimiento de nuestros equipos VHF y balanzas a Cristian. La atención en campo es inmejorable.",
    rating: 5
  },
  {
    id: 3,
    name: "Carlos Bianchi",
    role: "Contratista Rural",
    text: "La calibración de la balanza quedó perfecta. Destaco la rapidez y el conocimiento técnico. 100% recomendables.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <h2 className="section-title fade-in">Lo que dicen nuestros clientes</h2>
        <p className="section-subtitle fade-in">
          El respaldo de quienes confían en nuestro trabajo campaña tras campaña.
        </p>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="testimonial-card fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Quote className="quote-icon" size={40} />
              
              <div className="stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              
              <p className="testimonial-text">"{testimonial.text}"</p>
              
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
