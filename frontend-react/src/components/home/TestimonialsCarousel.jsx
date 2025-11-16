import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { testimonials } from "../../assets/content";
import "swiper/css";
import "swiper/css/pagination";

const TestimonialsCarousel = () => (
  <section className="section">
    <div className="container testimonials">
      <header className="section__header">
        <span className="section__eyebrow">Client Stories</span>
        <h2 className="section__title">
          Trusted by visionary developers and compliance leaders
        </h2>
        <p className="section__description">
          We partner with enterprises and growth-stage developers to unlock
          faster go-to-market cycles, mitigate risks, and align stakeholders
          with transparency.
        </p>
      </header>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1080: { slidesPerView: 3 },
        }}
        className="testimonials__slider"
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.author}>
            <motion.article
              className="testimonials__card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="testimonials__quote">“{item.quote}”</p>
              <div className="testimonials__author">
                <span>{item.author}</span>
                <p>{item.role}</p>
              </div>
            </motion.article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default TestimonialsCarousel;
