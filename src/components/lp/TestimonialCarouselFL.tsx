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
    outcome: 'Closed after lender #1 declined for insurance',
    closeDays: '26 Days',
    ltv: '75%',
    quote: "First lender killed my Tampa duplex when the insurance quote came in at $4,800/yr. DSCR dropped to 0.94. John pulled three more carriers, applied wind-mit credits, and rebuilt the file at $2,950/yr. DSCR back to 1.11. Closed in 26 days.",
  },
  {
    name: 'Lauren K.',
    city: 'Kissimmee, FL',
    type: 'Disney-Area STR',
    outcome: 'Disney STR financed on AirDNA, no rental history',
    closeDays: '24 Days',
    ltv: '80%',
    quote: "Bought a 5-bedroom pool home in Four Corners with zero rental history. Most lenders ghosted me. John matched me with a lender that took AirDNA at 75%, verified Osceola STR zoning, and we closed in 24 days. First STR in the books.",
  },
  {
    name: 'Carlos V.',
    city: 'Cape Coral, FL',
    type: 'Foreign National',
    outcome: 'Canadian buyer, no US credit, canal-front SFR',
    closeDays: '28 Days',
    ltv: '70%',
    quote: "I live in Toronto and own two FL rentals. Getting a third was supposed to be impossible. No SSN, no US credit history. John walked me through Foreign National DSCR, accepted my TD Bank Canada credit report, and closed the canal-front at $390K.",
  },
  {
    name: 'Priya S.',
    city: 'Jacksonville, FL',
    type: 'BRRRR / Bridge-to-DSCR',
    outcome: 'First deal, bridge into DSCR refi',
    closeDays: '32 Days',
    ltv: '75% ARV',
    quote: "First investment property ever. $145K distressed SFR, $48K rehab, ARV at $245K. John structured the bridge at 10.5% IO, then refi'd into DSCR at 75% of ARV. Pulled $183K cash back out, DSCR landed at 1.22 on $1,750/mo rent.",
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {flDeals.map((d, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
            >
              <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>

                <p className="flex-1 text-sm leading-relaxed text-gray-500">"{d.quote}"</p>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wider text-amber font-semibold">Outcome</p>
                    <p className="font-semibold text-navy text-sm mt-0.5">{d.outcome}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">LTV</p>
                      <p className="font-semibold text-navy text-sm">{d.ltv}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">Close</p>
                      <p className="font-semibold text-navy text-sm">{d.closeDays}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.city} · {d.type}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md disabled:opacity-40"
          aria-label="Previous testimonial"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md disabled:opacity-40"
          aria-label="Next testimonial"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
