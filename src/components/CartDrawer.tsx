import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CustomerInfo } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { state, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    neighborhood: '',
    city: ''
  });

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const isWholesale = totalItems >= 20;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleQuantityChange = (id: string, change: number) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar.",
        variant: "destructive"
      });
      return;
    }
    setShowCheckout(true);
  };

  const handleSendToWhatsApp = () => {
    if (!customerInfo.name || !customerInfo.neighborhood || !customerInfo.city) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Criar mensagem para WhatsApp
    let message = `🛒 *NOVO PEDIDO*\n\n`;
    message += `👤 *Cliente:* ${customerInfo.name}\n`;
    message += `📍 *Bairro:* ${customerInfo.neighborhood}\n`;
    message += `🏙️ *Cidade:* ${customerInfo.city}\n\n`;
    
    message += `📦 *Produtos:*\n`;
    state.items.forEach((item) => {
      const price = isWholesale ? item.wholesalePrice : item.retailPrice;
      message += `• ${item.name}\n`;
      message += `  Qtd: ${item.quantity} x ${formatPrice(price)} = ${formatPrice(price * item.quantity)}\n\n`;
    });

    message += `💰 *Total: ${formatPrice(totalPrice)}*\n`;
    if (isWholesale) {
      message += `🏷️ *Preço Atacado Aplicado* (${totalItems} itens)\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho e fechar
    clearCart();
    setShowCheckout(false);
    onClose();
    
    toast({
      title: "Pedido enviado!",
      description: "Seu pedido foi enviado via WhatsApp.",
    });
  };

  if (showCheckout) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Finalizar Pedido
            </SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Resumo do pedido */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total de itens:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo de preço:</span>
                  <Badge variant={isWholesale ? "default" : "secondary"}>
                    {isWholesale ? "Atacado" : "Varejo"}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Formulário de informações */}
            <div className="space-y-4">
              <h3 className="font-semibold">Suas Informações</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={customerInfo.neighborhood}
                  onChange={(e) => setCustomerInfo({...customerInfo, neighborhood: e.target.value})}
                  placeholder="Digite seu bairro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                  placeholder="Digite sua cidade"
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button 
                onClick={handleSendToWhatsApp}
                className="w-full"
                size="lg"
              >
                📱 Enviar Pedido via WhatsApp
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="w-full"
              >
                Voltar ao Carrinho
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho de Compras
            {totalItems > 0 && (
              <Badge>{totalItems} {totalItems === 1 ? 'item' : 'itens'}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 max-h-[70vh] overflow-y-auto">
            {state.items.length === 0 ? (
          <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione produtos para começar suas compras
              </p>
            </div>
          ) : (
            <>
              {/* Lista de produtos */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => {
                  const currentPrice = isWholesale ? item.wholesalePrice : item.retailPrice;
                  return (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-2 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-primary font-semibold">
                          {formatPrice(currentPrice)}
                        </p>
                        
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
                    {/* Resumo de preços */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  {isWholesale && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço Atacado Aplicado:</span>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {totalItems} itens
                      </Badge>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  {!isWholesale && totalItems > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Adicione {20 - totalItems} itens para preço atacado
                    </p>
                  )}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3">
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Finalizar Pedido
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full"
                >
                  Limpar Carrinho
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};