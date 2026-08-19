// app/(main)/(tabs)/layout.tsx
import type { JSX, ReactNode } from "react";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

type TabsLayoutProps = {
	children: ReactNode;
};

export default function TabsLayout({ children }: TabsLayoutProps): JSX.Element {
	return (
		<>
			<div className="pb-24">{children}</div>
			<BottomTabBar />
		</>
	);
}
