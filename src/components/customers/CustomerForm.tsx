"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomerFormSchema, type CustomerFormData } from "@/schemas/customer.schema";
import { addDocument, updateDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/types/customer";

interface CustomerFormProps {
  customer?: Customer;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: customer
      ? {
          companyName: customer.companyName,
          contactName: customer.contactName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes ?? "",
          isActive: customer.isActive,
        }
      : {
          isActive: true,
          address: { street: "", city: "", state: "", zip: "" },
        },
  });

  async function onSubmit(data: CustomerFormData) {
    setServerError(null);
    try {
      if (customer) {
        await updateDocument("customers", customer.id, data);
        router.push(`/customers/${customer.id}`);
      } else {
        const ref = await addDocument("customers", {
          ...data,
          createdBy: user!.uid,
        });
        router.push(`/customers/${ref.id}`);
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="companyName"
          label="Company Name"
          placeholder="Acme Corp"
          error={errors.companyName?.message}
          {...register("companyName")}
        />
        <Input
          id="contactName"
          label="Contact Name"
          placeholder="John Smith"
          error={errors.contactName?.message}
          {...register("contactName")}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="john@acme.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="phone"
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Address
        </legend>
        <Input
          id="street"
          label="Street"
          placeholder="123 Main St"
          error={errors.address?.street?.message}
          {...register("address.street")}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="city"
            label="City"
            placeholder="Springfield"
            error={errors.address?.city?.message}
            {...register("address.city")}
          />
          <Input
            id="state"
            label="State"
            placeholder="IL"
            error={errors.address?.state?.message}
            {...register("address.state")}
          />
          <Input
            id="zip"
            label="ZIP"
            placeholder="62701"
            error={errors.address?.zip?.message}
            {...register("address.zip")}
          />
        </div>
      </fieldset>

      <Textarea
        id="notes"
        label="Notes"
        placeholder="Any additional notes..."
        rows={3}
        error={errors.notes?.message}
        {...register("notes")}
      />

      {customer && (
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            className="rounded border-zinc-300"
            {...register("isActive")}
          />
          Active customer
        </label>
      )}

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
          {customer ? "Save Changes" : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
