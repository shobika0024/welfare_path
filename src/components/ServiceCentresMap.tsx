import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom orange icon for service centres
const orangeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom blue icon for user location
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ServiceCentre {
  id: number;
  name: string;
  nameTa?: string;
  lat: number;
  lng: number;
  address: string;
  addressTa?: string;
  phone: string;
  hours: string;
  hoursTa?: string;
  services: string[];
  servicesTa?: string[];
  distance?: string;
}

// Service centres across different regions of India
const allServiceCentres: ServiceCentre[] = [
  // Coimbatore Region
  {
    id: 1,
    name: "Taluk Office - Coimbatore",
    nameTa: "தாலுகா அலுவலகம் - கோயம்புத்தூர்",
    lat: 11.0168,
    lng: 76.9558,
    address: "123 Main Road, Coimbatore, Tamil Nadu 641001",
    addressTa: "123 மெயின் ரோடு, கோயம்புத்தூர் 641001",
    phone: "0422-2301234",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["PM Kisan", "Ration Card", "Pension"],
    servicesTa: ["பி.எம் கிசான்", "ரேஷன் கார்டு", "ஓய்வூதியம்"]
  },
  {
    id: 2,
    name: "e-Sevai Centre - RS Puram",
    nameTa: "இ-சேவை மையம் - ஆர்.எஸ். புரம்",
    lat: 11.0120,
    lng: 76.9500,
    address: "45 DB Road, RS Puram, Coimbatore 641002",
    addressTa: "45 டி.பி. ரோடு, ஆர்.எஸ். புரம் 641002",
    phone: "0422-2543567",
    hours: "Mon-Fri: 10:00 AM - 6:00 PM",
    hoursTa: "திங்கள்-வெள்ளி: 10:00 - 6:00",
    services: ["Ayushman Bharat", "Birth Certificate", "Income Certificate"],
    servicesTa: ["ஆயுஷ்மான் பாரத்", "பிறப்புச் சான்றிதழ்", "வருமானச் சான்றிதழ்"]
  },
  {
    id: 3,
    name: "CSC Centre - Gandhipuram",
    nameTa: "சி.எஸ்.சி மையம் - காந்திபுரம்",
    lat: 11.0250,
    lng: 76.9650,
    address: "78 Cross Cut Road, Gandhipuram, Coimbatore 641012",
    addressTa: "78 கிராஸ் கட் ரோடு, காந்திபுரம் 641012",
    phone: "0422-2456789",
    hours: "Mon-Sat: 9:30 AM - 6:00 PM",
    hoursTa: "திங்கள்-சனி: 9:30 - 6:00",
    services: ["National Scholarship", "PM Awas", "Voter ID"],
    servicesTa: ["தேசிய உதவித்தொகை", "பி.எம் ஆவாஸ்", "வாக்காளர் அடையாள அட்டை"]
  },
  // Chennai Region
  {
    id: 4,
    name: "Taluk Office - T.Nagar",
    nameTa: "தாலுகா அலுவலகம் - தி.நகர்",
    lat: 13.0418,
    lng: 80.2341,
    address: "45 Usman Road, T.Nagar, Chennai 600017",
    addressTa: "45 உஸ்மான் ரோடு, தி.நகர், சென்னை 600017",
    phone: "044-24341234",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["PM Kisan", "Ration Card", "Pension"],
    servicesTa: ["பி.எம் கிசான்", "ரேஷன் கார்டு", "ஓய்வூதியம்"]
  },
  {
    id: 5,
    name: "e-Sevai Centre - Anna Nagar",
    nameTa: "இ-சேவை மையம் - அண்ணா நகர்",
    lat: 13.0850,
    lng: 80.2101,
    address: "12 2nd Avenue, Anna Nagar, Chennai 600040",
    addressTa: "12 2வது அவென்யூ, அண்ணா நகர், சென்னை 600040",
    phone: "044-26201567",
    hours: "Mon-Fri: 10:00 AM - 6:00 PM",
    hoursTa: "திங்கள்-வெள்ளி: 10:00 - 6:00",
    services: ["Ayushman Bharat", "Birth Certificate", "Driving License"],
    servicesTa: ["ஆயுஷ்மான் பாரத்", "பிறப்புச் சான்றிதழ்", "ஓட்டுநர் உரிமம்"]
  },
  // Madurai Region
  {
    id: 7,
    name: "Taluk Office - Madurai Central",
    nameTa: "தாலுகா அலுவலகம் - மதுரை",
    lat: 9.9252,
    lng: 78.1198,
    address: "56 Town Hall Road, Madurai 625001",
    addressTa: "56 டவுன் ஹால் ரோடு, மதுரை 625001",
    phone: "0452-2341234",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["PM Kisan", "Ration Card", "Old Age Pension"],
    servicesTa: ["பி.எம் கிசான்", "ரேஷன் கார்டு", "முதியோர் ஓய்வூதியம்"]
  },
  // Bengaluru Region
  {
    id: 9,
    name: "Citizen Service Centre - Koramangala",
    nameTa: "குடிமக்கள் சேவை மையம் - கோரமங்களா",
    lat: 12.9352,
    lng: 77.6245,
    address: "100 Ft Road, Koramangala, Bengaluru 560034",
    addressTa: "100 அடி ரோடு, கோரமங்களா, பெங்களூரு 560034",
    phone: "080-25671234",
    hours: "Mon-Sat: 9:00 AM - 5:30 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:30",
    services: ["Aadhaar Update", "PAN Card", "Passport"],
    servicesTa: ["ஆதார் புதுப்பிப்பு", "பான் கார்டு", "கடவுச்சீட்டு"]
  },
  // Mumbai Region
  {
    id: 12,
    name: "Citizen Facilitation Centre - Andheri",
    nameTa: "குடிமக்கள் வசதி மையம் - அந்தேரி",
    lat: 19.1136,
    lng: 72.8697,
    address: "DN Nagar, Andheri West, Mumbai 400053",
    addressTa: "டிஎன் நகர், அந்தேரி மேற்கு, மும்பை 400053",
    phone: "022-26281234",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["Ration Card", "Domicile Certificate", "Birth Certificate"],
    servicesTa: ["ரேஷன் கார்டு", "இருப்பிடச் சான்றிதழ்", "பிறப்புச் சான்றிதழ்"]
  },
  // Delhi Region
  {
    id: 14,
    name: "e-District Centre - Connaught Place",
    nameTa: "இ-மாவட்ட மையம் - கன்னாட் பிளேஸ்",
    lat: 28.6315,
    lng: 77.2167,
    address: "Block A, CP, New Delhi 110001",
    addressTa: "பிளாக் A, சி.பி, புது டெல்லி 110001",
    phone: "011-23341234",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["Income Certificate", "Caste Certificate", "Domicile"],
    servicesTa: ["வருமானச் சான்றிதழ்", "சாதிச் சான்றிதழ்", "இருப்பிடம்"]
  },
  // Hyderabad Region
  {
    id: 16,
    name: "MeeSeva Centre - Banjara Hills",
    nameTa: "மீசேவா மையம் - பஞ்சாரா ஹில்ஸ்",
    lat: 17.4156,
    lng: 78.4347,
    address: "Road No. 12, Banjara Hills, Hyderabad 500034",
    addressTa: "ரோடு எண். 12, பஞ்சாரா ஹில்ஸ், ஹைதராபாத் 500034",
    phone: "040-23551234",
    hours: "Mon-Sat: 9:00 AM - 5:30 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:30",
    services: ["Birth Certificate", "Income Certificate", "Caste Certificate"],
    servicesTa: ["பிறப்புச் சான்றிதழ்", "வருமானச் சான்றிதழ்", "சாதிச் சான்றிதழ்"]
  },
  // Added more locations for better coverage
  {
    id: 20,
    name: "Citizen Service Centre - Pune",
    nameTa: "குடிமக்கள் சேவை மையம் - புனே",
    lat: 18.5204,
    lng: 73.8567,
    address: "Shivaji Nagar, Pune 411005",
    addressTa: "சிவாஜி நகர், புனே 411005",
    phone: "020-25501234",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 6:00",
    services: ["Ration Card", "Birth Certificate"],
    servicesTa: ["ரேஷன் கார்டு", "பிறப்புச் சான்றிதழ்"]
  },
  {
    id: 21,
    name: "e-Seva Centre - Ahmedabad",
    nameTa: "இ-சேவை மையம் - அகமதாபாத்",
    lat: 23.0225,
    lng: 72.5714,
    address: "Navrangpura, Ahmedabad 380009",
    addressTa: "நவரங்கபுரா, அகமதாபாத் 380009",
    phone: "079-26441234",
    hours: "Mon-Sat: 10:00 AM - 6:00 PM",
    hoursTa: "திங்கள்-சனி: 10:00 - 6:00",
    services: ["Scholarship", "PM Kisan"],
    servicesTa: ["உதவித்தொகை", "பி.எம் கிசான்"]
  },
  {
    id: 22,
    name: "CSC Centre - Jaipur",
    nameTa: "சி.எஸ்.சி மையம் - ஜெய்ப்பூர்",
    lat: 26.9124,
    lng: 75.7873,
    address: "C-Scheme, Jaipur 302001",
    addressTa: "சி-ஸ்கீம், ஜெய்ப்பூர் 302001",
    phone: "0141-2371234",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["Voter ID", "PAN Card"],
    servicesTa: ["வாக்காளர் அடையாள அட்டை", "பான் கார்டு"]
  },
  {
    id: 23,
    name: "Jan Seva Kendra - Lucknow",
    nameTa: "ஜன் சேவா கேந்திரா - லக்னோ",
    lat: 26.8467,
    lng: 80.9462,
    address: "Hazratganj, Lucknow 226001",
    addressTa: "ஹஸ்ரத்கஞ்ச், லக்னோ 226001",
    phone: "0522-2231234",
    hours: "Mon-Sat: 10:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 10:00 - 5:00",
    services: ["Caste Certificate", "Income Certificate"],
    servicesTa: ["சாதிச் சான்றிதழ்", "வருமானச் சான்றிதழ்"]
  },
  {
    id: 101,
    name: "e-Sevai Centre - Krishnan Kovil",
    nameTa: "இ-சேவை மையம் - கிருஷ்ணன் கோவில்",
    lat: 9.5441,
    lng: 77.6715,
    address: "Near Srivilliputhur Main Road, Krishnankoil 626125",
    addressTa: "ஸ்ரீவில்லிபுத்தூர் மெயின் ரோடு, கிருஷ்ணன் கோவில் 626125",
    phone: "04563-289123",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    hoursTa: "திங்கள்-சனி: 9:00 - 5:00",
    services: ["Community Certificate", "Income Certificate"],
    servicesTa: ["சாதிச் சான்றிதழ்", "வருமானச் சான்றிதழ்"]
  },
  {
    id: 102,
    name: "Taluk Office - Srivilliputhur",
    nameTa: "தாலுகா அலுவலகம் - ஸ்ரீவில்லிபுத்தூர்",
    lat: 9.5085,
    lng: 77.6339,
    address: "Katchery Road, Srivilliputhur 626125",
    addressTa: "கச்சேரி ரோடு, ஸ்ரீவில்லிபுத்தூர் 626125",
    phone: "04563-260123",
    hours: "Mon-Sat: 10:00 AM - 5:30 PM",
    hoursTa: "திங்கள்-சனி: 10:00 - 5:30",
    services: ["Patta Chitta", "Ration Card"],
    servicesTa: ["பட்டா சிட்டா", "ரேஷன் கார்டு"]
  },
  {
    id: 103,
    name: "CSC Centre - Rajapalayam",
    nameTa: "சி.எஸ்.சி மையம் - ராஜபாளையம்",
    lat: 9.4470,
    lng: 77.5510,
    address: "Tenkasi Road, Rajapalayam 626117",
    addressTa: "தென்காசி ரோடு, ராஜபாளையம் 626117",
    phone: "04563-222123",
    hours: "Mon-Sat: 9:30 AM - 6:00 PM",
    hoursTa: "திங்கள்-சனி: 9:30 - 6:00",
    services: ["Voter ID", "Aadhaar Update", "Pension"],
    servicesTa: ["வாக்காளர் அடையாள அட்டை", "ஆதார் புதுப்பிப்பு", "ஓய்வூதியம்"]
  }
];

// Default map view location
const defaultCenter: [number, number] = [9.5441, 77.6715]; // Changed default to Krishnan Kovil for demonstration

// Component to handle map center updates
const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center[0], center[1], map]);
  return null;
};

// Component to handle map move events
const MapMoveHandler = ({ onMoveEnd }: { onMoveEnd: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng);
    },
  });
  return null;
};

// Calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const ServiceCentresMap = () => {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === "ta";
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [centres, setCentres] = useState<ServiceCentre[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to update centres based on location
  const updateCentresForLocation = (latitude: number, longitude: number) => {
    const centresWithDistance = allServiceCentres.map((centre) => ({
      ...centre,
      distance: calculateDistance(latitude, longitude, centre.lat, centre.lng).toFixed(1) + " km",
    }));
    // Sort by distance and show nearest ones
    centresWithDistance.sort((a, b) => parseFloat(a.distance!) - parseFloat(b.distance!));
    setCentres(centresWithDistance);
  };

  useEffect(() => {
    // Initialize with default location
    updateCentresForLocation(defaultCenter[0], defaultCenter[1]);

    if ("geolocation" in navigator) {
      // Watch for location changes continuously
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationError(null);
          // Update centres based on new location
          updateCentresForLocation(latitude, longitude);
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          setLocationError(t("schemes.locationError") || "Location access denied. Showing nearest centres to default area.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );

      // Cleanup watcher on unmount
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [t]);

  const openDirections = (lat: number, lng: number, centreName: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let url: string;
    if (isMobile) {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(centreName)})`;
    } else {
      if (userLocation) {
        url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation[0]},${userLocation[1]};${lat},${lng}`;
      } else {
        url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${lat},${lng}#map=15/${lat}/${lng}`;
      }
    }

    if (url.startsWith('geo:')) {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const mapCenter = userLocation || defaultCenter;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            {t("serviceCentres.title")}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation([latitude, longitude]);
                updateCentresForLocation(latitude, longitude);
              });
            }
          }}
          className="text-xs"
        >
          <Navigation className="w-3 h-3 mr-1" />
          {t("serviceCentres.yourLocation")}
        </Button>
      </div>

      {locationError && (
        <p className="text-sm text-muted-foreground mb-4">{locationError}</p>
      )}

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border h-[300px] relative z-0 [&_.leaflet-top]:!z-[10] [&_.leaflet-pane]:!z-[5]">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterUpdater center={mapCenter} />
          <MapMoveHandler onMoveEnd={updateCentresForLocation} />

          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation} icon={blueIcon}>
              <Popup>{t("serviceCentres.yourLocation")}</Popup>
            </Marker>
          )}

          {/* Service centre markers */}
          {centres.slice(0, 4).map((centre) => {
            const name = isTamil && centre.nameTa ? centre.nameTa : centre.name;
            const address = isTamil && centre.addressTa ? centre.addressTa : centre.address;

            return (
              <Marker
                key={centre.id}
                position={[centre.lat, centre.lng]}
                icon={orangeIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{name}</strong>
                    <br />
                    {address}
                    <br />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openDirections(centre.lat, centre.lng, name);
                      }}
                      className="text-primary hover:underline"
                    >
                      {t("serviceCentres.getDirections")}
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">{t("serviceCentres.yourLocation")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">{t("serviceCentres.serviceCentre")}</span>
        </div>
      </div>

      {/* Service Centre Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {centres.slice(0, 4).map((centre) => {
          const name = isTamil && centre.nameTa ? centre.nameTa : centre.name;
          const address = isTamil && centre.addressTa ? centre.addressTa : centre.address;
          const hours = isTamil && centre.hoursTa ? centre.hoursTa : centre.hours;

          return (
            <div
              key={centre.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground">{name}</h3>
                {centre.distance && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {centre.distance}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {centre.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {hours}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(isTamil && centre.servicesTa ? centre.servicesTa : centre.services).map((service, index) => (
                  <Badge key={index} className="bg-accent text-accent-foreground text-xs">
                    {service}
                  </Badge>
                ))}
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => openDirections(centre.lat, centre.lng, name)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t("serviceCentres.getDirections")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCentresMap;
