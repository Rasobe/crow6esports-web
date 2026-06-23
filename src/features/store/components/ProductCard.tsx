// features/store/components/ProductCard.tsx
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@config/routes";
import type { Product, ProductCategory } from "../types";
import "./product-card.scss";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_KEY: Record<ProductCategory, string> = {
  jersey: "category_jersey",
  hoodie: "category_hoodie",
  cap: "category_cap",
  accessory: "category_accessory",
};

export function ProductCard({ product }: Readonly<ProductCardProps>) {
  const t = useTranslations("home.productCard");
  const format = useFormatter();
  const image = product.images[0];

  return (
    <article className="product-card">
      <Link href={ROUTES.store} className="product-card__link">
        <div className="product-card__media">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="product-card__img"
            />
          ) : (
            <div className="product-card__no-image" aria-hidden="true">
              <span className="product-card__no-image-icon">?</span>
            </div>
          )}
          <div className="product-card__top">
            <span className="product-card__category">
              {t(CATEGORY_KEY[product.category])}
            </span>
            {product.featured && (
              <span className="product-card__featured">
                {t("featured_badge")}
              </span>
            )}
          </div>
        </div>

        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">
            {format.number(product.price, {
              style: "currency",
              currency: product.currency,
            })}
          </p>
        </div>
      </Link>
    </article>
  );
}
