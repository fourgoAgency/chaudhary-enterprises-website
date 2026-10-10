"use client";

import { Tabs } from "radix-ui";

export type ProductTab = { value: string; label: string; content: React.ReactNode };

export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value}>
      <Tabs.List aria-label="Product information" className="flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="-mb-px shrink-0 border-b-2 border-transparent py-3 font-semibold whitespace-nowrap text-muted transition-colors hover:text-black data-[state=active]:border-blue data-[state=active]:text-black"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="max-w-3xl pt-6 leading-[1.75]">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
