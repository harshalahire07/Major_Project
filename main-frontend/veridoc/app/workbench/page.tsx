"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";
import DocumentWorkspace from "@/components/workspace/DocumentWorkspace";

export default function WorkbenchPage() {
  return (
    <AppShell>
      <DocumentWorkspace />
    </AppShell>
  );
}
