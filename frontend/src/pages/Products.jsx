import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  async function getProducts() {
    const response = await fetch("http://127.0.0.1:8000/api/products/");
    const data = await response.json();
    setProducts(data);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.name} className="border p-4 rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover mb-4"
          />
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-700">{product.price} €</p>
          <Link
            to={`/payments/${product.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block text-center"
          >
            Ir a la pasarela de pago
          </Link>
        </div>
      ))}
    </div>
  );
}
