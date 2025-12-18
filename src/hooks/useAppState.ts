import { create } from 'zustand'
import type { SidebarItemInterface } from '~/types'

interface AppState {
  height: number
  width: number
  search: string
  currentBasicSidebarItem: SidebarItemInterface
  makeOrUse: 'make' | 'use' | ''
  exportVersion: string
  imageWidth: number
  setSearch: (search: string) => void
  setCurrentItem: (item: SidebarItemInterface, mode: 'make' | 'use') => void
  setWindowSize: (width: number, height: number) => void
}

export const useAppState = create<AppState>((set) => ({
  height: typeof window !== 'undefined' ? window.innerHeight : 800,
  width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  search: '',
  currentBasicSidebarItem: {},
  makeOrUse: '',
  exportVersion: '2.2.8',
  imageWidth: 38,
  setSearch: (search) => set({ search }),
  setCurrentItem: (item, mode) =>
    set({ currentBasicSidebarItem: item, makeOrUse: mode }),
  setWindowSize: (width, height) => set({ width, height }),
}))
