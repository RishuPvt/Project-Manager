import { create } from "zustand";

interface User {
  id: number;
  name: string;
  role: string;
}

interface Org {
  id: number;
  name: string;
  role: string;
}

interface UserStore {
  user: User | null;
  org: Org | null;
  isAuth: boolean;
  setUser: (userData: User) => void;
  setOrg: (orgData: Org) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  org: null,
  isAuth: false,
  setUser: (userData) =>
    set({ user: userData, org: null, isAuth: true }), 
  setOrg: (orgData) =>
    set({ org: orgData, user: null, isAuth: true }), 
  logout: () => set({ user: null, org: null, isAuth: false }),
}));
