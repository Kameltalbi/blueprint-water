import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { mockObjectives } from "@/lib/mock-data";

export function ObjectivesWidget() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Réalité vs Objectif
        </CardTitle>
        <p className="text-xs text-muted-foreground">Progression vers vos objectifs de réduction</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {mockObjectives.map((obj) => {
          const numTarget = typeof obj.target === "number" ? Math.abs(obj.target) : 100;
          const numCurrent = typeof obj.current === "number" ? Math.abs(obj.current) : 66;
          const progress = Math.min((numCurrent / numTarget) * 100, 100);
          const angle = (progress / 100) * 180;

          return (
            <div key={obj.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{obj.label}</span>
                <span className="font-semibold">
                  {typeof obj.current === "number" ? `${obj.current}${obj.unit}` : obj.current}
                  <span className="text-muted-foreground font-normal">
                    {" / "}{typeof obj.target === "number" ? `${obj.target}${obj.unit}` : obj.target}
                  </span>
                </span>
              </div>
              {/* Gauge */}
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-10 overflow-hidden">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Background arc */}
                    <path
                      d="M 5 50 A 45 45 0 0 1 95 50"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    <path
                      d="M 5 50 A 45 45 0 0 1 95 50"
                      fill="none"
                      stroke={progress >= 75 ? "hsl(142, 72%, 29%)" : progress >= 40 ? "hsl(48, 96%, 53%)" : "hsl(0, 72%, 51%)"}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(angle / 180) * 141.37} 141.37`}
                    />
                    {/* Center text */}
                    <text
                      x="50"
                      y="48"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill="currentColor"
                      className="fill-foreground"
                    >
                      {Math.round(progress)}%
                    </text>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress >= 75 ? "hsl(142, 72%, 29%)" : progress >= 40 ? "hsl(48, 96%, 53%)" : "hsl(0, 72%, 51%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
