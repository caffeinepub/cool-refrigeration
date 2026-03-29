import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Phone,
  Snowflake,
  Star,
  Twitter,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => handleNav(l.href)}
              className="text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => handleNav("#order")}
            className="hidden sm:flex uppercase text-xs font-bold tracking-wider bg-primary hover:bg-primary/90 text-white"
            data-ocid="header.primary_button"
          >
            ORDER NOW
          </Button>
          <button
            type="button"
            className="lg:hidden p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden bg-white border-t border-border px-4 pb-4 pt-2 flex flex-col gap-3"
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                type="button"
                onClick={() => handleNav(l.href)}
                className="text-sm font-semibold uppercase tracking-wider text-gray-600 hover:text-primary text-left py-1"
              >
                {l.label}
              </button>
            ))}
            <Button
              type="button"
              onClick={() => handleNav("#order")}
              className="uppercase text-xs font-bold tracking-wider bg-primary hover:bg-primary/90 text-white w-full mt-1"
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
            "linear-gradient(to right, rgba(15,36,51,0.95) 0%, rgba(15,36,51,0.8) 50%, rgba(15,36,51,0.2) 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "oklch(0.75 0.08 230)" }}
          >
            Trusted Refrigeration Experts
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Keeping Your Business
            <br />
            <span style={{ color: "oklch(0.75 0.1 220)" }}>Ice Cold</span>
          </h1>
          <p className="text-gray-300 text-base mb-8 leading-relaxed">
            Kolkata's premier commercial refrigeration specialists. From fridge
            repairs to AC installation and service, we deliver reliable
            solutions that keep your operations running — 24/7 emergency service
            available.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => scrollTo("#services")}
              className="uppercase text-xs font-bold tracking-wider border-white text-white bg-transparent hover:bg-white hover:text-gray-900"
              data-ocid="hero.secondary_button"
            >
              OUR SERVICES
            </Button>
            <Button
              type="button"
              onClick={() => scrollTo("#order")}
              className="uppercase text-xs font-bold tracking-wider bg-primary hover:bg-primary/90 text-white"
              data-ocid="hero.primary_button"
            >
              PLACE AN ORDER
            </Button>
          </div>
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
      className="py-20"
      style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              data-ocid={`services.item.${i + 1}`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
              >
                <s.icon
                  className="w-7 h-7"
                  style={{ color: "oklch(0.55 0.12 230)" }}
                />
              </div>
              <h3
                className="font-bold text-base uppercase tracking-wider mb-3"
                style={{ color: "oklch(0.2 0.01 270)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.55 0.01 270)" }}
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
    desc: "High-performance split air conditioners for homes, hotels, and restaurants. Quiet operation with superior cooling efficiency.",
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

function OwnerSection() {
  return (
    <section id="owner" className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <img
              src="/assets/uploads/img_20250905_120713_792-019d3b06-92ed-728c-9d5c-849f159f79c2-2.webp"
              alt="Owner of Cool Refrigeration"
              className="w-56 h-56 object-cover rounded-full border-4 border-blue-600 shadow-lg"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-2">
              Meet the Owner
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Proprietor, Cool Refrigeration
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Serving Kolkata with quality AC installation, AC service, and
              refrigeration repairs for years. Trusted by restaurants,
              homeowners, and hotels across the city.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
              className="rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow group"
              data-ocid={`products.item.${i + 1}`}
            >
              <div
                className="aspect-square overflow-hidden"
                style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3
                  className="font-bold text-sm uppercase tracking-wide mb-2"
                  style={{ color: "oklch(0.2 0.01 270)" }}
                >
                  {p.name}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.55 0.01 270)" }}
                >
                  {p.desc}
                </p>
                <button
                  type="button"
                  onClick={() => scrollTo("#order")}
                  className="mt-4 text-xs font-semibold uppercase tracking-wider hover:underline"
                  style={{ color: "oklch(0.55 0.12 230)" }}
                  data-ocid={`products.button.${i + 1}`}
                >
                  Place an Order →
                </button>
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
      className="py-16 text-white text-center"
      style={{ backgroundColor: "oklch(0.55 0.12 230)" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Wrench className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-3">
            24/7 Emergency Service
          </h2>
          <p className="text-base opacity-90 mb-6">
            Equipment failure doesn't follow a 9-to-5 schedule. Our certified
            technicians are on call around the clock to restore your systems
            fast — minimizing downtime.
          </p>
          <Button
            type="button"
            onClick={() => scrollTo("#order")}
            variant="outline"
            className="uppercase text-xs font-bold tracking-wider border-white text-white bg-transparent hover:bg-white hover:text-primary"
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
      className="py-20"
      style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-lg p-8 shadow-sm relative"
              data-ocid={`testimonials.item.${i + 1}`}
            >
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
                style={{ color: "oklch(0.4 0.01 270)" }}
              >
                "{t.quote}"
              </p>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "oklch(0.2 0.01 270)" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.12 230)" }}
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
    setForm(ORDER_FORM_INIT);
    toast.success("Order placed! We'll confirm within 2 hours.");
  };

  return (
    <section id="order" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
            className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-5"
            data-ocid="order.panel"
          >
            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="order-name"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Full Name *
                </Label>
                <Input
                  id="order-name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  required
                  data-ocid="order.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="order-phone"
                  className="text-xs font-semibold uppercase tracking-wider"
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
                  data-ocid="order.input"
                />
              </div>
            </div>

            {/* Row 2: Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-email"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Email Address
              </Label>
              <Input
                id="order-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                data-ocid="order.input"
              />
            </div>

            {/* Row 3: Service Type + Product Interest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider">
                  Service Type *
                </Label>
                <Select
                  value={form.serviceType}
                  onValueChange={set("serviceType")}
                  required
                >
                  <SelectTrigger data-ocid="order.select">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac-installation">
                      AC Installation
                    </SelectItem>
                    <SelectItem value="ac-service">AC Service</SelectItem>
                    <SelectItem value="fridge-repair">Fridge Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider">
                  Product Interest
                </Label>
                <Select
                  value={form.productInterest}
                  onValueChange={set("productInterest")}
                >
                  <SelectTrigger data-ocid="order.select">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
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

            {/* Row 4: Address */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-address"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Service Address *
              </Label>
              <Input
                id="order-address"
                placeholder="Your full address in Kolkata"
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                required
                data-ocid="order.input"
              />
            </div>

            {/* Row 5: Preferred Date */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-date"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Preferred Date
              </Label>
              <Input
                id="order-date"
                type="date"
                value={form.preferredDate}
                onChange={(e) => set("preferredDate")(e.target.value)}
                data-ocid="order.input"
              />
            </div>

            {/* Row 6: Notes */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-notes"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Additional Notes
              </Label>
              <Textarea
                id="order-notes"
                rows={4}
                placeholder="Describe your issue or requirements in detail..."
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                data-ocid="order.textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="uppercase text-xs font-bold tracking-wider bg-primary hover:bg-primary/90 text-white w-full py-3"
              data-ocid="order.submit_button"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>

            <p
              className="text-xs text-center"
              style={{ color: "oklch(0.55 0.01 270)" }}
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
      className="py-20"
      style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Payment Options</h2>
          <p className="section-subtitle">
            We make payment easy and flexible — choose what works best for you.
          </p>
        </motion.div>

        {/* Notice banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-10 rounded-xl px-6 py-4 flex items-center gap-3 text-sm font-medium"
          style={{
            backgroundColor: "oklch(0.88 0.07 145)",
            color: "oklch(0.28 0.08 145)",
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
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              data-ocid={`payment.item.${i + 1}`}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{ backgroundColor: "oklch(0.93 0.04 220)" }}
              >
                <m.Icon
                  className="w-7 h-7"
                  style={{ color: "oklch(0.55 0.12 230)" }}
                />
              </div>

              <h3
                className="font-bold text-base uppercase tracking-wider mb-1"
                style={{ color: "oklch(0.2 0.01 270)" }}
              >
                {m.title}
              </h3>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "oklch(0.55 0.12 230)" }}
              >
                {m.subtitle}
              </p>
              <p
                className="text-sm leading-relaxed mb-5 flex-1"
                style={{ color: "oklch(0.45 0.01 270)" }}
              >
                {m.description}
              </p>

              {/* Detail block */}
              {m.detail && (
                <div
                  className="rounded-lg px-4 py-3 text-xs font-mono break-all mb-4"
                  style={{
                    backgroundColor: "oklch(0.96 0.025 220)",
                    color: "oklch(0.3 0.01 270)",
                  }}
                >
                  {m.detail}
                </div>
              )}

              {/* Copy button for UPI */}
              {m.action === "copy" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyUpi}
                  className="w-full uppercase text-xs font-bold tracking-wider gap-2"
                  style={{
                    borderColor: "oklch(0.55 0.12 230)",
                    color: "oklch(0.55 0.12 230)",
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

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm mb-4" style={{ color: "oklch(0.45 0.01 270)" }}>
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
                backgroundColor: "oklch(0.55 0.15 145)",
                color: "white",
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

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
              className="flex flex-col gap-5"
              data-ocid="contact.panel"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  data-ocid="contact.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  data-ocid="contact.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your service needs..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  data-ocid="contact.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="uppercase text-xs font-bold tracking-wider bg-primary hover:bg-primary/90 text-white"
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
                className="font-bold text-lg uppercase tracking-wider mb-6"
                style={{ color: "oklch(0.2 0.01 270)" }}
              >
                Contact Information
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
                      style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "oklch(0.55 0.12 230)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "oklch(0.2 0.01 270)" }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm hover:underline"
                          style={{ color: "oklch(0.55 0.01 270)" }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          className="text-sm"
                          style={{ color: "oklch(0.55 0.01 270)" }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: "oklch(0.96 0.025 220)" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "oklch(0.55 0.12 230)" }}
              >
                ⏰ Business Hours
              </p>
              <div
                className="mt-2 text-sm space-y-1"
                style={{ color: "oklch(0.4 0.01 270)" }}
              >
                <p>Monday – Friday: 7:00 AM – 6:00 PM</p>
                <p>Saturday: 8:00 AM – 4:00 PM</p>
                <p>Emergency Service: 24/7</p>
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
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "oklch(0.25 0.02 270)" }}
      className="text-gray-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/uploads/screenshot_20250326_050441_contacts-019d3b0c-4668-7165-b8d6-ba06ce98f43d-1.jpg"
                alt="Cool Refrigeration Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
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
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-primary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(l.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
              Our Services
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
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

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
              Contact Info
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "oklch(0.75 0.1 220)" }}
                />
                <span>2D Picnic Garden, 3rd Lane, Tiljala, Kolkata 700039</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.75 0.1 220)" }}
                />
                <a
                  href="tel:+918276938625"
                  className="hover:text-white transition-colors"
                >
                  +91 82769 38625
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.75 0.1 220)" }}
                />
                <a
                  href="mailto:coolrefrigeration318@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  coolrefrigeration318@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {year} Cool Refrigeration. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
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
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "oklch(0.55 0.12 230)" }}
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
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Header />
      <main>
        <Hero />
        <Services />
        <OwnerSection />
        <Products />
        <MaintenanceBand />
        <Testimonials />
        <OrderSection />
        <PaymentSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
