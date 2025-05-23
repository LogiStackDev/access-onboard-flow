
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, CheckCircle } from "lucide-react";

const Subscription = () => {
  return (
    <div className="min-h-screen bg-saas-background">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-saas-blue">Your Trial Has Expired</h1>
            <p className="mt-4 text-lg text-gray-600">
              Thank you for trying TenderSync. Your free trial period has ended.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="p-6 border border-gray-200 rounded-md bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">Standard</h2>
                <span className="bg-blue-100 text-saas-blue px-3 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>All TenderSync features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Up to 5 team members</span>
                </li>
              </ul>
              <Button className="w-full bg-saas-blue hover:bg-blue-800 flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Subscribe Now
              </Button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-md bg-white hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold">Pro</h2>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>All Standard features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <Button className="w-full bg-saas-blue hover:bg-blue-800 flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Subscribe Now
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Have questions or need assistance with your subscription?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="text-saas-blue hover:underline">
                Contact our support team
              </Link>
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-saas-blue">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
