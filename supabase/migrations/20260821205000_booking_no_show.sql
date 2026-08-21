-- supabase/migrations/20260821205000_booking_no_show.sql
-- 노쇼 상태 추가 (리서치 발굴: no_show 개념이 없어 파트너가 고객 노쇼를 "완료"로
-- 위장 처리해야만 보상받는 구조 — 통계·후기 무결성 오염 + 반복 노쇼 추적 불가).
--
-- 1단계 범위: 상태값 + 전이 규칙 + 후기 자격 차단(기존 정책이 completed만 허용해
-- 자동 충족) + 이력 집계 가능화까지. 노쇼 시 파트너 보상(위약금)과 반복 노쇼 페널티는
-- 사장님 결정 대기 — 이 마이그레이션에 포함하지 않는다.
--
-- 유예 시간 1시간: 코이카노 노쇼 규정(연락 두절 30분 / 연락되나 미출석 1시간) 중
-- 보수적인 쪽. 사장님 정책 확정 시 조정 가능.
-- 주의: 새 enum 값은 같은 트랜잭션 안에서 "사용"할 수 없다(PG 제약) — 이 파일에서는
-- 트리거 함수 본문(실행 시점 파싱)에만 등장하므로 안전하다. 리허설도 push 이후 수행.

alter type public.booking_status add value 'no_show';

create or replace function public.enforce_booking_status_transition() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if auth.uid() is null or public.is_admin() then
		return new;
	end if;

	if new.customer_id <> old.customer_id
		or new.partner_id <> old.partner_id
		or new.starts_at <> old.starts_at
		or new.ends_at <> old.ends_at
		or new.place <> old.place
		or new.total_amount_krw <> old.total_amount_krw then
		raise exception '예약 정보는 변경할 수 없습니다.';
	end if;

	if new.status = old.status then
		return new;
	end if;

	if old.status = 'requested' and new.status in ('accepted', 'rejected') then
		if old.partner_id <> auth.uid() then
			raise exception '파트너만 예약을 수락·거절할 수 있습니다.';
		end if;
		-- 20260820130143의 오버랩 사전 조회 유지 — EXCLUDE 제약이 최종 방어선이고,
		-- 이 블록은 단일 요청 기준으로 먼저 걸려 친절한 메시지를 준다.
		-- (create or replace가 중간 버전을 덮어쓰지 않도록 리뷰에서 복원됨)
		if new.status = 'accepted' and exists (
			select 1 from public.bookings b
			where b.partner_id = old.partner_id
				and b.id <> old.id
				and b.status = 'accepted'
				and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(old.starts_at, old.ends_at, '[)')
		) then
			raise exception '이미 확정된 예약과 시간이 겹쳐요.';
		end if;
		return new;
	end if;

	if old.status in ('requested', 'accepted') and new.status = 'canceled' then
		if old.customer_id <> auth.uid() then
			raise exception '고객만 예약을 취소할 수 있습니다.';
		end if;
		return new;
	end if;

	if old.status = 'accepted' and new.status = 'completed' then
		if old.partner_id <> auth.uid() then
			raise exception '파트너만 완료 처리할 수 있습니다.';
		end if;
		if now() < old.starts_at then
			raise exception '데이트 시작 전에는 완료 처리할 수 없습니다.';
		end if;
		return new;
	end if;

	if old.status = 'accepted' and new.status = 'no_show' then
		if old.partner_id <> auth.uid() then
			raise exception '파트너만 노쇼 처리할 수 있습니다.';
		end if;
		if now() < old.starts_at + interval '1 hour' then
			raise exception '노쇼 처리는 데이트 시작 1시간 이후부터 할 수 있습니다.';
		end if;
		return new;
	end if;

	raise exception '허용되지 않는 예약 상태 변경입니다. (% → %)', old.status, new.status;
end;
$$;

-- 반복 노쇼 집계용 (고객별 노쇼 이력 조회)
create index bookings_customer_no_show_idx on public.bookings (customer_id)
	where status = 'no_show';
