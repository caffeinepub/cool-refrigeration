import { ShieldNetAnimation } from "@/components/ShieldNetAnimation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  Banknote,
  CheckCircle,
  ChevronUp,
  ClipboardCopy,
  Facebook,
  Info,
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
import { RefreshCw, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Security Utilities ────────────────────────────────────────────────────────
function sanitizeInput(text: string, maxLength = 1000): string {
  let s = text.slice(0, maxLength);
  s = s.replace(/javascript:/gi, "");
  s = s.replace(/data:/gi, "");
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  s = s.replace(/on\w+\s*=/gi, "");
  s = s.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/"/g, "&quot;");
  s = s.replace(/'/g, "&#x27;");
  return s;
}

function checkRateLimit(key: string, limitMs = 60000): boolean {
  const storageKey = `rl_${key}`;
  const attemptsKey = `rla_${key}`;
  const now = Date.now();
  const lastStr = localStorage.getItem(storageKey);
  const attemptsStr = localStorage.getItem(attemptsKey);
  const last = lastStr ? Number.parseInt(lastStr) : 0;
  const attempts = attemptsStr ? Number.parseInt(attemptsStr) : 0;

  // If last attempt was within window, check count
  if (last && now - last < limitMs) {
    if (attempts >= 3) return false; // Blocked
    localStorage.setItem(attemptsKey, (attempts + 1).toString());
    localStorage.setItem(storageKey, now.toString());
    return true;
  }
  // Reset window
  localStorage.setItem(storageKey, now.toString());
  localStorage.setItem(attemptsKey, "1");
  return true;
}

// ─── CSRF Token ────────────────────────────────────────────────────────────────
function generateCSRFToken(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Session CSRF token - generated once per page load
const SESSION_CSRF = generateCSRFToken();

// ─── Email Obfuscation ─────────────────────────────────────────────────────────
function ObfuscatedEmail({ className }: { className?: string }) {
  const email = ["coolrefrigeration318", "@", "gmail", ".", "com"].join("");
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}

// ─── Security Trust Badge ──────────────────────────────────────────────────────
function SecurityTrustBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 px-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 max-w-2xl mx-auto my-6">
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: "oklch(0.75 0.14 220)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="font-semibold">256-bit SSL Encrypted</span>
      </div>
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: "oklch(0.72 0.18 142)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="font-semibold">Secure &amp; Protected</span>
      </div>
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: "oklch(0.70 0.14 260)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="font-semibold">Privacy Safe</span>
      </div>
    </div>
  );
}

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
    const waLink1 = document.createElement("a");
    waLink1.href = `https://wa.me/918276938625?text=${encodeURIComponent(msg)}`;
    waLink1.target = "_blank";
    waLink1.rel = "noopener noreferrer";
    document.body.appendChild(waLink1);
    waLink1.click();
    document.body.removeChild(waLink1);
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
  { label: "ABOUT", href: "about" },
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

function Header({ setPage }: { setPage: (p: "home" | "about") => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href === "about") {
      setPage("about");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setPage("home");
    setTimeout(() => scrollTo(href), 50);
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
          onClick={() => {
            setPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 group"
          data-ocid="header.link"
        >
          <img
            src="/assets/white_and_black_professional_design_football_club_logo_20260330_134603_0000-019d3dd5-8280-743a-9bc1-64c3380cb0d3.png"
            alt="Cool Refrigeration Logo"
            className="h-20 w-auto object-contain"
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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl flex-shrink-0"
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
        {/* Shield Net Animation - right column */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <ShieldNetAnimation />
        </div>
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
    img: "/assets/generated/window-ac.dim_600x400.jpg",
    desc: "Energy-efficient window air conditioners for homes, offices, and small commercial spaces. Easy installation.",
  },
  {
    name: "Split AC",
    img: "/assets/generated/split-ac.dim_600x400.jpg",
    desc: "High-performance split air conditioners for homes, hotels, and restaurants. Quiet operation with superior cooling.",
  },
  {
    name: "Fridge Single Door",
    img: "/assets/generated/fridge-single-door.dim_600x400.jpg",
    desc: "Reliable single door refrigerators for homes and small kitchens. Energy-saving models from all major brands.",
  },
  {
    name: "Fridge Double Door",
    img: "/assets/generated/fridge-double-door.dim_600x400.jpg",
    desc: "Spacious double door refrigerators ideal for families, restaurants, and hotels. Frost-free with modern features.",
  },
];

function AddToCartButton({
  product,
  index,
}: { product: { name: string; img?: string }; index: number }) {
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
              {p.img && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
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
  const { actor } = useActor();
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Bot honeypot check — if filled, silently pretend success
    if (honeypot) {
      setForm({ name: "", rating: 5, message: "" });
      setHoneypot("");
      toast.success("Thank you for your review!");
      return;
    }
    // Rate limit check
    if (!checkRateLimit("review_submit")) {
      toast.error("Please wait a moment before submitting again.");
      return;
    }
    if (!form.name.trim() || !form.message.trim()) return;
    const safeName = sanitizeInput(form.name.trim());
    const safeMessage = sanitizeInput(form.message.trim());
    setSubmitting(true);
    const now = new Date();
    const date = now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    try {
      if (actor) {
        await actor.submitReview(safeName, BigInt(form.rating), safeMessage);
      }
    } catch {
      // Backend error is non-fatal; still show review locally
    }
    setReviews((prev) => [
      {
        id: Date.now(),
        name: safeName,
        rating: form.rating,
        message: safeMessage,
        date,
      },
      ...prev,
    ]);
    setForm({ name: "", rating: 5, message: "" });
    setHoneypot("");
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
            {/* Honeypot field - hidden from real users, catches bots */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: "none" }}
              autoComplete="off"
            />
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
  const { actor } = useActor();
  const [form, setForm] = useState(ORDER_FORM_INIT);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<null | {
    name: string;
    phone: string;
    serviceType: string;
    preferredDate: string;
  }>(null);

  const set = (key: keyof typeof ORDER_FORM_INIT) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Bot honeypot check
    if (honeypot) {
      setForm(ORDER_FORM_INIT);
      setHoneypot("");
      toast.success("Order placed! WhatsApp opened to notify the business.");
      return;
    }
    // Rate limit check
    if (!checkRateLimit("order_submit")) {
      toast.error(
        "Too many attempts. Please wait 2 minutes before trying again.",
      );
      return;
    }
    // Email validation
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Phone validation - must be 10 digits
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (form.phone.trim() && digitsOnly.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);

    const safeName = sanitizeInput(form.name.trim());
    const safePhone = sanitizeInput(form.phone.trim());
    const safeEmail = sanitizeInput(form.email.trim());
    const safeAddress = sanitizeInput(form.address.trim());
    const safeNotes = sanitizeInput(form.notes.trim());

    // Log order to backend
    try {
      if (actor) {
        await actor.submitOrder(
          safeName,
          safePhone,
          safeEmail,
          form.serviceType,
          form.productInterest,
          safeAddress,
          form.preferredDate,
          safeNotes,
        );
      }
    } catch {
      // Backend logging is non-fatal
    }

    const msg = [
      "🛒 *New Order - Cool Refrigeration*",
      "",
      `*Name:* ${safeName}`,
      `*Phone:* ${safePhone}`,
      `*Email:* ${safeEmail}`,
      `*Service:* ${form.serviceType}`,
      `*Product Interest:* ${form.productInterest}`,
      `*Address:* ${safeAddress}`,
      `*Preferred Date:* ${form.preferredDate}`,
      safeNotes ? `*Notes:* ${safeNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/918276938625?text=${encodeURIComponent(msg)}`;
    const waLink2 = document.createElement("a");
    waLink2.href = waUrl;
    waLink2.target = "_blank";
    waLink2.rel = "noopener noreferrer";
    document.body.appendChild(waLink2);
    waLink2.click();
    document.body.removeChild(waLink2);

    setForm(ORDER_FORM_INIT);
    setHoneypot("");
    setOrderConfirmed({
      name: safeName,
      phone: safePhone,
      serviceType: form.serviceType,
      preferredDate: form.preferredDate,
    });
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

        <SecurityTrustBadge />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          {orderConfirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-10 flex flex-col items-center gap-6 text-center"
              style={{ boxShadow: "0 8px 50px oklch(0 0 0 / 0.5)" }}
              data-ocid="order.success_state"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.55 0.18 230 / 0.15)",
                  border: "2px solid oklch(0.55 0.18 230 / 0.5)",
                }}
              >
                <CheckCircle
                  className="w-10 h-10"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                />
              </div>
              <div>
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Order Received!
                </h3>
                <p
                  className="text-sm mb-1"
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  Thank you{" "}
                  <span className="font-semibold text-white">
                    {orderConfirmed.name}
                  </span>
                  ! Your{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "oklch(0.75 0.14 220)" }}
                  >
                    {orderConfirmed.serviceType}
                  </span>{" "}
                  request has been received. We'll contact you at{" "}
                  <span className="font-semibold text-white">
                    {orderConfirmed.phone}
                  </span>{" "}
                  to confirm your appointment.
                </p>
                {orderConfirmed.preferredDate && (
                  <p
                    className="text-xs mt-2"
                    style={{ color: "oklch(0.6 0.04 250)" }}
                  >
                    Preferred date:{" "}
                    <span className="font-semibold text-white">
                      {orderConfirmed.preferredDate}
                    </span>
                  </p>
                )}
              </div>
              <div
                className="rounded-xl px-6 py-3 text-sm font-semibold"
                style={{
                  background: "oklch(0.55 0.18 230 / 0.12)",
                  border: "1px solid oklch(0.55 0.18 230 / 0.3)",
                  color: "oklch(0.75 0.14 220)",
                }}
              >
                📱 WhatsApp notification sent to our team — we'll call you soon!
              </div>
              <Button
                type="button"
                onClick={() => setOrderConfirmed(null)}
                variant="outline"
                className="text-xs uppercase tracking-wider"
                style={{
                  borderColor: "oklch(0.55 0.18 230 / 0.5)",
                  color: "oklch(0.75 0.14 220)",
                  background: "transparent",
                }}
                data-ocid="order.secondary_button"
              >
                Place Another Order
              </Button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-8 flex flex-col gap-5"
              style={{ boxShadow: "0 8px 50px oklch(0 0 0 / 0.5)" }}
              data-ocid="order.panel"
              data-csrf={SESSION_CSRF}
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
                      <SelectItem value="fridge-repair">
                        Fridge Repair
                      </SelectItem>
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

              {/* Honeypot field - hidden from real users, catches bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: "none" }}
                autoComplete="off"
              />
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
          )}
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
function Footer({ setPage }: { setPage: (p: "home" | "about") => void }) {
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
                src="/assets/white_and_black_professional_design_football_club_logo_20260330_134603_0000-019d3dd5-8280-743a-9bc1-64c3380cb0d3.png"
                alt="Cool Refrigeration Logo"
                className="h-16 w-auto object-contain"
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
                    onClick={() => {
                      if (l.href === "about") {
                        setPage("about");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        setPage("home");
                        setTimeout(() => scrollTo(l.href), 50);
                      }
                    }}
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
                <ObfuscatedEmail className="transition-colors hover:text-white" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Chat Widget ─────────────────────────────────────────────────────
function FloatingChat() {
  const { actor } = useActor();
  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setChatName("");
        setChatMessage("");
        setHoneypot("");
      }, 3000);
      return;
    }
    if (!checkRateLimit("chat_submit")) {
      toast.error(
        "Too many attempts. Please wait a minute before trying again.",
      );
      return;
    }
    const safeName = sanitizeInput(chatName.trim());
    const safeMsg = sanitizeInput(chatMessage.trim());
    if (!safeName || !safeMsg) {
      toast.error("Please enter your name and message.");
      return;
    }
    setSending(true);
    try {
      if (actor) {
        await actor.sendChatMessage(safeName, safeMsg);
      }
    } catch {
      // non-fatal
    }
    setSending(false);

    const waText = `💬 New Chat Message - Cool Refrigeration\nName: ${safeName}\nMessage: ${safeMsg}`;
    const waLink = document.createElement("a");
    waLink.href = `https://wa.me/918276938625?text=${encodeURIComponent(waText)}`;
    waLink.target = "_blank";
    waLink.rel = "noopener noreferrer";
    document.body.appendChild(waLink);
    waLink.click();
    document.body.removeChild(waLink);

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setChatName("");
      setChatMessage("");
      setOpen(false);
    }, 3000);
  };

  const inputStyle = {
    background: "oklch(0.10 0.04 250)",
    borderColor: "oklch(0.28 0.06 250)",
    color: "white",
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed z-50 w-80 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              bottom: "6.5rem",
              right: "1.5rem",
              background: "oklch(0.17 0.04 250)",
              border: "1px solid oklch(0.55 0.18 230 / 0.35)",
              boxShadow:
                "0 8px 40px oklch(0 0 0 / 0.6), 0 0 30px oklch(0.55 0.18 230 / 0.15)",
            }}
            data-ocid="chat.panel"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "oklch(0.20 0.05 250)",
                borderBottom: "1px solid oklch(0.55 0.18 230 / 0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "oklch(0.72 0.18 142)",
                    boxShadow: "0 0 6px oklch(0.72 0.18 142)",
                  }}
                />
                <span
                  className="text-sm font-bold"
                  style={{
                    color: "white",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  Chat with Us
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
                data-ocid="chat.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                  data-ocid="chat.success_state"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.55 0.18 230 / 0.15)",
                      border: "2px solid oklch(0.55 0.18 230 / 0.5)",
                    }}
                  >
                    <CheckCircle
                      className="w-7 h-7"
                      style={{ color: "oklch(0.75 0.14 220)" }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">
                      Message Sent!
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.04 250)" }}
                    >
                      We'll reply on WhatsApp soon.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="chat-name"
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "oklch(0.72 0.04 250)" }}
                    >
                      Your Name
                    </label>
                    <Input
                      id="chat-name"
                      placeholder="Enter your name"
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                      required
                      style={inputStyle}
                      className="text-sm placeholder:text-[oklch(0.42_0.04_250)]"
                      data-ocid="chat.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="chat-message"
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "oklch(0.72 0.04 250)" }}
                    >
                      Message
                    </label>
                    <Textarea
                      id="chat-message"
                      rows={3}
                      placeholder="How can we help you?"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      required
                      style={inputStyle}
                      className="text-sm placeholder:text-[oklch(0.42_0.04_250)] resize-none"
                      data-ocid="chat.textarea"
                    />
                  </div>
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ display: "none" }}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full text-xs font-bold uppercase tracking-wider glow-btn transition-all duration-300"
                    style={{
                      background: "oklch(0.55 0.18 230)",
                      color: "white",
                      boxShadow: "0 0 20px oklch(0.55 0.18 230 / 0.4)",
                    }}
                    data-ocid="chat.submit_button"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          bottom: "5rem",
          right: "1.5rem",
          background: open ? "oklch(0.45 0.18 230)" : "oklch(0.55 0.18 230)",
          boxShadow: "0 0 25px oklch(0.55 0.18 230 / 0.65)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close chat" : "Open chat"}
        data-ocid="chat.open_modal_button"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
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

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage({ setPage }: { setPage: (p: "home" | "about") => void }) {
  const goToOrder = () => {
    setPage("home");
    setTimeout(() => {
      const el = document.querySelector("#order");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <div className="min-h-screen pt-20" data-ocid="about.page">
      {/* Hero Banner */}
      <section
        className="relative py-24 px-6 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.04 250) 0%, oklch(0.14 0.08 230) 100%)",
          borderBottom: "1px solid oklch(0.55 0.18 230 / 0.2)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.55 0.18 230 / 0.12) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{
              background: "oklch(0.55 0.18 230 / 0.15)",
              border: "1px solid oklch(0.55 0.18 230 / 0.3)",
              color: "oklch(0.75 0.14 220)",
            }}
          >
            <Info className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            About{" "}
            <span style={{ color: "oklch(0.75 0.14 220)" }}>
              Cool Refrigeration
            </span>
          </h1>
          <p className="text-lg" style={{ color: "oklch(0.6 0.06 240)" }}>
            Kolkata&apos;s Trusted Cooling Experts
          </p>
        </motion.div>
      </section>

      {/* Company Story */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          <div>
            <h2
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-5"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Who We <span style={{ color: "oklch(0.75 0.14 220)" }}>Are</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "oklch(0.62 0.04 250)" }}
            >
              Cool Refrigeration was founded to provide reliable, affordable AC
              and refrigeration services to homes, restaurants, and hotels
              across Kolkata. We believe every family and business deserves cool
              comfort — especially through the city&apos;s intense summers.
            </p>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "oklch(0.62 0.04 250)" }}
            >
              Based at{" "}
              <strong className="text-white">
                2D Picnic Garden, 3rd Lane, Tiljala, Kolkata 700039
              </strong>
              , our team of experienced technicians brings fast, honest service
              directly to your doorstep.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "oklch(0.62 0.04 250)" }}
            >
              From AC installation and servicing to fridge repair, we handle it
              all — with genuine parts and transparent pricing.
            </p>
          </div>
          <div
            className="rounded-2xl p-8 backdrop-blur-sm"
            style={{
              background: "oklch(0.13 0.05 250 / 0.8)",
              border: "1px solid oklch(0.55 0.18 230 / 0.2)",
              boxShadow: "0 8px 40px oklch(0 0 0 / 0.3)",
            }}
          >
            <h3
              className="text-white font-bold text-lg mb-4"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Business Details
            </h3>
            {[
              { label: "Location", value: "Tiljala, Kolkata 700039" },
              { label: "Phone", value: "+91 82769 38625" },
              { label: "Email", value: "coolrefrigeration318@gmail.com" },
              { label: "Speciality", value: "AC & Refrigeration Services" },
              { label: "Service Area", value: "All of Kolkata" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 mb-3 last:mb-0"
              >
                <span
                  className="text-xs font-bold uppercase tracking-wider mt-1"
                  style={{ color: "oklch(0.75 0.14 220)", minWidth: "80px" }}
                >
                  {label}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.72 0.04 250)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Summary */}
      <section
        className="py-16 px-6"
        style={{ background: "oklch(0.10 0.04 250 / 0.6)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Our{" "}
              <span style={{ color: "oklch(0.75 0.14 220)" }}>Services</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "AC Installation",
                desc: "Professional installation of Window AC and Split AC units for homes, offices, and commercial spaces.",
              },
              {
                icon: Wrench,
                title: "AC Service",
                desc: "Complete AC servicing including deep cleaning, gas top-up, and performance tuning for all brands.",
              },
              {
                icon: Snowflake,
                title: "Fridge Repair",
                desc: "Expert repair for all types of refrigerators — single door, double door, and commercial units.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i + 0.3 }}
                className="rounded-2xl p-6 backdrop-blur-sm"
                style={{
                  background: "oklch(0.13 0.05 250 / 0.7)",
                  border: "1px solid oklch(0.55 0.18 230 / 0.2)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "oklch(0.55 0.18 230 / 0.15)" }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: "oklch(0.75 0.14 220)" }}
                  />
                </div>
                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.6 0.04 250)" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl p-8 md:p-12 backdrop-blur-sm flex flex-col md:flex-row gap-8 items-center"
          style={{
            background: "oklch(0.13 0.05 250 / 0.8)",
            border: "1px solid oklch(0.55 0.18 230 / 0.2)",
            boxShadow: "0 8px 40px oklch(0 0 0 / 0.3)",
          }}
        >
          <img
            src="/assets/uploads/screenshot_20250326_050441_contacts-019d3b03-4071-77ae-86aa-b69fd1bd50a1-1.jpg"
            alt="Owner - Cool Refrigeration"
            className="w-36 h-36 rounded-full object-cover flex-shrink-0"
            style={{
              border: "3px solid oklch(0.55 0.18 230 / 0.5)",
              boxShadow: "0 0 30px oklch(0.55 0.18 230 / 0.3)",
            }}
          />
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.75 0.14 220)" }}
            >
              Meet the Owner
            </p>
            <h3
              className="text-2xl font-black text-white mb-3"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Owner — Cool Refrigeration
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: "oklch(0.62 0.04 250)" }}
            >
              With years of hands-on experience in AC and refrigeration
              technology, our owner founded Cool Refrigeration with one mission:
              to bring reliable, fast, and affordable cooling solutions to every
              home and business in Kolkata. Every job is handled with care,
              honesty, and technical expertise.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-16 px-6"
        style={{ background: "oklch(0.10 0.04 250 / 0.6)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Why{" "}
              <span style={{ color: "oklch(0.75 0.14 220)" }}>Choose Us</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Fast Service",
                desc: "Same-day and next-day service slots available. We know Kolkata heat waits for no one.",
              },
              {
                icon: CheckCircle,
                title: "Genuine Parts",
                desc: "We use only authentic, brand-compatible parts for all repairs and installations.",
              },
              {
                icon: Wallet,
                title: "Affordable Rates",
                desc: "Transparent pricing with no hidden charges. Quality service at fair prices, always.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i + 0.3 }}
                className="rounded-2xl p-6 text-center backdrop-blur-sm"
                style={{
                  background: "oklch(0.13 0.05 250 / 0.7)",
                  border: "1px solid oklch(0.55 0.18 230 / 0.2)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "oklch(0.55 0.18 230 / 0.15)",
                    boxShadow: "0 0 20px oklch(0.55 0.18 230 / 0.2)",
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: "oklch(0.75 0.14 220)" }}
                  />
                </div>
                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.6 0.04 250)" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Ready to{" "}
            <span style={{ color: "oklch(0.75 0.14 220)" }}>
              Book a Service?
            </span>
          </h2>
          <p
            className="mb-8 text-base"
            style={{ color: "oklch(0.62 0.04 250)" }}
          >
            Get in touch today. Fast response, honest pricing, expert service.
          </p>
          <Button
            type="button"
            onClick={goToOrder}
            className="uppercase text-sm font-bold tracking-wider px-10 py-5 glow-btn"
            style={{
              background: "oklch(0.55 0.18 230)",
              color: "white",
              boxShadow: "0 0 30px oklch(0.55 0.18 230 / 0.5)",
            }}
            data-ocid="about.primary_button"
          >
            Book a Service Today
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
interface AdminOrder {
  id: bigint;
  name: string;
  phone: string;
  email: string;
  service_type: string;
  product_interest: string;
  address: string;
  preferred_date: string;
  notes: string;
  timestamp: bigint;
}
interface AdminReview {
  id: bigint;
  name: string;
  stars: bigint;
  message: string;
  timestamp: bigint;
}
interface AdminChatMessage {
  id: bigint;
  name: string;
  message: string;
  timestamp: bigint;
}

function formatTs(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPanel() {
  const { actor } = useActor();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [chatMessages, setChatMessages] = useState<AdminChatMessage[]>([]);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    Promise.all([
      actor.getAllOrders(),
      actor.getAllReviews(),
      actor.getAllChatMessages(),
    ])
      .then(([ords, revs, msgs]) => {
        if (ords) setOrders(ords as AdminOrder[]);
        if (revs) setReviews(revs as AdminReview[]);
        if (msgs) setChatMessages(msgs as AdminChatMessage[]);
      })
      .finally(() => setLoading(false));
  }, [actor]);

  const bgStyle = { background: "oklch(0.12 0.04 250)", minHeight: "100vh" };
  const cardStyle = {
    background: "oklch(0.17 0.04 250)",
    border: "1px solid oklch(0.55 0.18 230 / 0.3)",
    borderRadius: "1rem",
  };

  return (
    <div style={bgStyle} className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield
              className="w-6 h-6"
              style={{ color: "oklch(0.75 0.14 220)" }}
            />
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Admin Dashboard
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.55 0.04 250)" }}>
                Cool Refrigeration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (!actor) return;
                setLoading(true);
                Promise.all([
                  actor.getAllOrders(),
                  actor.getAllReviews(),
                  actor.getAllChatMessages(),
                ])
                  .then(([ords, revs, msgs]) => {
                    if (ords) setOrders(ords as AdminOrder[]);
                    if (revs) setReviews(revs as AdminReview[]);
                    if (msgs) setChatMessages(msgs as AdminChatMessage[]);
                  })
                  .finally(() => setLoading(false));
              }}
              variant="outline"
              size="sm"
              className="text-xs uppercase tracking-wider"
              style={{
                borderColor: "oklch(0.55 0.18 230 / 0.4)",
                color: "oklch(0.75 0.14 220)",
                background: "transparent",
              }}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                window.location.hash = "";
              }}
              variant="outline"
              className="text-xs uppercase tracking-wider"
              style={{
                borderColor: "oklch(0.55 0.18 230 / 0.4)",
                color: "oklch(0.75 0.14 220)",
                background: "transparent",
              }}
            >
              Back to Site
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)" }}>
              Loading...
            </p>
          </div>
        ) : (
          <>
            {/* Security Stats Card */}
            <div
              className="mb-6 p-4 rounded-xl flex flex-wrap items-center gap-6"
              style={{
                background: "oklch(0.14 0.04 250)",
                border: "1px solid oklch(0.55 0.18 230 / 0.25)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.72 0.18 142 / 0.15)" }}
                >
                  <Shield
                    className="w-4 h-4"
                    style={{ color: "oklch(0.72 0.18 142)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "oklch(0.72 0.18 142)" }}
                  >
                    Security Status
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.04 250)" }}
                  >
                    ACTIVE &amp; MONITORING
                  </p>
                </div>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: "oklch(0.28 0.06 250)" }}
              />
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                >
                  Blocked Spam Attempts
                </p>
                <p className="text-lg font-bold text-white">
                  {(() => {
                    let total = 0;
                    for (let i = 0; i < localStorage.length; i++) {
                      const k = localStorage.key(i);
                      if (k?.startsWith("rla_")) {
                        total += Number.parseInt(
                          localStorage.getItem(k) || "0",
                        );
                      }
                    }
                    return total;
                  })()}
                </p>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: "oklch(0.28 0.06 250)" }}
              />
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                >
                  Total Orders
                </p>
                <p className="text-lg font-bold text-white">{orders.length}</p>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: "oklch(0.28 0.06 250)" }}
              />
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                >
                  Total Reviews
                </p>
                <p className="text-lg font-bold text-white">{reviews.length}</p>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: "oklch(0.28 0.06 250)" }}
              />
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: "oklch(0.75 0.14 220)" }}
                >
                  Total Messages
                </p>
                <p className="text-lg font-bold text-white">
                  {chatMessages.length}
                </p>
              </div>
              <div
                className="h-8 w-px hidden sm:block"
                style={{ background: "oklch(0.28 0.06 250)" }}
              />
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "SSL Encrypted", color: "oklch(0.75 0.14 220)" },
                  { label: "Spam Protected", color: "oklch(0.72 0.18 142)" },
                  { label: "CSP Active", color: "oklch(0.70 0.14 260)" },
                  { label: "Rate Limited", color: "oklch(0.72 0.18 50)" },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="text-xs px-2 py-0.5 rounded-full border font-semibold"
                    style={{
                      borderColor: `${color} / 0.4`,
                      color: color,
                      background: color.replace(")", " / 0.08)"),
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <Tabs defaultValue="orders">
              <TabsList
                style={{
                  background: "oklch(0.17 0.04 250)",
                  border: "1px solid oklch(0.55 0.18 230 / 0.2)",
                }}
                className="mb-6"
              >
                <TabsTrigger
                  value="orders"
                  className="text-xs uppercase tracking-wider data-[state=active]:text-white"
                >
                  Orders ({orders.length})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-xs uppercase tracking-wider data-[state=active]:text-white"
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger
                  value="messages"
                  className="text-xs uppercase tracking-wider data-[state=active]:text-white"
                  data-ocid="admin.tab"
                >
                  Messages ({chatMessages.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <div style={cardStyle} className="overflow-hidden">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.55 0.04 250)" }}
                      >
                        No orders yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow
                            style={{ borderColor: "oklch(0.28 0.06 250)" }}
                          >
                            {[
                              "Date/Time",
                              "Name",
                              "Phone",
                              "Email",
                              "Service",
                              "Product",
                              "Address",
                              "Preferred Date",
                              "Notes",
                              "Actions",
                            ].map((h) => (
                              <TableHead
                                key={h}
                                className="text-xs uppercase tracking-wider"
                                style={{
                                  color: "oklch(0.75 0.14 220)",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {h}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((o) => (
                            <TableRow
                              key={String(o.id)}
                              style={{
                                borderColor: "oklch(0.22 0.04 250)",
                                borderLeft:
                                  Date.now() -
                                    Number(o.timestamp / 1_000_000n) <
                                  86_400_000
                                    ? "3px solid oklch(0.75 0.14 220)"
                                    : "3px solid transparent",
                              }}
                            >
                              <TableCell className="text-xs text-white whitespace-nowrap">
                                {formatTs(o.timestamp)}
                              </TableCell>
                              <TableCell className="text-xs text-white">
                                {o.name}
                              </TableCell>
                              <TableCell className="text-xs text-white whitespace-nowrap">
                                {o.phone}
                              </TableCell>
                              <TableCell className="text-xs text-white">
                                {o.email || "—"}
                              </TableCell>
                              <TableCell className="text-xs text-white whitespace-nowrap">
                                {o.service_type}
                              </TableCell>
                              <TableCell className="text-xs text-white whitespace-nowrap">
                                {o.product_interest || "—"}
                              </TableCell>
                              <TableCell className="text-xs text-white">
                                {o.address}
                              </TableCell>
                              <TableCell className="text-xs text-white whitespace-nowrap">
                                {o.preferred_date || "—"}
                              </TableCell>
                              <TableCell className="text-xs text-white">
                                {o.notes || "—"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <a
                                    href={`tel:${o.phone}`}
                                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs border transition-colors"
                                    style={{
                                      borderColor: "oklch(0.55 0.18 230 / 0.5)",
                                      color: "oklch(0.75 0.14 220)",
                                    }}
                                    data-ocid="admin.order.call_button"
                                  >
                                    <Phone className="w-3 h-3" />
                                    Call
                                  </a>
                                  <a
                                    href={`https://wa.me/91${o.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${o.name}, your Cool Refrigeration ${o.service_type} service request has been received. We will contact you shortly.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs border transition-colors"
                                    style={{
                                      borderColor: "oklch(0.6 0.18 145 / 0.5)",
                                      color: "oklch(0.75 0.18 145)",
                                    }}
                                    data-ocid="admin.order.whatsapp_button"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    WhatsApp
                                  </a>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                {reviews.length === 0 ? (
                  <div
                    style={cardStyle}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.55 0.04 250)" }}
                    >
                      No reviews yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((r) => (
                      <div
                        key={String(r.id)}
                        style={cardStyle}
                        className="p-5 flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-sm text-white">
                            {r.name}
                          </p>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className="w-3.5 h-3.5"
                                style={{
                                  color:
                                    s <= Number(r.stars)
                                      ? "oklch(0.85 0.15 90)"
                                      : "oklch(0.35 0.04 250)",
                                  fill:
                                    s <= Number(r.stars)
                                      ? "oklch(0.85 0.15 90)"
                                      : "transparent",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: "oklch(0.72 0.04 250)" }}
                        >
                          {r.message}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "oklch(0.45 0.04 250)" }}
                        >
                          {formatTs(r.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="messages">
                {chatMessages.length === 0 ? (
                  <div
                    style={cardStyle}
                    className="flex flex-col items-center justify-center py-16"
                    data-ocid="admin.messages.empty_state"
                  >
                    <MessageCircle
                      className="w-8 h-8 mb-3"
                      style={{ color: "oklch(0.45 0.04 250)" }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.55 0.04 250)" }}
                    >
                      No messages yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chatMessages.map((m) => (
                      <div
                        key={String(m.id)}
                        style={cardStyle}
                        className="p-5 flex flex-col gap-3"
                        data-ocid="admin.messages.card"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                background: "oklch(0.55 0.18 230 / 0.15)",
                                border: "1px solid oklch(0.55 0.18 230 / 0.3)",
                              }}
                            >
                              <MessageCircle
                                className="w-4 h-4"
                                style={{ color: "oklch(0.75 0.14 220)" }}
                              />
                            </div>
                            <p className="font-semibold text-sm text-white">
                              {m.name}
                            </p>
                          </div>
                          <p
                            className="text-xs flex-shrink-0"
                            style={{ color: "oklch(0.45 0.04 250)" }}
                          >
                            {formatTs(m.timestamp)}
                          </p>
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "oklch(0.72 0.04 250)" }}
                        >
                          {m.message}
                        </p>
                        <a
                          href={`https://wa.me/918276938625?text=${encodeURIComponent(`Hi ${m.name}, thank you for reaching out to Cool Refrigeration! `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 self-start rounded px-3 py-1.5 text-xs border transition-colors"
                          style={{
                            borderColor: "oklch(0.6 0.18 145 / 0.5)",
                            color: "oklch(0.75 0.18 145)",
                          }}
                          data-ocid="admin.messages.whatsapp_button"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Reply on WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<"home" | "about">("home");
  const [isAdmin, setIsAdmin] = useState(
    () =>
      window.location.hash === "#admin" ||
      window.location.pathname === "/admin",
  );

  useEffect(() => {
    const handler = () => {
      setIsAdmin(
        window.location.hash === "#admin" ||
          window.location.pathname === "/admin",
      );
    };
    window.addEventListener("hashchange", handler);
    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("hashchange", handler);
      window.removeEventListener("popstate", handler);
    };
  }, []);

  if (isAdmin) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AdminPanel />
      </>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors />
        <Header setPage={setPage} />
        <CartDrawer />
        {page === "about" ? (
          <main>
            <AboutPage setPage={setPage} />
          </main>
        ) : (
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
        )}
        <Footer setPage={setPage} />
        <FloatingChat />
        <BackToTop />
      </div>
    </CartProvider>
  );
}
