import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/ui';
import { 
  Users, 
  Search, 
  Plus,  
  Mail,
  Calendar,
  UserCheck,
  Edit2,
  Trash2,
  Filter,
  UserPlus
} from 'lucide-react';
import { Button, Card, Modal, Input, Badge, LoadingSpinner } from '../components/ui';
import { graphqlRequest } from '../api/graphqlClient';
import { 
  USERS_QUERY, 
  CREATE_USER_MUTATION, 
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION 
} from '../api/operations';
import '../styles/User.css';

const User = () => {
  const { token } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await graphqlRequest({
        query: USERS_QUERY,
        token: token
      });
      if (result && result.users) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const result = await graphqlRequest({
        query: CREATE_USER_MUTATION,
        variables: {
          userInput: {
            name: formData.name,
            email: formData.email,
            password: formData.password
          }
        },
        token: token
      });

      if (result && result.createUser) {
        toast.success(`User "${result.createUser.name}" created successfully!`);
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const result = await graphqlRequest({
        query: UPDATE_USER_MUTATION,
        variables: {
          userId: selectedUser.id,
          userInput: {
            name: formData.name,
            email: formData.email,
            password: formData.password
          }
        },
        token: token
      });

      if (result && result.updateUser) {
        toast.success(`User "${result.updateUser.name}" updated successfully!`);
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        setIsEditMode(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '' // Keep empty for security
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      const result = await graphqlRequest({
        query: DELETE_USER_MUTATION,
        variables: { userId },
        token: token
      });

      if (result && result.deleteUser) {
        toast.success(`User "${userName}" deleted successfully!`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-page-container">
      {/* Header */}
      <div className="user-header-section">
        <div className="user-page-title">
          <h2>User Management</h2>
          <p className="user-page-subtitle">Manage platform users and their permissions</p>
        </div>
        <Button 
          leftIcon={Plus}
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="user-stat-icon-wrapper total">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="user-stat-info">
            <p>Total Users</p>
            <h3 className="user-stat-value">{loading ? '...' : users.length}</h3>
          </div>
        </div>
        
        <div className="user-stat-card">
          <div className="user-stat-icon-wrapper active">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div className="user-stat-info">
            <p>Active Users</p>
            <h3 className="user-stat-value">{loading ? '...' : users.length}</h3>
          </div>
        </div>
  
      </div>

      {/* Search and Filters */}
      <div className="user-filters-section">
        <Card className="!p-4 bg-white/40 backdrop-blur-md border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={Search}
                className="!mb-0"
              />
            </div>
            <Button variant="outline" leftIcon={Filter} className="bg-white/50">
              Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <div className="user-table-card">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state py-20">
            <Users className="empty-state-icon" />
            <h3 className="empty-state-title">
              {searchQuery ? 'No users found' : 'No users yet'}
            </h3>
            <p className="empty-state-description">
              {searchQuery 
                ? 'Try adjusting your search' 
                : 'Start by adding your first user to the platform'}
            </p>
            <Button leftIcon={Plus} onClick={() => setShowModal(true)}>
              Add User
            </Button>
          </div>
        ) : (
          <div className="user-table-wrapper">
            <table className="premium-user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Joined</th>
                  <th>Activity</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-avatar-premium online">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-info-name">{user.name}</div>
                          <div className="user-info-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-gray-700">
                        N/A
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Date Joined</div>
                    </td>
                    <td>
                      <div className="flex gap-4">
                        <div className="stat-pill">
                          <span className="font-bold text-primary-600">{user.events?.length || 0}</span>
                          <span className="text-xs text-gray-500 ml-1">Events</span>
                        </div>
                        <div className="stat-pill">
                          <span className="font-bold text-secondary-600">{user.bookings?.length || 0}</span>
                          <span className="text-xs text-gray-500 ml-1">Bookings</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="success" className="px-3 py-1">Active</Badge>
                    </td>
                    <td>
                      <div className="user-action-group">
                        {(useAuth().user?.role === 'ADMIN' || useAuth().user?.userId === user.id) && (
                          <button 
                            className="user-action-btn edit" 
                            title="Edit user"
                            onClick={() => openEditModal(user)}
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {useAuth().user?.role === 'ADMIN' && (
                          <button 
                            className="user-action-btn delete" 
                            title="Delete user"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditMode(false);
          setSelectedUser(null);
          setFormData({ name: '', email: '', password: '' });
        }}
        title={isEditMode ? "Edit User" : "Add New User"}
        description={isEditMode ? "Update user profile information" : "Create a new user account"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={isEditMode ? handleUpdateUser : handleCreateUser} leftIcon={isEditMode ? Edit2 : Plus}>
              {isEditMode ? "Update User" : "Create User"}
            </Button>
          </>
        }
      >
        <form onSubmit={isEditMode ? handleUpdateUser : handleCreateUser} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter user's full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            leftIcon={Users}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter user's email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            leftIcon={Mail}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Set a temporary password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default User;
