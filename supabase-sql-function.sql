-- Create a function to execute SQL queries safely
-- This should be executed in your Supabase SQL editor
CREATE OR REPLACE FUNCTION execute_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Execute the query and convert results to JSON
    EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query_text || ') t' INTO result;
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'error', SQLERRM,
            'detail', SQLSTATE
        );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_sql TO authenticated;

-- Create the page_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type VARCHAR NOT NULL,
    title VARCHAR,
    subtitle VARCHAR,
    description TEXT,
    cta_text VARCHAR,
    cta_link VARCHAR,
    image_path VARCHAR,
    order INTEGER,
    is_active BOOLEAN DEFAULT true,
    content_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_page_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for page_sections
CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON page_sections
FOR EACH ROW
EXECUTE PROCEDURE update_page_sections_updated_at();

-- Add RLS policies for page_sections
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Admins can do everything with page_sections" ON page_sections
FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for anonymous users to read active sections
CREATE POLICY "Anonymous users can read active page_sections" ON page_sections
FOR SELECT TO anon
USING (is_active = true);

-- Insert sample data for home page sections
INSERT INTO page_sections (section_type, title, subtitle, description, cta_text, cta_link, image_path, order, is_active, content_json)
VALUES 
('hero', 'JŪSŲ AUTOPIRKIMO ASISTENTAS', 'Padedame išsirinkti ir prižiūrėti jūsų automobilį', 'Paprastas ir skaidrus procesas.', 'Sužinoti daugiau', '#services', '/hero-car-1.jpg', 1, true, '{"video_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage  '/hero-car-1.jpg', 1, true, '{"video_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0416-V202qVy68bqtcxev1xgtPTpdSJPuYE.mp4"}'),
('services', 'PASLAUGOS', 'Pritaikytos paslaugos', 'Pritaikytos paslaugos, sukurtos aukščiausių reikalavimų klientams. Kiekviena detalė apgalvota, kad užtikrintų nepriekaištingą jūsų patirtį.', 'Gauti individualų pasiūlymą', '#contact', NULL, 2, true, '{"features": ["Automobilių įsigijimas", "Finansavimo pagalba", "Elektromobilių konsultacijos"]}'),
('about', 'APIE MUS', 'Mūsų istorija', 'WheelStreet – tai naujoviškas požiūris į automobilio pirkimą. Mūsų komanda padeda išsirinkti būtent tą automobilį, kuris geriausiai atitiks jūsų poreikius.', 'Sužinoti daugiau', '/about', '/about-bg.jpg', 3, true, NULL),
('team', 'MŪSŲ KOMANDA', 'Profesionalų komanda', 'Susipažinkite su mūsų profesionalų komanda, kuri padės jums rasti ir įsigyti tinkamą automobilį.', 'Visa komanda', '/team', NULL, 4, true, NULL);
