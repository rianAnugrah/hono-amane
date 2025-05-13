import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  email: string;
  isAuth: boolean;
  name: string;
  role: string;
  location: any;
};

type UserState = User & {
  set_user: (user: User) => void;
  clearUser: () => void;
};

// Initialize with values from localStorage or defaults
const getInitialState = (): User => ({
  email: "",
  isAuth: false,
  name: "",
  role: "",
  location: [],
});

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...getInitialState(),
      set_user: ({ email, name, isAuth, location, role }) =>
        set(() => ({ email, isAuth, name, location, role })),
      clearUser: () => set(() => getInitialState()),
    }),
    {
      name: "user-auth-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Only persist these fields
      partialize: (state) => ({
        email: state.email,
        isAuth: state.isAuth,
        name: state.name,
        role: state.role,
        location: state.location,
      }),
    }
  )
);
