import React from 'react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const cleaned = e.target.value.replace(/\D/g, '');
    // Limit to 10 digits
    if (cleaned.length <= 10) {
      onChange(cleaned);
    }
  };

  return (
    <div>
      <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
        เบอร์โทรศัพท์
      </label>
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <div className="flex-shrink-0">
          <select
            disabled={disabled}
            className="h-12 px-3 bg-rootbeer/50 border border-rackley rounded-[10px] text-white focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            defaultValue="+66"
          >
            <option value="+66">🇹🇭 +66</option>
          </select>
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          id="phone"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="0812345678"
          className={cn(
            "flex-1 h-12 px-4 bg-rootbeer/50 border rounded-[10px] text-white placeholder-rackley focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-destructive" : "border-rackley"
          )}
          aria-describedby={error ? 'phone-error' : undefined}
        />
      </div>
      {error && (
        <p id="phone-error" className="mt-1 text-tennessee text-sm">
          {error}
        </p>
      )}
    </div>
  );
};
