export const centers = [
  {
    id: 'blr-hosp-1',
    name: 'Victoria Hospital',
    address: 'Kalasipalayam, Bengaluru, Karnataka 560002',
    lat: 12.9641,
    lng: 77.5750,
    queueSize: 42,
    hours: '09:00 AM - 05:00 PM',
    serviceType: 'Health, OPD, Consultation'
  },
  {
    id: 'blr-bbmp-1',
    name: 'BBMP Head Office',
    address: 'Hudson Circle, Bengaluru, Karnataka 560001',
    lat: 12.9678,
    lng: 77.5878,
    queueSize: 12,
    hours: '10:00 AM - 05:30 PM',
    serviceType: 'Property Tax, Trade License'
  },
  {
    id: 'blr-one-1',
    name: 'Cauvery Bhavan (Bangalore One)',
    address: 'KG Road, Bengaluru, Karnataka 560009',
    lat: 12.9745,
    lng: 77.5830,
    queueSize: 85,
    hours: '08:00 AM - 08:00 PM',
    serviceType: 'Utility Bills, Passports, Aadhaar'
  },
  {
    id: 'blr-sunk-1',
    name: 'Sunkadakatte Bangalore One',
    address: 'Magadi Main Rd, Sunkadakatte, Bengaluru, Karnataka 560091',
    lat: 12.9865,
    lng: 77.5090,
    queueSize: 28,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Aadhaar, Voter ID, Certificates'
  },
  {
    id: 'blr-kottige-1',
    name: 'Kottigepalya Bangalore One',
    address: 'Nagarbhavi Ring Road, Kottigepalya, Bengaluru, Karnataka 560091',
    lat: 12.9791,
    lng: 77.5137,
    queueSize: 15,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Aadhaar, Voter ID, Utility Bills'
  },
  {
    id: 'blr-rjn-1',
    name: 'Rajajinagar Mini Vidhana Soudha',
    address: '2nd Block, Rajajinagar, Bengaluru 560010',
    lat: 12.9900,
    lng: 77.5533,
    queueSize: 56,
    hours: '10:00 AM - 05:00 PM',
    serviceType: 'Caste/Income Certificates, Land Records'
  },
  {
    id: 'blr-ind-1',
    name: 'Indiranagar Bangalore One',
    address: 'Binnamangala, 1st Stage, Indiranagar, Bengaluru 560038',
    lat: 12.9784,
    lng: 77.6408,
    queueSize: 34,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Passports, Aadhaar, Bescom Bills'
  },
  {
    id: 'blr-jay-1',
    name: 'Jayanagar Bangalore One',
    address: '4th Block, Jayanagar, Bengaluru 560011',
    lat: 12.9299,
    lng: 77.5826,
    queueSize: 45,
    hours: '08:00 AM - 08:00 PM',
    serviceType: 'Utility Bills, Certificates'
  },
  {
    id: 'blr-kor-1',
    name: 'Koramangala Bangalore One',
    address: 'BDA Complex, 3rd Block, Koramangala, Bengaluru 560034',
    lat: 12.9279,
    lng: 77.6271,
    queueSize: 62,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Passports, Trade License, Aadhaar'
  },
  {
    id: 'blr-mall-1',
    name: 'Malleshwaram Bangalore One',
    address: '8th Cross, Malleshwaram, Bengaluru 560003',
    lat: 13.0031,
    lng: 77.5643,
    queueSize: 21,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Property Tax, Utility Bills'
  },
  {
    id: 'blr-white-1',
    name: 'Whitefield Bangalore One',
    address: 'Whitefield Main Road, Bengaluru 560066',
    lat: 12.9698,
    lng: 77.7499,
    queueSize: 92,
    hours: '08:00 AM - 08:00 PM',
    serviceType: 'Aadhaar, Utility Bills, Passports'
  },
  {
    id: 'blr-hsr-1',
    name: 'HSR Layout Bangalore One',
    address: 'Sector 2, HSR Layout, Bengaluru 560102',
    lat: 12.9081,
    lng: 77.6476,
    queueSize: 38,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Aadhaar, Certificates, Bescom'
  },
  {
    id: 'blr-tav-1',
    name: 'Tavarekere Bangalore One',
    address: 'Main Road, Tavarekere, Bengaluru 560029',
    lat: 12.9185,
    lng: 77.6033,
    queueSize: 18,
    hours: '08:00 AM - 08:00 PM',
    serviceType: 'Aadhaar, Utility Bills, Passports'
  },
  {
    id: 'blr-btm-1',
    name: 'BTM Layout Bangalore One',
    address: '2nd Stage, BTM Layout, Bengaluru 560076',
    lat: 12.9165,
    lng: 77.6101,
    queueSize: 25,
    hours: '08:00 AM - 07:00 PM',
    serviceType: 'Trade License, Aadhaar, Bescom'
  }
];

export const getQueueColor = (size) => {
  if (size < 20) return '#4CAF50'; // Green
  if (size < 50) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

// Simulation helper for "Real-time" feel
export const simulateLiveTraffic = (currentCenters) => {
  return currentCenters.map(c => ({
    ...c,
    queueSize: Math.max(0, c.queueSize + Math.floor(Math.random() * 5) - 2)
  }));
};
