import React from "react";

const TopPlaces = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Top Places</h1>
        <p>This is the top places page content.</p>
      </main>
    </div>
  );
};

export default TopPlaces;
