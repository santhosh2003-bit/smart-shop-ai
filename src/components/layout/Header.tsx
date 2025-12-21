import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, User, Menu, X, History, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/stores', label: 'Stores' },
    { to: '/deals', label: 'Deals', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-2 text-sm border-b border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Delivering to</span>
            <button className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
              Downtown, New York<ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/history" className="flex items-center gap-1 hover:text-primary transition-colors"><History className="w-4 h-4" />Order History</Link>
            {user?.role === 'admin' && <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors text-accent font-medium"><Settings className="w-4 h-4" />Admin</Link>}
          </div>
        </div>
        <div className="flex items-center justify-between py-4 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl fresh-badge flex items-center justify-center"><span className="text-xl font-bold text-primary-foreground">D</span></div>
            <span className="text-xl font-bold hidden sm:block">DealFinder</span>
          </Link>
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search for products, brands, or stores..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-4 h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary" />
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (<Link key={link.to} to={link.to} className={cn('px-4 py-2 rounded-lg font-medium transition-all', location.pathname === link.to ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary', link.highlight && location.pathname !== link.to && 'text-accent')}>{link.label}</Link>))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationCenter />
            <Link to="/cart"><Button variant="ghost" size="icon" className="relative"><ShoppingCart className="w-5 h-5" />{itemCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full deal-badge text-xs font-bold flex items-center justify-center text-accent-foreground">{itemCount}</span>}</Button></Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="font-bold text-primary text-sm">{user?.name?.charAt(0)}</span></div></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5"><p className="font-medium">{user?.name}</p><p className="text-xs text-muted-foreground">{user?.email}</p></div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/history')}>Order History</DropdownMenuItem>
                  {user?.role === 'admin' && <DropdownMenuItem onClick={() => navigate('/admin')}>Admin Panel</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive"><LogOut className="w-4 h-4 mr-2" />Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (<Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Login</Button>)}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</Button>
          </div>
        </div>
        <div className="md:hidden pb-4"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-4 h-11 rounded-xl bg-secondary/50 border-0" /></div></div>
        {isMenuOpen && (<nav className="lg:hidden py-4 border-t border-border animate-slide-up"><div className="flex flex-col gap-2">{navLinks.map((link) => (<Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={cn('px-4 py-3 rounded-lg font-medium transition-all', location.pathname === link.to ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary', link.highlight && location.pathname !== link.to && 'text-accent')}>{link.label}</Link>))}<Link to="/history" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-lg font-medium hover:bg-secondary flex items-center gap-2"><History className="w-4 h-4" />Order History</Link></div></nav>)}
      </div>
    </header>
  );
};

export default Header;
