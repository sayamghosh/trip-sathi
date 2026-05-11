/* eslint-disable @next/next/no-img-element */
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "Tripsathi made our family trip to Munnar absolutely seamless. The direct booking with local guides saved us so much time and money.",
    name: "Aarav Mehta",
    title: "Family Traveler, Mumbai",
    image:
      "https://plus.unsplash.com/premium_photo-1754431018954-034d17a415df?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    text: "I loved how easy it was to compare different houseboat packages in Alleppey. Honest reviews really helped us pick the best one!",
    name: "Anantha Krishnan",
    title: "Solo Explorer, Kerala",
    image:
      "https://images.unsplash.com/photo-1723957846840-8936850ae1b1?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    text: "The itinerary for our Spiti Valley bike trip was perfect. Having local support through the platform made all the difference in that terrain.",
    name: "Arjun Singh",
    title: "Adventure Enthusiast, Punjab",
    image:
      "https://images.unsplash.com/photo-1651342665726-a66683c231cc?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    text: "Finally a platform that understands Indian travelers! From luxury stays in Udaipur to budget hostels in Goa, everything is in one place.",
    name: "Priya Sharma",
    title: "Lifestyle Blogger, Delhi",
    image:
      "https://images.unsplash.com/photo-1651594337985-fc52387c8036?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    text: "Booked a heritage tour in Jaipur through Tripsathi. The guide was knowledgeable and the experience was truly authentic.",
    name: "Mohammad Rehan",
    title: "History Buff, Lucknow",
    image:
      "https://images.unsplash.com/photo-1619633058818-704df86428cd?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    text: "The transparency in pricing is what I liked most. No hidden charges and excellent customer support for our North East journey.",
    name: "Ananya Das",
    title: "Nature Lover, Kolkata",
    image:
      "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=150&h=150&fit=crop&q=80",
  },
  {
    id: 7,
    text: "The transparency in pricing is what I liked most. No hidden charges and excellent customer support for our North East journey.",
    name: "Harbaksh Singh",
    title: "Adventure Enthusiast, Amritsar",
    image:
      "https://images.unsplash.com/photo-1727476196820-053897a37072?w=1000&auto=format&fit=crop&q=80",
  },
];

const destinations = [
  {
    id: 1,
    name: "Munnar",
    image:
      "https://images.unsplash.com/photo-1591089101324-2280d9260000?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Andaman",
    image:
      "https://images.unsplash.com/photo-1574616343659-f67de01e2681?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Rajasthan",
    image:
      "https://images.unsplash.com/flagged/photo-1577605047476-202951cec757?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: 4,
    name: "Punjab",
    image:
      "https://images.unsplash.com/photo-1716541792733-1e90c165c411?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Kashmir",
    image:
      "https://images.unsplash.com/photo-1637558929744-024c00b06075?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Kerala",
    image:
      "https://images.unsplash.com/photo-1627370778723-4d26700cd972?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Sikkim",
    image:
      "https://images.unsplash.com/photo-1707423380844-86eedf4514c0?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Sikkim",
    image:
      "https://images.unsplash.com/photo-1704991754173-46b72b237e8e?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Sikkim",
    image:
      "https://images.unsplash.com/photo-1627629288153-fbdf4de383e9?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Sikkim",
    image:
      "https://images.unsplash.com/photo-1606857090627-27ca46667290?w=1000&auto=format&fit=crop&q=80",
  },
];

const ourJourney = [
  {
    image:
      "https://images.unsplash.com/photo-1609115451953-fb40593c0c20?w=1000&auto=format&fit=crop&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1611051489439-99f01230788d?w=1000&auto=format&fit=crop&q=80",
  },
];

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

export default function AboutPage() {
  return (
    <main className="bg-white pt-20 text-[#202124] lg:pt-24">
      {/* Hero Section */}
      <section className="mx-auto max-w-[1390px] px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <h1 className="text-[32px] font-medium leading-[1.1] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]">
            Built to Make <br /> Every Trip Easier
          </h1>
          <p className="max-w-[420px] pt-4 text-[14px] font-normal leading-[1.6] text-[#73777f] lg:justify-self-end lg:pt-12">
            A trusted travel platform for discovering places, comparing honest
            deals, and booking stays and activities.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {destinations.slice(0, 5).map((dest) => (
            <div
              key={dest.id}
              className="aspect-square overflow-hidden rounded-[10px] bg-[#f5f5f5]"
            >
              <ImageTile src={dest.image} alt={dest.name} />
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="mx-auto max-w-[1480px] px-2 pb-2">
        <div className="overflow-hidden rounded-[20px] bg-[#f6f6f6] py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-[1390px] px-6 sm:px-10 lg:px-12">
            <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px] lg:text-[40px]">
                  Our Journey to Smarter, <br /> Simpler Travel
                </h2>
                <div className="mt-12 max-w-[580px] space-y-6 text-[14px] font-medium leading-[1.65] text-[#565b63]">
                  <p>
                    Tripsathi started with a simple belief: planning a trip
                    shouldn&apos;t feel complicated. Our founders were tired of
                    switching between tabs, unclear prices, and reviews they
                    couldn&apos;t trust, and imagined one place to explore,
                    compare, and book with ease.
                  </p>
                  <p>
                    Today, Tripsathi brings that idea to life by connecting
                    travelers with trusted stays and experiences worldwide. With
                    transparent pricing and real reviews, we help you plan
                    anything from quick getaways to once-in-a-lifetime trips
                    without the stress.
                  </p>
                </div>

                <div className="mt-20 flex gap-20">
                  <div>
                    <p className="text-[28px] font-medium leading-none sm:text-[36px]">
                      120+
                    </p>
                    <p className="mt-4 text-[12px] font-medium text-[#73777f] lg:text-[14px]">
                      Destination Covered
                    </p>
                  </div>
                  <div>
                    <p className="text-[28px] font-medium leading-none sm:text-[36px]">
                      7,000+
                    </p>
                    <p className="mt-4 text-[12px] font-medium text-[#73777f] lg:text-[14px]">
                      Family&apos;s Experience
                    </p>
                  </div>
                </div>
              </div>

              <div className="aspect-[1.2/1] overflow-hidden rounded-[15px] bg-[#e5e5e5]">
                <ImageTile
                  src={ourJourney[0].image}
                  alt={ourJourney[0].image}
                />
              </div>
            </div>

            <div className="mt-24 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
              {destinations.slice(5, 10).map((dest) => (
                <div
                  key={dest.id}
                  className="aspect-square overflow-hidden rounded-[10px] bg-[#e5e5e5]"
                >
                  <ImageTile src={dest.image} alt={dest.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Big Picture Section */}
      <section className="mx-auto max-w-[1390px] px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <h2 className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px] lg:text-[40px]">
            Our Big Picture and <br /> Daily Focus
          </h2>
          <p className="max-w-[420px] pt-4 text-[14px] font-normal leading-[1.6] text-[#73777f] lg:justify-self-end lg:pt-12">
            Every feature we build supports one goal: helping you travel better,
            not busier.
          </p>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div className="divide-y divide-[#e5e7eb]">
            <div className="pb-12">
              <h3 className="text-[16px] font-bold text-[#1a1c1f] lg:text-[20px]">
                Vision
              </h3>
              <p className="mt-6 max-w-[500px] text-[14px] font-normal leading-[1.7] text-[#565b63] lg:text-[16px]">
                To become the most trusted all-in-one hospitality platform where
                every traveler can explore, compare, and book with complete
                confidence.
              </p>
            </div>
            <div className="pt-12">
              <h3 className="text-[16px] font-bold text-[#1a1c1f] lg:text-[20px]">
                Mission
              </h3>
              <p className="mt-6 max-w-[500px] text-[14px] font-normal leading-[1.7] text-[#565b63] lg:text-[16px]">
                To simplify travel planning by bringing destinations, prices,
                reviews, and bookings together in one seamless experience. So,
                travelers around the world can focus on enjoying the journey,
                not fighting the process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            <div className="aspect-[4/5] overflow-hidden rounded-[15px] bg-[#f5f5f5]">
              <ImageTile
                src={destinations[5].image}
                alt={destinations[5].name}
              />
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-[15px] bg-[#f5f5f5]">
              <ImageTile
                src={destinations[6].image}
                alt={destinations[6].name}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="mx-auto max-w-[1390px] px-6 py-24 text-center sm:px-10 lg:px-12">
        <h2 className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px] lg:text-[40px]">
          Follow Our Journeys Around the World
        </h2>
        <p className="mx-auto mt-6 max-w-[520px] text-[14px] font-normal text-[#73777f] lg:text-[16px]">
          Discover travel inspiration, behind-the-scenes moments, and real
          Tripsathi traveler stories.
        </p>

        {/* Socaial Links */}
        {/* <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Facebook", "Instagram", "X", "YouTube"].map((social) => (
            <a
              key={social}
              href="#"
              className="rounded-full bg-[#f1f3f5] px-6 py-3 text-[13px] font-bold text-[#495057] transition hover:bg-[#e9ecef]"
            >
              {social}
            </a>
          ))}
        </div> */}

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="aspect-square overflow-hidden rounded-[10px] bg-[#f5f5f5]"
            >
              <ImageTile src={dest.image} alt={dest.name} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24 sm:px-10 lg:px-12">
        <h2 className="mx-auto max-w-[600px] px-6 text-center text-[32px] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[40px] lg:text-[48px]">
          Words of praise from others about our presence.
        </h2>

        <div className="relative mt-16 flex flex-col gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          {/* Row 1: Scrolls Left */}
          <div className="group flex w-full overflow-hidden">
            {[...Array(2)].map((_, i) => (
              <div
                key={`row1-${i}`}
                className="flex shrink-0 animate-marquee gap-6 pr-6 group-hover:[animation-play-state:paused]"
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={`r1-${i}-${testimonial.id}`}
                    className="w-[300px] shrink-0 rounded-[20px] bg-[#f8f9fa] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sm:w-[380px]"
                  >
                    <Quote
                      className="h-8 w-8 text-[#1458df] opacity-80"
                      fill="currentColor"
                    />
                    <p className="mt-6 text-[15px] font-medium leading-[1.6] text-[#202124]">
                      {testimonial.text}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-[14px] font-bold text-[#202124]">
                          {testimonial.name}
                        </h4>
                        <p className="mt-0.5 text-[12px] font-medium text-[#73777f]">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row 2: Scrolls Right */}
          <div className="group flex w-full overflow-hidden">
            {[...Array(2)].map((_, i) => (
              <div
                key={`row2-${i}`}
                className="flex shrink-0 animate-marquee-reverse gap-6 pr-6 group-hover:[animation-play-state:paused]"
              >
                {[...testimonials].reverse().map((testimonial) => (
                  <div
                    key={`r2-${i}-${testimonial.id}`}
                    className="w-[300px] shrink-0 rounded-[20px] bg-[#f8f9fa] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sm:w-[380px]"
                  >
                    <Quote
                      className="h-8 w-8 text-[#1458df] opacity-80"
                      fill="currentColor"
                    />
                    <p className="mt-6 text-[15px] font-medium leading-[1.6] text-[#202124]">
                      {testimonial.text}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-[14px] font-bold text-[#202124]">
                          {testimonial.name}
                        </h4>
                        <p className="mt-0.5 text-[12px] font-medium text-[#73777f]">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-[1511px] px-2 pb-3 mt-8">
        <div className="relative overflow-hidden rounded-[20px] bg-[#333]">
          <div className="absolute inset-0">
            <ImageTile
              src={destinations[0].image}
              alt="Travel CTA background"
              className="opacity-40"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative mx-auto flex min-h-[400px] max-w-[700px] flex-col items-center justify-center px-6 py-20 text-center text-white">
            <h2 className="text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[36px] lg:text-[40px]">
              Ready to Plan Your Next Trip with <br /> Trip Sathi?
            </h2>
            <p className="mt-6 max-w-[480px] text-[14px] font-normal leading-[1.6] text-white/85 lg:text-[16px]">
              Explore destinations, compare real prices and reviews, and book
              everything in one place.
            </p>
            <a
              href="/search"
              className="mt-10 rounded-full bg-[#1458df] px-10 py-4 text-[15px] font-bold text-white transition hover:bg-[#1049ba]"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
