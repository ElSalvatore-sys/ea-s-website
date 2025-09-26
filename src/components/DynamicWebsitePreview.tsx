import React from 'react';

interface DynamicWebsitePreviewProps {
  title: string;
  url: string;
  primaryColor: string;
  type?: 'hotel' | 'dental' | 'music' | 'artist';
}

const DynamicWebsitePreview: React.FC<DynamicWebsitePreviewProps> = ({
  title,
  url,
  primaryColor,
  type = 'hotel'
}) => {
  const renderContent = () => {
    switch(type) {
      case 'hotel':
        return (
          <div className="p-8">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-white">{title}</div>
                <div className="flex gap-4 text-sm text-gray-300">
                  <span>Zimmer</span>
                  <span>Restaurant</span>
                  <span>Wellness</span>
                  <span>Kontakt</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className={`bg-gradient-to-br ${primaryColor} rounded-xl p-12 mb-6`}>
              <h1 className="text-4xl font-bold text-white mb-4">Willkommen im {title}</h1>
              <p className="text-white/80 mb-6">Ihr Luxushotel im Herzen von Wiesbaden</p>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">
                Jetzt buchen
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {['24/7 Service', 'Spa & Wellness', 'Fine Dining'].map((feature) => (
                <div key={feature} className="bg-white/5 backdrop-blur rounded-lg p-4">
                  <div className="text-white font-semibold">{feature}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dental':
        return (
          <div className="p-8">
            {/* Header */}
            <div className="bg-teal-600/20 backdrop-blur rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-teal-300">{title}</div>
                <div className="flex gap-4 text-sm text-gray-300">
                  <span>3D-Druck</span>
                  <span>Labor</span>
                  <span>Technologie</span>
                  <span>Kontakt</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-12 mb-6">
              <h1 className="text-4xl font-bold text-white mb-4">3D Dental Innovation</h1>
              <p className="text-white/80 mb-6">Modernste Zahnmedizin mit 3D-Technologie</p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <span className="text-white font-bold">20 Min</span>
                  <span className="text-white/80 text-sm ml-2">Prozesszeit</span>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <span className="text-white font-bold">89%</span>
                  <span className="text-white/80 text-sm ml-2">Schneller</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {['500+ Kronen/Monat', '3D Scanner', 'Same-Day Service'].map((stat) => (
                <div key={stat} className="bg-teal-500/10 backdrop-blur rounded-lg p-4">
                  <div className="text-teal-300 font-semibold text-center">{stat}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="p-8">
            {/* Header */}
            <div className="bg-amber-600/20 backdrop-blur rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-amber-300">{title}</div>
                <div className="flex gap-4 text-sm text-gray-300">
                  <span>Kurse</span>
                  <span>Lehrer</span>
                  <span>Termine</span>
                  <span>Kontakt</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-12 mb-6">
              <h1 className="text-4xl font-bold text-white mb-4">Musik erleben & lernen</h1>
              <p className="text-white/80 mb-6">Professioneller Klavierunterricht für alle Altersgruppen</p>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">
                Probestunde buchen
              </button>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-3 gap-4">
              {['Klassik', 'Jazz', 'Pop & Rock'].map((course) => (
                <div key={course} className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur rounded-lg p-6">
                  <div className="text-amber-300 font-bold mb-2">{course}</div>
                  <div className="text-gray-400 text-sm">Ab 39€/Stunde</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'artist':
        return (
          <div className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {title}
                </div>
                <div className="flex gap-4 text-sm text-gray-300">
                  <span>Portfolio</span>
                  <span>Shows</span>
                  <span>About</span>
                  <span>Booking</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-12 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <h1 className="text-5xl font-bold text-white mb-4">Eyerusalem</h1>
                <p className="text-white/90 text-xl mb-2">International Contortion Artist</p>
                <p className="text-white/70 mb-6">Performance Art that Defies Gravity</p>
                <div className="flex gap-4">
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">
                    Book Performance
                  </button>
                  <button className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold border border-white/30">
                    Watch Showreel
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Preview */}
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-lg">
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    Gallery {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black">
      {renderContent()}
    </div>
  );
};

export default DynamicWebsitePreview;