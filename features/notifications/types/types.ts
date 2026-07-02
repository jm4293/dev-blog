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
  /** 관심 태그 (빈 배열 = 전체 글 알림) */
  subscribed_tags: string[];
  /** 관심 회사 id (빈 배열 = 전체 글 알림) */
  subscribed_company_ids: string[];
}

export interface PreferencesResponse {
  preferences: Preferences;
  subscriptions: Subscription[];
}

export interface UpdatePreferencesInput {
  new_post_enabled?: boolean;
  subscribed_tags?: string[];
  subscribed_company_ids?: string[];
}
