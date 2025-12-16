"use client";

import React, { useState, useEffect } from "react";
import "@/public/css/global.css";
import { styleText } from "util";
import { color } from "framer-motion";

const Test: React.FC = () => {
  const [open, setOpen] = useState(false);

  // close on ESC
  useEffect(() => {          
          const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="page-container" style={{ background: 'black' }}>
      <header className="header">    
        <button
          className="Menu_Responsive"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ color: 'white' }}
        >
          ☰
        </button>
      </header>

     {/* simple overlay */}
      <div className={`overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
          <button className="overlay-close" onClick={() => setOpen(false)}>
            Fermer
          </button>
          <div style={{ color: "white", marginTop: "1rem" }}>
            <p>Ceci est un overlay simple.</p>
            <p>Appuie sur ESC pour fermer ou clique en dehors.</p>
          </div>
        </div>
      </div>

      <main style={{ padding: "2rem", color: "white" }}>
        <h1>Page de test</h1>
        <p>Cliquer sur le bouton en haut à gauche ouvre l'overlay.</p>
      </main>
    </div>
  );
};  

export default Test;