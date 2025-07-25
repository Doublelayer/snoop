export interface Job {
  id: string;
  name: string;
  isActive: boolean;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalListings: number;
  newListings: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  error?: boolean;
  notificationAdapters: NotificationAdapter[];
  providers: Provider[];
  blacklistTerms: string[];
  owner: boolean
}

export interface Provider {
  id: string;
  name: string;
  url: string;
  baseUrl: string;
}

export interface NotificationAdapter {
  id: string;
  name?: string;
  description?: string;
  readme?: string;
  fields?: Record<string, AdapterFieldConfig>;
}

export interface AdapterFieldConfig {
  name: string;
  value?: string;
  label?: string;
  description?: string;
  type?: 'text' | 'password' | 'number' | 'select' | 'textarea';
}


export interface Listing {
  id: string;
  title: string;
  price?: number;
  location?: {
    city?: string;
    street?: string;
    lat?: number;
    lng?: number;
  };
  size?: number;
  rooms?: number;
  description?: string;
  imageUrl?: string;
  address?: string;
  url: string;
  job: string | Job;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsApiResponse {
  listings: Listing[];
  totalPages: number;
  total: number;
}

export interface Settings {
  queryInterval: number;
  port: number;
  workingHoursFrom: string;
  workingHoursTo: string;
}
