import { useEffect, useState } from 'react';
import type { Seller, Product, ProductFormData } from '../types';

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  category: '',
  stock: '',
  seller: '',
};

const cellStyle = { border: '1px solid #ccc', padding: 8 };

const Market = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
    fetch('/api/users')
      .then((res) => res.json())
      .then((data: Seller[]) => setSellers(data))
      .catch(() => setSellers([]));
  }, []);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl ?? '',
      category: product.category,
      stock: String(product.stock),
      seller: product.seller._id,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const body = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      category: form.category,
      stock: Number(form.stock),
      seller: form.seller,
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
      })
      .then(() => {
        handleCancelEdit();
        loadProducts();
      })
      .catch((err) => setFormError(err.message));
  };

  const handleDelete = (id: string) => {
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete product');
        loadProducts();
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Market Place</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gap: 8, maxWidth: 500 }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        {formError && <div style={{ color: 'red' }}>{formError}</div>}

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => handleChange('price', e.target.value)}
          min={0}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          min={0}
          required
        />
        <input
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
        />
        <select
          value={form.seller}
          onChange={(e) => handleChange('seller', e.target.value)}
          required
        >
          <option value="" disabled>Select a seller</option>
          {sellers.map((s) => (
            <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{editingId ? 'Save Changes' : 'Add Product'}</button>
          {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Category</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Stock</th>
            <th style={cellStyle}>Seller</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={cellStyle}>{product.name}</td>
              <td style={cellStyle}>{product.category}</td>
              <td style={cellStyle}>₹{product.price}</td>
              <td style={cellStyle}>{product.stock}</td>
              <td style={cellStyle}>{product.seller?.name ?? 'Unknown'}</td>
              <td style={cellStyle}>
                <button onClick={() => handleEdit(product)}>Edit</button>{' '}
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
