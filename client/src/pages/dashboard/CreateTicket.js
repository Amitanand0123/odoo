import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Bell, 
  User,
  FileText,
  Tag
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreateTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    'categories',
    () => categoryService.getCategories(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const createTicketMutation = useMutation(
    (data) => ticketService.createTicket(data),
    {
      onSuccess: () => {
        toast.success('Ticket created successfully!');
        queryClient.invalidateQueries(['tickets']);
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create ticket');
      }
    }
  );

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await ticketService.uploadFiles(formData);
      setAttachments(prev => [...prev, ...response.urls]);
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const ticketData = {
      ...data,
      attachments
    };
    
    createTicketMutation.mutate(ticketData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-400" />
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {user?.role === 'end_user' ? 'Ask Your Question' : 'Create Ticket'}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="btn btn-outline"
              >
                {user?.role === 'admin' ? 'Admin' : user?.role === 'support_agent' ? 'Support' : 'User'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Form Container */}
        <div className="bg-green-50 rounded-lg border border-green-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                {user?.role === 'end_user' ? 'Question' : 'Subject'}
              </label>
              <input
                id="subject"
                type="text"
                {...register('subject', {
                  required: user?.role === 'end_user' ? 'Question is required' : 'Subject is required',
                  minLength: {
                    value: 5,
                    message: 'Question must be at least 5 characters'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Question must be less than 100 characters'
                  }
                })}
                className="input w-full"
                placeholder={user?.role === 'end_user' ? "Enter your question" : "Enter ticket subject"}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description must be less than 1000 characters'
                  }
                })}
                className="input w-full resize-none"
                placeholder="Provide detailed description of your issue..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                {...register('category', {
                  required: 'Category is required'
                })}
                className="input w-full"
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categoriesData?.data?.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Priority Field */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                {...register('priority')}
                className="input w-full"
              >
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Tags Field */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <input
                id="tags"
                type="text"
                {...register('tags')}
                className="input w-full"
                placeholder="Enter tags separated by commas (e.g., bug, frontend, urgent)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags to help categorize your ticket
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="btn btn-outline cursor-pointer">
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      {isUploading ? 'Uploading...' : 'Choose files'}
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, PDF, DOC up to 5MB each
                  </p>
                </div>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {attachments.map((url, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded border p-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {url.split('/').pop()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={createTicketMutation.isLoading || isUploading}
                className="btn btn-primary btn-lg"
              >
                {createTicketMutation.isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating Ticket...</span>
                  </div>
                ) : (
                  user?.role === 'end_user' ? 'Post Question' : 'Create Ticket'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? Check out our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              guidelines for creating effective tickets
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket; 