import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Calendar, MoreVertical, Loader2, ArrowLeft, Image as ImageIcon, ChevronRight, Pencil, Trash2, Globe, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Components
import CreateEventModal from "../components/gallery/CreateEventModal";
import EditEventModal from "../components/gallery/EditEventModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function ClientEvents() {
  const { id: clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [portfolioToggleEvent, setPortfolioToggleEvent] = useState(null);

  const togglePortfolioStatus = async (status) => {
    if (!portfolioToggleEvent) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/drive-gallery/event/${portfolioToggleEvent._id}/portfolio`, {
        portfolioEnabled: status
      }, {
        headers: { 'x-auth-token': token }
      });
      setEvents(prev => prev.map(e => 
        e._id === portfolioToggleEvent._id ? { ...e, portfolioEnabled: status } : e
      ));
      toast.success(status ? "Event added to Home Portfolio." : "Event removed from Home Portfolio.");
    } catch (err) {
      toast.error("Failed to update event portfolio status.");
    } finally {
      setPortfolioToggleEvent(null);
    }
  };

  useEffect(() => {
    fetchClientAndEvents();
  }, [clientId]);

  const fetchClientAndEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch Client Info
      const clientRes = await axios.get(`${API_BASE_URL}/api/drive-gallery/${clientId}`, {
        headers: { 'x-auth-token': token }
      });
      setClient(clientRes.data);

      // Fetch Events
      const eventsRes = await axios.get(`${API_BASE_URL}/api/drive-gallery/${clientId}/events`, {
        headers: { 'x-auth-token': token }
      });
      setEvents(eventsRes.data);
    } catch (err) {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (e, eventId) => {
    e.stopPropagation();
    if (!window.confirm("Remove this event?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/drive-gallery/events/${eventId}`, {
        headers: { 'x-auth-token': token }
      });
      setEvents(prev => prev.filter(ev => ev._id !== eventId));
      toast.success("Event removed.");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleEdit = (e, event) => {
    e.stopPropagation();
    setEditingEvent(event);
  };

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/admin/gallery')}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8a8a8a] hover:text-[#2d2d2d] transition-all"
          >
            <ArrowLeft size={14} /> Back to Clients
          </button>
          <div className="space-y-1">
            <h1 className="page-title text-4xl text-[#2d2d2d]">{client?.name || "Client Events"}</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#cfe8d5] ml-1">Event Collections</p>
          </div>
        </div>

        <button 
          onClick={() => setIsCreateOpen(true)}
          className="add-btn flex items-center gap-3 px-8 py-4 shadow-xl shadow-[#cfe8d5]/40"
        >
          <Plus size={18} />
          <span className="text-xs font-bold uppercase tracking-widest text-[#2d2d2d]">Add New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3].map(n => <div key={n} className="h-80 bg-white/40 animate-pulse rounded-[40px] border border-white/60" />)}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event, idx) => (
            <motion.div
              layout
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ y: -12 }}
              onClick={() => navigate(`/admin/gallery/event/${event._id}`)}
              className="group relative aspect-[3.5/4.5] rounded-[32px] overflow-hidden bg-black shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Full Image Background */}
              <motion.img 
                src={event.thumbnail} 
                alt={event.name}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />

              {/* Sophisticated Gradient Overlays */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Glassmorphic Management Controls (appear on hover) */}
              <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100 z-50">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setPortfolioToggleEvent(event);
                  }}
                  className={`p-3 backdrop-blur-xl border border-white/20 hover:bg-[#cfe8d5]/40 rounded-2xl transition-all shadow-lg group/port ${event.portfolioEnabled !== false ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/10 text-white hover:text-white'}`}
                  title="Toggle Home Portfolio"
                >
                  <Globe size={16} className="group-hover/port:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEdit(e, event);
                  }}
                  className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-[#cfe8d5]/40 text-white hover:text-white rounded-2xl transition-all shadow-lg group/edit"
                  title="Edit Event"
                >
                  <Pencil size={16} className="group-hover/edit:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    deleteEvent(e, event._id);
                  }}
                  className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-red-500/40 text-white hover:text-red-200 rounded-2xl transition-all shadow-lg group/del"
                  title="Remove Event"
                >
                   <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                </button>
              </div>

              {/* Dynamic Text Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none z-30">
                <h3 className="text-3xl font-bold text-white tracking-tight mb-2 group-hover:text-[#cfe8d5] transition-colors duration-500 flex items-center gap-3">
                  {event.name}
                  {event.portfolioEnabled !== false && <Star size={20} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />}
                </h3>

                <div className="flex items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors duration-500">
                  <Calendar size={12} className="shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest pt-0.5">
                    {new Date(event.eventDate || event.createdAt).toLocaleDateString()}
                  </span>
                  <div className="h-px flex-1 bg-white/10 group-hover:bg-white/20 transition-all" />
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-1000">
           <div className="avatar !w-20 !h-20 !rounded-[32px] mb-6 bg-linear-to-br from-[#cfe8d5] to-transparent flex items-center justify-center">
              <ImageIcon size={32} className="text-[#8a8a8a]" strokeWidth={1} />
           </div>
           <h3 className="page-title !text-xl text-[#8a8a8a]">No events found for this client.</h3>
           <p className="text-[10px] uppercase tracking-widest font-bold text-[#8a8a8a] mt-2">Start by creating your first event</p>
        </div>
      )}

      {/* Event Form Modal */}
      <CreateEventModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        clientId={clientId}
        onEventCreated={(newEvent) => {
          setEvents(prev => [newEvent, ...prev]);
        }}
      />

      <EditEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
        onSuccess={fetchClientAndEvents}
      />

      {/* Portfolio Toggle Modal */}
      <AnimatePresence>
        {portfolioToggleEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-100 to-transparent -z-10" />
              <div className="w-24 h-24 mx-auto rounded-[20px] overflow-hidden mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-4 border-white bg-gray-100">
                <img src={portfolioToggleEvent.thumbnail} alt={portfolioToggleEvent.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{portfolioToggleEvent.name}</h3>
              <p className="text-gray-500 mb-8 font-light text-sm">
                {portfolioToggleEvent.portfolioEnabled !== false
                  ? "This event is currently visible as a filter in the Home Portfolio. Do you want to hide it?"
                  : "Display this event as a filter in the Home Portfolio?"}
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setPortfolioToggleEvent(null)}
                  className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => togglePortfolioStatus(portfolioToggleEvent.portfolioEnabled === false ? true : false)}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-medium text-white transition-all shadow-lg ${
                    portfolioToggleEvent.portfolioEnabled !== false
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
                      : "bg-black hover:bg-gray-800 shadow-black/20"
                  }`}
                >
                  {portfolioToggleEvent.portfolioEnabled !== false ? "Hide Event" : "Yes, Display"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
