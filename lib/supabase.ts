/**
 * TAPPING Supabase Backend Integration & Schema Definition
 * 
 * Provides database connection utilities, SQL migration schema,
 * and seamless fallback to local persistent cache when keys are not yet configured.
 */

export const SUPABASE_SQL_SCHEMA = `
-- ===================================================
-- TAPPING DATABASE SCHEMA FOR SUPABASE (POSTGRESQL)
-- ===================================================

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  badge_title TEXT DEFAULT 'Creator',
  theme TEXT DEFAULT 'pastel-bento',
  font_family TEXT DEFAULT 'sans',
  font_color TEXT DEFAULT '#141518',
  accent_color TEXT DEFAULT '#FED5C3',
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'suspended')),
  plan TEXT DEFAULT 'pro_monthly' CHECK (plan IN ('free', 'pro_monthly', 'pro_yearly', 'metal_bundle')),
  plan_expires_at TIMESTAMPTZ,
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. LINK BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  style_variant TEXT DEFAULT 'white',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  custom_styles JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SLIDABLE STORE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  image_url TEXT,
  variants TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  cart_adds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. METAL CARD HARDWARE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.metal_card_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  material TEXT NOT NULL,
  engraved_name TEXT NOT NULL,
  engraved_tagline TEXT,
  qr_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_production', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  shipping_carrier TEXT DEFAULT 'Delhivery',
  amount NUMERIC(10, 2) DEFAULT 1499.00,
  currency TEXT DEFAULT 'INR',
  payment_status TEXT DEFAULT 'paid',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PAYMENTS & TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  type TEXT NOT NULL,
  status TEXT DEFAULT 'succeeded',
  method TEXT DEFAULT 'UPI',
  transaction_ref TEXT,
  plan_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metal_card_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICY FOR PROFILES (BIO LINKS)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public links are viewable by everyone" ON public.links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public products are viewable by everyone" ON public.products
  FOR SELECT USING (is_active = true);
`;

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isConfigured = Boolean(url && anonKey && url.includes('supabase.co'));

  return {
    url,
    anonKey: anonKey ? `${anonKey.slice(0, 8)}...${anonKey.slice(-6)}` : '',
    isConfigured,
    mode: isConfigured ? 'supabase_live' : 'local_storage_cache',
  };
}
