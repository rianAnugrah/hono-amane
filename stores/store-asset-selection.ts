// stores/assetSelectionStore.ts
import { Asset } from "@/pages/(protected)/asset/types";
import { create } from "zustand";


interface AssetSelectionState {
  selectedAssets: Record<string, Asset>;
  selectAsset: (asset: Asset) => void;
  deselectAsset: (id: string) => void;
  clearSelection: () => void;
}

export const useAssetSelectionStore = create<AssetSelectionState>((set) => ({
  selectedAssets: {},
  selectAsset: (asset) =>
    set((state) => ({
      selectedAssets: { ...state.selectedAssets, [asset.id]: asset },
    })),
  deselectAsset: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.selectedAssets;
      return { selectedAssets: rest };
    }),
  clearSelection: () => set({ selectedAssets: {} }),
}));
