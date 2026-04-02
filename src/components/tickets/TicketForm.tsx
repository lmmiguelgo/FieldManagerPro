"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { TicketFormSchema, type TicketFormData } from "@/schemas/ticket.schema";
import { addDocument, updateDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useCustomers } from "@/hooks/useCustomers";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket } from "@/types/ticket";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const STATUS_OPTIONS = [
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface TicketFormProps {
  ticket?: Ticket;
}

export function TicketForm({ ticket }: TicketFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { customers } = useCustomers();
  const { technicians } = useUsers();
  const [serverError, setServerError] = useState<string | null>(null);

  const prefilledCustomerId = searchParams.get("customerId") ?? "";
  const prefilledCustomerName = searchParams.get("customerName") ?? "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(TicketFormSchema) as Resolver<TicketFormData>,
    defaultValues: ticket
      ? {
          customerId: ticket.customerId,
          customerName: ticket.customerName,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          assignedTechnicianId: ticket.assignedTechnicianId ?? "",
          assignedTechnicianName: ticket.assignedTechnicianName ?? "",
          scheduledDate: ticket.scheduledDate
            .toDate()
            .toISOString()
            .split("T")[0],
          scheduledTime: ticket.scheduledTime,
          estimatedDuration: ticket.estimatedDuration,
        }
      : {
          customerId: prefilledCustomerId,
          customerName: prefilledCustomerName,
          priority: "medium",
          status: "unassigned",
          scheduledDate: "",
          scheduledTime: "08:00",
          estimatedDuration: 60,
        },
  });

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: c.companyName,
  }));

  const technicianOptions = [
    { value: "", label: "Unassigned" },
    ...technicians.map((t) => ({
      value: t.uid,
      label: t.displayName,
    })),
  ];

  function onCustomerChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = customers.find((c) => c.id === e.target.value);
    setValue("customerId", e.target.value);
    setValue("customerName", selected?.companyName ?? "");
  }

  function onTechnicianChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = technicians.find((t) => t.uid === e.target.value);
    setValue("assignedTechnicianId", e.target.value);
    setValue("assignedTechnicianName", selected?.displayName ?? "");
    if (selected) {
      setValue("status", "assigned");
    } else {
      setValue("status", "unassigned");
    }
  }

  async function onSubmit(data: TicketFormData) {
    setServerError(null);
    try {
      const scheduledDate = Timestamp.fromDate(new Date(data.scheduledDate));
      const payload = {
        ...data,
        scheduledDate,
        assignedTechnicianId: data.assignedTechnicianId || null,
        assignedTechnicianName: data.assignedTechnicianName || null,
      };

      if (ticket) {
        await updateDocument("tickets", ticket.id, payload);
        router.push(`/tickets/${ticket.id}`);
      } else {
        const ref = await addDocument("tickets", {
          ...payload,
          createdBy: user!.uid,
        });
        router.push(`/tickets/${ref.id}`);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {serverError}
        </p>
      )}

      <Select
        id="customerId"
        label="Customer"
        placeholder="Select a customer"
        options={customerOptions}
        error={errors.customerId?.message}
        value={watch("customerId")}
        onChange={onCustomerChange}
      />

      <Textarea
        id="description"
        label="Description"
        placeholder="Describe the service needed..."
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="priority"
          label="Priority"
          options={PRIORITY_OPTIONS}
          error={errors.priority?.message}
          {...register("priority")}
        />
        <Select
          id="status"
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register("status")}
        />
      </div>

      <Select
        id="assignedTechnicianId"
        label="Assign Technician"
        options={technicianOptions}
        value={watch("assignedTechnicianId") ?? ""}
        onChange={onTechnicianChange}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          id="scheduledDate"
          label="Scheduled Date"
          type="date"
          error={errors.scheduledDate?.message}
          {...register("scheduledDate")}
        />
        <Input
          id="scheduledTime"
          label="Scheduled Time"
          type="time"
          error={errors.scheduledTime?.message}
          {...register("scheduledTime")}
        />
        <Input
          id="estimatedDuration"
          label="Duration (minutes)"
          type="number"
          min={1}
          error={errors.estimatedDuration?.message}
          {...register("estimatedDuration")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {ticket ? "Save Changes" : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
}
