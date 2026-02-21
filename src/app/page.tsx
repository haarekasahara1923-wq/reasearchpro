import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, CheckCircle, FileText, Globe, GraduationCap, Lightbulb, Search, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-primary/30">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 group" href="#">
          <div className="bg-primary p-1 rounded-lg group-hover:rotate-12 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ResearchPro AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block" href="#pricing">
            Pricing
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium hover:bg-white/5">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-24 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-24 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700" />
          </div>

          <div className="container px-4 md:px-6 relative mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm animate-fade-in">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>AI-Powered Academic Excellence</span>
              </div>
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                  Master Your Research with <br />
                  <span className="text-primary italic">Intelligence</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl/relaxed lg:text-2xl/relaxed animate-fade-in delay-200">
                  The ultimate SaaS platform for researchers, students, and PhD scholars.
                  Build papers, track citations, and ensure integrity with state-of-the-art AI.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                    Start Your Thesis <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="w-full py-24 bg-white/[0.02] border-y border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                <div className="mb-4 inline-block p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-6 w-6 text-violet-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Topic Generator</h3>
                <p className="text-zinc-400">Instantly generate unique and high-quality research topics tailored to your field.</p>
              </div>
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                <div className="mb-4 inline-block p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Thesis Builder</h3>
                <p className="text-zinc-400">Step-by-step guidance from abstract to conclusion with AI-assisted drafting.</p>
              </div>
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                <div className="mb-4 inline-block p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Plagiarism Checker</h3>
                <p className="text-zinc-400">Industry-standard plagiarism detection powered by Copyleaks integration.</p>
              </div>
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                <div className="mb-4 inline-block p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Citation Manager</h3>
                <p className="text-zinc-400">Automated DOI lookup and formatting for APA, MLA, Chicago, and more.</p>
              </div>
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                <div className="mb-4 inline-block p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Literature Explorer</h3>
                <p className="text-zinc-400">RAG-based exploration of verified academic literature and research gaps.</p>
              </div>
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                <div className="mb-4 inline-block p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Export System</h3>
                <p className="text-zinc-400">Professional export options for PDF, DOCX, and even PPTX presentations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-extrabold sm:text-5xl">Simple, Transparent Pricing</h2>
              <p className="text-zinc-400 text-lg">Choose the plan that fits your research needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col p-8 rounded-2xl border border-white/5 bg-white/[0.01]">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-zinc-400 text-sm mb-6">For solo students starting out.</p>
                <div className="text-4xl font-bold mb-6">₹0<span className="text-lg font-normal text-zinc-500">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> 1,000 AI Words</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> 10 Topic Generations</li>
                  <li className="flex items-center text-sm text-zinc-500"><CheckCircle className="h-4 w-4 mr-2" /> No Export</li>
                  <li className="flex items-center text-sm text-zinc-500"><CheckCircle className="h-4 w-4 mr-2" /> No Plagiarism Check</li>
                </ul>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Current Plan</Button>
              </div>

              <div className="flex flex-col p-8 rounded-2xl border-2 border-primary bg-primary/5 relative scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <p className="text-zinc-400 text-sm mb-6">For dedicated Masters students.</p>
                <div className="text-4xl font-bold mb-6">₹1,999<span className="text-lg font-normal text-zinc-500">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> 50,000 AI Words</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> Thesis Builder included</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> 3 Plagiarism Checks</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> PDF/DOCX Export</li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
              </div>

              <div className="flex flex-col p-8 rounded-2xl border border-white/5 bg-white/[0.01]">
                <h3 className="text-xl font-bold mb-2">PhD Premium</h3>
                <p className="text-zinc-400 text-sm mb-6">For serious doctoral researchers.</p>
                <div className="text-4xl font-bold mb-6">₹3,999<span className="text-lg font-normal text-zinc-500">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> 150,000 AI Words</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> Full Workflow & RAG</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> Advanced Plagiarism</li>
                  <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> PPT Generator included</li>
                </ul>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Upgrade Now</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">ResearchPro AI</span>
            </div>
            <p className="text-zinc-500 text-sm">Empowering the next generation of academic scholars.</p>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
          <p className="text-zinc-600 text-xs">© 2024 ResearchPro AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
