
import { InstagramStory } from "../../types/storyTypes";

export const getDefaultStories = (): InstagramStory[] => [
  {
    id: 1,
    image: "", // No default image - user must add their own
    coverType: 'image',
    title: "Your Brand Story",
    ctaText: "Learn More",
    items: [] // Start with empty items array
  },
  {
    id: 2,
    image: "", // No default image - user must add their own
    coverType: 'image',
    title: "Our Services",
    ctaText: "Get Started",
    items: [] // Start with empty items array
  },
  {
    id: 3,
    image: "", // No default image - user must add their own
    coverType: 'image',
    title: "Client Success",
    ctaText: "See Results",
    items: [] // Start with empty items array
  }
];

export const getDefaultStory = (index: number): InstagramStory => {
  const stories = getDefaultStories();
  return stories[index % stories.length] || stories[0];
};
