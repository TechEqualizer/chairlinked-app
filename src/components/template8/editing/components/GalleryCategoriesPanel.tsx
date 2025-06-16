
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Template8Category } from "../../hooks/useTemplate8Data";

interface GalleryCategoriesPanelProps {
  categories: Template8Category[];
  onUpdateCategories: (categories: Template8Category[]) => void;
  onAddCategory: (categoryName: string) => void;
  brandColor: string;
  onClose: () => void;
}

const GalleryCategoriesPanel: React.FC<GalleryCategoriesPanelProps> = ({
  categories,
  onUpdateCategories,
  onAddCategory,
  brandColor,
  onClose
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
      console.log('[GalleryCategoriesPanel] Adding new category:', trimmedName);
      onAddCategory(trimmedName);
      setNewCategoryName("");
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    console.log('[GalleryCategoriesPanel] Removing category:', categoryId);
    
    // Prevent removing the last category
    if (categories.length <= 1) {
      console.warn('[GalleryCategoriesPanel] Cannot remove the last category');
      alert('You must have at least one category. Please add another category before removing this one.');
      return;
    }

    try {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      onUpdateCategories(updatedCategories);
    } catch (error) {
      console.error('[GalleryCategoriesPanel] Error removing category:', error);
    }
  };

  const handleCategoryColorChange = (categoryId: string, newColor: string) => {
    console.log('[GalleryCategoriesPanel] Changing category color:', categoryId, newColor);
    
    try {
      const updatedCategories = categories.map(cat => 
        cat.id === categoryId ? { ...cat, color: newColor } : cat
      );
      onUpdateCategories(updatedCategories);
    } catch (error) {
      console.error('[GalleryCategoriesPanel] Error changing category color:', error);
    }
  };

  const predefinedColors = [
    "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", 
    "#3B82F6", "#F97316", "#84CC16", "#EC4899"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Gallery Categories</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Existing Categories */}
        <div className="space-y-3">
          <Label className="text-sm text-gray-600">Current Categories ({categories.length})</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Color picker */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {predefinedColors.slice(0, 4).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleCategoryColorChange(category.id, color)}
                        className={`w-3 h-3 rounded-full border transition-all ${
                          category.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Change to ${color}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleRemoveCategory(category.id)}
                    className="p-1 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                    title={categories.length <= 1 ? "Cannot remove the last category" : "Remove category"}
                    disabled={categories.length <= 1}
                    style={{ 
                      cursor: categories.length <= 1 ? 'not-allowed' : 'pointer',
                      opacity: categories.length <= 1 ? 0.5 : undefined
                    }}
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Category */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <Label className="text-sm text-gray-600">Add New Category</Label>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button 
              onClick={handleAddCategory}
              style={{ backgroundColor: brandColor }}
              className="text-white"
              disabled={!newCategoryName.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Categories help organize your gallery. Hover over existing categories to change colors or remove them.
          {categories.length <= 1 && (
            <div className="mt-2 text-amber-600">
              ⚠️ You must have at least one category.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCategoriesPanel;
