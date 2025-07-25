import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Hero() {
  return (
    <section className="relative py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-lg bg-muted px-4 py-1 text-sm font-medium">
              <Package className="mr-2 h-4 w-4" />
              Fast & Reliable Courier Service
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Track Your Packages With{" "}
              <span className="text-primary">Ease</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Real-time tracking, instant notifications, and complete visibility
              of your shipments from pickup to delivery.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                className="w-full pl-9 pr-24 py-6 rounded-full"
                placeholder="Enter tracking number..."
              />
              <Button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-6">
                Track
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
