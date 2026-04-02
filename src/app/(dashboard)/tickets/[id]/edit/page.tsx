import { TicketEditView } from "@/components/tickets/TicketEditView";

export default async function TicketEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketEditView id={id} />;
}
