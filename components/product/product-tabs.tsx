"use client";

import { Tabs } from "radix-ui";

export type ProductTab = { value: string; label: string; content: React.ReactNode };

export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value}>
      <Tabs.List aria-label="Product information" className="flex gap-8 overflow-x-auto border-b border-line">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="-mb-px border-b-2 border-transparent py-3 text-sm font-semibold whitespace-nowrap text-muted transition-colors hover:text-navy data-[state=active]:border-navy data-[state=active]:text-navy"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="max-w-3xl pt-6 text-[15px] leading-[1.8] text-ink">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
