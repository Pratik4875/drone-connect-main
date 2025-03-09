import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { LocationHelper } from "@/utils/LocationHelper";

interface EventFilterProps {
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
}) => {
  const { cities, fetchCities, states } =
    LocationHelper();

  useEffect(() => {
    if (selectedState) {
      const stateData = states.find((state) => state.state === selectedState);
      if (stateData) {
        fetchCities(selectedState);
      }
    }
  }, [selectedState, selectedCity]);

  const renderDropdown = (
    label: string,
    items: string[],
    selectedValue: string,
    setSelectedValue: (value: string) => void
  ) => (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedValue || `Select ${label.toLowerCase()}`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup className="max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => setSelectedValue(item)}
                  >
                    {item}
                    <Check
                      className={cn(
                        "ml-auto",
                        item === selectedValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Filter />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Events</SheetTitle>
          <SheetDescription>Make changes to your profile here</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-5">
          {renderDropdown(
            "State",
            states.map((s) => s.state),
            selectedState,
            (value) => {
              setSelectedState(value);
              const stateCode = states.find((s) => s.state === value)?.code;
              if (stateCode) {
                fetchCities(value);
              }
              setSelectedCity("");
            }
          )}
          {renderDropdown("City", cities, selectedCity, setSelectedCity)}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EventFilter;
