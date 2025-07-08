import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function HomePage() {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-surf.jpg"
            alt="Surfer at Six-Fours-les-Plages"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        
        <div className="relative container-custom h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-xl mb-8">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/en/products" className="btn btn-primary">
              {t('home.hero.shopNow')}
            </Link>
            <Link href="/en/about" className="btn bg-white text-ocean-blue hover:bg-gray-100">
              {t('home.hero.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('home.categories.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* These would be dynamically loaded from the API in a real implementation */}
          {[
            { name: t('home.categories.surfboards'), image: '/images/category-surfboards.jpg', slug: 'surfboards' },
            { name: t('home.categories.wetsuits'), image: '/images/category-wetsuits.jpg', slug: 'wetsuits' },
            { name: t('home.categories.accessories'), image: '/images/category-accessories.jpg', slug: 'accessories' },
          ].map((category) => (
            <Link 
              key={category.slug}
              href={`/en/products?category=${category.slug}`}
              className="group relative h-64 overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('home.featuredProducts.title')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* These would be dynamically loaded from the API in a real implementation */}
          {[1, 2, 3, 4].map((product) => (
            <div key={product} className="card group">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={`/images/product-${product}.jpg`}
                  alt={`Product ${product}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Product Name</h3>
                <p className="text-gray-500 text-sm mb-2">Category</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">€99.99</span>
                  <button className="btn btn-primary py-1 px-3 text-sm">
                    {t('home.featuredProducts.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/en/products" className="btn btn-secondary">
            {t('home.featuredProducts.viewAll')}
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-sandy-beige py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('home.about.title')}</h2>
              <p className="mb-6">{t('home.about.description')}</p>
              <Link href="/en/about" className="btn btn-primary">
                {t('home.about.learnMore')}
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src="/images/shop-exterior.jpg"
                alt="Nexpa Surf Shop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-custom">
        <div className="bg-ocean-blue text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.newsletter.title')}</h2>
          <p className="mb-6 max-w-xl mx-auto">{t('home.newsletter.description')}</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-sunset-orange"
            />
            <button type="submit" className="btn bg-sunset-orange hover:bg-opacity-90">
              {t('home.newsletter.subscribe')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
