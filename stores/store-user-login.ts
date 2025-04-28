import { create } from "zustand";

type User = {
  email: string;
  isAuth: boolean;
  name: string;
  role: string;
  location: string;
};

type UserState = User & {
  set_user: (user: User) => void;
};

export const useUserStore = create<UserState>((set) => ({
  email: "",
  isAuth: false,
  name: "",
  role: "",
  location: "",
  set_user: ({ email, name, isAuth, location, role }) =>
    set(() => ({ email, isAuth, name, location, role })),
}));
