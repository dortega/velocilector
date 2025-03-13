'use client';
import BaseSelector from './BaseSelector';

export default function EyeColorSelector({ options, value, onChange, name }) {
  // Transformar las opciones para incluir el contenido personalizado
  const optionsWithContent = options.map(option => ({
    ...option,
    content: (
      <div className="flex flex-col items-center">
        <div className="relative mb-1">
          <div 
            className="w-10 h-10 rounded-full" 
            style={{ backgroundColor: option.color }}
          ></div>
          {/* Pupila (círculo negro en el centro) */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black"
          ></div>
        </div>
        <span className="text-sm">{option.label}</span>
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