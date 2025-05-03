import { Tool } from "../lib/types";
import { create } from "zustand";

interface StoreProps{
    selectedTool: Tool,
    setSelectedTool: (tool:Tool)=> void | undefined
}

export const useSelectedTool = create<StoreProps>((set) => ({
    selectedTool: "rectangle",
    setSelectedTool: (tool: Tool) => {
      set({
        selectedTool: tool,
      });
    },
  }));