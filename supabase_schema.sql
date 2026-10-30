-- ==============================================================================
-- TAPPING PLATFORM — COMPLETE SUPABASE DATABASE SCHEMA v1.0
-- Open Supabase Dashboard → SQL Editor → New Query → Paste this & Click "Run"
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_activated BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending_payment'
    CHECK (status IN ('active','pending_payment','blocked','suspended')),
  plan TEXT DEFAULT 'free'
    CHECK (plan IN ('free','monthly','yearly')),
  plan_expires_at TIMESTAMPTZ DEFAULT NULL,
  google_uid TEXT UNIQUE DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. PROFILES TABLE (Theme, Bio, Custom Colors, Branding)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT NULL,
  avatar_fit TEXT DEFAULT 'cover',
  avatar_zoom INTEGER DEFAULT 100,
  avatar_pos_x INTEGER DEFAULT 0,
  avatar_pos_y INTEGER DEFAULT 0,
  badge_title TEXT DEFAULT '',
  theme TEXT DEFAULT 'pastel-bento',
  font_family TEXT DEFAULT 'sans',
  font_color TEXT DEFAULT NULL,
  font_size TEXT DEFAULT 'md',
  accent_color TEXT DEFAULT '#FED5C3',
  header_background TEXT DEFAULT 'none',
  show_header_background BOOLEAN DEFAULT FALSE,
  full_page_background BOOLEAN DEFAULT FALSE,
  custom_header_image TEXT DEFAULT NULL,
  bg_image_dim INTEGER DEFAULT 40,
  bg_image_blur INTEGER DEFAULT 0,
  custom_bg_color TEXT DEFAULT NULL,
  link_card_style TEXT DEFAULT 'solid',
  card_behind_content BOOLEAN DEFAULT FALSE,
  card_container_style TEXT DEFAULT 'glass',
  mobile_number TEXT DEFAULT '',
  social_links JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_activated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- 3. VCARDS TABLE (Phonebook Contact Info)
CREATE TABLE IF NOT EXISTS public.vcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  organization TEXT DEFAULT '',
  job_title TEXT DEFAULT '',
  work_phone TEXT DEFAULT '',
  mobile_phone TEXT DEFAULT '',
  work_email TEXT DEFAULT '',
  website TEXT DEFAULT '',
  street_address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  country TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vcards_username ON public.vcards(username);

-- 4. LINKS TABLE (Bio Link Blocks & Curated Products)
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT NULL,
  thumbnail TEXT DEFAULT NULL,
  type TEXT DEFAULT 'link'
    CHECK (type IN ('link','product','social','divider','heading','video')),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_links_username ON public.links(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);

-- 5. ANALYTICS TABLE (Real-Time Telemetry & Clicks)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  profile_views INTEGER DEFAULT 0,
  total_link_clicks INTEGER DEFAULT 0,
  qr_scans INTEGER DEFAULT 0,
  nfc_taps INTEGER DEFAULT 0,
  vcf_downloads INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_username ON public.analytics(username);

-- 6. NFC CARD ORDERS TABLE (Physical Metal Hardware Studio)
CREATE TABLE IF NOT EXISTS public.nfc_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  shipping_address JSONB NOT NULL DEFAULT '{}',
  card_design JSONB NOT NULL DEFAULT '{}',
  quantity INTEGER DEFAULT 1,
  material TEXT DEFAULT 'matte_black',
  amount_inr DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','refunded','failed')),
  order_status TEXT DEFAULT 'pending'
    CHECK (order_status IN ('pending','confirmed','printing','shipped','delivered','cancelled')),
  payment_id TEXT DEFAULT NULL,
  tracking_number TEXT DEFAULT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nfc_orders_username ON public.nfc_orders(username);
CREATE INDEX IF NOT EXISTS idx_nfc_orders_status ON public.nfc_orders(order_status);

-- 7. PAYMENTS TABLE (Razorpay / UPI / Subscription Records)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  amount_inr DECIMAL(10,2) NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly','yearly','nfc_card')),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','success','failed','refunded')),
  payment_gateway TEXT DEFAULT 'razorpay',
  payment_id TEXT DEFAULT NULL,
  order_id TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_username ON public.payments(username);

-- 8. BRAND RESERVED HANDLES
CREATE TABLE IF NOT EXISTS public.handle_reservations (
  handle TEXT PRIMARY KEY,
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT DEFAULT 'brand_protection'
);
INSERT INTO public.handle_reservations (handle, reason) VALUES
  ('admin','system'),('tapping','brand'),('support','brand'),
  ('help','brand'),('api','system'),('www','system'),
  ('dashboard','system'),('settings','system'),
  ('sunny','admin'),('sunnyservi123','admin')
ON CONFLICT (handle) DO NOTHING;

-- 9. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  platform_name TEXT DEFAULT 'Tapping',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  signup_enabled BOOLEAN DEFAULT TRUE,
  monthly_price_inr DECIMAL(8,2) DEFAULT 299.00,
  yearly_price_inr DECIMAL(8,2) DEFAULT 2999.00,
  nfc_card_base_price_inr DECIMAL(8,2) DEFAULT 1499.00,
  max_links_free INTEGER DEFAULT 5,
  max_links_pro INTEGER DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.system_settings DEFAULT VALUES ON CONFLICT DO NOTHING;

-- 10. AUTO-TIMESTAMP UPDATE TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_ts ON public.users;
CREATE TRIGGER trg_users_ts BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_ts ON public.profiles;
CREATE TRIGGER trg_profiles_ts BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_vcards_ts ON public.vcards;
CREATE TRIGGER trg_vcards_ts BEFORE UPDATE ON public.vcards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_links_ts ON public.links;
CREATE TRIGGER trg_links_ts BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_orders_ts ON public.nfc_orders;
CREATE TRIGGER trg_orders_ts BEFORE UPDATE ON public.nfc_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 11. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Public read for activated profiles
DROP POLICY IF EXISTS "Public read activated profiles" ON public.profiles;
CREATE POLICY "Public read activated profiles"
  ON public.profiles FOR SELECT USING (is_activated = TRUE);

DROP POLICY IF EXISTS "Public read links" ON public.links;
CREATE POLICY "Public read links"
  ON public.links FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read vcards" ON public.vcards;
CREATE POLICY "Public read vcards"
  ON public.vcards FOR SELECT USING (TRUE);

-- Owners manage their own data
DROP POLICY IF EXISTS "Owner manages profile" ON public.profiles;
CREATE POLICY "Owner manages profile"
  ON public.profiles FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner manages vcards" ON public.vcards;
CREATE POLICY "Owner manages vcards"
  ON public.vcards FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner manages links" ON public.links;
CREATE POLICY "Owner manages links"
  ON public.links FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner reads analytics" ON public.analytics;
CREATE POLICY "Owner reads analytics"
  ON public.analytics FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner reads orders" ON public.nfc_orders;
CREATE POLICY "Owner reads orders"
  ON public.nfc_orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner reads payments" ON public.payments;
CREATE POLICY "Owner reads payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- 12. HANDLE AVAILABILITY VALIDATION FUNCTION
CREATE OR REPLACE FUNCTION check_handle_availability(p_handle TEXT)
RETURNS JSON AS $$
DECLARE 
  v_clean TEXT;
BEGIN
  v_clean := LOWER(TRIM(p_handle));
  IF LENGTH(v_clean) < 2 THEN
    RETURN json_build_object('available', false, 'reason', 'too short (min 2 chars)');
  END IF;
  IF LENGTH(v_clean) > 30 THEN
    RETURN json_build_object('available', false, 'reason', 'too long (max 30 chars)');
  END IF;
  IF v_clean !~ '^[a-z0-9_-]+$' THEN
    RETURN json_build_object('available', false, 'reason', 'only letters, numbers, _ and - allowed');
  END IF;
  IF EXISTS (SELECT 1 FROM public.handle_reservations WHERE handle = v_clean) THEN
    RETURN json_build_object('available', false, 'reason', 'reserved');
  END IF;
  IF EXISTS (SELECT 1 FROM public.users WHERE LOWER(username) = v_clean) THEN
    RETURN json_build_object('available', false, 'reason', 'taken');
  END IF;
  RETURN json_build_object('available', true, 'handle', v_clean);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
