-- Team Members Table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  image_path VARCHAR,
  bio TEXT[],
  contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR NOT NULL,
  interest VARCHAR,
  status VARCHAR DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Initial seed data for team members
INSERT INTO team_members (member_id, name, position, image_path, bio, contact)
VALUES 
('julius-jankauskas', 'Julius Jankauskas', 'CEO', '/team/julius-jankauskas.jpg', 
 ARRAY['Julius yra WHEELSTREET įkūrėjas ir vadovas.', 'Jis turi daugiau nei 10 metų patirties automobilių versle.'], 
 '{"email": "julius@wheelstreet.lt", "phone": "+37061033377"}'
),
('vainius-mirskis', 'Vainius Mirskis', 'COO', '/team/vainius-mirskis.jpg', 
 ARRAY['Vainius yra WHEELSTREET operacijų vadovas.', 'Jis specializuojasi automobilių vertinime ir derybose.'], 
 '{"email": "vainius@wheelstreet.lt", "phone": "+37061033377"}'
),
('mantas-jauga', 'Mantas Jauga', 'Automobilių konsultantas', '/team/mantas-jauga.jpg', 
 ARRAY['Mantas yra WHEELSTREET automobilių konsultantas.', 'Jis padeda klientams išsirinkti tinkamiausią automobilį pagal jų poreikius.'], 
 '{"email": "mantas@wheelstreet.lt", "phone": "+37061033377"}'
),
('vytautas-balodas', 'Vytautas Balodas', 'Finansų ekspertas', '/team/vytautas-balodas.jpg', 
 ARRAY['Vytautas yra WHEELSTREET finansų ekspertas.', 'Jis padeda klientams gauti optimaliausias finansavimo sąlygas.'], 
 '{"email": "vytautas@wheelstreet.lt", "phone": "+37061033377"}'
),
('nedas-mockevicius', 'Nedas Mockevičius', 'Elektromobilių specialistas', '/team/nedas-mockevicius.jpg', 
 ARRAY['Nedas yra WHEELSTREET elektromobilių specialistas.', 'Jis konsultuoja klientus elektromobilių įsigijimo ir eksploatavimo klausimais.'], 
 '{"email": "nedas@wheelstreet.lt", "phone": "+37061033377"}'
),
('martynas-linge', 'Martynas Lingė', 'Automobilių konsultantas', '/team/martynas-linge.jpg', 
 ARRAY['Martynas yra WHEELSTREET automobilių konsultantas.', 'Jis padeda klientams išsirinkti tinkamiausią automobilį pagal jų poreikius.'], 
 '{"email": "martynas@wheelstreet.lt", "phone": "+37061033377"}'
);

-- Create row level security policies
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admins)
CREATE POLICY "Admins can do everything with team_members" ON team_members
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything with leads" ON leads
FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for anonymous users (can only insert leads)
CREATE POLICY "Anonymous users can insert leads" ON leads
FOR INSERT WITH CHECK (auth.role() = 'anon');
