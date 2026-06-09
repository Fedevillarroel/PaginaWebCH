import { Scale, Radio, Monitor, Wrench } from 'lucide-react';
import './Services.css';

const servicesData = [
  {
    id: 1,
    title: "Reparación de Balanzas Agrícolas",
    icon: <Scale size={40} className="service-icon" />,
    features: ["Diagnóstico", "Calibración", "Reparación", "Certificación"]
  },
  {
    id: 2,
    title: "Equipos VHF",
    icon: <Radio size={40} className="service-icon" />,
    features: ["Venta", "Instalación", "Configuración", "Mantenimiento preventivo"]
  },
  {
    id: 3,
    title: "Monitores de Siembra",
    icon: <Monitor size={40} className="service-icon" />,
    features: ["Venta", "Instalación", "Actualización", "Soporte técnico"]
  },
  {
    id: 4,
    title: "Servicio Técnico Especializado",
    icon: <Wrench size={40} className="service-icon" />,
    features: ["Atención en campo", "Soporte remoto", "Mantenimiento programado"]
  }
];

const Services = () => {
  return (
    <section className="section services-section" id="servicios">
      <div className="container">
        <h2 className="section-title fade-in">Nuestros Servicios</h2>
        <p className="section-subtitle fade-in">
          Soluciones integrales para la tecnología de tu maquinaria agrícola.
        </p>
        
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <ul className="service-features">
                {service.features.map((feature, i) => (
                  <li key={i}>
                    <div className="feature-dot"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
