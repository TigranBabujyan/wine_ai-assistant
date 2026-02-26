import { create } from 'zustand'
import { WinePartial, WineFull } from '@/types/wine.types'

interface WineState {
  searchResults: WinePartial[]
  searchQuery: string
  searchLoading: boolean
  searchError: string | null
  currentWine: WineFull | null

  setSearchResults: (results: WinePartial[], query: string) => void
  setSearchLoading: (loading: boolean) => void
  setSearchError: (error: string | null) => void
  setCurrentWine: (wine: WineFull | null) => void
  clearSearch: () => void
}

export const useWineStore = create<WineState>((set) => ({
  searchResults: [],
  searchQuery: '',
  searchLoading: false,
  searchError: null,
  currentWine: null,

  setSearchResults: (results, query) =>
    set({ searchResults: results, searchQuery: query, searchError: null }),
  setSearchLoading: (loading) => set({ searchLoading: loading }),
  setSearchError: (error) => set({ searchError: error, searchLoading: false }),
  setCurrentWine: (wine) => set({ currentWine: wine }),
  clearSearch: () =>
    set({ searchResults: [], searchQuery: '', searchLoading: false, searchError: null }),
}))
