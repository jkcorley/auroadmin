"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AddProductDialog from "./AddProductDialog"

export default function LaundryProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("laundry_care_products")
        .select("api_product_id, product_title, brand, price, description_snippet, main_image_url, product_page_url")
      if (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } else {
        setProducts(data || [])
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Laundry Products</h2>
        <AddProductDialog />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, idx) => (
          <li key={`${product.api_product_id || product.product_page_url || 'product'}-${idx}`} className="border p-4 rounded shadow-sm bg-white flex flex-col">
            {product.main_image_url && (
              <img src={product.main_image_url} alt={product.product_title} className="mb-2 w-full h-40 object-contain rounded" />
            )}
            <strong className="text-lg">{product.product_title}</strong>
            <div className="text-sm text-muted-foreground mb-1">{product.brand}</div>
            <div className="text-sm mb-2">{product.description_snippet}</div>
            <div className="font-semibold text-primary mb-2">{product.price}</div>
            {product.product_page_url && (
              <a href={product.product_page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-auto">View Product</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
} 