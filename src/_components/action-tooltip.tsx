"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/_components/ui/tooltip";
type ActionTooltipProps = Omit<React.ComponentProps<typeof TooltipContent>, "label"> & {
  label: string;
  children: React.ReactNode;
};

const ActionTooltip = ({ label, children, side, align, ...props }: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ActionTooltip;