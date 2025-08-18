import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  category: string;
}

const PRODUCTS_PER_PAGE = 20;

export const ProductGrid = ({ 
  products, 
  currentPage, 
  totalPages, 
  onPageChange,
  category 
}: ProductGridProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    
    setIsLoading(true);
    // Simular delay de carregamento para UX suave
    await new Promise(resolve => setTimeout(resolve, 300));
    onPageChange(page);
    setIsLoading(false);
    
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryNames = {
    'todos': 'Todos os Produtos',
    'eletronicos': 'Eletrônicos',
    'utilidades': 'Utilidades',
    'controle-remoto': 'Controle Remoto'
  };

  return (
    <div className="space-y-8">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {categoryNames[category as keyof typeof categoryNames] || 'Produtos'}
          </h2>
          <p className="text-muted-foreground">
            {products.length} produtos encontrados
          </p>
        </div>
        
        <Badge variant="outline" className="text-sm">
          Página {currentPage} de {totalPages}
        </Badge>
      </div>

      {/* Grid de produtos */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
        isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading estado */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-8">
          {/* Botão anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          {/* Números das páginas */}
          <div className="flex space-x-1">
            {/* Primeira página */}
            {currentPage > 3 && (
              <>
                <Button
                  variant={1 === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={isLoading}
                >
                  1
                </Button>
                {currentPage > 4 && (
                  <span className="flex items-center px-2 text-muted-foreground">...</span>
                )}
              </>
            )}

            {/* Páginas próximas à atual */}
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNumber > totalPages) return null;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                  >
                    {pageNumber}
                  </Button>
                );
              }
            ).filter(Boolean)}

            {/* Última página */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="flex items-center px-2 text-muted-foreground">...</span>
                )}
                <Button
                  variant={totalPages === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={isLoading}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          {/* Botão próximo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Informação da paginação */}
      <div className="text-center text-sm text-muted-foreground">
        Mostrando {Math.min(products.length, PRODUCTS_PER_PAGE)} de {products.length} produtos
      </div>
    </div>
  );
};