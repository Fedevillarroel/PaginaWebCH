import { Microchip, Users, Zap, MapPin } from 'lucide-react';
import './WhyChooseUs.css';

const reasons = [
  {
    id: 1,
    title: "Experiencia Tecnológica",
    description: "Años de trayectoria en el sector agrotecnológico.",
    icon: <Microchip size={48} className="reason-icon" />
  },
  {
    id: 2,
    title: "Atención Personalizada",
    description: "Asesoramiento a medida para cada productor.",
    icon: <Users size={48} className="reason-icon" />
  },
  {
    id: 3,
    title: "Servicio Eficiente",
    description: "Soluciones rápidas para minimizar tiempos de inactividad.",
    icon: <Zap size={48} className="reason-icon" />
  },
  {
    id: 4,
    title: "Cobertura Regional",
    description: "Asistencia directa en el campo y en nuestras instalaciones.",
    icon: <MapPin size={48} className="reason-icon" />
  }
];

const WhyChooseUs = () => {
  return (
    <section className="section wcu-section">
      <div className="container">
        <div className="wcu-header fade-in">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <p className="section-subtitle">
            Nos comprometemos a entregar la máxima calidad y confiabilidad para el campo.
          </p>
        </div>

        <div className="wcu-grid">
          {reasons.map((reason, index) => (
            <div 
              key={reason.id} 
              className="wcu-card fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="wcu-icon-wrapper">
                {reason.icon}
              </div>
              <h3 className="wcu-title">{reason.title}</h3>
              <p className="wcu-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
