import { useState } from 'react';

export default function Testimonials() {
  const [selectedImage, setSelectedImage] = useState(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      role: "Beneficiary",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      quote: "The support I received changed my life. My volunteer helped me gain confidence and skills I never thought possible.",
      category: "success"
    },
    {
      id: 2,
      name: "John D.",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      quote: "Volunteering here has been incredibly rewarding. Knowing I'm making a real difference in someone's life means everything.",
      category: "volunteer"
    },
    {
      id: 3,
      name: "Maria L.",
      role: "Beneficiary",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
      quote: "I received essential supplies and emotional support when I needed it most. Forever grateful!",
      category: "goods"
    },
    {
      id: 4,
      name: "David K.",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop",
      quote: "The matching system connected me with someone who truly needed my skills. It's a perfect fit!",
      category: "volunteer"
    },
    {
      id: 5,
      name: "Emma R.",
      role: "Beneficiary",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      quote: "The goods I received helped me restart my life. Thank you to all the wonderful volunteers!",
      category: "goods"
    },
    {
      id: 6,
      name: "James T.",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      quote: "Being part of this community has enriched my life more than I ever imagined.",
      category: "volunteer"
    }
  ];

  const impactImages = [
    {
      id: 'g1',
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
      alt: "Food packages being distributed",
      caption: "Monthly food distribution"
    },
    {
      id: 'g2',
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
      alt: "Clothing donation",
      caption: "Clothing drive success"
    },
    {
      id: 'g3',
      src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop",
      alt: "Volunteers and beneficiaries together",
      caption: "Community gathering"
    },
    {
      id: 'g4',
      src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop",
      alt: "Educational supplies",
      caption: "School supplies distribution"
    },
    {
      id: 'g5',
      src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
      alt: "Volunteers helping",
      caption: "Volunteers making a difference"
    },
    {
      id: 'g6',
      src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop",
      alt: "Happy beneficiary",
      caption: "Smiles that matter"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stories of Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from the volunteers and beneficiaries who are making a difference in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-600">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover mix-blend-overlay opacity-90"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-purple-500 -mt-12 bg-white">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-purple-600 font-semibold">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Gallery Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Pictures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the joy and support we've brought to our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-lg">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-purple-200">Successful Matches</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1,000+</div>
              <div className="text-purple-200">Active Volunteers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">2,500+</div>
              <div className="text-purple-200">Lives Impacted</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-purple-200">Communities Served</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full">
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-center text-white">
                <p className="text-xl font-semibold">{selectedImage.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
