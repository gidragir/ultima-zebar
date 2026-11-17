import { textSwap } from "@ultima-zebar/ui";
import { AppWindowIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useEffect, useState } from "react";
import type { GlazeWmOutput } from "zebar";
import { WindowControls } from "./components/WindowControls";

type WindowTitleProps = {
	glazewm: GlazeWmOutput | null;
};

// Focus is resolved once the focused container exists, belongs to the focused
// workspace and (for windows) already has a title. Intermediate GlazeWM states
// while switching workspaces fail one of these checks.
function hasResolvedFocus(glazewm: GlazeWmOutput | null): boolean {
	const workspace = glazewm?.focusedWorkspace;
	const focused = glazewm?.focusedContainer;
	if (!workspace || !focused) return false;
	if (focused.type === ContainerType.WINDOW && !focused.title) return false;

	const containsFocus = (
		container: GlazeWmOutput["focusedContainer"],
	): boolean =>
		container.id === focused.id ||
		("children" in container && container.children.some(containsFocus));

	return containsFocus(workspace);
}

export const WindowTitle = forwardRef<HTMLButtonElement, WindowTitleProps>(
	({ glazewm }, ref) => {
		const [show, setShow] = useState(false);
		if (!glazewm) return;

		// Entering a workspace without keep_alive briefly reports no focused
		// workspace/container. Hold the last resolved title through that state
		// instead of rendering (and animating to) an intermediate one.
		const resolved = hasResolvedFocus(glazewm);
		const liveTitle = glazewm && resolved ? getWindowTitle(glazewm) : undefined;
		const [heldTitle, setHeldTitle] = useState<string | null>(null);
		useEffect(() => {
			if (liveTitle !== undefined) setHeldTitle(liveTitle);
		}, [liveTitle]);

		if (!glazewm) return null;

		const title = liveTitle !== undefined ? liveTitle : heldTitle;

		function handleWindowTitle(e: React.MouseEvent, textToCopy: string) {
			if (e.altKey) {
				navigator.clipboard
					.writeText(textToCopy)
					.then(() => {
						console.log(`Copied to clipboard: ${textToCopy}`);
					})
					.catch((err) => {
						console.error("Failed to copy text to clipboard:", err);
					});
				return;
			}

			setShow(!show);
		}

		return (
			<AnimatePresence mode="wait">
				<motion.button
					ref={ref}
					key={title ?? "default-icon"}
					{...textSwap}
					className="font-medium relative h-full flex items-center cu"
					title={title ?? "Focused Window"}
					onClick={(e: React.MouseEvent) =>
						handleWindowTitle(e, getWindowProcess(glazewm) ?? "")
					}
				>
					{title ?? <AppWindowIcon className="h-4 w-4 text-icon" />}
					<WindowControls
						glazewm={glazewm}
						show={show}
						setShow={setShow}
						parentRef={ref}
					/>
				</motion.button>
			</AnimatePresence>
		);
	},
);

export enum ContainerType {
	ROOT = "root",
	MONITOR = "monitor",
	WORKSPACE = "workspace",
	SPLIT = "split",
	WINDOW = "window",
}

const SPLIT_WINDOW_PROCESS_EXCLUSIONS = ["Spotify"];
const SPLIT_WINDOW_TITLE_REGEX = /[-—]/;

export const formatWindowTitle = (title: string, process: string) => {
	const isExcluded =
		typeof title === "string" &&
		SPLIT_WINDOW_PROCESS_EXCLUSIONS.some((exclusion) =>
			process.startsWith(exclusion),
		);

	const splitWindowTitle = title?.split(SPLIT_WINDOW_TITLE_REGEX) || [];

	const lastSplitWindowTitle = isExcluded
		? process
		: (splitWindowTitle.at(-1) ?? title);

	return lastSplitWindowTitle;
};

const getWindowTitle = (glazewm: GlazeWmOutput): string | null => {
	const focusedWorkspace = glazewm.focusedWorkspace;
	const focusedContainer = glazewm.focusedContainer;

	// Unresolved focus state (see WindowTitle) — reading through it throws.
	if (!focusedWorkspace || !focusedContainer) return null;

	if (focusedContainer.type === ContainerType.WINDOW) {
		return formatWindowTitle(
			focusedContainer.title,
			focusedContainer.processName,
		);
	}

	// If the focused container is not a window, return workspace displayName. If displayName is not available, fallback to workspace name.
	const focusedWorkspaceDisplayName = focusedWorkspace.displayName
		? focusedWorkspace.displayName
		: `Workspace ${focusedWorkspace.name}`;
	return focusedWorkspaceDisplayName;
};

const getWindowProcess = (glazewm: GlazeWmOutput): string | null => {
	const focusedContainer = glazewm.focusedContainer;

	if (focusedContainer?.type === ContainerType.WINDOW) {
		return focusedContainer.processName;
	}

	return null;
};

export default WindowTitle;