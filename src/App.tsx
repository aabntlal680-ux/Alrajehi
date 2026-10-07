import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDot,
  CircleX,
  CreditCard,
  Database,
  FileText,
  Globe2,
  House,
  Info,
  Landmark,
  Menu,
  ReceiptText,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UserPlus,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ElementType;
  children?: { label: string; icon: React.ElementType }[];
};

const navItems: NavItem[] = [
  { label: "الرئيسية", icon: House },
  {
    label: "التحويلات",
    icon: ArrowLeftRight,
    children: [
      { label: "تحويل دولي", icon: Globe2 },
      { label: "تحويل محلي", icon: CircleDot },
      { label: "تحويل مستفيد جديد", icon: UserPlus },
    ],
  },
  { label: "الحسابات", icon: WalletCards },
  { label: "البطاقات", icon: CreditCard },
  { label: "المدفوعات", icon: ReceiptText },
  { label: "التمويل", icon: Database },
  { label: "الخدمات الإلكترونية", icon: Settings },
  { label: "التقارير", icon: FileText },
  { label: "الإعدادات", icon: Settings },
];

const searchableServices = [
  "تحويل دولي",
  "تحويل محلي",
  "تحويل مستفيد جديد",
  "الحسابات",
  "البطاقات",
  "المدفوعات",
  "التمويل",
  "الخدمات الإلكترونية",
  "التقارير",
  "الإعدادات",
];

const currencies = [
  { code: "AED", label: "درهم إماراتي" },
  { code: "USD", label: "دولار أمريكي" },
  { code: "EUR", label: "يورو" },
  { code: "GBP", label: "جنيه إسترليني" },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, value || 0));

function BankLogo() {
  return (
    <div className="brand-logo" aria-label="مصرف الراجحي">
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <path d="M22 3 9 10v14l13 8 13-8V10L22 3Zm0 7 6 4-6 4-6-4 6-4Zm-8 10 5 3v6l-5-3v-6Zm16 6-5 3v-6l5-3v6Z" />
        <path d="m9 27 13 8 13-8v7l-13 7-13-7v-7Z" />
      </svg>
      <strong>مصرف الراجحي</strong>
    </div>
  );
}

function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: string;
  onNavigate: (label: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <button
        className={`drawer-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
        aria-label="إغلاق القائمة"
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <BankLogo />
          <button className="mobile-close" onClick={onClose} aria-label="إغلاق">
            <X size={22} />
          </button>
        </div>
        <nav className="side-nav" aria-label="القائمة الرئيسية">
          {navItems.map((item) => {
            const Icon = item.icon;
            const parentActive = active === item.label || item.children?.some((child) => child.label === active);
            return (
              <div key={item.label}>
                <button
                  className={`nav-item ${parentActive && !item.children ? "active" : ""}`}
                  onClick={() => !item.children && (onNavigate(item.label), onClose())}
                >
                  <Icon size={21} strokeWidth={2.1} />
                  <span>{item.label}</span>
                </button>
                {item.children && (
                  <div className="sub-nav">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.label}
                          className={`sub-item ${active === child.label ? "active" : ""}`}
                          onClick={() => {
                            onNavigate(child.label);
                            onClose();
                          }}
                        >
                          <ChildIcon size={18} />
                          <span>{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-security">
          <ShieldCheck size={18} />
          <span>اتصال آمن ومشفر</span>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onNavigate }: { onMenu: () => void; onNavigate: (s: string) => void }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const results = searchableServices.filter((service) => service.includes(query.trim()));

  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="فتح القائمة">
        <Menu size={24} />
      </button>
      <div className="mobile-brand">المباشر</div>
      <div className="search-wrap">
        <Search size={20} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          placeholder="البحث في الخدمات والمعاملات..."
          aria-label="البحث في الخدمات والمعاملات"
        />
        {focused && query && (
          <div className="search-results">
            {results.length ? (
              results.slice(0, 5).map((result) => (
                <button
                  key={result}
                  onMouseDown={() => {
                    onNavigate(result);
                    setQuery("");
                  }}
                >
                  <Search size={15} />
                  {result}
                </button>
              ))
            ) : (
              <p>لا توجد خدمات مطابقة</p>
            )}
          </div>
        )}
      </div>
      <div className="header-actions">
        <button className="header-icon" aria-label="الإعدادات"><Settings size={22} /></button>
        <button className="header-icon notification" aria-label="التنبيهات"><Bell size={22} /><span /></button>
        <div className="welcome">
          <div className="avatar"><UserRound size={22} /></div>
          <div><span>مرحباً بك</span><strong>عميل المصرف</strong></div>
        </div>
      </div>
    </header>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["بيانات التحويل", "المراجعة والتأكيد", "إصدار الإيصال"];
  return (
    <div className="stepper" aria-label="خطوات التحويل">
      {steps.map((label, index) => {
        const number = index + 1;
        const done = number < step;
        const active = number === step;
        return (
          <div className={`step ${active ? "current" : ""} ${done ? "done" : ""}`} key={label}>
            <div className="step-mark">{done ? <Check size={17} /> : number}</div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function InfoCell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`info-cell ${className}`}>
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return <h2 className="section-title"><Icon size={19} />{children}</h2>;
}

function Summary({ amount, fee, step, onSend, onCancel }: { amount: number; fee: number; step: number; onSend: () => void; onCancel: () => void }) {
  return (
    <aside className="summary-panel">
      <h2><ArrowLeftRight size={20} /> ملخص التحويل</h2>
      <dl>
        <div><dt>المبلغ الإجمالي</dt><dd>{formatMoney(amount)} <small>SAR</small></dd></div>
        <div><dt>الرسوم</dt><dd>{formatMoney(fee)} <small>SAR</small></dd></div>
        <div className="summary-total"><dt>المبلغ المرسل</dt><dd>{formatMoney(amount - fee)} <small>SAR</small></dd></div>
      </dl>
      <button className="primary-button" onClick={onSend} disabled={step === 3}>
        {step === 3 ? <Check size={19} /> : <Send size={19} />}
        {step === 1 ? "إرسال التحويل" : step === 2 ? "تأكيد وإتمام التحويل" : "تم إصدار الإيصال"}
      </button>
      <button className="secondary-button" onClick={onCancel} disabled={step === 3}>
        <CircleX size={19} /> إلغاء
      </button>
      <p className="summary-note">بالضغط على الإرسال فإنك توافق على الشروط والأحكام</p>
    </aside>
  );
}

function TransferPage() {
  const [amount, setAmount] = useState(1000000);
  const [currency, setCurrency] = useState("AED");
  const [date, setDate] = useState("2026-09-29");
  const [step, setStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const fee = useMemo(() => Math.round(amount * 0.00126 * 100) / 100, [amount]);
  const completed = step === 3;
  const displayDate = date.split("-").join("/");

  const confirmAction = () => {
    setModalOpen(false);
    setStep((current) => Math.min(3, current + 1));
  };

  return (
    <>
      <div className="title-band">
        <div className="page-heading">
          <Globe2 size={32} />
          <div><h1>تحويل دولي</h1><p>إجراء تحويل مالي إلى خارج المملكة</p></div>
        </div>
        <Stepper step={step} />
      </div>

      {completed && (
        <div className="success-banner">
          <div className="success-icon"><Check size={22} /></div>
          <div><strong>تم إكمال عملية التحويل بنجاح</strong><span>تم إصدار الإيصال وحفظ العملية في سجل التحويلات.</span></div>
        </div>
      )}

      <div className="content-columns">
        <div className="transfer-content">
          <div className="top-details">
            <section className="data-section">
              <SectionTitle icon={FileText}>تفاصيل التحويل</SectionTitle>
              <InfoCell label="اسم المستفيد">كرامة سالم عوض آل عفيدر الراشدي</InfoCell>
              <InfoCell label="رقم الهوية / الإقامة"><span dir="ltr">XXXXXXXXX</span></InfoCell>
              <InfoCell label="الجنسية">الإمارات العربية المتحدة</InfoCell>
            </section>

            <section className="data-section">
              <SectionTitle icon={ArrowLeftRight}>بيانات التحويل</SectionTitle>
              <label className="field-cell">
                <span>المبلغ</span>
                <div className="amount-input" dir="ltr">
                  <input type="number" min="0" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                  <b>SAR</b>
                </div>
              </label>
              <InfoCell label="نوع التحويل">تحويل دولي</InfoCell>
              <label className="field-cell">
                <span>العملة</span>
                <div className="select-wrap">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {currencies.map((item) => <option key={item.code} value={item.code}>{item.label} ({item.code})</option>)}
                  </select>
                  <ChevronDown size={18} />
                </div>
              </label>
            </section>

            <section className="data-section">
              <SectionTitle icon={FileText}>معلومات إضافية</SectionTitle>
              <InfoCell label="نوع الرسوم">رسوم خدمات تفعيل عملية تحويل</InfoCell>
              <label className="field-cell">
                <span>تاريخ التحويل</span>
                <div className="date-wrap">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  <CalendarDays size={18} />
                </div>
              </label>
              <InfoCell label="حالة التحويل">
                <span className={`status-badge ${completed ? "success" : "danger"}`}>
                  {completed ? <Check size={14} /> : <X size={14} />}
                  {completed ? "مكتملة" : "لم يتم إكمالها"}
                </span>
              </InfoCell>
            </section>
          </div>

          <section className={`status-section ${completed ? "is-complete" : ""}`}>
            <SectionTitle icon={Info}>حالة التحويل</SectionTitle>
            <div className="status-alert">
              <div className="alert-icon">{completed ? <Check size={18} /> : <X size={18} />}</div>
              <div>
                <strong>{completed ? "تم إكمال عملية التحويل" : "لم يتم إكمال عملية التحويل"}</strong>
                <span>{completed ? "تم تحصيل الرسوم وإصدار الإيصال" : "يتم استكمال إجراءات التحويل"}</span>
              </div>
            </div>
            <div className="status-grid">
              <InfoCell label="نوع الرسوم">رسوم خدمات تفعيل عملية تحويل</InfoCell>
              <InfoCell label="المبلغ">{formatMoney(fee)} <span dir="ltr">SAR</span></InfoCell>
              <InfoCell label="الحالة">
                <span className={`status-badge ${completed ? "success" : "danger"}`}>
                  {completed ? <Check size={14} /> : <X size={14} />}
                  {completed ? "تم تحصيلها" : "لم يتم تحصيلها"}
                </span>
              </InfoCell>
              <InfoCell label="ملاحظات">الرسوم المستحقة لتفعيل عملية تحويل إلى دولة الإمارات</InfoCell>
            </div>
            <div className="fee-details-title"><Database size={18} /> تفاصيل الرسوم والمعلومات</div>
            <div className="fee-grid">
              <InfoCell label="الحد الأقصى للتحويل">غير محدد</InfoCell>
              <InfoCell label="الحد الأدنى للتحويل">1,000,000.00 <span dir="ltr">SAR</span></InfoCell>
              <InfoCell label="المصرف المستفيد"><span className="with-icon"><Building2 size={17} /> بنك أبوظبي التجاري (الإمارات)</span></InfoCell>
              <InfoCell label="الدولة المستفيدة"><span className="with-icon"><span className="uae-flag" /> الإمارات</span></InfoCell>
            </div>
          </section>
        </div>

        <Summary amount={amount} fee={fee} step={step} onSend={() => step < 3 && setModalOpen(true)} onCancel={() => setCancelOpen(true)} />
      </div>

      {(modalOpen || cancelOpen) && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-backdrop" onClick={() => { setModalOpen(false); setCancelOpen(false); }} aria-label="إغلاق" />
          <div className="modal-box">
            <button className="modal-close" onClick={() => { setModalOpen(false); setCancelOpen(false); }}><X size={20} /></button>
            {cancelOpen ? (
              <>
                <div className="modal-symbol warning"><CircleX size={27} /></div>
                <h2>إلغاء عملية التحويل؟</h2>
                <p>سيتم حذف البيانات المدخلة والعودة إلى الحالة الافتراضية.</p>
                <div className="modal-actions">
                  <button className="danger-button" onClick={() => { setAmount(1000000); setCurrency("AED"); setDate("2026-09-29"); setStep(1); setCancelOpen(false); }}>نعم، إلغاء العملية</button>
                  <button className="secondary-button" onClick={() => setCancelOpen(false)}>العودة</button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-symbol"><Send size={26} /></div>
                <h2>{step === 1 ? "مراجعة بيانات التحويل" : "تأكيد التحويل النهائي"}</h2>
                <p>{step === 1 ? "راجع المبلغ والرسوم قبل الانتقال إلى خطوة التأكيد." : "بعد التأكيد سيتم تحصيل الرسوم وإتمام العملية."}</p>
                <div className="modal-summary">
                  <div><span>المستفيد</span><strong>كرامة سالم عوض آل عفيدر الراشدي</strong></div>
                  <div><span>المبلغ</span><strong>{formatMoney(amount)} SAR</strong></div>
                  <div><span>الرسوم</span><strong>{formatMoney(fee)} SAR</strong></div>
                  <div><span>التاريخ</span><strong dir="ltr">{displayDate}</strong></div>
                </div>
                <div className="modal-actions">
                  <button className="primary-button" onClick={confirmAction}>{step === 1 ? "المتابعة إلى التأكيد" : "تأكيد وإتمام التحويل"}</button>
                  <button className="secondary-button" onClick={() => setModalOpen(false)}>رجوع</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function PlaceholderPage({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon"><Landmark size={36} /></div>
      <h1>{title}</h1>
      <p>تم الانتقال إلى خدمة {title}. هذه الصفحة متاحة ضمن العرض التفاعلي للنظام.</p>
      <button className="primary-button" onClick={onBack}>العودة إلى التحويل الدولي</button>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("تحويل دولي");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-shell" dir="rtl">
      <Sidebar active={active} onNavigate={setActive} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="workspace">
        <Header onMenu={() => setDrawerOpen(true)} onNavigate={setActive} />
        <main className="main-content">
          {active === "تحويل دولي" ? <TransferPage /> : <PlaceholderPage title={active} onBack={() => setActive("تحويل دولي")} />}
        </main>
      </div>
    </div>
  );
}