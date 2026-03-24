export const shopInfo = {
  name: "Midas Sunnyvale",
  phone: "(408) 498-7075",
  address: "725 E El Camino Real",
  city: "Sunnyvale",
  state: "CA",
  zip: "94087",
  smsSenderName: "MidasSunnyvale",
  hours: {
    monday: "7:30 AM – 6:00 PM",
    tuesday: "7:30 AM – 6:00 PM",
    wednesday: "7:30 AM – 6:00 PM",
    thursday: "7:30 AM – 6:00 PM",
    friday: "7:30 AM – 6:00 PM",
    saturday: "7:30 AM – 5:00 PM",
    sunday: "Closed",
  },
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: { year: number; make: string; model: string };
  lastServiceDate: string;
  lastServiceType: string;
  nextServiceDue: string;
  mileage: number;
};

export type Reminder = {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  dueDate: string;
  status: "pending" | "sent" | "opened";
  sentAt?: string;
  phone: string;
};

export type Promotion = {
  id: string;
  title: string;
  discount: string;
  expirationDate: string;
  message: string;
  sentCount: number;
  createdAt: string;
  status: "active" | "expired";
};

export const customers: Customer[] = [
  {
    id: "c1",
    name: "James Nguyen",
    phone: "(408) 555-0182",
    email: "jnguyen@gmail.com",
    vehicle: { year: 2019, make: "Toyota", model: "Camry" },
    lastServiceDate: "2026-01-14",
    lastServiceType: "Oil Change",
    nextServiceDue: "2026-04-14",
    mileage: 47200,
  },
  {
    id: "c2",
    name: "Maria Gonzalez",
    phone: "(408) 555-0247",
    email: "mariag@yahoo.com",
    vehicle: { year: 2021, make: "Honda", model: "CR-V" },
    lastServiceDate: "2026-02-03",
    lastServiceType: "Brake Inspection",
    nextServiceDue: "2026-08-03",
    mileage: 28900,
  },
  {
    id: "c3",
    name: "David Kim",
    phone: "(408) 555-0391",
    email: "dkim@outlook.com",
    vehicle: { year: 2017, make: "Ford", model: "F-150" },
    lastServiceDate: "2026-01-28",
    lastServiceType: "Tire Rotation",
    nextServiceDue: "2026-04-28",
    mileage: 83400,
  },
  {
    id: "c4",
    name: "Sarah Patel",
    phone: "(408) 555-0514",
    email: "sarah.patel@gmail.com",
    vehicle: { year: 2022, make: "Tesla", model: "Model 3" },
    lastServiceDate: "2026-02-20",
    lastServiceType: "Tire Rotation",
    nextServiceDue: "2026-05-20",
    mileage: 15600,
  },
  {
    id: "c5",
    name: "Robert Chen",
    phone: "(408) 555-0673",
    email: "rchen@gmail.com",
    vehicle: { year: 2018, make: "BMW", model: "X5" },
    lastServiceDate: "2025-12-10",
    lastServiceType: "Full Synthetic Oil Change",
    nextServiceDue: "2026-03-10",
    mileage: 62100,
  },
  {
    id: "c6",
    name: "Linda Torres",
    phone: "(408) 555-0728",
    email: "ltorres@icloud.com",
    vehicle: { year: 2020, make: "Chevrolet", model: "Equinox" },
    lastServiceDate: "2026-01-05",
    lastServiceType: "Air Filter Replacement",
    nextServiceDue: "2026-07-05",
    mileage: 39800,
  },
  {
    id: "c7",
    name: "Michael Washington",
    phone: "(408) 555-0834",
    email: "mwash@gmail.com",
    vehicle: { year: 2016, make: "Nissan", model: "Altima" },
    lastServiceDate: "2026-02-14",
    lastServiceType: "Oil Change + Filter",
    nextServiceDue: "2026-05-14",
    mileage: 91200,
  },
  {
    id: "c8",
    name: "Amy Tanaka",
    phone: "(408) 555-0965",
    email: "atanaka@yahoo.com",
    vehicle: { year: 2023, make: "Subaru", model: "Outback" },
    lastServiceDate: "2026-03-01",
    lastServiceType: "Multi-Point Inspection",
    nextServiceDue: "2026-09-01",
    mileage: 8400,
  },
  {
    id: "c9",
    name: "Carlos Rivera",
    phone: "(408) 555-0143",
    email: "crivera@gmail.com",
    vehicle: { year: 2015, make: "Jeep", model: "Wrangler" },
    lastServiceDate: "2025-11-22",
    lastServiceType: "Brake Pads & Rotors",
    nextServiceDue: "2026-05-22",
    mileage: 105600,
  },
  {
    id: "c10",
    name: "Jennifer Wu",
    phone: "(408) 555-0276",
    email: "jwu@gmail.com",
    vehicle: { year: 2020, make: "Hyundai", model: "Tucson" },
    lastServiceDate: "2026-02-28",
    lastServiceType: "Oil Change",
    nextServiceDue: "2026-05-28",
    mileage: 33100,
  },
];

export const reminders: Reminder[] = [
  {
    id: "r1",
    customerId: "c5",
    customerName: "Robert Chen",
    serviceType: "Full Synthetic Oil Change",
    dueDate: "2026-03-10",
    status: "sent",
    sentAt: "2026-03-03",
    phone: "(408) 555-0673",
  },
  {
    id: "r2",
    customerId: "c1",
    customerName: "James Nguyen",
    serviceType: "Oil Change",
    dueDate: "2026-04-14",
    status: "pending",
    phone: "(408) 555-0182",
  },
  {
    id: "r3",
    customerId: "c3",
    customerName: "David Kim",
    serviceType: "Tire Rotation",
    dueDate: "2026-04-28",
    status: "pending",
    phone: "(408) 555-0391",
  },
  {
    id: "r4",
    customerId: "c7",
    customerName: "Michael Washington",
    serviceType: "Oil Change + Filter",
    dueDate: "2026-05-14",
    status: "opened",
    sentAt: "2026-03-10",
    phone: "(408) 555-0834",
  },
  {
    id: "r5",
    customerId: "c4",
    customerName: "Sarah Patel",
    serviceType: "Tire Rotation",
    dueDate: "2026-05-20",
    status: "pending",
    phone: "(408) 555-0514",
  },
  {
    id: "r6",
    customerId: "c10",
    customerName: "Jennifer Wu",
    serviceType: "Oil Change",
    dueDate: "2026-05-28",
    status: "pending",
    phone: "(408) 555-0276",
  },
  {
    id: "r7",
    customerId: "c9",
    customerName: "Carlos Rivera",
    serviceType: "Brake Inspection",
    dueDate: "2026-05-22",
    status: "sent",
    sentAt: "2026-03-15",
    phone: "(408) 555-0143",
  },
  {
    id: "r8",
    customerId: "c2",
    customerName: "Maria Gonzalez",
    serviceType: "Brake Inspection Follow-up",
    dueDate: "2026-08-03",
    status: "pending",
    phone: "(408) 555-0247",
  },
];

export const promotions: Promotion[] = [
  {
    id: "p1",
    title: "Spring Oil Change Special",
    discount: "$10 off",
    expirationDate: "2026-04-30",
    message:
      "Spring into savings! Get $10 off your next oil change at Midas Sunnyvale. Show this text at checkout. Exp. 4/30/26.",
    sentCount: 87,
    createdAt: "2026-03-01",
    status: "active",
  },
  {
    id: "p2",
    title: "Free Tire Rotation with Oil Change",
    discount: "Free tire rotation",
    expirationDate: "2026-03-31",
    message:
      "Get a FREE tire rotation with any oil change this month at Midas Sunnyvale! Call (408) 498-7075. Exp. 3/31/26.",
    sentCount: 143,
    createdAt: "2026-03-01",
    status: "active",
  },
  {
    id: "p3",
    title: "Brake Inspection Special",
    discount: "Free inspection",
    expirationDate: "2026-02-28",
    message:
      "FREE brake inspection at Midas Sunnyvale. Don't wait — your safety matters. Book now at (408) 498-7075. Exp. 2/28/26.",
    sentCount: 201,
    createdAt: "2026-02-01",
    status: "expired",
  },
  {
    id: "p4",
    title: "New Year Tune-Up Deal",
    discount: "15% off",
    expirationDate: "2026-01-31",
    message:
      "Start 2026 right! 15% off a full tune-up at Midas Sunnyvale. Mention this text to redeem. Exp. 1/31/26.",
    sentCount: 118,
    createdAt: "2026-01-02",
    status: "expired",
  },
];

export const activityFeed = [
  {
    id: "a1",
    type: "reminder_sent",
    message: "Reminder sent to Carlos Rivera (Brake Inspection)",
    time: "2 hours ago",
    icon: "send",
  },
  {
    id: "a2",
    type: "reminder_opened",
    message: "Michael Washington opened oil change reminder",
    time: "5 hours ago",
    icon: "eye",
  },
  {
    id: "a3",
    type: "promo_sent",
    message: "Spring Oil Change Special sent to 87 customers",
    time: "Yesterday",
    icon: "tag",
  },
  {
    id: "a4",
    type: "customer_added",
    message: "New customer Amy Tanaka added",
    time: "2 days ago",
    icon: "user-plus",
  },
  {
    id: "a5",
    type: "reminder_sent",
    message: "Reminder sent to Robert Chen (Oil Change due)",
    time: "3 days ago",
    icon: "send",
  },
  {
    id: "a6",
    type: "promo_sent",
    message: "Free Tire Rotation promo sent to 143 customers",
    time: "3 weeks ago",
    icon: "tag",
  },
];
