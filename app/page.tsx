"use client";

import React, { useEffect, useState } from "react";
import { gsap, Power3, Power4 } from "gsap";
import "@/public/css/global.css";
import Timeline from "./Timeline";
import "particles.js";

declare global {
  interface Window {
    particlesJS: any;
  }
}

interface CarouselState {
  posY: number;
  isMouseOverImage: boolean;
}

class VerticalMouseDrivenCarousel {
  private posY: number = 0;
  private isMouseOverImage: boolean = false;
  private listItems: number;
  private defaults: {
    carousel: string;
    bgImg: string;
    list: string;
    listItem: string;
  };

  constructor(options: Partial<typeof VerticalMouseDrivenCarousel.prototype.defaults> = {}) {
    const _defaults = {
      carousel: ".js-carousel",
      bgImg: ".js-carousel-bg-img",
      list: ".js-carousel-list",
      listItem: ".js-carousel-list-item"
    };

    this.defaults = { ..._defaults, ...options };
    this.listItems = 0;

    this.initCursor();
    this.init();
    this.bgImgController();
    this.preventScrollOnImages();
  }

  private getBgImgs(): NodeListOf<Element> {
    return document.querySelectorAll(this.defaults.bgImg);
  }

  private getListItems(): NodeListOf<Element> {
    return document.querySelectorAll(this.defaults.listItem);
  }

  private getList(): Element | null {
    return document.querySelector(this.defaults.list);
  }

  private getCarousel(): Element | null {
    return document.querySelector(this.defaults.carousel);
  }

  private init(): void {
    gsap.set(this.getBgImgs(), {
      autoAlpha: 0,
      scale: 1.05
    });

    gsap.set(this.getBgImgs()[0], {
      autoAlpha: 1,
      scale: 1
    });

    this.listItems = this.getListItems().length - 1;
    this.listOpacityController(0);
  }

  private initCursor(): void {
    const list = this.getList();
    const carousel = this.getCarousel();
    
    if (!list || !carousel) return;

    const listHeight = list.clientHeight;
    const carouselHeight = carousel.clientHeight;

    const topLimit = 0;
    const bottomLimit = carouselHeight * 0.75;

    carousel.addEventListener("mousemove", (event: Event) => {
      if (this.isMouseOverImage) return;

      const mouseEvent = event as MouseEvent;
      this.posY = mouseEvent.pageY - carousel.getBoundingClientRect().top;
      const normalizedPosY = Math.max(topLimit, Math.min(bottomLimit, this.posY));
      const offset = (-normalizedPosY / carouselHeight) * listHeight;

      gsap.to(list, {
        duration: 0.3,
        y: offset,
      });
    });
  }

  private preventScrollOnImages(): void {
    this.getBgImgs().forEach((img) => {
      img.addEventListener("mouseenter", () => {
        this.isMouseOverImage = true;
      });

      img.addEventListener("mouseleave", () => {
        this.isMouseOverImage = false;
      });
    });
  }

  private bgImgController(): void {
    let currentlyVisible = 0;
    
    this.getListItems().forEach((link) => {
      link.addEventListener("mouseenter", (ev) => {
        const target = ev.currentTarget as HTMLElement;
        const currentId = target.dataset.itemId;
        
        if (!currentId) return;
        
        const id = parseInt(currentId);
        currentlyVisible = id;

        this.listOpacityController(id);

        gsap.to(target, {
          duration: 0.2,
          autoAlpha: 1
        });

        gsap.to(".is-visible", {
          duration: 0.2,
          autoAlpha: 0,
          scale: 1.05
        });

        const bgImg = this.getBgImgs()[id];
        if (!bgImg.classList.contains("is-visible")) {
          bgImg.classList.add("is-visible");
        }

        gsap.to(bgImg, {
          duration: 0.2,
          autoAlpha: 1,
          scale: 1
        });

        // Déclencher un événement personnalisé pour la Timeline
        const timelineVisibilityEvent = new CustomEvent('timelineVisibility', {
          detail: { isVisible: id === 1 }
        });
        document.dispatchEvent(timelineVisibilityEvent);
      });
    });
  }

  private listOpacityController(id: number): void {
    const aboveCurrent = this.listItems - id;
    const belowCurrent = id;

    if (aboveCurrent > 0) {
      for (let i = 1; i <= aboveCurrent; i++) {
        const opacity = 0.5 / i;
        const offset = 5 * i;
        gsap.to(this.getListItems()[id + i], {
          duration: 0.2,
          autoAlpha: opacity,
          x: offset
        });
      }
    }

    if (belowCurrent > 0) {
      for (let i = 0; i <= belowCurrent; i++) {
        const opacity = 0.5 / i;
        const offset = 5 * i;
        gsap.to(this.getListItems()[id - i], {
          duration: 0.2,
          autoAlpha: opacity,
          x: offset,
        });
      }
    }
  }
}

const Carousel: React.FC = () => {

  useEffect(() => {
    // Initialiser Particles.js
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 75,
          density: { enable: true, value_area: 500 },
        },
        color: { value: "#ffffff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
        },
        opacity: {
          value: 0.5,
          random: false,
        },
        size: {
          value: 5,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 250,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
        },
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
  }, []);

  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  useEffect(() => {
    new VerticalMouseDrivenCarousel();

    const handleTimelineVisibility = (event: CustomEvent<{ isVisible: boolean }>) => {
      setIsTimelineVisible(event.detail.isVisible);
    };

    document.addEventListener('timelineVisibility', handleTimelineVisibility as EventListener);

    return () => {
      document.removeEventListener('timelineVisibility', handleTimelineVisibility as EventListener);
    };
  }, []);

  return (
    <div className="page-container">
      <div id="particles-js" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}></div>
      <header className="header">
        <div className="contact">
          <img
            className="media"
            src="https://devicon-website.vercel.app/api/linkedin/plain.svg?color=%23FFFFFF"
            alt="LinkedIn"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/alexandre-manceau-068a98280/",
                "_blank"
              )
            }
          />
          <img
            className="media"
            src="https://devicon-website.vercel.app/api/github/original-wordmark.svg?color=%23FFFFFF"
            alt="GitHub"
            onClick={() => window.open("https://github.com/DevinciAlex", "_blank")}
          />
          <img
            className="media"
            src="/img/mail.png"
            alt="Mail"
            onClick={() =>
              window.open(
                "https://mail.google.com/mail/#sent?compose=GTvVlcSGKZjmfhtKlTdhfwJxJzMNZqkNCHzDWzbclZrLBDQshGQncmplWSbpjxcjkBNJxbjjMBhhQ",
                "_blank"
              )
            }
          />
        </div>
      </header>
      <main className="c-header c-header--archive c-header--project-list">
        <div className="c-mouse-vertical-carousel js-carousel u-media-wrapper u-media-wrapper--16-9">
          <ul className="c-mouse-vertical-carousel__list js-carousel-list">
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="0">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow">Profil</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Qui suis-je ?</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="1">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow">Profil</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Mon Parcours</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="2">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">Python</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Morpion</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="3">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">HTML CSS JS</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Bourse au projet (2024)</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="4">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">Next.js</p>
                <p className="c-mouse-vertical-carousel__title u-a5">L2M Assurance</p>
              </a>
            </li>
          </ul>
          
          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Alexandre MANCEAU</h2>
            <div className="QUI-SUIS-JE">
              <img id="photo" src="/img/Alexandre.jpg" alt="photo Alexandre MANCEAU"/>
              <p> Étudiant en 2ème année de Bachelor en Développement Web à l'IMM,
              j'apprends à concevoir des projets numériques à la fois créatifs et fonctionnels.<br/>
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
            <button onClick={() => window.open("https://github.com/DevinciAlex/Morpion", "_blank")}>
              Voir le code
            </button>
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Bourse au projet</h2>
            <p className="Description">Projet réalisé en 2024 dont la mission était de digitaliser un support interactif basé sur un atelier existant Handiscope, afin de sensibiliser les salariés d’entreprise aux différentes formes de handicap. </p>
            <video controls muted src="/videos/BAP2024.mp4" />
            <button >
              Code privé
            </button>
          </div>
          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>L2M Assurance</h2>
            <p className="DescriptionL2M">Projet web réalisé pour la gestion interne d’un cabinet d’assurance.</p>

            <p className="DescriptionL2M">Fonctionnalités :</p>

            <p className="DescriptionL2M2">- Création de comptes employés<br/>

            - Authentification avec rôles et redirection sécurisée<br/>

            - Agenda interactif (FullCalendar) pour visualiser les événements<br/>

            - Gestion des paramètres : mot de passe, utilisateurs, thème clair/sombre<br/></p>

            <p className="DescriptionL2M">Techs : Next.js (App Router), React, FullCalendar, API REST, Context Auth </p>
            <video className="L2M" controls muted src="/videos/L2M.mp4" />
            <button >
              Code privé
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carousel;

