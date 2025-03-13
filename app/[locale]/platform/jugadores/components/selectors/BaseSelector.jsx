'use client';

export default function BaseSelector({ options, value, onChange, name, required = true }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {options.map((option) => (
        <label 
          key={option.value} 
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border-2 ${value === option.value ? 'border-primary' : 'border-transparent'}`}
        >
          <input 
            type="radio" 
            name={name} 
            value={option.value} 
            checked={value === option.value} 
            onChange={onChange}
            className="hidden" 
            required={required}
          />
          {/* El contenido del selector se inyectará desde los componentes hijos */}
          {option.content}
        </label>
      ))}
    </div>
  );
} 