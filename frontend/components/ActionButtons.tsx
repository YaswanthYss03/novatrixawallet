import { ArrowUpRight, Plus, Repeat, Building2, Sprout } from 'lucide-react';

interface ActionButtonsProps {
  onSend: () => void;
  onFund: () => void;
  onSwap: () => void;
  onSell: () => void;
  onEarn: () => void;
}

export default function ActionButtons({ onSend, onFund, onSwap, onSell, onEarn }: ActionButtonsProps) {
  const buttons = [
    { label: 'Send', icon: ArrowUpRight, onClick: onSend, bg: 'bg-[#3A3B3F]' },
    { label: 'Receive', icon: Plus, onClick: onFund, bg: 'bg-primary' },
    { label: 'Swap', icon: Repeat, onClick: onSwap, bg: 'bg-[#3A3B3F]' },
    { label: 'History', icon: Building2, onClick: onSell, bg: 'bg-[#3A3B3F]' },
    { label: 'Earn', icon: Sprout, onClick: onEarn, bg: 'bg-[#3A3B3F]' },
  ];

  return (
    <div className="flex justify-around items-center px-4 py-6 gap-2">
      {buttons.map((button) => (
        <button
          key={button.label}
          onClick={button.onClick}
          className="flex flex-col items-center gap-2"
        >
          <div className={`${button.bg} w-14 h-14 rounded-2xl flex items-center justify-center card-hover`}>
            <button.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white text-sm font-medium">{button.label}</span>
        </button>
      ))}
    </div>
  );
}
