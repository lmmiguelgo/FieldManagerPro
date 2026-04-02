export interface ContactRecord {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
}

export interface ContactsProvider {
  list(): Promise<ContactRecord[]>;
  get(id: string): Promise<ContactRecord | null>;
  create(contact: Omit<ContactRecord, "id">): Promise<ContactRecord>;
  update(id: string, contact: Partial<Omit<ContactRecord, "id">>): Promise<void>;
  delete(id: string): Promise<void>;
}
