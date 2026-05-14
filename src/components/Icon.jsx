import React from 'react';

const icons = {
  arrowRight: 'M5 12h14 M13 5l7 7-7 7',
  bot: 'M12 8V4 M8 4h8 M6 12h12 M7 12v7h10v-7 M9.5 15h.01 M14.5 15h.01 M5 14H3 M21 14h-2',
  gauge: 'M5 19a8 8 0 1 1 14 0 M12 15l4-4',
  history: 'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 8v5l3 2',
  login: 'M10 17l5-5-5-5 M15 12H3 M15 5h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4',
  logout: 'M14 17l5-5-5-5 M19 12H8 M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5',
  moon: 'M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10',
  send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  sparkles: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z M5 19l1-2 2-1-2-1-1-2-1 2-2 1 2 1 1 2z',
  sun: 'M12 4V2 M12 22v-2 M4.9 4.9 3.5 3.5 M20.5 20.5l-1.4-1.4 M4 12H2 M22 12h-2 M4.9 19.1l-1.4 1.4 M20.5 3.5l-1.4 1.4 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  trash: 'M3 6h18 M8 6V4h8v2 M6 6l1 14h10l1-14 M10 11v5 M14 11v5',
  userPlus: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M19 8v6 M16 11h6',
  wand: 'M15 4l5 5 M14 5l5 5 M3 21l12-12 M6 18l9-9',
};

export default function Icon({ name, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={icons[name]} />
    </svg>
  );
}
