"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
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

export interface ComboboxComFiltroProps<T> {
  items: T[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  itemToString: (item: T | null) => string;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>; // <-- nova prop
}

export function ComboboxComFiltro<T>({
  items,
  value,
  onValueChange,
  itemToString,
  renderItem,
  placeholder = "Selecione...",
  inputPlaceholder = "Pesquisar...",
  onInputChange,
  inputRef, // <-- usa a prop
}: ComboboxComFiltroProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const lowerSearch = search.toLowerCase();
    return items.filter((item) =>
      itemToString(item).toLowerCase().includes(lowerSearch)
    );
  }, [items, search, itemToString]);

  function handleInputChange(value: string) {
    setSearch(value);
    if (onInputChange) {
      onInputChange(value);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value ? itemToString(value) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            ref={inputRef} // <-- aplica o inputRef aqui
            placeholder={inputPlaceholder}
            value={search}
            onValueChange={handleInputChange}
            autoFocus
            className="px-3 py-1 text-sm h-auto"
          />
          <CommandList>
            <CommandGroup>
              <CommandItem
                value=""
                onSelect={() => {
                  onValueChange(null);
                  setOpen(false);
                  setSearch("");
                  if (onInputChange) onInputChange("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === null ? "opacity-100" : "opacity-0"
                  )}
                />
                Nenhum
              </CommandItem>
            </CommandGroup>

            <CommandGroup>
              {filteredItems.map((item, idx) => (
                <CommandItem
                  key={idx}
                  value={itemToString(item)}
                  onSelect={() => {
                    onValueChange(item);
                    setOpen(false);
                    setSearch("");
                    if (onInputChange) onInputChange("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {renderItem(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
