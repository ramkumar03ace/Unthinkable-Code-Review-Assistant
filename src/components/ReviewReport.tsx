import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Issue {
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
  line?: number;
}

interface ReviewReportProps {
  issues: Issue[];
  summary: string;
  score: number;
}

const severityConfig = {
  critical: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
    label: "Info",
  },
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    label: "Good",
  },
};

export const ReviewReport = ({ issues, summary, score }: ReviewReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Code Review Report</h2>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Quality Score</div>
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</div>
          </div>
        </div>
        
        <div className="p-4 bg-secondary/50 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </Card>

      <div className="space-y-3">
        {issues.map((issue, index) => {
          const config = severityConfig[issue.severity];
          const Icon = config.icon;
          
          return (
            <Card
              key={index}
              className={`p-4 bg-card border-border hover:border-primary/50 transition-all duration-200 ${config.bg}`}
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{issue.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {config.label}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {issue.description}
                  </p>
                  
                  {issue.line && (
                    <div className="text-xs text-muted-foreground font-mono">
                      Line {issue.line}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
