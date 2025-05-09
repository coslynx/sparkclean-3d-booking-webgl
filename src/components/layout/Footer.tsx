// src/components/layout/Footer.tsx
/**
 * Purpose: Renders a consistent footer section for the cleaning service website.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Globe } from 'lucide-react';
import 'src/styles/layout/footer.css';

interface FooterProps {
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: { platform: string; url: string; }[];
}

const Footer: React.FC<FooterProps> = ({
  contactEmail = 'info@cleanhome.com',
  contactPhone = '+1-555-CLEAN',
  socialLinks = [
    { platform: 'facebook', url: '#' },
    { platform: 'twitter', url: '#' },
  ],
}) => {

  const safeURL = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch (e) {
      console.error('Invalid URL:', url);
      return '#'; // Fallback to homepage if invalid
    }
  };

  return (
    <footer className="fixed bottom-0 w-full bg-secondary shadow-md z-10 font-sans">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="mb-2 md:mb-0">
          <p className="text-gray-700">
            Contact us: <a href={`mailto:${contactEmail}`} className="hover:text-primary">{contactEmail}</a> | {contactPhone}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {socialLinks.map((link) => {
            try {
              const validatedURL = safeURL(link.url);
              return (
                <Link
                  key={link.platform}
                  to={validatedURL}
                  className="text-gray-700 hover:text-primary transition duration-300"
                  aria-label={`Connect with us on ${link.platform}`}
                >
                  {link.platform === 'facebook' && <Facebook className="h-5 w-5" />}
                  {link.platform === 'twitter' && <Twitter className="h-5 w-5" />}
                  {link.platform === 'website' && <Globe className="h-5 w-5" />}
                  {/* Add more social platforms as needed */}
                  {link.platform !== 'facebook' && link.platform !== 'twitter' && link.platform !== 'website' && link.platform}
                </Link>
              );
            } catch (error: any) {
              console.error(`Error rendering social link for ${link.platform}:`, error);
              return null; // or a placeholder link
            }
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;