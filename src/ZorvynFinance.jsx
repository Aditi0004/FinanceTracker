import { useState, useEffect, useContext, createContext, useRef, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  LayoutGrid, ArrowLeftRight, Lightbulb, Receipt, Target, RefreshCw,
  ChevronLeft, ChevronRight, Bell, Sun, Moon, Download, Plus, Pencil,
  Trash2, Check, X, ChevronDown, TrendingUp, TrendingDown, Wallet,
  AlertCircle, Clock, PlayCircle, Search, Zap, Calendar,
  ArrowUpRight, ArrowDownRight, Heart, RotateCcw, Pause, Play
} from "lucide-react";

/* ─── Global CSS ─────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;font-family:'Sora',system-ui,sans-serif;background:#090d1a}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.09);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.18)}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.94) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes toastIn{from{opacity:0;transform:translateX(120%)}to{opacity:1;transform:translateX(0)}}
@keyframes shimmer{from{background-position:-700px 0}to{background-position:700px 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes spin{to{transform:rotate(360deg)}}
.shimmer{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:700px 100%;animation:shimmer 1.9s infinite}
.card{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
.card:hover{transform:translateY(-2px)!important;box-shadow:0 18px 50px rgba(0,0,0,.45)!important;border-color:rgba(79,126,249,.22)!important}
.nb{transition:all .18s ease;cursor:pointer}
.nb:hover{background:rgba(255,255,255,.05)!important}
.rh{transition:background .12s}
.rh:hover{background:rgba(255,255,255,.025)!important}
.ib{transition:all .18s;cursor:pointer}
.ib:hover{background:rgba(255,255,255,.1)!important;color:#f0f6fc!important}
.hc{transition:all .15s;cursor:pointer}
.hc:hover{transform:scale(1.25)!important;opacity:.85!important}
.progress-bar{transition:width 1.2s cubic-bezier(0.22,1,0.36,1)}
select option{background:#0d1117}
input[type=date]{color-scheme:dark}
input:focus,select:focus,textarea:focus{outline:none}
`;

/* ─── Constants ───────────────────────────────────────────── */
const BG = '#090d1a';
const S0 = 'rgba(255,255,255,.04)';
const S1 = 'rgba(255,255,255,.06)';
const BD = 'rgba(255,255,255,.07)';
const BDH = 'rgba(255,255,255,.14)';
const ACC = '#4f7ef9';
const ABG = 'rgba(79,126,249,.12)';
const TX = '#f0f6fc';
const TX2 = '#8b949e';
const TX3 = '#30363d';
const GRN = '#22c55e';
const RED = '#ef4444';
const AMB = '#f59e0b';
const PUR = '#a78bfa';

const CATS = {
  'Housing':       { color:'#ef4444', dot:'🔴' },
  'Food & Dining': { color:'#f59e0b', dot:'🟡' },
  'Shopping':      { color:'#f97316', dot:'🟠' },
  'Entertainment': { color:'#ec4899', dot:'🩷' },
  'Transportation':{ color:'#3b82f6', dot:'🔵' },
  'Healthcare':    { color:'#14b8a6', dot:'🟢' },
  'Education':     { color:'#22c55e', dot:'🟢' },
  'Investment':    { color:'#a78bfa', dot:'🟣' },
  'Utilities':     { color:'#64748b', dot:'⚫' },
  'Salary':        { color:'#22c55e', dot:'🟢' },
  'Freelance':     { color:'#4f7ef9', dot:'🔵' },
  'Other':         { color:'#6b7280', dot:'⚫' },
};

const CURRENCIES = [
  { code:'INR', symbol:'₹', flag:'IN', rate:1 },
  { code:'USD', symbol:'$', flag:'US', rate:0.012 },
  { code:'EUR', symbol:'€', flag:'EU', rate:0.011 },
  { code:'GBP', symbol:'£', flag:'GB', rate:0.0095 },
  { code:'JPY', symbol:'¥', flag:'JP', rate:1.78 },
  { code:'AED', symbol:'د.إ', flag:'AE', rate:0.044 },
  { code:'SGD', symbol:'S$', flag:'SG', rate:0.016 },
  { code:'CAD', symbol:'C$', flag:'CA', rate:0.016 },
  { code:'AUD', symbol:'A$', flag:'AU', rate:0.018 },
  { code:'CNY', symbol:'¥', flag:'CN', rate:0.087 },
];

/* ─── Mock Data ───────────────────────────────────────────── */
const INIT_TXN = [
  {id:'t1', date:'2025-03-28',description:'Vitamins & supplements',category:'Healthcare',   type:'expense',amount:55  },
  {id:'t2', date:'2025-03-25',description:'Conference ticket',      category:'Education',   type:'expense',amount:150 },
  {id:'t3', date:'2025-03-22',description:'Grocery run',            category:'Food & Dining',type:'expense',amount:110},
  {id:'t4', date:'2025-03-19',description:'Streaming bundle',       category:'Entertainment',type:'expense',amount:45 },
  {id:'t5', date:'2025-03-17',description:'Portfolio dividends',    category:'Investment',  type:'income', amount:300 },
  {id:'t6', date:'2025-03-15',description:'Spring wardrobe',        category:'Shopping',    type:'expense',amount:220 },
  {id:'t7', date:'2025-03-13',description:'Team lunch',             category:'Food & Dining',type:'expense',amount:70 },
  {id:'t8', date:'2025-03-10',description:'House rent',             category:'Housing',     type:'expense',amount:12000},
  {id:'t9', date:'2025-03-08',description:'Metro pass',             category:'Transportation',type:'expense',amount:500},
  {id:'t10',date:'2025-03-05',description:'Freelance project',      category:'Freelance',   type:'income', amount:8500},
  {id:'t11',date:'2025-03-03',description:'Electricity bill',       category:'Utilities',   type:'expense',amount:1800},
  {id:'t12',date:'2025-03-01',description:'Monthly salary',         category:'Salary',      type:'income', amount:85000},
  {id:'t13',date:'2025-02-28',description:'Restaurant dinner',      category:'Food & Dining',type:'expense',amount:850},
  {id:'t14',date:'2025-02-25',description:'Gym membership',         category:'Healthcare',  type:'expense',amount:1200},
  {id:'t15',date:'2025-02-22',description:'Books & online course',  category:'Education',   type:'expense',amount:450},
  {id:'t16',date:'2025-02-20',description:'Cab rides',              category:'Transportation',type:'expense',amount:620},
  {id:'t17',date:'2025-02-18',description:'New headphones',         category:'Shopping',    type:'expense',amount:2800},
  {id:'t18',date:'2025-02-15',description:'Movie tickets',          category:'Entertainment',type:'expense',amount:380},
  {id:'t19',date:'2025-02-12',description:'House rent',             category:'Housing',     type:'expense',amount:12000},
  {id:'t20',date:'2025-02-10',description:'Internet bill',          category:'Utilities',   type:'expense',amount:900},
  {id:'t21',date:'2025-02-08',description:'Consulting income',      category:'Freelance',   type:'income', amount:12000},
  {id:'t22',date:'2025-02-05',description:'Grocery store',          category:'Food & Dining',type:'expense',amount:340},
  {id:'t23',date:'2025-02-01',description:'Monthly salary',         category:'Salary',      type:'income', amount:85000},
  {id:'t24',date:'2025-01-30',description:'Flight tickets',         category:'Transportation',type:'expense',amount:5200},
  {id:'t25',date:'2025-01-28',description:'Doctor visit',           category:'Healthcare',  type:'expense',amount:800},
  {id:'t26',date:'2025-01-25',description:'Gaming subscription',    category:'Entertainment',type:'expense',amount:120},
  {id:'t27',date:'2025-01-22',description:'Clothes shopping',       category:'Shopping',    type:'expense',amount:1450},
  {id:'t28',date:'2025-01-20',description:'Stock dividends',        category:'Investment',  type:'income', amount:1200},
  {id:'t29',date:'2025-01-18',description:'House rent',             category:'Housing',     type:'expense',amount:12000},
  {id:'t30',date:'2025-01-15',description:'Mobile recharge',        category:'Utilities',   type:'expense',amount:299},
  {id:'t31',date:'2025-01-12',description:'Weekend getaway',        category:'Entertainment',type:'expense',amount:3200},
  {id:'t32',date:'2025-01-10',description:'Vegetables & fruits',    category:'Food & Dining',type:'expense',amount:280},
  {id:'t33',date:'2025-01-08',description:'Online course',          category:'Education',   type:'expense',amount:1999},
  {id:'t34',date:'2025-01-05',description:'Freelance design',       category:'Freelance',   type:'income', amount:6000},
  {id:'t35',date:'2025-01-01',description:'Monthly salary',         category:'Salary',      type:'income', amount:85000},
];

const INIT_BILLS = [
  {id:'b1',name:'Water Bill',      amount:450,  dueDate:'2025-03-20',category:'Utilities',   frequency:'monthly',notes:'Jal board',   paid:false},
  {id:'b2',name:'House Rent',      amount:12000,dueDate:'2025-03-24',category:'Housing',     frequency:'monthly',notes:'',            paid:false},
  {id:'b3',name:'Electricity Bill',amount:1800, dueDate:'2025-03-28',category:'Utilities',   frequency:'monthly',notes:'BSES Delhi',  paid:false},
  {id:'b4',name:'Netflix',         amount:649,  dueDate:'2025-04-05',category:'Entertainment',frequency:'monthly',notes:'Family plan', paid:false},
  {id:'b5',name:'Internet',        amount:900,  dueDate:'2025-04-10',category:'Utilities',   frequency:'monthly',notes:'Airtel fiber',paid:false},
  {id:'b6',name:'Gym Membership',  amount:1200, dueDate:'2025-04-01',category:'Healthcare',  frequency:'monthly',notes:"Gold's Gym",   paid:false},
];

const INIT_GOALS = [
  {id:'g1',name:'Emergency Fund',  emoji:'🛡️',target:150000,saved:62000, deadline:'2025-12-31',color:PUR },
  {id:'g2',name:'Europe Vacation', emoji:'✈️',target:80000, saved:22000, deadline:'2025-08-31',color:AMB },
  {id:'g3',name:'New Laptop',      emoji:'💻',target:90000, saved:45000, deadline:'2025-06-30',color:GRN },
  {id:'g4',name:'Home Down Payment',emoji:'🏠',target:500000,saved:120000,deadline:'2026-06-30',color:RED },
];

const INIT_RECURRING = [
  {id:'r1',name:'Monthly Salary',    category:'Salary',       type:'income', amount:85000,frequency:'monthly',nextDate:'2026-04-30',active:true },
  {id:'r2',name:'House Rent',        category:'Housing',      type:'expense',amount:12000,frequency:'monthly',nextDate:'2026-04-01',active:true },
  {id:'r3',name:'Netflix',           category:'Entertainment',type:'expense',amount:649,  frequency:'monthly',nextDate:'2026-04-20',active:true },
  {id:'r4',name:'Gym Membership',    category:'Healthcare',   type:'expense',amount:1200, frequency:'monthly',nextDate:'2026-04-01',active:true },
  {id:'r5',name:'Freelance Retainer',category:'Freelance',   type:'income', amount:8000, frequency:'monthly',nextDate:'2026-04-15',active:false},
];

/* ─── Context ─────────────────────────────────────────────── */
const Ctx = createContext();
const useApp = () => useContext(Ctx);

function load(key, def) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function AppProvider({ children }) {
  const [txns, setTxns] = useState(() => load('zv_txns', INIT_TXN));
  const [bills, setBills] = useState(() => load('zv_bills', INIT_BILLS));
  const [goals, setGoals] = useState(() => load('zv_goals', INIT_GOALS));
  const [recurring, setRecurring] = useState(() => load('zv_rec', INIT_RECURRING));
  const [role, setRole] = useState('admin');
  const [page, setPage] = useState('overview');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);
  useEffect(() => { save('zv_txns', txns); }, [txns]);
  useEffect(() => { save('zv_bills', bills); }, [bills]);
  useEffect(() => { save('zv_goals', goals); }, [goals]);
  useEffect(() => { save('zv_rec', recurring); }, [recurring]);

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const addTxn = useCallback(d => { setTxns(p => [{ ...d, id: 'tx' + Date.now() }, ...p]); toast('Transaction added'); }, [toast]);
  const editTxn = useCallback((id, d) => { setTxns(p => p.map(t => t.id === id ? { ...t, ...d } : t)); toast('Transaction updated'); }, [toast]);
  const delTxn = useCallback(id => { setTxns(p => p.filter(t => t.id !== id)); toast('Deleted', 'danger'); }, [toast]);

  const addBill = useCallback(d => { setBills(p => [{ ...d, id: 'b' + Date.now() }, ...p]); toast('Bill added'); }, [toast]);
  const editBill = useCallback((id, d) => { setBills(p => p.map(b => b.id === id ? { ...b, ...d } : b)); toast('Bill updated'); }, [toast]);
  const delBill = useCallback(id => { setBills(p => p.filter(b => b.id !== id)); toast('Bill deleted', 'danger'); }, [toast]);
  const toggleBillPaid = useCallback(id => { setBills(p => p.map(b => b.id === id ? { ...b, paid: !b.paid } : b)); }, []);

  const addGoal = useCallback(d => { setGoals(p => [{ ...d, id: 'g' + Date.now() }, ...p]); toast('Goal created!'); }, [toast]);
  const editGoal = useCallback((id, d) => { setGoals(p => p.map(g => g.id === id ? { ...g, ...d } : g)); toast('Goal updated'); }, [toast]);
  const delGoal = useCallback(id => { setGoals(p => p.filter(g => g.id !== id)); toast('Goal deleted', 'danger'); }, [toast]);
  const addSavings = useCallback((id, amt) => { setGoals(p => p.map(g => g.id === id ? { ...g, saved: Math.min(g.saved + amt, g.target) } : g)); toast(`₹${amt.toLocaleString()} added to goal!`); }, [toast]);

  const addRec = useCallback(d => { setRecurring(p => [{ ...d, id: 'r' + Date.now() }, ...p]); toast('Recurring added'); }, [toast]);
  const editRec = useCallback((id, d) => { setRecurring(p => p.map(r => r.id === id ? { ...r, ...d } : r)); toast('Updated'); }, [toast]);
  const delRec = useCallback(id => { setRecurring(p => p.filter(r => r.id !== id)); toast('Deleted', 'danger'); }, [toast]);
  const toggleRec = useCallback(id => { setRecurring(p => p.map(r => r.id === id ? { ...r, active: !r.active } : r)); }, []);
  const generateNow = useCallback(id => {
    const r = recurring.find(x => x.id === id);
    if (!r) return;
    addTxn({ date: new Date().toISOString().split('T')[0], description: r.name, category: r.category, type: r.type, amount: r.amount });
    setRecurring(p => p.map(x => x.id === id ? { ...x, nextDate: advanceDate(x.nextDate, x.frequency) } : x));
  }, [recurring, addTxn]);

  const notifications = useMemo(() => {
    const now = new Date(); const notes = [];
    bills.filter(b => !b.paid).forEach(b => {
      const dd = new Date(b.dueDate); const diff = Math.round((dd - now) / 86400000);
      if (diff < 0) notes.push({ id: 'nb' + b.id, type: 'danger', msg: `${b.name} is ${Math.abs(diff)}d overdue!`, read: false });
      else if (diff <= 3) notes.push({ id: 'nb' + b.id, type: 'warning', msg: `${b.name} due in ${diff}d — ₹${b.amount.toLocaleString()}`, read: false });
    });
    goals.forEach(g => {
      const pct = Math.round((g.saved / g.target) * 100);
      if (pct >= 100) notes.push({ id: 'ng' + g.id, type: 'success', msg: `🎉 Goal "${g.name}" completed!`, read: false });
      const dd = new Date(g.deadline); const diff = Math.round((dd - now) / 86400000);
      if (diff <= 7 && diff > 0 && pct < 100) notes.push({ id: 'ngd' + g.id, type: 'warning', msg: `Goal "${g.name}" deadline in ${diff}d`, read: false });
    });
    txns.filter(t => t.type === 'expense' && t.amount >= 5000).slice(0, 2).forEach(t => {
      notes.push({ id: 'nt' + t.id, type: 'info', msg: `Large expense: ${t.description} — ₹${t.amount.toLocaleString()}`, read: false });
    });
    return notes;
  }, [bills, goals, txns]);

  const fmt = useCallback(n => {
    const v = (n * currency.rate);
    return currency.symbol + (currency.code === 'INR'
      ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : v.toLocaleString('en-US', { maximumFractionDigits: 2 }));
  }, [currency]);

  return (
    <Ctx.Provider value={{
      txns, bills, goals, recurring, role, setRole, page, setPage,
      currency, setCurrency, sideCollapsed, setSideCollapsed,
      toasts, toast, notifOpen, setNotifOpen, modal, setModal, loading,
      addTxn, editTxn, delTxn, addBill, editBill, delBill, toggleBillPaid,
      addGoal, editGoal, delGoal, addSavings, addRec, editRec, delRec, toggleRec, generateNow,
      notifications, fmt
    }}>
      {children}
    </Ctx.Provider>
  );
}

function advanceDate(dateStr, freq) {
  const d = new Date(dateStr);
  if (freq === 'monthly') d.setMonth(d.getMonth() + 1);
  else if (freq === 'weekly') d.setDate(d.getDate() + 7);
  else if (freq === 'yearly') d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

/* ─── Hooks ───────────────────────────────────────────────── */
function useCounter(target, dur = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let c = 0; const step = target / (dur / 16);
    const t = setInterval(() => { c = Math.min(c + step, target); setV(Math.round(c)); if (c >= target) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return v;
}
function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  return w;
}

/* ─── Utils ───────────────────────────────────────────────── */
function billStatus(dueDate, paid) {
  if (paid) return { label: 'Paid', color: GRN, bg: 'rgba(34,197,94,.14)', border: 'rgba(34,197,94,.28)' };
  const diff = Math.round((new Date(dueDate) - new Date()) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: RED, bg: 'rgba(239,68,68,.14)', border: 'rgba(239,68,68,.28)' };
  if (diff === 0) return { label: 'Due today', color: AMB, bg: 'rgba(245,158,11,.14)', border: 'rgba(245,158,11,.28)' };
  if (diff <= 3) return { label: `Due in ${diff}d`, color: AMB, bg: 'rgba(245,158,11,.14)', border: 'rgba(245,158,11,.28)' };
  return { label: `Due in ${diff}d`, color: '#60a5fa', bg: 'rgba(96,165,250,.14)', border: 'rgba(96,165,250,.28)' };
}
function getHour() { return new Date().getHours(); }
function greeting() {
  const h = getHour();
  if (h < 12) return ['🌅', 'Good Morning'];
  if (h < 17) return ['☀️', 'Good Afternoon'];
  return ['🌙', 'Good Evening'];
}
function daysLeft(d) { return Math.max(0, Math.round((new Date(d) - new Date()) / 86400000)); }

/* ─── Animated Background ─────────────────────────────────── */
function AnimatedBG() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext('2d');
    let W = cv.width = window.innerWidth, H = cv.height = window.innerHeight;
    window.addEventListener('resize', () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; });

    const blobs = [
      { x:.12, y:.18, r:.42, ph:0,   sp:.00025, c:'79,126,249',  a:.08, dx:70, dy:50 },
      { x:.85, y:.65, r:.32, ph:2.1, sp:.00038, c:'167,139,250', a:.07, dx:55, dy:40 },
      { x:.5,  y:.08, r:.26, ph:4.2, sp:.00031, c:'34,197,94',   a:.055,dx:45, dy:30 },
      { x:.78, y:.32, r:.20, ph:1.0, sp:.00052, c:'59,130,246',  a:.06, dx:35, dy:28 },
      { x:.18, y:.75, r:.24, ph:3.3, sp:.00029, c:'245,158,11',  a:.045,dx:42, dy:32 },
    ];
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + .2,
      a: Math.random() * .5 + .05,
      tw: Math.random() * Math.PI * 2,
      tws: .015 + Math.random() * .03,
      col: Math.random() > .6 ? '79,126,249' : '255,255,255',
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y += 40) {
        ctx.fillStyle = 'rgba(148,163,184,.018)'; ctx.beginPath(); ctx.arc(x, y, .75, 0, Math.PI * 2); ctx.fill();
      }
      blobs.forEach(b => {
        b.ph += b.sp * 16;
        const bx = (b.x + Math.sin(b.ph * .63) * b.dx / W) * W;
        const by = (b.y + Math.cos(b.ph * .47) * b.dy / H) * H;
        const br = b.r * Math.min(W, H) * (1 + Math.sin(b.ph * 1.1) * .06);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${b.c},${b.a})`); g.addColorStop(.5, `rgba(${b.c},${b.a * .4})`); g.addColorStop(1, 'transparent');
        ctx.save(); ctx.rotate(b.ph * .15); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      stars.forEach(s => {
        s.tw += s.tws;
        ctx.save(); ctx.globalAlpha = s.a * (.55 + .45 * Math.sin(s.tw));
        ctx.shadowBlur = 4; ctx.shadowColor = `rgb(${s.col})`;
        ctx.fillStyle = `rgb(${s.col})`; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100%', height: '100%' }} />;
}

/* ─── UI Primitives ───────────────────────────────────────── */
function Card({ children, style, hover = true, delay = 0, onClick, className = '' }) {
  return (
    <div className={`${hover ? 'card' : ''} ${className}`} onClick={onClick}
      style={{ background: S0, border: `1px solid ${BD}`, borderRadius: 14, backdropFilter: 'blur(12px)', animation: `fadeUp .4s ease ${delay}s both`, ...style }}>
      {children}
    </div>
  );
}
function Badge({ label, color, bg, border }) {
  return <span style={{ background: bg, color, border: `1px solid ${border}`, padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: .3, fontFamily: 'Sora,sans-serif', textTransform: 'uppercase' }}>{label}</span>;
}
function Btn({ children, variant = 'accent', Icon, onClick, disabled, size = 'md', style: sx }) {
  const sz = { sm: '6px 13px', md: '8px 18px', lg: '11px 24px' };
  const fz = { sm: '11px', md: '13px', lg: '14px' };
  const vs = {
    accent: { bg: ACC, color: '#fff', border: 'none', cls: '' },
    ghost:  { bg: S1, color: TX2, border: `1px solid ${BD}`, cls: 'ib' },
    danger: { bg: 'rgba(239,68,68,.12)', color: RED, border: '1px solid rgba(239,68,68,.25)', cls: 'ib' },
    green:  { bg: 'rgba(34,197,94,.14)', color: GRN, border: '1px solid rgba(34,197,94,.28)', cls: 'ib' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} className={vs.cls}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: sz[size], fontSize: fz[size], fontWeight: 700, fontFamily: 'Sora,sans-serif', borderRadius: 9, border: vs.border || 'none', background: vs.bg, color: vs.color, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, transition: 'all .18s', ...sx }}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}
function Input({ label, value, onChange, type = 'text', placeholder, options }) {
  const iStyle = { width: '100%', background: S1, border: `1px solid ${BD}`, borderRadius: 9, padding: '9px 12px', color: TX, fontSize: 13, fontFamily: 'Sora,sans-serif', outline: 'none' };
  const lStyle = { color: TX2, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, letterSpacing: .3 };
  return (
    <div>
      {label && <label style={lStyle}>{label.toUpperCase()}</label>}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...iStyle, cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={iStyle} />
      )}
    </div>
  );
}
function Skeleton({ h = 14, w = '60%', r = 6 }) {
  return <div className="shimmer" style={{ height: h, width: w, borderRadius: r, marginBottom: 8 }} />;
}

/* ─── Toast ───────────────────────────────────────────────── */
function Toasts() {
  const { toasts } = useApp();
  const colors = { success: GRN, danger: RED, warning: AMB, info: ACC };
  return (
    <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 9 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(9,13,26,.97)', backdropFilter: 'blur(20px)', border: `1px solid ${(colors[t.type] || GRN)}30`, borderLeft: `3px solid ${colors[t.type] || GRN}`, borderRadius: 11, padding: '12px 17px', minWidth: 250, animation: 'toastIn .28s ease', boxShadow: '0 10px 30px rgba(0,0,0,.5)' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: colors[t.type] || GRN, flexShrink: 0 }} />
          <span style={{ color: TX, fontSize: 13, fontWeight: 500 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────── */
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'fadeIn .18s ease' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#0d1117', border: `1px solid ${BDH}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 460, animation: 'scaleIn .22s ease', boxShadow: '0 30px 80px rgba(0,0,0,.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ color: TX, fontSize: 17, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, color: TX3, display: 'flex' }}><X size={17} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Notification Panel ──────────────────────────────────── */
function NotifPanel() {
  const { notifOpen, setNotifOpen, notifications } = useApp();
  if (!notifOpen) return null;
  const icons = { danger: RED, warning: AMB, success: GRN, info: ACC };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800 }} onClick={() => setNotifOpen(false)}>
      <div style={{ position: 'absolute', top: 54, right: 160, width: 340, background: '#0d1117', border: `1px solid ${BDH}`, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,.6)', overflow: 'hidden', animation: 'scaleIn .18s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${BD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: TX, fontWeight: 700, fontSize: 14 }}>Notifications</div>
          <Badge label={notifications.length + ''} color={ACC} bg={ABG} border="transparent" />
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: TX3, fontSize: 13 }}>All caught up!</div>
          ) : notifications.map(n => (
            <div key={n.id} className="rh" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 18px', borderBottom: `1px solid ${BD}` }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: icons[n.type] || ACC, flexShrink: 0, marginTop: 5 }} />
              <p style={{ color: TX2, fontSize: 12.5, lineHeight: 1.5 }}>{n.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ──────────────────────────────────────── */
function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(9,13,26,.97)', border: `1px solid ${BDH}`, borderRadius: 10, padding: '10px 14px', boxShadow: '0 12px 40px rgba(0,0,0,.5)' }}>
      <p style={{ color: TX2, fontSize: 11, marginBottom: 7, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: i < payload.length - 1 ? 3 : 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
          <span style={{ color: TX2, fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: TX, fontSize: 12, fontWeight: 700 }}>₹{Number(p.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────── */
const NAV = [
  { id: 'overview',     label: 'Overview',     Icon: LayoutGrid    },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb     },
  { id: 'bills',        label: 'Bills',        Icon: Receipt       },
  { id: 'goals',        label: 'Goals',        Icon: Target        },
  { id: 'recurring',    label: 'Recurring',    Icon: RefreshCw     },
];

function Sidebar() {
  const { page, setPage, sideCollapsed, setSideCollapsed } = useApp();
  return (
    <aside style={{ width: sideCollapsed ? 60 : 230, minWidth: sideCollapsed ? 60 : 230, height: '100vh', background: 'rgba(9,13,26,.92)', borderRight: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', transition: 'width .25s ease, min-width .25s ease', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ padding: sideCollapsed ? '18px 14px 16px' : '18px 16px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp size={18} color="white" />
        </div>
        {!sideCollapsed && <span style={{ color: TX, fontWeight: 800, fontSize: 16, letterSpacing: -.5, whiteSpace: 'nowrap' }}>Zorvyn</span>}
      </div>
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ id, label, Icon: NI }) => {
          const on = page === id;
          return (
            <button key={id} className="nb" onClick={() => setPage(id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: sideCollapsed ? '10px 12px' : '10px 13px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 13.5, fontWeight: on ? 600 : 500, background: on ? ABG : 'transparent', color: on ? ACC : TX2, width: '100%', justifyContent: sideCollapsed ? 'center' : 'flex-start', transition: 'all .18s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <NI size={16} style={{ flexShrink: 0 }} />
              {!sideCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
              {!sideCollapsed && on && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: ACC, flexShrink: 0 }} />}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${BD}` }}>
        {!sideCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 10, background: S0, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>AR</div>
            <div>
              <div style={{ color: TX, fontSize: 12, fontWeight: 600 }}>Aditi Ranjan</div>
              <div style={{ color: TX3, fontSize: 10, marginTop: 1 }}>aditi@zorvyn.io</div>
            </div>
          </div>
        )}
        <button className="nb" onClick={() => setSideCollapsed(c => !c)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '8px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, color: TX3, background: 'transparent', justifyContent: sideCollapsed ? 'center' : 'flex-start' }}>
          {sideCollapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
        {!sideCollapsed && (
          <div style={{ paddingTop: 10, borderTop: `1px solid ${BD}`, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Heart size={10} color={RED} />
            <span style={{ color: TX3, fontSize: 10 }}>Made with love by Aditi</span>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ─── Topbar ──────────────────────────────────────────────── */
function Topbar() {
  const { role, setRole, currency, setCurrency, notifications, notifOpen, setNotifOpen, page, txns, toast } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);
  const [curOpen, setCurOpen] = useState(false);
  const labels = { overview: 'Overview', transactions: 'Transactions', insights: 'Insights', bills: 'Bills', goals: 'Goals', recurring: 'Recurring' };
  const unread = notifications.length;

  const exportData = () => {
    const b = new Blob([JSON.stringify(txns, null, 2)], { type: 'application/json' });
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(b), download: 'zorvyn-export.json' }).click();
    toast('Exported!');
  };

  return (
    <header style={{ height: 54, borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, background: 'rgba(9,13,26,.88)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
      <span style={{ color: TX, fontWeight: 700, fontSize: 17, letterSpacing: -.4 }}>{labels[page]}</span>
      <div style={{ flex: 1 }} />

      {/* Currency */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => { setCurOpen(o => !o); setRoleOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: S1, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Sora,sans-serif', color: TX2, fontSize: 12, fontWeight: 600 }}>
          <span style={{ fontSize: 10, color: TX3 }}>IN</span>
          <span style={{ color: TX }}>{currency.code}</span>
          <ChevronDown size={11} color={TX3} />
        </button>
        {curOpen && (
          <div style={{ position: 'absolute', right: 0, top: 42, background: '#0d1117', border: `1px solid ${BDH}`, borderRadius: 12, padding: 6, minWidth: 155, boxShadow: '0 20px 50px rgba(0,0,0,.6)', zIndex: 200, animation: 'scaleIn .15s ease', maxHeight: 280, overflowY: 'auto' }}>
            {CURRENCIES.map(c => (
              <button key={c.code} className="nb" onClick={() => { setCurrency(c); setCurOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 11px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, background: currency.code === c.code ? ABG : 'transparent', color: currency.code === c.code ? ACC : TX2 }}>
                <span style={{ fontSize: 10, color: TX3 }}>{c.flag}</span>
                <span>{c.code}</span>
                <span style={{ marginLeft: 'auto', color: TX3, fontSize: 10 }}>{c.symbol}</span>
                {currency.code === c.code && <Check size={11} color={ACC} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={exportData} style={{ display: 'flex', alignItems: 'center', gap: 6, background: S1, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 13px', cursor: 'pointer', fontFamily: 'Sora,sans-serif', color: TX2, fontSize: 12, fontWeight: 600 }}>
        <Download size={13} /><span>Export</span>
      </button>

      {/* Role */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => { setRoleOpen(o => !o); setCurOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: S1, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 13px', cursor: 'pointer', fontFamily: 'Sora,sans-serif', color: TX2, fontSize: 12, fontWeight: 600 }}>
          {role}<ChevronDown size={11} color={TX3} />
        </button>
        {roleOpen && (
          <div style={{ position: 'absolute', right: 0, top: 42, background: '#0d1117', border: `1px solid ${BDH}`, borderRadius: 12, padding: 6, minWidth: 130, boxShadow: '0 20px 50px rgba(0,0,0,.6)', zIndex: 200, animation: 'scaleIn .15s ease' }}>
            {['admin', 'viewer'].map(r => (
              <button key={r} className="nb" onClick={() => { setRole(r); setRoleOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12.5, background: role === r ? ABG : 'transparent', color: role === r ? ACC : TX2 }}>
                {role === r ? <Check size={11} color={ACC} /> : <div style={{ width: 11 }} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bell */}
      <button onClick={() => setNotifOpen(o => !o)} style={{ position: 'relative', background: S1, border: `1px solid ${BD}`, borderRadius: 8, padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: TX2 }}>
        <Bell size={16} />
        {unread > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: RED, color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{Math.min(unread, 9)}</span>}
      </button>

      <div style={{ width: 34, height: 34, borderRadius: '50%', background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', cursor: 'pointer', flexShrink: 0, letterSpacing: -.3 }}>AR</div>
    </header>
  );
}

/* ─── Spending Heatmap ────────────────────────────────────── */
function Heatmap({ txns }) {
  const weeks = useMemo(() => {
    const map = {};
    txns.filter(t => t.type === 'expense').forEach(t => {
      const k = t.date; map[k] = (map[k] || 0) + t.amount;
    });
    const maxVal = Math.max(...Object.values(map), 1);
    const now = new Date(); const end = new Date(now);
    const start = new Date(now); start.setDate(start.getDate() - 363);
    const result = []; let week = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      const v = map[key] || 0;
      week.push({ date: key, v, intensity: v === 0 ? 0 : Math.ceil((v / maxVal) * 4) });
      if (week.length === 7) { result.push(week); week = []; }
    }
    if (week.length) { while (week.length < 7) week.push({ date: '', v: 0, intensity: 0 }); result.push(week); }
    return result;
  }, [txns]);

  const intensityColors = ['#1a2035', '#1e3a5f', '#1e4f8a', '#2563b5', '#4f7ef9'];
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const [hover, setHover] = useState(null);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
        <div style={{ width: 28, flexShrink: 0 }} />
        {months.map((m, i) => (
          <div key={i} style={{ flex: 1, color: TX3, fontSize: 10, textAlign: 'center' }}>{m}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 25, flexShrink: 0 }}>
          {days.map((d, i) => <span key={i} style={{ color: TX3, fontSize: 9, height: 12, display: 'flex', alignItems: 'center' }}>{d}</span>)}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((cell, di) => (
              <div key={di} className="hc" title={cell.date ? `${cell.date}: ₹${cell.v.toLocaleString('en-IN')}` : ''} onMouseEnter={() => setHover(cell)} onMouseLeave={() => setHover(null)}
                style={{ width: 11, height: 11, borderRadius: 3, background: cell.date ? intensityColors[cell.intensity] : 'transparent', border: cell.date ? `1px solid rgba(255,255,255,.04)` : 'none' }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <span style={{ color: TX3, fontSize: 11 }}>Less</span>
        {intensityColors.map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 3, background: c }} />)}
        <span style={{ color: TX3, fontSize: 11 }}>More</span>
        {hover && hover.date && <span style={{ marginLeft: 'auto', color: TX2, fontSize: 11 }}>{hover.date}: ₹{hover.v.toLocaleString('en-IN')}</span>}
      </div>
    </div>
  );
}

/* ─── Overview Page ───────────────────────────────────────── */
function StatCard({ label, value, Icon, iconBg, iconColor, change, changeDir, delay, fmt }) {
  const n = useCounter(Math.round(value));
  return (
    <Card delay={delay} style={{ padding: '22px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ color: TX2, fontSize: 13 }}>{label}</span>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={19} color={iconColor} />
        </div>
      </div>
      <div style={{ color: TX, fontSize: 30, fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1, marginBottom: 12 }}>
        {fmt(n)}
      </div>
      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {changeDir === 'up' ? <ArrowUpRight size={13} color={GRN} /> : <ArrowDownRight size={13} color={RED} />}
          <span style={{ color: changeDir === 'up' ? GRN : RED, fontSize: 12, fontWeight: 600 }}>{change}% vs last month</span>
        </div>
      )}
    </Card>
  );
}

function Overview() {
  const { txns, bills, goals, loading, fmt, role, setPage, setModal } = useApp();

  const income  = useMemo(() => txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [txns]);
  const expense = useMemo(() => txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [txns]);
  const balance = income - expense;

  const monthly = useMemo(() => {
    const map = {};
    txns.forEach(t => {
      const d = new Date(t.date); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[k]) map[k] = { mo: d.toLocaleString('en', { month: 'short' }), inc: 0, exp: 0, yr: d.getFullYear(), mn: d.getMonth() };
      map[k][t.type === 'income' ? 'inc' : 'exp'] += t.amount;
    });
    return Object.values(map).sort((a, b) => a.yr !== b.yr ? a.yr - b.yr : a.mn - b.mn).map((d, i, arr) => {
      let bal = 0; for (let j = 0; j <= i; j++) bal += arr[j].inc - arr[j].exp;
      return { ...d, balance: bal };
    });
  }, [txns]);

  const catData = useMemo(() => {
    const m = {};
    txns.filter(t => t.type === 'expense').forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value, color: CATS[name]?.color || '#64748b' })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [txns]);

  const upcomingBills = useMemo(() => bills.filter(b => !b.paid).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5), [bills]);
  const topGoals = useMemo(() => goals.slice(0, 3), [goals]);
  const recent = useMemo(() => txns.slice(0, 6), [txns]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ height: 32, width: 240 }}><Skeleton h={26} w="55%" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 13 }}>{[1, 2, 3].map(i => <Card key={i} style={{ padding: 22 }}><Skeleton h={13} w="45%" /><Skeleton h={32} w="55%" /><Skeleton h={11} w="40%" /></Card>)}</div>
    </div>
  );

  const [emoji, greet] = greeting();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Greeting */}
      <div style={{ animation: 'fadeUp .4s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 6 }}>
          <span style={{ fontSize: 32 }}>{emoji}</span>
          <div>
            <h1 style={{ color: TX, fontWeight: 800, fontSize: 24, letterSpacing: -.8 }}>{greet}, <span style={{ color: ACC }}>Aditi!</span></h1>
            <p style={{ color: TX2, fontSize: 13, marginTop: 3 }}>Here's your financial summary for today</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 13 }}>
        <StatCard label="Total Balance" value={balance} Icon={Wallet} iconBg="rgba(79,126,249,.15)" iconColor={ACC} change={60.4} changeDir="up" delay={0} fmt={fmt} />
        <StatCard label="Total Income" value={income} Icon={TrendingUp} iconBg="rgba(34,197,94,.12)" iconColor={GRN} change={16.8} changeDir="up" delay={.06} fmt={fmt} />
        <StatCard label="Total Expenses" value={expense} Icon={TrendingDown} iconBg="rgba(239,68,68,.12)" iconColor={RED} change={33.6} changeDir="down" delay={.12} fmt={fmt} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 13 }}>
        <Card delay={.16} style={{ padding: '22px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div><h3 style={{ color: TX, fontWeight: 700, fontSize: 15 }}>Balance Trend</h3><p style={{ color: TX2, fontSize: 11, marginTop: 3 }}>Cumulative balance over time</p></div>
            <Badge label="All time" color={TX2} bg={S1} border={BD} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly} margin={{ top: 4, right: 6, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACC} stopOpacity={.28} />
                  <stop offset="100%" stopColor={ACC} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GRN} stopOpacity={.15} />
                  <stop offset="100%" stopColor={GRN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="mo" tick={{ fill: TX3, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TX3, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CTip />} />
              <Area type="monotone" dataKey="balance" name="Balance" stroke={ACC} strokeWidth={2.5} fill="url(#gBal)" dot={false} activeDot={{ r: 6, fill: ACC, strokeWidth: 3, stroke: 'rgba(79,126,249,.3)' }} />
              <Area type="monotone" dataKey="exp" name="Expense" stroke={GRN} strokeWidth={1.5} fill="url(#gExp)" strokeDasharray="5 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Upcoming Bills */}
        <Card delay={.2} style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ color: TX, fontWeight: 700, fontSize: 14 }}>Upcoming Bills</h3>
              <span style={{ background: 'rgba(239,68,68,.15)', color: RED, border: '1px solid rgba(239,68,68,.3)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{upcomingBills.length}</span>
            </div>
            <button onClick={() => setPage('bills')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ACC, fontSize: 12, fontWeight: 600, fontFamily: 'Sora,sans-serif', display: 'flex', alignItems: 'center', gap: 3 }}>View all →</button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
            {upcomingBills.map(b => {
              const s = billStatus(b.dueDate, b.paid);
              return (
                <div key={b.id} className="rh" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px', borderRadius: 9 }}>
                  <AlertCircle size={15} color={s.color} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: TX, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</p>
                    <p style={{ color: s.color, fontSize: 11, marginTop: 1, fontWeight: 600 }}>{s.label}</p>
                  </div>
                  <span style={{ color: TX, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>₹{b.amount.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Goals + Donut Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 13 }}>
        <Card delay={.24} style={{ padding: '22px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ color: TX, fontWeight: 700, fontSize: 15 }}>Saving Goals</h3>
            <button onClick={() => setPage('goals')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ACC, fontSize: 12, fontWeight: 600, fontFamily: 'Sora,sans-serif' }}>View all →</button>
          </div>
          {topGoals.map((g, i) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <div key={g.id} style={{ marginBottom: i < topGoals.length - 1 ? 18 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 15 }}>{g.emoji}</span>
                    <span style={{ color: TX, fontSize: 13, fontWeight: 600 }}>{g.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: TX2, fontSize: 11 }}>{daysLeft(g.deadline)}d left</span>
                    <span style={{ color: g.color, fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,.07)', borderRadius: 4, overflow: 'hidden' }}>
                  <div className="progress-bar" style={{ height: '100%', width: `${pct}%`, background: g.color, borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: TX3, fontSize: 10 }}>₹{g.saved.toLocaleString('en-IN')} saved</span>
                  <span style={{ color: TX3, fontSize: 10 }}>Target ₹{g.target.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </Card>

        <Card delay={.28} style={{ padding: '22px 20px' }}>
          <h3 style={{ color: TX, fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Spending Breakdown</h3>
          <p style={{ color: TX2, fontSize: 11, marginBottom: 13 }}>Top categories</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={44} outerRadius={70} dataKey="value" stroke="none" paddingAngle={3}>
                {catData.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip content={<CTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {catData.slice(0, 4).map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ color: TX2, fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <span style={{ color: TX, fontSize: 11, fontWeight: 700 }}>₹{c.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card delay={.32} style={{ padding: '22px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ color: TX, fontWeight: 700, fontSize: 15 }}>Recent Transactions</h3>
          <button onClick={() => setPage('transactions')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ACC, fontSize: 12, fontWeight: 600, fontFamily: 'Sora,sans-serif' }}>View all →</button>
        </div>
        {recent.map((t, i) => (
          <div key={t.id} className="rh" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 9, borderBottom: i < recent.length - 1 ? `1px solid ${BD}` : 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${CATS[t.category]?.color || '#64748b'}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
              {t.type === 'income' ? '💰' : '💸'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: TX, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
              <p style={{ color: TX3, fontSize: 11, marginTop: 1 }}>{t.category} · {t.date}</p>
            </div>
            <span style={{ color: t.type === 'income' ? GRN : RED, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </Card>

      {role === 'admin' && (
        <Card delay={.36} style={{ padding: '16px 20px' }}>
          <p style={{ color: TX2, fontSize: 12, fontWeight: 600, marginBottom: 12, letterSpacing: .3 }}>QUICK ACTIONS</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Btn Icon={Plus} onClick={() => setModal('addTxn')}>Add Transaction</Btn>
            <Btn Icon={Plus} variant="ghost" onClick={() => setModal('addBill')}>Add Bill</Btn>
            <Btn Icon={Plus} variant="ghost" onClick={() => setModal('addGoal')}>Add Goal</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── Transaction Form ────────────────────────────────────── */
function TxnForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || { date: new Date().toISOString().split('T')[0], description: '', category: 'Food & Dining', type: 'expense', amount: '' });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Date" type="date" value={f.date} onChange={s('date')} />
        <Input label="Amount (₹)" type="number" value={f.amount} onChange={s('amount')} placeholder="0" />
      </div>
      <Input label="Description" value={f.description} onChange={s('description')} placeholder="e.g. Netflix subscription" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Category" value={f.category} onChange={s('category')} options={Object.keys(CATS)} />
        <div>
          <label style={{ color: TX2, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, letterSpacing: .3 }}>TYPE</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {['expense', 'income'].map(tp => (
              <button key={tp} onClick={() => s('type')(tp)} style={{ flex: 1, padding: '9px 6px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700, transition: 'all .18s', background: f.type === tp ? (tp === 'income' ? 'rgba(34,197,94,.18)' : 'rgba(239,68,68,.18)') : S1, color: f.type === tp ? (tp === 'income' ? GRN : RED) : TX2, borderWidth: 1, borderStyle: 'solid', borderColor: f.type === tp ? (tp === 'income' ? GRN + '40' : RED + '40') : BD }}>
                {tp.charAt(0).toUpperCase() + tp.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <Btn variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
        <Btn onClick={() => { if (!f.description || !f.amount) return; onSave({ ...f, amount: parseFloat(f.amount) }); }} style={{ flex: 2, justifyContent: 'center' }}>Save Transaction</Btn>
      </div>
    </div>
  );
}

/* ─── Transactions Page ───────────────────────────────────── */
function Transactions() {
  const { txns, role, addTxn, editTxn, delTxn } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState({ k: 'date', d: 'desc' });
  const [pg, setPg] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const PER = 15;

  const filtered = useMemo(() => {
    let t = [...txns];
    if (type !== 'all') t = t.filter(x => x.type === type);
    if (cat !== 'all') t = t.filter(x => x.category === cat);
    if (q) t = t.filter(x => x.description.toLowerCase().includes(q.toLowerCase()) || x.category.toLowerCase().includes(q.toLowerCase()));
    t.sort((a, b) => {
      const v = sort.k === 'date' ? new Date(a.date) - new Date(b.date) : sort.k === 'amount' ? a.amount - b.amount : a.category.localeCompare(b.category);
      return sort.d === 'asc' ? v : -v;
    });
    return t;
  }, [txns, q, type, cat, sort]);

  const pages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((pg - 1) * PER, pg * PER);
  const tog = k => setSort(p => ({ k, d: p.k === k && p.d === 'desc' ? 'asc' : 'desc' }));

  const exportCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount'], ...filtered.map(t => [t.date, t.description, t.category, t.type, t.amount])];
    const b = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(b), download: 'zorvyn-txns.csv' }).click();
  };

  const SH = ({ k }) => <span onClick={() => tog(k)} style={{ cursor: 'pointer', marginLeft: 3, opacity: sort.k === k ? 1 : .35 }}>{sort.k === k && sort.d === 'asc' ? '↑' : '↓'}</span>;

  const isStyle = { background: S1, border: `1px solid ${BD}`, borderRadius: 9, padding: '8px 12px', color: TX, fontSize: 13, fontFamily: 'Sora,sans-serif', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', animation: 'fadeUp .35s ease both' }}>
        <div>
          <h1 style={{ color: TX, fontSize: 24, fontWeight: 800, letterSpacing: -.8 }}>Transactions</h1>
          <p style={{ color: TX2, fontSize: 13, marginTop: 4 }}>{filtered.length} transactions</p>
        </div>
        {role === 'admin' && <Btn Icon={Plus} onClick={() => setShowAdd(true)}>Add Transaction</Btn>}
      </div>

      <Card delay={0} style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: S1, border: `1px solid ${BD}`, borderRadius: 9, padding: '8px 13px', flex: 1, minWidth: 200 }}>
            <Search size={13} color={TX3} />
            <input value={q} onChange={e => { setQ(e.target.value); setPg(1); }} placeholder="Search transactions..." style={{ background: 'transparent', border: 'none', outline: 'none', color: TX, fontSize: 13, fontFamily: 'Sora,sans-serif', width: '100%' }} />
            {q && <button onClick={() => setQ('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TX3 }}><X size={12} /></button>}
          </div>
          <select value={type} onChange={e => { setType(e.target.value); setPg(1); }} style={isStyle}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={cat} onChange={e => { setCat(e.target.value); setPg(1); }} style={isStyle}>
            <option value="all">All Categories</option>
            {Object.keys(CATS).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Btn variant="ghost" Icon={Download} onClick={exportCSV} size="sm">Export CSV</Btn>
        </div>
      </Card>

      <Card delay={.08} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '115px 1fr 155px 100px 100px 70px', padding: '11px 18px', borderBottom: `1px solid ${BD}` }}>
          {[['DATE', 'date'], ['DESCRIPTION', null], ['CATEGORY', 'category'], ['TYPE', null], ['AMOUNT', 'amount'], ['', null]].map(([h, sk]) => (
            <span key={h} style={{ color: TX3, fontSize: 10, fontWeight: 700, letterSpacing: .7, cursor: sk ? 'pointer' : 'default' }}>
              {h}{sk && <SH k={sk} />}
            </span>
          ))}
        </div>

        {paged.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: 38 }}>🔍</span>
            <p style={{ color: TX2, fontWeight: 700, marginTop: 12 }}>No transactions found</p>
            <p style={{ color: TX3, fontSize: 13, marginTop: 5 }}>Try adjusting your search or filters</p>
          </div>
        ) : paged.map((t, i) => (
          <div key={t.id} className="rh" style={{ display: 'grid', gridTemplateColumns: '115px 1fr 155px 100px 100px 70px', padding: '12px 18px', borderBottom: i < paged.length - 1 ? `1px solid ${BD}` : 'none', alignItems: 'center' }}>
            <span style={{ color: TX2, fontSize: 12 }}>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: CATS[t.category]?.color || '#64748b', flexShrink: 0 }} />
              <span style={{ color: TX, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</span>
            </div>
            <span style={{ color: TX2, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.category}</span>
            <Badge label={t.type} color={t.type === 'income' ? GRN : RED} bg={t.type === 'income' ? 'rgba(34,197,94,.13)' : 'rgba(239,68,68,.13)'} border={t.type === 'income' ? 'rgba(34,197,94,.28)' : 'rgba(239,68,68,.28)'} />
            <span style={{ color: t.type === 'income' ? GRN : RED, fontWeight: 700, fontSize: 13 }}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</span>
            {role === 'admin' ? (
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => setEditTarget(t)} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 7, color: TX3 }}><Pencil size={12} /></button>
                <button onClick={() => delTxn(t.id)} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 7, color: RED }}><Trash2 size={12} /></button>
              </div>
            ) : <div />}
          </div>
        ))}

        {pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: `1px solid ${BD}` }}>
            <span style={{ color: TX2, fontSize: 12 }}>{(pg - 1) * PER + 1}–{Math.min(pg * PER, filtered.length)} of {filtered.length}</span>
            <div style={{ display: 'flex', gap: 5 }}>
              <button onClick={() => setPg(p => Math.max(1, p - 1))} disabled={pg === 1} className="ib" style={{ background: S1, border: `1px solid ${BD}`, borderRadius: 7, padding: '5px 9px', cursor: pg === 1 ? 'not-allowed' : 'pointer', opacity: pg === 1 ? .35 : 1, color: TX2 }}><ChevronLeft size={13} /></button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPg(p)} style={{ width: 30, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700, background: pg === p ? ABG : S1, color: pg === p ? ACC : TX2, transition: 'all .18s' }}>{p}</button>
              ))}
              <button onClick={() => setPg(p => Math.min(pages, p + 1))} disabled={pg === pages} className="ib" style={{ background: S1, border: `1px solid ${BD}`, borderRadius: 7, padding: '5px 9px', cursor: pg === pages ? 'not-allowed' : 'pointer', opacity: pg === pages ? .35 : 1, color: TX2 }}><ChevronRight size={13} /></button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Transaction">
        <TxnForm onSave={d => { addTxn(d); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Transaction">
        {editTarget && <TxnForm init={editTarget} onSave={d => { editTxn(editTarget.id, d); setEditTarget(null); }} onClose={() => setEditTarget(null)} />}
      </Modal>
    </div>
  );
}

/* ─── Insights Page ───────────────────────────────────────── */
function Insights() {
  const { txns } = useApp();
  const monthly = useMemo(() => {
    const map = {};
    txns.forEach(t => {
      const d = new Date(t.date); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[k]) map[k] = { mo: d.toLocaleString('en', { month: 'short' }), inc: 0, exp: 0, yr: d.getFullYear(), mn: d.getMonth() };
      map[k][t.type === 'income' ? 'inc' : 'exp'] += t.amount;
    });
    return Object.values(map).sort((a, b) => a.yr !== b.yr ? a.yr - b.yr : a.mn - b.mn).slice(-3);
  }, [txns]);

  const catData = useMemo(() => {
    const m = {};
    txns.filter(t => t.type === 'expense').forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    const total = Object.values(m).reduce((s, v) => s + v, 0);
    return Object.entries(m).map(([name, value]) => ({ name, value, color: CATS[name]?.color || '#64748b', pct: Math.round((value / total) * 100), count: txns.filter(t => t.category === name && t.type === 'expense').length })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [txns]);

  const income  = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income - expense;
  const saveRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
  const top = catData[0] || {};
  const biggest = [...txns].filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
  const mostFreqCat = Object.entries(txns.filter(t => t.type === 'expense').reduce((m, t) => { m[t.category] = (m[t.category] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1])[0];

  const observations = [
    { icon: '🔥', text: `Your top spending category is ${top.name || 'N/A'} at ₹${(top.value || 0).toLocaleString('en-IN')} (${top.pct || 0}% of expenses)` },
    { icon: '💰', text: `Savings rate is ${saveRate}% — ${parseFloat(saveRate) > 30 ? 'excellent discipline!' : 'room to improve.'}` },
    { icon: '📊', text: `Total net balance: ₹${(income - expense).toLocaleString('en-IN')} across ${txns.length} transactions` },
    { icon: '🧾', text: biggest ? `Largest single expense: ${biggest.description} — ₹${biggest.amount.toLocaleString('en-IN')}` : 'No expenses yet' },
    { icon: '🔄', text: mostFreqCat ? `Most frequent category: ${mostFreqCat[0]} (${mostFreqCat[1]} transactions)` : 'Add transactions to see patterns' },
    { icon: '📈', text: income > 0 ? `Total income ₹${income.toLocaleString('en-IN')} vs expenses ₹${expense.toLocaleString('en-IN')}` : 'Add income transactions' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ animation: 'fadeUp .35s ease both' }}>
        <h1 style={{ color: TX, fontSize: 24, fontWeight: 800, letterSpacing: -.8 }}>Insights</h1>
        <p style={{ color: TX2, fontSize: 13, marginTop: 4 }}>Understand your spending patterns and financial trends</p>
      </div>

      {/* Heatmap */}
      <Card delay={0} style={{ padding: '22px 20px' }}>
        <h3 style={{ color: TX, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Spending Heatmap</h3>
        <p style={{ color: TX2, fontSize: 11, marginBottom: 18 }}>Daily expense intensity over the past year</p>
        <Heatmap txns={txns} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 13 }}>
        {/* Monthly comparison */}
        <Card delay={.15} style={{ padding: '22px 20px' }}>
          <h3 style={{ color: TX, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Monthly Comparison</h3>
          <p style={{ color: TX2, fontSize: 11, marginBottom: 18 }}>Income vs expenses — last 3 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} margin={{ top: 4, right: 6, bottom: 0, left: -10 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="mo" tick={{ fill: TX3, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TX3, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CTip />} />
              <Bar dataKey="inc" name="Income" fill={GRN} radius={[5, 5, 0, 0]} fillOpacity={.85} />
              <Bar dataKey="exp" name="Expense" fill={RED} radius={[5, 5, 0, 0]} fillOpacity={.85} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top categories */}
        <Card delay={.2} style={{ padding: '22px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ color: TX, fontWeight: 700, fontSize: 15 }}>Top Spending Categories</h3>
            <Badge label={catData.length + ' categories'} color={TX2} bg={S1} border={BD} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {catData.map(c => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                    <span style={{ color: TX, fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: TX3, fontSize: 11 }}>{c.count} txns</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: TX2, fontSize: 11 }}>—</span>
                    <span style={{ color: TX, fontSize: 12, fontWeight: 700 }}>₹{c.value.toLocaleString('en-IN')}</span>
                    <span style={{ color: TX2, fontSize: 11 }}>{c.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div className="progress-bar" style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Observations */}
      <Card delay={.28} style={{ padding: '22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={16} color={AMB} />
          <h3 style={{ color: TX, fontWeight: 700, fontSize: 15 }}>Auto-generated Observations</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {observations.map((o, i) => (
            <div key={i} style={{ display: 'flex', gap: 11, padding: '13px 14px', borderRadius: 11, background: 'rgba(79,126,249,.07)', border: `1px solid rgba(79,126,249,.15)` }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{o.icon}</span>
              <p style={{ color: TX2, fontSize: 12, lineHeight: 1.55 }}>{o.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Bills Page ──────────────────────────────────────────── */
function BillForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || { name: '', amount: '', dueDate: new Date().toISOString().split('T')[0], category: 'Utilities', frequency: 'monthly', notes: '', paid: false });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input label="Bill Name" value={f.name} onChange={s('name')} placeholder="e.g. Electricity Bill" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Amount (₹)" type="number" value={f.amount} onChange={s('amount')} placeholder="0" />
        <Input label="Due Date" type="date" value={f.dueDate} onChange={s('dueDate')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Category" value={f.category} onChange={s('category')} options={Object.keys(CATS)} />
        <Input label="Frequency" value={f.frequency} onChange={s('frequency')} options={['monthly', 'weekly', 'yearly', 'once']} />
      </div>
      <Input label="Notes (optional)" value={f.notes} onChange={s('notes')} placeholder="Any notes..." />
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <Btn variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
        <Btn onClick={() => { if (!f.name || !f.amount) return; onSave({ ...f, amount: parseFloat(f.amount) }); }} style={{ flex: 2, justifyContent: 'center' }}>Save Bill</Btn>
      </div>
    </div>
  );
}

function Bills() {
  const { bills, role, addBill, editBill, delBill, toggleBillPaid, toast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const sorted = useMemo(() => [...bills].sort((a, b) => a.paid - b.paid || new Date(a.dueDate) - new Date(b.dueDate)), [bills]);
  const totalUnpaid = bills.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeUp .35s ease both' }}>
        <div>
          <h1 style={{ color: TX, fontSize: 24, fontWeight: 800, letterSpacing: -.8 }}>Bill Reminders</h1>
          <p style={{ color: TX2, fontSize: 13, marginTop: 4 }}>Total unpaid: <span style={{ color: RED, fontWeight: 700 }}>₹{totalUnpaid.toLocaleString('en-IN')}</span></p>
        </div>
        {role === 'admin' && <Btn Icon={Plus} onClick={() => setShowAdd(true)}>Add Bill</Btn>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {sorted.map((b, i) => {
          const s = billStatus(b.dueDate, b.paid);
          return (
            <Card key={b.id} delay={i * .04} style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertCircle size={18} color={s.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <p style={{ color: TX, fontSize: 15, fontWeight: 700 }}>{b.name}</p>
                    <Badge label={s.label} color={s.color} bg={s.bg} border={s.border} />
                    <Badge label={b.frequency} color={TX2} bg={S1} border={BD} />
                    {b.category && <Badge label={b.category} color={TX3} bg="rgba(255,255,255,.03)" border="rgba(255,255,255,.06)" />}
                  </div>
                  <p style={{ color: TX3, fontSize: 12, marginTop: 4 }}>Due {new Date(b.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{b.notes && ` · ${b.notes}`}</p>
                </div>
                <div style={{ display: 'flex', flex: '0 0 auto', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: b.paid ? GRN : RED, fontWeight: 800, fontSize: 16 }}>₹{b.amount.toLocaleString('en-IN')}</span>
                  {role === 'admin' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggleBillPaid(b.id)} className="ib" style={{ background: b.paid ? 'rgba(34,197,94,.12)' : S1, border: `1px solid ${b.paid ? GRN + '40' : BD}`, borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: b.paid ? GRN : TX2, fontSize: 11, fontWeight: 600, fontFamily: 'Sora,sans-serif' }}>{b.paid ? '✓ Paid' : 'Mark Paid'}</button>
                      <button onClick={() => setEditTarget(b)} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 7, color: TX3 }}><Pencil size={13} /></button>
                      <button onClick={() => delBill(b.id)} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 7, color: RED }}><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Bill">
        <BillForm onSave={d => { addBill(d); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Bill">
        {editTarget && <BillForm init={editTarget} onSave={d => { editBill(editTarget.id, d); setEditTarget(null); }} onClose={() => setEditTarget(null)} />}
      </Modal>
    </div>
  );
}

/* ─── Goals Page ──────────────────────────────────────────── */
function GoalForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || { name: '', emoji: '🎯', target: '', saved: '0', deadline: '', color: ACC });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const EMOJIS = ['🎯', '✈️', '🏠', '💻', '💰', '📱', '🎓', '🚗', '🛡️', '💍'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ color: TX2, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 7, letterSpacing: .3 }}>EMOJI</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => s('emoji')(e)} style={{ fontSize: 22, background: f.emoji === e ? ABG : S1, border: `1px solid ${f.emoji === e ? ACC : BD}`, borderRadius: 9, padding: '6px 8px', cursor: 'pointer' }}>{e}</button>
          ))}
        </div>
      </div>
      <Input label="Goal Name" value={f.name} onChange={s('name')} placeholder="e.g. Emergency Fund" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Target Amount (₹)" type="number" value={f.target} onChange={s('target')} placeholder="0" />
        <Input label="Already Saved (₹)" type="number" value={f.saved} onChange={s('saved')} placeholder="0" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Deadline" type="date" value={f.deadline} onChange={s('deadline')} />
        <div>
          <label style={{ color: TX2, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 7, letterSpacing: .3 }}>COLOR</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[PUR, AMB, GRN, RED, ACC, '#ec4899'].map(c => (
              <button key={c} onClick={() => s('color')(c)} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: f.color === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <Btn variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
        <Btn onClick={() => { if (!f.name || !f.target) return; onSave({ ...f, target: parseFloat(f.target), saved: parseFloat(f.saved || 0) }); }} style={{ flex: 2, justifyContent: 'center' }}>Save Goal</Btn>
      </div>
    </div>
  );
}

function Goals() {
  const { goals, role, addGoal, editGoal, delGoal, addSavings } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [savingsTarget, setSavingsTarget] = useState(null);
  const [savingsAmt, setSavingsAmt] = useState('');
  const total = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', animation: 'fadeUp .35s ease both' }}>
        <div>
          <h1 style={{ color: TX, fontSize: 24, fontWeight: 800, letterSpacing: -.8 }}>Goal Tracker</h1>
          <p style={{ color: TX2, fontSize: 13, marginTop: 4 }}>₹{totalSaved.toLocaleString('en-IN')} saved of ₹{total.toLocaleString('en-IN')} total target</p>
        </div>
        {role === 'admin' && <Btn Icon={Plus} onClick={() => setShowAdd(true)}>New Goal</Btn>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
        {goals.map((g, i) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const left = daysLeft(g.deadline);
          return (
            <Card key={g.id} delay={i * .07} style={{ padding: '22px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${g.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{g.emoji}</div>
                  <div>
                    <p style={{ color: TX, fontSize: 15, fontWeight: 700 }}>{g.name}</p>
                    <p style={{ color: TX3, fontSize: 11, marginTop: 1 }}>{left > 0 ? `${left} days left` : 'Deadline passed'}</p>
                  </div>
                </div>
                {role === 'admin' && (
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setEditTarget(g)} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6, color: TX3 }}><Pencil size={12} /></button>
                    <button onClick={() => delGoal(g.id)} className="ib" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6, color: RED }}><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: TX2, fontSize: 13 }}>₹{g.saved.toLocaleString('en-IN')} saved</span>
                <span style={{ color: g.color, fontWeight: 700, fontSize: 14 }}>{pct}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 9 }}>
                <div className="progress-bar" style={{ height: '100%', width: `${pct}%`, background: g.color, borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ color: TX3, fontSize: 11 }}>Target: ₹{g.target.toLocaleString('en-IN')}</span>
                <span style={{ color: TX3, fontSize: 11 }}>₹{(g.target - g.saved).toLocaleString('en-IN')} remaining</span>
              </div>
              {role === 'admin' && pct < 100 && (
                <button onClick={() => { setSavingsTarget(g); setSavingsAmt(''); }}
                  style={{ width: '100%', padding: '9px', borderRadius: 9, border: `1px solid ${BD}`, background: S1, color: TX2, cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all .18s' }}>
                  <Plus size={13} />+ Add Savings
                </button>
              )}
              {pct >= 100 && <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 9, padding: '8px', textAlign: 'center', color: GRN, fontSize: 13, fontWeight: 600 }}>🎉 Goal Completed!</div>}
            </Card>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Goal">
        <GoalForm onSave={d => { addGoal(d); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Goal">
        {editTarget && <GoalForm init={editTarget} onSave={d => { editGoal(editTarget.id, d); setEditTarget(null); }} onClose={() => setEditTarget(null)} />}
      </Modal>
      <Modal open={!!savingsTarget} onClose={() => setSavingsTarget(null)} title={`Add Savings — ${savingsTarget?.name}`}>
        {savingsTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Amount to add (₹)" type="number" value={savingsAmt} onChange={setSavingsAmt} placeholder="0" />
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setSavingsTarget(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
              <Btn onClick={() => { if (!savingsAmt) return; addSavings(savingsTarget.id, parseFloat(savingsAmt)); setSavingsTarget(null); }} style={{ flex: 2, justifyContent: 'center' }}>Add Savings</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ─── Recurring Page ──────────────────────────────────────── */
function RecForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || { name: '', category: 'Salary', type: 'income', amount: '', frequency: 'monthly', nextDate: new Date().toISOString().split('T')[0], active: true });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input label="Name" value={f.name} onChange={s('name')} placeholder="e.g. Monthly Salary" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Amount (₹)" type="number" value={f.amount} onChange={s('amount')} placeholder="0" />
        <Input label="Next Date" type="date" value={f.nextDate} onChange={s('nextDate')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Category" value={f.category} onChange={s('category')} options={Object.keys(CATS)} />
        <Input label="Frequency" value={f.frequency} onChange={s('frequency')} options={['daily', 'weekly', 'monthly', 'yearly']} />
      </div>
      <div>
        <label style={{ color: TX2, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 7, letterSpacing: .3 }}>TYPE</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['income', 'expense'].map(tp => (
            <button key={tp} onClick={() => s('type')(tp)} style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700, transition: 'all .18s', background: f.type === tp ? (tp === 'income' ? 'rgba(34,197,94,.18)' : 'rgba(239,68,68,.18)') : S1, color: f.type === tp ? (tp === 'income' ? GRN : RED) : TX2, borderWidth: 1, borderStyle: 'solid', borderColor: f.type === tp ? (tp === 'income' ? GRN + '40' : RED + '40') : BD }}>
              {tp.charAt(0).toUpperCase() + tp.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <Btn variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
        <Btn onClick={() => { if (!f.name || !f.amount) return; onSave({ ...f, amount: parseFloat(f.amount) }); }} style={{ flex: 2, justifyContent: 'center' }}>Save</Btn>
      </div>
    </div>
  );
}

function Recurring() {
  const { recurring, role, addRec, editRec, delRec, toggleRec, generateNow } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const active = recurring.filter(r => r.active);
  const inactive = recurring.filter(r => !r.active);
  const monthlyNet = active.reduce((s, r) => r.type === 'income' ? s + r.amount : s - r.amount, 0);

  const RecItem = ({ r }) => (
    <Card style={{ padding: '18px 20px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: r.type === 'income' ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {r.type === 'income' ? <TrendingUp size={17} color={GRN} /> : <TrendingDown size={17} color={RED} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: TX, fontSize: 14, fontWeight: 700 }}>{r.name}</p>
          <p style={{ color: TX3, fontSize: 12, marginTop: 2 }}>{r.category} · {r.frequency} · Next: {r.nextDate}</p>
        </div>
        <span style={{ color: r.type === 'income' ? GRN : RED, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
          {r.type === 'income' ? '+' : '-'}₹{r.amount.toLocaleString('en-IN')}
        </span>
      </div>
      {role === 'admin' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BD}`, flexWrap: 'wrap' }}>
          <button onClick={() => generateNow(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, background: S1, border: `1px solid ${BD}`, color: TX2, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}><PlayCircle size={13} />Generate Now</button>
          <button onClick={() => toggleRec(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, background: S1, border: `1px solid ${BD}`, color: TX2, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>{r.active ? <><Pause size={13} />Deactivate</> : <><Play size={13} />Activate</>}</button>
          <button onClick={() => setEditTarget(r)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, background: S1, border: `1px solid ${BD}`, color: TX2, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}><Pencil size={13} />Edit</button>
          <button onClick={() => delRec(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.22)', color: RED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}><Trash2 size={13} />Delete</button>
        </div>
      )}
    </Card>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', animation: 'fadeUp .35s ease both' }}>
        <div>
          <h1 style={{ color: TX, fontSize: 24, fontWeight: 800, letterSpacing: -.8 }}>Recurring Transactions</h1>
          <p style={{ color: TX2, fontSize: 13, marginTop: 4 }}>Monthly net estimate: <span style={{ color: monthlyNet >= 0 ? GRN : RED, fontWeight: 700 }}>{monthlyNet >= 0 ? '+' : ''}₹{Math.abs(monthlyNet).toLocaleString('en-IN')}</span></p>
        </div>
        {role === 'admin' && <Btn Icon={Plus} onClick={() => setShowAdd(true)}>Add Recurring</Btn>}
      </div>

      {active.length > 0 && (
        <div>
          <p style={{ color: TX3, fontSize: 11, fontWeight: 700, letterSpacing: .8, marginBottom: 10 }}>ACTIVE</p>
          {active.map(r => <RecItem key={r.id} r={r} />)}
        </div>
      )}
      {inactive.length > 0 && (
        <div>
          <p style={{ color: TX3, fontSize: 11, fontWeight: 700, letterSpacing: .8, marginBottom: 10 }}>INACTIVE</p>
          {inactive.map(r => <RecItem key={r.id} r={r} />)}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Recurring">
        <RecForm onSave={d => { addRec(d); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Recurring">
        {editTarget && <RecForm init={editTarget} onSave={d => { editRec(editTarget.id, d); setEditTarget(null); }} onClose={() => setEditTarget(null)} />}
      </Modal>
    </div>
  );
}

/* ─── Modal Router (Quick Actions) ───────────────────────── */
function ModalRouter() {
  const { modal, setModal, addTxn, addBill, addGoal } = useApp();
  return (
    <>
      <Modal open={modal === 'addTxn'} onClose={() => setModal(null)} title="Add Transaction">
        <TxnForm onSave={d => { addTxn(d); setModal(null); }} onClose={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'addBill'} onClose={() => setModal(null)} title="Add Bill">
        <BillForm onSave={d => { addBill(d); setModal(null); }} onClose={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'addGoal'} onClose={() => setModal(null)} title="New Goal">
        <GoalForm onSave={d => { addGoal(d); setModal(null); }} onClose={() => setModal(null)} />
      </Modal>
    </>
  );
}

/* ─── Shell ───────────────────────────────────────────────── */
function Shell() {
  const { page } = useApp();
  const PAGES = { overview: Overview, transactions: Transactions, insights: Insights, bills: Bills, goals: Goals, recurring: Recurring };
  const Page = PAGES[page] || Overview;

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: BG, minHeight: '100vh', color: TX, display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <AnimatedBG />
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1, minWidth: 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '22px 26px' }}>
          <Page key={page} />
          <div style={{ height: 28 }} />
        </main>
      </div>
      <NotifPanel />
      <ModalRouter />
      <Toasts />
    </div>
  );
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>;
}
