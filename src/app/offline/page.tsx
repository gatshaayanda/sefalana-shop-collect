import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="shop-page">
      <div className="shop-demo-banner"><span>OFFLINE</span> Some information on this device may be out of date.</div>
      <header className="shop-header">
        <Link className="shop-brand" href="/"><span className="shop-brand-mark" aria-hidden="true">S</span><span><strong>Shop & Collect</strong><small>MOGODITSHANE · PILOT CONCEPT</small></span></Link>
      </header>
      <section className="shop-hero">
        <div className="shop-hero-copy"><p className="shop-eyebrow">CONNECTION NEEDED</p><h1>Your list can<br/><em>wait for you.</em></h1><p>You may be able to view catalogue content already loaded on this device. Prices and availability can be out of date. No order has been sent from this offline screen.</p><Link className="shop-primary-link" href="/">Return to the shop <span aria-hidden="true">↗</span></Link></div>
        <div className="shop-hero-art" aria-hidden="true"><span className="shop-art-sun"/><span className="shop-art-bag">🛍️</span><span className="shop-art-fruit shop-art-fruit-one">🍊</span><span className="shop-art-fruit shop-art-fruit-two">🥬</span><span className="shop-art-caption">RECONNECT TO CONTINUE</span></div>
      </section>
    </main>
  );
}
