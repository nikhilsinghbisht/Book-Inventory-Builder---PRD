const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async extractBookDetails(imagePath) {
    try {
      // Read the image file as base64
      const imageData = fs.readFileSync(imagePath);
      const base64Image = Buffer.from(imageData).toString('base64');

      // Create a clear, direct prompt
      const prompt = `You are a book metadata extractor. Look at this book cover image and extract ONLY the following information. Be precise and only return a valid JSON object:
      - title: The exact title as shown on the cover
      - author: The author's name exactly as written
      - gradeLevel: Any grade level or age range shown (null if none)
      - subject: The main subject or category (null if unclear)
      - series: The series name if part of a series (null if none)
      - isbn: The ISBN if visible (null if not shown)
      - publisher: The publisher's name (null if not shown)
      - publicationYear: The year of publication (null if not shown)
      - pages: The number of pages (null if not shown)
      - description: A very brief description of what's visible on the cover (null if not applicable)

      Return ONLY the JSON object with these fields, nothing else.`;

      console.log('Sending request to Gemini API with image...');
      
      // Correct Gemini Vision API usage: prompt and image as separate parts
      const result = await this.model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      console.log('Raw Gemini response:', text);

      // Try to parse the JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('No JSON object found in response');
          throw new Error('Invalid response format');
        }

        const bookData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed book data:', bookData);

        return {
          success: true,
          data: {
            title: bookData.title || '',
            author: bookData.author || '',
            gradeLevel: bookData.gradeLevel || null,
            subject: bookData.subject || null,
            series: bookData.series || null,
            isbn: bookData.isbn || null,
            publisher: bookData.publisher || null,
            publicationYear: bookData.publicationYear || null,
            pages: bookData.pages || null,
            description: bookData.description || null
          }
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        console.error('Raw response text:', text);
        
        return {
          success: false,
          error: 'Could not parse book details from the image',
          fallbackData: {
            title: '',
            author: '',
            gradeLevel: null,
            subject: null,
            series: null,
            isbn: null,
            publisher: null,
            publicationYear: null,
            pages: null,
            description: null
          }
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        success: false,
        error: error.message,
        fallbackData: {
          title: '',
          author: '',
          gradeLevel: null,
          subject: null,
          series: null,
          isbn: null,
          publisher: null,
          publicationYear: null,
          pages: null,
          description: null
        }
      };
    }
  }

  async testConnection() {
    try {
      const result = await this.model.generateContent('Hello, this is a test message.');
      const response = await result.response;
      return { success: true, message: 'Gemini API connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new GeminiService(); 