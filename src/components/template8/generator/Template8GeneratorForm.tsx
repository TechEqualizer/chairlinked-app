
import React from 'react';
import EnhancedGeneratorForm from './components/EnhancedGeneratorForm';

interface Template8GeneratorFormProps {
  onGenerate: (data: any) => void;
  isGenerating?: boolean;
}

const Template8GeneratorForm: React.FC<Template8GeneratorFormProps> = (props) => {
  return <EnhancedGeneratorForm {...props} />;
};

export default Template8GeneratorForm;
