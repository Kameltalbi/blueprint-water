import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { mockObjectives } from "@/lib/mock-data";

export function ObjectivesWidget() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Objectifs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockObjectives.map((obj) => {
          const numTarget = typeof obj.target === "number" ? Math.abs(obj.target) : 100;
          const numCurrent = typeof obj.current === "number" ? Math.abs(obj.current) : 66;
          const progress = Math.min((numCurrent / numTarget) * 100, 100);

          return (
            <div key={obj.label} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{obj.label}</span>
                <span className="font-semibold">
                  {typeof obj.current === "number" ? `${obj.current}${obj.unit}` : obj.current}
                  <span className="text-muted-foreground font-normal">
                    {" / "}{typeof obj.target === "number" ? `${obj.target}${obj.unit}` : obj.target}
                  </span>
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
