'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ImageTile({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
    />
  );
}

const galleryImages = [
  {
    id: 1,
    name: 'Hotel Bayshu - The Hosteller leh | Leh',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/59/66/56/caption.jpg?w=1400&h=-1&s=1',
  },
  {
    id: 2,
    name: 'Andaman',
    image: 'https://images.unsplash.com/photo-1542429296407-20c78e10f375?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Hotel Greenfields | Manali',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/5a/ae/c9/a-roof-top-restaurant.jpg?w=1000&h=-1&s=1',
  },
  {
    id: 4,
    name: 'Pelling | Sikkim',
    image: 'https://images.unsplash.com/photo-1724600459474-e2a7bd45dede?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Kashmir',
    image: 'https://images.unsplash.com/photo-1715457573748-8e8a70b2c1be?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Udaan Olive Hotel & Spa | Sikkim',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/8a/59/aa/udaan-olive-hotel-spa.jpg?w=1000&h=-1&s=1',
  },
  {
    id: 7,
    name: 'Sikkim',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800&h=1200',
  },
  {
    id: 8,
    name: 'Udaan Olive Hotel & Spa | Sikkim',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/93/ab/67/udaan-olive-hotel-spa.jpg?w=1000&h=-1&s=1',
  },
  {
    id: 9,
    name: 'Dal Lake',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    name: 'Hotel Sultan Residency | Kashmir',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/48/b6/a7/capital-o-81811-hotel.jpg?w=600&h=-1&s=1',
  },
  {
    id: 11,
    name: 'Zanskar',
    image: 'https://images.unsplash.com/photo-1706021220078-2051d17b1576?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 12,
    name: 'Hotel Presidency Ladakh | Ladakh',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/df/9e/c2/hotel-presidency-ladakh.jpg?w=1400&h=-1&s=1',
  },
  {
    id: 13,
    name: 'Gangtok',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 14,
    name: 'The Presidency Ladakh | Ladakh',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/94/5a/80/caption.jpg?w=1400&h=-1&s=1',
  },
  {
    id: 15,
    name: 'The Presidency Ladakh | Ladakh',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/df/9e/c3/hotel-rooms-at-hotel.jpg?w=1400&h=-1&s=1',
  },
  {
    id: 16,
    name: 'Hotel Fotiya Jaisalmer | Rajasthan',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/71/6f/81/getlstd-property-photo.jpg?w=2000&h=-1&s=1',
  },
  {
    id: 17,
    name: 'Hotel Fotiya Jaisalmer | Rajasthan',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/89/90/8d/20181103-102013-largejpg.jpg?w=1000&h=-1&s=1',
  },
  {
    id: 18,
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 19,
    name: 'Daman and Diu',
    image: 'https://images.unsplash.com/photo-1572797751206-35424c13a703?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 20,
    name: 'The Grand Highness | Diu',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/23/0f/39/parking-is-behind-the.jpg?w=2000&h=-1&s=1',
  },
  {
    id: 21,
    name: 'The Grand Highness | Diu',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/0d/bf/6b/photo5jpg.jpg?w=1100&h=-1&s=1',
  },
  {
    id: 22,
    name: 'Sky Walk in Pelling | Sikkim',
    image: 'https://images.unsplash.com/photo-1724600457405-a7eeabcff6b5?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 23,
    name: 'Whoopers Boutique Kasol | Himachal Pradesh',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/6a/b6/6d/whoopers-boutique-kasol.jpg?w=1400&h=-1&s=1',
  },
  {
    id: 24,
    name: 'Hotel Backpackers Inn | Himachal Pradesh',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/aa/ec/57/pine-tree-cafe.jpg?w=1600&h=-1&s=1',
  },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <main className="bg-white pt-20 text-[#202124] lg:pt-24">
      <section className="mx-auto max-w-[1390px] px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        {/* Header Section based on About & Packages Design */}
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <h1 className="max-w-[650px] text-[32px] font-medium leading-[1.1] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]">
            Explore Our Travel <br /> Gallery
          </h1>
          <p className="max-w-[430px] pt-4 text-[14px] font-normal leading-[1.65] text-[#73777f] lg:justify-self-end lg:pt-12 lg:text-[16px]">
            Discover beautiful destinations, breathtaking landscapes, and unforgettable experiences captured by travelers worldwide.
          </p>
        </div>

        {/* Horizontal Masonry Gallery Grid (Pinterest Style) */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((colIndex) => (
            <div key={colIndex} className={`flex flex-col gap-6 ${colIndex >= 2 ? 'hidden md:flex' : ''} ${colIndex === 3 ? 'md:hidden lg:flex' : ''}`}>
              {galleryImages
                .filter((_, index) => index % 4 === colIndex)
                .map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`relative cursor-pointer overflow-hidden rounded-[15px] bg-[#f5f5f5] transition-all duration-300 hover:shadow-xl ${(index + colIndex) % 3 === 0 ? 'aspect-[3/4]' : (index + colIndex) % 2 === 0 ? 'aspect-[4/5]' : 'aspect-square'
                      }`}
                  >
                    <ImageTile
                      src={image.image}
                      alt={image.name}
                      className="transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <span className="text-[14px] font-medium text-white">{image.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-all duration-300 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 z-[101] rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.name}
              className="h-full w-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
              <h3 className="text-[20px] font-medium tracking-tight sm:text-[24px]">
                {selectedImage.name}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section (from About page) */}
      <section className="mx-auto max-w-[1511px] px-2 pb-3 mt-8">
        <div className="relative overflow-hidden rounded-[20px] bg-[#333]">
          <div className="absolute inset-0">
            <ImageTile
              src={galleryImages[0].image}
              alt="Travel CTA background"
              className="opacity-40"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative mx-auto flex min-h-[400px] max-w-[700px] flex-col items-center justify-center px-6 py-20 text-center text-white">
            <h2 className="text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[36px] lg:text-[40px]">
              Ready to Capture Your Own Moments?
            </h2>
            <p className="mt-6 max-w-[480px] text-[14px] font-normal leading-[1.6] text-white/85 lg:text-[16px]">
              Start planning your next adventure today and create memories that
              will last a lifetime.
            </p>
            <a
              href="/search"
              className="mt-10 rounded-full bg-[#1458df] px-10 py-4 text-[15px] font-bold text-white transition hover:bg-[#1049ba]"
            >
              Start Exploring
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
