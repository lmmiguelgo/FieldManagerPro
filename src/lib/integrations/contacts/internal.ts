import {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  queryDocuments,
  orderBy,
} from "@/lib/firebase/firestore";
import type { ContactRecord, ContactsProvider } from "./types";
import type { Customer } from "@/types/customer";

function toContactRecord(customer: Customer & { id: string }): ContactRecord {
  return {
    id: customer.id,
    companyName: customer.companyName,
    contactName: customer.contactName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    notes: customer.notes,
  };
}

export const internalContactsProvider: ContactsProvider = {
  async list() {
    const customers = await queryDocuments<Customer>(
      "customers",
      orderBy("companyName")
    );
    return customers.map(toContactRecord);
  },

  async get(id) {
    const customer = await getDocument<Customer>("customers", id);
    return customer ? toContactRecord(customer) : null;
  },

  async create(contact) {
    const ref = await addDocument("customers", {
      ...contact,
      isActive: true,
      createdBy: "system",
    });
    return { id: ref.id, ...contact };
  },

  async update(id, contact) {
    await updateDocument("customers", id, contact);
  },

  async delete(id) {
    await deleteDocument("customers", id);
  },
};
