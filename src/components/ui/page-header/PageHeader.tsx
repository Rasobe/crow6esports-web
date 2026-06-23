import "./page-header.scss";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="page-header" data-title={title}>
      <div className="page-header__inner">
        {eyebrow && (
          <span className="page-header__eyebrow">{eyebrow}</span>
        )}
        <h1 className="page-header__title">{title}</h1>
        {description && (
          <p className="page-header__description">{description}</p>
        )}
      </div>
    </div>
  );
}