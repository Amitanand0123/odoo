import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Bell, 
  MessageSquare, 
  Share2,
  ChevronUp,
  ChevronDown,
  User,
  Calendar,
  Eye,
  Settings
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  // Validate ticket ID format
  const isValidTicketId = id && id.length === 24;

  const { data, isLoading, error } = useQuery(
    ['ticket', id],
    () => ticketService.getTicket(id),
    {
      enabled: !!id && isValidTicketId,
      onSuccess: (data) => {
        console.log('Ticket data loaded:', data);
      },
      onError: (error) => {
        console.error('Failed to load ticket:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
      }
    }
  );

  // Fetch end users for assignment (only for admins and support agents)
  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery(
    'users',
    () => userService.getUsers(),
    {
      enabled: (user?.role === 'admin' || user?.role === 'support_agent') && !!id,
      staleTime: 5 * 60 * 1000,
    }
  );

  const addCommentMutation = useMutation(
    (commentData) => ticketService.addComment(id, commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id]);
        setNewComment('');
        toast.success('Comment added successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add comment');
      }
    }
  );

  const updateTicketMutation = useMutation(
    (updateData) => ticketService.updateTicket(id, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id]);
        toast.success('Ticket updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update ticket');
      }
    }
  );

  const assignTicketMutation = useMutation(
    (assignedTo) => ticketService.assignTicket(id, assignedTo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id]);
        toast.success('Ticket assigned successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign ticket');
      }
    }
  );

  const voteMutation = useMutation(
    (voteType) => ticketService.voteTicket(id, voteType),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id]);
        toast.success('Vote recorded successfully');
      },
      onError: (error) => {
        toast.error('Failed to record vote');
      }
    }
  );

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addCommentMutation.mutate({
      content: newComment,
      isInternal: false
    });
  };

  const handleVote = (voteType) => {
    voteMutation.mutate(voteType);
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

  if (!isValidTicketId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Invalid ticket ID format</p>
          <p className="text-gray-500 mb-4">Ticket ID: {id}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    console.error('Ticket detail error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load ticket: {error.message}</p>
          <p className="text-gray-500 mb-4">Error details: {JSON.stringify(error)}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { ticket, comments } = data?.data || {};

  console.log('TicketDetail data:', data);
  console.log('Ticket:', ticket);
  console.log('Comments:', comments);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ticket not found</p>
          <p className="text-sm text-gray-500 mb-4">Data received: {JSON.stringify(data)}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
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
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Ticket Details</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }}
                className="btn btn-outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="btn btn-outline"
              >
                {user?.role === 'admin' ? 'Admin' : user?.role === 'support_agent' ? 'Support' : 'User'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ticket Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {ticket.subject}
              </h2>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
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
                <span className={`badge ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
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
                {ticket.assignedTo && (
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Assigned to: {ticket.assignedTo.name}
                  </span>
                )}
              </div>
            </div>

            {/* Vote buttons */}
            <div className="flex flex-col items-center space-y-1 ml-4">
              <button
                onClick={() => handleVote('upvote')}
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
                onClick={() => handleVote('downvote')}
                className={`p-1 rounded hover:bg-gray-100 ${
                  ticket.downvotes?.some(vote => vote._id === user?._id) ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Status Update Section for Support Agents and Admins */}
          {(user?.role === 'support_agent' || user?.role === 'admin') && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Update Ticket Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                   <select
                    value={ticket.status}
                    onChange={(e) => updateTicketMutation.mutate({ status: e.target.value })}
                    disabled={updateTicketMutation.isLoading}
                    className="input enhanced-dropdown"
                  >
                   <option value="open" className="bg-yellow-100 text-yellow-800">🟡 Open</option>
                   <option value="in_progress" className="bg-blue-100 text-blue-800">🔵 In Progress</option>
                   <option value="resolved" className="bg-green-100 text-green-800">🟢 Resolved</option>
                   <option value="closed" className="bg-gray-100 text-gray-800">⚫ Closed</option>
                 </select>
                                 <select
                   value={ticket.priority}
                   onChange={(e) => updateTicketMutation.mutate({ priority: e.target.value })}
                   disabled={updateTicketMutation.isLoading}
                   className="input enhanced-dropdown"
                 >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                                 <select
                   value={ticket.assignedTo?._id || ''}
                   onChange={(e) => updateTicketMutation.mutate({ assignedTo: e.target.value || null })}
                   disabled={updateTicketMutation.isLoading || usersLoading}
                   className="input enhanced-dropdown role-dropdown"
                 >
                  <option value="">Unassigned</option>
                  {usersLoading ? (
                    <option disabled>Loading users...</option>
                  ) : usersError ? (
                    <option disabled>Error loading users</option>
                                     ) : (
                     usersData?.data?.filter(u => u.role === 'support_agent' || u.role === 'admin' || u.role === 'end_user').map((userItem) => (
                       <option key={userItem._id} value={userItem._id} data-role={userItem.role}>
                         {userItem.name} {userItem.role === 'support_agent' ? 'Support Agent' : userItem.role === 'admin' ? 'Admin' : 'End User'}
                       </option>
                     ))
                   )}
                </select>
              </div>
              {updateTicketMutation.isLoading && (
                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Updating...</span>
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    Attachment {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Comments ({comments?.length || 0})
          </h3>

          {/* Add Comment Form */}
          {(user?.role === 'support_agent' || user?.role === 'admin' || ticket.createdBy?._id === user?._id) && (
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="input w-full resize-none"
                disabled={addCommentMutation.isLoading}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || addCommentMutation.isLoading}
                  className="btn btn-primary"
                >
                  {addCommentMutation.isLoading ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments?.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.author?.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.isInternal && (
                          <span className="badge bg-yellow-100 text-yellow-800">
                            Internal
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail; 