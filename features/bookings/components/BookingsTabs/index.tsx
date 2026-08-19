// features/bookings/components/BookingsTabs/index.tsx
"use client";

import { useState, type JSX } from "react";
import { MyBookingList } from "@/features/bookings/components/MyBookingList";
import { ReceivedBookingList } from "@/features/bookings/components/ReceivedBookingList";
import { useMyPartnerProfileQuery } from "@/features/partners/queries";
import { cn } from "@/utils/cn";

type BookingsTabKey = "mine" | "received";

export function BookingsTabs(): JSX.Element {
	const { data: myPartnerProfile } = useMyPartnerProfileQuery();
	const [activeTab, setActiveTab] = useState<BookingsTabKey>("mine");

	const isPartner = Boolean(myPartnerProfile);

	if (!isPartner) {
		return <MyBookingList />;
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="bg-surface-alt flex rounded-xl p-1">
				<button
					type="button"
					onClick={function () {
						setActiveTab("mine");
					}}
					className={cn(
						"h-9 grow rounded-lg text-sm font-medium",
						activeTab === "mine" && "bg-surface font-semibold shadow-sm",
						activeTab !== "mine" && "text-sub",
					)}>
					내 예약
				</button>
				<button
					type="button"
					onClick={function () {
						setActiveTab("received");
					}}
					className={cn(
						"h-9 grow rounded-lg text-sm font-medium",
						activeTab === "received" && "bg-surface font-semibold shadow-sm",
						activeTab !== "received" && "text-sub",
					)}>
					받은 요청
				</button>
			</div>
			{activeTab === "mine" && <MyBookingList />}
			{activeTab === "received" && <ReceivedBookingList />}
		</div>
	);
}
