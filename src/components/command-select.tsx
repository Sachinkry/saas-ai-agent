import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
    options: Array<{
        id: string;
        value: string;
        children: React.ReactNode;
    }>;
    onSelect: ( value: string ) => void;
    onSearch?: ( value: string ) => void;
    value?: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder="Select an option",
    isSearchable,
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    const handleOpenChange = (open: boolean) => {
        onSearch?.("");
        setOpen(open)
    }

    return (
        <>
            <Button 
                onClick={() => setOpen(true)}
                variant={"outline"}
                type="button"
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className
                )}
            >
                <div className="">
                    {selectedOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog 
                shouldFilter={!onSearch}
                open={open}
                onOpenChange={handleOpenChange}
            >
                <CommandInput placeholder="Search..." onValueChange={onSearch} />
                <CommandList>
                    <CommandEmpty >
                        <span className="text-muted-foreground text-sm">
                            No options found.
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem 
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.value);
                                setOpen(false)
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    )
}