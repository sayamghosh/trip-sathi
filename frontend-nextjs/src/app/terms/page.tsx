import type { Metadata } from 'next';
import { siteConfig } from '../../config/site';

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.projectName}`,
  description: `Read the terms and conditions for using ${siteConfig.projectName}, a platform that connects travelers directly with independent local guides.`,
  alternates: { canonical: '/terms' },
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: '1. What This Agreement Covers',
    body: [
      `These terms govern your use of ${siteConfig.projectName} ("the Platform"), whether you're a traveler discovering guides or a guide listing your tours. By creating an account or using the Platform, you agree to these terms.`,
    ],
  },
  {
    heading: '2. What Joy Trips Is — and Isn\'t',
    body: [
      `${siteConfig.projectName} is a discovery and connection platform. We help travelers find independent, local travel guides, and we help guides showcase their tours to travelers. That's the extent of our role.`,
      `We are not a travel agency, tour operator, booking agent, or event organizer. We are not a party to any agreement, itinerary, or transaction between a traveler and a guide. Every trip — its itinerary, price, dates, cancellation terms, and payment — is arranged and agreed directly between the traveler and the guide, without our involvement.`,
    ],
  },
  {
    heading: '3. Guide Listings & Verification',
    body: [
      'Before a guide\'s profile is published on the Platform, our team reviews their submitted information as part of our onboarding process. This review is intended to reduce the likelihood of clearly fraudulent or fake listings — it is not a certification, guarantee, or endorsement of any guide\'s services, licensing, insurance, qualifications, or conduct.',
      'Travelers are responsible for exercising their own judgment when choosing a guide and finalizing trip details — for example, confirming the itinerary and price in writing, checking reviews, and using standard caution when meeting someone you\'ve connected with online.',
    ],
  },
  {
    heading: '4. Bookings, Pricing & Payments',
    body: [
      `${siteConfig.projectName} does not process, hold, or have any visibility into payments made between travelers and guides. Payment terms — amount, method, timing, and currency — are agreed entirely between the traveler and the guide. We do not charge commission on bookings.`,
      'Because we are not involved in the payment or the trip itself, we cannot issue refunds, adjust pricing, or enforce any agreement made between a traveler and a guide.',
    ],
  },
  {
    heading: '5. Cancellations & Disputes',
    body: [
      'Cancellation policies, rescheduling terms, and any disputes about a trip are between the traveler and the guide who arranged it. We encourage both parties to agree on these terms clearly before confirming a trip.',
      `${siteConfig.projectName} is not responsible for resolving disputes, providing refunds, or compensating either party for losses arising from a trip arranged through the Platform.`,
    ],
  },
  {
    heading: '6. Reporting Misconduct',
    body: [
      'If you believe a guide has misrepresented themselves, engaged in fraud, or otherwise violated our community standards, please report it to us. We take reports seriously and may investigate, suspend, or remove a guide\'s access to the Platform at our discretion.',
      'Acting against a guide who violates our standards is a step we take to protect the integrity of the Platform — it does not make us a party to, or responsible for, any transaction or agreement between users.',
    ],
  },
  {
    heading: '7. Limitation of Liability',
    body: [
      `To the fullest extent permitted by law, ${siteConfig.projectName} and its team are not liable for any loss, damage, injury, dispute, or fraud arising from a trip, booking, communication, or agreement between a traveler and a guide. You use the Platform, and arrange and undertake trips through it, at your own risk.`,
      'This limitation applies regardless of whether a guide was previously reviewed or verified by us.',
    ],
  },
  {
    heading: '8. Changes to These Terms',
    body: [
      'We may update these terms from time to time as the Platform evolves. We\'ll post the updated version here with a new effective date. Continuing to use the Platform after an update means you accept the revised terms.',
    ],
  },
  {
    heading: '9. Contact Us',
    body: [
      'If you have questions about these terms, or want to report a concern about a guide or traveler, please reach out through our Contact page.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: July 15, 2026</p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
