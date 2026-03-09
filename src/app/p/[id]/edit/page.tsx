import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/db";
import EditForm from "@/components/editor/EditForm";
import type { Metadata } from "next";

interface Props { params: { id: string } }

export const metadata: Metadata = { title: "Edit Portfolio — PortfolioAI" };

export default async function EditPage({ params }: Props) {
  const row = await getPortfolio(params.id);
  if (!row) notFound();

  return <EditForm initial={row.data} portfolioId={params.id} />;
}
