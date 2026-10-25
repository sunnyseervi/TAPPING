-- =====================================================================
-- TAPPING SaaS Database Schema & Security Policies (Milestone 1-3)
-- =====================================================================

-- 1. PROFILES TABLE (Public Link-in-Bio & Creator Account)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    theme TEXT DEFAULT 'pastel-bento' NOT NULL,
    font_family TEXT DEFAULT 'sans' NOT NULL,
    badge_title TEXT DEFAULT 'Creator & Thinker',
    accent_color TEXT DEFAULT '#FED5C3' NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    social_links JSONB DEFAULT '{"instagram":"","twitter":"","linkedin":"","github":"","youtube":"","tiktok":""}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT username_min_length CHECK (char_length(username) >= 3),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Index for fast username lookups (public profile route)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. VCARD PROFILES (Digital Business Card Details)
CREATE TABLE IF NOT EXISTS public.vcard_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    organization TEXT,
    job_title TEXT,
    work_phone TEXT,
    mobile_phone TEXT,
    work_email TEXT,
    website TEXT,
    street_address TEXT,
    city TEXT,
    country TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LINK BLOCKS (Links, Headers, Social Buttons, Media)
CREATE TABLE IF NOT EXISTS public.link_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT DEFAULT 'link' NOT NULL, -- 'link', 'header', 'social', 'vcard_cta', 'media'
    title TEXT NOT NULL,
    url TEXT,
    icon TEXT DEFAULT 'globe',
    style_variant TEXT DEFAULT 'card' NOT NULL, -- 'card', 'pill', 'peach', 'lavender', 'mint', 'yellow'
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    click_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_link_blocks_user_sort ON public.link_blocks(user_id, sort_order);

-- 4. ANALYTICS EVENTS (Real Taps, Views & Clicks Tracking)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    link_id UUID REFERENCES public.link_blocks(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'page_view', 'link_click', 'vcard_download', 'nfc_tap', 'qr_scan'
    referrer TEXT,
    user_agent TEXT,
    device_type TEXT DEFAULT 'mobile', -- 'mobile', 'desktop', 'tablet'
    country TEXT DEFAULT 'US',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_profile_time ON public.analytics_events(profile_id, created_at DESC);

-- 5. NFC CARDS & ORDERS (Smart Physical Metal Business Cards)
CREATE TABLE IF NOT EXISTS public.nfc_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_uid TEXT UNIQUE NOT NULL,
    material TEXT DEFAULT 'matte_black' NOT NULL, -- 'matte_black', 'brushed_gold', 'rose_gold', 'titanium_silver'
    engraved_name TEXT NOT NULL,
    engraved_tagline TEXT,
    qr_code_enabled BOOLEAN DEFAULT true NOT NULL,
    redirect_mode TEXT DEFAULT 'profile' NOT NULL, -- 'profile', 'direct_vcard', 'custom_url'
    custom_redirect_url TEXT,
    order_status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'ordered', 'in_production', 'shipped', 'delivered', 'active'
    tracking_number TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nfc_cards_uid ON public.nfc_cards(card_uid);

-- 6. SUBSCRIPTIONS & RAZORPAY BILLING
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    tier TEXT DEFAULT 'free' NOT NULL, -- 'free', 'pro', 'metal_bundle'
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'trialing', 'past_due', 'canceled'
    razorpay_customer_id TEXT,
    razorpay_subscription_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vcard_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Anyone can view published profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (is_published = true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- VCARD PROFILES POLICIES
CREATE POLICY "Public can view vcard for published profiles" 
ON public.vcard_profiles FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = vcard_profiles.user_id AND profiles.is_published = true
));

CREATE POLICY "Users manage their own vcard profile" 
ON public.vcard_profiles FOR ALL 
USING (auth.uid() = user_id);

-- LINK BLOCKS POLICIES
CREATE POLICY "Public can view active link blocks of published profiles" 
ON public.link_blocks FOR SELECT 
USING (
    is_active = true AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = link_blocks.user_id AND profiles.is_published = true
    )
);

CREATE POLICY "Users manage their own link blocks" 
ON public.link_blocks FOR ALL 
USING (auth.uid() = user_id);

-- ANALYTICS EVENTS POLICIES
CREATE POLICY "Public can insert analytics events" 
ON public.analytics_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view analytics for their own profile" 
ON public.analytics_events FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = analytics_events.profile_id AND profiles.id = auth.uid()
    )
);

-- NFC CARDS POLICIES
CREATE POLICY "Anyone can lookup card by card_uid for tap redirection" 
ON public.nfc_cards FOR SELECT 
USING (true);

CREATE POLICY "Users manage their own NFC cards" 
ON public.nfc_cards FOR ALL 
USING (auth.uid() = user_id);

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || SUBSTRING(new.id::text FROM 1 FOR 8)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Creator'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );

  INSERT INTO public.vcard_profiles (user_id, first_name, last_name, work_email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Creator'),
    '',
    new.email
  );

  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (new.id, 'free', 'active');

  -- Add default welcome links
  INSERT INTO public.link_blocks (user_id, title, url, icon, style_variant, sort_order)
  VALUES 
    (new.id, 'My Portfolio & Latest Work', 'https://github.com', 'briefcase', 'peach', 0),
    (new.id, 'Connect on LinkedIn', 'https://linkedin.com', 'linkedin', 'lavender', 1),
    (new.id, 'Follow my Threads & Thoughts', 'https://twitter.com', 'twitter', 'mint', 2);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
