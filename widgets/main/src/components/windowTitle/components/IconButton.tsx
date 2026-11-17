import { iconFeedback, iconSwap } from "@ultima-zebar/ui";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import type React from "react";
import { cn } from "../../../utils/cn";

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: LucideIcon;
	animateKey?: string;
	animateProps?: HTMLMotionProps<"div">;
}

export const IconButton = ({
	icon: Icon,
	animateKey,
	animateProps,
	...props
}: IconButtonProps) => {
	const renderInner = (Icon: LucideIcon) => (
		<Icon className="h-3.5 w-3.5" strokeWidth={3} />
	);

	return (
		<button
			className={cn(
				"h-full flex items-center justify-center text-icon",
				"hover:text-text",
				"transition-colors duration-200 ease-in-out",
				"disabled:pointer-events-none disabled:opacity-50",
			)}
			{...props}
		>
			{animateKey ? (
				<AnimatePresence mode="popLayout">
					<motion.div
						key={animateKey}
						{...iconSwap}
						{...iconFeedback}
						{...animateProps}
					>
						{renderInner(Icon)}
					</motion.div>
				</AnimatePresence>
			) : (
				renderInner(Icon)
			)}
		</button>
	);
};