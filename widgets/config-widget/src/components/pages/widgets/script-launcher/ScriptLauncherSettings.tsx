import { PanelLayout, Tabs } from "@ultima-zebar/ui";
import PanelHeading from "@/components/PanelHeading";
import { ApplicationsTab } from "./components/ApplicationsTab";

export function ScriptLauncherSettings() {
	return (
		<PanelLayout title="Script Launcher">
			<Tabs defaultValue="applications" className="flex-grow">
				<div className="px-3 py-1 flex flex-col flex-grow">
					<PanelHeading
						title="Script Launcher"
						description="Manage your scripts."
					/>

					<ApplicationsTab />
				</div>
			</Tabs>
		</PanelLayout>
	);
}