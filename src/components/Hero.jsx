import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Phone } from 'lucide-react';
import './Hero.css';
import heroBg from '../assets/images/hero_bg.png';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-background" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text-content fade-in">
          <h1 className="hero-title">
            Soluciones Tecnológicas <br />
            <span className="text-highlight">para el Agro</span>
          </h1>
          <p className="hero-subtitle">
            Reparación de balanzas agrícolas, equipos VHF y monitores de siembra. 
            Brindando servicio técnico especializado para productores y empresas agropecuarias.
          </p>
          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary">
              Solicitar Asesoramiento <ChevronRight size={18} className="btn-icon" />
            </a>
            <a href="https://wa.me/5493435348834" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <Phone size={18} className="btn-icon" /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
