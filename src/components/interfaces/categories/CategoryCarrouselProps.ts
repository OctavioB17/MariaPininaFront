import CategoryCard from "../../Categories/CategoryCard";

export default interface CategoryCarrouselProps {
    children: React.ReactElement<typeof CategoryCard>[];
    carrouselName:  string
  }