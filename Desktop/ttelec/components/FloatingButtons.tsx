"use client";

export default function FloatingButtons() {
  return (
    <div className="float-group">
      <a
        href="https://wa.me/32465904372"
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn float-wa"
        title="WhatsApp"
      >
        💬
      </a>
      <button
        className="float-btn float-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Haut de page"
      >
        ↑
      </button>
    </div>
  );
}
