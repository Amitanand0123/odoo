import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Plus, 
  Bell, 
  Filter, 
  ChevronUp, 
  ChevronDown,
  MessageSquare,
  Eye,
  Calendar,
  User
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    assignedTo: user?.role === 'support_agent' ? '' : undefined
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoryService.getCategories(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data, isLoading, error, refetch } = useQuery(
    ['tickets', filters],
    () => ticketService.getTickets(filters),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleVote = async (ticketId, voteType) => {
    try {
      await ticketService.voteTicket(ticketId, voteType);
      refetch();
      toast.success('Vote recorded successfully');
    } catch (error) {
      toast.error('Failed to record vote');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load tickets</p>
          <button 
            onClick={() => refetch()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-400" />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Link
                to="/create-ticket"
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask
              </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6">
          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </button>

            {/* Show Open Only Toggle */}
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.status === 'open'}
                onChange={(e) => handleFilterChange('status', e.target.checked ? 'open' : '')}
                className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Show open only
            </label>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    {categoriesData?.data?.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input"
                  >
                    <option value="createdAt">Most Recent</option>
                    <option value="updatedAt">Recently Modified</option>
                    <option value="voteCount">Most Voted</option>
                    <option value="viewCount">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>
          </form>
        </div>

        {/* Tickets List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {data?.data?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tickets found</p>
                <Link
                  to="/create-ticket"
                  className="btn btn-primary mt-4"
                >
                  Create your first ticket
                </Link>
              </div>
            ) : (
              data?.data?.map((ticket) => (
                <div key={ticket._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    {/* Left side - Vote and content */}
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Vote buttons */}
                      <div className="flex flex-col items-center space-y-1">
                        <button
                          onClick={() => handleVote(ticket._id, 'upvote')}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            ticket.upvotes?.some(vote => vote._id === user?._id) ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-900">
                          {ticket.upvotes?.length - ticket.downvotes?.length || 0}
                        </span>
                        <button
                          onClick={() => handleVote(ticket._id, 'downvote')}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            ticket.downvotes?.some(vote => vote._id === user?._id) ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Ticket content */}
                      <div className="flex-1">
                        <Link
                          to={`/tickets/${ticket._id}`}
                          className="block hover:text-primary-600 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {ticket.subject}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {ticket.category && (
                            <span 
                              className="badge badge-default"
                              style={{ backgroundColor: ticket.category.color }}
                            >
                              {ticket.category.name}
                            </span>
                          )}
                          <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>

                        {/* Meta information */}
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {ticket.createdBy?.name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {ticket.viewCount} views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Status and actions */}
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`badge ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {ticket.commentCount || 0} comments
                      </div>

                      {user?.role === 'end_user' && ticket.createdBy?._id === user?._id && (
                        <button
                          onClick={() => {
                            // Handle close ticket
                            toast.success('Ticket closed successfully');
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page)}
                  className={`btn btn-sm ${
                    page === filters.page ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handleFilterChange('page', Math.min(data.pagination.pages, filters.page + 1))}
                disabled={filters.page === data.pagination.pages}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 