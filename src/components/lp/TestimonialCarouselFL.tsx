import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

interface FLDeal {
  name: string;
  city: string;
  type: string;
  outcome: string;
  closeDays: string;
  ltv: string;
  quote: string;
}

const flDeals: FLDeal[] = [
  {
    name: 'Marcus T.',
    city: 'Tampa, FL',
    type: 'SFR Duplex',
    outcome: 'Declined elsewhere, closed at 75% LTV',
    closeDays: '26 Days',
    ltv: '75%',
    quote: "First lender walked away on my Tampa duplex two weeks in. John actually got on the phone, walked through what went wrong, and matched the file to a lender whose overlays fit. Closed in 26 days at 75% LTV. Felt like working with someone who'd seen this scenario a hundred times.",
  },
  {
    name: 'Lauren K.',
    city: 'Kissimmee, FL',
    type: 'Disney-Area STR',
    outcome: 'Disney STR financed on AirDNA, no rental history',
    closeDays: '24 Days',
    ltv: '75%',
    quote: "Bought a 5-bedroom pool home in Four Corners with zero rental history. Most lenders ghosted me. John walked me through what Osceola County permits for STR up front, then matched me with a lender that took AirDNA at 75% factor. Closed in 24 days. First STR in the books.",
  },
  {
    name: 'Carlos V.',
    city: 'Cape Coral, FL',
    type: 'Foreign National',
    outcome: 'Canadian buyer, no US credit, canal-front SFR',
    closeDays: '28 Days',
    ltv: '70%',
    quote: "I live in Toronto and own two FL rentals. Getting a third was supposed to be impossible. No SSN, no US credit history. John walked me through Foreign National DSCR, used my Canadian credit reference letter, and closed the canal-front at $390K.",
  },
  {
    name: 'Priya S.',
    city: 'Jacksonville, FL',
    type: 'BRRRR / Bridge-to-DSCR',
    outcome: 'First deal, bridge into DSCR refi',
    closeDays: '32 Days',
    ltv: '75% ARV',
    quote: "First investment property ever. $145K distressed SFR, $48K rehab, ARV at $245K. John structured the bridge, then refi'd into DSCR at 75% of ARV once it was stabilized. Cash back out on the refi, DSCR penciled at 1.22 on the new rent. He talked through every step before we pulled the trigger.",
  },
];

function StarIcon() {
  return (
    <svg className="h-4 w-4 text-amber" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function TestimonialCarouselFL() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const totalSlides = flDeals.length;
  const counter = `${String(selectedIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {flDeals.map((d, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
            >
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-navy-light p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>

                <p className="flex-1 text-sm leading-relaxed text-white/90">"{d.quote}"</p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wider text-amber font-semibold">Outcome</p>
                    <p className="font-semibold text-white text-sm mt-0.5">{d.outcome}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50">LTV</p>
                      <p className="font-semibold text-white text-sm">{d.ltv}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50">Close</p>
                      <p className="font-semibold text-white text-sm">{d.closeDays}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/20 border border-blue/30 text-sm font-semibold text-blue-light">
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{d.name}</p>
                    <p className="text-xs text-white/50">{d.city} · {d.type}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation: arrows + dots + counter */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-light border border-white/10 transition-all hover:bg-blue hover:border-blue disabled:opacity-30 disabled:hover:bg-navy-light disabled:hover:border-white/10"
          aria-label="Previous testimonial"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {flDeals.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === selectedIndex ? 'w-6 bg-blue' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-white/50 tabular-nums tracking-wider">
          {counter}
        </span>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-light border border-white/10 transition-all hover:bg-blue hover:border-blue disabled:opacity-30 disabled:hover:bg-navy-light disabled:hover:border-white/10"
          aria-label="Next testimonial"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
