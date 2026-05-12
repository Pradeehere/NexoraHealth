import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, Target, Moon, PieChart, Smartphone, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import LandingNavbar from '../components/common/LandingNavbar';

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white border-b border-r border-black p-12 flex flex-col items-start cursor-pointer group transition-colors duration-300 hover:bg-black"
    >
        <Icon className="text-brand-gold w-8 h-8 mb-8 stroke-1" />
        <h3 className="text-[12px] font-inter uppercase tracking-[0.2em] font-bold mb-4 text-black group-hover:text-white transition-colors">{title}</h3>
        <p className="font-inter text-[15px] leading-relaxed text-[#555] group-hover:text-gray-300 transition-colors">
            {description}
        </p>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        { q: "How does the AI provide insights?", a: "Our proprietary AI analyzes your daily logs—sleep, water, calories, and exercise—to detect patterns and offer customized, actionable wellness recommendations." },
        { q: "Who has access to my health data?", a: "Your privacy is paramount. All data is encrypted and securely stored. We never sell or share your personal health information with third parties." },
        { q: "Can I use Nexora on my mobile device?", a: "Yes. Nexora Health is a Progressive Web App (PWA). You can install it directly to your home screen for a seamless native app experience." },
        { q: "Is dietary tracking comprehensive?", a: "Absolutely. Our calorie counter integrates with your daily goals to ensure you're meeting your exact macronutrient and energy targets." },
        { q: "How do subscriptions work?", a: "Currently, Nexora Health core features are available for free to early adopters, allowing you to track and analyze your daily wellness routine without restriction." }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-inter selection:bg-black selection:text-brand-gold overflow-x-hidden pt-16">
            <LandingNavbar />

            {/* HERO SECTION */}
            <section className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-20 text-center relative">
                <p className="font-inter uppercase tracking-[0.3em] text-[11px] font-bold mb-8 text-black">THE LUXURY OF WELLNESS</p>

                <div className="w-full max-w-5xl mx-auto border-t border-brand-gold mb-8"></div>

                <h1 className="font-cormorant italic font-bold text-[64px] md:text-[120px] leading-[1] text-black tracking-tight">
                    <div className="block">TRACK.</div>
                    <div className="block">ANALYZE.</div>
                    <div className="block">THRIVE.</div>
                </h1>

                <div className="w-full max-w-5xl mx-auto border-b border-brand-gold mt-10"></div>

                <div className="mt-14 flex flex-col sm:row gap-6 justify-center">
                    <button onClick={() => navigate('/register')} className="bg-black text-white font-inter font-bold uppercase tracking-widest text-[13px] px-12 py-5 hover:bg-brand-gold transition-colors block">
                        Start Your Journey
                    </button>
                    <button onClick={() => navigate('/login')} className="bg-white border border-black text-black font-inter font-bold uppercase tracking-widest text-[13px] px-12 py-5 hover:bg-gray-50 transition-colors block">
                        Login
                    </button>
                </div>
            </section>

            {/* STATS ROW */}
            <section className="border-t border-b border-black">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-black md:divide-x">
                    {[
                        { label: "Steps Tracked", value: "8.5M+" },
                        { label: "Calories Burned", value: "320k" },
                        { label: "Active Users", value: "10k+" },
                        { label: "Goals Reached", value: "95%" }
                    ].map((stat, i) => (
                        <div key={i} className="py-12 md:py-16 px-4 md:px-8 text-center bg-white hover:bg-gray-50 transition-colors">
                            <h4 className="font-cormorant text-4xl md:text-[56px] text-brand-gold mb-2 font-bold">{stat.value}</h4>
                            <span className="font-inter uppercase tracking-[0.15em] font-bold text-[11px] text-black">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>


            {/* TWO-COLUMN FEATURE (Figma Reference) */}
            <section className="py-24 md:py-32 px-6 md:px-16 border-b border-black bg-[#fdfdfd]">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="max-w-xl">
                        <h2 className="font-inter font-medium text-4xl md:text-[56px] leading-[1.1] text-black tracking-tight mb-8">
                            Go from initial tracking to optimal health with AI
                        </h2>
                        <p className="font-inter text-lg md:text-[20px] leading-relaxed text-[#444] mb-12">
                            Explore without boundaries. Whether you want to monitor your caloric intake, establish dynamic workout routines, or analyze your sleep cycles—our intelligent algorithms seamlessly tailor wellness prescriptions precisely for you.
                        </p>

                        <div>
                            <h3 className="font-inter font-medium text-2xl md:text-[32px] text-black mb-4">
                                Give every goal its best shot
                            </h3>
                            <p className="font-inter text-base md:text-[18px] text-[#555] mb-8 max-w-sm">
                                Prompt any wellness possibility with Nexora. No macro too small, no workout too niche to explore.
                            </p>
                            <button
                                onClick={() => navigate(user ? '/dashboard' : '/register')}
                                className="font-inter text-lg font-medium text-black border-b border-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors inline-flex items-center gap-2"
                            >
                                Try Nexora Health
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-gray-100 border border-black overflow-hidden shadow-2xl">
                        {/* The Yoga Image */}
                        <img src="/images/custom-stretch.png" alt="Nexora Health Hero" className="w-full h-full object-cover mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 to-transparent mix-blend-overlay"></div>
                    </div>
                </div>
            </section>

            {/* FEATURE CARDS SECTION (Figma Reference) */}
            <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
                <h2 className="font-cormorant italic text-3xl md:text-[44px] text-center mb-16 text-black uppercase tracking-widest font-bold">Powered by Intelligence</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
                    <FeatureCard
                        icon={Brain}
                        title="AI Insights"
                        description="Get personalized aesthetic tips and wellness suggestions tailored exactly to your lifestyle."
                        onClick={() => navigate('/dashboard')}
                    />
                    <FeatureCard
                        icon={Target}
                        title="Goal Tracking"
                        description="Stay motivated by setting customizable goals for hydration, sleep, exercise, and calories."
                        onClick={() => navigate('/tracker')}
                    />
                    <FeatureCard
                        icon={Moon}
                        title="Sleep Monitor"
                        description="Understand your rest patterns and get recommendations for improving sleep quality over time."
                        onClick={() => navigate('/tracker')}
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Calorie Counter"
                        description="Easily track daily intake against expenditure and watch your wellness history update."
                        onClick={() => navigate('/tracker')}
                    />
                    <FeatureCard
                        icon={PieChart}
                        title="BMI Tracker"
                        description="Auto-calculate and classify your Body Mass Index as you update your weight milestones."
                        onClick={() => navigate('/reports')}
                    />
                    <FeatureCard
                        icon={Smartphone}
                        title="PWA Support"
                        description="Install Nexora Health directly on your desktop or mobile as a snappy Progressive Web App."
                        onClick={() => { }}
                    />
                </div>
            </section>

            {/* FAQS SECTION (Figma Reference) */}
            <section className="py-24 md:py-32 px-6 md:px-16 border-t border-black bg-white">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
                    <div>
                        <h2 className="font-inter text-[40px] md:text-[56px] text-black">FAQs</h2>
                    </div>

                    <div className="flex flex-col">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-black">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full py-6 md:py-8 flex justify-between items-center text-left hover:text-brand-gold transition-colors"
                                >
                                    <span className="font-inter text-[20px] md:text-[24px] text-black">{faq.q}</span>
                                    <ChevronDown
                                        className={`w-6 h-6 text-black transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                        strokeWidth={1.5}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="font-inter text-[16px] md:text-[18px] text-[#555] leading-relaxed max-w-3xl">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative text-white py-40 px-6 text-center border-t border-black overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/custom-yoga.png" alt="Wellness Journey" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <h2 className="font-cormorant italic text-4xl md:text-[64px] mb-8 text-white uppercase tracking-widest leading-[1.1] font-bold">The peak of wellness</h2>
                    <p className="font-inter text-[18px] mb-12 text-white/90">Join thousands who have discovered their optimal health profile.</p>
                    <button onClick={() => navigate('/register')} className="bg-white border-0 text-black font-inter font-bold uppercase tracking-widest text-[13px] px-14 py-5 hover:bg-brand-gold hover:text-white transition-colors">
                        START TODAY
                    </button>
                </div>
            </section>

            {/* FOOTER (Figma Reference) */}
            <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-16 font-inter">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-24">
                    <div className="lg:col-span-1">
                        <div className="font-cormorant italic font-medium text-3xl tracking-wide mb-6">
                            Nexora
                        </div>
                        <div className="flex gap-4">
                            {/* Social circles */}
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer text-xs">X</div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer text-xs">YT</div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer text-xs">IG</div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer text-xs">FB</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-inter font-bold uppercase tracking-widest text-[11px] text-brand-gold mb-2">Platform</h4>
                        <button onClick={() => navigate('/dashboard')} className="text-left text-sm text-gray-300 hover:text-white transition-colors">Dashboard</button>
                        <button onClick={() => navigate('/tracker')} className="text-left text-sm text-gray-300 hover:text-white transition-colors">Health Tracker</button>
                        <button onClick={() => navigate('/reports')} className="text-left text-sm text-gray-300 hover:text-white transition-colors">Reports</button>
                        <button onClick={() => navigate('/profile')} className="text-left text-sm text-gray-300 hover:text-white transition-colors">Profile</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-inter font-bold uppercase tracking-widest text-[11px] text-brand-gold mb-2">Use Cases</h4>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Diet Management</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Sleep Optimization</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Workout Tracking</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">BMI Analysis</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-inter font-bold uppercase tracking-widest text-[11px] text-brand-gold mb-2">Resources</h4>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Best Practices</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">API Documentation</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Community</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-inter font-bold uppercase tracking-widest text-[11px] text-brand-gold mb-2">Company</h4>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">About Us</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Careers</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</a>
                        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Nexora Health. All rights reserved.
                    </div>
                    <button onClick={() => window.scrollTo(0, 0)} className="text-xs font-tenor uppercase tracking-widest text-brand-gold hover:text-white transition-colors">
                        Back to Top
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
