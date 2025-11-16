import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { featuredProjects } from "../../assets/media";
import "swiper/css";
import "swiper/css/pagination";
import "../../pages/Home.css";

const FeaturedProjects = () => (
  <section className="section section--projects">
    <div className="container">
      <header className="section__header">
        <span className="section__eyebrow">Featured Projects</span>
        <h2 className="section__title">
          Blueprints transformed into city landmarks
        </h2>
        <p className="section__description">
          A glimpse into the developments we have accelerated—from luxury
          residences to expansive tech parks—powered by meticulous compliance
          orchestration.
        </p>
      </header>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        spaceBetween={28}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 1.3 },
          1024: { slidesPerView: 1.6 },
        }}
        className="projects-carousel"
      >
        {featuredProjects.map((project) => (
          <SwiperSlide key={project.title}>
            <motion.article
              className="project-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="project-card__media" aria-hidden>
                <img src={project.image} alt="" loading="lazy" />
                <div className="project-card__overlay" />
              </div>
              <div className="project-card__content">
                <h3>{project.title}</h3>
                <span>{project.subtitle}</span>
                <p>{project.description}</p>
              </div>
            </motion.article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default FeaturedProjects;
