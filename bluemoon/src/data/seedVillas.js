// Fallback listings used until the Supabase `villas` table has rows.
// Only facts you provided are included. Rates / guest limits / bathrooms are left empty — set them in the admin panel.
export const SEED_VILLAS = [
  {
    id: 'seed-1', sort_order: 1, slug: 'blue-moon-beach-villa-mahabalipuram',
    name: 'Blue Moon Beach Villa', location: 'Mahabalipuram',
    short_description: 'A private 3 BHK villa near the beach in Mahabalipuram.',
    bedrooms: 3, bathrooms: null, max_guests: null, weekday_price: 0, weekend_price: 0, available: true,
    map_link: 'https://www.google.com/maps/search/?api=1&query=Blue+Moon+Beach+Villa+Mahabalipuram', photos: []
  },
  {
    id: 'seed-2', sort_order: 2, slug: 'the-ocean-drive-villas-ecr',
    name: 'The Ocean Drive Villas @ ECR', location: 'Vadanemmeli, Chengalpattu',
    short_description: 'A private 3 BHK villa on East Coast Road at Vadanemmeli, Chengalpattu.',
    bedrooms: 3, bathrooms: null, max_guests: null, weekday_price: 0, weekend_price: 0, available: true,
    map_link: 'https://www.google.com/maps/search/?api=1&query=The+Ocean+Drive+Villas+Vadanemmeli+ECR', photos: []
  }
]
