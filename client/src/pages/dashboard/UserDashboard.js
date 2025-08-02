import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  Bell, 
  User,
  Calendar,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  SortAsc,
  SortDesc
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoryService.getCategories(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data, isLoading, error, refetch } = useQuery(
    ['tickets', filters, sortBy, sortOrder, currentPage],
    () => ticketService.getTickets({
      ...filters,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: 10
    }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        console.log('UserDashboard tickets loaded:', data);
        console.log('User ID:', user?.id);
        console.log('User role:', user?.role);
      },
      onError: (error) => {
        console.error('UserDashboard tickets error:', error);
      }
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      priority: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading tickets</p>
          <button onClick={() => refetch()} className="btn btn-primary">
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
              <h1 className="text-xl font-semibold text-gray-900">My Tickets</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="btn btn-outline"
              >
                Profile
              </Link>
              <button
                onClick={() => navigate('/create-ticket')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data?.pagination?.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data?.data?.filter(t => t.status === 'open').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data?.data?.filter(t => t.status === 'resolved').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data?.data?.filter(t => {
                    const ticketDate = new Date(t.createdAt);
                    const now = new Date();
                    return ticketDate.getMonth() === now.getMonth() && 
                           ticketDate.getFullYear() === now.getFullYear();
                  }).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="input w-full pl-10"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </form>

            {/* Filters */}
            {showFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="input w-full"
                    >
                      <option value="">All Status</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input w-full"
                    >
                      <option value="">All Categories</option>
                      {categoriesData?.data?.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="input w-full"
                    >
                      <option value="">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="btn btn-outline w-full"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">My Tickets</h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('subject')}>
                        <div className="flex items-center">
                          Subject
                          {sortBy === 'subject' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                        <div className="flex items-center">
                          Status
                          {sortBy === 'status' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('priority')}>
                        <div className="flex items-center">
                          Priority
                          {sortBy === 'priority' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                        <div className="flex items-center">
                          Created
                          {sortBy === 'createdAt' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.data?.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.subject}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.category?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              console.log('Navigating to ticket:', ticket._id);
                              console.log('Ticket created by:', ticket.createdBy?._id);
                              console.log('Current user:', user?.id);
                              navigate(`/tickets/${ticket._id}`);
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(data.pagination.pages, currentPage + 1))}
                      disabled={currentPage === data.pagination.pages}
                      className="btn btn-outline btn-sm"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{(currentPage - 1) * data.pagination.limit + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * data.pagination.limit, data.pagination.total)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{data.pagination.total}</span>
                        {' '}results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="btn btn-outline btn-sm"
                        >
                          Previous
                        </button>
                        {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`btn btn-sm ${
                              currentPage === page ? 'btn-primary' : 'btn-outline'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(data.pagination.pages, currentPage + 1))}
                          disabled={currentPage === data.pagination.pages}
                          className="btn btn-outline btn-sm"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 