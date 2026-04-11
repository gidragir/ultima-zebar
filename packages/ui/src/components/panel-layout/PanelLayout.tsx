import type React from "react";
import { cn } from "../../utils/cn";

interface PanelLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
}

export default function PanelLayout({
	children,
	className,
	...props
}: PanelLayoutProps) {
	return (
		<div
			className={cn(
				"p-2 px-2.5 space-y-2 h-full w-full grow overflow-y-auto min-h-0",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}