import { CustomerEditView } from "@/components/customers/CustomerEditView";

export default async function CustomerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerEditView id={id} />;
}
