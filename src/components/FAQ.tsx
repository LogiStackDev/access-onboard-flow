
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What is YourSaaS?",
    answer: "YourSaaS is a platform that helps businesses find and secure opportunities in their target market with AI-powered matching, real-time alerts, and competitive analysis tools.",
  },
  {
    question: "How does the free trial work?",
    answer: "Our free trial gives you full access to all features for 14 days. No credit card is required to start, and you can cancel anytime during the trial period.",
  },
  {
    question: "Do I need expertise in the industry?",
    answer: "No, our platform is designed to be user-friendly for businesses of all experience levels. Our AI algorithms help match you with relevant opportunities based on your business profile.",
  },
  {
    question: "What types of opportunities can I find on YourSaaS?",
    answer: "Our platform covers a wide range of opportunities across multiple industries, including [specific examples relevant to your SaaS].",
  },
  {
    question: "Can I integrate YourSaaS with my existing tools?",
    answer: "Yes, YourSaaS offers integration capabilities with many popular business tools and platforms to streamline your workflow.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about our platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
