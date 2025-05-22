
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const benefits = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

const CallToAction = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that use our platform to gain a competitive advantage.
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <Button className="bg-saas-blue hover:bg-blue-800 px-8 py-6 text-lg" size="lg" asChild>
            <Link to="/register">Start Free Trial</Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-gray-500">
            Call us: <a href="tel:+123456789" className="text-saas-blue font-medium">+1 (234) 567-89</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
