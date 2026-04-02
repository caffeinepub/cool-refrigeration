function AdminMessageCard({
  message,
  cardStyle,
  onReplied,
  onDeleted,
}: {
  message: AdminChatMessage;
  cardStyle: React.CSSProperties;
  onReplied: () => void;
  onDeleted: () => void;
}) {
  const { actor } = useActor();
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const safe = replyText.trim();
    if (!safe || !actor) return;
    setSending(true);
    try {
      await actor.replyToChat(message.id, safe);
      toast.success("Reply sent!");
      setReplyText("");
      onReplied();
    } catch {
      toast.error("Failed to send reply.");
    }
    setSending(false);
  };

  return (
    <div
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
          <div>
            <p className="font-semibold text-sm text-white">{message.name}</p>
            <p className="text-xs" style={{ color: "oklch(0.45 0.04 250)" }}>
              Session: {message.sessionId.slice(0, 8)}...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-xs" style={{ color: "oklch(0.45 0.04 250)" }}>
            {formatTs(message.timestamp)}
          </p>
          <button
            onClick={() => {
              onDeleted();
              if (actor) actor.deleteChatMessage(BigInt(message.id)).catch(() => {});
            }}
            className="inline-flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-red-900/20"
            style={{
              color: "oklch(0.7 0.2 25)",
              border: "1px solid oklch(0.55 0.2 25 / 0.4)",
            }}
            type="button"
            title="Delete message"
            data-ocid="admin.messages.delete_button"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "oklch(0.72 0.04 250)" }}
      >
        {message.message}
      </p>
      {message.reply ? (
        <div
          className="rounded-lg p-3 flex flex-col gap-1"
          style={{
            background: "oklch(0.65 0.12 145 / 0.08)",
            border: "1px solid oklch(0.65 0.12 145 / 0.3)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle
              className="w-3 h-3"
              style={{ color: "oklch(0.65 0.12 145)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "oklch(0.65 0.12 145)" }}
            >
              Replied
            </span>
          </div>
          <p className="text-xs text-white leading-relaxed">{message.reply}</p>
        </div>
      ) : (
        <form
          onSubmit={handleReply}
          className="flex gap-2"
          data-ocid="admin.messages.row"
        >
          <Input
            placeholder="Type a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
            className="text-xs flex-1"
            style={{
              background: "oklch(0.10 0.04 250)",
              borderColor: "oklch(0.28 0.06 250)",
              color: "white",
            }}
            data-ocid="admin.messages.input"
          />
          <Button
            type="submit"
            size="sm"
            disabled={sending}
            className="text-xs"
            style={{ background: "oklch(0.55 0.18 230)", color: "white" }}
            data-ocid="admin.messages.submit_button"
          >
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Send"}
          </Button>
        </form>
      )}
    </div>
  );
}

const CACHE_ORDERS = "admin_orders_cache";
const CACHE_REVIEWS = "admin_reviews_cache";
const CACHE_MESSAGES = "admin_messages_cache";

function readCache<T>(key: string): T[] {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {}
  return [];
}

function writeCache<T>(key: string, data: T[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={i} style={{ borderColor: "oklch(0.22 0.04 250)" }}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <div
                className="h-3 rounded animate-pulse"
                style={{ background: "oklch(0.22 0.04 250)", width: j === 0 ? "80px" : "60px" }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 flex flex-col gap-3 animate-pulse"
          style={{
            background: "oklch(0.17 0.04 250)",
            border: "1px solid oklch(0.55 0.18 230 / 0.3)",
            borderRadius: "1rem",
          }}
        >
          <div className="h-3 rounded w-1/2" style={{ background: "oklch(0.22 0.04 250)" }} />
          <div className="h-3 rounded w-full" style={{ background: "oklch(0.22 0.04 250)" }} />
          <div className="h-3 rounded w-3/4" style={{ background: "oklch(0.22 0.04 250)" }} />
        </div>
      ))}
    </div>
  );
}

function AdminPanel() {
  const { actor } = useActor();
  const [orders, setOrders] = useState<AdminOrder[]>(() => readCache<AdminOrder>(CACHE_ORDERS));
  const [reviews, setReviews] = useState<AdminReview[]>(() => readCache<AdminReview>(CACHE_REVIEWS));
  const [chatMessages, setChatMessages] = useState<AdminChatMessage[]>(() => readCache<AdminChatMessage>(CACHE_MESSAGES));
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const fetchAll = (forceRefresh = false) => {
    if (!actor) return;
    if (forceRefresh) {
      sessionStorage.removeItem(CACHE_ORDERS);
      sessionStorage.removeItem(CACHE_REVIEWS);
      sessionStorage.removeItem(CACHE_MESSAGES);
      setLoadingOrders(true);
      setLoadingReviews(true);
      setLoadingMessages(true);
    }
    actor.getAllOrders().then((ords) => {
      const data = (ords ?? []) as AdminOrder[];
      setOrders(data);
      writeCache(CACHE_ORDERS, data);
      setLoadingOrders(false);
    }).catch(() => setLoadingOrders(false));
    actor.getAllReviews().then((revs) => {
      const data = (revs ?? []) as AdminReview[];
      setReviews(data);
      writeCache(CACHE_REVIEWS, data);
      setLoadingReviews(false);
    }).catch(() => setLoadingReviews(false));
    actor.getAllChatMessages().then((msgs) => {
      const data = (msgs ?? []) as AdminChatMessage[];
      setChatMessages(data);
      writeCache(CACHE_MESSAGES, data);
      setLoadingMessages(false);
    }).catch(() => setLoadingMessages(false));
  };

  useEffect(() => {
    if (!actor) return;
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              onClick={() => fetchAll(true)}
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
              data-ocid="admin.delete_all_button"
              onClick={() => {
                setOrders([]);
                setChatMessages([]);
                writeCache(CACHE_ORDERS, []);
                writeCache(CACHE_MESSAGES, []);
                if (actor) {
                  Promise.all([
                    actor.clearAllOrders(),
                    actor.clearAllChatMessages(),
                  ]).catch(() => {});
                }
              }}
              size="sm"
              className="text-xs uppercase tracking-wider"
              style={{
                background: "oklch(0.45 0.18 25)",
                color: "white",
                border: "none",
              }}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete All
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
            <div className="flex justify-end mb-3">
              <button
                onClick={() => {
                  setOrders([]);
                  writeCache(CACHE_ORDERS, []);
                  if (actor) actor.clearAllOrders().catch(() => {});
                }}
                className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs border transition-colors hover:bg-red-900/20"
                style={{
                  borderColor: "oklch(0.55 0.2 25 / 0.6)",
                  color: "oklch(0.7 0.2 25)",
                }}
                type="button"
                data-ocid="admin.orders.delete_button"
              >
                🗑 Clear All Orders
              </button>
            </div>
            <div style={cardStyle} className="overflow-hidden">
              {loadingOrders ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "oklch(0.28 0.06 250)" }}>
                        {["Date/Time", "Name", "Phone", "Email", "Service", "Product", "Address", "Preferred Date", "Notes", "Actions"].map((h) => (
                          <TableHead
                            key={h}
                            className="text-xs uppercase tracking-wider"
                            style={{ color: "oklch(0.75 0.14 220)", whiteSpace: "nowrap" }}
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SkeletonRows cols={10} />
                    </TableBody>
                  </Table>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16" data-ocid="admin.orders.empty_state">
                  <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)" }}>No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "oklch(0.28 0.06 250)" }}>
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
                              <button
                                onClick={() => {
                                  setOrders((prev) => prev.filter((x) => x.id !== o.id));
                                  if (actor) actor.deleteOrder(BigInt(o.id)).catch(() => {});
                                }}
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs border transition-colors hover:bg-red-900/20"
                                style={{
                                  borderColor: "oklch(0.55 0.2 25 / 0.5)",
                                  color: "oklch(0.7 0.2 25)",
                                }}
                                type="button"
                                data-ocid="admin.order.delete_button"
                              >
                                🗑 Delete
                              </button>
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
            {loadingReviews ? (
              <SkeletonCards />
            ) : reviews.length === 0 ? (
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
            <div className="flex justify-end mb-3">
              <button
                onClick={() => {
                  setChatMessages([]);
                  writeCache(CACHE_MESSAGES, []);
                  if (actor) actor.clearAllChatMessages().catch(() => {});
                }}
                className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs border transition-colors hover:bg-red-900/20"
                style={{
                  borderColor: "oklch(0.55 0.2 25 / 0.6)",
                  color: "oklch(0.7 0.2 25)",
                }}
                type="button"
                data-ocid="admin.messages.delete_button"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All Messages
              </button>
            </div>
            {loadingMessages ? (
              <SkeletonCards />
            ) : chatMessages.length === 0 ? (
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
                  <AdminMessageCard
                    key={String(m.id)}
                    message={m}
                    cardStyle={cardStyle}
                    onReplied={() => {
                      if (actor) {
                        actor.getAllChatMessages().then((msgs) => {
                          if (msgs) {
                            const data = msgs as AdminChatMessage[];
                            setChatMessages(data);
                            writeCache(CACHE_MESSAGES, data);
                          }
                        });
                      }
                    }}
                    onDeleted={() => {
                      setChatMessages((prev) => prev.filter((x) => x.id !== m.id));
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

