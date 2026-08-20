// features/safety/components/SafetyCenter/SafetyCenterBlockList.tsx
"use client";

import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useDeleteBlockMutation } from "@/features/safety/mutations";
import { useMyBlocksQuery } from "@/features/safety/queries";
import { formatDateShort } from "@/features/safety/utils";

export function SafetyCenterBlockList(): JSX.Element {
	const { data: blocks, isPending, isError } = useMyBlocksQuery();
	const deleteBlockMutation = useDeleteBlockMutation();

	function handleUnblockClick(blockId: string): void {
		deleteBlockMutation.mutate(blockId);
	}

	if (isPending) {
		return <div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />;
	}

	if (isError) {
		return <p className="text-sub py-6 text-center text-sm">차단 목록을 불러오지 못했어요.</p>;
	}

	if (blocks.length === 0) {
		return (
			<p className="bg-surface-alt text-sub rounded-2xl px-4 py-8 text-center text-sm">
				차단한 사용자가 없어요.
			</p>
		);
	}

	return (
		<div className="bg-surface flex flex-col overflow-hidden rounded-2xl">
			{blocks.map(function (block) {
				return (
					<div key={block.id} className="flex items-center gap-3 px-4.5 py-3.5">
						<div className="flex min-w-0 flex-col gap-0.5">
							<span className="truncate text-[15px] font-medium">{block.blockedNickname}</span>
							<span className="text-sub text-xs tabular-nums">
								{formatDateShort(block.created_at)} 차단
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							isLoading={deleteBlockMutation.isPending}
							onClick={function () {
								handleUnblockClick(block.id);
							}}
							className="ml-auto shrink-0">
							차단 해제
						</Button>
					</div>
				);
			})}
		</div>
	);
}
