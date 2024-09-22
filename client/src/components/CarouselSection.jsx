import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/CarouselSection.css";

const CarouselSection = () => {
  return (
    <Carousel
      className="carousel-container"
      showThumbs={false}
      autoPlay
      infiniteLoop
    >
      <div>
        <img
          src="https://www.costco.com.mx/medias/sys_master/products/hc6/hac/123077678628894.jpg"
          alt="Imagen 1"
        />
      </div>
      <div>
        <img
          src="https://wayne.com.ar/wp-content/uploads/2019/01/biocidas-01-01.jpg"
          alt="Imagen 2"
        />
      </div>
      <div>
        <img src="https://www.cienciamx.com/images/aic/1-HEAD_aeroespacial1618.jpg" alt="Imagen 3" />
      </div>
      <div>
        <img src="https://pm1.aminoapps.com/6719/b97bd242656fb0d6b5fa578855525ceb85b85c88_00.jpg" alt="Imagen 4" />
      </div>
    </Carousel>
  );
};

export default CarouselSection;
