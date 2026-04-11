import React from "react";
import { cn } from "../../utils/cn";

export const chipStyles =
	"flex items-center gap-2 rounded-2xl h-full drop-shadow-sm px-2.5 py-1 bg-background-deeper border border-border hover:border-primary/50 hover:bg-background/80 hover:shadow-md transition-all ease-in-out duration-200 active:scale-[0.97] active:bg-background-deeper/90";

type ChipProps<T extends React.ElementType = "div"> = {
	as?: T;
	className?: string;
	children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export const Chip = React.forwardRef<HTMLElement, ChipProps>(
	({ as: Component = "div", className, children, ...props }, ref) => {
		const Element = Component as React.ElementType;
		return (
			<Element
				ref={ref}
				className={cn(chipStyles, className)}
				{...props}
			>
				{children}
			</Element>
		);
	},
);

Chip.displayName = "Chip";