// Mock AI service - In production, this would call an actual LLM API
export const analyzeCode = async (code: string, language: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis based on simple heuristics
  const issues = [];
  const lines = code.split('\n');
  
  // Check for long lines
  const longLines = lines.filter(line => line.length > 100);
  if (longLines.length > 0) {
    issues.push({
      severity: "warning" as const,
      title: "Long Lines Detected",
      description: `Found ${longLines.length} line(s) exceeding 100 characters. Consider breaking them for better readability.`,
    });
  }

  // Check for console.log
  const hasConsoleLogs = code.includes('console.log');
  if (hasConsoleLogs) {
    issues.push({
      severity: "info" as const,
      title: "Debug Statements Found",
      description: "Remove console.log statements before production deployment.",
    });
  }

  // Check for comments
  const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));
  if (commentLines.length > lines.length * 0.2) {
    issues.push({
      severity: "success" as const,
      title: "Well Documented",
      description: "Good use of comments to explain code logic.",
    });
  } else if (commentLines.length < 3) {
    issues.push({
      severity: "warning" as const,
      title: "Limited Documentation",
      description: "Consider adding more comments to explain complex logic.",
    });
  }

  // Check for error handling
  const hasErrorHandling = code.includes('try') || code.includes('catch') || code.includes('throw');
  if (!hasErrorHandling && lines.length > 20) {
    issues.push({
      severity: "critical" as const,
      title: "Missing Error Handling",
      description: "No error handling detected. Add try-catch blocks for robust code.",
    });
  } else if (hasErrorHandling) {
    issues.push({
      severity: "success" as const,
      title: "Error Handling Present",
      description: "Good practice: Error handling implemented.",
    });
  }

  // Check for code complexity
  const cyclomaticComplexity = (code.match(/if|for|while|case|catch|\?\?|\|\|/g) || []).length;
  if (cyclomaticComplexity > 15) {
    issues.push({
      severity: "warning" as const,
      title: "High Complexity",
      description: "Code has high cyclomatic complexity. Consider refactoring into smaller functions.",
    });
  }

  // Check for naming conventions
  const hasCamelCase = /[a-z][A-Z]/.test(code);
  if (hasCamelCase) {
    issues.push({
      severity: "success" as const,
      title: "Good Naming Convention",
      description: "Proper camelCase naming convention followed.",
    });
  }

  // Calculate score
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const score = Math.max(0, 100 - (criticalCount * 20) - (warningCount * 10));

  // Generate summary
  const summary = `Analyzed ${lines.length} lines of ${language} code. ${
    score >= 80 
      ? "Excellent code quality with minimal issues." 
      : score >= 60 
      ? "Good code with some areas for improvement." 
      : "Code needs significant improvements for production readiness."
  } ${criticalCount > 0 ? `Found ${criticalCount} critical issue(s) that should be addressed immediately.` : ""}`;

  return {
    issues,
    summary,
    score,
  };
};
