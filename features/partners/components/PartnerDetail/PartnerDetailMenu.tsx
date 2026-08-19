// features/partners/components/PartnerDetail/PartnerDetailMenu.tsx
"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState, type JSX } from "react";
import { BlockConfirmDialog } from "@/features/safety/components/BlockConfirmDialog";
import { ReportDialog } from "@/features/safety/components/ReportDialog";

type PartnerDetailMenuProps = {
	targetId: string;
	targetNickname: string;
};

export function PartnerDetailMenu({
	targetId,
	targetNickname,
}: PartnerDetailMenuProps): JSX.Element {
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [isBlockOpen, setIsBlockOpen] = useState(false);

	return (
		<>
			<Menu>
				<MenuButton
					aria-label="더보기 메뉴"
					className="flex size-10 items-center justify-center rounded-full bg-white/90">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="#18181b">
						<circle cx="5" cy="12" r="1.8" />
						<circle cx="12" cy="12" r="1.8" />
						<circle cx="19" cy="12" r="1.8" />
					</svg>
				</MenuButton>
				<MenuItems
					anchor="bottom end"
					className="bg-surface z-20 mt-1 w-36 rounded-xl p-1 shadow-lg">
					<MenuItem>
						<button
							type="button"
							onClick={function () {
								setIsReportOpen(true);
							}}
							className="text-error-500 data-focus:bg-surface-alt w-full rounded-lg px-3 py-2.5 text-left text-sm">
							신고하기
						</button>
					</MenuItem>
					<MenuItem>
						<button
							type="button"
							onClick={function () {
								setIsBlockOpen(true);
							}}
							className="text-body data-focus:bg-surface-alt w-full rounded-lg px-3 py-2.5 text-left text-sm">
							차단하기
						</button>
					</MenuItem>
				</MenuItems>
			</Menu>

			{isReportOpen && (
				<ReportDialog
					onClose={function () {
						setIsReportOpen(false);
					}}
					targetId={targetId}
					targetNickname={targetNickname}
				/>
			)}

			{isBlockOpen && (
				<BlockConfirmDialog
					onClose={function () {
						setIsBlockOpen(false);
					}}
					targetId={targetId}
					targetNickname={targetNickname}
				/>
			)}
		</>
	);
}
