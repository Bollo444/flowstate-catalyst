# The Flowsistant

The Flowsistant is an AI-powered assistant integrated into FlowState Catalyst that uses Google's Gemini Flash 2.0 model to analyze text, files, and emails to extract actionable tasks for your flow.

## Features

- **Text Analysis**: Analyze any text content to extract tasks and insights
- **File Analysis**: Upload and analyze document files (.txt, .md, .doc, .docx, .pdf)
- **Email Analysis**: Paste email content to extract tasks, deadlines, and priorities
- **Task Extraction**: Automatically identify and extract actionable tasks from content
- **Priority Detection**: Determine task priorities based on content analysis
- **Due Date Recognition**: Identify and extract due dates from analyzed content

## Integration with Flow Management

The Flowsistant seamlessly integrates with FlowState Catalyst's flow management system, allowing users to:

1. Analyze content using the Gemini Flash 2.0 model
2. Review extracted tasks and insights
3. Add tasks directly to their flow with a single click

## Setup

To use the Flowsistant, you need to set up a Google Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create an API key
2. Add the API key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the development server

## Usage

The Flowsistant is available at `/flow/assistant` in the application. Users can:

1. Select the input type (text, file, or email)
2. Enter or upload content
3. Click "Analyze with Flowsistant"
4. Review the analysis results
5. Add extracted tasks to their flow

## Technical Implementation

The Flowsistant is implemented using:

- React components for the UI
- Google's Generative AI SDK for JavaScript
- The Gemini Flash 2.0 model for content analysis
- Regular expressions for parsing unstructured AI responses

## Future Enhancements

- Support for more file formats
- Enhanced task extraction accuracy
- Integration with calendar for scheduling
- Customizable analysis parameters
- Batch processing of multiple files
