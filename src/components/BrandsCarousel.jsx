import './BrandsCarousel.css';

// Placeholder array for brands. Later can be replaced with actual image paths.
const brands = [
  "Trimble",
  "Abelardo Cuffia",
  "Plantium",
  "Garmin",
  "Motorola",
  "Kenwood",
  "Yaesu",
  "AgroTax"
];

// Duplicate for seamless infinite scrolling
const carouselBrands = [...brands, ...brands, ...brands];

const BrandsCarousel = () => {
  return (
    <section className="brands-section">
      <div className="container">
        <h3 className="brands-title text-center fade-in">
          Trabajamos con las mejores tecnologías del mercado
        </h3>
        
        <div className="carousel-container fade-in">
          <div className="carousel-track">
            {carouselBrands.map((brand, index) => (
              <div key={index} className="brand-item">
                {/* In a real scenario, replace this text with an <img> tag */}
                <span className="brand-name">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsCarousel;
