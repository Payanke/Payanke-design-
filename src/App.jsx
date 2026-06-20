import React, { useState, useRef, useEffect, useMemo } from "react";

import logo from "./assets/logo.png";
import tshirtAres from "./assets/tshirt-ares.jpg";
import portraitExemple from "./assets/portrait-exemple.jpg";
import tshirtDragon from "./assets/tshirt-dragon.jpg";
import tshirtLion from "./assets/tshirt-lion.jpg";
import tshirtTerra from "./assets/tshirt-terra.jpg";
import heroDrawing from "./assets/hero-drawing-scene.jpg";
import aboutMountains from "./assets/about-mountains.jpg";
import pailleEnQueue from "./assets/paille-en-queue.png";

const IMAGES = {
  logo,
  tshirtAres,
  portraitExemple,
  tshirtDragon,
  tshirtLion,
  tshirtTerra,
  heroDrawing,
  aboutMountains,
  pailleEnQueue,
};

/* ============================================================
   PAYANKÉ DESIGN — Site vitrine & boutique
   Palette : vert sauge + bleu lagon + blanc cassé — élégant & lumineux
   ============================================================ */

const COLORS = {
  // Couleurs de marque fournies
  sage: "#8bb87e",
  sageDeep: "#6a9a5d",
  lagoon: "#6abadc",
  lagoonDeep: "#4a96b8",
  cream: "#fffcf1",
  // Déclinaisons nécessaires à la mise en page (dérivées de la palette ci-dessus)
  creamSoft: "#FBF6E8",
  ink: "#2C3B30",       // texte principal, vert très sombre (lisible, doux)
  inkSoft: "#5A6B57",   // texte secondaire
  line: "rgba(44,59,48,0.12)",
  white: "#FFFFFF",

  // Alias pour compatibilité avec le reste du code (ancienne palette → nouvelle)
  night: "#fffcf1",
  nightDeep: "#FBF6E8",
  slate: "#FFFFFF",
  slateLight: "#F5F0DE",
  sand: "#F0EAD6",
  gold: "#6abadc",
  goldLight: "#8bb87e",
  rust: "#C97B5A",
};

/* ---------- Produits ---------- */

const TSHIRTS = [
  {
    id: "ares",
    name: "Arès",
    price: 27,
    tagline: "Le dieu de la guerre, monté sur sa garde",
    desc: "Illustration détaillée façon gravure ancienne : Arès en cavalier, lance levée, sur fond noir intense. Floquage premium qui dure dans le temps.",
    colors: ["black", "khaki", "white"],
    customizable: true,
    img: "tshirtAres",
  },
  {
    id: "dragon",
    name: "You Are A Dragon",
    price: 27,
    tagline: "Be a dragon.",
    desc: "Un dragon bleu nuit enroulé entre les nuages, encadré d'une typographie gothique. Pour ceux qui se souviennent de leur propre feu.",
    colors: ["black", "khaki", "white"],
    customizable: true,
    img: "tshirtDragon",
  },
  {
    id: "lion",
    name: "Pour Être Libre",
    price: 27,
    tagline: "Il faut être craint. Pour être craint, il faut être puissant.",
    desc: "Deux lions affrontés dans un style esquisse à l'encre, accompagnés d'une citation gravée au dos. Coupe unisexe, coton épais.",
    colors: ["black", "khaki", "white"],
    customizable: true,
    img: "tshirtLion",
  },
  {
    id: "terra",
    name: "Terra",
    price: 27,
    tagline: "1297 — 2025",
    desc: "Un chevalier et un soldat moderne, face à face, encadrés dans une composition graphique épurée. Floquage premium qui dure dans le temps.",
    colors: ["black", "khaki", "white"],
    customizable: true,
    img: "tshirtTerra",
  },
];

const PORTRAIT_FORMATS = [
  { id: "a4", label: "A4", price: 70, dims: "21 × 29,7 cm" },
  { id: "a3", label: "A3", price: 150, dims: "29,7 × 42 cm" },
];

const CUSTOM_TSHIRT_BASE_PRICE = 32;
const LOGO_CREATION_FEE = 50;
const NICKNAME_FEE = 5;
const RELAY_POINT_FEE = 3;
const SMALL_ORDER_FEE = 4;
const FREE_SHIPPING_THRESHOLD = 70;

const TSHIRT_COLORS = [
  { id: "black", label: "Noir", hex: "#1a1a1a" },
  { id: "white", label: "Blanc", hex: "#f5f5f5" },
  { id: "blue", label: "Bleu", hex: "#2563a8" },
  { id: "purple", label: "Violet", hex: "#6b3fa0" },
  { id: "pink", label: "Rose", hex: "#e8829c" },
  { id: "red", label: "Rouge", hex: "#c4302b" },
  { id: "orange", label: "Orange", hex: "#e07a2c" },
  { id: "yellow", label: "Jaune", hex: "#e8c547" },
  { id: "green", label: "Vert", hex: "#3f8a4c" },
  { id: "khaki", label: "Kaki", hex: "#7a7a52" },
  { id: "beige", label: "Beige", hex: "#d8c9a8" },
];

/* ---------- Icônes SVG inline (légères, pas de dépendance) ---------- */

const Icon = {
  Cart: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||24} height={p.size||24} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18"/>
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||24} height={p.size||24} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  ChevronRight: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  ChevronLeft: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  Upload: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Truck: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Package: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  Minus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/></svg>
  ),
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Tiktok: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="currentColor">
      <path d="M16.6 5.82c-1.02-.88-1.6-2.15-1.6-3.6h-3.13v13.4a2.77 2.77 0 1 1-2.77-2.77c.3 0 .59.05.86.13V9.8a5.92 5.92 0 0 0-.86-.06A5.93 5.93 0 1 0 15 15.66V9.27a7.05 7.05 0 0 0 4.13 1.33V7.47a3.6 3.6 0 0 1-2.53-1.65z"/>
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>
    </svg>
  ),
  Pencil: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
};

function formatPrice(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

/* ============================================================
   PAGE CHECKOUT
   ============================================================ */

function CheckoutPage({ ctx }) {
  const [delivery, setDelivery] = useState("home"); // home | relay
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", address: "", zip: "", city: "", relayPoint: "" });

  const shippingCost = useMemo(() => {
    if (ctx.subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    if (delivery === "relay") return RELAY_POINT_FEE;
    return SMALL_ORDER_FEE;
  }, [ctx.subtotal, delivery]);

  const total = ctx.subtotal + shippingCost;

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const orderNumber = "PYK-" + Math.floor(100000 + Math.random() * 900000);
    ctx.setLastOrder({
      number: orderNumber,
      items: ctx.cart,
      subtotal: ctx.subtotal,
      shipping: shippingCost,
      total,
      delivery,
      customer: form,
    });
    ctx.go("thanks");
  }

  if (ctx.cart.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
        <Icon.Cart size={40} />
        <h2 className="font-display" style={{ fontSize: 24, margin: "18px 0 10px", color: COLORS.ink }}>Ton panier est vide</h2>
        <p style={{ color: "rgba(44,59,48,0.6)", marginBottom: 24 }}>Ajoute une création avant de passer commande.</p>
        <OriginButton onClick={() => ctx.go("tshirts")}>Découvrir les t-shirts</OriginButton>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 100px" }}>
      <Breadcrumb items={[{ label: "Commande" }]} ctx={ctx} />
      <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: "14px 0 36px", color: COLORS.ink }}>Finaliser la commande</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 50 }} className="product-grid">
        <div>
          <h3 className="font-display" style={{ fontSize: 17, color: COLORS.gold, marginBottom: 16 }}>Coordonnées</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Prénom" value={form.firstName} onChange={handleChange("firstName")} required />
            <Field label="Nom" value={form.lastName} onChange={handleChange("lastName")} required />
          </div>
          <Field label="Email" type="email" value={form.email} onChange={handleChange("email")} required />

          <h3 className="font-display" style={{ fontSize: 17, color: COLORS.gold, margin: "30px 0 16px" }}>Mode de livraison</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DeliveryOption
              active={delivery === "home"}
              onClick={() => setDelivery("home")}
              icon={<Icon.Home size={20} />}
              title="Livraison à domicile"
              sub={ctx.subtotal >= FREE_SHIPPING_THRESHOLD ? "Offerte" : formatPrice(SMALL_ORDER_FEE)}
            />
            <DeliveryOption
              active={delivery === "relay"}
              onClick={() => setDelivery("relay")}
              icon={<Icon.Package size={20} />}
              title="Point relais"
              sub={ctx.subtotal >= FREE_SHIPPING_THRESHOLD ? "Offerte" : formatPrice(RELAY_POINT_FEE)}
            />
          </div>

          {delivery === "home" ? (
            <div style={{ marginTop: 18 }}>
              <Field label="Adresse" value={form.address} onChange={handleChange("address")} required />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
                <Field label="Code postal" value={form.zip} onChange={handleChange("zip")} required />
                <Field label="Ville" value={form.city} onChange={handleChange("city")} required />
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 18 }}>
              <Field label="Point relais choisi (nom / adresse)" value={form.relayPoint} onChange={handleChange("relayPoint")} required />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
                <Field label="Code postal" value={form.zip} onChange={handleChange("zip")} required />
                <Field label="Ville" value={form.city} onChange={handleChange("city")} required />
              </div>
            </div>
          )}

          <OriginButton type="submit" style={{ width: "100%", marginTop: 28 }}>
            Valider et payer · {formatPrice(total)}
          </OriginButton>
        </div>

        <div>
          <div style={{ background: COLORS.slate, borderRadius: 14, padding: "22px 22px 8px" }}>
            <h3 className="font-display" style={{ fontSize: 16, color: COLORS.ink, marginTop: 0, marginBottom: 16 }}>Récapitulatif</h3>
            {ctx.cart.map((item) => (
              <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,59,48,0.8)", marginBottom: 14, gap: 8 }}>
                <span>{item.title} <span style={{ color: "rgba(44,59,48,0.45)" }}>× {item.qty}</span></span>
                <span style={{ whiteSpace: "nowrap" }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(44,59,48,0.12)", paddingTop: 14, marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "rgba(44,59,48,0.7)", marginBottom: 8 }}>
                <span>Sous-total</span><span>{formatPrice(ctx.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "rgba(44,59,48,0.7)", marginBottom: 8 }}>
                <span>Livraison</span><span>{shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: COLORS.gold, marginTop: 10, paddingTop: 12, borderTop: "1px solid rgba(44,59,48,0.12)", marginBottom: 18 }}>
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function DeliveryOption({ active, onClick, icon, title, sub }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 12, cursor: "pointer",
      border: `1.5px solid ${active ? COLORS.gold : "rgba(44,59,48,0.2)"}`,
      background: active ? "rgba(106,186,220,0.1)" : COLORS.slate, textAlign: "left",
    }}>
      <span style={{ color: active ? COLORS.gold : COLORS.ink }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>{title}</div>
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gold }}>{sub}</span>
    </button>
  );
}

function Field({ label, type = "text", value, onChange, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="field-label">{label}</label>
      <input
        type={type} value={value} onChange={onChange} required={required}
        style={{
          width: "100%", marginTop: 6, padding: "11px 14px", borderRadius: 10,
          background: COLORS.slate, border: "1px solid rgba(44,59,48,0.18)",
          color: COLORS.ink, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ============================================================
   PAGE DE REMERCIEMENT
   ============================================================ */

function ThanksPage({ ctx }) {
  const order = ctx.lastOrder;
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "100px 24px 120px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(106,186,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: COLORS.gold }}>
        <Icon.Check size={32} />
      </div>
      <span className="font-script" style={{ color: COLORS.gold, fontSize: 19 }}>Misi bonpé !</span>
      <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: "6px 0 16px", color: COLORS.ink }}>Merci pour ta commande</h1>
      <p style={{ color: "rgba(44,59,48,0.75)", lineHeight: 1.7, marginBottom: 8 }}>
        Ta création est entre de bonnes mains. Tu recevras un email de confirmation, et je te tiendrai informé(e) à chaque étape.
      </p>
      {order && (
        <div style={{ background: COLORS.slate, borderRadius: 14, padding: "22px 26px", margin: "30px 0", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 10 }}>
            <span style={{ color: "rgba(44,59,48,0.6)" }}>Numéro de commande</span>
            <span style={{ color: COLORS.gold, fontWeight: 700 }}>{order.number}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
            <span style={{ color: "rgba(44,59,48,0.6)" }}>Total réglé</span>
            <span style={{ color: COLORS.ink, fontWeight: 700 }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <OriginButton onClick={() => ctx.go("tracking")}>Suivre ma commande</OriginButton>
        <OriginButton onClick={() => ctx.go("home")} variant="outline">Retour à l'accueil</OriginButton>
      </div>
    </div>
  );
}

function CartDrawer({ ctx }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - ctx.subtotal);
  const progress = Math.min(100, (ctx.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div onClick={() => ctx.setCartOpen(false)} style={{
        position: "fixed", inset: 0, background: "rgba(7,19,38,0.6)", zIndex: 300,
        opacity: ctx.cartOpen ? 1 : 0, pointerEvents: ctx.cartOpen ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 100vw)", zIndex: 301,
        background: COLORS.nightDeep, transform: ctx.cartOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column",
        borderLeft: `1px solid rgba(106,186,220,0.2)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid rgba(44,59,48,0.1)" }}>
          <h3 className="font-display" style={{ fontSize: 19, margin: 0, color: COLORS.ink }}>Ton panier</h3>
          <button onClick={() => ctx.setCartOpen(false)} style={{ background: "none", border: "none", color: COLORS.ink, cursor: "pointer" }}>
            <Icon.Close size={22} />
          </button>
        </div>

        {ctx.cart.length > 0 && (
          <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(44,59,48,0.08)" }}>
            <div style={{ fontSize: 12, color: "rgba(44,59,48,0.7)", marginBottom: 6 }}>
              {remaining > 0 ? <>Plus que <strong style={{ color: COLORS.lagoonDeep }}>{formatPrice(remaining)}</strong> pour la livraison gratuite</> : <span style={{ color: COLORS.sageDeep }}>✓ Livraison gratuite débloquée</span>}
            </div>
            <div style={{ height: 5, background: "rgba(44,59,48,0.12)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: progress >= 100 ? COLORS.sage : COLORS.lagoon, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "10px 22px" }}>
          {ctx.cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(44,59,48,0.5)" }}>
              <Icon.Cart size={36} />
              <p style={{ marginTop: 14, fontSize: 14 }}>Ton panier est vide</p>
            </div>
          ) : (
            ctx.cart.map((item) => (
              <CartLine key={item.cartId} item={item} ctx={ctx} />
            ))
          )}
        </div>

        {ctx.cart.length > 0 && (
          <div style={{ padding: "20px 22px", borderTop: "1px solid rgba(44,59,48,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>
              <span>Sous-total</span><span>{formatPrice(ctx.subtotal)}</span>
            </div>
            <OriginButton onClick={() => { ctx.setCartOpen(false); ctx.go("checkout"); }} style={{ width: "100%" }}>
              Passer commande
            </OriginButton>
          </div>
        )}
      </div>
    </>
  );
}

function CartLine({ item, ctx }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(44,59,48,0.08)" }}>
      <div style={{ width: 60, height: 60, borderRadius: 8, background: COLORS.slate, flexShrink: 0, overflow: "hidden" }}>
        {item.img ? <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon.Pencil size={20} />
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.ink }}>{item.title}</span>
          <span style={{ fontSize: 13, color: COLORS.gold, fontWeight: 600, whiteSpace: "nowrap" }}>{formatPrice(item.price * item.qty)}</span>
        </div>
        {item.meta && (
          <div style={{ fontSize: 11, color: "rgba(44,59,48,0.5)", marginTop: 3, lineHeight: 1.5 }}>
            {Object.entries(item.meta).map(([k, v]) => `${k} : ${v}`).join(" · ")}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <button onClick={() => ctx.updateQty(item.cartId, item.qty - 1)} style={{ background: "rgba(44,59,48,0.1)", border: "none", borderRadius: 6, width: 22, height: 22, color: COLORS.ink, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Minus size={12} /></button>
          <span style={{ fontSize: 12.5, color: COLORS.ink, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
          <button onClick={() => ctx.updateQty(item.cartId, item.qty + 1)} style={{ background: "rgba(44,59,48,0.1)", border: "none", borderRadius: 6, width: 22, height: 22, color: COLORS.ink, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Plus size={12} /></button>
          <button onClick={() => ctx.removeFromCart(item.cartId)} style={{ background: "none", border: "none", color: "rgba(44,59,48,0.4)", cursor: "pointer", marginLeft: "auto", display: "flex" }}><Icon.Trash size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ ctx }) {
  return (
    <div>
      <section style={{
        position: "relative", minHeight: "62vh", display: "flex", alignItems: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${IMAGES.aboutMountains}')`,
          backgroundSize: "cover", backgroundPosition: "center 65%",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(44,59,48,0.18) 0%, rgba(35,46,38,0.55) 75%, rgba(35,46,38,0.78) 100%)" }} />

        <FlyingPaille />

        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "100px 24px 60px", width: "100%" }}>
          <div style={{ maxWidth: 640 }}>
            <span className="font-script" style={{ color: COLORS.cream, fontSize: 20, display: "block", marginBottom: 10, opacity: 0.95 }}>
              Originaire de l'île de la Réunion
            </span>
            <h1 className="font-display" style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)", lineHeight: 1.1, margin: 0,
              color: COLORS.white, textShadow: "0 2px 24px rgba(20,30,20,0.5)",
            }}>
              Qui suis-je
            </h1>
          </div>
        </div>

        <WaveDivider />
      </section>

      <section style={{ maxWidth: 880, margin: "0 auto", padding: "60px 24px 100px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, fontSize: 16, lineHeight: 1.85, color: "rgba(44,59,48,0.85)" }}>
          <p>
            Je m'appelle Alexia, originaire de l'île de La Réunion, un véritable joyau de nature et d'inspiration.
          </p>
          <p>
            Artiste dans l'âme, je dessine depuis mon plus jeune âge, guidée par une passion profonde pour le réalisme. Mon exploration artistique m'a d'abord conduite à perfectionner mes techniques dans des univers variés, entre l'art traditionnel, l'esthétique japonaise et l'univers du manga.
          </p>
          <p>
            Aujourd'hui, je m'épanouis dans une créativité plurielle : je peux redessiner votre portrait avec précision, peindre des paysages vibrants sur toile, créer une identité visuelle unique en digital, ou encore embellir vos espaces avec des fresques décoratives. Un véritable couteau suisse « made in Réunion », porté par le désir d'ajouter une touche d'art partout où il passe&nbsp;!
          </p>

          <h2 className="font-display" style={{ fontSize: 22, color: COLORS.lagoonDeep, margin: "10px 0 -6px" }}>
            Mon parcours
          </h2>

          <p>
            L'aventure a toujours fait partie de mon ADN. En 2020, je me suis engagée comme réserviste dans l'armée de terre, avant de devenir engagée volontaire en 2022. Ces années m'ont forgée, m'apprenant la rigueur, la persévérance, et une capacité d'adaptation inestimable.
          </p>
          <p>
            Cependant, l'appel de la création a toujours résonné en moi. En 2023, j'ai pris une décision audacieuse : quitter l'armée pour me consacrer pleinement à mon projet artistique et reprendre mes études. J'ai intégré une licence en Langues Étrangères Appliquées, une opportunité pour élargir mes horizons et explorer des collaborations internationales.
          </p>
          <p>
            Aujourd'hui, je continue d'accompagner mes clients avec des prestations sur-mesure et une qualité irréprochable, tout en restant fidèle à ma mission&nbsp;: insuffler l'art dans chaque espace et chaque projet.
          </p>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
          <OriginButton onClick={() => ctx.go("portrait")}>Commander un portrait</OriginButton>
          <OriginButton onClick={() => ctx.go("tshirts")} variant="outline">Voir les t-shirts</OriginButton>
        </div>
      </section>
    </div>
  );
}

function FlyingPaille() {
  return (
    <img
      src={IMAGES.pailleEnQueue}
      alt="Paille-en-queue, oiseau emblématique de l'île de la Réunion"
      className="flying-bird"
      style={{
        position: "absolute", top: "12%", left: "8%", width: 240, height: "auto",
        filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
      }}
    />
  );
}

function PortraitPage({ ctx }) {
  const [format, setFormat] = useState("a4");
  const [photo, setPhoto] = useState(null);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  const fmt = PORTRAIT_FORMATS.find((f) => f.id === format);

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    ctx.addToCart({
      id: "portrait-" + Date.now(),
      title: `Portrait personnalisé — ${fmt.label}`,
      price: fmt.price,
      qty: 1,
      isCustom: true,
      meta: {
        Format: `${fmt.label} (${fmt.dims})`,
        Photo: photo ? "Oui (fichier joint)" : "À envoyer par email",
        ...(notes ? { Notes: notes } : {}),
      },
    }, btnRef.current.getBoundingClientRect());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px 100px" }}>
      <Breadcrumb items={[{ label: "Portrait personnalisé" }]} ctx={ctx} />

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <span className="font-script" style={{ color: COLORS.gold, fontSize: 18 }}>Aux crayons de couleur</span>
        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: "4px 0", color: COLORS.ink }}>Portrait personnalisé</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, marginTop: 30 }} className="product-grid">
        <div>
          <div style={{ borderRadius: 18, overflow: "hidden", background: COLORS.nightDeep, aspectRatio: "3/4" }}>
            <img src={IMAGES.portraitExemple} alt="Exemple de portrait personnalisé" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ marginTop: 24, padding: "20px 22px", background: COLORS.slate, borderRadius: 14 }}>
            <h3 className="font-display" style={{ fontSize: 16, color: COLORS.gold, margin: "0 0 10px" }}>Comment je travaille</h3>
            <p style={{ fontSize: 13.5, color: "rgba(44,59,48,0.75)", lineHeight: 1.7, margin: 0 }}>
              Chaque portrait est réalisé entièrement à la main, aux crayons de couleur, à partir de la photo que tu m'envoies. 
              Je travaille les détails un à un — lumières, textures, expressions — pour un rendu fidèle et habité. 
              Compte en moyenne <strong style={{ color: COLORS.ink }}>1 à 2 semaines</strong> de réalisation. 
              Ton portrait est livré <strong style={{ color: COLORS.ink }}>encadré</strong>, prêt à accrocher.
            </p>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 26 }}>
            <label className="field-label">1. Choisis ton format</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
              {PORTRAIT_FORMATS.map((f) => (
                <button key={f.id} onClick={() => setFormat(f.id)} style={{
                  textAlign: "left", padding: "16px 18px", borderRadius: 12, cursor: "pointer",
                  border: `1.5px solid ${format === f.id ? COLORS.gold : "rgba(44,59,48,0.2)"}`,
                  background: format === f.id ? "rgba(106,186,220,0.1)" : COLORS.slate,
                }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: format === f.id ? COLORS.gold : COLORS.ink }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(44,59,48,0.55)", marginTop: 2 }}>{f.dims}</div>
                  <div style={{ fontSize: 15, color: COLORS.gold, fontWeight: 600, marginTop: 8 }}>{formatPrice(f.price)}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label className="field-label">2. Ta photo</label>
            <p style={{ fontSize: 12.5, color: "rgba(44,59,48,0.55)", margin: "4px 0 10px" }}>
              Choisis une photo nette et bien éclairée pour un résultat optimal.
            </p>
            <UploadBox image={photo} onUpload={handleUpload} onClear={() => setPhoto(null)} label="Importer une photo" />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="field-label">3. Indications particulières (facultatif)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Un détail à mettre en avant, un cadrage souhaité, une dédicace…"
              rows={3}
              style={{
                width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 10,
                background: COLORS.slate, border: "1px solid rgba(44,59,48,0.18)",
                color: COLORS.ink, fontSize: 13.5, fontFamily: "inherit", resize: "vertical",
              }}
            />
          </div>

          <div style={{ background: COLORS.slate, borderRadius: 12, padding: "16px 18px", marginBottom: 22, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: COLORS.gold }}>
            <span>Total</span><span>{formatPrice(fmt.price)}</span>
          </div>

          <OriginButton ref={btnRef} onClick={handleAdd} style={{ width: "100%" }}>
            {added ? <><Icon.Check size={16} /> Ajouté au panier</> : "Ajouter au panier"}
          </OriginButton>
          <ShippingNote />
        </div>
      </div>
    </div>
  );
}

function CustomTshirtPage({ ctx }) {
  const [color, setColor] = useState("black");
  const [fabric, setFabric] = useState("cotton");
  const [size, setSize] = useState("M");
  const [backImg, setBackImg] = useState(null);
  const [frontLogo, setFrontLogo] = useState(null);
  const [wantsNewLogo, setWantsNewLogo] = useState(false);
  const [notes, setNotes] = useState("");
  const [view, setView] = useState("back"); // back | front
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorObj = TSHIRT_COLORS.find((c) => c.id === color);

  function handleUpload(setter) {
    return (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setter(reader.result);
      reader.readAsDataURL(file);
    };
  }

  const total = CUSTOM_TSHIRT_BASE_PRICE + (wantsNewLogo ? LOGO_CREATION_FEE : 0);

  function handleAdd() {
    ctx.addToCart({
      id: "custom-tshirt-" + Date.now(),
      title: "T-shirt personnalisé",
      price: total,
      qty: 1,
      isCustom: true,
      meta: {
        Couleur: colorObj.label,
        Tissu: fabric === "cotton" ? "Coton" : "Polyester",
        Taille: size,
        "Image dos": backImg ? "Oui (fichier joint)" : "Aucune",
        "Logo devant": frontLogo ? "Oui (fichier joint)" : (wantsNewLogo ? "À créer par Payanké" : "Aucun"),
        ...(notes ? { Notes: notes } : {}),
      },
      _flags: { logoFeeCounted: wantsNewLogo },
    }, btnRef.current.getBoundingClientRect());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div style={{ maxWidth: 1220, margin: "0 auto", padding: "50px 24px 100px" }}>
      <Breadcrumb items={[{ label: "T-shirts", page: "tshirts" }, { label: "Personnalisé" }]} ctx={ctx} />

      <div style={{ marginTop: 10, marginBottom: 30 }}>
        <span className="font-script" style={{ color: COLORS.gold, fontSize: 18 }}>Crée le tien</span>
        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: "4px 0", color: COLORS.ink }}>T-shirt personnalisé</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50 }} className="product-grid">
        {/* Maquette interactive */}
        <div>
          <div style={{ position: "sticky", top: 100 }}>
            <TshirtMockup colorHex={colorObj.hex} colorId={color} view={view} backImg={backImg} frontLogo={frontLogo} />
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
              <button onClick={() => setView("front")} style={{
                padding: "8px 18px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${view === "front" ? COLORS.gold : "rgba(44,59,48,0.25)"}`,
                background: view === "front" ? "rgba(106,186,220,0.12)" : "transparent",
                color: view === "front" ? COLORS.gold : COLORS.ink,
              }}>Devant</button>
              <button onClick={() => setView("back")} style={{
                padding: "8px 18px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${view === "back" ? COLORS.gold : "rgba(44,59,48,0.25)"}`,
                background: view === "back" ? "rgba(106,186,220,0.12)" : "transparent",
                color: view === "back" ? COLORS.gold : COLORS.ink,
              }}>Dos</button>
            </div>
            <p style={{ textAlign: "center", fontSize: 11.5, color: "rgba(44,59,48,0.45)", marginTop: 12 }}>
              Aperçu indicatif — le rendu final peut varier légèrement.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <div style={{ marginBottom: 26 }}>
            <label className="field-label">1. Couleur du t-shirt</label>
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              {TSHIRT_COLORS.map((c) => (
                <button key={c.id} onClick={() => setColor(c.id)} title={c.label} style={{
                  width: 36, height: 36, borderRadius: "50%", cursor: "pointer", background: c.hex,
                  border: color === c.id ? `2.5px solid ${COLORS.gold}` : "2px solid rgba(44,59,48,0.25)",
                }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label className="field-label">2. Tissu</label>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {[{ id: "cotton", label: "Coton" }, { id: "polyester", label: "Polyester" }].map((f) => (
                <button key={f.id} onClick={() => setFabric(f.id)} style={{
                  padding: "9px 18px", borderRadius: 30, cursor: "pointer",
                  border: `1.5px solid ${fabric === f.id ? COLORS.gold : "rgba(44,59,48,0.25)"}`,
                  background: fabric === f.id ? "rgba(106,186,220,0.12)" : "transparent",
                  color: fabric === f.id ? COLORS.gold : COLORS.ink, fontSize: 13.5, fontWeight: 600,
                }}>{f.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label className="field-label">3. Taille</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  width: 44, height: 40, borderRadius: 8, cursor: "pointer",
                  border: `1.5px solid ${size === s ? COLORS.gold : "rgba(44,59,48,0.25)"}`,
                  background: size === s ? "rgba(106,186,220,0.12)" : "transparent",
                  color: size === s ? COLORS.gold : COLORS.ink, fontSize: 13.5, fontWeight: 600,
                }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label className="field-label">4. Image au dos</label>
            <p style={{ fontSize: 12.5, color: "rgba(44,59,48,0.55)", margin: "4px 0 10px" }}>Ajoute la photo ou l'illustration que tu veux porter dans le dos.</p>
            <UploadBox image={backImg} onUpload={handleUpload(setBackImg)} onClear={() => setBackImg(null)} label="Importer une image" />
          </div>

          <div style={{ marginBottom: 26 }}>
            <label className="field-label">5. Logo sur le devant</label>
            <p style={{ fontSize: 12.5, color: "rgba(44,59,48,0.55)", margin: "4px 0 10px" }}>
              Tu as déjà un logo ? Importe-le. Sinon, je peux t'en créer un sur-mesure.
            </p>
            <UploadBox image={frontLogo} onUpload={handleUpload(setFrontLogo)} onClear={() => setFrontLogo(null)} label="Importer un logo" small />

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={wantsNewLogo} onChange={(e) => setWantsNewLogo(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: COLORS.gold }} />
              <span style={{ fontSize: 13.5, color: "rgba(44,59,48,0.85)" }}>
                Je veux que Payanké crée un nouveau logo pour moi <strong style={{ color: COLORS.gold }}>(+{formatPrice(LOGO_CREATION_FEE)})</strong>
              </span>
            </label>
            <p style={{ fontSize: 11.5, color: "rgba(44,59,48,0.45)", marginTop: 6, marginLeft: 28 }}>
              Ce forfait de création n'est compté qu'une seule fois, même si tu commandes plusieurs t-shirts.
            </p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="field-label">6. Petites précisions (facultatif)</label>
            <p style={{ fontSize: 12.5, color: "rgba(44,59,48,0.55)", margin: "4px 0 10px" }}>
              Tu peux notamment préciser ici l'emplacement souhaité pour ton logo sur le devant — au milieu, à droite ou à gauche.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex. : logo à gauche de la poitrine, un surnom, une couleur précise…"
              rows={3}
              style={{
                width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 10,
                background: COLORS.slate, border: "1px solid rgba(44,59,48,0.18)",
                color: COLORS.ink, fontSize: 13.5, fontFamily: "inherit", resize: "vertical",
              }}
            />
          </div>

          <div style={{ background: COLORS.slate, borderRadius: 12, padding: "16px 18px", marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "rgba(44,59,48,0.75)", marginBottom: 6 }}>
              <span>T-shirt personnalisé</span><span>{formatPrice(CUSTOM_TSHIRT_BASE_PRICE)}</span>
            </div>
            {wantsNewLogo && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "rgba(44,59,48,0.75)", marginBottom: 6 }}>
                <span>Création de logo</span><span>{formatPrice(LOGO_CREATION_FEE)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: COLORS.gold, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(44,59,48,0.12)" }}>
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          <OriginButton ref={btnRef} onClick={handleAdd} style={{ width: "100%" }}>
            {added ? <><Icon.Check size={16} /> Ajouté au panier</> : "Ajouter au panier"}
          </OriginButton>
          <ShippingNote />
        </div>
      </div>
    </div>
  );
}

function UploadBox({ image, onUpload, onClear, label, small }) {
  const inputRef = useRef(null);
  return (
    <div>
      {image ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={image} alt="aperçu" style={{ width: small ? 90 : 140, height: small ? 90 : 140, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(106,186,220,0.3)" }} />
          <button onClick={onClear} style={{
            position: "absolute", top: -8, right: -8, background: COLORS.rust, border: "none", borderRadius: "50%",
            width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff",
          }}><Icon.Close size={14} /></button>
        </div>
      ) : (
        <button onClick={() => inputRef.current.click()} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 10,
          border: "1.5px dashed rgba(106,186,220,0.4)", background: "rgba(106,186,220,0.06)",
          color: COLORS.gold, fontSize: 13, cursor: "pointer", fontWeight: 600,
        }}>
          <Icon.Upload size={16} /> {label}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
    </div>
  );
}

/* ---------- Maquette T-shirt "3D" (CSS, vue devant/dos avec relief léger) ---------- */
function TshirtMockup({ colorHex, colorId, view, backImg, frontLogo }) {
  const isLight = ["white", "beige", "yellow"].includes(colorId);
  const strokeColor = isLight ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)";
  const shadeColor = isLight ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.28)";

  return (
    <div style={{
      background: `radial-gradient(circle at 50% 20%, ${COLORS.slateLight}, ${COLORS.nightDeep} 75%)`,
      borderRadius: 20, padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: 480, border: "1px solid rgba(106,186,220,0.15)",
    }}>
      <div style={{ position: "relative", width: 280, transition: "transform 0.4s ease", transform: view === "back" ? "rotateY(0deg)" : "rotateY(0deg)" }}>
        <svg viewBox="0 0 280 320" width="280" height="320">
          <defs>
            <clipPath id="tshirtClip">
              <path d="M70 30 L100 10 L140 22 L180 10 L210 30 L260 70 L230 110 L210 95 L210 300 L70 300 L70 95 L50 110 L20 70 Z" />
            </clipPath>
            <linearGradient id="shade3d" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={shadeColor} />
              <stop offset="15%" stopColor="transparent" />
              <stop offset="85%" stopColor="transparent" />
              <stop offset="100%" stopColor={shadeColor} />
            </linearGradient>
          </defs>
          {/* corps du t-shirt */}
          <path d="M70 30 L100 10 L140 22 L180 10 L210 30 L260 70 L230 110 L210 95 L210 300 L70 300 L70 95 L50 110 L20 70 Z"
            fill={colorHex} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          {/* ombrage 3D */}
          <path d="M70 30 L100 10 L140 22 L180 10 L210 30 L260 70 L230 110 L210 95 L210 300 L70 300 L70 95 L50 110 L20 70 Z"
            fill="url(#shade3d)" />
          {/* col */}
          {view === "front" && (
            <path d="M115 18 Q140 38 165 18" fill="none" stroke={strokeColor} strokeWidth="2" />
          )}
          {view === "back" && (
            <path d="M118 16 Q140 28 162 16" fill="none" stroke={strokeColor} strokeWidth="1.6" />
          )}

          {/* zone d'impression devant : logo */}
          {view === "front" && (
            <g clipPath="url(#tshirtClip)">
              {frontLogo ? (
                <image href={frontLogo} x="115" y="55" width="50" height="50" preserveAspectRatio="xMidYMid slice" opacity="0.96" />
              ) : (
                <g opacity="0.3">
                  <rect x="118" y="58" width="44" height="44" rx="6" fill="none" stroke={COLORS.gold} strokeDasharray="4 3" strokeWidth="1.6" />
                  <text x="140" y="84" textAnchor="middle" fontSize="8" fill={COLORS.gold} fontFamily="sans-serif">LOGO</text>
                </g>
              )}
            </g>
          )}

          {/* zone d'impression dos : grande image */}
          {view === "back" && (
            <g clipPath="url(#tshirtClip)">
              {backImg ? (
                <image href={backImg} x="95" y="60" width="90" height="110" preserveAspectRatio="xMidYMid slice" opacity="0.97" />
              ) : (
                <g opacity="0.3">
                  <rect x="95" y="60" width="90" height="110" rx="8" fill="none" stroke={COLORS.gold} strokeDasharray="5 4" strokeWidth="1.6" />
                  <text x="140" y="118" textAnchor="middle" fontSize="9" fill={COLORS.gold} fontFamily="sans-serif">TON IMAGE</text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function TshirtsListPage({ ctx }) {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 100px" }}>
      <SectionHeading eyebrow="Collection" title="Tous les t-shirts" />
      <p style={{ color: "rgba(44,59,48,0.7)", maxWidth: 560, marginTop: 14, lineHeight: 1.6 }}>
        Des pièces de ma collection, prêtes à porter, ou un t-shirt entièrement personnalisé avec ton image et ton logo.
      </p>

      <div style={{ marginTop: 36 }}>
        <div style={{
          width: "100%", textAlign: "left", background: `linear-gradient(120deg, ${COLORS.slate}, ${COLORS.slateLight})`,
          border: `1px solid rgba(106,186,220,0.3)`, borderRadius: 16, padding: "28px 30px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
        }}>
          <div>
            <span className="font-script" style={{ color: COLORS.gold, fontSize: 17 }}>Sur-mesure</span>
            <h3 className="font-display" style={{ fontSize: 24, margin: "4px 0 6px", color: COLORS.ink }}>T-shirt personnalisé</h3>
            <p style={{ fontSize: 13.5, color: "rgba(44,59,48,0.7)", margin: 0 }}>Ton image au dos, ton logo devant — à partir de 32 €</p>
          </div>
          <OriginButton onClick={() => ctx.go("product-custom")}>Personnaliser <Icon.ChevronRight size={16} /></OriginButton>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 22, marginTop: 30 }}>
        {TSHIRTS.map((t) => (
          <button key={t.id} onClick={() => ctx.go("product-tshirt", t.id)} style={{
            textAlign: "left", background: COLORS.slate, border: "1px solid rgba(106,186,220,0.15)",
            borderRadius: 14, overflow: "hidden", cursor: "pointer", padding: 0,
          }} className="favorite-card">
            <div style={{ aspectRatio: "4/5", overflow: "hidden", background: COLORS.nightDeep, position: "relative" }}>
              {t.img ? (
                <img src={IMAGES[t.img]} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : <CustomTshirtIllustration />}
              {t.customizable && (
                <span style={{
                  position: "absolute", top: 12, left: 12, background: "rgba(106,186,220,0.92)", color: COLORS.white,
                  fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.03em",
                }}>Disponible à la personnalisation</span>
              )}
            </div>
            <div style={{ padding: "16px 18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 className="font-display" style={{ fontSize: 18, margin: 0, color: COLORS.ink }}>{t.name}</h3>
                <span style={{ color: COLORS.gold, fontWeight: 600, fontSize: 14 }}>{formatPrice(t.price)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PAGE DÉTAIL T-SHIRT (catalogue, non personnalisable hors couleur)
   ============================================================ */

function TshirtDetailPage({ ctx }) {
  const t = TSHIRTS.find((x) => x.id === ctx.productParam) || TSHIRTS[0];
  const availableColors = TSHIRT_COLORS.filter((c) => (t.colors || ["black"]).includes(c.id));
  const [color, setColor] = useState(availableColors[0]?.id || "black");
  const [fabric, setFabric] = useState("cotton");
  const [size, setSize] = useState("M");
  const [wantsNickname, setWantsNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const total = t.price + (wantsNickname ? NICKNAME_FEE : 0);

  function handleAdd(e) {
    ctx.addToCart({
      id: t.id, title: t.name, price: total, qty: 1,
      meta: {
        Couleur: TSHIRT_COLORS.find((c) => c.id === color)?.label,
        Tissu: fabric === "cotton" ? "Coton" : "Polyester",
        Taille: size,
        ...(wantsNickname && nickname ? { Surnom: nickname } : {}),
      },
      img: t.img ? IMAGES[t.img] : null,
    }, btnRef.current.getBoundingClientRect());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px 100px" }}>
      <Breadcrumb items={[{ label: "T-shirts", page: "tshirts" }, { label: t.name }]} ctx={ctx} />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 50, marginTop: 24 }} className="product-grid">
        <div style={{ borderRadius: 18, overflow: "hidden", background: COLORS.nightDeep, aspectRatio: "4/5" }}>
          {t.img ? <img src={IMAGES[t.img]} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <CustomTshirtIllustration />}
        </div>
        <div>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: "0 0 14px", color: COLORS.ink }}>{t.name}</h1>
          <div style={{ fontSize: 22, color: COLORS.gold, fontWeight: 600, marginBottom: 28 }}>{formatPrice(t.price)}</div>

          <div style={{ marginBottom: 22 }}>
            <label className="field-label">Taille</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  width: 44, height: 40, borderRadius: 8, cursor: "pointer",
                  border: `1.5px solid ${size === s ? COLORS.gold : "rgba(44,59,48,0.25)"}`,
                  background: size === s ? "rgba(106,186,220,0.12)" : "transparent",
                  color: size === s ? COLORS.gold : COLORS.ink, fontSize: 13.5, fontWeight: 600,
                }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <label className="field-label">Couleur</label>
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              {availableColors.map((c) => (
                <button key={c.id} onClick={() => setColor(c.id)} title={c.label} style={{
                  width: 34, height: 34, borderRadius: "50%", cursor: "pointer", background: c.hex,
                  border: color === c.id ? `2.5px solid ${COLORS.gold}` : "2px solid rgba(44,59,48,0.25)",
                  outline: "none",
                }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <label className="field-label">Tissu</label>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {[{ id: "cotton", label: "Coton" }, { id: "polyester", label: "Polyester" }].map((f) => (
                <button key={f.id} onClick={() => setFabric(f.id)} style={{
                  padding: "9px 18px", borderRadius: 30, cursor: "pointer",
                  border: `1.5px solid ${fabric === f.id ? COLORS.gold : "rgba(44,59,48,0.25)"}`,
                  background: fabric === f.id ? "rgba(106,186,220,0.12)" : "transparent",
                  color: fabric === f.id ? COLORS.gold : COLORS.ink, fontSize: 13.5, fontWeight: 600,
                }}>{f.label}</button>
              ))}
            </div>
          </div>

          {t.customizable && (
            <div style={{ marginBottom: 28, padding: "16px 18px", background: COLORS.slate, borderRadius: 12, border: "1px solid rgba(106,186,220,0.18)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={wantsNickname} onChange={(e) => setWantsNickname(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: COLORS.gold }} />
                <span style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 600 }}>
                  Disponible à la personnalisation — ajouter un surnom <span style={{ color: COLORS.gold }}>(+{formatPrice(NICKNAME_FEE)})</span>
                </span>
              </label>
              {wantsNickname && (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ton surnom à floquer sur le t-shirt"
                  maxLength={20}
                  style={{
                    width: "100%", marginTop: 12, padding: "10px 14px", borderRadius: 8,
                    background: COLORS.night, border: "1px solid rgba(44,59,48,0.18)",
                    color: COLORS.ink, fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          )}

          {wantsNickname && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: COLORS.gold, marginBottom: 18 }}>
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          )}

          <OriginButton ref={btnRef} onClick={handleAdd} style={{ width: "100%" }}>
            {added ? <><Icon.Check size={16} /> Ajouté au panier</> : "Ajouter au panier"}
          </OriginButton>

          <ShippingNote />
        </div>
      </div>
    </div>
  );
}

function ShippingNote() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 22, padding: "14px 16px", background: "rgba(106,186,220,0.08)", borderRadius: 10, border: "1px solid rgba(106,186,220,0.18)" }}>
      <Icon.Truck size={18} />
      <span style={{ fontSize: 12.5, color: "rgba(44,59,48,0.75)", lineHeight: 1.5 }}>
        Livraison gratuite dès 70 € d'achat. En dessous, livraison à domicile pour 4 €, ou en point relais pour 3 €.
      </span>
    </div>
  );
}

function Breadcrumb({ items, ctx }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(44,59,48,0.5)", flexWrap: "wrap" }}>
      <button onClick={() => ctx.go("home")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>Accueil</button>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <Icon.ChevronRight size={12} />
          {it.page ? (
            <button onClick={() => ctx.go(it.page)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>{it.label}</button>
          ) : (
            <span style={{ color: COLORS.gold }}>{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function HomePage({ ctx }) {
  const favorites = [
    { type: "custom", title: "T-shirt personnalisé", price: "Dès 32 €", desc: "Ton image, ton logo, ton t-shirt.", action: () => ctx.go("product-custom") },
    { type: "portrait", title: "Portrait personnalisé", price: "Dès 70 €", desc: "Ta photo, réinventée aux crayons de couleur.", action: () => ctx.go("portrait") },
    { type: "tshirt", id: "ares", title: "Arès", price: "27 €", desc: "Le dieu de la guerre en cavalier.", action: () => ctx.go("product-tshirt", "ares") },
    { type: "tshirt", id: "dragon", title: "You Are A Dragon", price: "27 €", desc: "Be a dragon.", action: () => ctx.go("product-tshirt", "dragon") },
  ];

  return (
    <div>
      <Hero ctx={ctx} />
      <FavoritesSection favorites={favorites} ctx={ctx} />
      <ProcessStrip />
      <PolicySection ctx={ctx} />
    </div>
  );
}

/* ---------- Origin Button : remplissage radial au survol/clic, adapté en CSS/JS pur ---------- */
function getCoverDiameter(width, height, x, y) {
  return Math.ceil(2 * Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y)
  ));
}

const OriginButton = React.forwardRef(function OriginButton(
  { children, onClick, variant = "fill", style, type = "button", disabled },
  forwardedRef
) {
  const innerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [coverSize, setCoverSize] = useState(0);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const isFill = variant === "fill";
  const baseBg = isFill ? COLORS.lagoon : "transparent";
  const baseColor = isFill ? COLORS.white : COLORS.ink;
  const fillBg = isFill ? COLORS.lagoonDeep : COLORS.ink;
  const fillColor = isFill ? COLORS.white : COLORS.cream;

  const updateOrigin = (x, y) => {
    const node = innerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
  };

  const showFill = !disabled && (hovered || pressed);

  return (
    <button
      ref={setRefs}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        updateOrigin(e.clientX - rect.left, e.clientY - rect.top);
        setHovered(true);
      }}
      onPointerMove={(e) => {
        if (!hovered) {
          const rect = e.currentTarget.getBoundingClientRect();
          updateOrigin(e.clientX - rect.left, e.clientY - rect.top);
        }
      }}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        updateOrigin(e.clientX - rect.left, e.clientY - rect.top);
        setPressed(true);
      }}
      onPointerUp={() => setPressed(false)}
      style={{
        position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        height: 48, padding: "0 28px", borderRadius: 30, cursor: disabled ? "default" : "pointer",
        fontFamily: "'Outfit', sans-serif", fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em",
        border: isFill ? "none" : `1.5px solid rgba(44,59,48,0.35)`,
        background: baseBg, color: showFill ? fillColor : baseColor,
        transition: "color 0.3s cubic-bezier(.16,1,.3,1), border-color 0.25s ease",
        opacity: disabled ? 0.5 : 1,
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute", left: origin.x, top: origin.y,
          width: coverSize, height: coverSize, borderRadius: "50%",
          background: fillBg, pointerEvents: "none",
          transform: `translate(-50%, -50%) scale(${showFill && coverSize > 0 ? 1 : 0})`,
          transition: "transform 0.5s cubic-bezier(.16,1,.3,1)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </button>
  );
});

/* ---------- Ink Reveal : masque à l'encre qui se dissipe au survol (souris) ---------- */
function InkReveal({ maskColor = [255, 252, 241], brushSize = 130, lifetime = 900, baseOpacity = 0.4 }) {
  const canvasRef = useRef(null);
  const stampsRef = useRef([]);
  const runningRef = useRef(false);
  const lastPosRef = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const mc = maskColor;

  const paintBase = React.useCallback((ctx, w, h) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${mc[0]},${mc[1]},${mc[2]},${baseOpacity})`;
    ctx.fillRect(0, 0, w, h);
  }, [mc, baseOpacity]);

  const resize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    dimsRef.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBase(ctx, w, h);
  }, [paintBase]);

  const carveInk = React.useCallback((ctx, x, y, r, seed, alpha) => {
    const segments = 32;
    const wobble = [0.14, 0.08, 0.05];
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, `rgba(${mc[0]},${mc[1]},${mc[2]},${0.65 * alpha})`);
    g.addColorStop(0.5, `rgba(${mc[0]},${mc[1]},${mc[2]},${0.5 * alpha})`);
    g.addColorStop(1, `rgba(${mc[0]},${mc[1]},${mc[2]},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const wob = 0.78 + wobble[0] * Math.sin(a * 3 + seed) + wobble[1] * Math.sin(a * 5 + seed * 2.1) + wobble[2] * Math.sin(a * 7 + seed * 0.7);
      const px = x + Math.cos(a) * r * wob;
      const py = y + Math.sin(a) * r * wob;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }, [mc]);

  const addStamp = React.useCallback((x, y) => {
    const stamps = stampsRef.current;
    if (stamps.length >= 160) stamps.shift();
    stamps.push({ x, y, born: performance.now(), seed: Math.random() * Math.PI * 2, rmax: brushSize * (0.7 + Math.random() * 0.45) });
  }, [brushSize]);

  const stampAlong = React.useCallback((x, y) => {
    const last = lastPosRef.current;
    if (!last) {
      addStamp(x, y);
    } else {
      const dx = x - last.x, dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(dist / 10));
      for (let i = 1; i <= steps; i++) addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
    }
    lastPosRef.current = { x, y };
  }, [addStamp]);

  const loop = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dimsRef.current;
    const now = performance.now();
    const stamps = stampsRef.current;
    // Repart d'un masque transparent (pas opaque) sur lequel on superpose le voile de base + les taches d'encre
    ctx.clearRect(0, 0, w, h);
    paintBase(ctx, w, h);
    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / lifetime;
      if (t >= 1) { stamps.splice(i, 1); continue; }
      const ease = 1 - Math.pow(1 - t, 3);
      const r = 10 + (stamps[i].rmax - 10) * ease;
      const alpha = 1 - t * t;
      carveInk(ctx, stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha);
    }
    if (stamps.length) requestAnimationFrame(loop);
    else runningRef.current = false;
  }, [carveInk, paintBase, lifetime]);

  const startLoop = React.useCallback(() => {
    if (!runningRef.current) { runningRef.current = true; requestAnimationFrame(loop); }
  }, [loop]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const getRelativePos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, zIndex: 2 }}
      onMouseEnter={(e) => { const pos = getRelativePos(e); lastPosRef.current = pos; stampAlong(pos.x, pos.y); startLoop(); }}
      onMouseMove={(e) => { const pos = getRelativePos(e); stampAlong(pos.x, pos.y); startLoop(); }}
      onMouseLeave={() => { lastPosRef.current = null; }}
    />
  );
}

function Hero({ ctx }) {
  return (
    <section style={{
      position: "relative",
      minHeight: "82vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Background : photo, révélée à l'encre au passage de la souris */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${IMAGES.heroDrawing}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "scale(1.04)",
      }} />
      <InkReveal maskColor={[255, 252, 241]} brushSize={150} baseOpacity={0.4} />
      {/* Voile additionnel doux uniquement derrière le texte, pour garantir la lisibilité sans cacher toute la photo */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: `radial-gradient(ellipse 700px 420px at 50% 58%, rgba(255,252,241,0.78) 0%, rgba(255,252,241,0.3) 60%, transparent 100%)`,
      }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: `linear-gradient(180deg, transparent 0%, transparent 70%, rgba(255,252,241,0.9) 100%)` }} />

      {/* Ligne d'horizon façon vague, en bas du hero */}
      <WaveDivider />

      <div style={{ position: "relative", zIndex: 4, maxWidth: 880, margin: "0 auto", padding: "0 24px", width: "100%", textAlign: "center", pointerEvents: "none" }}>
        <span className="font-script" style={{ color: COLORS.lagoonDeep, fontSize: 21, display: "block", marginBottom: 14 }}>
          Payanké Design
        </span>
        <h1 className="font-display" style={{ fontSize: "clamp(2.1rem, 5vw, 3.6rem)", lineHeight: 1.15, color: COLORS.ink, margin: 0 }}>
          Découvre de beaux t-shirts<br />et ton portrait&nbsp;!
        </h1>
        <p style={{ fontSize: 16.5, color: "rgba(44,59,48,0.78)", marginTop: 20, lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Portraits réalisés aux crayons de couleur, t-shirts personnalisés ou tirés de ma collection — chaque pièce part d'un trait de crayon.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap", justifyContent: "center", pointerEvents: "auto" }}>
          <OriginButton onClick={() => ctx.go("portrait")} variant="fill">Commander un portrait</OriginButton>
          <OriginButton onClick={() => ctx.go("tshirts")} variant="outline">Voir les t-shirts</OriginButton>
        </div>
      </div>
    </section>
  );
}

/* ---------- Séparateur "vague" évoquant la mer ---------- */
function WaveDivider() {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, right: 0, bottom: -1, width: "100%", height: 70, color: COLORS.cream }}
    >
      <path
        fill="currentColor"
        d="M0,40 C 180,80 360,0 540,30 C 720,60 900,10 1080,30 C 1260,50 1350,20 1440,35 L1440,80 L0,80 Z"
      />
    </svg>
  );
}

function FavoritesSection({ favorites, ctx }) {
  return (
    <section style={{ padding: "84px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <SectionHeading eyebrow="Sélection" title="Mes coups de cœur" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 22, marginTop: 40 }}>
        {favorites.map((f, i) => (
          <FavoriteCard key={i} fav={f} ctx={ctx} />
        ))}
      </div>
    </section>
  );
}

function FavoriteCard({ fav, ctx }) {
  let img = null;
  if (fav.type === "tshirt") img = IMAGES[TSHIRTS.find((t) => t.id === fav.id).img];
  if (fav.type === "portrait") img = IMAGES.portraitExemple;

  return (
    <button onClick={fav.action} style={{
      textAlign: "left", background: COLORS.slate, border: "1px solid rgba(106,186,220,0.15)",
      borderRadius: 14, overflow: "hidden", cursor: "pointer", padding: 0,
      display: "flex", flexDirection: "column", transition: "transform 0.25s ease, border-color 0.25s ease",
    }} className="favorite-card">
      <div style={{ aspectRatio: "4/5", overflow: "hidden", background: COLORS.nightDeep, position: "relative" }}>
        {img ? (
          <img src={img} alt={fav.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <CustomTshirtIllustration />
        )}
        <span style={{
          position: "absolute", top: 12, left: 12, background: "rgba(7,19,38,0.85)", color: COLORS.gold,
          fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.04em",
        }}>{fav.price}</span>
      </div>
      <div style={{ padding: "18px 18px 22px" }}>
        <h3 className="font-display" style={{ fontSize: 19, margin: "0 0 6px", color: COLORS.ink }}>{fav.title}</h3>
        <p style={{ fontSize: 13.5, color: "rgba(44,59,48,0.65)", margin: 0, lineHeight: 1.5 }}>{fav.desc}</p>
      </div>
    </button>
  );
}

function CustomTshirtIllustration() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${COLORS.slate}, ${COLORS.nightDeep})` }}>
      <svg viewBox="0 0 100 100" width="55%" style={{ opacity: 0.85 }}>
        <path d="M30 15 L40 8 L50 14 L60 8 L70 15 L78 25 L70 32 L65 28 L65 85 L35 85 L35 28 L30 32 L22 25 Z"
          fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="9" fill="none" stroke={COLORS.gold} strokeWidth="1.4" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

function ProcessStrip() {
  const items = [
    { label: "Crayons de couleur", sub: "Réalisation 100% manuelle", color: COLORS.lagoonDeep },
    { label: "1 à 2 semaines", sub: "Délai moyen de création", color: COLORS.sageDeep },
    { label: "Livré encadré", sub: "Portraits prêts à accrocher", color: COLORS.lagoonDeep },
  ];
  return (
    <section style={{ borderTop: "1px solid rgba(106,186,220,0.15)", borderBottom: "1px solid rgba(106,186,220,0.15)", background: COLORS.nightDeep }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "34px 24px", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-around" }}>
        {items.map((it, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div className="font-script" style={{ color: it.color, fontSize: 20 }}>{it.label}</div>
            <div style={{ fontSize: 12.5, color: "rgba(44,59,48,0.6)", marginTop: 2 }}>{it.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PolicySection({ ctx }) {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "70px 24px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
        <div>
          <h4 className="font-display" style={{ fontSize: 18, color: COLORS.gold, marginBottom: 10 }}>Politique de retour</h4>
          <p style={{ fontSize: 13.5, color: "rgba(44,59,48,0.7)", lineHeight: 1.7 }}>
            Les t-shirts non personnalisés peuvent être retournés sous 14 jours, non portés et dans leur emballage d'origine. Les créations personnalisées (portraits, t-shirts avec image ou logo sur-mesure) étant uniques, elles ne sont ni reprises ni échangées, sauf défaut de fabrication.
          </p>
        </div>
        <div>
          <h4 className="font-display" style={{ fontSize: 18, color: COLORS.gold, marginBottom: 10 }}>Mentions légales</h4>
          <p style={{ fontSize: 13.5, color: "rgba(44,59,48,0.7)", lineHeight: 1.7 }}>
            Payanké Design — entreprise individuelle. Pour consulter les informations légales complètes (SIRET, hébergeur, conditions générales de vente), rendez-vous sur la page dédiée.
          </p>
          <button onClick={() => ctx.go("legal-mentions")} style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 13, cursor: "pointer", padding: 0, marginTop: 8, textDecoration: "underline" }}>
            Voir les mentions légales →
          </button>
        </div>
        <div>
          <h4 className="font-display" style={{ fontSize: 18, color: COLORS.gold, marginBottom: 10 }}>Suis le travail en cours</h4>
          <p style={{ fontSize: 13.5, color: "rgba(44,59,48,0.7)", lineHeight: 1.7, marginBottom: 12 }}>
            Croquis, coulisses et nouvelles pièces à suivre au quotidien.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <a href="https://instagram.com/payankedesign" target="_blank" rel="noreferrer" style={{ color: COLORS.ink, display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, textDecoration: "none" }}>
              <Icon.Instagram size={18} /> @payankedesign
            </a>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <a href="https://tiktok.com/@payankedesign" target="_blank" rel="noreferrer" style={{ color: COLORS.ink, display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, textDecoration: "none" }}>
              <Icon.Tiktok size={18} /> @payankedesign
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, light }) {
  return (
    <div>
      {eyebrow && <span className="font-script" style={{ color: light ? COLORS.lagoonDeep : COLORS.lagoonDeep, fontSize: 18 }}>{eyebrow}</span>}
      <h2 className="font-display" style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)", margin: "4px 0 0", color: light ? COLORS.white : COLORS.ink }}>{title}</h2>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home"); // home | product-tshirt | product-portrait | product-custom | about | tracking | contact | cart | checkout | thanks | legal-* 
  const [productParam, setProductParam] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flyAnim, setFlyAnim] = useState(null); // {id, startX, startY}
  const cartIconRef = useRef(null);
  const [lastOrder, setLastOrder] = useState(null);

  function go(p, param = null) {
    setPage(p);
    setProductParam(param);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function addToCart(item, originRect) {
    const cartId = item.cartId || Math.random().toString(36).slice(2);
    setCart((c) => {
      // Règle métier : le forfait "création de logo" (+50€) ne doit être facturé
      // qu'une seule fois sur l'ensemble de la commande, même si plusieurs
      // t-shirts personnalisés le demandent.
      let incomingItem = { ...item, cartId, qty: item.qty || 1 };
      if (incomingItem._flags?.logoFeeCounted) {
        const alreadyHasLogoFee = c.some((x) => x._flags?.logoFeeCounted);
        if (alreadyHasLogoFee) {
          incomingItem = {
            ...incomingItem,
            price: incomingItem.price - LOGO_CREATION_FEE,
            meta: { ...incomingItem.meta, "Logo devant": "Oui (forfait déjà compté dans la commande)" },
            _flags: { ...incomingItem._flags, logoFeeCounted: "waived" },
          };
        }
      }

      const idx = c.findIndex((x) => x.cartId === incomingItem.cartId);
      if (idx >= 0) {
        const copy = [...c];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + incomingItem.qty };
        return copy;
      }
      return [...c, incomingItem];
    });
    if (originRect && cartIconRef.current) {
      const cartRect = cartIconRef.current.getBoundingClientRect();
      setFlyAnim({
        key: Date.now(),
        startX: originRect.left + originRect.width / 2,
        startY: originRect.top + originRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      });
      setTimeout(() => setFlyAnim(null), 700);
    }
  }

  function updateQty(cartId, qty) {
    setCart((c) => c.map((x) => (x.cartId === cartId ? { ...x, qty: Math.max(1, qty) } : x)).filter((x) => x.qty > 0));
  }
  function removeFromCart(cartId) {
    setCart((c) => {
      const removed = c.find((x) => x.cartId === cartId);
      let next = c.filter((x) => x.cartId !== cartId);
      // Si la ligne supprimée portait le forfait logo "actif", on le réattribue
      // à la prochaine ligne qui l'avait demandé mais s'était vue exonérée.
      if (removed?._flags?.logoFeeCounted === true) {
        const idx = next.findIndex((x) => x._flags?.logoFeeCounted === "waived");
        if (idx >= 0) {
          next = [...next];
          next[idx] = {
            ...next[idx],
            price: next[idx].price + LOGO_CREATION_FEE,
            meta: { ...next[idx].meta, "Logo devant": "Oui (forfait création de logo inclus)" },
            _flags: { ...next[idx]._flags, logoFeeCounted: true },
          };
        }
      }
      return next;
    });
  }

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const ctx = { page, productParam, go, cart, addToCart, updateQty, removeFromCart, subtotal, cartOpen, setCartOpen, lastOrder, setLastOrder };

  return (
    <div style={{ background: COLORS.night, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: COLORS.ink, position: "relative" }}>
      <GlobalStyles />
      <AnnouncementBar />
      <Header ctx={ctx} cartIconRef={cartIconRef} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu ctx={ctx} open={menuOpen} setOpen={setMenuOpen} />

      <main>
        {page === "home" && <HomePage ctx={ctx} />}
        {page === "tshirts" && <TshirtsListPage ctx={ctx} />}
        {page === "product-tshirt" && <TshirtDetailPage ctx={ctx} />}
        {page === "product-custom" && <CustomTshirtPage ctx={ctx} />}
        {page === "portrait" && <PortraitPage ctx={ctx} />}
        {page === "about" && <AboutPage ctx={ctx} />}
        {page === "tracking" && <TrackingPage ctx={ctx} />}
        {page === "contact" && <ContactPage ctx={ctx} />}
        {page === "checkout" && <CheckoutPage ctx={ctx} />}
        {page === "thanks" && <ThanksPage ctx={ctx} />}
        {page === "legal-returns" && <LegalReturnsPage ctx={ctx} />}
        {page === "legal-mentions" && <LegalMentionsPage ctx={ctx} />}
      </main>

      <Footer ctx={ctx} />
      <CartDrawer ctx={ctx} />
      {flyAnim && <FlyToCart anim={flyAnim} />}
    </div>
  );
}

/* ---------- Animation "vol vers le panier" ---------- */
function FlyToCart({ anim }) {
  const dx = anim.endX - anim.startX;
  const dy = anim.endY - anim.startY;
  return (
    <div
      key={anim.key}
      style={{
        position: "fixed",
        left: anim.startX,
        top: anim.startY,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: COLORS.gold,
        zIndex: 9999,
        pointerEvents: "none",
        animation: "flyToCart 0.65s cubic-bezier(.3,.0,.6,1) forwards",
        "--dx": `${dx}px`,
        "--dy": `${dy}px`,
        boxShadow: "0 0 12px rgba(106,186,220,0.8)",
      }}
    />
  );
}

/* ---------- Barre d'annonce ---------- */
function AnnouncementBar() {
  return (
    <div style={{
      background: COLORS.lagoon,
      color: COLORS.white,
      textAlign: "center",
      padding: "9px 16px",
      fontSize: 13.5,
      fontWeight: 600,
      letterSpacing: "0.02em",
    }}>
      Livraison gratuite à partir de 70 € d'achat
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ ctx, cartIconRef, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "T-shirts", page: "tshirts" },
    { label: "Portrait personnalisé", page: "portrait" },
    { label: "Qui suis-je", page: "about" },
    { label: "Suivi colis", page: "tracking" },
    { label: "Contact", page: "contact" },
  ];
  const totalQty = ctx.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(255,252,241,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(106,186,220,0.18)" : "1px solid transparent",
      transition: "all 0.35s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => ctx.go("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src={IMAGES.logo} alt="Payanké Design" style={{ height: 48, width: "auto" }} />
        </button>

        <nav style={{ display: "flex", gap: 30 }} className="desktop-nav">
          {navItems.map((n) => (
            <button key={n.page} onClick={() => ctx.go(n.page)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: ctx.page === n.page ? COLORS.gold : COLORS.ink,
              fontSize: 14.5, fontWeight: 500, letterSpacing: "0.02em",
              position: "relative", padding: "6px 0",
            }} className="nav-link">
              {n.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            ref={cartIconRef}
            onClick={() => ctx.setCartOpen(true)}
            aria-label="Panier"
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: COLORS.ink, padding: 6 }}
          >
            <Icon.Cart />
            {totalQty > 0 && (
              <span style={{
                position: "absolute", top: -2, right: -4, background: COLORS.lagoon, color: COLORS.white,
                fontSize: 10.5, fontWeight: 700, borderRadius: "50%", width: 18, height: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{totalQty}</span>
            )}
          </button>
          <button className="mobile-only" onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.ink }}>
            <Icon.Menu />
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ ctx, open, setOpen }) {
  const navItems = [
    { label: "Accueil", page: "home" },
    { label: "T-shirts", page: "tshirts" },
    { label: "Portrait personnalisé", page: "portrait" },
    { label: "Qui suis-je", page: "about" },
    { label: "Suivi colis", page: "tracking" },
    { label: "Contact", page: "contact" },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: COLORS.nightDeep,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 20 }}>
        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: COLORS.ink, cursor: "pointer" }}>
          <Icon.Close size={28} />
        </button>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 32px" }}>
        {navItems.map((n) => (
          <button key={n.page} onClick={() => ctx.go(n.page)} style={{
            background: "none", border: "none", textAlign: "left", padding: "16px 0",
            borderBottom: "1px solid rgba(44,59,48,0.1)",
            color: ctx.page === n.page ? COLORS.gold : COLORS.ink,
            fontSize: 22, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, cursor: "pointer",
          }}>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ============================================================
   PAGE SUIVI DE COLIS
   ============================================================ */

function TrackingPage({ ctx }) {
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    // Démo : simulation d'un statut de suivi
    if (ctx.lastOrder && orderNumber.trim().toUpperCase() === ctx.lastOrder.number) {
      setResult({ number: ctx.lastOrder.number, step: 1 });
      setError(false);
    } else if (/^PYK-\d{6}$/i.test(orderNumber.trim())) {
      setResult({ number: orderNumber.trim().toUpperCase(), step: 2 });
      setError(false);
    } else {
      setResult(null);
      setError(true);
    }
  }

  const steps = ["Commande reçue", "En cours de réalisation", "Expédiée", "Livrée"];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px 120px" }}>
      <Breadcrumb items={[{ label: "Suivi de colis" }]} ctx={ctx} />
      <div style={{ textAlign: "center", marginTop: 14, marginBottom: 40 }}>
        <span className="font-script" style={{ color: COLORS.gold, fontSize: 18 }}>Où en est ma commande</span>
        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", margin: "4px 0", color: COLORS.ink }}>Suivi de colis</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginBottom: 30, flexWrap: "wrap" }}>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Numéro de commande (ex. PYK-123456)"
          style={{
            flex: 1, minWidth: 220, padding: "13px 16px", borderRadius: 10,
            background: COLORS.slate, border: "1px solid rgba(44,59,48,0.18)",
            color: COLORS.ink, fontSize: 14, fontFamily: "inherit",
          }}
        />
        <OriginButton type="submit">
          <Icon.Search size={16} /> Suivre
        </OriginButton>
      </form>

      {error && (
        <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(181,86,46,0.15)", border: "1px solid rgba(181,86,46,0.35)", color: COLORS.ink, fontSize: 13.5, marginBottom: 20 }}>
          Numéro de commande introuvable. Vérifie le format (ex. PYK-123456) ou contacte-moi directement.
        </div>
      )}

      {result && (
        <div style={{ background: COLORS.slate, borderRadius: 16, padding: "28px 26px" }}>
          <div style={{ fontSize: 13, color: "rgba(44,59,48,0.6)", marginBottom: 4 }}>Commande</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.lagoonDeep, marginBottom: 26 }}>{result.number}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: i <= result.step ? COLORS.sage : "rgba(44,59,48,0.12)",
                    color: i <= result.step ? COLORS.white : "rgba(44,59,48,0.4)",
                    flexShrink: 0,
                  }}>
                    {i <= result.step ? <Icon.Check size={14} /> : <span style={{ fontSize: 11 }}>{i + 1}</span>}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 32, background: i < result.step ? COLORS.sage : "rgba(44,59,48,0.12)" }} />
                  )}
                </div>
                <div style={{ paddingBottom: 28 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: i <= result.step ? COLORS.ink : "rgba(44,59,48,0.45)" }}>{s}</div>
                  {i === result.step && <div style={{ fontSize: 12, color: "rgba(44,59,48,0.55)", marginTop: 2 }}>Statut actuel</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !error && (
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(44,59,48,0.5)" }}>
          Renseigne le numéro reçu par email après ta commande pour suivre son avancement.
        </p>
      )}
    </div>
  );
}

/* ============================================================
   PAGE CONTACT
   ============================================================ */

function ContactPage({ ctx }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "60px 24px 120px" }}>
      <Breadcrumb items={[{ label: "Contact" }]} ctx={ctx} />
      <div style={{ marginTop: 14, marginBottom: 40 }}>
        <span className="font-script" style={{ color: COLORS.gold, fontSize: 18 }}>Une question, une idée</span>
        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", margin: "4px 0", color: COLORS.ink }}>Contact</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 50 }} className="product-grid">
        <div>
          <p style={{ fontSize: 14.5, color: "rgba(44,59,48,0.75)", lineHeight: 1.7, marginBottom: 28 }}>
            Une question sur une commande, une envie de projet sur-mesure ? Écris-moi, je réponds généralement sous 48h.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <a href="mailto:payankedesign@gmail.com" style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.ink, textDecoration: "none", fontSize: 14 }}>
              <Icon.Mail size={18} /> payankedesign@gmail.com
            </a>
            <a href="https://instagram.com/payankedesign" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.ink, textDecoration: "none", fontSize: 14 }}>
              <Icon.Instagram size={18} /> @payankedesign
            </a>
            <a href="https://tiktok.com/@payankedesign" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.ink, textDecoration: "none", fontSize: 14 }}>
              <Icon.Tiktok size={18} /> @payankedesign
            </a>
          </div>
        </div>

        <div>
          {sent ? (
            <div style={{ background: COLORS.slate, borderRadius: 14, padding: "28px 26px", textAlign: "center" }}>
              <Icon.Check size={28} />
              <p style={{ marginTop: 14, fontSize: 14.5, color: COLORS.ink }}>Message envoyé ! Je te réponds très vite.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Field label="Nom" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <Field label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              <div style={{ marginBottom: 14 }}>
                <label className="field-label">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required rows={5}
                  style={{
                    width: "100%", marginTop: 6, padding: "12px 14px", borderRadius: 10,
                    background: COLORS.slate, border: "1px solid rgba(44,59,48,0.18)",
                    color: COLORS.ink, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                  }}
                />
              </div>
              <OriginButton type="submit" style={{ width: "100%" }}>Envoyer le message</OriginButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGES LÉGALES
   ============================================================ */

function LegalReturnsPage({ ctx }) {
  return (
    <LegalLayout ctx={ctx} title="Politique de retour">
      <p>Chez Payanké Design, chaque création compte. Voici comment fonctionnent les retours et échanges.</p>
      <h4>T-shirts de la collection (non personnalisés)</h4>
      <p>Tu disposes de 14 jours après réception pour retourner un article, à condition qu'il n'ait pas été porté, lavé, et qu'il soit renvoyé dans son emballage d'origine avec ses étiquettes.</p>
      <h4>Créations personnalisées</h4>
      <p>Les t-shirts personnalisés (image au dos, logo sur-mesure) et les portraits sont des pièces uniques, réalisées spécialement pour toi. Ils ne peuvent donc ni être repris, ni échangés, sauf en cas de défaut de fabrication avéré.</p>
      <h4>Défaut de fabrication</h4>
      <p>Si ta commande arrive endommagée ou présente un défaut, contacte-moi sous 7 jours avec une photo à l'appui : une solution te sera proposée (réparation, remplacement ou remboursement selon le cas).</p>
    </LegalLayout>
  );
}

function LegalMentionsPage({ ctx }) {
  return (
    <LegalLayout ctx={ctx} title="Mentions légales">
      <h4>Éditeur du site</h4>
      <p>Payanké Design — entreprise individuelle.<br/>Email : payankedesign@gmail.com</p>
      <h4>Hébergement</h4>
      <p>Ce site est hébergé par un prestataire d'hébergement web tiers.</p>
      <h4>Propriété intellectuelle</h4>
      <p>L'ensemble des illustrations, portraits, logos et visuels présents sur ce site sont des créations originales de Payanké Design et sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p>
      <h4>Données personnelles</h4>
      <p>Les informations recueillies via ce site (commandes, formulaire de contact) sont utilisées uniquement dans le cadre de la gestion des commandes et des échanges avec la clientèle. Conformément au RGPD, tu disposes d'un droit d'accès, de rectification et de suppression de tes données, à exercer par email.</p>
    </LegalLayout>
  );
}

function LegalLayout({ ctx, title, children }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 120px" }}>
      <Breadcrumb items={[{ label: title }]} ctx={ctx} />
      <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", margin: "14px 0 30px", color: COLORS.ink }}>{title}</h1>
      <div className="legal-content" style={{ color: "rgba(44,59,48,0.78)", fontSize: 14.5, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer({ ctx }) {
  return (
    <footer style={{ borderTop: "1px solid rgba(106,186,220,0.15)", padding: "40px 24px", background: COLORS.nightDeep }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={IMAGES.logo} alt="Payanké Design" style={{ height: 28, opacity: 0.75 }} />
          <span style={{ fontSize: 12.5, color: "rgba(44,59,48,0.5)" }}>© {new Date().getFullYear()} Payanké Design — Tous droits réservés</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12.5 }}>
          <button onClick={() => ctx.go("legal-returns")} style={{ background: "none", border: "none", color: "rgba(44,59,48,0.6)", cursor: "pointer", padding: 0 }}>Politique de retour</button>
          <button onClick={() => ctx.go("legal-mentions")} style={{ background: "none", border: "none", color: "rgba(44,59,48,0.6)", cursor: "pointer", padding: 0 }}>Mentions légales</button>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   STYLES GLOBAUX (polices, classes utilitaires, animations)
   ============================================================ */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

      * { box-sizing: border-box; }
      body { margin: 0; }

      .font-display {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .font-script {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        font-style: italic;
        letter-spacing: 0.01em;
      }

      .field-label {
        font-size: 12.5px; font-weight: 600; color: rgba(44,59,48,0.7);
        text-transform: uppercase; letter-spacing: 0.04em;
      }

      .nav-link::after {
        content: ''; position: absolute; left: 0; bottom: -2px; height: 2px; width: 0;
        background: ${COLORS.gold}; transition: width 0.25s ease;
      }
      .nav-link:hover::after { width: 100%; }

      input, textarea, select {
        appearance: none; -webkit-appearance: none;
      }
      input:invalid, textarea:invalid {
        box-shadow: none;
      }
      input:focus, textarea:focus, button:focus-visible {
        outline: 2px solid ${COLORS.lagoon}; outline-offset: 2px;
      }

      .legal-content h4 { color: ${COLORS.lagoonDeep}; font-size: 15px; margin: 24px 0 8px; font-family: 'Outfit', sans-serif; font-weight: 600; }
      .legal-content p { margin: 0 0 14px; }

      @keyframes flyToCart {
        0% { transform: translate(0,0) scale(1); opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(0.3); opacity: 0; }
      }

      /* Mouvement façon nage / courant marin : ondulation douce horizontale + verticale */
      @keyframes floatWave {
        0%   { transform: translate(0, 0) rotate(0deg); }
        25%  { transform: translate(10px, -10px) rotate(1.5deg); }
        50%  { transform: translate(0, -16px) rotate(0deg); }
        75%  { transform: translate(-10px, -8px) rotate(-1.5deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
      .hero-bird, .flying-bird { animation: floatWave 10s ease-in-out infinite; }

      /* Légère houle continue, utilisée derrière certains titres / diviseurs */
      @keyframes gentleSwell {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-2.5%); }
      }

      .favorite-card { transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease, border-color 0.3s ease; }
      .favorite-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(106,186,220,0.18); }

      .desktop-nav { display: flex; }
      .mobile-only { display: none; }

      @media (max-width: 860px) {
        .desktop-nav { display: none; }
        .mobile-only { display: flex; }
        .product-grid { grid-template-columns: 1fr !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-bird, .flying-bird { animation: none; }
      }
    `}</style>
  );
}
