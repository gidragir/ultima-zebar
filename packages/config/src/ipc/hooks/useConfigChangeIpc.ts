import { useEffect } from "react";
import * as zebar from "zebar";
import type { Dispatch } from "../../ConfigReducer";
import { configService } from "../../ConfigService";

export function useConfigChangeIpc(dispatch: Dispatch) {
	useEffect(() => {
		const listenConfigChange = async () => {
			await zebar.currentWidget().tauriWindow.listen("config-changed", () => {
				const reloaded = configService.loadConfig(true); // Force reload
				dispatch({ type: "LOAD_CONFIG", config: reloaded });
			});
		};

		listenConfigChange();
	}, []);
}