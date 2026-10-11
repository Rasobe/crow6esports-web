import { createContentArticleRepository } from "./news/article.content-repository";
import { createJsonProductRepository } from "./store/product.json-repository";
import { createJsonPlayerRepository } from "./team/player.json-repository";

export const container = {
  playerRepository: createJsonPlayerRepository(),
  productRepository: createJsonProductRepository(),
  articleRepository: createContentArticleRepository(),
};
