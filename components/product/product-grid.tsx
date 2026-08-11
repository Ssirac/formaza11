import { RevealStagger, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "./product-card";
import type { ProductDTO } from "@/lib/types";

export function ProductGrid({
  products,
  whatsappNumber,
}: {
  products: ProductDTO[];
  whatsappNumber: string;
}) {
  return (
    <RevealStagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {products.map((p) => (
        <RevealItem key={p.id}>
          <ProductCard product={p} whatsappNumber={whatsappNumber} />
        </RevealItem>
      ))}
    </RevealStagger>
  );
}
