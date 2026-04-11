import { useWidgetSetting } from "@ultima-zebar/config";
import { Switch } from "@ultima-zebar/ui";
import { useEffect, useMemo, useState } from "react";
import * as zebar from "zebar";

const providers = zebar.createProviderGroup({
	systray: { type: "systray" },
});

function SystrayTab() {
	const [output, setOutput] = useState(providers.outputMap);
	const [pinnedSystrayIcons, setPinnedSystrayIcons] = useWidgetSetting(
		"main",
		"pinnedSystrayIcons",
	);

	useEffect(() => {
		providers.onOutput(() => setOutput(providers.outputMap));
	}, []);

	const icons = useMemo(() => output.systray?.icons, [output.systray]);

	const isIconPinned = (icon: zebar.SystrayIcon) => {
		return !!pinnedSystrayIcons.find((i: string) => icon.iconHash === i);
	};

	const handleCheckedChange = (toPin: zebar.SystrayIcon) => {
		if (isIconPinned(toPin)) {
			setPinnedSystrayIcons(
				pinnedSystrayIcons.filter((i: string) => i !== toPin.iconHash),
			);
		} else {
			setPinnedSystrayIcons([...pinnedSystrayIcons, toPin.iconHash]);
		}
	};

	return (
		<>
			<div className="space-y-0.5">
				<h3 className="text-lg font-semibold">Pinned Icons</h3>
				<p className="text-text-muted">
					These icons will stay visible in your system tray when it is
					collapsed.
				</p>
				<p className="text-text-muted">
					You can Shift + Click the system tray icons in the topbar to toggle
					between expanded or collapsed.
				</p>
			</div>
			<div className="grow space-y-2 max-w-full overflow-y-auto pr-2">
				{icons?.map((i) => (
					<div
						key={i.iconHash}
						className="flex items-center justify-between p-3 rounded-xl border border-border bg-background-deeper/50 hover:bg-background/40 hover:border-primary/30 transition-all duration-200 group"
					>
						<div className="flex items-center gap-4 min-w-0">
							<div className="p-2 rounded-lg bg-background-deeper border border-border group-hover:border-primary/20 transition-colors">
								<img
									className="h-6 w-6 shrink-0"
									src={i.iconUrl}
									alt={i.tooltip}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<div className="flex flex-col min-w-0">
								<p className="truncate font-medium text-text">{i.tooltip}</p>
								<p className="text-xs text-text-muted truncate">
									{isIconPinned(i)
										? "Visible when collapsed"
										: "Hidden when collapsed"}
								</p>
							</div>
						</div>
						<Switch
							checked={isIconPinned(i)}
							onCheckedChange={() => handleCheckedChange(i)}
						/>
					</div>
				))}
			</div>
		</>
	);
}

export default SystrayTab;