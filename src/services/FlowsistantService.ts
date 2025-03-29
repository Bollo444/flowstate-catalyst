import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  PrivacyManager,
  PrivacyPermissionLevel,
} from "../security/privacy/PrivacyManager";

interface AnalysisRequest {
  content: string;
  contentType: "text" | "file" | "email" | "cloud";
  sourceId?: string; // Identifier for the source (e.g., file path, email ID)
  sourceProvider?: string; // Provider ID for cloud storage sources
}

interface Task {
  title: string;
  description?: string;
  priority?: "High" | "Medium" | "Low";
  dueDate?: string;
}

interface AnalysisResult {
  summary?: string;
  tasks?: Task[];
  insights?: string;
}

export class FlowsistantService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private privacyManager: PrivacyManager;

  constructor() {
    // Initialize with your API key - in production, this should be stored securely
    // and loaded from environment variables
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(API_KEY);

    // Use Gemini Flash 2.0 model
    this.model = this.genAI.getGenerativeModel({ model: "gemini-flash" });

    // Get the privacy manager instance
    this.privacyManager = PrivacyManager.getInstance();
  }

  async analyzeContent(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      const { content, contentType, sourceId, sourceProvider } = request;

      // Check privacy permissions if this is from a cloud provider
      if (contentType === "cloud" && sourceProvider) {
        const permissionCheck = this.privacyManager.isOperationAllowed(
          sourceProvider,
          "read",
          sourceId || "unknown"
        );

        if (!permissionCheck.allowed) {
          throw new Error(`Privacy restriction: ${permissionCheck.reason}`);
        }

        // Log the access attempt
        this.privacyManager.logAccess({
          integrationId: sourceProvider,
          operation: "read",
          resourcePath: sourceId || "unknown",
          allowed: true,
          timestamp: new Date(),
        });
      }

      // Apply content anonymization if needed
      let processedContent = content;
      if (sourceProvider) {
        const settings = this.privacyManager.getPrivacySettings(sourceProvider);
        if (settings?.anonymizeMetadata) {
          processedContent = this.anonymizeContent(content);
        }
      }

      // Create a prompt based on the content type
      let prompt = "";

      switch (contentType) {
        case "text":
          prompt = `Analyze the following text and extract actionable tasks, provide a summary, and any insights:\n\n${processedContent}`;
          break;
        case "file":
          prompt = `Analyze the following document content and extract actionable tasks, provide a summary, and any insights:\n\n${processedContent}`;
          break;
        case "email":
          prompt = `Analyze the following email and extract actionable tasks, identify deadlines, priorities, and provide a summary:\n\n${processedContent}`;
          break;
        case "cloud":
          prompt = `Analyze the following content from cloud storage and extract actionable tasks, provide a summary, and any insights:\n\n${processedContent}`;
          break;
      }

      // Add specific instructions for task extraction
      prompt += `\n\nFor each task, please provide:\n1. A clear title\n2. A brief description (if applicable)\n3. Priority level (High, Medium, Low)\n4. Due date (if mentioned or can be inferred)\n\nFormat your response as structured data that can be parsed.`;

      // Check if we should process locally
      let result;
      if (sourceProvider) {
        const settings = this.privacyManager.getPrivacySettings(sourceProvider);
        if (settings?.preferLocalProcessing) {
          // Use local processing if available (simplified implementation)
          // In a real app, you would have a local model or processing logic here
          console.log("Using local processing for content analysis");
          // For now, we'll still use the remote API but log the preference
        }
      }

      // Generate content with Gemini Flash 2.0
      result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Process the response to extract structured data
      return this.processResponse(text, contentType);
    } catch (error) {
      console.error("Error analyzing content with Gemini:", error);
      throw new Error("Failed to analyze content. Please try again later.");
    }
  }

  /**
   * Anonymizes content by removing personally identifiable information
   * @param content The content to anonymize
   * @returns Anonymized content
   */
  private anonymizeContent(content: string): string {
    // This is a simplified implementation
    // In a production environment, you would use more robust PII detection and anonymization

    // Replace email addresses
    let anonymized = content.replace(/[\w.-]+@[\w.-]+\.[\w]{2,}/g, "[EMAIL]");

    // Replace phone numbers (simple pattern)
    anonymized = anonymized.replace(
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      "[PHONE]"
    );

    // Replace URLs
    anonymized = anonymized.replace(/(https?:\/\/[^\s]+)/g, "[URL]");

    // Replace potential names (simplified - words starting with capital letters)
    // This is a very basic approach and would need refinement in production
    anonymized = anonymized.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, "[NAME]");

    // Replace potential addresses (simplified)
    anonymized = anonymized.replace(
      /\d+\s[A-Z][a-zA-Z\s]+,\s[A-Z][a-zA-Z\s]+,\s[A-Z]{2}\s\d{5}/g,
      "[ADDRESS]"
    );

    // Replace potential account numbers or IDs (simplified)
    anonymized = anonymized.replace(
      /\b(?:Account|ID|User)\s*[:=]\s*[\w-]{5,}/gi,
      (match) => {
        const prefix =
          match.match(/\b(?:Account|ID|User)\s*[:=]\s*/i)?.[0] || "";
        return prefix + "[ID]";
      }
    );

    return anonymized;
  }

  private processResponse(
    text: string,
    contentType: "text" | "file" | "email" | "cloud"
  ): AnalysisResult {
    // This is a simplified implementation
    // In a production environment, you would use more robust parsing

    try {
      // Try to extract structured data if the model returned JSON
      if (text.includes("{") && text.includes("}")) {
        try {
          // Find JSON-like content in the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            return parsed;
          }
        } catch (e) {
          console.warn("Failed to parse JSON from response:", e);
        }
      }

      // Fallback: Extract information using regex patterns
      const result: AnalysisResult = {};

      // Extract summary (assuming it's at the beginning or has a heading)
      const summaryMatch =
        text.match(/Summary:([^\n]*)(\n|$)/) ||
        text.match(/^([^\n#]+)/) ||
        text.match(/(?:^|\n)(?:Summary|Overview):?([^\n]+)/);

      if (summaryMatch) {
        result.summary = summaryMatch[1].trim();
      }

      // Extract tasks
      result.tasks = [];

      // Look for task sections
      const taskSections = text
        .split(/\n(?:Task|\d+\.|\*|-)\s*/)
        .filter(Boolean);

      if (taskSections.length > 1) {
        // Skip the first section if it's likely the summary
        const startIndex = taskSections[0].length < 100 ? 1 : 0;

        for (let i = startIndex; i < taskSections.length; i++) {
          const section = taskSections[i];
          const task: Task = { title: "" };

          // Extract title (first line or sentence)
          const titleMatch = section.match(/^([^\n.]+)/);
          if (titleMatch) {
            task.title = titleMatch[1].trim();
          } else {
            continue; // Skip if no title found
          }

          // Extract description
          const descMatch = section.match(/(?:\n|\.)\s*([^\n]+)(?:\n|$)/);
          if (descMatch) {
            task.description = descMatch[1].trim();
          }

          // Extract priority
          const priorityMatch = section.match(
            /priority\s*:?\s*(high|medium|low)/i
          );
          if (priorityMatch) {
            const priority = priorityMatch[1].toLowerCase();
            task.priority = (priority.charAt(0).toUpperCase() +
              priority.slice(1)) as "High" | "Medium" | "Low";
          }

          // Extract due date
          const dueDateMatch = section.match(
            /(?:due|deadline|by)\s*:?\s*([^\n,]+)/i
          );
          if (dueDateMatch) {
            task.dueDate = dueDateMatch[1].trim();
          }

          result.tasks.push(task);
        }
      }

      // Extract insights
      const insightsMatch = text.match(
        /(?:Insights|Additional Notes|Recommendations):?([^#]+)(?:\n#|$)/
      );
      if (insightsMatch) {
        result.insights = insightsMatch[1].trim();
      }

      return result;
    } catch (error) {
      console.error("Error processing Gemini response:", error);
      // Return a minimal result with the raw text
      return {
        summary: "Failed to process the response properly.",
        tasks: [
          {
            title: "Review content manually",
            description:
              "The AI assistant could not properly parse the content.",
            priority: "Medium",
          },
        ],
      };
    }
  }
}
