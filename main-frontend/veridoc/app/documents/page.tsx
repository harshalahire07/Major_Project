"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";
import DocumentsView from "@/components/documents/DocumentsView";

export default function DocumentsPage() {
  return (
    <AppShell>
      <DocumentsView />
    </AppShell>
  );
}

