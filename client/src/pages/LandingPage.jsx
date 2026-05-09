import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Target, Moon, PieChart, Smartphone } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="glass-card p-6 flex flex-col items-center text-center">
        <div className="bg-brand-cyan/20 p-4 rounded-full mb-4">
            <Icon className="text-brand-cyan w-8 h-8" />
        </div>
        <h3 className="text-xl font-heading font-bold mb-2 text-brand-text">{title}</h3>
        <p className="text-brand-muted">{description}</p>
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center max-w-7xl mx-auto py-12">
            {/* Hero Section */}
            <div className="text-center mb-20 animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-brand-text">
                    Track. Analyze. <span className="text-brand-cyan relative">
                        Thrive.
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-brand-cyan rounded-full"></span>
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-10">
                    AI-Powered Health Tracker & Wellness Monitoring System designed to give you deep insights into your lifestyle and habits.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register" className="bg-brand-cyan text-brand-dark px-8 py-3 rounded-xl font-bold text-lg hover:bg-brand-cyan/80 transition-all shadow-[0_0_15px_rgba(0,212,255,0.5)]">
                        Start Your Wellness Journey
                    </Link>
                    <Link to="/login" className="bg-brand-card border border-brand-cyan text-brand-cyan px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/5 transition-all">
                        Login
                    </Link>
                </div>
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 px-4">
                {[
                    { label: "Steps Tracked", value: "8.5M+" },
                    { label: "Calories Burned", value: "320k+" },
                    { label: "Active Users", value: "10k+" },
                    { label: "Goals Reached", value: "95%" }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 text-center transform hover:-translate-y-2 transition-transform cursor-pointer">
                        <h4 className="text-2xl md:text-3xl font-heading font-bold text-brand-green mb-1">{stat.value}</h4>
                        <span className="text-sm text-brand-muted">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            <div className="px-4">
                <h2 className="text-3xl font-heading font-bold text-center mb-12">Powered by Advanced Technologies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard icon={Brain} title="AI Insights" description="Get personalized tips and wellness suggestions tailored exactly to your logs and lifestyle." />
                    <FeatureCard icon={Target} title="Goal Tracking" description="Stay motivated by setting customizable goals for hydration, sleep, exercise, and calories." />
                    <FeatureCard icon={Moon} title="Sleep Monitor" description="Understand your rest patterns and get recommendations for improving sleep quality over time." />
                    <FeatureCard icon={Activity} title="Calorie Counter" description="Easily track daily intake against expenditure and watch your BMI history update in real-time." />
                    <FeatureCard icon={PieChart} title="BMI Tracker" description="Auto-calculate and classify your Body Mass Index as you update your weight milestones." />
                    <FeatureCard icon={Smartphone} title="PWA Support" description="Install Nexora Health directly on your desktop or mobile as a snappy Progressive Web App." />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
