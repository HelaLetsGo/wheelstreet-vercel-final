import { Battery, Zap, CreditCard, Home } from "lucide-react"

export default function EVSection() {
  return (
    <section id="ev-solutions" className="relative bg-black py-16 md:py-24">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="grid gap-12 md:gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight md:text-4xl">ELEKTROMOBILIAI</h2>
            <p className="mb-6 max-w-xl text-base md:text-lg text-white/80">
              Aukščiausios klasės konsultacijos ir sprendimai pereinant prie elektrinės mobilumo. Nuo valstybės
              subsidijų iki išskirtinių elektrinių modelių – mes pasirūpiname visais aspektais.
            </p>

            {/* Replaced image with colored div */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-gradient-to-br from-gray-800 to-gray-900 mb-6"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center border border-white/10 bg-black/30 p-5 text-center backdrop-blur-sm rounded-sm hover:border-white/20 transition-colors">
                <Battery className="mb-3 h-8 w-8 text-white" />
                <h3 className="mb-2 text-lg font-bold text-white">DIDELIS NUVAŽIUOJAMAS ATSTUMAS</h3>
                <p className="text-sm text-white/70">Naujausi modeliai su 500+ km nuvažiuojamu atstumu</p>
              </div>

              <div className="flex flex-col items-center border border-white/10 bg-black/30 p-5 text-center backdrop-blur-sm rounded-sm hover:border-white/20 transition-colors">
                <Zap className="mb-3 h-8 w-8 text-white" />
                <h3 className="mb-2 text-lg font-bold text-white">GREITAS ĮKROVIMAS</h3>
                <p className="text-sm text-white/70">80% baterijos įkrovimas per mažiau nei 30 minučių</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-white/10 bg-black/30 p-6 md:p-8 backdrop-blur-sm rounded-sm hover:border-white/20 transition-colors">
              <h3 className="mb-4 text-xl font-bold uppercase">VALSTYBĖS SUBSIDIJOS</h3>
              <p className="mb-4 text-white/80">Padedame pasinaudoti visomis galimomis valstybės subsidijomis:</p>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <CreditCard className="mt-1 h-5 w-5 text-white/60 shrink-0" />
                  <span>Iki 5 000 € subsidija naujiems elektromobiliams</span>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard className="mt-1 h-5 w-5 text-white/60 shrink-0" />
                  <span>Iki 2 500 € subsidija naudotiems elektromobiliams</span>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard className="mt-1 h-5 w-5 text-white/60 shrink-0" />
                  <span>PVM lengvatos verslams, perkantiems elektromobilius</span>
                </li>
              </ul>
              <p className="mt-4 text-white/80">
                Tvarkome visą paraiškų teikimo procesą jūsų vardu, užtikrindami maksimalią finansinę naudą.
              </p>
            </div>

            <div className="border border-white/10 bg-black/30 p-6 md:p-8 backdrop-blur-sm rounded-sm hover:border-white/20 transition-colors">
              <h3 className="mb-4 text-xl font-bold uppercase">ĮKROVIMO SPRENDIMAI</h3>
              <div className="flex gap-5">
                <Home className="h-10 w-10 text-white/60 shrink-0" />
                <div>
                  <h4 className="mb-2 text-lg font-bold text-white">NAMŲ ĮKROVIMO STOTELĖS</h4>
                  <p className="text-white/80">
                    Organizuojame įkrovimo stotelių įrengimą jūsų namuose ar daugiabučiuose. Įvertiname elektros
                    pajėgumus, rekomenduojame tinkamą įrangą ir koordinuojame profesionalų montavimą.
                  </p>
                </div>
              </div>

              <button className="mt-6 w-full border border-white bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black">
                Elektromobilių konsultacija
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
