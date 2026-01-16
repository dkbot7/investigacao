'use client';

/**
 * Trial Banner Component
 * Displays trial status banner at the top of dashboard
 */

import { useEffect, useState } from 'react';
import { useTrial } from '@/hooks/useTrial';
import { trialService } from '@/lib/services/trial.service';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, X, Zap } from 'lucide-react';
import Link from 'next/link';

export function TrialBanner() {
  const { status, loading, fetchStatus } = useTrial();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Don't show banner if:
  // - Still loading
  // - Not a trial account
  // - Trial not active
  // - User dismissed it
  if (loading || !status || !status.is_trial || !status.trial_active || dismissed) {
    return null;
  }

  const urgency = trialService.getUrgencyLevel(status.days_remaining);
  const urgencyColor = trialService.getUrgencyColor(urgency);
  const message = trialService.getTrialMessage(status.days_remaining, status.hours_remaining);
  const progress = trialService.calculateProgress(status.trial_started_at, status.trial_ends_at);

  // Color schemes based on urgency
  const colorSchemes = {
    low: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    medium: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    high: {
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-900',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
    critical: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-900',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
  };

  const colors = colorSchemes[urgency];

  return (
    <div className={`relative border-b ${colors.bg}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon + Message */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`flex-shrink-0 ${colors.icon}`}>
              {urgency === 'critical' || urgency === 'high' ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${colors.text}`}>{message}</p>
              {status.trial_ends_at && (
                <p className="text-xs text-gray-600 mt-0.5">
                  Expira em: {trialService.formatDateTime(status.trial_ends_at)}
                </p>
              )}
            </div>
          </div>

          {/* Center: Progress Bar (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 w-48">
            <Progress value={progress} className="h-2" />
            <span className={`text-xs font-medium ${colors.text} whitespace-nowrap`}>
              {Math.round(100 - progress)}%
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Link href="/pricing">
              <Button size="sm" className={`${colors.button} text-white`}>
                <Zap className="mr-1 h-4 w-4" />
                Fazer Upgrade
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className={`${colors.text} hover:bg-gray-200/50`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden mt-2">
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 flex-1" />
            <span className={`text-xs font-medium ${colors.text}`}>
              {Math.round(100 - progress)}% restante
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
