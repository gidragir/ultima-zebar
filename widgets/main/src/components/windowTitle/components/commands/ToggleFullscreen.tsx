import { Maximize, Minimize } from "lucide-react";
import { IconButton } from "../IconButton";
import { isWindow } from "./isWindow";
import type { CommandProps } from "./types/command";

// TODO: Make issue to GlazeWM to export window types.
enum WindowType {
	TILING = "tiling",
	FLOATING = "floating",
	MINIMIZED = "minimized",
	FULLSCREEN = "fullscreen",
}

export const ToggleFullscreen = ({ glazewm }: CommandProps) => {
	const tooltipText = "Toggle fullscreen state of window";
	if (!glazewm) return null;
	if (!isWindow(glazewm.focusedContainer)) return null;

	const isFullscreen =
		glazewm.focusedContainer.state.type === WindowType.FULLSCREEN;
	const command = "toggle-fullscreen";

	return (
		<IconButton
			animateKey={isFullscreen ? "maximise" : "minimise"}
			key={command}
			title={tooltipText}
			onClick={() => glazewm?.runCommand(command)}
			icon={isFullscreen ? Minimize : Maximize}
		/>
	);
};