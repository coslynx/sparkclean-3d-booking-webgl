// src/components/layout/MinimalLayout.tsx
/**
 * Purpose: Provides a minimal layout structure for other pages, containing a main content area.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React from 'react';
import 'src/styles/layout/minimal-layout.css';

interface MinimalLayoutProps {
  children: React.ReactNode;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children }) => {
  return (
    <main className="minimal-layout-container">
      {children || <p>Content not available</p>}
    </main>
  );
};

export default MinimalLayout;