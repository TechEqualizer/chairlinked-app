import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Settings, Trash2 } from "lucide-react";

interface StoriesSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const StoriesSectionEditor: React.FC<StoriesSectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'stories' | 'settings'>('stories');

  const handleStoryUpdate = (index: number, field: string, value: any) => {
    const updatedStories = [...(pageData.stories || [])];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    onUpdate({ stories: updatedStories });
  };

  const handleAddStory = () => {
    const newStory = {
      id: Date.now(),
      media: '',
      mediaType: 'image',
      caption: '',
      cta: '',
      ctaLink: ''
    };
    const updatedStories = [...(pageData.stories || []), newStory];
    onUpdate({ stories: updatedStories });
  };

  const handleRemoveStory = (index: number) => {
    const updatedStories = [...(pageData.stories || [])];
    updatedStories.splice(index, 1);
    onUpdate({ stories: updatedStories });
  };

  const tabs = [
    { id: 'stories', label: 'Stories', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings }
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
        {activeTab === 'stories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Instagram Stories ({pageData.stories?.length || 0})
              </h4>
              <button
                onClick={handleAddStory}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Story
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pageData.stories?.map((story: any, index: number) => (
                <div key={story.id || index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {story.media ? (
                        story.mediaType === 'video' ? (
                          <video
                            src={story.media}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={story.media}
                            alt="Story preview"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Play className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={story.mediaType || 'image'}
                          onChange={(e) => handleStoryUpdate(index, 'mediaType', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        
                        <button
                          onClick={() => handleRemoveStory(index)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <input
                        type="url"
                        value={story.media || ''}
                        onChange={(e) => handleStoryUpdate(index, 'media', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`${story.mediaType === 'video' ? 'Video' : 'Image'} URL`}
                      />
                      
                      <input
                        type="text"
                        value={story.caption || ''}
                        onChange={(e) => handleStoryUpdate(index, 'caption', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Story caption"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={story.cta || ''}
                          onChange={(e) => handleStoryUpdate(index, 'cta', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="CTA text"
                        />
                        
                        <input
                          type="url"
                          value={story.ctaLink || ''}
                          onChange={(e) => handleStoryUpdate(index, 'ctaLink', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="CTA link"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pageData.stories?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Play className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No stories yet. Add your first story!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={pageData.storiesTitle || 'Latest Stories'}
                onChange={(e) => onUpdate({ storiesTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={pageData.storiesSubtitle || 'Behind the scenes content'}
                onChange={(e) => onUpdate({ storiesSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section subtitle"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.enableStoriesAutoplay !== false}
                  onChange={(e) => onUpdate({ enableStoriesAutoplay: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Autoplay</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showStoriesProgress !== false}
                  onChange={(e) => onUpdate({ showStoriesProgress: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Progress Indicators</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.enableStoriesBooking !== false}
                  onChange={(e) => onUpdate({ enableStoriesBooking: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Booking from Stories</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stories Display Duration (seconds)
              </label>
              <input
                type="number"
                value={pageData.storiesDuration || 5}
                onChange={(e) => onUpdate({ storiesDuration: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="3"
                max="15"
              />
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
    </div>
  );
};

export default StoriesSectionEditor;