-- supabase/migrations/20260821203100_reports_self_cancel.sql
-- 신고자 본인이 접수(open) 상태인 자기 신고를 취소할 수 있게 한다.
-- 기존에는 reports_update_admin만 있어 본인은 update 자체가 불가능했다.
-- RLS(using + with check 둘 다 reporter 본인)와 트리거를 이중으로 걸어서,
-- open→canceled 전환 외에는 (다른 컬럼 변경 포함) 허용하지 않는다.
-- admin의 기존 처리(조치 완료/기각, admin_note 기입)는 이 트리거를 그냥 통과한다.

create policy "reports_update_own_cancel" on public.reports
	for update
	using (reporter_id = auth.uid())
	with check (reporter_id = auth.uid());

create function public.enforce_report_self_cancel() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.is_admin() then
		return new;
	end if;

	if old.status <> 'open' or new.status <> 'canceled' then
		raise exception '접수된 신고만 취소할 수 있어요.';
	end if;

	if new.reporter_id <> old.reporter_id
		or new.target_id <> old.target_id
		or new.booking_id is distinct from old.booking_id
		or new.reason <> old.reason
		or new.admin_note is distinct from old.admin_note
		or new.created_at <> old.created_at
	then
		raise exception '신고 취소 외에는 변경할 수 없어요.';
	end if;

	return new;
end;
$$;

create trigger reports_enforce_self_cancel
	before update on public.reports
	for each row execute function public.enforce_report_self_cancel();
