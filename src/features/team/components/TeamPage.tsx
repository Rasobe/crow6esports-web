"use client";

import { PageHeader } from "@/components/ui";
import { getActivePlayers, getSubstitutePlayers, getStaffMembers } from "@/lib";
import { useTranslations } from "next-intl";
import { RosterSection } from "./roster-section";
import { TeamCTA } from "./team-cta";

export function TeamPage() {
    const t = useTranslations("team");

    const activePlayers = getActivePlayers();
    const substitutePlayers = getSubstitutePlayers();
    const staffMembers = getStaffMembers();

    return (
        <>
            <PageHeader
                eyebrow={t("eyebrow")}
                title={t("meta.title")}
                description={t("meta.description")}
            />

            <RosterSection title={t("sections.active")} players={activePlayers} />
            <RosterSection title={t("sections.substitutes")} players={substitutePlayers} />
            <RosterSection title={t("sections.staff")} players={staffMembers} />

            <TeamCTA />
        </>
    )
}