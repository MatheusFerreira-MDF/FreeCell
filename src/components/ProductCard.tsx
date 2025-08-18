import { useState } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const totalItems = getTotalItems();
  const isWholesale = totalItems >= 20;
  const currentPrice = isWholesale ? product.wholesalePrice : product.retailPrice;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div
      className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de preço especial */}
      {isWholesale && (
        <Badge className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground">
          Preço Atacado
        </Badge>
      )}

      {/* Status do estoque */}
      <Badge 
        variant={product.inStock ? "default" : "destructive"}
        className="absolute top-3 right-3 z-10"
      >
        {product.inStock ? 'Em Estoque' : 'Esgotado'}
      </Badge>

      {/* Container da imagem */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Overlay com ações rápidas */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <Button size="sm" variant="secondary" className="rounded-full p-2">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full p-2">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Preços */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(currentPrice)}
            </span>
            {isWholesale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.retailPrice)}
              </span>
            )}
          </div>
          
          {!isWholesale && totalItems > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Preço atacado: {formatPrice(product.wholesalePrice)} (20+ itens)
            </p>
          )}
        </div>

        {/* Botão de adicionar ao carrinho */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full transition-all duration-300 hover:scale-105"
          variant={isHovered ? "default" : "outline"}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
        </Button>
      </div>
    </div>
  );
};