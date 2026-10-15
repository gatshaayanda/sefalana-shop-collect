"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BASKET_STORAGE_KEY, type DemoDepartment, type DemoProduct, formatBwp, readDemoCatalogue, seedDepartments, seedProducts } from "@/lib/demo-catalogue";
import "./shop.css";

type Basket = Record<string, number>;

export default function HomePage() {
  const [departments, setDepartments] = useState<DemoDepartment[]>(seedDepartments);
  const [products, setProducts] = useState<DemoProduct[]>(seedProducts);
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState<Basket>({});
  const [basketOpen, setBasketOpen] = useState(false);

  useEffect(() => {
    const syncCatalogue = () => { const value = readDemoCatalogue(); setDepartments(value.departments); setProducts(value.products); };
    const syncBasket = () => { try { setBasket(JSON.parse(localStorage.getItem(BASKET_STORAGE_KEY) || "{}") as Basket); } catch { setBasket({}); } };
    syncCatalogue(); syncBasket();
    window.addEventListener("storage", syncCatalogue); window.addEventListener("storage", syncBasket);
    return () => { window.removeEventListener("storage", syncCatalogue); window.removeEventListener("storage", syncBasket); };
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const departmentMatch = activeDepartment === "all" || product.departmentId === activeDepartment;
    const query = search.trim().toLowerCase();
    const searchMatch = !query || [product.name, product.description, product.unit].some((field) => field.toLowerCase().includes(query));
    return departmentMatch && searchMatch && product.available;
  }), [products, activeDepartment, search]);
  const basketLines = products.filter((product) => (basket[product.id] || 0) > 0);
  const basketCount = basketLines.reduce((sum, product) => sum + basket[product.id], 0);
  const basketTotal = basketLines.reduce((sum, product) => sum + product.price * basket[product.id], 0);

  function updateQuantity(product: DemoProduct, next: number) {
    const updated = { ...basket };
    if (next <= 0) delete updated[product.id]; else updated[product.id] = Math.min(99, next);
    setBasket(updated);
    try { localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(updated)); } catch {}
  }

  return <main className="shop-page">
    <div className="shop-demo-banner"><span>CONCEPT PREVIEW</span> 18+ only · Sample catalogue and prices only · not live stock or an official ordering service.</div>
    <header className="shop-header">
      <Link className="shop-brand" href="/" aria-label="Shop & Collect home"><span className="shop-brand-mark" aria-hidden="true">S</span><span><strong>Shop & Collect</strong><small>MOGODITSHANE · PILOT CONCEPT</small></span></Link>
      <button className="shop-basket-button" type="button" onClick={() => setBasketOpen(!basketOpen)} aria-expanded={basketOpen}><span aria-hidden="true">🛒</span> Basket <b>{basketCount}</b></button>
    </header>
    <section className="shop-hero">
      <div className="shop-hero-copy"><p className="shop-eyebrow">THE MOGODITSHANE LIQUOR PILOT</p><h1>Your drinks shop,<br/><em>made simpler.</em></h1><p>Explore the liquor range, build a basket, and review a collection request concept for Sefalana Mogoditshane.</p><a className="shop-primary-link" href="#shop-products">Browse the range <span aria-hidden="true">↓</span></a></div>
      <div className="shop-hero-art"><img src="/images/sef2.jpeg" alt="Sefalana checkout counter and customer service area" loading="eager"/><div className="shop-hero-image-shade"/><div className="shop-hero-image-label"><span>SEFALANA MOGODITSHANE</span><strong>Shop your way.<br/>Collect with ease.</strong><small>LIQUOR DEPARTMENT PILOT CONCEPT</small></div><span className="shop-art-caption">PLAN · PICK · COLLECT</span></div>
    </section>
    <section className="shop-benefits" aria-label="How the concept works">
      <article><span>01</span><div><strong>Explore the range</strong><p>Browse sample beer, cider, wine, spirits and mixer categories.</p></div></article>
      <article><span>02</span><div><strong>Build your basket</strong><p>Choose pack sizes and review your illustrative subtotal.</p></div></article>
      <article><span>03</span><div><strong>Plan to collect</strong><p>Collection times are not live yet; the branch must approve the process first.</p></div></article>
    </section>
    <section className="shop-catalogue" id="shop-products">
      <div className="shop-section-heading"><div><p className="shop-eyebrow">THE LIQUOR RANGE</p><h2>What are you looking for?</h2><p>Browse the sample range by category. All products and prices are illustrative test data.</p></div><label className="shop-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search beer, wine, spirits…" aria-label="Search liquor products"/><kbd>SEARCH</kbd></label></div>
      <div className="shop-departments" aria-label="Filter by department"><button type="button" className={activeDepartment === "all" ? "is-active" : ""} onClick={() => setActiveDepartment("all")}>All items</button>{departments.map((department) => <button key={department.id} type="button" className={activeDepartment === department.id ? "is-active" : ""} onClick={() => setActiveDepartment(department.id)}>{department.name}</button>)}</div>
      {visibleProducts.length ? <div className="shop-product-grid">{visibleProducts.map((product, index) => {
        const department = departments.find((item) => item.id === product.departmentId);
        return <article className="shop-product-card" key={product.id}><div className={"shop-product-art shop-product-art-" + (index % 5)}><span className="shop-product-emoji" aria-hidden="true">{product.emoji || "🛒"}</span><span className="shop-product-tag">SAMPLE ITEM</span></div><div className="shop-product-copy"><p>{department?.name || "Liquor"}</p><h3>{product.name}</h3><span className="shop-product-unit">{product.unit}</span><p className="shop-product-description">{product.description}</p><div className="shop-product-buy"><strong>{formatBwp(product.price)}</strong><button type="button" onClick={() => updateQuantity(product, (basket[product.id] || 0) + 1)} aria-label={"Add " + product.name + " to basket"}>＋ Add</button></div>{(basket[product.id] || 0) > 0 && <p className="shop-added-note">{basket[product.id]} in your basket</p>}</div></article>;
      })}</div> : <div className="shop-empty"><span aria-hidden="true">🧺</span><h3>No matching items</h3><p>Try another search or choose a different department.</p><button type="button" onClick={() => { setSearch(""); setActiveDepartment("all"); }}>Clear filters</button></div>}
    </section>
    <section className={"shop-basket-panel" + (basketOpen ? " shop-basket-panel-open" : "")} aria-label="Your basket">
      <div className="shop-basket-head"><div><p className="shop-eyebrow">YOUR LIQUOR BASKET</p><h2>Basket <span>{basketCount}</span></h2></div><button type="button" onClick={() => setBasketOpen(!basketOpen)} aria-label={basketOpen ? "Close basket" : "Open basket"}>{basketOpen ? "×" : "↗"}</button></div>
      {basketLines.length === 0 ? <p className="shop-basket-empty">Your basket is empty. Add items from the sample liquor range to get started.</p> : <div className="shop-basket-lines">{basketLines.map((product) => <div className="shop-basket-line" key={product.id}><span className="shop-basket-line-emoji" aria-hidden="true">{product.emoji}</span><div className="shop-basket-line-name"><strong>{product.name}</strong><small>{formatBwp(product.price)} · {product.unit}</small></div><div className="shop-quantity"><button type="button" onClick={() => updateQuantity(product, (basket[product.id] || 0) - 1)} aria-label={"Remove one " + product.name}>−</button><span>{basket[product.id]}</span><button type="button" onClick={() => updateQuantity(product, (basket[product.id] || 0) + 1)} aria-label={"Add one " + product.name}>＋</button></div></div>)}</div>}
      <div className="shop-basket-total"><span>Sample subtotal</span><strong>{formatBwp(basketTotal)}</strong></div><p className="shop-basket-disclaimer">18+ only. Test prices and availability are synthetic; no live stock, age verification, order submission or collection booking is connected.</p>
      <button className="shop-checkout-button" type="button" disabled={basketCount === 0} onClick={() => window.alert("This is a test concept only. Your basket is saved in this browser; no order has been sent and no collection is booked. Branch approval, age checks and a secure order system are required before launch.")}>Review collection request <span aria-hidden="true">→</span></button>
    </section>
    <footer className="shop-footer"><div><strong>Shop & Collect</strong><p>A proposed liquor-department pilot. Not an official Sefalana service; all listings and prices are synthetic.</p></div><Link href="/admin" className="shop-admin-link">Staff access <span aria-hidden="true">↗</span></Link></footer>
  </main>;
}
