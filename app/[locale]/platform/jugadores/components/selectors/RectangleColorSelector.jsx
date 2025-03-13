'use client';
import BaseSelector from './BaseSelector';

export default function RectangleColorSelector({ options, value, onChange, name }) {
  // Transformar las opciones para incluir el contenido personalizado
  const optionsWithContent = options.map(option => ({
    ...option,
    content: (
      <div className="flex flex-col items-center w-full">
        <div 
          className="w-full h-12 rounded-md mb-2" 
          style={{ backgroundColor: option.color }}
        ></div>
        <span className="text-sm text-center w-full">{option.label}</span>
      </div>
    )
  }));

  return (
    <BaseSelector 
      options={optionsWithContent} 
      value={value} 
      onChange={onChange} 
      name={name} 
    />
  );
} 