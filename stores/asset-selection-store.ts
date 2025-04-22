// src/stores/assetSelectionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AssetSelectionState {
  selectedAssets: Set<string>;
  addAsset: (id: string) => void;
  removeAsset: (id: string) => void;
  toggleAsset: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
}

// Custom Set serialization for persist middleware
const serializeSet = (set: Set<string>) => Array.from(set);
const deserializeSet = (array: string[]) => new Set(array);

// Create the store with persistence
export const useAssetSelectionStore = create<AssetSelectionState>()(
  persist(
    (set, get) => ({
      selectedAssets: new Set<string>(),
      
      addAsset: (id: string) => 
        set(state => ({ 
          selectedAssets: new Set([...Array.from(state.selectedAssets), id]) 
        })),
        
      removeAsset: (id: string) => 
        set(state => {
          const newSet = new Set(state.selectedAssets);
          newSet.delete(id);
          return { selectedAssets: newSet };
        }),
        
      toggleAsset: (id: string) => 
        set(state => {
          const newSet = new Set(state.selectedAssets);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedAssets: newSet };
        }),
        
      selectAll: (ids: string[]) => 
        set(state => ({ 
          selectedAssets: new Set([...Array.from(state.selectedAssets), ...ids]) 
        })),
        
      deselectAll: () => set({ selectedAssets: new Set() }),
      
      isSelected: (id: string) => get().selectedAssets.has(id),
      
      getSelectedCount: () => get().selectedAssets.size,
    }),
    {
      name: 'asset-selection-storage',
      // Custom serialization/deserialization of Set
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            selectedAssets: serializeSet(state.state.selectedAssets),
          },
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            selectedAssets: deserializeSet(parsed.state.selectedAssets),
          },
        };
      },
    }
  )
);