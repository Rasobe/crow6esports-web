import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function FooterBrand() {
    const t = await getTranslations("footer");

    return (
        <div className="flex flex-col gap-4 max-w-65">
            <Image
                src="/images/brand/crow6-mascot-full.svg"
                alt="Crow6 mascot"
                width={72}
                height={72}
            />
            <div className="flex flex-col">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {t("brand_description")}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {t("founded")}
                </p>
            </div>
        </div>
    );
}