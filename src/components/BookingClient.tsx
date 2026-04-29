/** @jsxImportSource preact */
import { useState, useEffect, useMemo } from "preact/hooks";

type Locale = "vi" | "en";

interface Room {
  slug: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: string;
  pricePerNightUSD: number;
  beds: string;
  size: string;
  image: string;
}

const ROOMS: Room[] = [
  { slug: "lan-trang", name: "Lan Trắng", type: "Garden Suite", capacity: 2, pricePerNight: "2,350,000 ₫", pricePerNightUSD: 98, beds: "1 Queen", size: "28 m²", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" },
  { slug: "lan-vang", name: "Lan Vàng", type: "Heritage Room", capacity: 2, pricePerNight: "1,870,000 ₫", pricePerNightUSD: 78, beds: "1 Queen", size: "22 m²", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" },
  { slug: "lan-tim", name: "Lan Tím", type: "Family Suite", capacity: 4, pricePerNight: "3,240,000 ₫", pricePerNightUSD: 135, beds: "2 Queen", size: "35 m²", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80" },
  { slug: "lan-xanh", name: "Lan Xanh", type: "Patio Room", capacity: 2, pricePerNight: "2,040,000 ₫", pricePerNightUSD: 85, beds: "1 Queen", size: "24 m²", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" },
  { slug: "lan-do", name: "Lan Đỏ", type: "Honeymoon Suite", capacity: 2, pricePerNight: "3,000,000 ₫", pricePerNightUSD: 125, beds: "1 King", size: "30 m²", image: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=800&q=80" },
];

interface Props {
  locale: Locale;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function nightsBetween(checkin: string, checkout: string): number {
  if (!checkin || !checkout) return 0;
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  return Math.max(0, Math.round((b - a) / (24 * 60 * 60 * 1000)));
}

function generateBookingId() {
  const d = new Date();
  return `ML-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export default function BookingClient({ locale }: Props) {
  const isVi = locale === "vi";
  const [step, setStep] = useState(1);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomSlug, setRoomSlug] = useState<string>("");

  // Read preselected room from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const r = params.get("room");
    if (r && ROOMS.find((x) => x.slug === r)) {
      setRoomSlug(r);
      setStep(3);
    }
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Defaults: tomorrow + 3 nights
  useEffect(() => {
    if (!checkin) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckin(formatDateInput(tomorrow));
      const out = new Date(tomorrow);
      out.setDate(out.getDate() + 3);
      setCheckout(formatDateInput(out));
    }
  }, []);

  const totalGuests = adults + children;
  const nights = nightsBetween(checkin, checkout);
  const room = useMemo(() => ROOMS.find((r) => r.slug === roomSlug), [roomSlug]);

  const availableRooms = ROOMS.filter((r) => r.capacity >= totalGuests);

  const labels = isVi
    ? {
        step1: "Bước 1 — Ngày & khách",
        step2: "Bước 2 — Chọn phòng",
        step3: "Bước 3 — Thông tin liên hệ",
        next: "Tiếp theo",
        back: "Quay lại",
        confirm: "Xác nhận đặt phòng",
        checkin: "Check-in",
        checkout: "Check-out",
        adults: "Người lớn",
        children: "Trẻ em",
        nights: "đêm",
        guestsTotal: "Tổng khách",
        availableRooms: "Phòng có sẵn",
        selectRoom: "Chọn phòng",
        bedsLabel: "Giường",
        sizeLabel: "Diện tích",
        capacityLabel: "Sức chứa",
        name: "Họ tên",
        phone: "Số điện thoại",
        email: "Email",
        notes: "Yêu cầu đặc biệt (tùy chọn)",
        notesPlaceholder: "Đón sân bay, phòng tầng cao, kỷ niệm...",
        confirmedTitle: "Đã đặt phòng thành công",
        confirmedSub: "Chúng tôi sẽ xác nhận qua Zalo trong 1 giờ làm việc.",
        bookingNumber: "Mã đặt phòng",
        another: "Đặt phòng khác",
        summary: "Tóm tắt",
        room: "Phòng",
        dates: "Thời gian",
        guests: "Khách",
        contact: "Liên hệ",
        total: "Tổng cộng",
        directDiscount: "(Đặt trực tiếp tiết kiệm 17%)",
        person: "người",
        capacityWarn: "Phòng này không đủ sức chứa cho số khách của bạn.",
      }
    : {
        step1: "Step 1 — Dates & guests",
        step2: "Step 2 — Choose room",
        step3: "Step 3 — Contact details",
        next: "Next",
        back: "Back",
        confirm: "Confirm booking",
        checkin: "Check-in",
        checkout: "Check-out",
        adults: "Adults",
        children: "Children",
        nights: "nights",
        guestsTotal: "Total guests",
        availableRooms: "Available rooms",
        selectRoom: "Select room",
        bedsLabel: "Beds",
        sizeLabel: "Size",
        capacityLabel: "Sleeps",
        name: "Full name",
        phone: "Phone number",
        email: "Email",
        notes: "Special requests (optional)",
        notesPlaceholder: "Airport pickup, high floor, anniversary...",
        confirmedTitle: "Booking confirmed",
        confirmedSub: "We'll confirm via Zalo within one business hour.",
        bookingNumber: "Booking ID",
        another: "Make another booking",
        summary: "Summary",
        room: "Room",
        dates: "Dates",
        guests: "Guests",
        contact: "Contact",
        total: "Total",
        directDiscount: "(Direct booking saves 17%)",
        person: "guest",
        capacityWarn: "This room doesn't have enough capacity for your party.",
      };

  const canProceed = () => {
    if (step === 1) return Boolean(checkin && checkout && nights > 0 && totalGuests > 0);
    if (step === 2) return Boolean(roomSlug && room && room.capacity >= totalGuests);
    if (step === 3) return Boolean(name && phone);
    return false;
  };

  const handleConfirm = () => {
    const id = generateBookingId();
    setBookingId(id);
    try {
      const existing = JSON.parse(localStorage.getItem("maisonLanBookings") || "[]");
      existing.push({
        id,
        room: room?.slug,
        checkin,
        checkout,
        nights,
        adults,
        children,
        name,
        phone,
        email,
        notes,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("maisonLanBookings", JSON.stringify(existing));
    } catch {}
  };

  const reset = () => {
    setStep(1);
    setRoomSlug("");
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setBookingId(null);
  };

  if (bookingId && room) {
    return (
      <div class="max-w-2xl mx-auto py-12 text-center">
        <p class="font-mono text-[11px] tracking-[0.22em] uppercase text-jade-deep mb-5">CONFIRMED</p>
        <h2 class="font-display text-3xl md:text-4xl text-ink mb-4">{labels.confirmedTitle}</h2>
        <p class="text-base text-ink-soft mb-10 leading-relaxed">{labels.confirmedSub}</p>
        <div class="border border-ink/15 p-8 mb-10 inline-block text-left">
          <p class="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft mb-2">{labels.bookingNumber}</p>
          <p class="font-mono text-2xl tabular text-ink mb-6">{bookingId}</p>
          <dl class="space-y-3 text-sm min-w-[280px]">
            <div class="flex justify-between gap-6"><dt class="text-ink-soft">{labels.room}</dt><dd class="text-ink">{room.name}</dd></div>
            <div class="flex justify-between gap-6"><dt class="text-ink-soft">{labels.dates}</dt><dd class="text-ink font-mono tabular">{checkin} → {checkout}</dd></div>
            <div class="flex justify-between gap-6"><dt class="text-ink-soft">{labels.guests}</dt><dd class="text-ink">{adults} + {children}</dd></div>
            <div class="flex justify-between gap-6"><dt class="text-ink-soft">{labels.contact}</dt><dd class="text-ink font-mono tabular">{phone}</dd></div>
            <div class="flex justify-between gap-6 pt-3 border-t border-ink/10"><dt class="text-ink font-medium">{labels.total}</dt><dd class="text-ink price text-lg price-brass">{room.pricePerNight} × {nights} {labels.nights}</dd></div>
          </dl>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <button onClick={reset} class="inline-flex items-center gap-2 bg-jade-deep text-cream px-7 py-3 text-sm tracking-wide hover:bg-ink transition-colors">
            {labels.another}
          </button>
          <a href="/" class="inline-flex items-center gap-2 border border-ink text-ink px-7 py-3 text-sm tracking-wide hover:bg-ink hover:text-cream transition-colors">
            ← Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-3xl mx-auto py-8">
      {/* Progress */}
      <div class="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((n) => (
          <div key={n} class={`flex-1 h-0.5 ${n <= step ? "bg-jade-deep" : "bg-ink/10"} transition-colors`} />
        ))}
      </div>
      <p class="font-mono text-[11px] tracking-[0.22em] uppercase text-jade-deep mb-3">
        {step === 1 && labels.step1}
        {step === 2 && labels.step2}
        {step === 3 && labels.step3}
      </p>

      {/* Step 1: Dates & guests */}
      {step === 1 && (
        <div class="space-y-6">
          <h2 class="font-display text-2xl md:text-3xl text-ink mb-6">
            {isVi ? "Khi nào & bao nhiêu người?" : "When and how many?"}
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.checkin}</label>
              <input type="date" value={checkin} onChange={(e) => setCheckin((e.target as HTMLInputElement).value)} class="w-full px-4 py-2.5 border border-ink/15 bg-cream/50 focus:outline-none focus:border-jade-deep transition-colors" />
            </div>
            <div>
              <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.checkout}</label>
              <input type="date" value={checkout} min={checkin} onChange={(e) => setCheckout((e.target as HTMLInputElement).value)} class="w-full px-4 py-2.5 border border-ink/15 bg-cream/50 focus:outline-none focus:border-jade-deep transition-colors" />
            </div>
          </div>

          {nights > 0 && (
            <p class="font-mono text-xs tracking-[0.18em] uppercase text-jade-deep">
              {nights} {labels.nights}
            </p>
          )}

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-ink/10">
            <div>
              <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.adults}</label>
              <div class="inline-flex items-center border border-ink/15">
                <button onClick={() => setAdults(Math.max(1, adults - 1))} class="w-10 h-10 hover:bg-cream-soft text-ink transition-colors">−</button>
                <span class="px-5 font-mono text-sm tabular min-w-[2rem] text-center">{adults}</span>
                <button onClick={() => setAdults(Math.min(6, adults + 1))} class="w-10 h-10 hover:bg-cream-soft text-ink transition-colors">+</button>
              </div>
            </div>
            <div>
              <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.children}</label>
              <div class="inline-flex items-center border border-ink/15">
                <button onClick={() => setChildren(Math.max(0, children - 1))} class="w-10 h-10 hover:bg-cream-soft text-ink transition-colors">−</button>
                <span class="px-5 font-mono text-sm tabular min-w-[2rem] text-center">{children}</span>
                <button onClick={() => setChildren(Math.min(4, children + 1))} class="w-10 h-10 hover:bg-cream-soft text-ink transition-colors">+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Room selection */}
      {step === 2 && (
        <div>
          <h2 class="font-display text-2xl md:text-3xl text-ink mb-3">
            {isVi ? "Phòng nào hợp với bạn?" : "Which room suits you?"}
          </h2>
          <p class="text-sm text-ink-soft mb-6 font-mono tracking-wider">
            {checkin} → {checkout} · {nights} {labels.nights} · {adults}+{children} {labels.person}
          </p>

          <div class="space-y-3">
            {availableRooms.map((r) => (
              <button
                key={r.slug}
                onClick={() => setRoomSlug(r.slug)}
                class={`w-full border text-left transition-all flex gap-4 ${roomSlug === r.slug ? "border-jade-deep bg-cream-soft/60" : "border-ink/15 hover:border-ink/40"}`}
              >
                <div class="w-28 sm:w-36 aspect-[4/3] overflow-hidden bg-cream-soft shrink-0">
                  <img src={r.image} alt={r.name} class="w-full h-full object-cover" loading="lazy" />
                </div>
                <div class="flex-1 p-4 min-w-0">
                  <p class="font-mono text-[10px] tracking-[0.2em] uppercase text-jade-deep mb-1">{r.type}</p>
                  <h3 class="font-display text-xl text-ink mb-2">{r.name}</h3>
                  <p class="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft mb-2">
                    {r.beds} · {r.size} · {labels.capacityLabel} {r.capacity}
                  </p>
                  <p class="price text-base price-brass">{r.pricePerNight} <span class="text-ink-soft text-xs font-sans">{isVi ? "/ đêm" : "/ night"}</span></p>
                </div>
              </button>
            ))}
            {availableRooms.length === 0 && (
              <p class="text-base text-ink-soft italic-display py-10 text-center">{labels.capacityWarn}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Contact info */}
      {step === 3 && room && (
        <div class="space-y-6">
          <h2 class="font-display text-2xl md:text-3xl text-ink mb-6">
            {isVi ? "Thông tin của bạn" : "Your contact details"}
          </h2>

          {/* Summary card */}
          <div class="bg-cream-soft/50 border border-ink/10 p-5 mb-6">
            <p class="eyebrow mb-3">{labels.summary}</p>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between gap-3"><dt class="text-ink-soft">{labels.room}</dt><dd class="text-ink text-right">{room.name} <span class="text-ink-soft text-xs">({room.type})</span></dd></div>
              <div class="flex justify-between gap-3"><dt class="text-ink-soft">{labels.dates}</dt><dd class="text-ink text-right font-mono tabular">{checkin} → {checkout}</dd></div>
              <div class="flex justify-between gap-3"><dt class="text-ink-soft">{labels.nights}</dt><dd class="text-ink text-right font-mono tabular">{nights}</dd></div>
              <div class="flex justify-between gap-3"><dt class="text-ink-soft">{labels.guests}</dt><dd class="text-ink text-right">{adults} + {children}</dd></div>
              <div class="flex justify-between gap-3 pt-3 border-t border-ink/10">
                <dt class="text-ink font-medium">{labels.total}</dt>
                <dd class="text-right">
                  <span class="price text-lg price-brass">{room.pricePerNight} × {nights}</span>
                  <p class="text-[10px] font-mono uppercase text-jade-deep tracking-wider mt-1">{labels.directDiscount}</p>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.name} <span class="text-lacquer">*</span></label>
            <input type="text" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} required class="w-full px-4 py-2.5 border border-ink/15 bg-cream/50 focus:outline-none focus:border-jade-deep" />
          </div>
          <div>
            <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.phone} <span class="text-lacquer">*</span></label>
            <input type="tel" value={phone} onInput={(e) => setPhone((e.target as HTMLInputElement).value)} required class="w-full px-4 py-2.5 border border-ink/15 bg-cream/50 focus:outline-none focus:border-jade-deep font-mono tabular" />
          </div>
          <div>
            <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.email}</label>
            <input type="email" value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} class="w-full px-4 py-2.5 border border-ink/15 bg-cream/50 focus:outline-none focus:border-jade-deep" />
          </div>
          <div>
            <label class="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft block mb-2">{labels.notes}</label>
            <textarea
              value={notes}
              onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
              placeholder={labels.notesPlaceholder}
              rows={3}
              class="w-full px-4 py-2.5 border border-ink/15 bg-cream/50 focus:outline-none focus:border-jade-deep"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div class="flex items-center justify-between gap-4 mt-12 pt-6 border-t border-ink/10">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          class="font-mono text-xs tracking-[0.18em] uppercase text-ink-soft hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← {labels.back}
        </button>
        {step < 3 ? (
          <button
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            class="inline-flex items-center gap-2 bg-jade-deep text-cream px-6 py-3 text-sm tracking-wide hover:bg-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {labels.next}<span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={!canProceed()}
            class="inline-flex items-center gap-2 bg-jade-deep text-cream px-6 py-3 text-sm tracking-wide hover:bg-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {labels.confirm}<span aria-hidden="true">✓</span>
          </button>
        )}
      </div>
    </div>
  );
}
