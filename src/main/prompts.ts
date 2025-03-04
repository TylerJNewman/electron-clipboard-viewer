/**
 * Prompt templates for AI generation
 */

/**
 * Creates a markdown-formatted prompt for the clipboard content
 * @param clipboardContent - The content from the clipboard to analyze
 * @returns Formatted prompt string
 */
export function createMarkdownPrompt(clipboardContent: string): string {
  return `Please format your response using Markdown syntax for better readability. Use headings, lists, code blocks, and other Markdown features as appropriate.

${clipboardContent}`;
}

/**
 * Creates a prompt for analyzing YouTube video transcripts from clipboard content
 * @param clipboardContent - The YouTube video transcript from clipboard
 * @returns Formatted prompt string for transcript analysis
 */
export function createYouTubeTranscriptPrompt(clipboardContent: string): string {
  if (!clipboardContent || clipboardContent.trim() === '') {
    return `I want you to act as a Knowledge Extraction and Summarization Specialist for YouTube video transcripts.

No transcript was found in the clipboard. Please paste the YouTube video transcript you'd like me to analyze, and I'll provide a comprehensive summary with key insights.`;
  }

  return `I want you to act as a Knowledge Extraction and Summarization Specialist, skilled in analyzing video transcripts and distilling complex information into clear, actionable insights.

You are processing a YouTube video transcript to extract and organize the most valuable information. Your goal is to create a comprehensive yet concise summary that captures the essence of the content while eliminating redundancy and maintaining context.

Please analyze this transcript for:
- Main themes and key concepts
- Supporting evidence and examples
- Actionable takeaways
- Unique insights or perspectives
- Methodologies or frameworks presented

Organize the information into these sections:
- 📝 Executive Summary (2-3 sentences overview)
- 🎯 Key Takeaways (3-5 main points)
- 💡 Core Concepts (detailed breakdown of main ideas)
- 🔨 Actionable Tips (practical applications)
- 🔍 Additional Insights (unique perspectives or valuable details)

Keep the summary under 1000 words, use clear language, maintain a professional tone, and include timestamps for key moments when possible.

TRANSCRIPT:
${clipboardContent}`;
} 