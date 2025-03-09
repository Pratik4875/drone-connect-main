"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from 'react'

const FAQ = () => {
    const faqsList = [
        {
          "question": "What services do you offer?",
          "answer": "We provide an easy-to-use platform for hiring drone pilots for photography and videography services, including event coverage, real estate shoots, and aerial inspections."
        },
        {
          "question": "How do I get started?",
          "answer": "Simply sign up on our platform, browse available drone pilots, and book the one that fits your needs."
        },
        {
          "question": "What makes your platform unique?",
          "answer": "Our platform is 100% customizable, secure by default, and designed to offer a faster and smoother experience for both clients and drone pilots."
        },
        {
          "question": "How do you ensure the safety of my data?",
          "answer": "We prioritize your privacy with secure encryption and robust measures to protect your information."
        },
        {
          "question": "Are the drone pilots verified?",
          "answer": "Yes, all pilots undergo a thorough vetting process to ensure they meet our quality and safety standards."
        },
        {
          "question": "How do I book a drone pilot?",
          "answer": "Browse our platform, select a drone pilot based on your requirements, and book their services directly through our secure platform."
        },
        {
          "question": "What payment methods are supported?",
          "answer": "We support all major credit cards, debit cards, and online payment platforms for your convenience."
        },
        {
          "question": "Can I negotiate the pricing with the drone pilot?",
          "answer": "Yes, our platform allows clients and pilots to discuss and finalize pricing details before confirming a booking."
        },
        {
          "question": "What if I encounter technical issues?",
          "answer": "Our support team is available 24/7 to assist you with any technical issues you may face."
        },
        {
          "question": "Is there a mobile app available?",
          "answer": "Yes, our platform is available on both iOS and Android for convenient access on the go."
        }
      ]
      
  return (
    <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8 ">
      <div className="space-y-3 text-center">
        <h2 className="section-title mt-5 ">Frequently Asked Questions</h2>
        <p className="section-des mt-5">
          Answered all frequently asked questions, Still confused? feel free to
          contact us.
        </p>
      </div>
      <div className="mt-14 max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqsList.map((item, idx) => (
            <AccordionItem value={`item-${idx}`} key={idx}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
              {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ