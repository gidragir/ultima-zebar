import { PanelLayout } from "@ultima-zebar/ui";
import type { DiskOutput } from "zebar";
import DiskItem from "./components/DiskItem";

export default function Storage({ disk }: { disk: DiskOutput | null }) {
	if (!disk?.disks || disk.disks.length === 0)
		return (
			<PanelLayout title="Storage">
				<div className="flex flex-col justify-center items-center select-text w-full text-text-muted h-full">
					<p>No disk information available.</p>
				</div>
			</PanelLayout>
		);

	const disks = disk.disks;

	const sortedDisks = [...disks].sort((a, b) => {
		return a.mountPoint.localeCompare(b.mountPoint);
	});

	return (
		<PanelLayout title="Storage">
			{sortedDisks.map((d, index) => (
				<DiskItem key={index} initialAnimationDelay={50 * index} disk={d} />
			))}
		</PanelLayout>
	);
}