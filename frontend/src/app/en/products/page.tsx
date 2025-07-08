'use client';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const { t } = useTranslation('common');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real implementation, we would fetch from the API with filters
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?...`);
        // const data = await res.json();
        
        // Mock data for now
        const mockProducts = [
          {
            id: '1',
            title: 'Nexpa Classic Surfboard',
            price: 499,
            category: 'surfboards',
            images: ['/images/products/surfboard-1.jpg'],
            status: 'active'
          },
          {
            id: '2',
            title: 'Premium Neoprene Wetsuit',
            price: 299,
            category: 'wetsuits',
            images: ['/images/products/wetsuit-1.jpg'],
            status: 'active'
          },
          {
            id: '3',
            title: 'Pro Surf Leash',
            price: 49,
            category: 'accessories',
            images: ['/images/products/leash-1.jpg'],
            status: 'active'
          },
          {
            id: '4',
            title: 'Performance Surfboard',
            price: 649,
            category: 'surfboards',
            images: ['/images/products/surfboard-2.jpg'],
            status: 'active'
          },
          {
            id: '5',
            title: 'Shorty Wetsuit',
            price: 199,
            category: 'wetsuits',
            images: ['/images/products/wetsuit-2.jpg'],
            status: 'active'
          },
          {
            id: '6',
            title: 'Tropical Surf Wax',
            price: 12,
            category: 'accessories',
            images: ['/images/products/wax-1.jpg'],
            status: 'active'
          }
        ];
        
        setProducts(mockProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // Default to newest (by id for mock data)
    return b.id - a.id;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">{t('products.title', 'Products')}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-1/4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('products.filter')}</h2>
          
          {/* Category filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">{t('products.category')}</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  <label htmlFor={category} className="capitalize">
                    {t(`home.categories.${category}`, category)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">{t('products.price')}</h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              <span>€0</span>
              <span>€{priceRange[1]}</span>
            </div>
          </div>
        </div>
        
        {/* Product grid */}
        <div className="w-full md:w-3/4">
          {/* Sort controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2">{t('products.sort')}:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="border rounded p-1 dark:bg-slate-700 dark:border-slate-600"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue"></div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">{t('products.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                  <Link href={`/en/products/${product.id}`}>
                    <div className="relative h-64 w-full">
                      <Image
                        src={product.images[0] || '/images/placeholder.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/en/products/${product.id}`} className="text-lg font-medium hover:text-ocean-blue">
                      {product.title}
                    </Link>
                    <p className="text-xl font-semibold mt-2">€{product.price}</p>
                    <div className="mt-4">
                      <button className="bg-ocean-blue text-white px-4 py-2 rounded hover:bg-ocean-blue-dark transition w-full">
                        {t('products.addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
