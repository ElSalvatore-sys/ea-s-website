import React from 'react';
import { Monitor, Palette, ShoppingBag, Calendar, Image, Users, Star, Menu } from 'lucide-react';

interface WebsitePreviewProps {
  projectId: string;
  screenshotType: 'homepage' | 'gallery' | 'booking';
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ projectId, screenshotType }) => {
  // 33eye.de website preview layouts
  if (projectId === '33eye') {
    if (screenshotType === 'homepage') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 bg-black/40 backdrop-blur-xl rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                33EYE
              </div>
              <nav className="hidden md:flex gap-6">
                <span className="text-gray-300 hover:text-white cursor-pointer">Home</span>
                <span className="text-gray-300 hover:text-white cursor-pointer">Gallery</span>
                <span className="text-gray-300 hover:text-white cursor-pointer">About</span>
                <span className="text-gray-300 hover:text-white cursor-pointer">Contact</span>
              </nav>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm">
              Book Now
            </button>
          </div>

          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Eyerusalem
                <span className="block text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Contortion Artist
                </span>
              </h1>
              <p className="text-gray-300 text-lg">
                International performer bringing extraordinary flexibility and artistic expression to stages worldwide.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl">
                  View Gallery
                </button>
                <button className="px-6 py-3 border border-purple-500 text-purple-400 rounded-xl">
                  Watch Videos
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-300">Performance Image</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-semibold">5.0 Rating</p>
              <p className="text-gray-400 text-sm">200+ Shows</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Available</p>
              <p className="text-gray-400 text-sm">Book Online</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center">
              <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Custom Shows</p>
              <p className="text-gray-400 text-sm">Tailored Acts</p>
            </div>
          </div>
        </div>
      );
    }

    if (screenshotType === 'gallery') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 bg-black/40 backdrop-blur-xl rounded-xl p-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              33EYE - Gallery
            </div>
            <Menu className="w-6 h-6 text-gray-400" />
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center group hover:scale-105 transition-transform cursor-pointer">
                <Image className="w-12 h-12 text-purple-400 group-hover:text-purple-300" />
              </div>
            ))}
          </div>

          {/* Gallery Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">Showing 9 of 50+ professional photos</p>
          </div>
        </div>
      );
    }

    if (screenshotType === 'booking') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Book a Performance</h2>
            <p className="text-gray-400">Select your event details below</p>
          </div>

          {/* Booking Form */}
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="space-y-6">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Event Type</label>
                <div className="bg-black/30 rounded-lg p-3 text-gray-400">
                  Select event type...
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Date</label>
                  <div className="bg-black/30 rounded-lg p-3 text-gray-400">
                    Select date...
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Time</label>
                  <div className="bg-black/30 rounded-lg p-3 text-gray-400">
                    Select time...
                  </div>
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Location</label>
                <div className="bg-black/30 rounded-lg p-3 text-gray-400">
                  Enter venue location...
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Default fallback
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500">Website Preview</p>
      </div>
    </div>
  );
};

export default WebsitePreview;