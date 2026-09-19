import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReviewInvite } from "@/components/review-invite";
import { site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About Blaise Tamo",
  description:
    "Read the founder story behind Lifeline Legacy Financial Group and the lived experience that shaped the Continuity Bridge™ Framework.",
};

export default function AboutPage() {
  return (
    <>
      <main id="main-content">
        <section className="about-hero">
          <div className="container about-hero-grid">
            <div className="about-photo">
              <Image
                src="/brand/blaise-tamo.png"
                alt="Blaise Tamo walking outdoors in professional attire"
                width={1254}
                height={941}
                priority
                className="about-photo-image"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="eyebrow">Founder of LLFG · Creator of the Continuity Bridge™</p>
              <h1>Blaise Tamo</h1>
              <p className="about-title">{site.title}</p>
              <p className="about-opening">“I didn’t set out to build a company. I set out to build a life.”</p>
              <p className="hero-lede">The story behind LLFG begins with family, loss, responsibility, and a conviction that people need more than financial pieces—they need a structure built to keep life moving.</p>
              <div className="button-row">
                <Link className="button" href="/continuity-bridge">Explore the methodology</Link>
                <Link className="button button-outline" href="/checkup">Take the Checkup</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container story-grid">
            <div className="story-aside">
              <p className="eyebrow">The founder story</p>
              <h2>Where the conviction began.</h2>
              <blockquote className="story-pull-quote">“Love held us together. It couldn’t hold us up.”</blockquote>
            </div>
            <div className="founder-story-prose">
              <p>I grew up in a close-knit Christian family in Cameroon, and I came to the United States carrying what so many immigrants carry: hope, responsibility, and the expectations of the people back home.</p>
              <p>Then life took two people from me.</p>
              <p className="story-losses"><span>My father in 2008.</span><span>My brother in 2018.</span></p>
              <p>My family didn’t have a plan. We had each other, and we believed that was enough. But when the loss came, so did the financial responsibility no one had planned for, and it landed on the people left standing. Love held us together. It couldn’t hold us up.</p>
              <p>Years later, in corporate America and then in home services and renewable energy, I found myself at kitchen tables across Texas. I met parents sacrificing for their children, couples counting the years to retirement, and business owners carrying their families, employees, and communities on their backs.</p>
              <p>And I recognized the pattern, because I had lived it. They had pieces: a policy here, a retirement account there, some savings, maybe a will. But almost no one had a coordinated structure built to keep life moving the day something went wrong.</p>
            </div>
          </div>
        </section>

        <section className="section founder-purpose">
          <div className="container founder-purpose-grid">
            <div>
              <p className="eyebrow eyebrow-light">From lived experience to a framework</p>
              <h2>Protect what must continue.</h2>
            </div>
            <div className="founder-purpose-copy">
              <p>So I returned to the financial profession I was originally trained for and founded Lifeline Legacy Financial Group. Not to sell products, but to help families and business owners protect what must continue.</p>
              <p>That purpose became the Continuity Bridge™ Framework, built on three principles: Continuity, Certainty, and Legacy.</p>
              <blockquote className="founder-purpose-question">
                <p>Every conversation I have starts with one question:</p>
                <strong>“If life changes tomorrow, will the people who depend on you be okay?”</strong>
              </blockquote>
              <p>Because financial planning was never really about numbers on a page. It’s about the people behind them, and building a structure strong enough to carry them forward when life doesn’t go according to plan.</p>
            </div>
          </div>
        </section>

        <section className="section section-sage">
          <div className="container values-grid">
            <article><span>01</span><h3>Educate first</h3><p>Begin with the questions, language, and structure people need to make an informed decision.</p></article>
            <article><span>02</span><h3>Invite second</h3><p>Offer a conversation after the visitor has context—not as the price of receiving it.</p></article>
            <article><span>03</span><h3>Coordinate carefully</h3><p>Keep life and annuity work inside its proper role while helping the larger plan stay connected.</p></article>
          </div>
        </section>

        <section className="section">
          <div className="container contact-band">
            <div>
              <p className="eyebrow">Lifeline Legacy Financial Group</p>
              <h2>Questions are a good place to begin.</h2>
              <p>{site.location}</p>
            </div>
            <address>
              <a href={site.phoneHref}>Office · {site.phone}</a>
              <a href={site.cellHref}>Direct · {site.cell}</a>
              <a href={site.emailHref}>{site.email}</a>
            </address>
          </div>
        </section>
      </main>
      <ReviewInvite />
    </>
  );
}
