export interface CardFont {
  id: string;
  name: string;
  family: string;
  category: 
    | 'Modern Sans' 
    | 'Luxury Serif' 
    | 'Comic & Pop' 
    | 'Retro & 8-Bit' 
    | 'Cyber & Sci-Fi' 
    | 'Display & Heavy' 
    | 'Script & Signature' 
    | 'Brutalist & Urban';
}

export const CARD_FONTS: CardFont[] = [
  // --- Modern Sans (15) ---
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'Modern Sans' },
  { id: 'montserrat', name: 'Montserrat Bold', family: "'Montserrat', sans-serif", category: 'Modern Sans' },
  { id: 'poppins', name: 'Poppins Geometric', family: "'Poppins', sans-serif", category: 'Modern Sans' },
  { id: 'outfit', name: 'Outfit Clean', family: "'Outfit', sans-serif", category: 'Modern Sans' },
  { id: 'syne', name: 'Syne Avant-Garde', family: "'Syne', sans-serif", category: 'Modern Sans' },
  { id: 'unbounded', name: 'Unbounded Modern', family: "'Unbounded', sans-serif", category: 'Modern Sans' },
  { id: 'lexend', name: 'Lexend High-Legibility', family: "'Lexend', sans-serif", category: 'Modern Sans' },
  { id: 'inter', name: 'Inter Swiss Neutral', family: "'Inter', sans-serif", category: 'Modern Sans' },
  { id: 'dm-sans', name: 'DM Sans Minimal', family: "'DM Sans', sans-serif", category: 'Modern Sans' },
  { id: 'manrope', name: 'Manrope Rounded', family: "'Manrope', sans-serif", category: 'Modern Sans' },
  { id: 'sora', name: 'Sora Precision', family: "'Sora', sans-serif", category: 'Modern Sans' },
  { id: 'archivo', name: 'Archivo Technical', family: "'Archivo', sans-serif", category: 'Modern Sans' },
  { id: 'urbanist', name: 'Urbanist Geometric', family: "'Urbanist', sans-serif", category: 'Modern Sans' },
  { id: 'epilogue', name: 'Epilogue Variable', family: "'Epilogue', sans-serif", category: 'Modern Sans' },
  { id: 'space-grotesk', name: 'Space Grotesk Pro', family: "'Space Grotesk', sans-serif", category: 'Modern Sans' },

  // --- Luxury Serif (15) ---
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Luxury Serif' },
  { id: 'cinzel', name: 'Cinzel Roman Inscription', family: "'Cinzel', serif", category: 'Luxury Serif' },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", category: 'Luxury Serif' },
  { id: 'bodoni', name: 'Bodoni Moda Haute', family: "'Bodoni Moda', serif", category: 'Luxury Serif' },
  { id: 'prata', name: 'Prata Elegant Tear', family: "'Prata', serif", category: 'Luxury Serif' },
  { id: 'marcellus', name: 'Marcellus Classical', family: "'Marcellus', serif", category: 'Luxury Serif' },
  { id: 'cinzel-decorative', name: 'Cinzel Decorative Swash', family: "'Cinzel Decorative', serif", category: 'Luxury Serif' },
  { id: 'abril-fatface', name: 'Abril Fatface Titling', family: "'Abril Fatface', serif", category: 'Luxury Serif' },
  { id: 'castoro', name: 'Castoro Academic', family: "'Castoro', serif", category: 'Luxury Serif' },
  { id: 'spectral', name: 'Spectral Editorial', family: "'Spectral', serif", category: 'Luxury Serif' },
  { id: 'forum', name: 'Forum Antiqua', family: "'Forum', serif", category: 'Luxury Serif' },
  { id: 'fraunces', name: 'Fraunces Wonky Serif', family: "'Fraunces', serif", category: 'Luxury Serif' },
  { id: 'italiana', name: 'Italiana Luxury Vogue', family: "'Italiana', serif", category: 'Luxury Serif' },
  { id: 'yeseva-one', name: 'Yeseva One High-Contrast', family: "'Yeseva One', serif", category: 'Luxury Serif' },
  { id: 'cove', name: 'Cove Antique Serif', family: "'Cormorant Infant', serif", category: 'Luxury Serif' },

  // --- Comic & Pop (15) ---
  { id: 'bangers', name: 'Bangers Marvel Boom', family: "'Bangers', cursive", category: 'Comic & Pop' },
  { id: 'fredoka', name: 'Fredoka Bubble Pop', family: "'Fredoka', cursive", category: 'Comic & Pop' },
  { id: 'luckiest-guy', name: 'Luckiest Guy Poster', family: "'Luckiest Guy', cursive", category: 'Comic & Pop' },
  { id: 'bungee', name: 'Bungee Block Shade', family: "'Bungee', cursive", category: 'Comic & Pop' },
  { id: 'titan-one', name: 'Titan One Bold Chubby', family: "'Titan One', cursive", category: 'Comic & Pop' },
  { id: 'shrikhand', name: 'Shrikhand Psychedelic', family: "'Shrikhand', cursive", category: 'Comic & Pop' },
  { id: 'boogaloo', name: 'Boogaloo 60s Comic', family: "'Boogaloo', cursive", category: 'Comic & Pop' },
  { id: 'carter-one', name: 'Carter One Pulp Comic', family: "'Carter One', cursive", category: 'Comic & Pop' },
  { id: 'comic-neue', name: 'Comic Neue Modern', family: "'Comic Neue', cursive", category: 'Comic & Pop' },
  { id: 'bungee-shade', name: 'Bungee Inline 3D', family: "'Bungee Shade', cursive", category: 'Comic & Pop' },
  { id: 'creepster', name: 'Creepster Horror Pulp', family: "'Creepster', cursive", category: 'Comic & Pop' },
  { id: 'chewy', name: 'Chewy Bubble Candy', family: "'Chewy', cursive", category: 'Comic & Pop' },
  { id: 'sniglet', name: 'Sniglet Cartoon Soft', family: "'Sniglet', cursive", category: 'Comic & Pop' },
  { id: 'chango', name: 'Chango Woodblock Chunky', family: "'Chango', cursive", category: 'Comic & Pop' },
  { id: 'gluten', name: 'Gluten Whimsical', family: "'Gluten', cursive", category: 'Comic & Pop' },

  // --- Retro & 8-Bit (15) ---
  { id: 'space-mono', name: 'Space Mono Terminal', family: "'Space Mono', monospace", category: 'Retro & 8-Bit' },
  { id: 'press-start-2p', name: 'Press Start 2P Arcade', family: "'Press Start 2P', monospace", category: 'Retro & 8-Bit' },
  { id: 'silkscreen', name: 'Silkscreen Pixel 8-Bit', family: "'Silkscreen', monospace", category: 'Retro & 8-Bit' },
  { id: 'vt323', name: 'VT323 CRT Monitor', family: "'VT323', monospace", category: 'Retro & 8-Bit' },
  { id: 'pixelify-sans', name: 'Pixelify Sans High-Res', family: "'Pixelify Sans', monospace", category: 'Retro & 8-Bit' },
  { id: 'major-mono', name: 'Major Mono Abstract', family: "'Major Mono Display', monospace", category: 'Retro & 8-Bit' },
  { id: 'share-tech-mono', name: 'Share Tech Military Mono', family: "'Share Tech Mono', monospace", category: 'Retro & 8-Bit' },
  { id: 'dot-gothic', name: 'DotGothic16 Japanese LCD', family: "'DotGothic16', monospace", category: 'Retro & 8-Bit' },
  { id: 'cutive-mono', name: 'Cutive Typewriter Vintage', family: "'Cutive Mono', monospace", category: 'Retro & 8-Bit' },
  { id: 'nova-mono', name: 'Nova Mono Cyber Terminal', family: "'Nova Mono', monospace", category: 'Retro & 8-Bit' },
  { id: 'fira-code', name: 'Fira Code Developer', family: "'Fira Code', monospace", category: 'Retro & 8-Bit' },
  { id: 'inconsolata', name: 'Inconsolata Clean Console', family: "'Inconsolata', monospace", category: 'Retro & 8-Bit' },
  { id: 'courier-prime', name: 'Courier Prime Hollywood', family: "'Courier Prime', monospace", category: 'Retro & 8-Bit' },
  { id: 'syne-mono', name: 'Syne Mono Raw Block', family: "'Syne Mono', monospace", category: 'Retro & 8-Bit' },
  { id: 'b612-mono', name: 'B612 Aviation HUD', family: "'B612 Mono', monospace", category: 'Retro & 8-Bit' },

  // --- Cyber & Sci-Fi (15) ---
  { id: 'orbitron', name: 'Orbitron Cyberpunk', family: "'Orbitron', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'audiowide', name: 'Audiowide Synthwave 80s', family: "'Audiowide', cursive", category: 'Cyber & Sci-Fi' },
  { id: 'michroma', name: 'Michroma Microchip HUD', family: "'Michroma', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'russo-one', name: 'Russo One Titanium Armor', family: "'Russo One', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'oxanium', name: 'Oxanium Hexagonal Gaming', family: "'Oxanium', cursive", category: 'Cyber & Sci-Fi' },
  { id: 'chakra-petch', name: 'Chakra Petch Cyber Mech', family: "'Chakra Petch', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'bruno-ace', name: 'Bruno Ace Mecha Jet', family: "'Bruno Ace', cursive", category: 'Cyber & Sci-Fi' },
  { id: 'electrolize', name: 'Electrolize Precision Circuit', family: "'Electrolize', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'zen-dots', name: 'Zen Dots Tokyo High-Tech', family: "'Zen Dots', cursive", category: 'Cyber & Sci-Fi' },
  { id: 'nova-square', name: 'Nova Square Digital Matrix', family: "'Nova Square', cursive", category: 'Cyber & Sci-Fi' },
  { id: 'geo', name: 'Geo Blueprint Minimalist', family: "'Geo', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'megrim', name: 'Megrim Line Hologram', family: "'Megrim', cursive", category: 'Cyber & Sci-Fi' },
  { id: 'allerta-stencil', name: 'Allerta Stencil Laser Cut', family: "'Allerta Stencil', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'sarpanch', name: 'Sarpanch Angular Cyber', family: "'Sarpanch', sans-serif", category: 'Cyber & Sci-Fi' },
  { id: 'monoton', name: 'Monoton Neon Tube Glow', family: "'Monoton', cursive", category: 'Cyber & Sci-Fi' },

  // --- Display & Heavy (15) ---
  { id: 'anton', name: 'Anton Ultra Condensed', family: "'Anton', sans-serif", category: 'Display & Heavy' },
  { id: 'bebas-neue', name: 'Bebas Neue Headline', family: "'Bebas Neue', sans-serif", category: 'Display & Heavy' },
  { id: 'righteous', name: 'Righteous Art Deco Space', family: "'Righteous', cursive", category: 'Display & Heavy' },
  { id: 'black-ops', name: 'Black Ops One Military', family: "'Black Ops One', cursive", category: 'Display & Heavy' },
  { id: 'alfa-slab', name: 'Alfa Slab One Wood Heavy', family: "'Alfa Slab One', serif", category: 'Display & Heavy' },
  { id: 'rowdies', name: 'Rowdies Punchy Block', family: "'Rowdies', cursive", category: 'Display & Heavy' },
  { id: 'fugaz-one', name: 'Fugaz One Speed Italics', family: "'Fugaz One', cursive", category: 'Display & Heavy' },
  { id: 'teko', name: 'Teko Industrial Tall', family: "'Teko', sans-serif", category: 'Display & Heavy' },
  { id: 'archivo-black', name: 'Archivo Black Poster', family: "'Archivo Black', sans-serif", category: 'Display & Heavy' },
  { id: 'bowlby-one', name: 'Bowlby One Heavy Ingot', family: "'Bowlby One', cursive", category: 'Display & Heavy' },
  { id: 'passion-one', name: 'Passion One Heavy Impact', family: "'Passion One', cursive", category: 'Display & Heavy' },
  { id: 'squada-one', name: 'Squada One Compact Brick', family: "'Squada One', cursive", category: 'Display & Heavy' },
  { id: 'sigmar-one', name: 'Sigmar One Punch Bold', family: "'Sigmar One', cursive", category: 'Display & Heavy' },
  { id: 'kanit', name: 'Kanit Extra Bold', family: "'Kanit', sans-serif", category: 'Display & Heavy' },
  { id: 'secular-one', name: 'Secular One Block Serif', family: "'Secular One', sans-serif", category: 'Display & Heavy' },

  // --- Script & Signature (10) ---
  { id: 'great-vibes', name: 'Great Vibes Calligraphy', family: "'Great Vibes', cursive", category: 'Script & Signature' },
  { id: 'dancing-script', name: 'Dancing Script Cursive', family: "'Dancing Script', cursive", category: 'Script & Signature' },
  { id: 'pacifico', name: 'Pacifico Beach Signature', family: "'Pacifico', cursive", category: 'Script & Signature' },
  { id: 'satisfy', name: 'Satisfy Brush Hand', family: "'Satisfy', cursive", category: 'Script & Signature' },
  { id: 'sacramento', name: 'Sacramento Delicate Monoline', family: "'Sacramento', cursive", category: 'Script & Signature' },
  { id: 'alex-brush', name: 'Alex Brush Elegant Ink', family: "'Alex Brush', cursive", category: 'Script & Signature' },
  { id: 'caveat', name: 'Caveat Hand Marker', family: "'Caveat', cursive", category: 'Script & Signature' },
  { id: 'shadows-light', name: 'Shadows Into Light', family: "'Shadows Into Light', cursive", category: 'Script & Signature' },
  { id: 'parisienne', name: 'Parisienne French Swash', family: "'Parisienne', cursive", category: 'Script & Signature' },
  { id: 'homemade-apple', name: 'Homemade Apple Casual', family: "'Homemade Apple', cursive", category: 'Script & Signature' },

  // --- Brutalist & Urban (10) ---
  { id: 'knewave', name: 'Knewave Graffiti Marker', family: "'Knewave', cursive", category: 'Brutalist & Urban' },
  { id: 'permanent-marker', name: 'Permanent Marker Sharpie', family: "'Permanent Marker', cursive", category: 'Brutalist & Urban' },
  { id: 'rubik-mono', name: 'Rubik Mono One Chunky', family: "'Rubik Mono One', sans-serif", category: 'Brutalist & Urban' },
  { id: 'rock-salt', name: 'Rock Salt Street Grunge', family: "'Rock Salt', cursive", category: 'Brutalist & Urban' },
  { id: 'bungee-inline', name: 'Bungee Inline Urban', family: "'Bungee Inline', cursive", category: 'Brutalist & Urban' },
  { id: 'press-gothic', name: 'Press Gothic Heavy', family: "'League Gothic', sans-serif", category: 'Brutalist & Urban' },
  { id: 'vtks-chalk', name: 'Staatliches Clean Display', family: "'Staatliches', cursive", category: 'Brutalist & Urban' },
  { id: 'wallpoet', name: 'Wallpoet Tech Stencil', family: "'Wallpoet', cursive", category: 'Brutalist & Urban' },
  { id: 'black-han-sans', name: 'Black Han Sans Seoul', family: "'Black Han Sans', sans-serif", category: 'Brutalist & Urban' },
  { id: 'monument-extended', name: 'Dela Gothic One Heavy', family: "'Dela Gothic One', cursive", category: 'Brutalist & Urban' },
];

export function findCardFont(fontId?: string): CardFont | undefined {
  if (!fontId) return undefined;
  if (fontId === 'sans') return CARD_FONTS.find((f) => f.id === 'plus-jakarta');
  if (fontId === 'comic') return CARD_FONTS.find((f) => f.id === 'bangers');
  if (fontId === 'cartoon') return CARD_FONTS.find((f) => f.id === 'fredoka');
  if (fontId === 'serif') return CARD_FONTS.find((f) => f.id === 'playfair');
  if (fontId === 'mono') return CARD_FONTS.find((f) => f.id === 'space-mono' || f.id === 'press-start-2p') || CARD_FONTS[0];
  return CARD_FONTS.find((f) => f.id === fontId);
}
