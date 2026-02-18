import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { useToast } from '../components/ui';
import { 
  Ticket, 
  Search, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  MoreHorizontal,
  X
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../components/ui';

const Booking = () => {
  const { token, user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '',
    priceRange: ''
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const query = `
      query {
        bookings {
          id
          createdAt
          event {
            id
            title
            price
            date
            creator {
              name
            }
          }
          user {
            id
            name
            email
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
      const result = await response.json();
      if (result.data && result.data.bookings) {
        setBookings(result.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your booking for "${eventTitle}"?`)) {
      return;
    }

    const query = `
      mutation CancelBooking($bookingId: ID!) {
        cancelBooking(bookingId: $bookingId) {
          id
          title
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
          variables: { bookingId }
        })
      });
      const result = await response.json();
      if (result.data && result.data.cancelBooking) {
        toast.success(`Booking for "${result.data.cancelBooking.title}" cancelled successfully!`);
        fetchBookings();
      } else if (result.errors) {
        toast.error(result.errors[0].message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const isBookingMatchingFilters = (booking) => {
    const matchesSearch = searchQuery === '' || 
      booking.event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (filters.dateRange && booking.event?.date) {
      const eventDate = new Date(Number(booking.event.date));
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
    }

    let matchesPrice = true;
    if (filters.priceRange) {
      const price = booking.event?.price || 0;
      if (filters.priceRange === 'free') matchesPrice = price === 0;
      else if (filters.priceRange === '0-50') matchesPrice = price > 0 && price <= 50;
      else if (filters.priceRange === '50-100') matchesPrice = price > 50 && price <= 100;
      else if (filters.priceRange === '100+') matchesPrice = price > 100;
    }

    return matchesSearch && matchesDate && matchesPrice;
  };

  const filteredBookings = bookings.filter(isBookingMatchingFilters);

  const myBookings = filteredBookings.filter(booking => booking.user?.id === (user?.userId || user?.id));
  const displayBookings = activeTab === 'my' ? myBookings : filteredBookings;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.event?.price || 0), 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      dateRange: '',
      priceRange: ''
    });
  };

  return (
    <div className="booking-content-area">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Bookings Management</h1>
          <p>View and coordinate event participations</p>
        </div>
        <Button variant="outline" leftIcon={Download} className="btn-outline">
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="booking-stat-card">
          <div className="stat-icon-box icon-blue">
            <Ticket size={24} />
          </div>
          <div className="stat-info">
            <p className="label">Total Bookings</p>
            <h3 className="value">{loading ? '...' : bookings.length}</h3>
          </div>
        </div>
        <div className="booking-stat-card">
          <div className="stat-icon-box icon-green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <p className="label">Confirmed</p>
            <h3 className="value">{loading ? '...' : bookings.length}</h3>
          </div>
        </div>
        <div className="booking-stat-card">
          <div className="stat-icon-box icon-purple">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <p className="label">Scheduled</p>
            <h3 className="value">{loading ? '...' : Math.floor(bookings.length * 0.8)}</h3>
          </div>
        </div>
        <div className="booking-stat-card">
          <div className="stat-icon-box icon-orange">
            <Download size={24} />
          </div>
          <div className="stat-info">
            <p className="label">Est. Revenue</p>
            <h3 className="value">${loading ? '...' : totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="booking-filters-bar">
        <div className="search-field">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by event title or attendee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X 
              size={16} 
              className="cursor-pointer hover:text-text-primary" 
              onClick={() => setSearchQuery('')} 
            />
          )}
        </div>

        <div className="filter-controls">
          <div className="tab-group">
            <button
              onClick={() => setActiveTab('all')}
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Activity
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            >
              My Tickets
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
      </div>

      {showFilters && (
        <Card className="!p-4 bg-bg-secondary border-border-light">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wider">Event Date</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full bg-bg-primary border border-border-medium rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary-500 outline-none"
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">Next 7 Days</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wider">Price Category</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full bg-bg-primary border border-border-medium rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary-500 outline-none"
              >
                <option value="">Any Price</option>
                <option value="free">Free Only</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                className="w-full justify-center text-text-tertiary hover:text-primary-600"
                onClick={handleClearFilters}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Bookings List */}
      <div className="bookings-list-container">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="bookings-empty-state">
            <Ticket size={48} className="icon mx-auto" />
            <h3>{searchQuery || filters.dateRange || filters.priceRange ? 'No matches found' : 'No bookings yet'}</h3>
            <p>
              {searchQuery || filters.dateRange || filters.priceRange 
                ? 'Try refining your search terms or resetting the filters.' 
                : 'When users book events, they will appear here in a chronologically organized list.'}
            </p>
            <Button onClick={() => window.location.href = '/event'} className="btn-primary">
              Discover Events
            </Button>
          </div>
        ) : (
          <div className="bookings-list">
            {displayBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-main">
                  <div className="booking-info-group">
                    <div className="event-initial-box">
                      {(booking.event?.title || 'E').charAt(0).toUpperCase()}
                    </div>
                    <div className="event-details">
                      <h4>{booking.event?.title || 'Untitled Event'}</h4>
                      <div className="meta-tags">
                        <span className="tag">
                          <User size={14} />
                          {booking.user?.name || 'Anonymous User'}
                        </span>
                        <span className="tag">
                          <Calendar size={14} />
                          {booking.event?.date 
                            ? new Date(Number(booking.event.date)).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
                            : 'Date TBD'}
                        </span>
                        <span className="tag">
                          <Clock size={14} />
                          Booked {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <div className="price-status">
                      <p className="price">${(booking.event?.price || 0).toFixed(2)}</p>
                      <span className="status-badge">Confirmed</span>
                    </div>
                    {booking.user?.id === (user?.userId || user?.id) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="btn-outline"
                        onClick={() => handleCancelBooking(booking.id, booking.event?.title)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
