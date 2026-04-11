import type { Event } from "@tauri-apps/api/event";
import { useEffect } from "react";
import * as zebar from "zebar";
import type { RootConfig, Theme } from "../../types";
import {
	listenForThemePreviewRevert,
	listenForThemePreviewUpdate,
} from "../callbacks/theme-preview";

export const useThemePreviewIpc = (state: RootConfig) => {
	useEffect(() => {
		const listenThemePreview = async () => {
			await zebar
				.currentWidget()
				.tauriWindow.listen("theme-preview-update", (event: Event<Theme>) =>
					listenForThemePreviewUpdate(event),
				);

			await zebar
				.currentWidget()
				.tauriWindow.listen("theme-preview-revert", () =>
					listenForThemePreviewRevert(state),
				);
		};

		listenThemePreview();
	}, [state.app.currentThemeId, state.app.themes]);
};