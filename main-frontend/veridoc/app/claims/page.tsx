"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";
import ClaimsView from "@/components/claims/ClaimsView";

export default function ClaimsPage() {
  return (
    <AppShell>
      <ClaimsView />
    </AppShell>
  );
}

