
import React from "react";
import MemoizedHeroMainHeadline from "./MemoizedHeroMainHeadline";

interface HeroMainHeadlineProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  variants?: any;
  isPreviewMode?: boolean;
}

const HeroMainHeadline: React.FC<HeroMainHeadlineProps> = (props) => {
  return <MemoizedHeroMainHeadline {...props} />;
};

export default HeroMainHeadline;
