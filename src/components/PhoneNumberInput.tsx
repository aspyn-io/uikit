import React, { useState } from 'react';
import { TextInput } from 'flowbite-react';
import { HiPhone } from 'react-icons/hi';

interface Country {
  code: string;
  label: string;
  flag: string;
}

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  countries: Country[];
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter phone number',
  className,
  countries,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countries[0].code);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
    setIsValid(/^\d{10,15}$/.test(formattedValue)); // Basic validation for phone numbers with 10-15 digits
    onChange(`${selectedCountryCode}${formattedValue}`);
  };

  const handleCountryCodeChange = (code: string) => {
    setSelectedCountryCode(code);
    onChange(`${code}${value.replace(selectedCountryCode, '')}`);
    setDropdownOpen(false);
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="relative">
          <button
            id="dropdown-phone-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="shrink-0 z-10 inline-flex items-center px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 h-10 whitespace-nowrap"
            type="button"
          >
            {countries.find((country) => country.code === selectedCountryCode)?.flag} {selectedCountryCode} <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
          </button>
          {dropdownOpen && (
            <div id="dropdown-phone" className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-64 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-phone-button">
                {countries.map((country) => (
                  <li key={country.code}>
                    <button
                      type="button"
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => handleCountryCodeChange(country.code)}
                    >
                      <div className="inline-flex items-center">
                        {country.flag} {country.label} ({country.code})
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <TextInput
          icon={HiPhone}
          type="tel"
          placeholder={placeholder}
          value={value.replace(selectedCountryCode, '')}
          onChange={handleChange}
          color={isValid ? 'success' : 'failure'}
          helperText={!isValid && 'Invalid phone number'}
          className="px-2 w-full h-10"
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;
