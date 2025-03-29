import { AnalysisResult } from "./types";

export class FileAnalyzer {
  async analyzeFile(file: File): Promise<AnalysisResult> {
    // Simulate file analysis with basic implementation
    // In a real app, this would use ML/AI to analyze file contents
    const nameWithoutExt = file.name.split(".")[0];
    const fileExt = file.name.split(".").pop() || "";

    // Generate suggested name based on file name patterns
    const suggestedName = this.generateSuggestedName(nameWithoutExt);

    // Extract potential project context
    const projectContext = this.extractProjectContext(nameWithoutExt, fileExt);

    // Generate relevant tags
    const tags = this.generateTags(nameWithoutExt, fileExt);

    return {
      originalName: file.name,
      suggestedName,
      projectContext,
      tags,
      type: fileExt,
      size: file.size,
    };
  }

  private generateSuggestedName(fileName: string): string {
    // Remove special characters and normalize spacing
    const normalized = fileName
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Add date prefix for better organization
    const date = new Date().toISOString().split("T")[0];
    return `${date}-${normalized}`;
  }

  private extractProjectContext(
    fileName: string,
    fileType: string
  ): {
    relatedProject: string;
    suggestedTasks: string[];
  } {
    // Basic implementation - in a real app this would be more sophisticated
    const words = fileName.toLowerCase().split(/[^a-zA-Z0-9]+/);

    // Try to identify project type
    let projectType = "general";
    if (words.some((w) => ["doc", "document", "report"].includes(w))) {
      projectType = "documentation";
    } else if (words.some((w) => ["design", "ui", "ux"].includes(w))) {
      projectType = "design";
    } else if (words.some((w) => ["code", "src", "test"].includes(w))) {
      projectType = "development";
    }

    // Generate suggested tasks based on file type and project type
    const suggestedTasks = this.generateSuggestedTasks(projectType, fileType);

    return {
      relatedProject: `${projectType}-project`,
      suggestedTasks,
    };
  }

  private generateSuggestedTasks(
    projectType: string,
    fileType: string
  ): string[] {
    const tasks = [];

    switch (projectType) {
      case "documentation":
        tasks.push("Review document content");
        tasks.push("Update documentation");
        break;
      case "design":
        tasks.push("Review design assets");
        tasks.push("Implement design changes");
        break;
      case "development":
        tasks.push("Code review");
        tasks.push("Write tests");
        tasks.push("Update documentation");
        break;
      default:
        tasks.push("Review content");
        tasks.push("Organize files");
    }

    tasks.push("Update project status");
    return tasks;
  }

  private generateTags(fileName: string, fileType: string): string[] {
    const tags = new Set<string>();

    // Add file type tag
    tags.add(fileType.toLowerCase());

    // Add content type tags based on file name
    const words = fileName.toLowerCase().split(/[^a-zA-Z0-9]+/);
    words.forEach((word) => {
      if (word.length > 2) {
        // Skip very short words
        tags.add(word);
      }
    });

    // Add common category tags
    if (["doc", "docx", "pdf"].includes(fileType.toLowerCase())) {
      tags.add("document");
    } else if (["jpg", "png", "gif"].includes(fileType.toLowerCase())) {
      tags.add("image");
    } else if (["js", "ts", "py", "java"].includes(fileType.toLowerCase())) {
      tags.add("code");
    }

    return Array.from(tags);
  }
}
