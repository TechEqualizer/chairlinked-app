
import { useState } from "react";
import { HistoryEntry } from "./types/editingFlowTypes";

export const useHistoryManager = (
  currentSectionIndex: number,
  sectionData: any,
  setSectionData: (data: any) => void,
  regenerationHistory: HistoryEntry[]
) => {
  const canUndo = regenerationHistory.some(entry => 
    entry.sectionIndex === currentSectionIndex && entry.action === 'regenerate_start'
  );

  const getLastEntryForUndo = () => {
    return regenerationHistory
      .filter(entry => entry.sectionIndex === currentSectionIndex)
      .filter(entry => entry.action === 'regenerate_start')
      .pop();
  };

  const handleUndo = () => {
    const lastEntry = getLastEntryForUndo();
    if (lastEntry && lastEntry.data) {
      console.log('↩️ Undoing last regeneration...');
      setSectionData(lastEntry.data);
    }
  };

  return {
    canUndo,
    getLastEntryForUndo,
    handleUndo
  };
};
