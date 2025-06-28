import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Plus, BookOpen, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  author: string;
  gradeLevel?: string;
  subject?: string;
  series?: string;
  imageUrl: string;
  aiExtracted: boolean;
  createdAt: string;
}

interface DashboardData {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    gradeLevels: string[];
    subjects: string[];
    series: string[];
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gradeLevel: 'all',
    subject: 'all',
    series: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.gradeLevel !== 'all' && { gradeLevel: filters.gradeLevel }),
        ...(filters.subject !== 'all' && { subject: filters.subject }),
        ...(filters.series !== 'all' && { series: filters.series }),
      });

      const response = await axios.get(`/api/books?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, filters]);

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axios.delete(`/api/books/${bookId}`);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 truncate">{book.author}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {book.gradeLevel && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {book.gradeLevel}
            </span>
          )}
          {book.subject && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
              {book.subject}
            </span>
          )}
          {book.aiExtracted && (
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
              AI
            </span>
          )}
        </div>
        <div className="mt-3 flex justify-between items-center">
          <Link
            to={`/book/${book._id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Details
          </Link>
          <div className="flex space-x-2">
            <Link
              to={`/book/${book._id}`}
              className="p-1 text-gray-400 hover:text-primary-600"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(book._id)}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BookListItem: React.FC<{ book: Book }> = ({ book }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-16 h-20 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x80?text=No+Image';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {book.gradeLevel && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {book.gradeLevel}
              </span>
            )}
            {book.subject && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                {book.subject}
              </span>
            )}
            {book.series && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                {book.series}
              </span>
            )}
            {book.aiExtracted && (
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                AI
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/book/${book._id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Details
          </Link>
          <button
            onClick={() => handleDelete(book._id)}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Inventory</h1>
          <p className="text-gray-600">
            {data?.pagination.totalBooks || 0} books in your collection
          </p>
        </div>
        <Link
          to="/add"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search books by title, author, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.gradeLevel}
              onChange={(e) => setFilters({ ...filters, gradeLevel: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Grades</option>
              {data?.filters.gradeLevels.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>

            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {data?.filters.subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={filters.series}
              onChange={(e) => setFilters({ ...filters, series: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Series</option>
              {data?.filters.series.map((series) => (
                <option key={series} value={series}>{series}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : data?.books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some(f => f !== 'all')
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first book.'
            }
          </p>
          {!searchTerm && Object.values(filters).every(f => f === 'all') && (
            <div className="mt-6">
              <Link
                to="/add"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {data?.books.map((book) => (
              viewMode === 'grid' ? (
                <BookCard key={book._id} book={book} />
              ) : (
                <BookListItem key={book._id} book={book} />
              )
            ))}
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!data.pagination.hasPrev}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!data.pagination.hasNext}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard; 