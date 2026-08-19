// features/auth/components/AccountSettings/AccountSettingsProfileForm.tsx
"use client";

import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePatchMyProfileMutation } from "@/features/auth/mutations";
import type { Gender, MyProfile } from "@/features/auth/types";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/utils/cn";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
	{ value: "male", label: "남성" },
	{ value: "female", label: "여성" },
];

type AccountSettingsProfileFormProps = {
	profile: MyProfile;
	username: string | null;
};

// 부모(AccountSettings)가 profile.id를 key로 마운트하므로 useState 초기값에
// profile 값을 바로 써도 안전하다 (effect로 동기화할 필요 없음 — PartnerEditForm과 동일 패턴)
export function AccountSettingsProfileForm({
	profile,
	username,
}: AccountSettingsProfileFormProps): JSX.Element {
	const patchMyProfileMutation = usePatchMyProfileMutation();
	const showToast = useToastStore(function (state) {
		return state.showToast;
	});

	const [name, setName] = useState(profile.name);
	const [gender, setGender] = useState<Gender | null>(profile.gender);

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (!gender) {
			return;
		}
		patchMyProfileMutation.mutate(
			{ name: name.trim(), gender },
			{
				onSuccess: function (): void {
					showToast("프로필이 저장됐어요");
				},
			},
		);
	}

	const isValid = name.trim().length >= 2 && name.trim().length <= 20 && gender !== null;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<section className="flex flex-col gap-2">
				<span className="text-sub text-xs">아이디</span>
				<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-sm">
					{username ?? "-"} (수정 불가)
				</p>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="account-name" className="text-sm font-medium">
					이름
				</label>
				<Input
					id="account-name"
					value={name}
					onChange={function (event) {
						setName(event.target.value);
					}}
					minLength={2}
					maxLength={20}
					required
				/>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">성별</span>
				<div className="flex gap-2">
					{GENDER_OPTIONS.map(function (option) {
						const selected = gender === option.value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={function () {
									setGender(option.value);
								}}
								className={cn(
									"h-11 flex-1 rounded-xl text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{option.label}
							</button>
						);
					})}
				</div>
				<p className="text-sub text-xs">성별을 바꾸면 홈 파트너 목록의 노출 대상도 바뀌어요.</p>
			</section>

			{patchMyProfileMutation.isError && (
				<p className="text-error-500 text-sm">{patchMyProfileMutation.error.message}</p>
			)}
			<Button type="submit" fullWidth disabled={!isValid || patchMyProfileMutation.isPending}>
				{patchMyProfileMutation.isPending ? "저장 중..." : "프로필 저장"}
			</Button>
		</form>
	);
}
