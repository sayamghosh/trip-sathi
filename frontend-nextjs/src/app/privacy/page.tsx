import type { Metadata } from 'next';
import { siteConfig } from '../../config/site';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.projectName}`,
  description: `Learn what information ${siteConfig.projectName} collects, how it's used, and who it's shared with when you use our platform to connect with local travel guides.`,
  alternates: { canonical: '/privacy' },
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: '1. Introduction',
    body: [
      `This policy explains what personal information ${siteConfig.projectName} ("we", "us", "the Platform") collects, why we collect it, and how it's used and shared when you use our website as a traveler or a guide. By using the Platform, you agree to the collection and use of information as described here.`,
    ],
  },
  {
    heading: '2. Information We Collect',
    body: [
      'Account information: when you sign up (including via Google Sign-In), we collect your name, email address, and profile picture. If you sign up with a password instead, we store an encrypted version of it, never the password itself.',
      'Profile details: guides may add a phone number, address, and bio to their public profile so travelers can learn about and reach them.',
      "Callback and booking details: when a traveler requests a callback or a guide records a confirmed booking, we store the traveler's name, email, and phone number, and — for confirmed bookings — the trip date, number of travelers, agreed price, and payment status. A guide may also record a traveler's address and a government ID number as part of finalizing a booking.",
      'Contact form submissions: if you use the Contact Us form, we store the email address and message you provide, so our team can review and respond to it.',
      "Usage information: like most websites, our servers automatically log basic technical information (such as IP address and browser type) for security and troubleshooting purposes.",
    ],
  },
  {
    heading: '3. How We Use Your Information',
    body: [
      'We use the information we collect to: create and manage your account, connect travelers with guides and display guide profiles, let guides record and manage bookings, respond to messages sent through our Contact Us form, keep the Platform secure and prevent abuse, and improve how the Platform works.',
      'We do not use your information to sell targeted advertising, and we do not sell your personal information to third parties.',
    ],
  },
  {
    heading: '4. Government ID Numbers & Sensitive Information',
    body: [
      "A government ID number is only ever collected by a guide directly, as an optional field when they record your booking — it is not required to use the Platform, browse guides, or request a callback. This information is visible only to the guide handling that specific booking and to our platform administrators for fraud investigation purposes; it is never shown publicly or shared with any other guide or traveler.",
      "If you're a traveler, you're free to decline providing this to a guide if you're not comfortable — that's a decision between you and the guide, not something the Platform requires.",
    ],
  },
  {
    heading: '5. Who We Share Information With',
    body: [
      "With guides: when you request a callback or a guide records a booking for you, your name, email, and phone number are shared with that guide so they can contact you and arrange your trip — this sharing is the core purpose of the Platform.",
      "With service providers: we use third-party infrastructure to run the Platform, such as cloud hosting and database providers, and Google's Sign-In service if you choose to log in that way. These providers process data on our behalf and don't use it for their own purposes.",
      "We do not share your information with advertisers, data brokers, or any other third party for marketing purposes.",
      'We may disclose information if required by law, or if necessary to investigate fraud, protect the safety of our users, or enforce our Terms & Conditions.',
    ],
  },
  {
    heading: '6. Cookies & Local Storage',
    body: [
      "We use your browser's local storage to keep you signed in between visits. We do not currently use third-party advertising or analytics cookies. If this changes in the future, we'll update this policy to reflect it.",
    ],
  },
  {
    heading: '7. Data Retention',
    body: [
      "We keep your account and booking information for as long as your account is active, or as needed to provide the Platform's features (for example, so a guide can see their booking history). If you'd like your account or data deleted, contact us and we'll act on that request, except where we're required to retain certain records by law.",
    ],
  },
  {
    heading: '8. Your Choices & Rights',
    body: [
      'You can review and update your profile information at any time by logging into your account. You can request a copy of the personal information we hold about you, ask us to correct it, or ask us to delete your account and associated data, by reaching out through our Contact page.',
    ],
  },
  {
    heading: '9. Data Security',
    body: [
      'We take reasonable technical and organizational measures to protect your information. However, no method of storing or transmitting data online is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    heading: "10. Children's Privacy",
    body: [
      'The Platform is not directed at children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will remove it.',
    ],
  },
  {
    heading: '11. Changes to This Policy',
    body: [
      "We may update this policy from time to time as the Platform evolves. We'll post the updated version here with a new effective date. Significant changes will be communicated more prominently where appropriate.",
    ],
  },
  {
    heading: '12. Contact Us',
    body: [
      'If you have questions about this policy, or want to exercise any of the rights described above, please reach out through our Contact page.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: July 16, 2026</p>

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
