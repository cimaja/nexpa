'use client';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const { t } = useTranslation('common');
  const params = useParams();
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In a real implementation, we would fetch from the API
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
        // const data = await res.json();
        
        // Mock data for now
        const mockProducts = {
          '1': {
            id: '1',
            title: 'Nexpa Classic Surfboard',
            price: 499,
            description: 'Our classic Nexpa surfboard is perfect for surfers of all levels. Made with high-quality materials and designed for optimal performance in various wave conditions.',
            specifications: {
              dimensions: '6\'6" x 19" x 2 1/2"',
              volume: '32.7L',
              finSetup: 'Thruster',
              construction: 'PU/Polyester',
              level: 'Beginner to intermediate'
            },
            category: 'surfboards',
            images: [
              '/images/products/surfboard-1.jpg',
              '/images/products/surfboard-1-alt.jpg',
              '/images/products/surfboard-1-alt2.jpg'
            ],
            status: 'active',
            inventory: 12
          },
          '2': {
            id: '2',
            title: 'Premium Neoprene Wetsuit',
            price: 299,
            description: 'Our premium neoprene wetsuit offers warmth and flexibility for your surf sessions. Made with eco-friendly neoprene and sealed seams for maximum comfort.',
            specifications: {
              thickness: '4/3mm',
              material: 'Eco-friendly neoprene',
              seams: 'Sealed seams',
              zipper: 'Chest zip',
              features: 'Flexibility panels, internal barrier'
            },
            category: 'wetsuits',
            images: [
              '/images/products/wetsuit-1.jpg',
              '/images/products/wetsuit-1-alt.jpg'
            ],
            status: 'active',
            inventory: 8
          }
        };
        
        const mockProduct = mockProducts[id];
        if (mockProduct) {
          setProduct(mockProduct);
          
          // Mock related products
          const mockRelated = Object.values(mockProducts)
            .filter(p => p.id !== id && p.category === mockProduct.category)
            .slice(0, 3);
          
          setRelatedProducts(mockRelated);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.inventory || 10)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.inventory || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    // In a real implementation, we would add the product to the cart
    // For now, just log to console
    console.log('Adding to cart:', { product, quantity });
    
    // Mock cart functionality with localStorage
    const cart = JSON.parse(localStorage.getItem('nexpa-cart') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity
      });
    }
    
    localStorage.setItem('nexpa-cart', JSON.stringify(cart));
    
    // Show confirmation (in a real app, this would be a toast notification)
    alert(t('cart.addedToCart', 'Product added to cart'));
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link href="/en/products" className="bg-ocean-blue text-white px-6 py-2 rounded hover:bg-ocean-blue-dark transition">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-4">
        <Link href="/en/products" className="text-ocean-blue hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to products
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product images */}
          <div>
            <div className="relative h-80 w-full mb-4">
              <Image
                src={product.images[activeImage] || '/images/placeholder.jpg'}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-16 w-16 border-2 ${activeImage === index ? 'border-ocean-blue' : 'border-gray-200'}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product details */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl font-semibold mb-4">€{product.price}</p>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="mr-2">Quantity:</span>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="bg-gray-200 dark:bg-slate-700 px-3 py-1 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-12 text-center border-t border-b dark:bg-slate-700 dark:border-slate-600"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="bg-gray-200 dark:bg-slate-700 px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <span className={`${product.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inventory > 0 ? t('products.inStock') : t('products.outOfStock')}
                </span>
              </div>
              
              <button
                onClick={addToCart}
                disabled={product.inventory <= 0}
                className={`w-full py-3 px-4 rounded font-medium ${
                  product.inventory > 0
                    ? 'bg-ocean-blue text-white hover:bg-ocean-blue-dark'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                } transition`}
              >
                {t('products.addToCart')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Product specifications */}
        <div className="border-t border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">{t('products.specifications')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium capitalize w-1/3">{key}:</span>
                <span className="w-2/3">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">{t('products.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedProducts.map(related => (
                <div key={related.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                  <Link href={`/en/products/${related.id}`}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={related.images[0] || '/images/placeholder.jpg'}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/en/products/${related.id}`} className="text-lg font-medium hover:text-ocean-blue">
                      {related.title}
                    </Link>
                    <p className="text-xl font-semibold mt-2">€{related.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
