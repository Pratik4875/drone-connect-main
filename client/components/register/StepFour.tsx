import React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { LocationHelper } from "@/utils/LocationHelper";

const StepFour = ({
  onNext,
  loading,
}: {
  onNext: () => void;
  loading: boolean;
}) => {
      const { control, setValue, getValues } = useFormContext();
    
  const {
    cities,
    districts,
    fetchCities,
    fetchPincodes,
    getDistrict,
    pincodes,
    states,
  } = LocationHelper();
  return (
    <>
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value
                      ? states.find(
                          (state: { state: string; code: string }) =>
                            state.state === field.value
                        )?.state
                      : "Select your state"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search state..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                      {states.map((state: { state: string; code: string }) => (
                        <CommandItem
                          value={state.state}
                          key={state.code}
                          onSelect={() => {
                            setValue("state", state.state);
                            getDistrict(state.code); // Fetch districts for selected state
                            fetchCities(state.state); // Fetch cities for selected state
                            setValue("district", ""); // Reset district field
                            setValue("city", ""); // Reset district field
                            setValue("pincode", ""); // Reset district field
                          }}
                        >
                          {state.state}
                          <Check
                            className={cn(
                              "ml-auto",
                              state.state === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value
                      ? districts.find(
                          (district) => district === field.value
                        ) || "Select your district"
                      : "Select your district"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search district..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {districts.map((district) => (
                        <CommandItem
                          value={district}
                          key={district}
                          onSelect={() => {
                            setValue("district", district);
                            setValue("city", ""); // Reset district field
                            setValue("pincode", ""); // Reset district field
                          }}
                        >
                          {district}
                          <Check
                            className={cn(
                              "ml-auto",
                              district === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value
                      ? cities.find((city) => city === field.value) ||
                        "Select your city"
                      : "Select your city"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search city..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          value={city}
                          key={city}
                          onSelect={() => {
                            setValue("city", city);
                            fetchPincodes(getValues("state"), city); // Fetch pincodes for selected city
                            setValue("pincode", ""); // Reset pincode field
                          }}
                        >
                          {city}
                          <Check
                            className={cn(
                              "ml-auto",
                              city === field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pincode</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value
                      ? pincodes.find((pincode) => pincode === field.value) ||
                        "Select your pincode"
                      : "Select your pincode"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search pincode..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No pincode found.</CommandEmpty>
                    <CommandGroup>
                      {pincodes.map((pincode) => (
                        <CommandItem
                          value={pincode}
                          key={pincode}
                          onSelect={() => {
                            setValue("pincode", pincode);
                          }}
                        >
                          {pincode}
                          <Check
                            className={cn(
                              "ml-auto",
                              pincode === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" className="w-full" onClick={onNext} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Submitingggg{" "}
          </>
        ) : (
          "Next"
        )}
      </Button>
    </>
  );
};

export default StepFour;
