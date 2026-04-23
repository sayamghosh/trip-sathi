"use client";

import { Suspense } from 'react';
import SearchPage from '../search/page';

export default function GuidesPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading guides...</div>}>
            <SearchPage />
        </Suspense>
    );
}
