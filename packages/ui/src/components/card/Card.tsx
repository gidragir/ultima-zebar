import type { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"p-2 border border-border rounded bg-background flex flex-col gap-1.5 w-full",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Card.displayName = "Card";

export { Card };

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	Icon?: LucideIcon;
	as?: React.ElementType;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ className, children, Icon, as: Component = "h3", ...props }, ref) => {
		return (
			<div className={cn("flex items-center justify-between", className)}>
				<Component ref={ref} className="font-medium text-text-muted" {...props}>
					{children}
				</Component>
				{Icon && <Icon className="h-4 w-4 text-text-muted" />}
			</div>
		);
	},
);

CardTitle.displayName = "CardTitle";

export { CardTitle };