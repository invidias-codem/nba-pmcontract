import { TradingCard } from '@/components/TradingCard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Tokenologist &nbsp;
          <code className="font-mono font-bold">Concept Demo</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-bold text-white mb-4">Winning Card</h3>
          <TradingCard tokenId="123" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-bold text-white mb-4">Losing Card</h3>
          <TradingCard tokenId="124" />
        </div>
      </div>
    </main>
  );
}
