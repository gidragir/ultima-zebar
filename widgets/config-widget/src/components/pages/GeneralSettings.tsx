import { useAppSetting } from "@ultima-zebar/config";
import {
	FieldDescription,
	FieldInput,
	FieldTitle,
	FormField,
	Input,
	Switch,
} from "@ultima-zebar/ui";
import { Separator } from "../common/Separator";
import SettingsPage from "../SettingsPage";

export function GeneralSettings() {
	const [useAutoTiling, setUseAutoTiling] = useAppSetting("useAutoTiling");
	const [websocketUri, setWebsocketUri] = useAppSetting("zebarWebsocketUri");

	return (
		<SettingsPage
			title={"General"}
			description={"Settings about all ultima-zebar widgets."}
		>
			<div>
				<FormField switch>
					<FieldTitle>Enable Auto Tiling</FieldTitle>
					<FieldInput>
						<Switch
							checked={useAutoTiling}
							onCheckedChange={setUseAutoTiling}
						/>
					</FieldInput>
					<FieldDescription>
						Will automatically change the tiling direction when the window size
						becomes less than half.
					</FieldDescription>
				</FormField>
				<Separator />
				<FormField>
					<FieldTitle>Zebar WebSocket URI</FieldTitle>
					<FieldInput>
						<Input
							placeholder="e.g., ws://localhost:6123"
							value={websocketUri}
							onChange={(e) => setWebsocketUri(e.target.value)}
						/>
					</FieldInput>
					<FieldDescription warning>
						This is the WebSocket URI for the Zebar service. By default Zebar
						runs on ws://localhost:6123.
					</FieldDescription>
				</FormField>
			</div>
		</SettingsPage>
	);
}