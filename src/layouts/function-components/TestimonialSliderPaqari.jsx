import React, { useRef, useState } from "react";
import { Star } from "react-feather";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

const TestimonialSlider = ({ list }) => {
  SwiperCore.use([Pagination, Navigation, Autoplay]);
  const [swiper, setSwiper] = useState(null);

  // 👇 sin tipos TS aquí (estás en .jsx/.js)
  const paginationRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="reviews-carousel relative">
      <Swiper
        pagination={{
          type: "bullets",
          el: paginationRef.current,
          clickable: true,
          dynamicBullets: true,
        }}
        onBeforeInit={(swiperInstance) => {
          // 🔗 conectar paginación
          if (paginationRef.current) {
            swiperInstance.params.pagination = {
              ...swiperInstance.params.pagination,
              el: paginationRef.current,
              clickable: true,
              dynamicBullets: true,
            };
          }
          // 🔗 conectar flechas
          if (prevRef.current && nextRef.current) {
            swiperInstance.params.navigation = {
              ...swiperInstance.params.navigation,
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            };
          }
        }}
        onSwiper={(s) => {
          setSwiper(s);
          setTimeout(() => {
            s.pagination?.render?.();
            s.pagination?.update?.();
            s.navigation?.update?.();
            s.autoplay?.start?.(); // ✅ inicia autoplay
          });
        }}
        loop={true}
        modules={[Pagination, Navigation, Autoplay]}
        slidesPerView={1}
        breakpoints={{
          992: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        navigation
        autoplay={{
          delay: 2000,                // ⏱ tiempo entre slides
          disableOnInteraction: false, // sigue después de interacción
          pauseOnMouseEnter: true,     // pausa al pasar el mouse
        }}
        speed={1500} // 🎞 suaviza la transición
      >
        {list.map((item, i) => (
          <SwiperSlide key={"feature-" + i}>
            <div className="relative overflow-hidden group">
              {/* Imagen */}
              <a
                href={item.image}
                data-pswp-item
                className="block h-full"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-[420px] w-full object-cover transition duration-700 transform lg:group-hover:scale-105"
                />
              </a>

              {/* Capa oscura (solo visible en pantallas grandes) */}
              <div
                className="
                  absolute inset-0 hidden lg:block 
                  bg-black/60 opacity-100 
                  lg:group-hover:opacity-0 lg:group-hover:shadow-lg
                  transition duration-500
                "
              ></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative my-2 flex justify-center">
        <div
          width="100%"
          className="swiper-pagination reviews-carousel-pagination reviews-carousel-galery !-bottom-5"
          style={{ width: "100%" }}
          ref={paginationRef}
        />
      </div>
    </div>
  );
};

export default TestimonialSlider;
