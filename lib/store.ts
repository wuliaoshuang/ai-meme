import { create } from 'zustand';

export interface Prompt {
  id: string;
  title: string;
  name: string;
  prompt: string;
  image: string;
  category: string;
  tags: string[];
}

type Store = {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  fetchPrompts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
};

export const useStore = create<Store>((set) => ({
  prompts: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',

  fetchPrompts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/prompts');
      if (!response.ok) throw new Error('Failed to fetch prompts');
      const { data } = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      set({ prompts: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category })
}));