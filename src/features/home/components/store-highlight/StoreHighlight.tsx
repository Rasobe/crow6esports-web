"use client";

import { getProducts, ProductCard } from "@/features/store";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";
import "./store-highlight.scss";

const products = getProducts();

export function StoreHighlight() {
  const t = useTranslations("home.storeHighlight");

  return (
    <section className="store-highlight">
      <div className="store-highlight__inner">
        <SectionHeader namespace="home.storeHighlight" />

        <div className="store-highlight__grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="store-highlight__footer">
          <Button href={ROUTES.store} variant="outline">
            {t("cta_view_more")}
          </Button>
        </div>
      </div>
    </section>
  );
}
