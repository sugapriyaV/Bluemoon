const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`

// Same shape as the Supabase `villas` table so the site works before the DB is connected.
export const SEED_VILLAS = [
  {
    id: 'seed-1', sort_order: 1, slug: 'blue-moon-beach-villa-mahabalipuram',
    name: 'Blue Moon Beach Villa', location: 'Mahabalipuram, near the beach',
    short_description: 'A private 3BHK beach villa a short walk from the sand, with a pool, BBQ lawn and a kids\u2019 play corner.',
    long_description: 'Wake up to sea breeze at this private 3BHK villa near Mahabalipuram beach. Three air-conditioned bedrooms, an open living room, a fully equipped kitchen, a sparkling swimming pool and a BBQ area make it perfect for family getaways and friends\u2019 weekends.',
    bedrooms: 3, bathrooms: 3, max_guests: 12, weekday_price: 14000, weekend_price: 19000, available: true,
    map_link: 'https://www.google.com/maps/search/?api=1&query=Mahabalipuram+Beach+Villa',
    photos: [
      u('photo-1613490493576-7fde63acd811'), u('photo-1507525428034-b723cf961d3e'), u('photo-1540541338287-41700207dee6'),
      u('photo-1502672260266-1c1ef2d93688'), u('photo-1505693416388-ac5ce068fe85'), u('photo-1556911220-bff31c812dba'), u('photo-1560448204-e02f11c3d0e2')
    ]
  },
  {
    id: 'seed-2', sort_order: 2, slug: 'the-ocean-drive-villas-ecr',
    name: 'The Ocean Drive Villas @ ECR', location: 'Vadanemmeli, Chengalpattu (ECR)',
    short_description: 'A spacious private 3BHK villa on East Coast Road with a pool, outdoor games and a BBQ deck.',
    long_description: 'Set on the scenic East Coast Road at Vadanemmeli, The Ocean Drive Villas offers a private 3BHK stay with a swimming pool, outdoor play area, indoor games and BBQ facilities \u2014 an easy drive from Chennai.',
    bedrooms: 3, bathrooms: 3, max_guests: 12, weekday_price: 13000, weekend_price: 18000, available: true,
    map_link: 'https://www.google.com/maps/search/?api=1&query=Vadanemmeli+ECR+Chengalpattu',
    photos: [
      u('photo-1582719478250-c89cae4dc85b'), u('photo-1520250497591-112f2f40a3f4'), u('photo-1512917774080-9991f1c4c750'),
      u('photo-1560448204-e02f11c3d0e2'), u('photo-1505693416388-ac5ce068fe85'), u('photo-1556911220-bff31c812dba'), u('photo-1571896349842-33c89424de2d')
    ]
  }
]

export const GALLERY = [
  u('photo-1507525428034-b723cf961d3e'), u('photo-1540541338287-41700207dee6'), u('photo-1613490493576-7fde63acd811'),
  u('photo-1502672260266-1c1ef2d93688'), u('photo-1505693416388-ac5ce068fe85'), u('photo-1582719478250-c89cae4dc85b')
]
export const HERO_IMG = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
export const TESTIMONIALS = [
  { name: 'Priya & Family', text: 'The pool, the BBQ evenings and the kids\u2019 play corner made our weekend unforgettable. Spotless villa and super-helpful hosts.', place: 'Chennai' },
  { name: 'Karthik R.', text: 'Perfect for our friends\u2019 reunion. Booking over WhatsApp took two minutes and everything was exactly as shown.', place: 'Bengaluru' },
  { name: 'Anita S.', text: 'Walkable to the beach, great Wi-Fi, comfortable AC rooms. We are already planning our next stay.', place: 'Hyderabad' }
]
