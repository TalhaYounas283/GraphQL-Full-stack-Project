import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { 
  Calendar, 
  Clock, 
  FileText, 
  ArrowLeft,
  Users,
  Save,
  X,
  Tag,
  DollarSign
} from 'lucide-react';
import { graphqlRequest } from '../api/graphqlClient';
import { CREATE_EVENT_MUTATION } from '../api/operations';
import { useAuth } from '../context/useAuth';

const CreateEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    price: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'file' ? files[0] : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!token) {
        toast.error('Please login to create an event');
        navigate('/login');
        return;
      }

      const combinedDate = `${formData.date}T${formData.time}:00`;

      await graphqlRequest({
        query: CREATE_EVENT_MUTATION,
        variables: {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          date: combinedDate,
          creatorId: user.userId || user.id
        },
        token: token
      });
      
      toast.success('Event created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Create event error:', error);
      toast.error(error.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Calendar size={28} />
            EventHub
          </div>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className="sidebar-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </a>
          <a href="/events" className="sidebar-link active">
            <Calendar size={20} />
            Events
          </a>
          <a href="/bookings" className="sidebar-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Bookings
          </a>
          <a href="/users" className="sidebar-link">
            <Users size={20} />
            Users
          </a>
        </nav>
        <div className="sidebar-footer">
          <button 
            className="btn btn-outline btn-full"
            onClick={() => navigate('/login')}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content event-form-page">
        {/* Header */}
        <div className="create-event-header">
          <h1 className="header-title">Create New Event</h1>
          <div className="header-actions">
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
</div>
        {/* Content */}
        <div className="content">
            <div className="event-form-header">
              <h2 className="event-form-title">Event Details</h2>
              <p className="event-form-subtitle">
                Fill in the information below to create a new event
              </p>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              {/* Event Title */}
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="4"
                />
              </div>

              {/* Date & Time Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Date *
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-input"
                      style={{ paddingLeft: '1rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Clock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Time *
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="form-input"
                      style={{ paddingLeft: '1rem' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Ticket Price ($)
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00 for Free"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '18px', 
                        height: '18px', 
                        border: '2px solid rgba(255,255,255,0.3)', 
                        borderTopColor: 'white', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
