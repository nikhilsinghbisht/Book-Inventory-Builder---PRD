import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Save, X, BookOpen, User, Calendar, Hash, Building, FileText, Tag } from 'lucide-react';
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
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  pages?: number;
  description?: string;
  aiExtracted: boolean;
  createdAt: string;
  updatedAt: string;
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>({});

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Book, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author) {
      toast.error('Title and author are required');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(`/api/books/${id}`, formData);
      setBook(response.data.book);
      setEditing(false);
      toast.success('Book updated successfully');
    } catch (error: any) {
      console.error('Error updating book:', error);
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`/api/books/${id}`);
      toast.success('Book deleted successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast.error(error.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Book not found</h3>
        <p className="mt-1 text-sm text-gray-500">The book you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editing ? 'Edit Book' : book.title}
            </h1>
            <p className="text-gray-600">Book details and information</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(book);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Cover</h2>
            <div className="aspect-[3/4] overflow-hidden rounded-lg">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
            </div>
            {book.aiExtracted && (
              <div className="mt-3 flex items-center justify-center">
                <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                  <Tag className="h-3 w-3 mr-1" />
                  AI Extracted
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Book Information</h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="h-4 w-4 inline mr-2" />
                  Title
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{book.title}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Author
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900">{book.author}</p>
                )}
              </div>

              {/* Grade Level and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.gradeLevel || ''}
                      onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., K-2, 3-5"
                    />
                  ) : (
                    <p className="text-gray-900">{book.gradeLevel || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.subject || ''}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Mathematics, Science"
                    />
                  ) : (
                    <p className="text-gray-900">{book.subject || 'Not specified'}</p>
                  )}
                </div>
              </div>

              {/* Series */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.series || ''}
                    onChange={(e) => handleInputChange('series', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Series name (if applicable)"
                  />
                ) : (
                  <p className="text-gray-900">{book.series || 'Not part of a series'}</p>
                )}
              </div>

              {/* ISBN and Publisher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="h-4 w-4 inline mr-2" />
                    ISBN
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.isbn || ''}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="ISBN number"
                    />
                  ) : (
                    <p className="text-gray-900">{book.isbn || 'Not available'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    Publisher
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.publisher || ''}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Publisher name"
                    />
                  ) : (
                    <p className="text-gray-900">{book.publisher || 'Not specified'}</p>
                  )}
                </div>
              </div>

              {/* Publication Year and Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Publication Year
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.publicationYear || ''}
                      onChange={(e) => handleInputChange('publicationYear', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 2023"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="text-gray-900">{book.publicationYear || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Pages
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.pages || ''}
                      onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Number of pages"
                      min="1"
                    />
                  ) : (
                    <p className="text-gray-900">{book.pages || 'Not specified'}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {editing ? (
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of the book"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {book.description || 'No description available'}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Added:</span> {new Date(book.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(book.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 