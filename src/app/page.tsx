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
  const [toastMessage, setToastMessage] = useState("");
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  useEffect(() => {
    const syncCatalogue = () => { const value = readDemoCatalogue(); setDepartments(value.departments); setProducts(value.products); };
    const syncBasket = () => { try { setBasket(JSON.parse(localStorage.getItem(BASKET_STORAGE_KEY) || "{}") as Basket); } catch { setBasket({}); } };
    syncCatalogue(); syncBasket();
    window.addEventListener("storage", syncCatalogue); window.addEventListener("storage", syncBasket);
    return () => { window.removeEventListener("storage", syncCatalogue); window.removeEventListener("storage", syncBasket); };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const departmentMatch = activeDepartment === "all" || product.departmentId === activeDepartment;
    const query = search.trim().toLowerCase();
    const searchMatch = !query || [product.name, product.description, product.unit].some((field) => field.toLowerCase().includes(query));
    return departmentMatch && searchMatch && product.available;
  }), [products, activeDepartment, search]);
  const basketLines = products.filter((product) => (basket[product.id] || 0) > 0);
  const basketCount = basketLines.reduce((sum, product) => sum + basket[product.id], 0);
  const basketTotal = basketLines.reduce((sum, product) => sum + product.price * basket[product.id], 0);

  function updateQuantity(product: DemoProduct, next: number, message?: string) {
    const updated = { ...basket };
    if (next <= 0) delete updated[product.id]; else updated[product.id] = Math.min(99, next);
    setBasket(updated);
    try { localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(updated)); } catch {}
    setToastMessage(message || (next > (basket[product.id] || 0) ? "Basket updated" : "Basket updated"));
  }

  function openBasket() {
    setBasketOpen(true);
    window.setTimeout(() => document.getElementById("shop-basket")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  function addProduct(product: DemoProduct) {
    updateQuantity(product, (basket[product.id] || 0) + 1, `${product.name} added to basket`);
    setAddingProduct(product.id);
    window.setTimeout(() => setAddingProduct((current) => current === product.id ? null : current), 520);
  }

  return <main className="shop-page">
    <div className="shop-demo-banner"><span>CONCEPT PREVIEW</span> 18+ only · Sample catalogue and prices only · not live stock or an official ordering service.</div>
    <header className="shop-header">
      <Link className="shop-brand" href="/" aria-label="Shop & Collect home"><span className="shop-brand-mark" aria-hidden="true">S</span><span><strong>Shop & Collect</strong><small>MOGODITSHANE · PILOT CONCEPT</small></span></Link>
      <button className="shop-basket-button" type="button" onClick={openBasket} aria-label={`View basket with ${basketCount} items`}><span aria-hidden="true">🛒</span><span>View basket</span><b>{basketCount}</b><span className="shop-basket-chevron" aria-hidden="true">↓</span></button>
    </header>

    <section className="shop-hero shop-hero-compact">
      <div className="shop-hero-copy"><p className="shop-eyebrow">SEFALANA MOGODITSHANE · LIQUOR DEPARTMENT</p><h1>Find your<br/><em>favourites.</em></h1><p>Browse the sample range, add items to your basket, and review your collection request concept.</p><a className="shop-primary-link" href="#shop-products">Shop the range <span aria-hidden="true">↓</span></a></div>
      <div className="shop-hero-art"><img src="/images/sef2.jpeg" alt="Sefalana checkout counter and customer service area" loading="eager"/><div className="shop-hero-image-shade"/><div className="shop-hero-image-label"><span>SEFALANA MOGODITSHANE</span><strong>Shop your way.<br/>Collect with ease.</strong><small>LIQUOR DEPARTMENT PILOT CONCEPT</small></div><span className="shop-art-caption">PLAN · PICK · COLLECT</span></div>
    </section>

    <section className="shop-catalogue shop-catalogue-primary" id="shop-products">
      <div className="shop-section-heading"><div><p className="shop-eyebrow">THE SAMPLE RANGE</p><h2>What are you looking for?</h2><p>Sample products and prices are for demonstration only.</p></div><label className="shop-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search beer, wine, spirits…" aria-label="Search liquor products"/><kbd>SEARCH</kbd></label></div>
      <div className="shop-departments" aria-label="Filter by department"><button type="button" className={activeDepartment === "all" ? "is-active" : ""} onClick={() => setActiveDepartment("all")}>All items</button>{departments.map((department) => <button key={department.id} type="button" className={activeDepartment === department.id ? "is-active" : ""} onClick={() => setActiveDepartment(department.id)}>{department.name}</button>)}</div>
      {visibleProducts.length ? <div className="shop-product-grid">{visibleProducts.map((product, index) => {
        const department = departments.find((item) => item.id === product.departmentId);
        return <article className="shop-product-card" key={product.id}><div className={"shop-product-art shop-product-art-" + (index % 5)}><span className="shop-product-emoji" aria-hidden="true">{product.emoji || "🛒"}</span><span className="shop-product-tag">SAMPLE ITEM</span></div><div className="shop-product-copy"><p>{department?.name || "Liquor"}</p><h3>{product.name}</h3><span className="shop-product-unit">{product.unit}</span><p className="shop-product-description">{product.description}</p><div className="shop-product-buy"><strong>{formatBwp(product.price)}</strong><button className={addingProduct === product.id ? "is-adding" : ""} type="button" onClick={() => addProduct(product)} aria-label={"Add " + product.name + " to basket"}>{addingProduct === product.id ? <><span className="shop-add-spinner" aria-hidden="true"/> Added</> : <>＋ Add</>}</button></div>{(basket[product.id] || 0) > 0 && <p className="shop-added-note">{basket[product.id]} in your basket</p>}</div></article>;
      })}</div> : <div className="shop-empty"><span aria-hidden="true">🧺</span><h3>No matching items</h3><p>Try another search or choose a different department.</p><button type="button" onClick={() => { setSearch(""); setActiveDepartment("all"); }}>Clear filters</button></div>}
    </section>

    <section className={"shop-basket-panel" + (basketOpen ? " shop-basket-panel-open" : "")} id="shop-basket" aria-label="Your basket">
      <div className="shop-basket-head"><div><p className="shop-eyebrow">YOUR BASKET</p><h2>Review your items <span>{basketCount}</span></h2><p className="shop-basket-hint">Tap an item’s + or − control to change its quantity.</p></div><button className="shop-basket-toggle" type="button" onClick={() => setBasketOpen(!basketOpen)} aria-expanded={basketOpen} aria-label={basketOpen ? "Collapse basket items" : "Expand basket items"}>{basketOpen ? "Hide items ↑" : "Show items ↓"}</button></div>
      {basketLines.length === 0 ? <p className="shop-basket-empty">Your basket is empty. Add items from the sample range to get started.</p> : <div className="shop-basket-lines">{basketLines.map((product) => <div className="shop-basket-line" key={product.id}><span className="shop-basket-line-emoji" aria-hidden="true">{product.emoji}</span><div className="shop-basket-line-name"><strong>{product.name}</strong><small>{formatBwp(product.price)} · {product.unit}</small></div><div className="shop-quantity"><button type="button" onClick={() => updateQuantity(product, (basket[product.id] || 0) - 1, (basket[product.id] || 0) === 1 ? `${product.name} removed` : "Basket quantity updated")} aria-label={"Remove one " + product.name}>−</button><span>{basket[product.id]}</span><button type="button" onClick={() => updateQuantity(product, (basket[product.id] || 0) + 1, "Basket quantity updated")} aria-label={"Add one " + product.name}>＋</button></div></div>)}</div>}
      <div className="shop-basket-total"><span>Sample subtotal</span><strong>{formatBwp(basketTotal)}</strong></div><p className="shop-basket-disclaimer">18+ only. Sample prices and availability are illustrative; no live stock, age verification, order submission or collection booking is connected.</p>
      <button className="shop-checkout-button" type="button" disabled={basketCount === 0} onClick={() => window.alert("This is a test concept only. Your basket is saved in this browser; no order has been sent and no collection is booked. Branch approval, age checks and a secure order system are required before launch.")}>Review collection request <span aria-hidden="true">→</span></button>
    </section>

    <section className="shop-photo-story" aria-label="Sefalana store reference photography">
      <div className="shop-photo-story-heading"><p className="shop-eyebrow">INSPIRED BY YOUR STORE</p><h2>Built around the real<br/><em>shopping experience.</em></h2><p>Store reference photos supplied for this pilot concept. Product listings and prices remain illustrative until the branch approves the catalogue.</p></div>
      <figure><img src="/images/sef1.jpeg" alt="Sefalana beverage display with stacked wine cartons" loading="lazy"/><figcaption>Browse the department</figcaption></figure>
      <figure><img src="/images/sef3.jpeg" alt="Sefalana checkout area and main store aisle" loading="lazy"/><figcaption>Plan a smoother collection</figcaption></figure>
    </section>
    <section className="shop-benefits" aria-label="How the concept works"><article><span>01</span><div><strong>Explore the range</strong><p>Browse sample beer, cider, wine, spirits and mixer categories.</p></div></article><article><span>02</span><div><strong>Build your basket</strong><p>Choose pack sizes and review your illustrative subtotal.</p></div></article><article><span>03</span><div><strong>Plan to collect</strong><p>Collection times are not live yet; the branch must approve the process first.</p></div></article></section>

    {basketCount > 0 && <button className="shop-mobile-basket-summary" type="button" onClick={openBasket} aria-label={`Review basket, ${basketCount} items, sample subtotal ${formatBwp(basketTotal)}`}><span className="shop-mobile-basket-icon" aria-hidden="true">🛒<b>{basketCount}</b></span><span className="shop-mobile-basket-copy"><strong>{basketCount} {basketCount === 1 ? "item" : "items"} in basket</strong><small>Tap to review basket</small></span><span className="shop-mobile-basket-total">{formatBwp(basketTotal)} <span aria-hidden="true">→</span></span></button>}
    <div className={"shop-toast" + (toastMessage ? " shop-toast-visible" : "")} role="status" aria-live="polite"><span aria-hidden="true">✓</span>{toastMessage}</div>

    <footer className="shop-footer"><div><strong>Shop & Collect</strong><p>A proposed liquor-department pilot. Not an official Sefalana service; all listings and prices are synthetic.</p></div><Link href="/admin" className="shop-admin-link">Staff access <span aria-hidden="true">↗</span></Link></footer>
  </main>;
}
