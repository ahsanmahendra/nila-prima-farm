import { XMarkIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

// ── Alert ──
export function Alert({ type = 'info', message, onClose }) {
  const map = {
    success: { Icon: CheckCircleIcon,       bg: 'bg-green-50 border-green-200', text: 'text-green-800', ic: 'text-green-500' },
    error:   { Icon: XCircleIcon,           bg: 'bg-red-50 border-red-200',     text: 'text-red-800',   ic: 'text-red-500' },
    warning: { Icon: ExclamationTriangleIcon, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', ic: 'text-amber-500' },
    info:    { Icon: InformationCircleIcon, bg: 'bg-blue-50 border-blue-200',   text: 'text-blue-800',  ic: 'text-blue-500' },
  }
  const { Icon, bg, text, ic } = map[type] || map.info
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${bg}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ic}`} />
      <p className={`text-sm font-medium flex-1 ${text}`}>{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600">
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ── Spinner ──
export function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }
  const colors = { primary: 'border-primary-600', white: 'border-white', slate: 'border-slate-400' }
  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  )
}

// ── LoadingPage ──
export function LoadingPage() {
  return (
    <div className="min-h-96 flex flex-col items-center justify-center gap-4">
      <Spinner size="xl" />
      <p className="text-slate-500 text-sm font-medium">Memuat data...</p>
    </div>
  )
}

// ── EmptyState ──
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-3xl">
        {icon || '📭'}
      </div>
      <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}

// ── StatusBadge ──
export function StatusBadge({ status, map }) {
  const cfg = map?.[status] || { label: status, color: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

// ── QuantityCounter ──
export function QuantityCounter({ value, onChange, min = 1, max = 9999, size = 'md' }) {
  const btnCls = size === 'sm'
    ? 'w-7 h-7 text-sm'
    : 'w-9 h-9 text-base'
  const inputW = size === 'sm' ? 'w-10 text-sm' : 'w-14 text-sm'

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnCls} bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors`}
      >−</button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => {
          const v = Math.max(min, Math.min(max, parseInt(e.target.value) || min))
          onChange(v)
        }}
        className={`${inputW} text-center bg-transparent font-semibold text-slate-800 focus:outline-none`}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnCls} bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors`}
      >+</button>
    </div>
  )
}

// ── StarRating ──
export function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-700">{rating}</span>
      {count !== undefined && <span className="text-xs text-slate-400">({count} ulasan)</span>}
    </div>
  )
}

// ── Modal ──
export function Modal({ open, onClose, title, children, maxW = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxW} bg-white rounded-2xl shadow-2xl`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
