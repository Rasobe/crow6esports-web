import Image from "next/image";
import "./coming-soon.scss";

export function ComingSoonPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__inner">
        <Image
          src="/images/brand/crow6-wordmark.svg"
          alt="Crow 6 Esports"
          width={200}
          height={70}
          priority
        />
        <span className="coming-soon__eyebrow">Estamos preparando algo</span>
        <h1 className="coming-soon__title">Próximamente</h1>
        <p className="coming-soon__description">
          Estamos trabajando en una nueva experiencia para Crow 6 Esports. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
