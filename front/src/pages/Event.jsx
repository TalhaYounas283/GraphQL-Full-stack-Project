import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { useToast } from '../components/ui';
import { 
  CalendarDays, 
  Search, 
  SlidersHorizontal, 
  Users, 
  X, 
  Plus, 
  MapPin,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { Button, Card, Modal, Input, Badge, LoadingSpinner } from '../components/ui';

const Event = () => {
  const { token, user } = useAuth();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [bookingLoading, setBookingLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    dateRange: '',
    priceRange: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    date: '',
    location: '',
    category: 'general'
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            id
            title
            description
            price
            date
            category
            creator {
              id
              name
            }
            bookings {
              id
              user {
                id
                name
              }
            }
          }
        }
      `
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(requestBody)
      });
      const result = await response.json();
      if (result.data && result.data.events) {
        setEvents(result.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to create events");
      return;
    }

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!, $category: String, $creatorId: ID!) {
          createEvent(eventInput: {
            title: $title,
            description: $description,
            price: $price,
            date: $date,
            category: $category,
            creatorId: $creatorId
          }) {
            id
            title
          }
        }
      `,
      variables: {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        date: formData.date,
        category: formData.category,
        creatorId: user.userId || user.id
      }
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      const result = await response.json();
      if (result.data && result.data.createEvent) {
        toast.success(`Event "${result.data.createEvent.title}" created successfully!`);
        setShowModal(false);
        setFormData({ title: '', description: '', price: '', date: '', location: '', category: 'general' });
        fetchEvents();
      } else if (result.errors) {
        toast.error(result.errors[0].message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleBookEvent = async (eventId) => {
    if (!token) {
      toast.error("Please login to book events");
      return;
    }

    setBookingLoading(eventId);
    const requestBody = {
      query: `
        mutation CreateBooking($eventId: ID!, $userId: ID!) {
          createBooking(eventId: $eventId, userId: $userId) {
            id
            event {
              title
            }
          }
        }
      `,
      variables: {
        eventId,
        userId: user.userId || user.id
      }
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      const result = await response.json();
      if (result.data && result.data.createBooking) {
        toast.success(`Successfully booked "${result.data.createBooking.event.title}"!`);
        fetchEvents();
      } else if (result.errors) {
        toast.error(result.errors[0].message);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book event");
    } finally {
      setBookingLoading(null);
    }
  };

  const isEventMatchingFilters = (event) => {
    // Search query match
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category match
    const matchesCategory = filters.category === '' || 
      event.category?.toLowerCase() === filters.category.toLowerCase();

    // Price range match
    let matchesPrice = true;
    if (filters.priceRange === 'free') {
      matchesPrice = event.price === 0;
    } else if (filters.priceRange === '0-50') {
      matchesPrice = event.price > 0 && event.price <= 50;
    } else if (filters.priceRange === '50-100') {
      matchesPrice = event.price > 50 && event.price <= 100;
    } else if (filters.priceRange === '100+') {
      matchesPrice = event.price > 100;
    }

    // Date range match
    let matchesDate = true;
    const eventDate = new Date(Number(event.date));
    const now = new Date();
    
    if (filters.dateRange === 'today') {
      matchesDate = eventDate.toDateString() === now.toDateString();
    } else if (filters.dateRange === 'week') {
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      matchesDate = eventDate >= now && eventDate <= weekFromNow;
    } else if (filters.dateRange === 'month') {
      matchesDate = eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesDate;
  };

  const filteredEvents = events.filter(isEventMatchingFilters);

  const myEvents = filteredEvents.filter(event => event.creator?.id === (user?.userId || user?.id));

  const displayEvents = activeTab === 'my' ? myEvents : filteredEvents;

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      dateRange: '',
      priceRange: ''
    });
  };

  return (
    <div className="event-content-area">
      {/* Header */}
      <div className="page-section-header">
        <div className="title-group">
          <h1>Explore Events</h1>
          <p>Discover and book amazing experiences around you</p>
        </div>
        <Button 
          leftIcon={Plus}
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Create Event
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="event-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X 
              size={16} 
              className="cursor-pointer hover:text-white" 
              onClick={() => setSearchQuery('')} 
            />
          )}
        </div>

        <div className="filter-tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`tab ${activeTab === 'my' ? 'active' : ''}`}
          >
            My Events
          </button>
        </div>

        <Button 
          variant="outline" 
          leftIcon={showFilters ? X : Filter}
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline"
        >
          {showFilters ? 'Hide' : 'Filters'}
        </Button>
      </div>

      {showFilters && (
        <Card className="!p-4 bg-surface-light border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wider">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary outline-none"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wider">Date Range</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary outline-none"
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wider">Price Range</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary outline-none"
              >
                <option value="">Any Price</option>
                <option value="free">Free</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-center text-text-tertiary hover:text-primary"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="loading-placeholder">
          <LoadingSpinner size="lg" />
          <p>Loading curated events for you...</p>
        </div>
      ) : displayEvents.length === 0 ? (
        <div className="empty-state-card">
          <CalendarDays size={48} className="mx-auto" />
          <h3>
            {searchQuery || filters.category || filters.dateRange || filters.priceRange 
              ? 'No matching events found' 
              : 'No events scheduled yet'}
          </h3>
          <p className="max-w-xs mx-auto mb-6">
            {searchQuery || filters.category || filters.dateRange || filters.priceRange 
              ? 'Try adjusting your keywords or clearing the filters' 
              : 'Be the first to host an event and showcase it here!'}
          </p>
          <Button leftIcon={Plus} onClick={() => setShowModal(true)}>
            Create Event
          </Button>
        </div>
      ) : (
        <div className="events-grid">
          {displayEvents.map((event) => (
            <div key={event.id} className="premium-event-card">
              <div className="card-image">
                <span className="category-badge">
                  {event.category || 'General'}
                </span>
                <span className="price-tag">
                  {event.price === 0 ? 'FREE' : `$${event.price}`}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 text-white text-xs font-medium">
                    <CalendarDays size={14} />
                    {new Date(Number(event.date)).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="card-content">
                <div className="card-meta-top">
                  <span className="attendees">
                    <Users size={14} />
                    {event.bookings?.length || 0} Joined
                  </span>
                  <span className="date">
                    <Clock size={14} />
                    {new Date(Number(event.date)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3>{event.title}</h3>
                <p className="description">{event.description}</p>

                <div className="card-action-footer">
                  <div className="organizer">
                    <div className="mini-avatar">
                      {(event.creator?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span>{event.creator?.name || 'Anonymous'}</span>
                  </div>
                  <button
                    className={`book-now-btn ${bookingLoading === event.id ? 'loading' : ''}`}
                    disabled={bookingLoading === event.id || event.bookings?.some(b => b.user?.id === (user?.userId || user?.id))}
                    onClick={() => handleBookEvent(event.id)}
                  >
                    {bookingLoading === event.id ? (
                      <LoadingSpinner size="sm" />
                    ) : event.bookings?.some(b => b.user?.id === (user?.userId || user?.id)) ? (
                      'Booked'
                    ) : (
                      'Join Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Host a New Event"
        description="Share your experience with the community"
        size="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-5">
          <Input
            label="What is the event called?"
            placeholder="e.g., Infinite Loop Hackathon"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tell us more about it</label>
            <textarea
              placeholder="Provide a compelling description..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary focus:border-primary outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Registration Price ($)"
              type="number"
              step="0.01"
              placeholder="0.00 for Free"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <Input
              label="Event Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Pick a Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary focus:border-primary outline-none transition-all"
            >
              <option value="general">General</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="social">Social</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Discard
            </Button>
            <Button type="submit" className="btn-primary">
              Launch Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Event;
