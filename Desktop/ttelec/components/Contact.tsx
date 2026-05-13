"use client";

import { useState } from "react";
import FadeUp from "./FadeUp";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <FadeUp>
          <div className="tag">Contact</div>
          <h2 className="section-title">
            PARLONS DE<br />
            <span>VOTRE PROJET</span>
          </h2>
        </FadeUp>

        <div className="contact-grid">
          <FadeUp className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <div className="contact-item-title">Téléphone / WhatsApp</div>
                <div className="contact-item-val">
                  <a href="tel:0465904372">0465 90 43 72</a>
                </div>
                <div className="contact-item-sub">Disponible 7j/7 · Urgences 24h</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-item-title">Zone d&apos;intervention</div>
                <div className="contact-item-val">Bruxelles & alentours</div>
                <div className="contact-item-sub">Région bruxelloise + communes limitrophes</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">⏱️</div>
              <div>
                <div className="contact-item-title">Délai de réponse</div>
                <div className="contact-item-val">Devis sous 24h</div>
                <div className="contact-item-sub">Urgences traitées immédiatement</div>
              </div>
            </div>

            <div>
              <div
                className="contact-item-title"
                style={{ marginBottom: "12px" }}
              >
                Suivez-nous
              </div>
              <div className="socials">
                <a
                  href="https://instagram.com/ttelec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  📸 Instagram
                </a>
                <a
                  href="https://tiktok.com/@ttelec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  🎵 TikTok
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom & Nom</label>
                    <input type="text" placeholder="Jean Dupont" required />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" placeholder="0400 00 00 00" required />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="vous@exemple.com" />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Type de travaux</label>
                    <select>
                      <option value="">— Sélectionner —</option>
                      <option>Installation électrique</option>
                      <option>Caméras de sécurité</option>
                      <option>Tableau électrique</option>
                      <option>Domotique / Smart Home</option>
                      <option>Dépannage urgence</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Description du projet</label>
                    <textarea placeholder="Décrivez votre projet, la superficie, le type de bien..." />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary form-submit"
                  style={{
                    background: submitted ? "#22c55e" : undefined,
                    color: submitted ? "white" : undefined,
                  }}
                >
                  {submitted ? "✓ Message envoyé !" : "Envoyer ma demande →"}
                </button>
              </form>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
