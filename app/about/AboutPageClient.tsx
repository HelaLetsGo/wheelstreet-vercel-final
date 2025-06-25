"use client"

import TeamSection from "@/components/team-section"
import { Shield, CreditCard, Zap, Award, Users, Clock, Star, Lightbulb, Heart } from "lucide-react"
import { LocalBusinessJsonLd } from "@/components/json-ld"

export default function AboutPageClient() {
  return (
    <>
      <LocalBusinessJsonLd />

      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="mb-4 text-3xl sm:text-4xl font-bold">Apie mus</h1>
          <p className="mb-12 max-w-2xl text-foreground/70">
            Susipažinkite su WHEELSTREET – įmone, kuri keičia automobilių įsigijimo procesą Lietuvoje.
          </p>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold">Mūsų istorija</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  WheelStreet – tai naujoviškas požiūris į automobilio pirkimą. Mūsų komanda padeda išsirinkti būtent tą
                  automobilį, kuris geriausiai atitiks Jūsų poreikius.
                </p>
                <p>
                  Siekiame klientams rasti geriausius pasiūlymus ne tik automobiliui, bet ir jo išlaikymui:
                  palankiausias lizingo sąlygas, draudimo kainas ir techninės priežiūros sprendimus.
                </p>
                <p>
                  Mūsų tikslas – kad kuo daugiau naujų automobilių riedėtų Lietuvos keliais. Naujas automobilis suteikia
                  ne tik ramybę ir komfortą, bet ir užtikrina didesnį saugumą.
                </p>
                <p className="mt-4">
                  WheelStreet buvo įkurta siekiant pakeisti tradicinį automobilių įsigijimo procesą Lietuvoje. Mūsų
                  steigėjai, turintys ilgametę patirtį automobilių pramonėje, pastebėjo, kad klientai dažnai susiduria
                  su skaidrumo trūkumu, sudėtingais procesais ir ribotu pasirinkimu.
                </p>
                <p>
                  Mes pradėjome nuo nedidelės komandos, kuri buvo pasiryžusi sukurti naują standartą automobilių
                  įsigijimo srityje. Mūsų vizija buvo paprasta – sukurti platformą, kuri būtų skaidri, patogi naudoti ir
                  teiktų išskirtinį klientų aptarnavimą.
                </p>
              </div>

              <h2 className="mt-12 mb-6 text-2xl font-bold">Mūsų misija</h2>
              <p className="text-foreground/80">
                Suteiksime malonų automobilio pirkimo ar pardavimo procesą, pakonsultuosime visose sudėtingose
                situacijose net ir po automobilio pardavimo, kad viskas, kas liktų Jums – džiaugtis parduotu ar įsigytu
                automobiliu.
              </p>
              <p className="mt-4 text-foreground/80">
                Mūsų misija – suteikti klientams sklandžią ir malonią automobilių įsigijimo patirtį, pagrįstą skaidrumu,
                profesionalumu ir asmeniniu dėmesiu. Mes tikime, kad kiekvienas klientas nusipelno aukščiausios kokybės
                paslaugų ir individualaus požiūrio.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-sm border border-border bg-background/30 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-bold uppercase">KUO MES SKIRIAMĖS</h3>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-foreground">•</span>
                    <span>Visapusiška pagalba perkant ir parduodant automobilius</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-foreground">•</span>
                    <span>Geriausios garantijos perkant naudotą automobilį</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-foreground">•</span>
                    <span>Visapusis skaidrumas parduodant ar įsigyjant automobilį</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-foreground">•</span>
                    <span>Profesionalus automobilio atstovavimas</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col rounded-sm border border-border p-5 bg-background/30">
                  <Award className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Profesionalumas</h3>
                  <p className="text-sm text-foreground/70">Ilgametė patirtis automobilių sektoriuje</p>
                </div>
                <div className="flex flex-col rounded-sm border border-border p-5 bg-background/30">
                  <Clock className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Efektyvumas</h3>
                  <p className="text-sm text-foreground/70">Taupome Jūsų laiką ir pinigus</p>
                </div>
                <div className="flex flex-col rounded-sm border border-border p-5 bg-background/30">
                  <Users className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Individualumas</h3>
                  <p className="text-sm text-foreground/70">Personalizuoti sprendimai kiekvienam</p>
                </div>
                <div className="flex flex-col rounded-sm border border-border p-5 bg-background/30">
                  <Shield className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Patikimumas</h3>
                  <p className="text-sm text-foreground/70">Skaidrūs procesai ir garantijos</p>
                </div>
              </div>

              <div className="mt-6 rounded-sm border border-border p-6 bg-background/30">
                <h3 className="mb-4 text-xl font-bold">MŪSŲ VERTYBĖS</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Kokybė</h4>
                      <p className="text-foreground/70">
                        Mes nesitaikstome su vidutiniškumu – kiekvienas automobilis ir paslauga turi atitikti
                        aukščiausius kokybės standartus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Inovacijos</h4>
                      <p className="text-foreground/70">
                        Nuolat ieškome naujų būdų, kaip pagerinti savo paslaugas ir klientų patirtį, diegdami
                        pažangiausias technologijas ir procesus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Rūpestis klientais</h4>
                      <p className="text-foreground/70">
                        Mūsų klientai yra mūsų prioritetas. Mes įsiklausome į jų poreikius ir stengiamės viršyti jų
                        lūkesčius kiekviename žingsnyje.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Pagrindinės paslaugos</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              <div className="rounded-sm border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <Shield className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-bold">AUTOMOBILIŲ ĮSIGIJIMAS</h3>
                <p className="text-foreground/70">
                  Randame tobulą automobilį pagal Jūsų poreikius ir pasirūpiname sklandžiu įsigijimo procesu.
                </p>
              </div>
              <div className="rounded-sm border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CreditCard className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-bold">FINANSAVIMAS</h3>
                <p className="text-foreground/70">
                  Užtikriname palankiausias lizingo sąlygas ir palūkanų normas bendradarbiaudami su patikimais
                  partneriais.
                </p>
              </div>
              <div className="rounded-sm border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <Zap className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-bold">ELEKTROMOBILIAI</h3>
                <p className="text-foreground/70">
                  Visapusiška pagalba pereinant prie elektromobilių, įskaitant valstybės subsidijas ir įkrovimo
                  infrastruktūrą.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-16 bg-section-bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 pb-16">
            <h2 className="mb-12 text-2xl font-bold text-center">Susipažinkite su mūsų komanda</h2>
            <TeamSection />
          </div>
        </div>
      </div>
    </>
  )
}
