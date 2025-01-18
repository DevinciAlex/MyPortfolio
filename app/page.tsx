"use client";

import React, { useEffect, useRef } from "react";
import { gsap, Power3, Power4 } from "gsap";
import "@/public/css/global.css";
import Timeline from "./Timeline";

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

    carousel.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.isMouseOverImage) return;

      this.posY = event.pageY - carousel.getBoundingClientRect().top;
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
    this.getListItems().forEach((link) => {
      link.addEventListener("mouseenter", (ev) => {
        const target = ev.currentTarget as HTMLElement;
        const currentId = target.dataset.itemId;
        
        if (!currentId) return;

        this.listOpacityController(parseInt(currentId));

        gsap.to(target, {
          duration: 0.2,
          autoAlpha: 1
        });

        gsap.to(".is-visible", {
          duration: 0.2,
          autoAlpha: 0,
          scale: 1.05
        });

        const bgImg = this.getBgImgs()[parseInt(currentId)];
        if (!bgImg.classList.contains("is-visible")) {
          bgImg.classList.add("is-visible");
        }

        gsap.to(bgImg, {
          duration: 0.2,
          autoAlpha: 1,
          scale: 1
        });
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

const Carousel: React.FC<CarouselProps> = () => {
  useEffect(() => {
    new VerticalMouseDrivenCarousel();
  }, []);

  return (
    <div className="page-container">
    <header className="header">
      <h1 className="header-title">Alexandre MANCEAU</h1>
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
                <p className="c-mouse-vertical-carousel__eyebrow ">Profil</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Mon Parcours</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="1">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">Python</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Morpion  </p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="2">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">HTML CSS JS</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Bourse au projet (2024)</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="3">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">UX Design</p>
                <p className="c-mouse-vertical-carousel__title u-a5">MathQUIZ</p>
              </a>
            </li>
            <li className="c-mouse-vertical-carousel__list-item js-carousel-list-item" data-item-id="4">
              <a>
                <p className="c-mouse-vertical-carousel__eyebrow u-b4">UX Design</p>
                <p className="c-mouse-vertical-carousel__title u-a5">Showdown like</p>
              </a>
            </li>
          </ul>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Mon Parcours</h2>
            <Timeline/>
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Morpion</h2>
            <p className="Description">Projet en Python réalisé en 2024</p>
            <img src="/img/Morpion.png" alt="Morpion Project" />
            <button onClick={() => window.open("https://github.com/DevinciAlex/Morpion", "_blank")}>
              Voir le code
            </button>
          </div>

          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Bourse au projet</h2>
            <img src="/img/BAP.png" alt="Bourse au projet" />
          </div>
          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>MathQUIZ</h2>
            <img src="/img/MathQuiz.png" alt="MathQUIZ Project" />
          </div>
          <div className="c-mouse-vertical-carousel__bg-img js-carousel-bg-img">
            <h2>Showdown</h2>
            <img className="project" src="/img/showdown.png" alt="Showdown Project" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carousel;

