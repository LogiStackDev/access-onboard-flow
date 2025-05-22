
import React from "react";
import { Search, BarChart2, Bell } from "lucide-react";

const featureData = [
  {
    title: "Smart Matching",
    description: "Advanced AI algorithms find relevant opportunities that match your business profile and expertise.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    title: "Competitive Analysis",
    description: "Gain insights into awards and analyze competitors to craft winning proposals.",
    icon: <BarChart2 className="h-6 w-6" />,
  },
  {
    title: "Real-time Alerts",
    description: "Never miss an opportunity with instant notifications for new opportunities in your industry.",
    icon: <Bell className="h-6 w-6" />,
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose YourSaaS</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform gives you the competitive edge in your market.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
