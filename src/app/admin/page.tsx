"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type DemoDepartment, type DemoProduct, formatBwp, readDemoCatalogue, saveDemoCatalogue, seedDepartments, seedProducts } from "@/lib/demo-catalogue";
import "../shop.css";

const emptyProduct = { name: "", departmentId: "spirits", description: "", unit: "each", price: "0.00", emoji: "🛒" };

export default function AdminPage() {
  const [departments, setDepartments] = useState<DemoDepartment[]>(seedDepartments);
  const [products, setProducts] = useState<DemoProduct[]>(seedProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [departmentName, setDepartmentName] = useState("");
  const [notice, setNotice] = useState("Demo changes are saved only in this browser.");
  const [showUnavailable, setShowUnavailable] = useState(true);

  useEffect(() => { const value = readDemoCatalogue(); setDepartments(value.departments); setProducts(value.products); }, []);

  function persist(nextDepartments: DemoDepartment[], nextProducts: DemoProduct[]) {
    setDepartments(nextDepartments); setProducts(nextProducts);
    try { saveDemoCatalogue({ departments: nextDepartments, products: nextProducts }); setNotice("Saved in this browser. Not shared with other devices."); }
    catch { setNotice("Could not save to this browser. Check storage settings and try again."); }
  }
  function resetForm() { setEditingId(null); setProductForm({ ...emptyProduct, departmentId: departments[0]?.id || "" }); }
  function editProduct(product: DemoProduct) {
    setEditingId(product.id);
    setProductForm({ name: product.name, departmentId: product.departmentId, description: product.description, unit: product.unit, price: String(product.price), emoji: product.emoji });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(productForm.price);
    if (!productForm.name.trim() || !departments.some((item) => item.id === productForm.departmentId) || !Number.isFinite(price) || price < 0) { setNotice("Enter a product name, valid department and non-negative price."); return; }
    const current: DemoProduct = { id: editingId || "demo-custom-" + Date.now().toString(36), departmentId: productForm.departmentId, name: productForm.name.trim(), description: productForm.description.trim(), unit: productForm.unit.trim() || "each", price: Math.round(price * 100) / 100, emoji: productForm.emoji.trim() || "🛒", available: true };
    persist(departments, editingId ? products.map((item) => item.id === editingId ? { ...current, available: item.available } : item) : [...products, current]);
    resetForm();
  }
  function toggleAvailability(product: DemoProduct) { persist(departments, products.map((item) => item.id === product.id ? { ...item, available: !item.available } : item)); }
  function deleteProduct(product: DemoProduct) {
    if (!window.confirm("Delete " + product.name + " from this browser's demo catalogue?")) return;
    persist(departments, products.filter((item) => item.id !== product.id)); if (editingId === product.id) resetForm();
  }
  function addDepartment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const name = departmentName.trim(); if (!name) return;
    if (departments.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setNotice("A department with that name already exists."); return; }
    const next = [...departments, { id: "dept-" + Date.now().toString(36), name, description: "Added in demo management" }];
    persist(next, products); setDepartmentName(""); if (!productForm.departmentId) setProductForm({ ...productForm, departmentId: next[0].id });
  }
  function deleteDepartment(department: DemoDepartment) {
    if (products.some((product) => product.departmentId === department.id)) { setNotice("Move or delete this department's products before removing it."); return; }
    if (!window.confirm("Remove the empty department " + department.name + "?")) return;
    const next = departments.filter((item) => item.id !== department.id); persist(next, products);
    if (productForm.departmentId === department.id) setProductForm({ ...productForm, departmentId: next[0]?.id || "" });
  }

  return <main className="shop-admin-page">
    <header className="shop-admin-header"><Link href="/" className="shop-admin-back">← Back to liquor shop</Link><span className="shop-demo-pill">LOCAL DEMO WORKSPACE</span><h1>Catalogue<br/><em>management.</em></h1><p>Manage synthetic liquor categories and test product listings for the Mogoditshane pilot.</p></header>
    <div className="shop-admin-warning" role="note"><strong>Prototype only.</strong> This workspace has no staff authentication and stores changes in this browser only. Do not enter real business data or treat it as a live store admin system.</div>
    <div className="shop-admin-layout">
      <section className="shop-admin-panel">
        <div className="shop-admin-panel-heading"><span>01 / CATALOGUE</span><h2>{editingId ? "Edit product" : "Add a product"}</h2><p>All product names and BWP prices are synthetic test data.</p></div>
        <form className="shop-admin-form" onSubmit={saveProduct}>
          <label>Product name<input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required maxLength={100}/></label>
          <label>Department<select value={productForm.departmentId} onChange={(e) => setProductForm({ ...productForm, departmentId: e.target.value })} required>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
          <div className="shop-admin-form-row"><label>Price (BWP)<input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required/></label><label>Unit / pack size<input value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} required maxLength={60}/></label></div>
          <div className="shop-admin-form-row"><label>Card symbol (demo)<input value={productForm.emoji} onChange={(e) => setProductForm({ ...productForm, emoji: e.target.value })} maxLength={8}/></label><label>Description<input value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} maxLength={180}/></label></div>
          <div className="shop-admin-form-actions"><button className="shop-admin-save" type="submit">{editingId ? "Save product" : "Add product"} <span>→</span></button>{editingId && <button className="shop-admin-cancel" type="button" onClick={resetForm}>Cancel edit</button>}</div>
        </form>
        <div className="shop-admin-divider"/>
        <div className="shop-admin-panel-heading"><span>02 / DEPARTMENTS</span><h2>Organise the shop</h2></div>
        <form className="shop-department-form" onSubmit={addDepartment}><label className="sr-only" htmlFor="new-department">New department name</label><input id="new-department" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} placeholder="e.g. Frozen foods" maxLength={60} required/><button type="submit">Add department +</button></form>
        <ul className="shop-admin-department-list">{departments.map((department) => <li key={department.id}><span><strong>{department.name}</strong><small>{products.filter((item) => item.departmentId === department.id).length} products</small></span><button type="button" onClick={() => deleteDepartment(department)} disabled={products.some((item) => item.departmentId === department.id)} aria-label={"Remove empty department " + department.name}>Remove</button></li>)}</ul>
      </section>
      <section className="shop-admin-panel shop-admin-inventory">
        <div className="shop-admin-panel-heading"><span>03 / PRODUCT LIST</span><h2>Products <small>{products.length}</small></h2><p>Changes appear in the customer view in this same browser after refresh.</p></div>
        <label className="shop-admin-toggle"><input type="checkbox" checked={showUnavailable} onChange={(e) => setShowUnavailable(e.target.checked)}/> Show hidden products</label>
        <div className="shop-admin-product-list">{products.filter((product) => showUnavailable || product.available).map((product) => <article className="shop-admin-product-row" key={product.id}><span className="shop-admin-product-emoji" aria-hidden="true">{product.emoji}</span><div className="shop-admin-product-info"><strong>{product.name}</strong><small>{departments.find((department) => department.id === product.departmentId)?.name || "Unassigned"} · {product.unit}</small><b>{formatBwp(product.price)}</b></div><div className="shop-admin-product-actions"><button type="button" onClick={() => editProduct(product)}>Edit</button><button type="button" onClick={() => toggleAvailability(product)}>{product.available ? "Hide" : "Publish"}</button><button type="button" onClick={() => deleteProduct(product)} aria-label={"Delete " + product.name}>Delete</button></div></article>)}</div>
      </section>
    </div>
    <p className="shop-admin-status" role="status">{notice}</p>
    <footer className="shop-footer shop-admin-footer"><div><strong>Shop & Collect · Development checkpoint</strong><p>Next: secure shared persistence, approved catalogue data and protected staff access.</p></div><Link href="/">Preview customer shop ↗</Link></footer>
  </main>;
}
