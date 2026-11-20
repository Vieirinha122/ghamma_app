import './LandingPage.css'

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="lp-header">
        <div className="lp-shell lp-nav">
          <a className="lp-brand" href="#inicio" aria-label="Ghamma Volley — início">
            <img src="/ghamma-logo.png" alt="Ghamma Vôlei" />
          </a>
          <nav aria-label="Navegação principal">
            <a href="#metodologia">Metodologia</a>
            <a href="#evolucao">Evolução</a>
            <a className="lp-nav-action" href="#aula">Aula experimental</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="lp-hero" id="inicio">
          <div className="lp-shell lp-hero-grid">
            <div className="lp-hero-copy">
              <h1>Seu jogo muda aqui.</h1>
              <p>
                Fundamentos, preparo físico e leitura de jogo para quem quer evoluir no vôlei,
                começando do próprio nível.
              </p>
              <div className="lp-actions">
                <a className="lp-button lp-primary" href="#aula">
                  Quero fazer uma aula experimental <ArrowIcon />
                </a>
                <a className="lp-button lp-secondary" href="#metodologia">Conhecer o treinamento</a>
              </div>
              <span className="lp-signature">CT Ghamma Volley · Juntas pelo Vôlei!</span>
            </div>

            <div className="lp-brand-stage" aria-label="Logo oficial do Ghamma Vôlei">
              <span className="lp-orbit lp-orbit-one" aria-hidden="true" />
              <span className="lp-orbit lp-orbit-two" aria-hidden="true" />
              <img src="/ghamma-logo.png" alt="Ghamma Vôlei" />
            </div>
          </div>
        </section>

        <section className="lp-pillars" aria-label="Focos do treinamento">
          <div className="lp-shell">
            <span>Fundamentos bem treinados</span>
            <span>Evolução no seu ritmo</span>
            <span>Time que cresce junto</span>
          </div>
        </section>

        <section className="lp-section" id="metodologia">
          <div className="lp-shell lp-method-grid">
            <div>
              <h2>Mais intenção em cada toque.</h2>
              <p className="lp-lead">
                Treinar é entender o movimento, ganhar confiança e levar a decisão certa para o jogo.
              </p>
            </div>
            <div className="lp-method-list">
              <article>
                <strong>Fundamentos e técnica</strong>
                <p>Passe, levantamento, ataque, bloqueio e defesa trabalhados com atenção à execução.</p>
              </article>
              <article>
                <strong>Desempenho em quadra</strong>
                <p>Agilidade, impulsão e condicionamento aplicados às exigências reais do voleibol.</p>
              </article>
              <article>
                <strong>Leitura e confiança</strong>
                <p>Exercícios que aproximam fundamento e jogo para melhorar reação e posicionamento.</p>
              </article>
              <article>
                <strong>Comunidade e união</strong>
                <p>Um ambiente acolhedor e competitivo, onde a evolução individual fortalece o time.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="lp-section lp-evolution" id="evolucao">
          <div className="lp-shell">
            <h2>Da primeira manchete à confiança no jogo.</h2>
            <p className="lp-lead">A evolução acontece sem pular as etapas que sustentam cada jogada.</p>
            <div className="lp-steps">
              <article><span>1</span><strong>Comece pela base</strong><p>Entenda posições, gestos e fundamentos essenciais.</p></article>
              <article><span>2</span><strong>Ganhe consistência</strong><p>Corrija detalhes e transforme repetição em segurança.</p></article>
              <article><span>3</span><strong>Leve para a quadra</strong><p>Conecte fundamento, leitura e decisão em situações de jogo.</p></article>
            </div>
          </div>
        </section>

        <section className="lp-section" id="aula">
          <div className="lp-shell lp-audience-grid">
            <div>
              <h2>Há espaço para o seu momento.</h2>
              <p className="lp-lead">Você não precisa chegar pronta. Precisa chegar com vontade de aprender, retomar ou avançar.</p>
            </div>
            <ul>
              <li><CheckIcon /> Aprender vôlei com uma base técnica clara</li>
              <li><CheckIcon /> Corrigir fundamentos e ganhar consistência</li>
              <li><CheckIcon /> Ter mais preparo e confiança para entrar em quadra</li>
              <li><CheckIcon /> Evoluir em grupo e fortalecer o time</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-shell">
          <img src="/ghamma-logo.png" alt="Ghamma Vôlei" />
          <p>CT Ghamma Volley · Juntas pelo Vôlei!</p>
        </div>
      </footer>
    </div>
  )
}
