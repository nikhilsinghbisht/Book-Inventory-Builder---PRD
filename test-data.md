# Test Data for Book Inventory Builder

This file contains sample book information that you can use to test the application manually when AI extraction is not available or for comparison purposes.

## Sample Books

### 1. Children's Book
- **Title**: The Very Hungry Caterpillar
- **Author**: Eric Carle
- **Grade Level**: K-2
- **Subject**: Science
- **Series**: None
- **ISBN**: 9780399226908
- **Publisher**: Philomel Books
- **Publication Year**: 1969
- **Pages**: 26
- **Description**: A children's picture book about a caterpillar who eats his way through various foods before transforming into a butterfly.

### 2. Middle Grade Fiction
- **Title**: Harry Potter and the Sorcerer's Stone
- **Author**: J.K. Rowling
- **Grade Level**: 3-5
- **Subject**: Literature
- **Series**: Harry Potter
- **ISBN**: 9780590353403
- **Publisher**: Scholastic
- **Publication Year**: 1997
- **Pages**: 223
- **Description**: The first book in the Harry Potter series, following the young wizard's first year at Hogwarts School of Witchcraft and Wizardry.

### 3. Young Adult Fiction
- **Title**: The Hunger Games
- **Author**: Suzanne Collins
- **Grade Level**: 6-8
- **Subject**: Literature
- **Series**: The Hunger Games
- **ISBN**: 9780439023481
- **Publisher**: Scholastic Press
- **Publication Year**: 2008
- **Pages**: 374
- **Description**: A dystopian novel about a teenage girl who volunteers to take her sister's place in a televised battle to the death.

### 4. Educational Textbook
- **Title**: Mathematics: A Complete Course
- **Author**: Various Authors
- **Grade Level**: 9-12
- **Subject**: Mathematics
- **Series**: None
- **ISBN**: 9781234567890
- **Publisher**: Educational Publishing Co.
- **Publication Year**: 2020
- **Pages**: 450
- **Description**: A comprehensive mathematics textbook covering algebra, geometry, and calculus for high school students.

### 5. Science Book
- **Title**: The Origin of Species
- **Author**: Charles Darwin
- **Grade Level**: Adult
- **Subject**: Science
- **Series**: None
- **ISBN**: 9780140439120
- **Publisher**: Penguin Classics
- **Publication Year**: 1859
- **Pages**: 480
- **Description**: Charles Darwin's groundbreaking work on evolutionary biology and natural selection.

## Testing Scenarios

### 1. AI Extraction Testing
- Upload clear, high-quality images of book covers
- Test with different book genres and age levels
- Verify extraction accuracy for various fields
- Test with books that have minimal text on covers

### 2. Manual Entry Testing
- Use the manual entry form to add books
- Test all form fields and validation
- Verify data persistence and retrieval
- Test editing and updating functionality

### 3. Search and Filter Testing
- Test text search functionality
- Test filtering by grade level, subject, and series
- Test pagination with large datasets
- Test sorting options

### 4. Image Processing Testing
- Test various image formats (JPG, PNG, GIF, BMP)
- Test different image sizes and resolutions
- Test image optimization and storage
- Test error handling for invalid images

## Expected AI Extraction Results

When using the Gemini Vision API, you should expect the AI to extract:

### High Accuracy (90%+)
- Book title (when clearly visible)
- Author name (when clearly visible)
- ISBN (when clearly visible)

### Medium Accuracy (70-90%)
- Publisher name
- Publication year
- Number of pages

### Lower Accuracy (50-70%)
- Grade level (requires context clues)
- Subject area (requires context clues)
- Series name (if part of a series)

### Manual Review Required
- Description (AI may provide basic description)
- Additional metadata

## Tips for Better AI Extraction

1. **Image Quality**: Use clear, well-lit photos of book covers
2. **Text Visibility**: Ensure title and author text is clearly readable
3. **Cover Focus**: Crop images to focus on the book cover
4. **Multiple Angles**: Try different angles if initial extraction fails
5. **Manual Correction**: Always review and edit AI-extracted data

## Common Issues and Solutions

### Issue: AI fails to extract any data
**Solution**: Check image quality, ensure text is readable, try different lighting

### Issue: Incorrect title or author extraction
**Solution**: Manual correction is always available, review extracted data carefully

### Issue: Missing optional fields
**Solution**: These fields may not be visible on the cover, add manually if needed

### Issue: Database connection errors
**Solution**: Verify MongoDB Atlas connection string and network connectivity

### Issue: API rate limiting
**Solution**: Check Gemini API usage limits and consider upgrading plan if needed 