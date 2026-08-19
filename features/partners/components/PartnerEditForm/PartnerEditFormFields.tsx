// features/partners/components/PartnerEditForm/PartnerEditFormFields.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PURPOSE_TAGS } from "@/constants/purposeTags";
import { REGIONS } from "@/constants/regions";
import { PartnerPhotoManager } from "@/features/partners/components/PartnerPhotoManager";
import {
	MAX_PARTNER_PHOTOS,
	MIN_PARTNER_PHOTOS,
} from "@/features/partners/components/PartnerPhotoUploader";
import { usePatchPartnerProfileMutation } from "@/features/partners/mutations";
import type { MyPartnerProfile } from "@/features/partners/types";
import { INTEREST_OPTIONS, MIN_HOURLY_RATE_KRW, WEEKDAY_OPTIONS } from "@/features/partners/utils";
import { cn } from "@/utils/cn";

type PartnerEditFormFieldsProps = {
	profile: MyPartnerProfile;
};

// 부모(PartnerEditForm)가 profile.profile_id를 key로 마운트하므로,
// 여기서는 로드된 profile 값을 useState 초기값으로 그대로 써도 안전하다 (effect로 동기화할 필요 없음)
export function PartnerEditFormFields({ profile }: PartnerEditFormFieldsProps): JSX.Element {
	const router = useRouter();
	const patchPartnerProfileMutation = usePatchPartnerProfileMutation();

	const [nickname, setNickname] = useState(profile.nickname);
	const [bio, setBio] = useState(profile.bio);
	const [hourlyRate, setHourlyRate] = useState(String(profile.hourly_rate_krw));
	const [interests, setInterests] = useState<string[]>(profile.interests);
	const [availableWeekdays, setAvailableWeekdays] = useState<number[]>(profile.available_weekdays);
	const [region, setRegion] = useState<string | null>(profile.region);
	const [purposeTags, setPurposeTags] = useState<string[]>(profile.purpose_tags);
	const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>(profile.photo_urls);
	const [newPhotos, setNewPhotos] = useState<File[]>([]);

	function handleWeekdayToggle(weekday: number): void {
		setAvailableWeekdays(function (current) {
			if (current.includes(weekday)) {
				return current.filter(function (item) {
					return item !== weekday;
				});
			}
			return [...current, weekday].sort();
		});
	}

	function handleInterestToggle(interest: string): void {
		setInterests(function (current) {
			if (current.includes(interest)) {
				return current.filter(function (item) {
					return item !== interest;
				});
			}
			if (current.length >= 3) {
				return current;
			}
			return [...current, interest];
		});
	}

	function handlePurposeTagToggle(tag: string): void {
		setPurposeTags(function (current) {
			if (current.includes(tag)) {
				return current.filter(function (item) {
					return item !== tag;
				});
			}
			if (current.length >= 2) {
				return current;
			}
			return [...current, tag];
		});
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		patchPartnerProfileMutation.mutate(
			{
				nickname: nickname.trim(),
				bio: bio.trim(),
				hourlyRateKrw: Number(hourlyRate),
				interests,
				availableWeekdays,
				region: region ?? "",
				purposeTags,
				existingPhotoUrls,
				newPhotos,
			},
			{
				onSuccess: function (): void {
					router.replace("/me");
					router.refresh();
				},
			},
		);
	}

	const totalPhotoCount = existingPhotoUrls.length + newPhotos.length;

	const isValid =
		nickname.trim().length >= 2 &&
		bio.trim().length >= 10 &&
		Number(hourlyRate) >= MIN_HOURLY_RATE_KRW &&
		interests.length > 0 &&
		availableWeekdays.length > 0 &&
		region !== null &&
		totalPhotoCount >= MIN_PARTNER_PHOTOS &&
		totalPhotoCount <= MAX_PARTNER_PHOTOS;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<section className="flex flex-col gap-2">
				<label htmlFor="nickname" className="text-sm font-medium">
					활동 닉네임
				</label>
				<Input
					id="nickname"
					value={nickname}
					onChange={function (event) {
						setNickname(event.target.value);
					}}
					required
					minLength={2}
					maxLength={12}
				/>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">출생 연도</span>
				<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-sm">
					{profile.birth_year}년생 (수정 불가)
				</p>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="bio" className="text-sm font-medium">
					자기소개
				</label>
				<textarea
					id="bio"
					value={bio}
					onChange={function (event) {
						setBio(event.target.value);
					}}
					required
					minLength={10}
					maxLength={300}
					rows={4}
					className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-4 text-base focus:outline-none"
				/>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">프로필 사진 (3~9장)</span>
				<PartnerPhotoManager
					existingUrls={existingPhotoUrls}
					onExistingUrlsChange={setExistingPhotoUrls}
					newPhotos={newPhotos}
					onNewPhotosChange={setNewPhotos}
				/>
				<p className="text-sub text-xs">최소 3장을 유지해야 저장할 수 있어요.</p>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">활동 지역</span>
				<div className="flex flex-wrap gap-2">
					{REGIONS.map(function (regionOption) {
						const selected = region === regionOption;
						return (
							<button
								key={regionOption}
								type="button"
								onClick={function () {
									setRegion(regionOption);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{regionOption}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">용도 태그 (선택, 최대 2개)</span>
				<div className="flex flex-wrap gap-2">
					{PURPOSE_TAGS.map(function (tag) {
						const selected = purposeTags.includes(tag);
						return (
							<button
								key={tag}
								type="button"
								onClick={function () {
									handlePurposeTagToggle(tag);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{tag}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">관심사 (최대 3개)</span>
				<div className="flex flex-wrap gap-2">
					{INTEREST_OPTIONS.map(function (interest) {
						const selected = interests.includes(interest);
						return (
							<button
								key={interest}
								type="button"
								onClick={function () {
									handleInterestToggle(interest);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{interest}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">가능 요일</span>
				<div className="grid grid-cols-7 gap-1.5">
					{WEEKDAY_OPTIONS.map(function (weekday) {
						const selected = availableWeekdays.includes(weekday.value);
						return (
							<button
								key={weekday.value}
								type="button"
								onClick={function () {
									handleWeekdayToggle(weekday.value);
								}}
								className={cn(
									"flex h-11 items-center justify-center rounded-xl text-sm",
									selected && "bg-brand-subtle text-primary-600 font-semibold",
									!selected && "bg-surface-alt text-sub",
								)}>
								{weekday.label}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="hourlyRate" className="text-sm font-medium">
					시간당 요금 (원)
				</label>
				<Input
					id="hourlyRate"
					type="number"
					value={hourlyRate}
					onChange={function (event) {
						setHourlyRate(event.target.value);
					}}
					required
					min={MIN_HOURLY_RATE_KRW}
					step={1000}
				/>
			</section>

			<div className="flex flex-col gap-2.5">
				{profile.is_approved && (
					<p className="bg-warning-500/15 text-warning-500 rounded-xl px-4 py-3 text-xs leading-relaxed">
						수정 사항은 저장 즉시 반영돼요. 부적절한 내용으로 변경하면 관리자 검토 후 활동이 제한될
						수 있어요.
					</p>
				)}
				{patchPartnerProfileMutation.isError && (
					<p className="text-error-500 text-sm">{patchPartnerProfileMutation.error.message}</p>
				)}
				<Button
					type="submit"
					size="lg"
					fullWidth
					disabled={!isValid || patchPartnerProfileMutation.isPending}>
					{patchPartnerProfileMutation.isPending ? "저장 중..." : "변경사항 저장"}
				</Button>
			</div>
		</form>
	);
}
