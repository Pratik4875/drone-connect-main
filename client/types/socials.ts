export type SocialInput = {
  platform: string;
  account: string; // The profile ID extracted from the URL
};

export type SocialResponse = {
  success: boolean;
  message: string;
};