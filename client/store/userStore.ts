import { create } from "zustand";
export interface User {
  name?: string;
  district?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  user_type?: string;
  profile?: null | string;
  _id?: string;
  company_id?: string;
  pilot_id?: string;
}

interface UserStore {
  loading: boolean;
  isAuthenticated: boolean;
  user: User;
  setLoading: (status: boolean) => void;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const userStore = create<UserStore>((set) => ({
  // Initial state
  loading: false,
  isAuthenticated: false,
  user: {},

  // Actions
  setLoading: (status) => set(() => ({ loading: status })),
  login: (userData) =>
    set(() => ({
      isAuthenticated: true,
      user: userData,
      loading: false,
    })),
  logout: () =>
    set(() => ({
      isAuthenticated: false,
      user: {},
    })),
  updateUser: (updatedData) =>
    set((state) => ({
      user: { ...state.user, ...updatedData },
    })),
}));

export default userStore;
