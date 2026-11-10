/* =========================================================
   AMIGO Kid: site settings and showcase content.
   This is the only file you need to edit to change the shoes,
   phone number or Instagram posts shown on the page.
   ========================================================= */

window.AMIGO = {

  CONFIG: {
    whatsappNumber: '917593882423',   // country code + number, no "+" or spaces
    instagram: 'https://www.instagram.com/amigo___kid/'
  },

  /* Filter buttons in the Collection section. */
  TAGS: {
    all:     'All',
    boys:    'Boys',
    girls:   'Girls',
    baby:    '8 months – 2 yrs',
    kids:    '3 – 6 yrs',
    daily:   'Daily wear',
    festive: 'Eid & party'
  },

  /* ---------------------------------------------------------
     SHOES ON SHOW
     - image: the product photo used in the collection
     - hero:  puts the shoe in the big hero slider. It needs a cut-out
              picture with a see-through background (PNG or WebP),
              the big word shown behind it and a tilt in degrees.
     To add a shoe, copy one line and change it.
     --------------------------------------------------------- */
  PRODUCTS: [
    { name: 'Twinkle Light-Up Sneakers', tags: ['girls', 'kids', 'daily'],
      image: 'assets/products/twinkle.jpg',
      hero: { image: 'assets/shoes/twinkle.webp', word: 'TWINKLE', tilt: -4 } },
    { name: 'Butterfly Velcro Sneakers', tags: ['girls', 'kids', 'festive'],
      image: 'assets/products/butterfly.jpg',
      hero: { image: 'assets/shoes/butterfly.webp', word: 'BUTTERFLY', tilt: 0 } },
    { name: 'Classic Stripe Sneakers', tags: ['boys', 'baby', 'daily'],
      image: 'assets/products/stripe.jpg',
      hero: { image: 'assets/shoes/stripe.webp', word: 'CLASSIC', tilt: -3 } }
  ],

  /* ---------------------------------------------------------
     TESTIMONIALS
     These four are SAMPLES so you can see the design.
     Replace them with real reviews from your customers
     (WhatsApp messages or Instagram comments, with permission),
     then delete `sample: true` and the "Sample review" tag goes away.
     --------------------------------------------------------- */
  REVIEWS: [
    { sample: true, name: 'Ayesha R.', detail: 'Mum of a 4-year-old', place: 'Calicut', stars: 5,
      shoe: 'Butterfly Velcro Sneakers',
      text: 'My daughter wanted to wear them to bed. The velcro is so easy that she puts them on by herself before school.' },
    { sample: true, name: 'Fathima N.', detail: 'Mum of twins', place: 'Malappuram', stars: 5,
      shoe: 'Twinkle Light-Up Sneakers',
      text: 'Ordered on WhatsApp and they helped me pick the right size for both girls. The lights are the first thing every visitor notices.' },
    { sample: true, name: 'Rahul M.', detail: 'Dad of a 2-year-old', place: 'Kannur', stars: 5,
      shoe: 'Classic Stripe Sneakers',
      text: 'Soft, light and very well made for the price. Delivery to Kannur was quick and the packing was lovely.' },
    { sample: true, name: 'Sana K.', detail: 'Mum of a 6-year-old', place: 'Calicut', stars: 5,
      text: 'We visited the store on SM Street for Eid shopping. Lovely collection and very patient staff while my son tried on pairs.' }
  ],

  /* Your Instagram posts shown on the page. Copy the code from a post link:
     instagram.com/amigo___kid/p/THIS_PART/   */
  INSTAGRAM_POSTS: [
    'DfXF-STAYoe',
    'DfUvkhhAY0a',
    'DfUndaWgUR4',
    'DfUmJwWgbHg',
    'DfUZxYagQ4B',
    'DfUXGRSAa1M'
  ]
};
