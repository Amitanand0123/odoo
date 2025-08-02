import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Bell, 
  User,
  Calendar,
  MessageSquare,
  Eye,
  ThumbsUp,
  Users,
  Inbox,
  Clock,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { categoryService } from '../../services/categoryService';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SupportDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeQueue, setActiveQueue] = useState('my-tickets');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoryService.getCategories(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch users for assignment
  const { data: usersData } = useQuery(
    'users',
    () => userService.getUsers(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Update ticket mutation
  const updateTicketMutation = useMutation(
    (updateData) => ticketService.updateTicket(updateData.ticketId, updateData.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tickets']);
        toast.success('Ticket updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update ticket');
      }
    }
  );

  // Fetch my tickets (assigned to me)
  const { data: myTicketsData, isLoading: myTicketsLoading } = useQuery(
    ['tickets', 'my-tickets', filters, currentPage],
    () => ticketService.getTickets({
      ...filters,
      assignedTo: 'me',
      page: currentPage,
      limit: 10
    }),
    {
      enabled: activeQueue === 'my-tickets',
      keepPreviousData: true,
    }
  );

  // Fetch all tickets
  const { data: allTicketsData, isLoading: allTicketsLoading } = useQuery(
    ['tickets', 'all', filters, currentPage],
    () => ticketService.getTickets({
      ...filters,
      page: currentPage,
      limit: 10
    }),
    {
      enabled: activeQueue === 'all',
      keepPreviousData: true,
    }
  );

  const currentData = activeQueue === 'my-tickets' ? myTicketsData : allTicketsData;
  const isLoading = activeQueue === 'my-tickets' ? myTicketsLoading : allTicketsLoading;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
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

  const getQueueStats = () => {
    const myTickets = myTicketsData?.data || [];
    const allTickets = allTicketsData?.data || [];
    
    return {
      myOpen: myTickets.filter(t => t.status === 'open').length,
      myInProgress: myTickets.filter(t => t.status === 'in_progress').length,
      myResolved: myTickets.filter(t => t.status === 'resolved').length,
      allOpen: allTickets.filter(t => t.status === 'open').length,
      allInProgress: allTickets.filter(t => t.status === 'in_progress').length,
      allResolved: allTickets.filter(t => t.status === 'resolved').length,
    };
  };

  const stats = getQueueStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-400" />
              <h1 className="text-xl font-semibold text-gray-900">Support Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/create-ticket" className="btn btn-primary">
                Create Ticket
              </Link>
              <Link to="/profile" className="btn btn-outline">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Inbox className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Open</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.myOpen}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.myInProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.myResolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">All Open</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.allOpen}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">All In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.allInProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">All Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.allResolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveQueue('my-tickets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeQueue === 'my-tickets'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Inbox className="w-4 h-4 inline mr-2" />
                My Tickets ({stats.myOpen + stats.myInProgress + stats.myResolved})
              </button>
              <button
                onClick={() => setActiveQueue('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeQueue === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                All Tickets ({stats.allOpen + stats.allInProgress + stats.allResolved})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Filters */}
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
            <h3 className="text-lg font-medium text-gray-900">
              {activeQueue === 'my-tickets' ? 'My Assigned Tickets' : 'All Tickets'}
            </h3>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData?.data?.map((ticket) => (
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
                          <select
                            value={ticket.status}
                            onChange={(e) => {
                              updateTicketMutation.mutate({
                                ticketId: ticket._id,
                                data: { status: e.target.value }
                              });
                            }}
                            disabled={updateTicketMutation.isLoading}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={ticket.priority}
                            onChange={(e) => {
                              updateTicketMutation.mutate({
                                ticketId: ticket._id,
                                data: { priority: e.target.value }
                              });
                            }}
                            disabled={updateTicketMutation.isLoading}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {ticket.createdBy?.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {ticket.createdBy?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.createdBy?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={ticket.assignedTo?._id || ''}
                            onChange={(e) => {
                              updateTicketMutation.mutate({
                                ticketId: ticket._id,
                                data: { assignedTo: e.target.value || null }
                              });
                            }}
                            disabled={updateTicketMutation.isLoading}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="">Unassigned</option>
                            {usersData?.data?.filter(u => u.role === 'end_user').map((userItem) => (
                              <option key={userItem._id} value={userItem._id}>
                                {userItem.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/tickets/${ticket._id}`)}
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
              {currentData?.pagination && currentData.pagination.pages > 1 && (
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
                      onClick={() => setCurrentPage(Math.min(currentData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === currentData.pagination.pages}
                      className="btn btn-outline btn-sm"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{(currentPage - 1) * currentData.pagination.limit + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * currentData.pagination.limit, currentData.pagination.total)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{currentData.pagination.total}</span>
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
                        {Array.from({ length: currentData.pagination.pages }, (_, i) => i + 1).map((page) => (
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
                          onClick={() => setCurrentPage(Math.min(currentData.pagination.pages, currentPage + 1))}
                          disabled={currentPage === currentData.pagination.pages}
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

export default SupportDashboard; 