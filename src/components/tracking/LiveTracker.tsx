import React from 'react';
import { Check, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LiveTrackerProps {
  order: Order;
}

const LiveTracker: React.FC<LiveTrackerProps> = ({ order }) => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden card-elevated">
      {/* Map placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full fresh-badge mx-auto flex items-center justify-center animate-pulse-soft">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="text-sm font-medium mt-2">Live tracking active</p>
            <p className="text-xs text-muted-foreground">ETA: {order.estimatedDelivery}</p>
          </div>
        </div>

        {/* Delivery partner info */}
        <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🚴</span>
              </div>
              <div>
                <p className="font-medium text-sm">Alex is on the way</p>
                <p className="text-xs text-muted-foreground">Delivery Partner</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking steps */}
      <div className="p-6">
        <h3 className="font-semibold mb-4">Order Status</h3>
        <div className="space-y-4">
          {order.trackingSteps.map((step, index) => (
            <div key={index} className="flex gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    step.completed
                      ? 'fresh-badge'
                      : 'bg-muted'
                  )}
                >
                  {step.completed ? (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                {index < order.trackingSteps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 mt-1',
                      step.completed ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className={cn('pb-4', step.current && 'animate-pulse-soft')}>
                <p className={cn(
                  'font-medium',
                  step.current && 'text-primary'
                )}>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {step.time && (
                  <p className="text-xs text-muted-foreground mt-1">{step.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTracker;
