import { 
  Stethoscope, 
  Scissors, 
  UtensilsCrossed, 
  Landmark, 
  Building, 
  Store, 
  MoreHorizontal, 
  LayoutGrid,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Coffee,
  Car,
  Briefcase,
  Smartphone
} from "lucide-react";

export const categoryIconMap = {
  all: LayoutGrid,
  clinic: Stethoscope,
  healthcare: HeartPulse,
  medical: Stethoscope,
  salon: Scissors,
  spa: Scissors,
  restaurant: UtensilsCrossed,
  food: UtensilsCrossed,
  cafe: Coffee,
  bank: Landmark,
  finance: Landmark,
  government: Building,
  retail: Store,
  shop: ShoppingBag,
  education: GraduationCap,
  school: GraduationCap,
  automotive: Car,
  services: Briefcase,
  tech: Smartphone,
};

export const getCategoryIcon = (category) => {
  if (!category) return MoreHorizontal;
  
  const normalized = category.toLowerCase();
  
  // Direct match
  if (categoryIconMap[normalized]) return categoryIconMap[normalized];
  
  // Keyword match
  const entry = Object.entries(categoryIconMap).find(([key]) => 
    normalized.includes(key) || key.includes(normalized)
  );
  
  return entry ? entry[1] : MoreHorizontal;
};
