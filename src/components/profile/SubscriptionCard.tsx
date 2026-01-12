import { CreditCard, Zap } from "lucide-react";
import Link from "next/link";

interface SubscriptionCardProps {
  subscriptionTier: string;
  credits1on1: number;
}

export default function SubscriptionCard({
  subscriptionTier,
  credits1on1,
}: SubscriptionCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="text-primary" size={24} />
        <h2 className="text-xl font-bold">Subscription</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="text-lg font-semibold">{subscriptionTier}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">1-on-1 Credits</p>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span className="text-lg font-semibold">{credits1on1}</span>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/pricing" className="btn btn-outline w-full">
            Manage Subscription
          </Link>
        </div>
      </div>
    </div>
  );
}
