import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Users, 
  Ticket,
  Clock,
  MoreHorizontal,
  CalendarDays
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    events: 0,
    users: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchData = useCallback(async () => {
    const query = `
      query {
        events {
          id
          title
          description
          price
          date
          creator {
            name
          }
        }
        users {
          id
          name
        }
        bookings {
          id
          event {
            title
            price
          }
          user {
            name
          }
        }
      }
    `;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      
      if (result.errors) {
        setError(result.errors[0].message);
        return;
      }
      
      if (result.data) {
        const eventsList = result.data.events || [];
        const bookingsList = result.data.bookings || [];
        const usersList = result.data.users || [];
        
        setEvents(eventsList);
        
        setStats({
          events: eventsList.length,
          users: usersList.length,
          bookings: bookingsList.length
        });

        const activities = [
          ...eventsList.slice(0, 3).map(e => ({
            type: 'event',
            title: `New event "${e.title}" created`,
            time: 'Recently',
            icon: Calendar
          })),
          ...bookingsList.slice(0, 3).map(b => ({
            type: 'booking',
            title: `${b.user?.name || 'Someone'} booked "${b.event?.title}"`,
            time: 'Recently',
            icon: Ticket
          }))
        ].slice(0, 5);
        
        setRecentActivity(activities);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card">
      <div className="stat-content">
        <p className="stat-label">{title}</p>
        <h3 className="stat-value">
          {loading ? <LoadingSpinner size="sm" /> : value}
        </h3>
      </div>
      <div 
        className="stat-icon-wrapper"
        style={{ background: color }}
      >
        <Icon size={24} />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          <h3 className="error-title">Error</h3>
          <p className="error-message">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={fetchData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h2 className="welcome-title">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h2>
          <p className="welcome-subtitle">
            Here's what's happening with your events today.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/events/create')}
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Events"
          value={stats.events}
          icon={Calendar}
          color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookings}
          icon={Ticket}
          color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        {/* Recent Events */}
        <div className="grid-col-8">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Recent Events</h3>
                <p className="card-subtitle">
                  Latest events created in your platform
                </p>
              </div>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/event')}
              >
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <CalendarDays className="empty-state-icon" />
                <h3 className="empty-state-title">
                  No events yet
                </h3>
                <p className="empty-state-description">
                  Get started by creating your first event. It's quick and easy!
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/events/create')}
                >
                  <Plus size={18} />
                  Create Event
                </button>
              </div>
            ) : (
              <div className="event-list">
                {events.slice(0, 5).map((event) => (
                  <div 
                    key={event.id} 
                    className="event-item"
                    onClick={() => navigate('/event')}
                  >
                    <div className="event-info">
                      <div className="event-avatar">
                        {event.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="event-details">
                        <h4>{event.title}</h4>
                        <p>{event.description?.substring(0, 50)}...</p>
                      </div>
                    </div>
                    <div className="event-meta">
                      <span className="badge badge-primary">${event.price}</span>
                      <p className="text-xs text-muted mt-1">
                        {new Date(Number(event.date)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="grid-col-4 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              <button 
                onClick={() => navigate('/events/create')}
                className="action-btn"
              >
                <div className="action-icon bg-blue-50">
                  <Plus size={20} className="text-blue-600" />
                </div>
                <span className="action-text">New Event</span>
              </button>
              
              <button 
                onClick={() => navigate('/user')}
                className="action-btn"
              >
                <div className="action-icon bg-green-50">
                  <Users size={20} className="text-green-600" />
                </div>
                <span className="action-text">Add User</span>
              </button>
              
              <button 
                onClick={() => navigate('/booking')}
                className="action-btn"
              >
                <div className="action-icon bg-purple-50">
                  <Ticket size={20} className="text-purple-600" />
                </div>
                <span className="action-text">Bookings</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <button className="btn-ghost p-1">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-6">
                <LoadingSpinner />
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center p-8 text-muted">
                <Clock size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <ActivityIcon size={16} />
                      </div>
                      <div className="activity-content">
                        <p className="activity-title">
                          {activity.title}
                        </p>
                        <p className="activity-time">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
