import React, { useState } from "react";
import { motion } from "framer-motion";
import { Images, Grid, Tags, Upload, Trash2, Eye } from "lucide-react";

interface GallerySectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const GallerySectionEditor: React.FC<GallerySectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'images' | 'categories' | 'layout'>('images');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const handleImageUpdate = (index: number, field: string, value: any) => {
    const updatedImages = [...(pageData.images || [])];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    onUpdate({ images: updatedImages });
  };

  const handleAddImage = () => {
    const newImage = {
      id: Date.now(),
      image: '',
      likes: 0,
      dislikes: 0,
      bookings: 0,
      caption: '',
      user: pageData.businessName?.toLowerCase().replace(/\s/g, "_") || 'user',
      category: 'Uncategorized'
    };
    const updatedImages = [...(pageData.images || []), newImage];
    onUpdate({ images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(pageData.images || [])];
    updatedImages.splice(index, 1);
    onUpdate({ images: updatedImages });
  };

  const handleCategoryUpdate = (index: number, field: string, value: any) => {
    const updatedCategories = [...(pageData.availableCategories || [])];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    onUpdate({ availableCategories: updatedCategories });
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      color: '#8B5CF6',
      description: ''
    };
    const updatedCategories = [...(pageData.availableCategories || []), newCategory];
    onUpdate({ availableCategories: updatedCategories });
  };

  const tabs = [
    { id: 'images', label: 'Images', icon: Images },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'layout', label: 'Layout', icon: Grid }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all flex-1
                ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Gallery Images ({pageData.images?.length || 0})
              </h4>
              <button
                onClick={handleAddImage}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Add Image
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pageData.images?.map((image: any, index: number) => (
                <div key={image.id || index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {image.image ? (
                        <img
                          src={image.image}
                          alt="Gallery item"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Images className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={image.image || ''}
                        onChange={(e) => handleImageUpdate(index, 'image', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Image URL"
                      />
                      
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => handleImageUpdate(index, 'caption', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Caption"
                      />
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={image.category || ''}
                          onChange={(e) => handleImageUpdate(index, 'category', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Category</option>
                          {pageData.availableCategories?.map((cat: any) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                        
                        <button
                          onClick={() => setSelectedImage(image)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Likes</label>
                      <input
                        type="number"
                        value={image.likes || 0}
                        onChange={(e) => handleImageUpdate(index, 'likes', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dislikes</label>
                      <input
                        type="number"
                        value={image.dislikes || 0}
                        onChange={(e) => handleImageUpdate(index, 'dislikes', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Bookings</label>
                      <input
                        type="number"
                        value={image.bookings || 0}
                        onChange={(e) => handleImageUpdate(index, 'bookings', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Categories ({pageData.availableCategories?.length || 0})
              </h4>
              <button
                onClick={handleAddCategory}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
              >
                <Tags className="w-3 h-3" />
                Add Category
              </button>
            </div>

            <div className="space-y-3">
              {pageData.availableCategories?.map((category: any, index: number) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={category.color || '#8B5CF6'}
                      onChange={(e) => handleCategoryUpdate(index, 'color', e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    
                    <input
                      type="text"
                      value={category.name || ''}
                      onChange={(e) => handleCategoryUpdate(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Category name"
                    />
                    
                    <button
                      onClick={() => {
                        const updatedCategories = [...(pageData.availableCategories || [])];
                        updatedCategories.splice(index, 1);
                        onUpdate({ availableCategories: updatedCategories });
                      }}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={category.description || ''}
                    onChange={(e) => handleCategoryUpdate(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Category description (optional)"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'grid', label: 'Grid' },
                  { value: 'masonry', label: 'Masonry' },
                  { value: 'carousel', label: 'Carousel' },
                  { value: 'list', label: 'List' }
                ].map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => onUpdate({ galleryLayout: layout.value })}
                    className={`
                      px-3 py-2 rounded-lg border text-sm transition-colors
                      ${(pageData.galleryLayout || 'grid') === layout.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images Per Row
              </label>
              <select
                value={pageData.imagesPerRow || 3}
                onChange={(e) => onUpdate({ imagesPerRow: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={2}>2 Images</option>
                <option value={3}>3 Images</option>
                <option value={4}>4 Images</option>
                <option value={5}>5 Images</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showImageCaptions !== false}
                  onChange={(e) => onUpdate({ showImageCaptions: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Image Captions</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showEngagementMetrics !== false}
                  onChange={(e) => onUpdate({ showEngagementMetrics: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Engagement Metrics</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.enableCategoryFilter !== false}
                  onChange={(e) => onUpdate({ enableCategoryFilter: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Category Filter</span>
              </label>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Preview
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Image Preview</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <img
              src={selectedImage.image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            
            <p className="text-sm text-gray-600 mb-2">{selectedImage.caption}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>👍 {selectedImage.likes}</span>
              <span>👎 {selectedImage.dislikes}</span>
              <span>📅 {selectedImage.bookings} bookings</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySectionEditor;