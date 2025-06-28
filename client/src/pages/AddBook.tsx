import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface BookData {
  title: string;
  author: string;
  gradeLevel: string;
  subject: string;
  series: string;
  isbn: string;
  publisher: string;
  publicationYear: string;
  pages: string;
  description: string;
}

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<BookData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bookData, setBookData] = useState<BookData>({
    title: '',
    author: '',
    gradeLevel: '',
    subject: '',
    series: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    pages: '',
    description: '',
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadedImage(response.data.imageUrl);
        const extracted = response.data.bookData;
        setExtractedData(extracted);
        setBookData({
          title: extracted.title || '',
          author: extracted.author || '',
          gradeLevel: extracted.gradeLevel || '',
          subject: extracted.subject || '',
          series: extracted.series || '',
          isbn: extracted.isbn || '',
          publisher: extracted.publisher || '',
          publicationYear: extracted.publicationYear || '',
          pages: extracted.pages || '',
          description: extracted.description || '',
        });
        toast.success('Book details extracted successfully!');
      } else {
        setUploadedImage(response.data.imageUrl);
        setExtractedData(response.data.bookData);
        setBookData({
          title: response.data.bookData.title || '',
          author: response.data.bookData.author || '',
          gradeLevel: response.data.bookData.gradeLevel || '',
          subject: response.data.bookData.subject || '',
          series: response.data.bookData.series || '',
          isbn: response.data.bookData.isbn || '',
          publisher: response.data.bookData.publisher || '',
          publicationYear: response.data.bookData.publicationYear || '',
          pages: response.data.bookData.pages || '',
          description: response.data.bookData.description || '',
        });
        toast.error('Failed to extract book details. Please enter them manually.');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.response?.data?.error === 'Gemini API key not configured') {
        toast.error('AI extraction is not configured. Please contact your administrator.');
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleInputChange = (field: keyof BookData, value: string) => {
    setBookData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!uploadedImage || !bookData.title || !bookData.author) {
      toast.error('Please upload an image and fill in at least title and author.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post('/api/books', {
        ...bookData,
        imageUrl: uploadedImage,
        aiExtracted: !!extractedData,
      });

      toast.success('Book added successfully!');
      navigate(`/book/${response.data.book._id}`);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
        <p className="text-gray-600">Upload a book cover photo and let AI extract the details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Upload Book Cover</h2>
          
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`dropzone ${
              isDragActive ? 'drag-active' : ''
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-sm text-gray-600">Processing image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Drop the image here...'
                    : 'Drag & drop a book cover image, or click to select'}
                </p>
                <p className="text-xs text-gray-500">Supports JPG, PNG, GIF, BMP (max 10MB)</p>
              </div>
            )}
          </div>

          {/* Preview */}
          {uploadedImage && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Preview</h3>
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Book cover preview"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                />
                {extractedData && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Book Details Form */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Book Details</h2>
          
          {extractedData && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  AI extracted details available. Review and edit as needed.
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Required Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={bookData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                value={bookData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level
                </label>
                <input
                  type="text"
                  value={bookData.gradeLevel}
                  onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., K-2, 3-5, 6-8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={bookData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series
              </label>
              <input
                type="text"
                value={bookData.series}
                onChange={(e) => handleInputChange('series', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Series name (if applicable)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={bookData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ISBN number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={bookData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Publisher name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  value={bookData.publicationYear}
                  onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2023"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pages
                </label>
                <input
                  type="number"
                  value={bookData.pages}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Number of pages"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={bookData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description of the book"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              disabled={!uploadedImage || !bookData.title || !bookData.author || isSaving}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Book'
              )}
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook; 