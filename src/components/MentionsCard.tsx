import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export function MentionsCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="p-2 rounded-lg bg-warning/10">
            <MessageSquare className="w-5 h-5 text-warning" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 !border-none !text-[0.6em]"
          >
            Optimal Brand
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-sm text-muted-foreground">Mentions</p>
          <p className="text-3xl font-bold text-foreground">2,345</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-medium">
            +23% vs last week
          </span>
        </div>

        <div className="flex items-center gap-3 justify-between mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-500/10"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-pink-500/10"
          >
            <Instagram className="w-4 h-4 text-pink-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-500/10"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-700/10"
          >
            <Linkedin className="w-4 h-4 text-blue-700" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
