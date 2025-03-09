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
import { Switch } from "@/components/ui/switch";
import { LocationHelper } from "@/utils/LocationHelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PilotFilterProps {
  available: string;
  setAvailable: (value: string) => void;
  companyPilots: string;
  setCompanyPilots: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  selectedPincode: string;
  setSelectedPincode: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const PilotFilter: React.FC<PilotFilterProps> = ({
  available,
  setAvailable,
  companyPilots,
  setCompanyPilots,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  selectedPincode,
  setSelectedPincode,
  selectedCategory,
  setSelectedCategory,
}) => {
  const {
    cities,
    districts,
    fetchCities,
    fetchPincodes,
    getDistrict,
    pincodes,
    states,
  } = LocationHelper();

  useEffect(() => {
    if (selectedState) {
      const stateData = states.find((state) => state.state === selectedState);
      if (stateData) {
        fetchCities(selectedState);
        getDistrict(stateData.code);
      }
    }
    if (selectedState && selectedCity) {
      fetchPincodes(selectedState, selectedCity);
    }
  }, [selectedState, selectedCity]);

  const handleClearFilter = () => {
    setAvailable("true");
    setSelectedCategory("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedPincode("");
  }

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
          <SheetTitle>Filter Pilots</SheetTitle>
          <SheetDescription>Make changes to your profile here</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-5">
          <div className="flex flex-col gap-2">
            <Label>Drone Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your drone category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nano">Nano</SelectItem>
                <SelectItem value="micro">Micro</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderDropdown(
            "State",
            states.map((s) => s.state),
            selectedState,
            (value) => {
              setSelectedState(value);
              const stateCode = states.find((s) => s.state === value)?.code;
              if (stateCode) {
                getDistrict(stateCode);
                fetchCities(value);
                fetchPincodes(value, "");
              }
              setSelectedCity("");
              setSelectedDistrict("");
              setSelectedPincode("");
            }
          )}
          {renderDropdown("City", cities, selectedCity, setSelectedCity)}
          {renderDropdown(
            "District",
            districts,
            selectedDistrict,
            setSelectedDistrict
          )}
          {renderDropdown(
            "Pincode",
            pincodes,
            selectedPincode,
            setSelectedPincode
          )}
          <div className="flex items-center justify-between space-x-2">
            <Label>Availability</Label>
            <Switch
              checked={available === "true"}
              onCheckedChange={(checked) =>
                setAvailable(checked ? "true" : "false")
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label>Company Pilots</Label>
            <Switch
              checked={companyPilots === "true"}
              onCheckedChange={(checked) =>
                setCompanyPilots(checked ? "true" : "false")
              }
            />
          </div>
          <Button onClick={handleClearFilter}>
            Clear Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PilotFilter;
