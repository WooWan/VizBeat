import { RefreshCwIcon } from 'lucide-react';

type Props = {
  reset: () => void;
};

export function SearchFallback({ reset }: Props) {
  return (
    <div className="relative flex h-20 w-full items-center justify-center gap-x-1 rounded-md bg-gray-100/[0.75]">
      <span className="text-gray-400">No results</span>
      <button type="button" onClick={reset}>
        <RefreshCwIcon className="h-4 w-4  text-gray-400" />
      </button>
    </div>
  );
}
