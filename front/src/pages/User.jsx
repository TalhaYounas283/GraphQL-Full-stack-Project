import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { useToast } from '../components/ui';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  Filter
} from 'lucide-react';
import { Button, Card, Modal, Input, Badge, LoadingSpinner } from '../components/ui';

const User = () => {
  const { token } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const query = `
      query {
        users {
          id
          name
          email
          events {
            id
          }
          bookings {
            id
          }
        }
      }
    `;

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });
      console.log(response);
      const result = await response.json();
      if (result.data && result.data.users) {
        setUsers(result.data.users);
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
    const query = `
      mutation CreateUser($userInput: UserInput!) {
        createUser(userInput: $userInput) {
          id
          name
          email
        }
      }
    `;

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          variables: {
            userInput: {
              name: formData.name,
              email: formData.email,
              password: formData.password
            }
          }
        })
      });
      const result = await response.json();
      if (result.data && result.data.createUser) {
        toast.success(`User "${result.data.createUser.name}" created successfully!`);
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        fetchUsers();
      } else if (result.errors) {
        toast.error(result.errors[0].message);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    const query = `
      mutation DeleteUser($userId: ID!) {
        deleteUser(userId: $userId)
      }
    `;

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          variables: { userId }
        })
      });
      const result = await response.json();
      if (result.data && result.data.deleteUser) {
        toast.success(`User "${userName}" deleted successfully!`);
        fetchUsers();
      } else if (result.errors) {
        toast.error(result.errors[0].message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-1">Manage platform users and their permissions</p>
        </div>
        <Button 
          leftIcon={Plus}
          onClick={() => setShowModal(true)}
        >
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : users.length}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : users.length}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : Math.floor(users.length * 0.3)}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="!p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" leftIcon={Filter}>
            Filters
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Activity</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{user.events?.length || 0} events</span>
                        <span>{user.bookings?.length || 0} bookings</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Delete user"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New User"
        description="Create a new user account"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} leftIcon={Plus}>
              Create User
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-5">
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
