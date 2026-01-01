import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import PhoneInput, {
  type Country,
  type Value,
} from "react-phone-number-input/min";
import flags from "react-phone-number-input/flags";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";

import { Button, Popover, TextInput } from "flowbite-react";
import { twMerge } from "flowbite-react/helpers/tailwind-merge";

export type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> & {
  value?: Value;
  defaultCountry?: Country;
  country?: Country;
  countries?: Country[];
  disabled?: boolean;
  onChange?: (value: Value) => void;
};

const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, _ref) => {
    return (
      <PhoneInput
        className={twMerge("flex", className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        limitMaxLength
        addInternationalOption={false}
        value={value || undefined}
        /**
         * Handles the onChange event.
         *
         * react-phone-number-input might trigger the onChange event as undefined
         * when a valid phone number is not entered. To prevent this,
         * the value is coerced to an empty string.
         *
         * @param {E164Number | undefined} value - The entered value
         */
        onChange={(value) => onChange?.(value || ("" as Value))}
        {...props}
      />
    );
  }
);
PhoneNumberInput.displayName = "PhoneNumberInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <TextInput
    id="small"
    type="text"
    className={twMerge(
      "PhoneInputInput [&_input]:rounded-e-lg [&_input]:rounded-s-none [&_input]:pl-10",
      className
    )}
    icon={Search}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  options: CountryEntry[];
  onChange: (country: Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredCountryList = countryList.filter(({ label }) =>
    label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      arrow={false}
      content={
        <div className="w-75">
          <div className="border-b border-gray-200 p-2 dark:border-gray-600">
            <TextInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search country..."
            />
          </div>

          <div className="h-full max-h-50 overflow-y-auto">
            {filteredCountryList.map(({ value, label }) => (
              <CountrySelectOption
                key={value}
                country={value || ("" as Country)}
                countryName={label}
                selectedCountry={selectedCountry}
                onChange={onChange}
                onSelectComplete={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      }
    >
      <Button
        type="button"
        outline
        className="flex gap-2 rounded-e-none rounded-s-lg border-r-0 px-4 focus:z-10 h-auto dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
        disabled={disabled}
      >
        <FlagComponent
          country={selectedCountry}
          countryName={selectedCountry}
        />
        <ChevronDown
          className={twMerge(
            "-mr-2 size-4 opacity-50",
            disabled ? "hidden" : "opacity-100"
          )}
        />
      </Button>
    </Popover>
  );
};

interface CountrySelectOptionProps {
  country: Country;
  countryName: string;
  selectedCountry: Country;
  onChange: (country: Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <div
      key={country || countryName}
      className="flex w-full cursor-pointer items-center gap-2 p-2 text-left text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => {
        onChange(country);
      }}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      {country && (
        <span className="text-sm">{`+${getCountryCallingCode(
          country as CountryCode
        )}`}</span>
      )}
      <Check
        className={`ml-auto size-4 ${
          country === selectedCountry ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

interface FlagComponentProps {
  country: Country;
  countryName?: string;
}

const FlagComponent = ({ country, countryName }: FlagComponentProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName ?? ""} />}
    </span>
  );
};

export default PhoneNumberInput;
