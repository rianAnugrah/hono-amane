import { create } from "zustand"

type User = {
  email: string
  isAuth: boolean
  name: string
}

type UserState = User & {
  set_user: (user: User) => void
}

export const useUserStore = create<UserState>((set) => ({
  email: "",
  isAuth: false,
  name: "",
  set_user: ({ email, name, isAuth }) =>
    set(() => ({ email, isAuth, name })),
}))
