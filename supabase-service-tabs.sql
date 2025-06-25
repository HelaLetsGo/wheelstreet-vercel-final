-- Create a table for service tabs
CREATE TABLE IF NOT EXISTS service_tabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES page_sections(id),
  tab_id VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  short_desc TEXT,
  full_desc TEXT,
  icon VARCHAR,
  order INTEGER,
  is_active BOOLEAN DEFAULT true,
  benefits JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_service_tabs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for service_tabs
CREATE TRIGGER update_service_tabs_updated_at
BEFORE UPDATE ON service_tabs
FOR EACH ROW
EXECUTE PROCEDURE update_service_tabs_updated_at();

-- Add RLS policies for service_tabs
ALTER TABLE service_tabs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Admins can do everything with service_tabs" ON service_tabs
FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for anonymous users to read active tabs
CREATE POLICY "Anonymous users can read active service_tabs" ON service_tabs
FOR SELECT TO anon
USING (is_active = true);

-- Insert sample data for service tabs
INSERT INTO service_tabs (section_id, tab_id, title, short_desc, full_desc, icon, order, is_active, benefits)
VALUES 
((SELECT id FROM page_sections WHERE section_type = 'services' LIMIT 1), 'acquisition', 'AUTOMOBILIŲ ĮSIGIJIMAS', 'Randame tobulą automobilį pagal jūsų poreikius ir pasirūpiname sklandžiu įsigijimo procesu.', 'Mūsų paslauga apima visą procesą nuo konsultacijos iki automobilio pristatymo. Išanalizuojame jūsų poreikius, biudžetą ir pageidavimus, tada pateikiame kruopščiai atrinktus variantus.', 'Shield', 1, true, '["Prieiga prie išskirtinių modelių", "Profesionalios derybos, sutaupančios 5-15% kainos", "Visų dokumentų tvarkymas", "Automobilio pristatymas jūsų nurodytoje vietoje"]'),
((SELECT id FROM page_sections WHERE section_type = 'services' LIMIT 1), 'financing', 'FINANSAVIMAS', 'Užtikriname palankiausias lizingo sąlygas ir palūkanų normas bendradarbiaudami su patikimais partneriais.', 'Mūsų finansavimo ekspertai dirba su visais pagrindiniais bankais ir lizingo kompanijomis, kad užtikrintų jums palankiausias sąlygas.', 'CreditCard', 2, true, '["Mažesnės nei rinkos palūkanų normos", "Lankstūs mokėjimo planai", "Galimybė keisti automobilį anksčiau", "Skaidrus procesas be paslėptų mokesčių"]'),
((SELECT id FROM page_sections WHERE section_type = 'services' LIMIT 1), 'insurance', 'DRAUDIMAS', 'Pasiūlome optimalius KASKO ir civilinės atsakomybės draudimo paketus už konkurencingą kainą.', 'Bendradarbiaujame su patikimais draudimo brokeriais, kad užtikrintume visapusišką jūsų automobilio apsaugą.', 'FileText', 3, true, '["Išsamus KASKO draudimas su papildomomis apsaugomis", "Pagreitintas žalų administravimas", "GAP draudimas", "Specialios sąlygos premium automobilių savininkams"]'),
((SELECT id FROM page_sections WHERE section_type = 'services' LIMIT 1), 'ev', 'ELEKTROMOBILIAI', 'Visapusiška pagalba pereinant prie elektromobilių, įskaitant valstybės subsidijas ir įkrovimo infrastruktūrą.', 'Mūsų elektromobilių sprendimai padeda jums sklandžiai pereiti prie elektrinės mobilumo. Konsultuojame dėl tinkamiausio elektromobilio pasirinkimo.', 'Zap', 4, true, '["Ekspertų konsultacijos dėl elektromobilių pasirinkimo", "Pagalba gaunant valstybės subsidijas (iki 5000 €)", "Namų įkrovimo stotelių įrengimas", "Prieiga prie specialių elektromobilių finansavimo programų"]');
