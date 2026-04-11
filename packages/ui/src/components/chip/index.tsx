import React from "react";
import { cn } from "../../utils/cn";

export const chipStyles =
	"flex items-center gap-2 rounded-2xl h-full drop-shadow-sm px-2.5 py-1 bg-background-deeper border border-border hover:border-primary/50 hover:bg-background/80 hover:shadow-md transition-all ease-in-out duration-200 active:scale-[0.97] active:bg-background-deeper/90";

interface ChipProps<T extends React.ElementType = "div"> {
	as?: T;
	className?: string;
	children: React.ReactNode;
	[key: string]: unknown;
}

export const Chip = React.forwardRef<HTMLElement, ChipProps>(
	({ as: Component = "div", className, children, ...props }, ref) => {
		return (
			<Component ref={ref} className={cn(chipStyles, className)} {...props}>
				{children}
			</Component>
		);
	},
);

Chip.displayName = "Chip";