import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Bell, 
  User, 
  Settings, 
  Upload, 
  ArrowUp,
  Globe,
  Mail
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, requestUpgrade } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoryService.getCategories(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      category: user?.category || ''
    }
  });

  const updateProfileMutation = useMutation(
    (data) => updateProfile(data),
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const upgradeRequestMutation = useMutation(
    () => requestUpgrade(),
    {
      onSuccess: () => {
        toast.success('Upgrade request submitted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit upgrade request');
      }
    }
  );

  const handleProfileUpdate = async (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleUpgradeRequest = () => {
    upgradeRequestMutation.mutate();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here you would typically upload to your file service
      // For now, we'll just simulate the upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ profileImage: imageUrl });
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      end_user: 'End User',
      support_agent: 'Support Agent',
      admin: 'Admin'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      end_user: 'bg-blue-100 text-blue-800',
      support_agent: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    };
    return colors[role] || colors.end_user;
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
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline"
              >
                Dashboard
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline"
              >
                {user?.role === 'admin' ? 'Admin' : user?.role === 'support_agent' ? 'Support' : 'User'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Profile Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`badge ${getRoleColor(user?.role)}`}>
                    {getRoleDisplayName(user?.role)}
                  </span>
                  {user?.role === 'end_user' && (
                    <button
                      onClick={handleUpgradeRequest}
                      disabled={upgradeRequestMutation.isLoading || user?.upgradeRequest}
                      className="btn btn-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {upgradeRequestMutation.isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : user?.upgradeRequest ? (
                        'Request Pending'
                      ) : (
                        <>
                          <ArrowUp className="w-4 h-4 mr-1" />
                          Upgrade
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => {
                  if (isEditing) {
                    reset();
                  }
                  setIsEditing(!isEditing);
                }}
                className="btn btn-outline"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Name must be less than 50 characters'
                    }
                  })}
                  disabled={!isEditing}
                  className="input w-full disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input w-full bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              {/* Role Field (Read-only) */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <input
                    id="role"
                    type="text"
                    value={getRoleDisplayName(user?.role)}
                    disabled
                    className="input w-full bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {user?.role === 'end_user' 
                    ? 'Request an upgrade to become a Support Agent or Admin'
                    : 'Your role is managed by administrators'
                  }
                </p>
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category of Interest
                </label>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <select
                    id="category"
                    {...register('category')}
                    disabled={!isEditing}
                    className="input w-full disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select a category</option>
                    {categoriesData?.data?.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This helps us understand your areas of interest
                </p>
              </div>

              {/* Language Field */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  {...register('language')}
                  disabled={!isEditing}
                  className="input w-full disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setIsEditing(false);
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="btn btn-primary"
                  >
                    {updateProfileMutation.isLoading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Saving...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Member since:</span>
              <span className="ml-2 text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last updated:</span>
              <span className="ml-2 text-gray-900">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Account status:</span>
              <span className="ml-2 text-green-600 font-medium">
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {user?.upgradeRequest && (
              <div>
                <span className="text-gray-500">Upgrade request:</span>
                <span className="ml-2 text-yellow-600 font-medium">
                  Pending review
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 