import {
	contentAppearance,
	panelEnterTransition,
	panelExitTransition,
} from "@ultima-zebar/ui";
import {
	AnimatePresence,
	animate,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from "motion/react";
import type React from "react";
import { type ReactElement, useEffect } from "react";

interface ExpandingCarouselProps {
	items: ReactElement[];
	expanded: boolean;
	visibleCount?: number;
	itemWidth?: number;
	gap?: number;
	fadeEdgeOffset?: number;
	startIndex?: number;
}

export const ExpandingCarousel: React.FC<ExpandingCarouselProps> = ({
	items,
	expanded,
	visibleCount = 4,
	itemWidth = 128,
	gap = 8,
	fadeEdgeOffset = 10,
	startIndex: customStartIndex,
}) => {
	const reduceMotion = useReducedMotion();
	const carouselTransition = reduceMotion
		? { duration: 0 }
		: expanded
			? panelEnterTransition
			: panelExitTransition;
	const totalItems = items.length;
	const itemOrder = JSON.stringify(items.map((item) => item.key));
	const fullWidth = totalItems * itemWidth + (totalItems - 1) * gap;
	const visibleWidth = visibleCount * itemWidth + (visibleCount - 1) * gap;
	const startIndex =
		customStartIndex ??
		Math.max(0, Math.floor((totalItems - visibleCount) / 2));
	const initialOffset = -(startIndex * (itemWidth + gap));

	const leftEdge = `${fadeEdgeOffset}%`;
	const rightEdge = `${100 - fadeEdgeOffset}%`;
	const edgeOpacity = useMotionValue(1);
	const edgeColor = useTransform(edgeOpacity, (val) => `rgba(0,0,0,${val})`);
	const gradient = useMotionTemplate`linear-gradient(to right, ${edgeColor} 0%, black ${leftEdge}, black ${rightEdge}, ${edgeColor} 100%)`;
	useEffect(() => {
		const animation = animate(
			edgeOpacity,
			expanded ? 1 : 0.3,
			reduceMotion
				? { duration: 0 }
				: expanded
					? panelEnterTransition
					: panelExitTransition,
		);
		return () => animation.stop();
	}, [edgeOpacity, expanded, reduceMotion]);

	return (
		<div className="w-full flex justify-center items-center">
			<motion.div
				className="relative overflow-hidden"
				initial={false}
				style={{
					width: expanded ? fullWidth : visibleWidth,
					WebkitMaskImage: gradient,
					maskImage: gradient,
					WebkitMaskSize: "100% 100%",
					WebkitMaskRepeat: "no-repeat",
					maskSize: "100% 100%",
					maskRepeat: "no-repeat",
				}}
				transition={carouselTransition}
			>
				<motion.div
					className="flex will-change-transform"
					initial={false}
					style={{ width: fullWidth, gap: `${gap}px` }}
					animate={{ x: expanded ? 0 : initialOffset }}
					transition={carouselTransition}
				>
					<AnimatePresence mode="sync" initial={false}>
						{items.map((item) => (
							<motion.div
								key={item.key}
								layout
								layoutDependency={itemOrder}
								className="flex items-center flex-shrink-0 will-change-transform"
								style={{ width: itemWidth }}
								{...contentAppearance}
								initial={reduceMotion ? false : contentAppearance.initial}
								exit={
									reduceMotion
										? { opacity: 0, transition: { duration: 0 } }
										: contentAppearance.exit
								}
								transition={{
									...(reduceMotion ? { duration: 0 } : panelEnterTransition),
								}}
							>
								{item}
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</div>
	);
};