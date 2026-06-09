export interface HeritageSite {
  id: string;
  name: string;
  location: string;
  state: string;
  category: 'Cultural' | 'Natural' | 'Mixed';
  yearInscribed: number;
  description: string;
  historicalOverview: string;
  interestingFacts: string[];
  image: string;
  gallery: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  visitorInfo: {
    bestTimeToVisit: string;
    timings: string;
    entryFee: string;
  };
  featured?: boolean;
  timeline?: {
    year: string;
    event: string;
  }[];
  architectureHighlights?: {
    title: string;
    description: string;
  }[];
  unescoInfo?: {
    criteria: string;
    justification: string;
  };
  nearbyAttractions?: string[];
  builder?: string;
}
