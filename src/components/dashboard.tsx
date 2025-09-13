'use client';

import Header from './header';
import JournalEntryForm from './journal-entry-form';
import ActiveQuest from './active-quest';
import ProgressChart from './progress-chart';
import JournalHistory from './journal-history';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
          <div className="grid gap-6">
            <JournalEntryForm />
            <ActiveQuest />
            <ProgressChart />
            <JournalHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
