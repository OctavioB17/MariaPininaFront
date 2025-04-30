import ProductCards from "../../products/Cards/ProductCards";

export default interface ProductsCarrouselProps {
    children: React.ReactElement<typeof ProductCards>[];
    carrouselName:  string
  }