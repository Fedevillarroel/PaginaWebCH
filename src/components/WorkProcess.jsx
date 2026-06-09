import { PhoneCall, ClipboardCheck, Wrench, CheckCircle } from 'lucide-react';
import './WorkProcess.css';

const steps = [
  {
    id: 1,
    title: "Contacto y diagnóstico",
    description: "Nos contactás con tu requerimiento y realizamos un primer diagnóstico remoto.",
    icon: <PhoneCall size={32} />
  },
  {
    id: 2,
    title: "Evaluación técnica",
    description: "Revisión exhaustiva del equipo en nuestro taller o en campo.",
    icon: <ClipboardCheck size={32} />
  },
  {
    id: 3,
    title: "Reparación o instalación",
    description: "Ejecución del servicio con repuestos originales y personal calificado.",
    icon: <Wrench size={32} />
  },
  {
    id: 4,
    title: "Pruebas y puesta en marcha",
    description: "Testeo final y calibración para asegurar el funcionamiento óptimo.",
    icon: <CheckCircle size={32} />
  }
];

const WorkProcess = () => {
  return (
    <section className="section process-section">
      <div className="container">
        <h2 className="section-title fade-in">Nuestro Proceso de Trabajo</h2>
        <p className="section-subtitle fade-in">
          Una metodología comprobada para garantizar resultados eficientes.
        </p>

        <div className="process-timeline">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="process-step fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="step-number">0{step.id}</div>
              <div className="step-icon-wrapper">
                {step.icon}
              </div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-description">{step.description}</p>
              
              {/* Connector line (hidden on the last item via CSS) */}
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
