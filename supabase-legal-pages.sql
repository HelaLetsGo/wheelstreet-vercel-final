-- Create a table for legal pages content
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_legal_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for legal_pages
CREATE TRIGGER update_legal_pages_updated_at
BEFORE UPDATE ON legal_pages
FOR EACH ROW
EXECUTE PROCEDURE update_legal_pages_updated_at();

-- Add RLS policies for legal_pages
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Admins can do everything with legal_pages" ON legal_pages
FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for anonymous users to read active pages
CREATE POLICY "Anonymous users can read active legal_pages" ON legal_pages
FOR SELECT TO anon
USING (is_active = true);

-- Insert initial data for legal pages
INSERT INTO legal_pages (page_type, title, content, last_updated)
VALUES 
('privacy', 'Privatumo politika', 
'<h1 class="mb-6 text-3xl sm:text-4xl font-bold">Privatumo politika</h1>
<p class="mb-8 text-foreground/70">Paskutinį kartą atnaujinta: 2023 m. balandžio 18 d.</p>

<div class="prose prose-invert max-w-none">
  <p>
    UAB „WheelStreet" (toliau – „mes", „mus" arba „mūsų") administruoja svetainę wheelstreet.lt (toliau –
    „Svetainė"). Šiame puslapyje informuojame apie asmens duomenų, kuriuos renkame iš Svetainės naudotojų,
    tvarkymo politiką.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">1. Kokius duomenis renkame</h2>
  <p>Mes renkame šiuos asmens duomenis:</p>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>
      Kontaktinę informaciją (vardą, el. paštą, telefono numerį), kurią pateikiate užpildydami mūsų kontaktinę
      formą;
    </li>
    <li>Informaciją apie jūsų domėjimosi sritį (pvz., kokios automobilių paslaugos jus domina);</li>
    <li>
      Techninę informaciją, tokią kaip IP adresas, naršyklės tipas ir versija, laiko juosta, operacinė sistema
      ir platforma;
    </li>
    <li>
      Informaciją apie jūsų apsilankymą, įskaitant pilną URL srautą, per kurį patekote į mūsų svetainę ir iš
      jos išėjote, peržiūrėtus ar ieškotus produktus, puslapių atsakymo laikus, atsisiuntimo klaidas,
      apsilankymo trukmę tam tikruose puslapiuose.
    </li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">2. Kaip naudojame jūsų duomenis</h2>
  <p>Jūsų pateiktus duomenis naudojame šiais tikslais:</p>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>Teikti jums mūsų paslaugas ir atsakyti į jūsų užklausas;</li>
    <li>
      Pateikti jums informaciją apie mūsų produktus ir paslaugas, kurios, mūsų manymu, gali jus dominti;
    </li>
    <li>Informuoti jus apie mūsų paslaugų pakeitimus;</li>
    <li>Tobulinti mūsų svetainę ir klientų aptarnavimą;</li>
    <li>
      Administruoti mūsų svetainę ir vidines operacijas, įskaitant trikčių šalinimą, duomenų analizę,
      testavimą, statistiką ir apklausas.
    </li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">3. Duomenų saugojimas</h2>
  <p>
    Jūsų asmens duomenys bus saugomi tik tiek laiko, kiek reikia tikslams, dėl kurių asmens duomenys buvo
    surinkti, pasiekti. Kontaktinės formos duomenys saugomi ne ilgiau kaip 3 metus nuo paskutinio jūsų
    kontakto su mumis.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">4. Duomenų dalijimasis</h2>
  <p>
    Mes neparduodame, nenuomojame ir nekeičiame jūsų asmeninės informacijos su trečiosiomis šalimis. Mes
    galime dalytis jūsų duomenimis su:
  </p>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>Mūsų paslaugų teikėjais, kurie teikia IT ir sistemos administravimo paslaugas;</li>
    <li>Profesionaliais patarėjais, įskaitant teisininkus, bankierius, auditorius ir draudikus;</li>
    <li>
      Mokesčių ir muitinės institucijomis, reguliavimo ir kitomis institucijomis, kurios reikalauja pranešti
      apie apdorojimo veiklą tam tikromis aplinkybėmis.
    </li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">5. Jūsų teisės</h2>
  <p>Pagal Bendrąjį duomenų apsaugos reglamentą (BDAR) jūs turite šias teises:</p>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>Teisę gauti informaciją apie jūsų asmens duomenų tvarkymą;</li>
    <li>Teisę susipažinti su savo asmens duomenimis;</li>
    <li>Teisę reikalauti ištaisyti netikslius asmens duomenis;</li>
    <li>Teisę reikalauti ištrinti asmens duomenis;</li>
    <li>Teisę apriboti asmens duomenų tvarkymą;</li>
    <li>Teisę į duomenų perkeliamumą;</li>
    <li>Teisę nesutikti su asmens duomenų tvarkymu;</li>
    <li>Teisę nesutikti su asmens duomenų tvarkymu tiesioginės rinkodaros tikslais;</li>
    <li>Teisę pateikti skundą priežiūros institucijai.</li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">6. Slapukai</h2>
  <p>
    Mūsų svetainėje naudojami slapukai, kad pagerintume jūsų naršymo patirtį. Daugiau informacijos apie tai,
    kaip naudojame slapukus, rasite mūsų Slapukų politikoje.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">7. Privatumo politikos pakeitimai</h2>
  <p>
    Mes galime atnaujinti šią privatumo politiką retkarčiais, paskelbdami naują versiją savo svetainėje.
    Turėtumėte retkarčiais patikrinti šį puslapį, kad įsitikintumėte, jog esate patenkinti bet kokiais
    pakeitimais.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">8. Kontaktinė informacija</h2>
  <p>
    Jei turite klausimų apie šią privatumo politiką arba norite pasinaudoti savo teisėmis, susisiekite su
    mumis:
  </p>
  <ul class="list-none space-y-2 mb-6">
    <li>
      El. paštu: <a href="mailto:info@wheelstreet.lt" class="text-primary hover:underline">info@wheelstreet.lt</a>
    </li>
    <li>
      Telefonu: <a href="tel:+37061033377" class="text-primary hover:underline">+37061033377</a>
    </li>
    <li>Adresu: Žirmūnų g. 139-303, LT-09120 Vilnius</li>
  </ul>
</div>', 
'2023-04-18'),

('terms', 'Naudojimosi sąlygos', 
'<h1 class="mb-6 text-3xl sm:text-4xl font-bold">Naudojimosi sąlygos</h1>
<p class="mb-8 text-foreground/70">Paskutinį kartą atnaujinta: 2023 m. balandžio 18 d.</p>

<div class="prose prose-invert max-w-none">
  <p>
    Sveiki atvykę į WheelStreet svetainę. Šios naudojimosi sąlygos apibrėžia taisykles ir nuostatas, kurių
    privaloma laikytis naudojantis mūsų svetaine wheelstreet.lt.
  </p>
  <p>
    Naudodamiesi šia svetaine, jūs patvirtinate, kad sutinkate su šiomis sąlygomis. Jei nesutinkate su šiomis
    sąlygomis, prašome nesinaudoti mūsų svetaine.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">1. Terminai</h2>
  <p>Šiose naudojimosi sąlygose:</p>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>
      "Klientas", "Jūs" ir "Jūsų" reiškia jus, asmenį, besinaudojantį šia svetaine ir sutinkantį su Bendrovės
      sąlygomis;
    </li>
    <li>"Bendrovė", "Mes", "Mūsų" ir "Mus" reiškia UAB "WheelStreet";</li>
    <li>"Šalis", "Šalys" arba "Mes" reiškia tiek Klientą, tiek Bendrovę;</li>
    <li>"Svetainė" reiškia wheelstreet.lt;</li>
    <li>"Paslaugos" reiškia paslaugas, kurias teikiame.</li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">2. Intelektinė nuosavybė</h2>
  <p>
    Svetainė ir jos originalus turinys, funkcijos ir funkcionalumas priklauso UAB "WheelStreet" ir yra saugomi
    tarptautinių autorių teisių, prekių ženklų, patentų, komercinių paslapčių ir kitų intelektinės nuosavybės
    ar nuosavybės teisių įstatymų.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">3. Naudojimosi apribojimai</h2>
  <p>Jūs sutinkate nenaudoti Svetainės:</p>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>Bet kokiu būdu, kuris gali sugadinti, išjungti, perkrauti ar pakenkti Svetainei;</li>
    <li>
      Bet kokiam neteisėtam tikslui ar bet kokiai veiklai, kuri pažeidžia taikomas vietines, valstybines,
      nacionalines ar tarptautines taisykles ar reglamentus;
    </li>
    <li>
      Perduoti bet kokius virusus, Trojos arklius, kirminus, loginių bombų ar kitas kenkėjiškas programas;
    </li>
    <li>Rinkti ar kaupti bet kokią informaciją apie kitus vartotojus, įskaitant el. pašto adresus.</li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">4. Atsakomybės apribojimas</h2>
  <p>
    UAB "WheelStreet" nebus atsakinga už jokius nuostolius ar žalą, kylančią dėl Svetainės naudojimo ar
    negalėjimo ja naudotis, įskaitant, bet neapsiribojant, tiesioginius, netiesioginius, atsitiktinius,
    baudžiamuosius ir pasekminius nuostolius.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">5. Garantijų atsisakymas</h2>
  <p>
    Svetainė ir jos turinys pateikiami "tokie, kokie yra" ir "kaip prieinami" be jokių garantijų, išreikštų ar
    numanomų. UAB "WheelStreet" nesuteikia jokių garantijų dėl Svetainės tikslumo, patikimumo ar turinio.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">6. Nuorodos į trečiųjų šalių svetaines</h2>
  <p>
    Mūsų Svetainėje gali būti nuorodų į trečiųjų šalių svetaines, kurios nėra valdomos UAB "WheelStreet". Mes
    neturime jokios kontrolės ir neprisiimame jokios atsakomybės už bet kokios trečiosios šalies svetainės
    turinį, privatumo politiką ar praktiką.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">7. Taikoma teisė</h2>
  <p>
    Šioms sąlygoms taikomi ir jos aiškinamos pagal Lietuvos Respublikos įstatymus, neatsižvelgiant į jos
    kolizinių normų nuostatas.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">8. Sąlygų pakeitimai</h2>
  <p>
    Mes pasiliekame teisę savo nuožiūra keisti ar pakeisti šias sąlygas bet kuriuo metu. Jei pakeitimas yra
    esminis, mes stengsimės pateikti bent 15 dienų įspėjimą prieš įsigaliojant naujiems terminams.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">9. Kontaktinė informacija</h2>
  <p>Jei turite klausimų apie šias naudojimosi sąlygas, susisiekite su mumis:</p>
  <ul class="list-none space-y-2 mb-6">
    <li>
      El. paštu: <a href="mailto:info@wheelstreet.lt" class="text-primary hover:underline">info@wheelstreet.lt</a>
    </li>
    <li>
      Telefonu: <a href="tel:+37061033377" class="text-primary hover:underline">+37061033377</a>
    </li>
    <li>Adresu: Žirmūnų g. 139-303, LT-09120 Vilnius</li>
  </ul>

  <p class="mt-8">
    Naudodamiesi šia svetaine, jūs patvirtinate, kad perskaitėte, supratote ir sutinkate laikytis šių
    naudojimosi sąlygų.
  </p>
</div>', 
'2023-04-18'),

('cookies', 'Slapukų politika', 
'<h1 class="mb-6 text-3xl sm:text-4xl font-bold">Slapukų politika</h1>
<p class="mb-8 text-foreground/70">Paskutinį kartą atnaujinta: 2023 m. balandžio 18 d.</p>

<div class="prose prose-invert max-w-none">
  <p>
    Šioje slapukų politikoje paaiškiname, kaip UAB "WheelStreet" (toliau – "mes", "mus" arba "mūsų") naudoja
    slapukus ir panašias technologijas svetainėje wheelstreet.lt (toliau – "Svetainė").
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">1. Kas yra slapukai</h2>
  <p>
    Slapukai yra maži tekstiniai failai, kuriuos jūsų naršyklė patalpina jūsų įrenginyje. Jie plačiai
    naudojami, kad svetainės veiktų arba veiktų efektyviau, taip pat teiktų informaciją svetainės savininkams.
    Slapukai leidžia svetainei atpažinti jūsų įrenginį ir įsiminti informaciją apie jūsų apsilankymą (pvz.,
    pageidaujamą kalbą, šrifto dydį ir kitas rodymo nuostatas).
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">2. Kokius slapukus naudojame</h2>
  <p>Mūsų svetainėje naudojame šių kategorijų slapukus:</p>

  <h3 class="text-xl font-bold mt-6 mb-3">Būtinieji slapukai</h3>
  <p>
    Šie slapukai yra būtini, kad svetainė veiktų tinkamai. Jie įgalina pagrindines funkcijas, tokias kaip
    puslapio navigacija ir prieiga prie saugių svetainės sričių. Svetainė negali tinkamai funkcionuoti be šių
    slapukų.
  </p>
  <table class="border-collapse w-full my-4">
    <thead>
      <tr class="bg-zinc-800">
        <th class="border border-zinc-700 p-2 text-left">Pavadinimas</th>
        <th class="border border-zinc-700 p-2 text-left">Tikslas</th>
        <th class="border border-zinc-700 p-2 text-left">Galiojimo laikas</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-zinc-700 p-2">session</td>
        <td class="border border-zinc-700 p-2">Išsaugo vartotojo sesijos būseną</td>
        <td class="border border-zinc-700 p-2">Sesijos metu</td>
      </tr>
      <tr>
        <td class="border border-zinc-700 p-2">XSRF-TOKEN</td>
        <td class="border border-zinc-700 p-2">Apsaugo nuo CSRF atakų</td>
        <td class="border border-zinc-700 p-2">Sesijos metu</td>
      </tr>
    </tbody>
  </table>

  <h3 class="text-xl font-bold mt-6 mb-3">Analitiniai slapukai</h3>
  <p>
    Šie slapukai renka informaciją apie tai, kaip lankytojai naudoja mūsų svetainę. Jie padeda mums suprasti,
    kurie puslapiai yra populiariausi, matyti, kaip lankytojai naršo svetainėje, ir pagerinti vartotojo
    patirtį.
  </p>
  <table class="border-collapse w-full my-4">
    <thead>
      <tr class="bg-zinc-800">
        <th class="border border-zinc-700 p-2 text-left">Pavadinimas</th>
        <th class="border border-zinc-700 p-2 text-left">Tikslas</th>
        <th class="border border-zinc-700 p-2 text-left">Galiojimo laikas</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-zinc-700 p-2">_ga</td>
        <td class="border border-zinc-700 p-2">
          Registruoja unikalų ID, kuris naudojamas statistiniams duomenims apie tai, kaip lankytojas naudojasi
          svetaine, generuoti
        </td>
        <td class="border border-zinc-700 p-2">2 metai</td>
      </tr>
      <tr>
        <td class="border border-zinc-700 p-2">_gat</td>
        <td class="border border-zinc-700 p-2">Naudojamas Google Analytics riboti užklausų skaičių</td>
        <td class="border border-zinc-700 p-2">1 diena</td>
      </tr>
      <tr>
        <td class="border border-zinc-700 p-2">_gid</td>
        <td class="border border-zinc-700 p-2">
          Registruoja unikalų ID, kuris naudojamas statistiniams duomenims apie tai, kaip lankytojas naudojasi
          svetaine, generuoti
        </td>
        <td class="border border-zinc-700 p-2">1 diena</td>
      </tr>
    </tbody>
  </table>

  <h3 class="text-xl font-bold mt-6 mb-3">Funkciniai slapukai</h3>
  <p>
    Šie slapukai leidžia svetainei teikti išplėstinį funkcionalumą ir personalizaciją. Juos gali nustatyti mes
    arba trečiųjų šalių paslaugų teikėjai, kurių paslaugas pridėjome į savo puslapius.
  </p>
  <table class="border-collapse w-full my-4">
    <thead>
      <tr class="bg-zinc-800">
        <th class="border border-zinc-700 p-2 text-left">Pavadinimas</th>
        <th class="border border-zinc-700 p-2 text-left">Tikslas</th>
        <th class="border border-zinc-700 p-2 text-left">Galiojimo laikas</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-zinc-700 p-2">sidebar:state</td>
        <td class="border border-zinc-700 p-2">Išsaugo vartotojo nuostatas dėl šoninės juostos rodymo</td>
        <td class="border border-zinc-700 p-2">7 dienos</td>
      </tr>
    </tbody>
  </table>

  <h2 class="text-2xl font-bold mt-8 mb-4">3. Kaip valdyti slapukus</h2>
  <p>
    Dauguma naršyklių leidžia jums kontroliuoti slapukus per savo nuostatas. Tačiau atkreipkite dėmesį, kad
    atsisakius kai kurių slapukų, svetainė gali neveikti tinkamai.
  </p>
  <p>
    Jūs galite ištrinti jau esančius slapukus iš savo įrenginio ir nustatyti daugumą naršyklių blokuoti
    slapukų gavimą. Tačiau tokiu atveju jums gali tekti rankiniu būdu koreguoti kai kurias nuostatas kiekvieną
    kartą apsilankius svetainėje, o kai kurios paslaugos ir funkcijos gali neveikti.
  </p>

  <h3 class="text-xl font-bold mt-6 mb-3">Kaip išjungti slapukus populiariausiose naršyklėse:</h3>
  <ul class="list-disc pl-6 space-y-2 mb-6">
    <li>
      <strong>Chrome:</strong> Nustatymai → Išplėstiniai → Privatumas ir saugumas → Svetainių nustatymai →
      Slapukai ir svetainių duomenys
    </li>
    <li>
      <strong>Firefox:</strong> Nustatymai → Privatumas ir saugumas → Slapukai ir svetainių duomenys
    </li>
    <li>
      <strong>Safari:</strong> Nuostatos → Privatumas → Slapukai ir svetainių duomenys
    </li>
    <li>
      <strong>Edge:</strong> Nustatymai → Slapukai ir svetainių leidimai
    </li>
  </ul>

  <h2 class="text-2xl font-bold mt-8 mb-4">4. Slapukų politikos pakeitimai</h2>
  <p>
    Mes galime atnaujinti šią slapukų politiką retkarčiais, paskelbdami naują versiją savo svetainėje.
    Turėtumėte retkarčiais patikrinti šį puslapį, kad įsitikintumėte, jog esate patenkinti bet kokiais
    pakeitimais.
  </p>

  <h2 class="text-2xl font-bold mt-8 mb-4">5. Kontaktinė informacija</h2>
  <p>Jei turite klausimų apie mūsų slapukų naudojimą, susisiekite su mumis:</p>
  <ul class="list-none space-y-2 mb-6">
    <li>
      El. paštu: <a href="mailto:info@wheelstreet.lt" class="text-primary hover:underline">info@wheelstreet.lt</a>
    </li>
    <li>
      Telefonu: <a href="tel:+37061033377" class="text-primary hover:underline">+37061033377</a>
    </li>
    <li>Adresu: Žirmūnų g. 139-303, LT-09120 Vilnius</li>
  </ul>
</div>', 
'2023-04-18');
