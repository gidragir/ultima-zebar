import { Chip } from "@ultima-zebar/ui";
import React from "react";
import type { MediaOutput } from "zebar";
import { cn } from "../../utils/cn";
import { ConditionalPanel } from "../common/ConditionalPanel";
import { ProgressBar } from "./components/ProgressBar";
import { Status } from "./components/Status";
import { TitleDetails } from "./components/TitleDetails";

export const TitleDetailsMemo = React.memo(TitleDetails);

type MediaProps = {
	media: MediaOutput | null;
};
// To allow cycling of Media sessions with Alt+Click we have to handle our own current session
// This is why there are two current sessions defined here:
// zebarCurrentSession: The actual session given from the Media provider.
// currentSession: Our own local state of Zebar session.
// This is not ideal and hopefully future Zebar releases will provide a way to change sessions internally.
export default function Media({ media }: MediaProps) {
	const [currentSessionIdx, setCurrentSessionIdx] = React.useState<number>(0);

	const allSessions = media?.allSessions ?? [];
	const zebarCurrentSession = media?.currentSession;

	const zebarCurrentSessionIdx = allSessions.findIndex(
		(s) => s.sessionId === zebarCurrentSession?.sessionId,
	);

	React.useEffect(() => {
		if (zebarCurrentSessionIdx !== -1) {
			setCurrentSessionIdx(zebarCurrentSessionIdx);
		}
	}, [zebarCurrentSessionIdx]);

	const currentSession = allSessions[currentSessionIdx];

	const handlePlayPause = (e: React.MouseEvent) => {
		if (!media || !currentSession) return;

		const { togglePlayPause, next, previous } = media;

		if (e.shiftKey) {
			previous({ sessionId: currentSession.sessionId });
			return;
		}

		if (e.ctrlKey) {
			next({ sessionId: currentSession.sessionId });
			return;
		}

		if (e.altKey) {
			if (currentSessionIdx < allSessions.length - 1) {
				setCurrentSessionIdx((prev) => prev + 1);
			} else {
				setCurrentSessionIdx(0);
			}
			return;
		}

		togglePlayPause({ sessionId: currentSession.sessionId });
	};

	return (
		<ConditionalPanel sessionActive={!!media && !!currentSession}>
			<button
				type="button"
				className={cn(
					"flex gap-2 select-none cursor-pointer outline-none relative h-full",
					"transition-transform active:scale-95 duration-200",
				)}
				onClick={handlePlayPause}
			>
				<Chip
					className={cn(
						"relative flex gap-2 select-none cursor-pointer overflow-clip group",
						"active:bg-background-deeper/90",
					)}
				>
					<Status isPlaying={currentSession?.isPlaying ?? false} />
					<TitleDetails
						title={currentSession?.title}
						artist={currentSession?.artist}
					/>

					<ProgressBar currentSession={currentSession} />
				</Chip>
			</button>
		</ConditionalPanel>
	);
}