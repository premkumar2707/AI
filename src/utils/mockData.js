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
    id: 'blr-rjn-1',
    name: 'Rajajinagar Mini Vidhana Soudha',
    address: '2nd Block, Rajajinagar, Bengaluru 560010',
    lat: 12.9900,
    lng: 77.5533,
    queueSize: 56,
    hours: '10:00 AM - 05:00 PM',
    serviceType: 'Caste/Income Certificates, Land Records'
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
