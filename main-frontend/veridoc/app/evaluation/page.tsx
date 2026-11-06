"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";
import EvaluationView from "@/components/evaluation/EvaluationView";

export default function EvaluationPage() {
  return (
    <AppShell>
      <EvaluationView />
    </AppShell>
  );
}
