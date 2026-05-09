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
  Smartphone,
  Laptop,
  Hammer,
  Scale,
  Shirt,
  Building2,
  Gamepad2,
  Music
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
  fashion: Shirt,
  clothing: Shirt,
  education: GraduationCap,
  school: GraduationCap,
  automotive: Car,
  car: Car,
  services: Briefcase,
  tech: Smartphone,
  electronics: Smartphone,
  computers: Laptop,
  it: Laptop,
  hardware: Hammer,
  legal: Scale,
  law: Scale,
  entertainment: Gamepad2,
  gaming: Gamepad2,
  music: Music,
};

export const getCategoryIcon = (category) => {
  if (!category) return Building2;
  
  const normalized = category.toLowerCase();
  
  // Direct match
  if (categoryIconMap[normalized]) return categoryIconMap[normalized];
  
  // Keyword match
  const entry = Object.entries(categoryIconMap).find(([key]) => {
    if (key === "all") return false;
    return normalized.includes(key) || key.includes(normalized);
  });
  
  return entry ? entry[1] : Building2;
};
