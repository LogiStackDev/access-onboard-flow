
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Subscription = () => {
  return (
    <div className="min-h-screen bg-saas-background">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-saas-blue">Your Trial Has Expired</h1>
            <p className="mt-4 text-lg text-gray-600">
              Thank you for trying TenderSync. Your free trial period has ended.
            </p>
          </div>

          <div className="my-8 p-6 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Continue with a Premium Subscription</h2>
            <p className="mb-6">
              To continue using TenderSync and access all features, please purchase a subscription.
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Unlimited access to all TenderSync features</li>
              <li>Priority customer support</li>
              <li>Custom integrations</li>
              <li>Advanced analytics</li>
            </ul>
            <div className="flex justify-center">
              <Button className="bg-saas-blue hover:bg-blue-800">
                Purchase Subscription
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">
              Have questions or need assistance with your subscription?
            </p>
            <Link to="/contact" className="text-saas-blue hover:underline">
              Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
