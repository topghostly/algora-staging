"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiComboboxProps = {
  options: ComboboxOption[];
  value?: string[]; // controlled
  defaultValue?: string[]; // uncontrolled
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiCombobox({
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Select...",
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<string[]>(defaultValue);

  const selectedValues = value ?? internal;

  function update(values: string[]) {
    if (value === undefined) setInternal(values);
    onValueChange?.(values);
  }

  const selectedOptions = options.filter((o) =>
    selectedValues.includes(o.value),
  );

  function toggle(val: string) {
    const exists = selectedValues.includes(val);

    if (exists) {
      update(selectedValues.filter((v) => v !== val));
    } else {
      update([...selectedValues, val]);
    }
  }

  function remove(val: string) {
    update(selectedValues.filter((v) => v !== val));
  }

  function clearAll(e?: React.SyntheticEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    update([]);
  }

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Backspace") return;
    const input = inputRef.current;
    if (!input) return;
    if (input.value.length > 0) return;

    update(selectedValues.length ? selectedValues.slice(0, -1) : []);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-12 w-full justify-between px-3 py-2 hover:bg-white shadow-none",
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant="secondary"
                  className="pr-1 text-white rounded-full"
                >
                  {opt.label}
                  <button
                    type="button"
                    className="ml-1 rounded-sm p-0.5 hover:bg-muted"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(opt.value);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="ml-2 flex items-center gap-1">
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="rounded-sm p-1 hover:bg-muted"
              >
                <X className="h-4 w-4 opacity-70" />
              </button>
            )}
            {/* <ChevronsUpDown className="h-4 w-4 opacity-50" /> */}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-none">
        <Command onKeyDown={onKeyDown}>
          <CommandInput ref={inputRef as any} placeholder="Search..." />
          <CommandEmpty>No results.</CommandEmpty>

          <CommandGroup>
            {options.map((opt) => {
              const checked = selectedValues.includes(opt.value);

              return (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  onSelect={() => toggle(opt.value)}
                  className="hover:bg-red-300"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      checked ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {opt.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
