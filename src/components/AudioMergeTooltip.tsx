import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

function AudioMergeTooltip() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <InfoIcon className="h-3.5 w-3.5 text-zinc-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Merge all tracks into one</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AudioMergeTooltip;
