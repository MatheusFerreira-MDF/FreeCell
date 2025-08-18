import { useState } from 'react';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartDrawer } from './CartDrawer';

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  currentCategory: string;
}

export const Header = ({ onCategoryChange, onSearch, currentCategory }: HeaderProps) => {
  const { getTotalItems, getTotalPrice } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalItems = getTotalItems();
  const isWholesale = totalItems >= 20;

  const categories = [
    { id: 'todos', name: 'Todos os Produtos', color: 'bg-primary' },
    { id: 'eletronicos', name: 'Eletrônicos', color: 'bg-primary' },
    { id: 'utilidades', name: 'Utilidades', color: 'bg-secondary' },
    { id: 'controle-remoto', name: 'Controle Remoto', color: 'bg-accent' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FreeCell Express
            </h1>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex space-x-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={currentCategory === category.id ? "default" : "ghost"}
                onClick={() => onCategoryChange(category.id)}
                className="transition-all duration-300 hover:scale-105"
              >
                {category.name}
              </Button>
            ))}
          </nav>

          {/* Barra de Pesquisa */}
          <form 
            onSubmit={handleSearch} 
            className="flex flex-1 max-w-full sm:max-w-md mx-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>


          {/* Carrinho e Menu Mobile */}
          <div className="flex items-center space-x-4">
            {/* Indicador de preço */}
            {isWholesale && (
              <Badge className="hidden sm:inline-flex bg-secondary text-secondary-foreground">
                Preço Atacado Ativo
              </Badge>
            )}

            {/* Botão do Carrinho */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
              <span className="hidden sm:ml-2 sm:inline">
                {formatPrice(getTotalPrice())}
              </span>
            </Button>

            {/* Menu Mobile */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4">Menu</h2>
                  
                  {/* Pesquisa Mobile */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Categorias Mobile */}
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={currentCategory === category.id ? "default" : "ghost"}
                        onClick={() => {
                          onCategoryChange(category.id);
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Carrinho Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};