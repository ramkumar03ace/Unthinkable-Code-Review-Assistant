import { useState } from "react";
import { CodeUpload } from "@/components/CodeUpload";
import { ReviewReport } from "@/components/ReviewReport";
import { analyzeCode } from "@/services/codeReviewService";
import { Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewResult {
  issues: Array<{
    severity: "critical" | "warning" | "info" | "success";
    title: string;
    description: string;
    line?: number;
  }>;
  summary: string;
  score: number;
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);

  const handleCodeSubmit = async (code: string, language: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(code, language);
      setReviewResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewReview = () => {
    setReviewResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CodeReview AI</h1>
                <p className="text-xs text-muted-foreground">Intelligent Code Analysis</p>
              </div>
            </div>
            
            <Button variant="secondary" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!reviewResult ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl font-bold text-foreground">
                AI-Powered Code Reviews
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get instant feedback on your code quality, structure, and best practices.
                Upload or paste your code to receive detailed improvement suggestions.
              </p>
            </div>
            
            <CodeUpload onCodeSubmit={handleCodeSubmit} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="secondary"
              onClick={handleNewReview}
              className="mb-4"
            >
              ← New Review
            </Button>
            
            <ReviewReport
              issues={reviewResult.issues}
              summary={reviewResult.summary}
              score={reviewResult.score}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 bg-card/30">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>codeReview, made by Ramkumar A D</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
