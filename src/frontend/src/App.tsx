import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Banknote,
  ChevronUp,
  ClipboardCopy,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Snowflake,
  Star,
  Trash2,
  Twitter,
  Wallet,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Cart Context ──────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  name: string;
}

interface CartEntry {
  item: CartItem;
  qty: number;
}

interface CartCtx {
  entries: CartEntry[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

const CartContext = createContext<CartCtx | null>(null);

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const add = (item: CartItem) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing)
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e,
        );
      return [...prev, { item, qty: 1 }];
    });
    setCartOpen(true);
    toast.success(`${item.name} added to cart!`);
  };

  const remove = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.item.id !== id));

  const setQty = (id: string, qty: number) => {
    if (qty < 1) {
      remove(id);
      return;
    }
    setEntries((prev) =>
      prev.map((e) => (e.item.id === id ? { ...e, qty } : e)),
    );
  };

  const clear = () => setEntries([]);

  return (
    <CartContext.Provider
      value={{ entries, add, remove, setQty, clear, cartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer() {
  const { entries, remove, setQty, clear, cartOpen, setCartOpen } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  const totalItems = entries.reduce((s, e) => s + e.qty, 0);

  const sendViaWhatsApp = () => {
    if (entries.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    const lines = entries.map((e) => `- ${e.item.name} x${e.qty}`).join("\n");
    const msg = `🛒 Cart Order - Cool Refrigeration\nItems:\n${lines}\nTotal Items: ${totalItems}\nPlease call me for pricing and details.`;
    window.open(
      `https://wa.me/918276938625?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    clear();
    setCartOpen(false);
    toast.success("WhatsApp opened with your cart details!");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "oklch(0 0 0 / 0.6)" }}
            onClick={() => setCartOpen(false)}
            data-ocid="cart.modal"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col"
            style={{
              background: "oklch(0.13 0.05 250)",
              borderLeft: "1px solid oklch(0.55 0.18 230 / 0.25)",
              boxShadow: "-10px 0 60px oklch(0 0 0 / 0.6)",
            }}
            data-ocid="cart.panel"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "oklch(0.55 0.18 230 / 0.2)" }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart
                  className="w-5 h-5"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
                <h2
                  className="font-bold text-base uppercase tracking-wider text-white"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: "oklch(0.55 0.18 230)",
                      color: "white",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: "oklch(0.65 0.04 250)" }}
                data-ocid="cart.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1 px-6 py-4">
              {entries.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-40 gap-3"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingCart
                    className="w-12 h-12 opacity-20"
                    style={{ color: "oklch(0.75 0.14 220)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.5 0.04 250)" }}
                  >
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {entries.map((e, idx) => (
                    <div
                      key={e.item.id}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: "oklch(0.10 0.04 250)",
                        border: "1px solid oklch(0.55 0.18 230 / 0.15)",
                      }}
                      data-ocid={`cart.item.${idx + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">
                          {e.item.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "oklch(0.75 0.14 220)" }}
                        >
                          Call for Price
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(e.item.id, e.qty - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: "oklch(0.18 0.05 250)",
                            border: "1px solid oklch(0.55 0.18 230 / 0.3)",
                            color: "oklch(0.75 0.14 220)",
                          }}
                          data-ocid={`cart.toggle.${idx + 1}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">
                          {e.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(e.item.id, e.qty + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: "oklch(0.18 0.05 250)",
                            border: "1px solid oklch(0.55 0.18 230 / 0.3)",
                            color: "oklch(0.75 0.14 220)",
                          }}
                          data-ocid={`cart.toggle.${idx + 1}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(e.item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center ml-1 transition-all"
                          style={{
                            background: "oklch(0.25 0.08 20 / 0.3)",
                            border: "1px solid oklch(0.55 0.15 20 / 0.3)",
                            color: "oklch(0.65 0.15 20)",
                          }}
                          data-ocid={`cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {entries.length > 0 && (
              <div
                className="px-6 py-5 border-t flex flex-col gap-3"
                style={{ borderColor: "oklch(0.55 0.18 230 / 0.2)" }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.72 0.04 250)" }}
                  >
                    Total Items
                  </span>
                  <span className="font-bold text-white">{totalItems}</span>
                </div>
                <p className="text-xs" style={{ color: "oklch(0.5 0.04 250)" }}>
                  Pricing on request — we'll call to confirm.
                </p>
                <Button
                  type="button"
                  onClick={sendViaWhatsApp}
                  className="w-full uppercase text-xs font-bold tracking-wider gap-2 glow-btn"
                  style={{
                    background: "oklch(0.45 0.15 145)",
                    color: "white",
                    boxShadow: "0 0 20px oklch(0.45 0.15 145 / 0.5)",
                  }}
                  data-ocid="cart.primary_button"
                >
                  <MessageCircle className="w-4 h-4" />
                  Request Quote via WhatsApp
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "SERVICES", href: "#services" },
  { label: "PRODUCTS", href: "#products" },
  { label: "OWNER", href: "#owner" },
  { label: "MAINTENANCE", href: "#maintenance" },
  { label: "TESTIMONIALS", href: "#testimonials" },
  { label: "ORDER", href: "#order" },
  { label: "PAYMENT", href: "#payment" },
  { label: "CONTACT", href: "#contact" },
];

const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Header ───────────────────────────────────────────────────────────────────
function CartIconButton() {
  const { entries, setCartOpen } = useCart();
  const totalItems = entries.reduce((s, e) => s + e.qty, 0);
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="relative p-2 rounded-lg transition-all"
      style={{ color: "oklch(0.75 0.14 220)" }}
      aria-label="Open cart"
      data-ocid="cart.open_modal_button"
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: "oklch(0.55 0.18 230)", color: "white" }}
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b" : "backdrop-blur-md"
      }`}
      style={{
        background: scrolled
          ? "oklch(0.12 0.04 250 / 0.95)"
          : "oklch(0.12 0.04 250 / 0.7)",
        borderColor: "oklch(0.55 0.18 230 / 0.15)",
        boxShadow: scrolled ? "0 4px 30px oklch(0 0 0 / 0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <button
          type="button"
          onClick={() => handleNav("#home")}
          className="flex items-center gap-2 group"
          data-ocid="header.link"
        >
          <img
            src="/assets/uploads/screenshot_20250326_050441_contacts-019d3b0c-4668-7165-b8d6-ba06ce98f43d-1.jpg"
            alt="Cool Refrigeration Logo"
            className="h-10 w-auto object-contain"
          />
        </button>

        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => handleNav(l.href)}
              className="text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ color: "oklch(0.72 0.04 250)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.75 0.14 220)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.72 0.04 250)";
              }}
              data-ocid="nav.link"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartIconButton />
          <Button
            type="button"
            onClick={() => handleNav("#order")}
            className="hidden sm:flex uppercase text-xs font-bold tracking-wider glow-btn transition-all duration-300"
            style={{
              background: "oklch(0.55 0.18 230)",
              color: "white",
              boxShadow: "0 0 20px oklch(0.55 0.18 230 / 0.5)",
            }}
            data-ocid="header.primary_button"
          >
            ORDER NOW
          </Button>
          <button
            type="button"
            className="lg:hidden p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: "oklch(0.75 0.14 220)" }}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden backdrop-blur-xl border-t px-4 pb-4 pt-2 flex flex-col gap-3"
            style={{
              background: "oklch(0.14 0.04 250 / 0.98)",
              borderColor: "oklch(0.55 0.18 230 / 0.2)",
            }}
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                type="button"
                onClick={() => handleNav(l.href)}
                className="text-sm font-semibold uppercase tracking-wider text-left py-1 transition-colors"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                {l.label}
              </button>
            ))}
            <Button
              type="button"
              onClick={() => handleNav("#order")}
              className="uppercase text-xs font-bold tracking-wider w-full mt-1 glow-btn"
              style={{ background: "oklch(0.55 0.18 230)", color: "white" }}
            >
              ORDER NOW
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const FROST_POSITIONS = [
  { id: "f1", top: "12%", left: "8%", size: 24, delay: 0, opacity: 0.15 },
  { id: "f2", top: "25%", right: "5%", size: 18, delay: 0.8, opacity: 0.12 },
  { id: "f3", top: "60%", left: "3%", size: 30, delay: 1.5, opacity: 0.1 },
  { id: "f4", bottom: "20%", right: "8%", size: 22, delay: 0.4, opacity: 0.13 },
  { id: "f5", top: "40%", right: "18%", size: 16, delay: 1.2, opacity: 0.1 },
  { id: "f6", top: "70%", left: "15%", size: 20, delay: 0.6, opacity: 0.11 },
] as const;

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "64px" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1400x700.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.05 250 / 0.97) 0%, oklch(0.12 0.05 240 / 0.9) 50%, oklch(0.10 0.06 235 / 0.75) 100%)",
        }}
      />
      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{ background: "oklch(0.55 0.18 230 / 0.08)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{
          background: "oklch(0.75 0.14 220 / 0.06)",
          animationDelay: "1.5s",
        }}
      />
      {/* Floating snowflakes */}
      {FROST_POSITIONS.map((pos) => (
        <div
          key={pos.id}
          className="absolute pointer-events-none animate-float"
          style={{
            top: "top" in pos ? pos.top : undefined,
            bottom: "bottom" in pos ? pos.bottom : undefined,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            animationDelay: `${pos.delay}s`,
            animationDuration: `${3.5 + FROST_POSITIONS.indexOf(pos) * 0.5}s`,
          }}
        >
          <Snowflake
            style={{
              width: pos.size,
              height: pos.size,
              color: `oklch(0.75 0.14 220 / ${pos.opacity})`,
            }}
          />
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs font-bold uppercase tracking-[0.3em] mb-5 flex items-center gap-2"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            <span
              className="w-8 h-px inline-block"
              style={{ background: "oklch(0.75 0.14 220)" }}
            />
            Trusted Refrigeration Experts In Kolkata
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Keeping Your
            <br />
            Business{" "}
            <span
              className="glow-text"
              style={{ color: "oklch(0.75 0.14 220)" }}
            >
              Ice Cold
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base mb-10 leading-relaxed"
            style={{ color: "oklch(0.78 0.04 250)" }}
          >
            Kolkata's premier AC installation, servicing &amp; fridge repair
            specialists. Trusted by restaurants, homeowners &amp; hotels — 24/7
            emergency service available.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => scrollTo("#services")}
              className="uppercase text-xs font-bold tracking-wider transition-all duration-300 bg-transparent"
              style={{
                borderColor: "oklch(0.75 0.14 220 / 0.5)",
                color: "oklch(0.75 0.14 220)",
              }}
              data-ocid="hero.secondary_button"
            >
              OUR SERVICES
            </Button>
            <Button
              type="button"
              onClick={() => scrollTo("#order")}
              className="uppercase text-xs font-bold tracking-wider glow-btn transition-all duration-300"
              style={{
                background: "oklch(0.55 0.18 230)",
                color: "white",
                boxShadow: "0 0 25px oklch(0.55 0.18 230 / 0.6)",
              }}
              data-ocid="hero.primary_button"
            >
              PLACE AN ORDER
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-16 flex flex-wrap gap-10"
          >
            {[
              { val: "500+", label: "Happy Clients" },
              { val: "10+", label: "Years Experience" },
              { val: "24/7", label: "Emergency Service" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-3xl font-bold glow-text"
                  style={{
                    color: "oklch(0.75 0.14 220)",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  {stat.val}
                </p>
                <p
                  className="text-xs uppercase tracking-widest mt-1"
                  style={{ color: "oklch(0.6 0.04 250)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: Snowflake,
    title: "AC Installation",
    desc: "Professional installation of window AC units for homes, restaurants, and hotels. Energy-efficient solutions to keep your space cool and comfortable.",
  },
  {
    icon: Snowflake,
    title: "AC Service",
    desc: "Expert AC servicing and maintenance to ensure peak performance. We service all major brands for home owners, restaurants, and hotels across Kolkata.",
  },
  {
    icon: Wrench,
    title: "Fridge Repair",
    desc: "Fast and reliable fridge repair for single door, double door, and commercial refrigerators. Serving home owners, restaurants, and hotels in Kolkata.",
  },
];

function Services() {
  return (
    <section
      id="services"
      className="py-24"
      style={{ background: "oklch(0.14 0.045 252)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            What We Offer
          </p>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            AC installation, AC service &amp; fridge repair for homes,
            restaurants, and hotels across Kolkata.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center text-center group transition-all duration-300"
              style={{ boxShadow: "0 4px 30px oklch(0 0 0 / 0.3)" }}
              data-ocid={`services.item.${i + 1}`}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
                style={{
                  background: "oklch(0.55 0.18 230 / 0.15)",
                  border: "1px solid oklch(0.55 0.18 230 / 0.3)",
                }}
              >
                <s.icon
                  className="w-8 h-8"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
              </div>
              <h3
                className="font-bold text-base uppercase tracking-wider mb-3 text-white"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Owner Section ────────────────────────────────────────────────────────────
function OwnerSection() {
  return (
    <section
      id="owner"
      className="py-24"
      style={{ background: "oklch(0.12 0.04 250)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-10 flex flex-col md:flex-row items-center gap-12"
          style={{ boxShadow: "0 8px 40px oklch(0 0 0 / 0.4)" }}
        >
          <div className="flex-shrink-0 relative">
            <div
              className="absolute inset-0 rounded-full blur-md"
              style={{
                background: "oklch(0.55 0.18 230 / 0.4)",
                margin: "-6px",
              }}
            />
            <img
              src="/assets/uploads/img_20250905_120713_792-019d3b06-92ed-728c-9d5c-849f159f79c2-2.webp"
              alt="Owner of Cool Refrigeration"
              className="relative w-52 h-52 object-cover rounded-full"
              style={{
                border: "3px solid oklch(0.75 0.14 220)",
                boxShadow:
                  "0 0 30px oklch(0.55 0.18 230 / 0.6), 0 0 60px oklch(0.55 0.18 230 / 0.3)",
              }}
            />
          </div>
          <div className="text-center md:text-left">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: "oklch(0.75 0.14 220)" }}
            >
              Meet the Owner
            </p>
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Proprietor,{" "}
              <span style={{ color: "oklch(0.75 0.14 220)" }}>
                Cool Refrigeration
              </span>
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "oklch(0.72 0.04 250)" }}
            >
              Serving Kolkata with quality AC installation, AC service, and
              refrigeration repairs for years. Trusted by restaurants,
              homeowners, and hotels across the city.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: "Window AC Unit",
    img: "/assets/generated/product-window-ac.dim_400x400.jpg",
    desc: "Energy-efficient window air conditioners for homes, offices, and small commercial spaces. Easy installation.",
  },
  {
    name: "Split AC",
    img: "/assets/generated/product-split-ac.dim_400x400.jpg",
    desc: "High-performance split air conditioners for homes, hotels, and restaurants. Quiet operation with superior cooling.",
  },
  {
    name: "Fridge Single Door",
    img: "/assets/generated/product-fridge-single.dim_400x400.jpg",
    desc: "Reliable single door refrigerators for homes and small kitchens. Energy-saving models from all major brands.",
  },
  {
    name: "Fridge Double Door",
    img: "/assets/generated/product-fridge-double.dim_400x400.jpg",
    desc: "Spacious double door refrigerators ideal for families, restaurants, and hotels. Frost-free with modern features.",
  },
];

function AddToCartButton({
  product,
  index,
}: { product: { name: string }; index: number }) {
  const { add } = useCart();
  const id = product.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => add({ id, name: product.name })}
        className="flex-1 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all glow-btn"
        style={{
          background: "oklch(0.55 0.18 230 / 0.15)",
          border: "1px solid oklch(0.55 0.18 230 / 0.4)",
          color: "oklch(0.75 0.14 220)",
        }}
        data-ocid={`products.button.${index + 1}`}
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Add to Cart
      </button>
    </div>
  );
}

function Products() {
  return (
    <section
      id="products"
      className="py-24"
      style={{ background: "oklch(0.14 0.045 252)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            What We Work With
          </p>
          <h2 className="section-title">Product Showcase</h2>
          <p className="section-subtitle">
            Industry-leading cooling equipment for every need.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group transition-all duration-300"
              style={{ boxShadow: "0 4px 30px oklch(0 0 0 / 0.3)" }}
              data-ocid={`products.item.${i + 1}`}
            >
              <div
                className="aspect-square overflow-hidden"
                style={{ background: "oklch(0.10 0.04 250)" }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3
                  className="font-bold text-sm uppercase tracking-wide mb-2 text-white"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {p.name}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: "oklch(0.65 0.04 250)" }}
                >
                  {p.desc}
                </p>
                <AddToCartButton product={p} index={i} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Maintenance Band ─────────────────────────────────────────────────────────
function MaintenanceBand() {
  return (
    <section
      id="maintenance"
      className="py-20 text-white text-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.35 0.18 240) 0%, oklch(0.25 0.20 230) 50%, oklch(0.30 0.16 245) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.18 230 / 0.2) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "oklch(1 0 0 / 0.1)",
              border: "1px solid oklch(1 0 0 / 0.2)",
            }}
          >
            <Zap className="w-8 h-8" />
          </div>
          <h2
            className="text-3xl font-bold uppercase tracking-widest mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            24/7 Emergency Service
          </h2>
          <p className="text-base opacity-90 mb-8 leading-relaxed">
            Equipment failure doesn't follow a 9-to-5 schedule. Our certified
            technicians are on call around the clock to restore your systems
            fast — minimizing downtime.
          </p>
          <Button
            type="button"
            onClick={() => scrollTo("#order")}
            variant="outline"
            className="uppercase text-xs font-bold tracking-wider border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all duration-300"
            data-ocid="maintenance.primary_button"
          >
            Book Emergency Service
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Owner, Spice Garden Restaurant, Kolkata",
    quote:
      "Cool Refrigeration installed our AC units in no time. The cooling is perfect and the team was very professional throughout.",
  },
  {
    name: "Priya Sharma",
    role: "Home Owner, Picnic Garden, Kolkata",
    quote:
      "When our fridge stopped working, they sent a technician the same day. Quick, affordable, and reliable service.",
  },
  {
    name: "Amit Das",
    role: "Manager, Hotel Sunrise, Tiljala",
    quote:
      "Their AC service has kept our hotel rooms comfortable all year round. Highly recommend them to any hotel in Kolkata.",
  },
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24"
      style={{ background: "oklch(0.12 0.04 250)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            Client Reviews
          </p>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Trusted by restaurants, home owners, and hotels across Kolkata.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card rounded-2xl p-8 relative group transition-all duration-300"
              style={{ boxShadow: "0 4px 30px oklch(0 0 0 / 0.3)" }}
              data-ocid={`testimonials.item.${i + 1}`}
            >
              <div
                className="text-6xl font-serif leading-none mb-2 -mt-2"
                style={{ color: "oklch(0.55 0.18 230 / 0.3)" }}
              >
                ""
              </div>
              <div className="flex gap-1 mb-4">
                {STAR_KEYS.map((k) => (
                  <Star
                    key={k}
                    className="w-4 h-4 fill-current"
                    style={{ color: "oklch(0.85 0.15 90)" }}
                  />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-6 italic"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                "{t.quote}"
              </p>
              <div
                className="border-t pt-4"
                style={{ borderColor: "oklch(0.55 0.18 230 / 0.15)" }}
              >
                <p
                  className="font-bold text-sm text-white"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                >
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Customer Reviews ─────────────────────────────────────────────────────────
interface Review {
  id: number;
  name: string;
  rating: number;
  message: string;
  date: string;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Suresh Mondal",
    rating: 5,
    message:
      "Excellent service! My Split AC was installed within a day. Very professional team and clean work. Highly recommended for anyone in Kolkata.",
    date: "March 2026",
  },
  {
    id: 2,
    name: "Meena Ghosh",
    rating: 5,
    message:
      "My fridge stopped cooling and they fixed it the same day I called. Very reasonable price and friendly technician. Will definitely call again.",
    date: "February 2026",
  },
  {
    id: 3,
    name: "Tapas Roy",
    rating: 4,
    message:
      "Good service for AC servicing. They were on time and did a thorough job. The AC is running much better now. Good value for money.",
    date: "January 2026",
  },
];

const STAR_KEYS_REVIEW = [1, 2, 3, 4, 5];

function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const now = new Date();
    const date = now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    setReviews((prev) => [
      {
        id: Date.now(),
        name: form.name,
        rating: form.rating,
        message: form.message,
        date,
      },
      ...prev,
    ]);
    setForm({ name: "", rating: 5, message: "" });
    setSubmitting(false);
    toast.success("Thank you for your review!");
  };

  const inputStyle = {
    background: "oklch(0.10 0.04 250)",
    borderColor: "oklch(0.28 0.06 250)",
    color: "white",
  };

  return (
    <section
      id="reviews"
      className="py-24"
      style={{ background: "oklch(0.14 0.045 252)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            Customer Feedback
          </p>
          <h2 className="section-title">Customer Reviews</h2>
          <p className="section-subtitle">
            Share your experience and read what others say about our service.
          </p>
        </motion.div>

        {/* Submit Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8 flex flex-col gap-5"
            style={{ boxShadow: "0 8px 50px oklch(0 0 0 / 0.4)" }}
            data-ocid="reviews.panel"
          >
            <h3
              className="font-bold text-base uppercase tracking-wider text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Write a Review
            </h3>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="review-name"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Your Name *
              </Label>
              <Input
                id="review-name"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                style={inputStyle}
                className="placeholder:text-[oklch(0.42_0.04_250)]"
                data-ocid="reviews.input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Rating *
              </Label>
              <div className="flex gap-2">
                {STAR_KEYS_REVIEW.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: star }))}
                    className="transition-transform hover:scale-110"
                    data-ocid="reviews.toggle"
                  >
                    <Star
                      className="w-7 h-7"
                      style={{
                        color:
                          star <= form.rating
                            ? "oklch(0.85 0.15 90)"
                            : "oklch(0.35 0.04 250)",
                        fill:
                          star <= form.rating
                            ? "oklch(0.85 0.15 90)"
                            : "transparent",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="review-message"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Your Review *
              </Label>
              <Textarea
                id="review-message"
                rows={4}
                placeholder="Share your experience with Cool Refrigeration..."
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                style={inputStyle}
                className="placeholder:text-[oklch(0.42_0.04_250)]"
                data-ocid="reviews.textarea"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="uppercase text-xs font-bold tracking-wider glow-btn transition-all duration-300"
              style={{
                background: "oklch(0.55 0.18 230)",
                color: "white",
                boxShadow: "0 0 25px oklch(0.55 0.18 230 / 0.5)",
              }}
              data-ocid="reviews.submit_button"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-7 flex flex-col relative"
              style={{ boxShadow: "0 4px 30px oklch(0 0 0 / 0.3)" }}
              data-ocid={`reviews.item.${i + 1}`}
            >
              <div
                className="text-5xl font-serif leading-none mb-2 -mt-2"
                style={{ color: "oklch(0.55 0.18 230 / 0.3)" }}
              >
                ""
              </div>
              <div className="flex gap-1 mb-3">
                {STAR_KEYS_REVIEW.map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4"
                    style={{
                      color:
                        star <= r.rating
                          ? "oklch(0.85 0.15 90)"
                          : "oklch(0.35 0.04 250)",
                      fill:
                        star <= r.rating
                          ? "oklch(0.85 0.15 90)"
                          : "transparent",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-5 italic flex-1"
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                "{r.message}"
              </p>
              <div
                className="border-t pt-4 flex items-center justify-between"
                style={{ borderColor: "oklch(0.55 0.18 230 / 0.15)" }}
              >
                <p
                  className="font-bold text-sm text-white"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {r.name}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.5 0.04 250)" }}>
                  {r.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Order Section ────────────────────────────────────────────────────────────
const ORDER_FORM_INIT = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  productInterest: "",
  address: "",
  preferredDate: "",
  notes: "",
};

function OrderSection() {
  const [form, setForm] = useState(ORDER_FORM_INIT);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof ORDER_FORM_INIT) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);

    const msg = [
      "🛒 *New Order - Cool Refrigeration*",
      "",
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      `*Email:* ${form.email}`,
      `*Service:* ${form.serviceType}`,
      `*Product Interest:* ${form.productInterest}`,
      `*Address:* ${form.address}`,
      `*Preferred Date:* ${form.preferredDate}`,
      form.notes ? `*Notes:* ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/918276938625?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setForm(ORDER_FORM_INIT);
    toast.success("Order placed! WhatsApp opened to notify the business.");
  };

  const inputStyle = {
    background: "oklch(0.10 0.04 250)",
    borderColor: "oklch(0.28 0.06 250)",
    color: "white",
  };

  const labelCls = "text-xs font-semibold uppercase tracking-wider";

  return (
    <section
      id="order"
      className="py-24"
      style={{ background: "oklch(0.14 0.045 252)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            Get A Service
          </p>
          <h2 className="section-title">Place an Order</h2>
          <p className="section-subtitle">
            Book a service or request a product — we'll confirm your order
            within 2 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8 flex flex-col gap-5"
            style={{ boxShadow: "0 8px 50px oklch(0 0 0 / 0.5)" }}
            data-ocid="order.panel"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="order-name"
                  className={labelCls}
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Full Name *
                </Label>
                <Input
                  id="order-name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  required
                  style={inputStyle}
                  className="placeholder:text-[oklch(0.42_0.04_250)]"
                  data-ocid="order.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="order-phone"
                  className={labelCls}
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Phone Number *
                </Label>
                <Input
                  id="order-phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  required
                  style={inputStyle}
                  className="placeholder:text-[oklch(0.42_0.04_250)]"
                  data-ocid="order.input"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-email"
                className={labelCls}
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Email Address
              </Label>
              <Input
                id="order-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                style={inputStyle}
                className="placeholder:text-[oklch(0.42_0.04_250)]"
                data-ocid="order.input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <Label
                  className={labelCls}
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Service Type *
                </Label>
                <Select
                  value={form.serviceType}
                  onValueChange={set("serviceType")}
                  required
                >
                  <SelectTrigger style={inputStyle} data-ocid="order.select">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "oklch(0.17 0.04 250)",
                      borderColor: "oklch(0.28 0.06 250)",
                    }}
                  >
                    <SelectItem value="ac-installation">
                      AC Installation
                    </SelectItem>
                    <SelectItem value="ac-service">AC Service</SelectItem>
                    <SelectItem value="fridge-repair">Fridge Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  className={labelCls}
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Product Interest
                </Label>
                <Select
                  value={form.productInterest}
                  onValueChange={set("productInterest")}
                >
                  <SelectTrigger style={inputStyle} data-ocid="order.select">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "oklch(0.17 0.04 250)",
                      borderColor: "oklch(0.28 0.06 250)",
                    }}
                  >
                    <SelectItem value="window-ac">Window AC Unit</SelectItem>
                    <SelectItem value="split-ac">Split AC</SelectItem>
                    <SelectItem value="fridge-single">
                      Fridge Single Door
                    </SelectItem>
                    <SelectItem value="fridge-double">
                      Fridge Double Door
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-address"
                className={labelCls}
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Service Address *
              </Label>
              <Input
                id="order-address"
                placeholder="Your full address in Kolkata"
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                required
                style={inputStyle}
                className="placeholder:text-[oklch(0.42_0.04_250)]"
                data-ocid="order.input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-date"
                className={labelCls}
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Preferred Date
              </Label>
              <Input
                id="order-date"
                type="date"
                value={form.preferredDate}
                onChange={(e) => set("preferredDate")(e.target.value)}
                style={inputStyle}
                data-ocid="order.input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-notes"
                className={labelCls}
                style={{ color: "oklch(0.72 0.04 250)" }}
              >
                Additional Notes
              </Label>
              <Textarea
                id="order-notes"
                rows={4}
                placeholder="Describe your issue or requirements in detail..."
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                style={inputStyle}
                className="placeholder:text-[oklch(0.42_0.04_250)]"
                data-ocid="order.textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="uppercase text-xs font-bold tracking-wider w-full py-3 glow-btn transition-all duration-300"
              style={{
                background: "oklch(0.55 0.18 230)",
                color: "white",
                boxShadow: "0 0 25px oklch(0.55 0.18 230 / 0.5)",
              }}
              data-ocid="order.submit_button"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>

            <p
              className="text-xs text-center"
              style={{ color: "oklch(0.5 0.04 250)" }}
            >
              We'll call you within 2 hours to confirm your booking.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Payment Section ──────────────────────────────────────────────────────────
const UPI_ID = "8100492367-4@ybl";

const PAYMENT_METHODS = [
  {
    key: "cod",
    Icon: Banknote,
    title: "Cash on Delivery",
    subtitle: "Pay after service completion",
    description:
      "Our technician will collect cash payment once the job is done to your satisfaction. No upfront charges.",
    detail: null,
    action: null,
  },
  {
    key: "upi",
    Icon: Wallet,
    title: "UPI Payment",
    subtitle: "Instant digital transfer",
    description:
      "Pay via any UPI app — Google Pay, PhonePe, Paytm, or your bank's UPI. Scan QR or use the UPI ID below.",
    detail: UPI_ID,
    action: "copy",
  },
  {
    key: "bank",
    Icon: Banknote,
    title: "Bank Transfer",
    subtitle: "NEFT / IMPS / RTGS",
    description:
      "Transfer directly to our bank account. Share the UTR number via WhatsApp after transfer.",
    detail: "A/C: 99980131335825  |  IFSC: FDRL0009998  |  Bank: Federal Bank",
    action: null,
  },
];

function PaymentSection() {
  const [copied, setCopied] = useState(false);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success("UPI ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  return (
    <section
      id="payment"
      className="py-24"
      style={{ background: "oklch(0.12 0.04 250)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            Flexible &amp; Easy
          </p>
          <h2 className="section-title">Payment Options</h2>
          <p className="section-subtitle">
            We make payment easy and flexible — choose what works best for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-10 rounded-xl px-6 py-4 flex items-center gap-3 text-sm font-semibold"
          style={{
            background: "oklch(0.25 0.08 145 / 0.3)",
            border: "1px solid oklch(0.55 0.15 145 / 0.4)",
            color: "oklch(0.78 0.12 145)",
          }}
        >
          <span className="text-lg">✅</span>
          <span>
            Payment is collected <strong>after service completion</strong>. No
            advance payment required.
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PAYMENT_METHODS.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-8 flex flex-col group transition-all duration-300"
              style={{ boxShadow: "0 4px 30px oklch(0 0 0 / 0.3)" }}
              data-ocid={`payment.item.${i + 1}`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{
                  background: "oklch(0.55 0.18 230 / 0.15)",
                  border: "1px solid oklch(0.55 0.18 230 / 0.3)",
                }}
              >
                <m.Icon
                  className="w-7 h-7"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
              </div>
              <h3
                className="font-bold text-base uppercase tracking-wider mb-1 text-white"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {m.title}
              </h3>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "oklch(0.75 0.14 220)" }}
              >
                {m.subtitle}
              </p>
              <p
                className="text-sm leading-relaxed mb-5 flex-1"
                style={{ color: "oklch(0.65 0.04 250)" }}
              >
                {m.description}
              </p>
              {m.detail && (
                <div
                  className="rounded-lg px-4 py-3 text-xs font-mono break-all mb-4"
                  style={{
                    background: "oklch(0.10 0.04 250)",
                    color: "oklch(0.75 0.14 220)",
                    border: "1px solid oklch(0.55 0.18 230 / 0.2)",
                  }}
                >
                  {m.detail}
                </div>
              )}
              {m.action === "copy" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyUpi}
                  className="w-full uppercase text-xs font-bold tracking-wider gap-2 bg-transparent transition-all duration-300"
                  style={{
                    borderColor: "oklch(0.55 0.18 230 / 0.5)",
                    color: "oklch(0.75 0.14 220)",
                  }}
                  data-ocid="payment.primary_button"
                >
                  <ClipboardCopy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy UPI ID"}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm mb-4" style={{ color: "oklch(0.5 0.04 250)" }}>
            Need help with payment? Reach us directly on WhatsApp.
          </p>
          <a
            href="https://wa.me/918276938625"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="payment.secondary_button"
          >
            <Button
              type="button"
              className="uppercase text-xs font-bold tracking-wider gap-2"
              style={{
                background: "oklch(0.45 0.15 145)",
                color: "white",
                boxShadow: "0 0 20px oklch(0.45 0.15 145 / 0.4)",
              }}
            >
              <Phone className="w-4 h-4" />
              WhatsApp Us
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setForm({ name: "", email: "", message: "" });
    toast.success("Message sent! We'll be in touch within 24 hours.");
  };

  const inputStyle = {
    background: "oklch(0.10 0.04 250)",
    borderColor: "oklch(0.28 0.06 250)",
    color: "white",
  };

  return (
    <section
      id="contact"
      className="py-24"
      style={{ background: "oklch(0.14 0.045 252)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.14 220)" }}
          >
            Reach Out
          </p>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Ready to book a service? Request a free quote or ask us anything.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-8 flex flex-col gap-5"
              style={{ boxShadow: "0 8px 40px oklch(0 0 0 / 0.4)" }}
              data-ocid="contact.panel"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="cname"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Name
                </Label>
                <Input
                  id="cname"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  style={inputStyle}
                  className="placeholder:text-[oklch(0.42_0.04_250)]"
                  data-ocid="contact.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="cemail"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Email
                </Label>
                <Input
                  id="cemail"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  style={inputStyle}
                  className="placeholder:text-[oklch(0.42_0.04_250)]"
                  data-ocid="contact.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="cmessage"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Message
                </Label>
                <Textarea
                  id="cmessage"
                  rows={5}
                  placeholder="Tell us about your service needs..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  style={inputStyle}
                  className="placeholder:text-[oklch(0.42_0.04_250)]"
                  data-ocid="contact.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="uppercase text-xs font-bold tracking-wider glow-btn transition-all duration-300"
                style={{
                  background: "oklch(0.55 0.18 230)",
                  color: "white",
                  boxShadow: "0 0 20px oklch(0.55 0.18 230 / 0.5)",
                }}
                data-ocid="contact.submit_button"
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8 justify-center"
          >
            <div>
              <h3
                className="font-bold text-xl uppercase tracking-wider mb-6 text-white"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Contact{" "}
                <span style={{ color: "oklch(0.75 0.14 220)" }}>
                  Information
                </span>
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  {
                    Icon: MapPin,
                    label: "Address",
                    value:
                      "2D Picnic Garden, 3rd Lane, Tiljala, Kolkata 700039",
                    href: undefined,
                  },
                  {
                    Icon: Phone,
                    label: "Phone",
                    value: "+91 82769 38625",
                    href: "tel:+918276938625",
                  },
                  {
                    Icon: Mail,
                    label: "Email",
                    value: "coolrefrigeration318@gmail.com",
                    href: "mailto:coolrefrigeration318@gmail.com",
                  },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: "oklch(0.55 0.18 230 / 0.15)",
                        border: "1px solid oklch(0.55 0.18 230 / 0.25)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "oklch(0.75 0.14 220)" }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-white">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm transition-colors"
                          style={{ color: "oklch(0.65 0.04 250)" }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          className="text-sm"
                          style={{ color: "oklch(0.65 0.04 250)" }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <p
                className="text-sm font-semibold"
                style={{ color: "oklch(0.75 0.14 220)" }}
              >
                ⏰ Business Hours
              </p>
              <div
                className="mt-3 text-sm space-y-1.5"
                style={{ color: "oklch(0.65 0.04 250)" }}
              >
                <p>Monday – Friday: 7:00 AM – 6:00 PM</p>
                <p>Saturday: 8:00 AM – 4:00 PM</p>
                <p
                  className="font-semibold"
                  style={{ color: "oklch(0.78 0.12 145)" }}
                >
                  Emergency Service: 24/7
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "oklch(0.09 0.035 252)" }}>
      <div
        className="border-t"
        style={{ borderColor: "oklch(0.55 0.18 230 / 0.15)" }}
      />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/uploads/screenshot_20250326_050441_contacts-019d3b0c-4668-7165-b8d6-ba06ce98f43d-1.jpg"
                alt="Cool Refrigeration Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "oklch(0.5 0.04 250)" }}
            >
              Kolkata's trusted AC installation, AC service &amp; fridge repair
              specialists.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "oklch(0.55 0.18 230 / 0.1)",
                    border: "1px solid oklch(0.55 0.18 230 / 0.2)",
                    color: "oklch(0.65 0.04 250)",
                  }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="text-white font-bold text-xs uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(l.href)}
                    className="text-sm transition-colors"
                    style={{ color: "oklch(0.5 0.04 250)" }}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-white font-bold text-xs uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Our Services
            </h4>
            <ul
              className="flex flex-col gap-2 text-sm"
              style={{ color: "oklch(0.5 0.04 250)" }}
            >
              {[
                "AC Installation",
                "AC Service",
                "Fridge Repair",
                "Split AC",
                "Preventive Maintenance",
                "Emergency Repairs",
              ].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-white font-bold text-xs uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Contact Info
            </h4>
            <ul
              className="flex flex-col gap-3 text-sm"
              style={{ color: "oklch(0.5 0.04 250)" }}
            >
              <li className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
                <span>2D Picnic Garden, 3rd Lane, Tiljala, Kolkata 700039</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
                <a
                  href="tel:+918276938625"
                  className="transition-colors hover:text-white"
                >
                  +91 82769 38625
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
                <a
                  href="mailto:coolrefrigeration318@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  coolrefrigeration318@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Back to Top ──────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white flex items-center justify-center glow-btn transition-all duration-300"
          style={{
            background: "oklch(0.55 0.18 230)",
            boxShadow: "0 0 20px oklch(0.55 0.18 230 / 0.6)",
          }}
          aria-label="Back to top"
          data-ocid="page.button"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors />
        <Header />
        <CartDrawer />
        <main>
          <Hero />
          <Services />
          <OwnerSection />
          <Products />
          <MaintenanceBand />
          <Testimonials />
          <CustomerReviews />
          <OrderSection />
          <PaymentSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </CartProvider>
  );
}
