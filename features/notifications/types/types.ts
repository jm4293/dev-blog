export interface Subscription {
  id: string;
  endpoint: string;
  device_os: string;
  browser: string;
  enabled: boolean;
  created_at: string;
}

export interface Preferences {
  new_post_enabled: boolean;
}

export interface PreferencesResponse {
  preferences: Preferences;
  subscriptions: Subscription[];
}
