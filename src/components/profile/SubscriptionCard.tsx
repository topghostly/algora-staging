import { CreditCard, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface SubscriptionCardProps {
  subscriptionTier: string;
  credits1on1: number;
}

export default function SubscriptionCard({
  subscriptionTier,
  credits1on1,
}: SubscriptionCardProps) {
  return (
    <div className="py-6">
      <div className="flex items-center gap-2 mb-4">
        {/* <CreditCard className="" size={30} /> */}
        <h3 className="font-medium">Subscription</h3>
      </div>

      <div className="flex flex-col  gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="text-lg font-semibold">{subscriptionTier}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">1-on-1 Credits</p>
          <div className="flex items-center gap-2">
            {/* <Zap size={16} className="text-yellow-500" /> */}
            <span className="text-lg font-semibold">{credits1on1}</span>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/pricing">
            <Button variant="outline">Manage Subscription</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
