import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { NavItem } from './Navbar';

export type ModalMode = 'reserve' | 'connect' | null;

interface ReserveModalProps {
  mode: ModalMode;
  activeModule: NavItem;
  onClose: () => void;
}

export function ReserveModal({
  mode,
  activeModule,
  onClose,
}: ReserveModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('Carbon Chassis');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!mode) return;
    setError('');
    setSubmitted(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, onClose]);

  if (!mode) return null;

  const isReserve = mode === 'reserve';
  const title = isReserve ? 'Reserve Enhancement Slot' : 'Connect with Clinical Team';
  const subtitle = isReserve
    ? `Request allocation for ${activeModule} intake.`
    : 'Schedule a technical consultation for hardware & biotech integration.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-neutral-950 border border-white/15 p-6 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 id="modal-heading" className="text-lg font-semibold tracking-tight pr-8">
          {title}
        </h2>
        <p className="mt-1 text-xs text-white/70 leading-relaxed">{subtitle}</p>

        {submitted ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-xs leading-relaxed text-white/90">
              <p className="font-semibold text-white">Request confirmed</p>
              <p className="mt-1 text-white/75">
                {name.trim()}, your {isReserve ? `${tier} reservation` : 'consultation'} request has been queued for{' '}
                <span className="text-white">{email.trim()}</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
            <div>
              <label htmlFor="reserve-name" className="block text-xs font-medium text-white/80 mb-1.5">
                Full Name
              </label>
              <input
                id="reserve-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="reserve-email" className="block text-xs font-medium text-white/80 mb-1.5">
                Email Address
              </label>
              <input
                id="reserve-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white focus:outline-none"
              />
            </div>

            {isReserve && (
              <div>
                <label htmlFor="reserve-tier" className="block text-xs font-medium text-white/80 mb-1.5">
                  Configuration
                </label>
                <select
                  id="reserve-tier"
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-neutral-900 px-3.5 py-2.5 text-sm text-white focus:border-white focus:outline-none"
                >
                  <option value="Carbon Chassis">Carbon Chassis</option>
                  <option value="Titanium Neuro-Link">Titanium Neuro-Link</option>
                  <option value="Full Symbiosis">Full Symbiosis</option>
                </select>
              </div>
            )}

            {error && (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-white/20 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-white py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {isReserve ? 'Submit Reservation' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
