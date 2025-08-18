import { useState, useMemo } from 'react';
import { allProducts } from '@/data/products';
import { Product } from '@/types/product';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';

const PRODUCTS_PER_PAGE = 20;

const Index = () => {
  const [currentCategory, setCurrentCategory] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar produtos por categoria e busca
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filtrar por categoria
    if (currentCategory !== 'todos') {
      filtered = filtered.filter(product => product.category === currentCategory);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [currentCategory, searchQuery]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handlers
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Reset para primeira página
    setSearchQuery(''); // Limpar busca ao trocar categoria
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset para primeira página
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          currentCategory={currentCategory}
        />
        
        <main className="container mx-auto px-4 py-8">
          <ProductGrid
            products={currentProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            category={currentCategory}
          />
        </main>

        {/* Footer */}
        <footer className="bg-muted/30 py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2025 Matheus Ferreira. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Preços promocionais válidos por tempo limitado!
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default Index;
