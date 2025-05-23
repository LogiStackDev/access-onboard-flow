
import React from "react";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import TrialForm from "@/components/TrialForm";
import CpvSearch from "@/components/CpvSearch";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-gradient relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gray-900">Unlock </span>
                <span className="text-saas-blue">New Opportunities</span>
                <br />
                <span className="text-gray-900">for Your Business</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get ahead of your competition with real-time access to opportunities tailored for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-saas-blue hover:bg-blue-800 px-6 py-6 text-lg"
                  size="lg"
                  asChild
                >
                  <Link to="/register">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <TrialForm />
            </div>
          </div>
        </div>
      </section>

      {/* CPV Search Component */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <CpvSearch />
        </div>
      </section>
      
      <Features />

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-xl italic text-gray-700">
              "YourSaaS has completely transformed how we find new opportunities. Their AI matching technology has helped us secure deals we would have otherwise missed."
            </blockquote>
            <div className="mt-4">
              <p className="font-medium">Jane Smith</p>
              <p className="text-gray-500 text-sm">CEO, Company Inc.</p>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
      <CallToAction />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">YourSaaS</h3>
              <p className="text-gray-400">
                Helping businesses discover and secure new opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 YourSaaS. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
