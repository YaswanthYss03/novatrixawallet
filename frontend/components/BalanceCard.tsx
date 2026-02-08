interface BalanceCardProps {
  totalBalance: number;
}

export default function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <div className="text-center py-8">
      <h2 className="text-5xl font-bold text-white mb-2">
        ${totalBalance.toFixed(2)}
      </h2>
    </div>
  );
}
