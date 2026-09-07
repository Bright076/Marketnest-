"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * VisitTracker Component
 * Automatically tracks page visits by sending requests to the tracking API
 * Place this in your root layout to track all page views
 */
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages (optional - remove this if you want to track admin too)
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Track the visit
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: pathname || '/',
          }),
        });
      } catch (error) {
        // Silent fail - don't disrupt user experience if tracking fails
        console.error('Visit tracking error:', error);
      }
    };

    trackVisit();
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
