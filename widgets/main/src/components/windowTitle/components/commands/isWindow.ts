import type { GlazeWmOutput } from "zebar";
import { ContainerType } from "../../WindowTitle";

type Container = GlazeWmOutput["focusedContainer"];
type MyWindow = Extract<Container, { type: ContainerType.WINDOW }>;

export function isWindow(
	container: Container | null | undefined,
): container is MyWindow {
	// The focused container is briefly missing while entering a workspace
	// without keep_alive.
	return container?.type === ContainerType.WINDOW;
}