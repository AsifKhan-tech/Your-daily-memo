import Contact from "./contact.model.js";

const createContact = async ({ email, description }) => {
  const contact = await Contact.create({ email, description });
  return contact;
};

export { createContact };