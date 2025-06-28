const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get all books with search and filter
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      gradeLevel, 
      subject, 
      series, 
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by grade level
    if (gradeLevel && gradeLevel !== 'all') {
      query.gradeLevel = gradeLevel;
    }

    // Filter by subject
    if (subject && subject !== 'all') {
      query.subject = subject;
    }

    // Filter by series
    if (series && series !== 'all') {
      query.series = series;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Book.countDocuments(query);

    // Get unique values for filters
    const gradeLevels = await Book.distinct('gradeLevel');
    const subjects = await Book.distinct('subject');
    const seriesList = await Book.distinct('series');

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBooks: total,
        hasNext: skip + books.length < total,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        gradeLevels: gradeLevels.filter(Boolean),
        subjects: subjects.filter(Boolean),
        series: seriesList.filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      error: 'Failed to fetch books',
      message: error.message 
    });
  }
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ 
      error: 'Failed to fetch book',
      message: error.message 
    });
  }
});

// Create a new book
router.post('/', async (req, res) => {
  try {
    const {
      title,
      author,
      gradeLevel,
      subject,
      series,
      imageUrl,
      isbn,
      publisher,
      publicationYear,
      pages,
      description,
      aiExtracted = false
    } = req.body;

    // Validate required fields
    if (!title || !author || !imageUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Title, author, and image URL are required' 
      });
    }

    const book = new Book({
      title,
      author,
      gradeLevel: gradeLevel || null,
      subject: subject || null,
      series: series || null,
      imageUrl,
      isbn: isbn || null,
      publisher: publisher || null,
      publicationYear: publicationYear || null,
      pages: pages || null,
      description: description || null,
      aiExtracted
    });

    const savedBook = await book.save();
    res.status(201).json({
      success: true,
      book: savedBook,
      message: 'Book added successfully'
    });

  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ 
      error: 'Failed to create book',
      message: error.message 
    });
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      author,
      gradeLevel,
      subject,
      series,
      imageUrl,
      isbn,
      publisher,
      publicationYear,
      pages,
      description,
      aiExtracted
    } = req.body;

    // Validate required fields
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Title and author are required' 
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        gradeLevel: gradeLevel || null,
        subject: subject || null,
        series: series || null,
        imageUrl: imageUrl || null,
        isbn: isbn || null,
        publisher: publisher || null,
        publicationYear: publicationYear || null,
        pages: pages || null,
        description: description || null,
        aiExtracted: aiExtracted !== undefined ? aiExtracted : true
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      book: updatedBook,
      message: 'Book updated successfully'
    });

  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ 
      error: 'Failed to update book',
      message: error.message 
    });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ 
      error: 'Failed to delete book',
      message: error.message 
    });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const aiExtractedBooks = await Book.countDocuments({ aiExtracted: true });
    const manualBooks = totalBooks - aiExtractedBooks;

    const gradeLevelStats = await Book.aggregate([
      { $group: { _id: '$gradeLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const subjectStats = await Book.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalBooks,
      aiExtractedBooks,
      manualBooks,
      gradeLevelStats: gradeLevelStats.filter(stat => stat._id),
      subjectStats: subjectStats.filter(stat => stat._id)
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

module.exports = router; 