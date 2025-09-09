<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lifeline Legacy Financial Group — Protecting Families, Building Legacies</title>
  <meta name="description" content="Lifeline Legacy Financial Group helps families with life insurance with living benefits, mortgage protection, IUL-based retirement, estate planning resources, and financial literacy workshops across DFW." />
  <meta property="og:title" content="Lifeline Legacy Financial Group" />
  <meta property="og:description" content="Protecting Families — Building Legacies" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="" />
  <meta name="theme-color" content="#065f46" />

  <!-- Fonts (system stack for speed) -->
  <style>
    :root{
      --emerald:#065f46;/* deep emerald */
      --emerald-500:#10b981;/* accent */
      --gold:#d4af37;/* brand gold */
      --ink:#0b1320;/* near-black */
      --slate:#4b5563;/* gray text */
      --cloud:#f8fafc;/* bg */
      --card:#ffffff;/* card bg */
      --muted:#eef2f7;/* light border */
      --ring: 0 0 0 4px rgba(16,185,129,.15);
      --shadow: 0 10px 30px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06);
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji";
      color:var(--ink); background: radial-gradient(1200px 600px at 80% -10%, rgba(16,185,129,.06), transparent 60%) , var(--cloud);
      line-height:1.6;
    }
    a{color:var(--emerald-500); text-decoration:none}
    a:hover{opacity:.9}
    img{max-width:100%; display:block}
    .container{width:min(1140px, 92vw); margin-inline:auto}

    /* Header */
    header{position:sticky; top:0; z-index:50; background:rgba(255,255,255,.9); backdrop-filter:saturate(180%) blur(10px); border-bottom:1px solid #e5e7eb}
    .nav{display:flex; align-items:center; justify-content:space-between; padding:14px 0}
    .brand{display:flex; gap:12px; align-items:center}
    .logo{width:42px; aspect-ratio:1; border-radius:12px; background:linear-gradient(135deg, var(--emerald), #0ea5a4); display:grid; place-items:center; color:#fff; font-weight:700; box-shadow:var(--shadow)}
    .brand h1{font-size:1.05rem; margin:0; letter-spacing:.3px}
    nav ul{display:flex; gap:18px; list-style:none; margin:0; padding:0}
    nav a{font-weight:600; color:var(--ink)}
    .cta{display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg, var(--gold), #f4d06f); color:#201a00; padding:10px 16px; font-weight:700; border-radius:12px; box-shadow:var(--shadow)}
    .cta:hover{transform:translateY(-1px)}

    /* Hero */
    .hero{padding:64px 0 36px;}
    .hero .wrap{display:grid; grid-template-columns: 1.2fr .8fr; gap:36px; align-items:center}
    .eyebrow{display:inline-block; font-size:.8rem; letter-spacing:.12em; text-transform:uppercase; color:var(--emerald); background:#e8fff6; padding:6px 10px; border-radius:999px; border:1px solid #b7f2d9}
    h2.hero-title{font-size:clamp(1.9rem, 2.6vw + 1rem, 3rem); line-height:1.15; margin:14px 0}
    .lead{color:var(--slate); font-size:1.05rem}
    .hero-cta{display:flex; gap:14px; margin-top:20px; flex-wrap:wrap}
    .btn{display:inline-flex; align-items:center; gap:10px; padding:12px 18px; border-radius:12px; font-weight:700; border:1px solid transparent; box-shadow:var(--shadow)}
    .btn.primary{background:linear-gradient(135deg, var(--emerald), #0ea5a4); color:#fff}
    .btn.secondary{background:#fff; color:var(--ink); border-color:#e5e7eb}
    .trust-row{display:flex; gap:18px; align-items:center; flex-wrap:wrap; margin-top:22px; color:#334155; font-size:.9rem}
    .trust-badge{display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px dashed #cbd5e1; border-radius:12px; background:#fff}

    .hero-card{background: linear-gradient(180deg, #ffffff, #fcfdff); border:1px solid #e5e7eb; border-radius:18px; padding:18px; box-shadow:var(--shadow)}
    .metrics{display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-top:8px}
    .metric{background:#fff; border:1px solid #eef2f7; border-radius:14px; padding:16px; text-align:center}
    .metric strong{font-size:1.4rem; color:var(--emerald)}

    /* Sections */
    section{padding:56px 0;}
    .section-head{display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:22px}
    .section-head h3{font-size:1.7rem; margin:0}
    .cards{display:grid; grid-template-columns: repeat(3, 1fr); gap:18px}
    .card{background:var(--card); border:1px solid #e5e7eb; border-radius:16px; padding:18px; box-shadow:var(--shadow)}
    .card h4{margin:8px 0 6px}
    .chip{display:inline-flex; align-items:center; gap:8px; background:#0b132005; padding:6px 10px; border-radius:999px; border:1px solid #e5e7eb; font-size:.85rem}

    /* Process */
    .timeline{display:grid; grid-template-columns: repeat(4, 1fr); gap:14px}
    .step{background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:16px}
    .step .num{width:32px; height:32px; display:grid; place-items:center; border-radius:999px; background:var(--emerald); color:#fff; font-weight:800}

    /* Testimonials */
    .testi{display:grid; grid-template-columns: repeat(3, 1fr); gap:18px}
    .quote{background:linear-gradient(180deg, #ffffff, #fbfbff); border:1px solid #e9eef5; border-radius:16px; padding:18px; box-shadow:var(--shadow)}
    .quote p{margin:.4rem 0 0; color:#334155}

    /* Contact */
    .contact-grid{display:grid; grid-template-columns: 1.1fr .9fr; gap:18px}
    form{display:grid; gap:12px}
    input, textarea{width:100%; border:1px solid #dfe6ee; border-radius:12px; padding:12px 14px; font:inherit; background:#fff}
    input:focus, textarea:focus{outline:none; box-shadow:var(--ring); border-color:#bbf7d0}
    .help{font-size:.9rem; color:#475569}

    /* Footer */
    footer{padding:28px 0 40px; background:#0b1320; color:#e5e7eb}
    .footgrid{display:grid; grid-template-columns: 1.2fr .8fr .8fr; gap:18px}
    .footgrid a{color:#e2e8f0}
    .legal{border-top:1px solid #1f2937; margin-top:20px; padding-top:14px; font-size:.9rem; color:#94a3b8}

    /* Utilities */
    .gold{color:var(--gold)}
    .center{text-align:center}
    .muted{color:#64748b}

    /* Responsive */
    @media (max-width: 980px){
      .hero .wrap{grid-template-columns:1fr;}
      .cards{grid-template-columns:1fr 1fr}
      .timeline{grid-template-columns:1fr 1fr}
      .testi{grid-template-columns:1fr 1fr}
      .contact-grid{grid-template-columns:1fr}
      .footgrid{grid-template-columns:1fr 1fr}
    }
    @media (max-width: 640px){
      nav ul{display:none}
      .cards,.timeline,.testi,.footgrid{grid-template-columns:1fr}
      .metrics{grid-template-columns:1fr 1fr}
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header>
    <div class="container nav">
      <div class="brand">
        <div class="logo" aria-label="Lifeline L logo">LL</div>
        <div>
          <h1>Lifeline Legacy Financial Group</h1>
          <div class="muted" style="font-size:.9rem">Protecting Families — Building Legacies</div>
        </div>
      </div>
      <nav>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#why-us">Why Us</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <a class="cta" href="https://calendly.com/lifelinelegacy/30min" target="_blank" rel="noopener">Book a 30‑min Call</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="container wrap">
      <div>
        <span class="eyebrow">September: Life Insurance Awareness Month</span>
        <h2 class="hero-title">Your family’s safety net shouldn’t be a GoFundMe.
          <span class="gold">Plan it today.</span></h2>
        <p class="lead">We help DFW families and small businesses secure <strong>living benefits life insurance</strong>, <strong>mortgage protection</strong>, and <strong>tax‑advantaged retirement</strong> (IUL) — with practical education that builds confidence and peace of mind.</p>
        <div class="hero-cta">
          <a class="btn primary" href="https://calendly.com/lifelinelegacy/30min" target="_blank" rel="noopener">Schedule Your Free Consultation</a>
          <a class="btn secondary" href="#services">Explore Services</a>
          <a class="btn secondary" href="mailto:blaise.tamo@thelifelineleague.com?subject=Inquiry%20from%20Website&body=Hi%20Lifeline%20Legacy%2C%0D%0A%0D%0AMy%20name%20is%20...%20and%20I%27d%20like%20help%20with...">Email Us</a>
        </div>
        <div class="trust-row">
          <div class="trust-badge">10+ years guiding DFW families</div>
          <div class="trust-badge">Living Benefits • IUL • Estate Resources</div>
          <div class="trust-badge">Professional • Transparent • Education‑First</div>
        </div>
      </div>
      <div class="hero-card">
        <div class="muted" style="font-weight:700">Fast Snapshot</div>
        <div class="metrics">
          <div class="metric"><strong>3</strong><div>Core Pillars<br/>Protect • Grow • Legacy</div></div>
          <div class="metric"><strong>30</strong><div>Minute Strategy Call</div></div>
          <div class="metric"><strong>0</strong><div>Pressure — education first</div></div>
        </div>
        <ul style="margin:16px 0 0; padding-left:18px; color:#475569">
          <li>Life insurance with <strong>living benefits</strong> for critical, chronic, terminal illness</li>
          <li>Mortgage protection so families keep their homes</li>
          <li><strong>IUL</strong>: tax‑advantaged retirement without market downside</li>
          <li>Estate planning resources: wills, trusts, legacy strategies</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section id="services">
    <div class="container">
      <div class="section-head">
        <h3>Comprehensive Services for Families & Educators</h3>
        <span class="chip">DFW • Families • Schools • Small Businesses</span>
      </div>
      <div class="cards">
        <div class="card">
          <h4>Life Insurance with Living Benefits</h4>
          <p>Modern protection that can advance cash while you’re alive during a <em>critical, chronic, or terminal illness</em> — so a health crisis doesn’t become a financial crisis.</p>
        </div>
        <div class="card">
          <h4>Mortgage Protection</h4>
          <p>Strategies so your family can <strong>keep the home</strong> through the unexpected. Tailored to your loan, budget, and timeline.</p>
        </div>
        <div class="card">
          <h4>Tax‑Advantaged Retirement (IUL)</h4>
          <p>Indexed Universal Life: build long‑term savings with <strong>downside protection</strong> and access to potential <strong>tax‑free income</strong> in retirement.</p>
        </div>
        <div class="card">
          <h4>Estate Planning Resources</h4>
          <p>Guidance on wills, trusts, and legacy strategies via our <em>Legacy Concierge</em> partners. Education‑first; you stay in control.</p>
        </div>
        <div class="card">
          <h4>Financial Literacy Workshops</h4>
          <p>Interactive sessions for parents, staff, and communities: budgeting, debt elimination, college planning, protection planning.</p>
        </div>
        <div class="card">
          <h4>Teacher & Small‑Business Solutions</h4>
          <p>Key‑person insurance, executive bonus designs, and supplemental benefits that help <strong>retain top talent</strong>.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Us -->
  <section id="why-us">
    <div class="container">
      <div class="section-head">
        <h3>Why Families Choose Lifeline Legacy</h3>
        <span class="chip">Professional • Transparent • Education‑First</span>
      </div>
      <div class="cards">
        <div class="card">
          <h4>Education Over Pressure</h4>
          <p>We start with clarity: simple visuals, plain‑English options, and side‑by‑side comparisons so you can decide confidently.</p>
        </div>
        <div class="card">
          <h4>Tailored, Not One‑Size‑Fits‑All</h4>
          <p>Your family’s goals drive the plan. We right‑size coverage and strategy to your budget and priorities.</p>
        </div>
        <div class="card">
          <h4>DFW Community‑Focused</h4>
          <p>We partner with schools, churches, and small businesses across North Dallas to build financial resilience at the local level.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Process -->
  <section id="process">
    <div class="container">
      <div class="section-head">
        <h3>How It Works</h3>
        <span class="chip">Simple • Fast • Respectful of Your Time</span>
      </div>
      <div class="timeline">
        <div class="step">
          <div class="num">1</div>
          <h4>Book</h4>
          <p>Pick a time that works for you. 30 minutes on Zoom or in‑person. <a href="https://calendly.com/lifelinelegacy/30min" target="_blank" rel="noopener">Book now</a>.</p>
        </div>
        <div class="step">
          <div class="num">2</div>
          <h4>Discover</h4>
          <p>We learn your goals, budget, and timelines. No pressure — just facts and options.</p>
        </div>
        <div class="step">
          <div class="num">3</div>
          <h4>Design</h4>
          <p>We tailor recommendations (coverage, IUL strategy, or benefits program) and answer every question.</p>
        </div>
        <div class="step">
          <div class="num">4</div>
          <h4>Implement</h4>
          <p>We help you apply, coordinate any requirements, and set up reviews so your plan keeps pace with life.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials (placeholder quotes) -->
  <section>
    <div class="container">
      <div class="section-head">
        <h3>What Families Say</h3>
        <span class="chip">Real results • Real peace of mind</span>
      </div>
      <div class="testi">
        <div class="quote"><strong>“Clear, patient, and professional.”</strong><p>We finally understood our options and picked a plan we feel great about.</p></div>
        <div class="quote"><strong>“Education first, no pressure.”</strong><p>They answered every question and built a plan that truly fit our budget.</p></div>
        <div class="quote"><strong>“We sleep better now.”</strong><p>The living benefits piece gave us real confidence against the unexpected.</p></div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact">
    <div class="container">
      <div class="section-head">
        <h3>Let’s Protect What Matters Most</h3>
        <span class="chip">DFW • Virtual or In‑Person • Evening slots available</span>
      </div>
      <div class="contact-grid">
        <div class="card">
          <h4>Talk to a Licensed Professional</h4>
          <p class="help">Prefer email? Reach out any time and we’ll reply quickly.</p>
          <p>
            <a class="btn primary" href="https://calendly.com/lifelinelegacy/30min" target="_blank" rel="noopener">Book on Calendly</a>
            <a class="btn secondary" href="mailto:blaise.tamo@thelifelineleague.com?subject=Inquiry%20from%20Website">Email: blaise.tamo@thelifelineleague.com</a>
          </p>
          <p class="help">Call/Text: <a href="tel:+14693549924">(469) 354‑9924</a></p>
        </div>
        <div class="card">
          <form id="quick-form" onsubmit="return handleSubmit(event)">
            <label>
              <span>Name</span>
              <input required name="name" placeholder="Your full name" />
            </label>
            <label>
              <span>Email</span>
              <input required type="email" name="email" placeholder="you@example.com" />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" placeholder="(xxx) xxx‑xxxx" />
            </label>
            <label>
              <span>How can we help?</span>
              <textarea name="note" rows="4" placeholder="Tell us a bit about your goals"></textarea>
            </label>
            <button class="btn primary" type="submit">Send via Email</button>
            <div class="help">Submitting opens your email app with a prefilled message. No data is stored on this site.</div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Thank You (standalone section for /#thank-you anchor use) -->
  <section id="thank-you" class="center" style="padding:80px 0; background:linear-gradient(180deg,#ffffff,#f6fff9)">
    <div class="container">
      <h3>Thank You — You’re Booked!</h3>
      <p class="muted">You’ll receive a confirmation email shortly. Need to make a change?</p>
      <p>
        <a class="btn secondary" href="https://calendly.com/lifelinelegacy/30min" target="_blank" rel="noopener">Manage or Reschedule on Calendly</a>
      </p>
      <p class="muted">Bring a recent mortgage statement (for mortgage protection), or your current policy statements for a free review.</p>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <div class="footgrid">
        <div>
          <div class="brand" style="margin-bottom:8px">
            <div class="logo">LL</div>
            <div>
              <strong>Lifeline Legacy Financial Group</strong>
              <div class="muted">Protecting Families — Building Legacies</div>
            </div>
          </div>
          <div>Email: <a href="mailto:blaise.tamo@thelifelineleague.com">blaise.tamo@thelifelineleague.com</a></div>
          <div>Call/Text: <a href="tel:+14693549924">(469) 354‑9924</a></div>
        </div>
        <div>
          <strong>Quick Links</strong>
          <ul style="list-style:none; padding:0; margin:.6rem 0 0; display:grid; gap:.4rem">
            <li><a href="#services">Services</a></li>
            <li><a href="#why-us">Why Us</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <strong>Disclosures</strong>
          <p class="muted">Information is educational and not financial, tax, or legal advice. Product availability and features vary by carrier and state. All coverage is subject to underwriting and approvals.</p>
        </div>
      </div>
      <div class="legal">© <span id="year"></span> Lifeline Legacy Financial Group. All rights reserved.</div>
    </div>
  </footer>

  <script>
    // Set copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Simple mailto submitter
    function handleSubmit(e){
      e.preventDefault();
      const f = e.target;
      const name = encodeURIComponent(f.name.value || "");
      const email = encodeURIComponent(f.email.value || "");
      const phone = encodeURIComponent(f.phone.value || "");
      const note = encodeURIComponent(f.note.value || "");
      const subject = `New Inquiry from Website — ${decodeURIComponent(name)}`;
      const body = `Name: ${decodeURIComponent(name)}%0D%0AEmail: ${decodeURIComponent(email)}%0D%0APhone: ${decodeURIComponent(phone)}%0D%0A%0D%0AHow we can help:%0D%0A${decodeURIComponent(note)}`;
      const href = `mailto:blaise.tamo@thelifelineleague.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = href;
      return false;
    }
  </script>
</body>
</html>
