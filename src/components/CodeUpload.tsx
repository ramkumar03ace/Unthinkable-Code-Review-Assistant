import { useState } from "react";
import { Upload, Code2, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface CodeUploadProps {
  onCodeSubmit: (code: string, language: string) => void;
  isAnalyzing: boolean;
}

export const CodeUpload = ({ onCodeSubmit, isAnalyzing }: CodeUploadProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        
        // Detect language from file extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
          js: 'javascript',
          ts: 'typescript',
          tsx: 'typescript',
          jsx: 'javascript',
          py: 'python',
          java: 'java',
          cpp: 'cpp',
          c: 'c',
          go: 'go',
          rs: 'rust',
          rb: 'ruby',
        };
        setLanguage(langMap[ext || ''] || 'javascript');
        toast.success("File loaded successfully!");
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error("Please provide some code to analyze");
      return;
    }
    onCodeSubmit(code, language);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Your Code</h2>
            <p className="text-sm text-muted-foreground">Paste code or upload a file for AI-powered analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>

            <label className="flex-1">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.go,.rs,.rb"
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </label>
          </div>

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your code here...
function example() {
  console.log('Hello, CodeReview AI!');
}"
            className="min-h-[300px] font-mono text-sm bg-code-bg border-border focus:ring-primary"
          />

          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing || !code.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing Code...
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4 mr-2" />
                Analyze Code
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
