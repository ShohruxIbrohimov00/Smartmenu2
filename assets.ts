import type React from 'react';
// Rasmlar Vite orqali import qilinadi: build paytida hash bilan dist/assets ga
// tushadi va Vercel'da to'g'ri URL bilan ochiladi.
import palov from './src/assets/images/food_palov_uzbek_1791707084067.jpg';
import shashlik from './src/assets/images/food_shashlik_grill_1791707118315.jpg';
import somsa from './src/assets/images/food_somsa_tandoor_1791707134008.jpg';
import greenTea from './src/assets/images/drink_green_tea_1791707144208.jpg';
import logo from './src/assets/images/cafe_logo_mark_1791707154839.jpg';

export const IMG = { palov, shashlik, somsa, greenTea, logo };

// Rasm ochilmasa ko'rsatiladigan zaxira (inline SVG, tarmoqsiz)
export const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" fill="#94a3b8" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Rasm yo\'q</text></svg>'
  );

export const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const el = e.currentTarget;
  if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG;
};
