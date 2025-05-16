"use client";

import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import "@/public/css/global.css";
import Timeline from "./Timeline";

declare module 'particles.js';

declare global {
  interface Window {
    particlesJS: unknown;
  }
}

const CarouselPage: React.FC = () => {
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("particles.js").then(() => {
        if (window.particlesJS) {
          type ParticlesJSFn = (id: string, config: object) => void;

          (window.particlesJS as ParticlesJSFn)("particles-js", {
            particles: {
              number: { value: 75, density: { enable: true, value_area: 500 } },
              color: { value: "#ffffff" },
              shape: { type: "circle", stroke: { width: 0, color: "#000" } },
              opacity: { value: 0.5 },
              size: { value: 5, random: true },
              line_linked: {
                enable: true,
                distance: 250,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
              },
              move: { enable: true, speed: 2, direction: "none" },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
              },
              modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 },
              },
            },
            retina_detect: true,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      class VerticalMouseDrivenCarousel {
        private posY = 0;
        private isMouseOverImage = false;
        private listItems = 0;
        private defaults = {
          carousel: ".js-carousel",
          bgImg: ".js-carousel-bg-img",
          list: ".js-carousel-list",
          listItem: ".js-carousel-list-item",
        };

        constructor() {
          this.initCursor();
          this.init();
          this.bgImgController();
          this.preventScrollOnImages();
        }

        private getBgImgs = () => document.querySelectorAll(this.defaults.bgImg);
        private getListItems = () => document.querySelectorAll(this.defaults.listItem);
        private getList = () => document.querySelector(this.defaults.list);
        private getCarousel = () => document.querySelector(this.defaults.carousel);

        private init() {
          const bgImgs = this.getBgImgs();
          gsap.set(bgImgs, { autoAlpha: 0, scale: 1.05 });
          gsap.set(bgImgs[0], { autoAlpha: 1, scale: 1 });
          this.listItems = this.getListItems().length - 1;
          this.listOpacityController(0);
        }

        private initCursor() {
          const list = this.getList();
          const carousel = this.getCarousel();
          if (!list || !carousel) return;

          const listHeight = list.clientHeight;
          const carouselHeight = carousel.clientHeight;
          const bottomLimit = carouselHeight * 0.75;

          carousel.addEventListener("mousemove", (e: Event) => {
            if (this.isMouseOverImage) return;
            const mouseEvent = e as MouseEvent;
            this.posY = mouseEvent.pageY - carousel.getBoundingClientRect().top;
            const normalizedPosY = Math.max(0, Math.min(bottomLimit, this.posY));
            const offset = (-normalizedPosY / carouselHeight) * listHeight;
            gsap.to(list, { duration: 0.3, y: offset });
          });
        }

        private preventScrollOnImages() {
          this.getBgImgs().forEach((img) => {
            img.addEventListener("mouseenter", () => (this.isMouseOverImage = true));
            img.addEventListener("mouseleave", () => (this.isMouseOverImage = false));
          });
        }

        private bgImgController() {
          this.getListItems().forEach((link) => {
            link.addEventListener("mouseenter", (e) => {
              const target = e.currentTarget as HTMLElement;
              const id = parseInt(target.dataset.itemId || "0");
              this.listOpacityController(id);
              gsap.to(target, { duration: 0.2, autoAlpha: 1 });
              gsap.to(".is-visible", { duration: 0.2, autoAlpha: 0, scale: 1.05 });

              const bgImg = this.getBgImgs()[id];
              if (!bgImg.classList.contains("is-visible")) {
                bgImg.classList.add("is-visible");
              }

              gsap.to(bgImg, { duration: 0.2, autoAlpha: 1, scale: 1 });

              const timelineVisibilityEvent = new CustomEvent("timelineVisibility", {
                detail: { isVisible: id === 1 },
              });
              document.dispatchEvent(timelineVisibilityEvent);
            });
          });
        }

        private listOpacityController(id: number) {
          const above = this.listItems - id;
          const below = id;

          for (let i = 1; i <= above; i++) {
            gsap.to(this.getListItems()[id + i], {
              duration: 0.2,
              autoAlpha: 0.5 / i,
              x: 5 * i,
            });
          }

          for (let i = 0; i <= below; i++) {
            gsap.to(this.getListItems()[id - i], {
              duration: 0.2,
              autoAlpha: i === 0 ? 1 : 0.5 / i,
              x: 5 * i,
            });
          }
        }
      }

      new VerticalMouseDrivenCarousel();
      const handler = (e: Event) => setIsTimelineVisible((e as CustomEvent).detail.isVisible);
      document.addEventListener("timelineVisibility", handler);
      return () => document.removeEventListener("timelineVisibility", handler);
    }
  }, []);

  return (
    <div className="page-container">
      <div id="particles-js" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }} />

      <header className="header">
        <div className="contact">
          <img className="media" src="/img/linkedin.svg" alt="LinkedIn" onClick={() => window.open("https://www.linkedin.com/in/alexandre-manceau-068a98280/", "_blank")} />
          <img className="media" src="/img/github.svg" alt="GitHub" onClick={() => window.open("https://github.com/DevinciAlex", "_blank")} />
          <img className="media" src="/img/mail.png" alt="Mail" onClick={() => window.open("mailto:alexandre.manceau@edu.devinci.fr")} />
        </div>
      </header>

      <main className="c-header c-header--archive c-header--project-list">
        <div className="c-mouse-vertical-carousel js-carousel u-media-wrapper u-media-wrapper--16-9">
          <ul className="c-mouse-vertical-carousel__list js-carousel-list">
            {[
              { id: 0, title: "Qui suis-je ?", eyebrow: "Profil" },
              { id: 1, title: "Mon Parcours", eyebrow: "Profil" },
              { id: 2, title: "Morpion", eyebrow: "Python" },
              { id: 3, title: "Bourse au projet (2024)", eyebrow: "HTML CSS JS" },
              { id: 4, title: "L2M Assurance", eyebrow: "Next.js" },
            ].map(({ id, title, eyebrow }) => (
              <li key={id} className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id={id}>
                <a>
                  <p className="c-mouse-vertical-carousel__eyebrow u-b4">{eyebrow}</p>
                  <p className="c-mouse-vertical-carousel__title u-a5">{title}</p>
                </a>
              </li>
            ))}
          </ul>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Alexandre MANCEAU</h2>
            <div className="QUI-SUIS-JE">
              <img id="photo" src="/img/Alexandre.jpg" alt="photo Alexandre MANCEAU" />
              <p>
                Étudiant en 2ème année de Bachelor en Développement Web à l&apos;IMM,<br/>
                j&apos;apprends à concevoir des projets numériques à la fois créatifs et fonctionnels.<br/>
                Curieux, rigoureux et motivé, j’ai déjà eu l’occasion de collaborer sur différents types de projets, que ce soit pour une agence ou dans un cadre scolaire comme les Bourses aux Projets.
              </p>
            </div>
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Mon Parcours</h2>
            <Timeline isVisible={isTimelineVisible} />
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Morpion</h2>
            <p className="Description">Projet en Python réalisé en 2024</p>
            <video autoPlay loop playsInline muted src="/videos/Morpion.mp4" />
            <button onClick={() => window.open("https://github.com/DevinciAlex/Morpion", "_blank")}>Voir le code</button>
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Bourse au projet</h2>
            <p className="Description">Projet réalisé en 2024 dans un cadre scolaire. La mission consistait à digitaliser un support interactif basé sur l’atelier existant Handiscope, afin de sensibiliser les salariés d’entreprise aux différentes formes de handicap.</p>
            <video controls muted src="/videos/BAP2024.mp4" />
            <button>Code privé</button>
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>L2M Assurance</h2>
            <p className="DescriptionL2M">Projet web réalisé pour la gestion interne d’un cabinet d’assurance.</p>
            <p className="DescriptionL2M">Fonctionnalités :</p>
            <p className="DescriptionL2M2">
              - Création de comptes employés<br/>
              - Authentification avec rôles et redirection sécurisée<br/>
              - Agenda interactif (FullCalendar) pour visualiser les événements<br/>
              - Gestion des paramètres : mot de passe, utilisateurs, thème clair/sombre<br/>
            </p>
            <p className="DescriptionL2M">Techs : Next.js (App Router), React, FullCalendar, API REST, Context Auth</p>
            <video className="L2M" controls muted src="/videos/L2M.mp4" />
            <button>Code privé</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarouselPage;
