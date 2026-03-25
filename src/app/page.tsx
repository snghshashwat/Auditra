"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "🔍",
    title: "Continuous Monitoring",
    description:
      "Real-time ledger scanning with AI-powered anomaly detection across all accounting cycles.",
  },
  {
    icon: "⚙️",
    title: "Control Intelligence",
    description:
      "Map controls to exceptions with remediation tracking and historical effectiveness scoring.",
  },
  {
    icon: "🧠",
    title: "AI-Powered Analysis",
    description:
      "Explainable findings with confidence scoring and supporting evidence retrieval.",
  },
  {
    icon: "📊",
    title: "Executive Reports",
    description:
      "Auto-generated audit-ready narratives with ownership, timelines, and board recommendations.",
  },
];

const benefits = [
  "80% faster audit cycles with continuous monitoring",
  "Detect financial anomalies before they escalate",
  "AI-explained control gaps with remediation paths",
  "Board-ready reporting in minutes, not weeks",
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      // Fade in on scroll
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
            },
          },
        );
      });

      // Subtle parallax background
      gsap.to("[data-parallax]", {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Feature cards stagger in
      gsap.utils
        .toArray<HTMLElement>("[data-feature]")
        .forEach((element, index) => {
          gsap.fromTo(
            element,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: index * 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
              },
            },
          );
        });

      // Button press effect
      gsap.utils.toArray<HTMLElement>("[data-press]").forEach((element) => {
        const onDown = () =>
          gsap.to(element, {
            scale: 0.97,
            duration: 0.1,
            ease: "power2.out",
          });
        const onUp = () =>
          gsap.to(element, {
            scale: 1,
            duration: 0.15,
            ease: "back.out(2)",
          });

        element.addEventListener("pointerdown", onDown);
        element.addEventListener("pointerup", onUp);
        element.addEventListener("pointerleave", onUp);

        cleanups.push(() => {
          element.removeEventListener("pointerdown", onDown);
          element.removeEventListener("pointerup", onUp);
          element.removeEventListener("pointerleave", onUp);
        });
      });
    }, rootRef);

    return () => {
      cleanups.forEach((fn) => fn());
      context.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden px-4 pb-20 sm:px-6 lg:px-8 lg:pb-32"
    >
      {/* Background gradients */}
      <div className="landing-grid pointer-events-none absolute inset-0 -z-20 opacity-40" />
      <div
        data-parallax
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-[1400px] rounded-full bg-gradient-to-b from-blue-500/20 via-purple-500/15 to-transparent blur-3xl"
      />

      {/* Hero Section */}
      <section
        data-reveal
        className="mx-auto mt-12 max-w-[1280px] text-center sm:mt-16"
      >
        <div className="mb-6 inline-block rounded-full border border-accent/30 bg-accent/5 px-4 py-2">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest">
            ✨ AI-Powered Audit Intelligence
          </p>
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-fg sm:text-5xl lg:text-6xl">
          Audit with Intelligence{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Powered by AI
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-fg-subtle sm:text-xl">
          Streamline your audit process with continuous ledger monitoring,
          AI-explained control gaps, and board-ready reports generated in
          minutes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            data-press
            className="btn-primary px-8 py-3 text-base font-semibold"
          >
            Launch Dashboard →
          </Link>
          <Link
            href="/ai-agents"
            data-press
            className="rounded-lg border border-border bg-surface px-8 py-3 text-base font-semibold text-fg transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Explore AI Agents
          </Link>
        </div>
      </section>

      {/* Trust Indicators */}
      <section
        data-reveal
        className="mx-auto mt-16 max-w-[1280px] rounded-2xl border border-border bg-surface/50 backdrop-blur px-8 py-8 sm:py-10"
      >
        <div className="grid gap-8 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">80%</p>
            <p className="mt-1 text-sm text-fg-subtle">Faster Audit Cycles</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">Real-time</p>
            <p className="mt-1 text-sm text-fg-subtle">Ledger Monitoring</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">90%+</p>
            <p className="mt-1 text-sm text-fg-subtle">Detection Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">Minutes</p>
            <p className="mt-1 text-sm text-fg-subtle">Report Generation</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto mt-20 max-w-[1280px]">
        <div className="mb-12 text-center">
          <p className="section-title">Why Auditra</p>
          <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">
            Enterprise-Grade Audit Intelligence
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-feature
              className="card-stat group hover:border-accent/60 hover:shadow-xl"
            >
              <p className="text-4xl">{feature.icon}</p>
              <h3 className="mt-4 text-lg font-bold text-fg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-fg-subtle leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 h-0.5 w-8 bg-gradient-to-r from-accent to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section
        data-reveal
        className="mx-auto mt-20 max-w-[1280px] rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-muted p-8 sm:p-12"
      >
        <h2 className="mb-8 text-3xl font-bold text-fg sm:text-4xl">
          Powerful Capabilities
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div key={benefit} data-reveal className="flex gap-4 items-start">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                <span className="text-accent text-sm">✓</span>
              </div>
              <p className="text-lg text-fg-subtle">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto mt-20 max-w-[1280px]">
        <div className="mb-12 text-center">
          <p className="section-title">The Process</p>
          <h2 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">
            From Data to Insights in Minutes
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Connect",
              description:
                "Integrate your ledger and financial systems securely",
              icon: "🔗",
            },
            {
              step: "2",
              title: "Monitor",
              description:
                "AI continuously scans for anomalies and control gaps",
              icon: "📊",
            },
            {
              step: "3",
              title: "Report",
              description:
                "Generate board-ready audit reports with recommendations",
              icon: "📋",
            },
          ].map((item) => (
            <div
              key={item.step}
              data-feature
              className="card-compact px-6 py-8 sm:p-6 text-center border-border hover:border-accent/50"
            >
              <p className="text-4xl">{item.icon}</p>
              <p className="mt-3 text-sm font-bold text-accent">{item.step}</p>
              <h3 className="mt-2 text-xl font-bold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm text-fg-subtle">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        data-reveal
        className="mx-auto mt-20 max-w-[1280px] rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-purple-500/5 to-pink-500/5 px-8 py-16 text-center sm:px-12 sm:py-20"
      >
        <h2 className="text-3xl font-bold text-fg sm:text-4xl">
          Ready to Transform Your Audit Process?
        </h2>
        <p className="mt-4 text-lg text-fg-subtle">
          Join leading auditors using Auditra for intelligent, continuous audit
          oversight.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            data-press
            className="btn-primary px-8 py-3 text-base font-semibold"
          >
            Get Started Now →
          </Link>
          <button
            data-press
            className="rounded-lg border border-border bg-surface px-8 py-3 text-base font-semibold text-fg transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Schedule Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-20 max-w-[1280px] rounded-2xl border border-border bg-surface/50 backdrop-blur px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="section-title">Auditra</p>
            <p className="mt-2 max-w-lg text-fg-subtle">
              Enterprise audit intelligence platform combining continuous
              monitoring, AI-powered analysis, and automated reporting.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Link
              href="/dashboard"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-fg-subtle transition hover:text-fg hover:border-accent/40"
            >
              Dashboard
            </Link>
            <Link
              href="/ai-agents"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-fg-subtle transition hover:text-fg hover:border-accent/40"
            >
              AI Agents
            </Link>
            <Link
              href="/reports"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-fg-subtle transition hover:text-fg hover:border-accent/40"
            >
              Reports
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-fg-subtle">
            © 2026 Auditra. Enterprise audit intelligence platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
