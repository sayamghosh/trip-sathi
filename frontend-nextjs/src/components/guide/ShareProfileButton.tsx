'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { Button } from '../ui/button';

export function ShareProfileButton({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'outline';
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled share / clipboard denied — no-op
    }
  };

  return (
    <Button type="button" variant={variant} onClick={handleShare} className={className}>
      {copied ? <Check className="text-emerald-600" /> : <Share2 />}
      {copied ? 'Link copied' : 'Share profile'}
    </Button>
  );
}
