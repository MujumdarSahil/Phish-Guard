import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle, Shield, Info, Link2, Mail, CreditCard, AlertCircle } from 'lucide-react';

interface ResourceCard {
  title: string;
  description: string;
  icon: React.ElementType;
  link?: string;
}

interface PhishingType {
  name: string;
  description: string;
  indicators: string[];
  icon: React.ElementType;
  color: string;
}

export default function EducationResources() {
  const externalResources: ResourceCard[] = [
    {
      title: 'CISA Phishing Resources',
      description: 'Cybersecurity best practices and guidelines from the Cybersecurity and Infrastructure Security Agency.',
      icon: Shield,
      link: 'https://www.cisa.gov/topics/cybersecurity-best-practices/phishing'
    },
    {
      title: 'FTC Consumer Information',
      description: 'Federal Trade Commission guides on how to recognize and avoid phishing scams.',
      icon: Info,
      link: 'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams'
    },
    {
      title: 'Google Security Blog',
      description: 'Latest research and insights on phishing from Google\'s security teams.',
      icon: Shield,
      link: 'https://security.googleblog.com/'
    },
    {
      title: 'PhishTank Database',
      description: 'Community-powered database of verified phishing websites.',
      icon: Link2,
      link: 'https://phishtank.org/'
    }
  ];

  const phishingTypes: PhishingType[] = [
    {
      name: 'Email Phishing',
      description: 'Malicious emails designed to steal your personal information by impersonating legitimate organizations.',
      indicators: [
        'Urgent call to action',
        'Grammar and spelling errors',
        'Suspicious sender email address',
        'Requests for personal information',
        'Suspicious attachments'
      ],
      icon: Mail,
      color: 'text-primary-700 bg-primary-100'
    },
    {
      name: 'Spear Phishing',
      description: 'Targeted attacks against specific individuals or organizations using personalized information.',
      indicators: [
        'Highly personalized content',
        'References to your organization',
        'Appears to come from a colleague or executive',
        'Often well-written with few errors',
        'Sophisticated social engineering'
      ],
      icon: AlertTriangle,
      color: 'text-warning-700 bg-warning-100'
    },
    {
      name: 'Financial Phishing',
      description: 'Attacks targeting your financial information by impersonating banks or payment services.',
      indicators: [
        'Bank or payment service branding',
        'Urgent account issues requiring action',
        'Requests for account credentials',
        'Links to fake login pages',
        'Threats of account closure'
      ],
      icon: CreditCard,
      color: 'text-danger-700 bg-danger-100'
    },
    {
      name: 'Clone Phishing',
      description: 'Replicas of legitimate messages with malicious content, often appearing as a resend from the original source.',
      indicators: [
        'Nearly identical to legitimate emails',
        'Slight URL or sender differences',
        'References to previously sent communications',
        'Link destination doesn\'t match displayed URL',
        'Unexpected resends of known messages'
      ],
      icon: AlertCircle,
      color: 'text-secondary-700 bg-secondary-100'
    }
  ];

  const bestPractices = [
    "Verify the sender's email address carefully",
    "Don't click on suspicious links or open unexpected attachments",
    "Hover over links to preview the URL destination before clicking",
    "Never provide sensitive information in response to an email request",
    "Use multi-factor authentication for all important accounts",
    "Keep your software and security tools updated",
    "Be wary of urgent requests or threats in emails",
    "Check for grammar and spelling errors, which are common in phishing attempts",
    "When in doubt, contact the company directly using official contact information (not from the email)",
    "Use a password manager to avoid entering credentials on fake websites"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Phishing Education Resources</h1>
        <p className="text-gray-600">Learn how to identify and protect yourself from phishing attacks.</p>
      </div>
      
      <section>
        <h2 className="section-title">Types of Phishing Attacks</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {phishingTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${type.color} mr-4`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  <p className="mt-1 text-gray-600">{type.description}</p>
                  
                  <h4 className="mt-4 font-medium text-gray-900">Common Indicators:</h4>
                  <ul className="mt-2 space-y-1">
                    {type.indicators.map((indicator, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-sm text-gray-600">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="section-title">Best Practices to Avoid Phishing</h2>
        <div className="card">
          <ul className="space-y-4">
            {bestPractices.map((practice, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 pt-1">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">{index + 1}</span>
                  </div>
                </div>
                <p className="ml-3 text-gray-700">{practice}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
      
      <section>
        <h2 className="section-title">External Resources</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {externalResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="p-3 rounded-lg bg-primary-100 text-primary-700 mr-4">
                  <resource.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                  <p className="mt-1 text-gray-600">{resource.description}</p>
                  
                  {resource.link && (
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      Visit Resource <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="section-title">Report Phishing</h2>
        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-warning-100 text-warning-700 mr-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Found a phishing attempt?</h3>
              <p className="mt-1 text-gray-600">
                If you encounter a suspected phishing website or email, report it to help protect others.
              </p>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>
                    Report to <a href="https://www.ftc.gov/reportfraud" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Federal Trade Commission</a>
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>
                    Forward phishing emails to <a href="mailto:phishing@irs.gov" className="text-primary-600 hover:underline">phishing@irs.gov</a>
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>
                    Submit phishing websites to <a href="https://www.phishtank.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">PhishTank</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}