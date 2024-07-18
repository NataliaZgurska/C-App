import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

const verifyContactOwnership = async (contactId, contactOwnerId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
  });
  if (!contact) {
    throw createHttpError(404, `Contact not found!`);
  }

  const areEqual = contactOwnerId.equals(contact.userId);
  if (!areEqual) {
    throw createHttpError(403, 'You have not such contact!');
  }
  return contact;
};

export const getAllContacts = async ({
  page = 1,
  perPage = 100,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  contactOwnerId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({
    userId: contactOwnerId,
  });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    ContactsCollection.find()
      .merge(contactsQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId, contactOwnerId) => {
  await verifyContactOwnership(contactId, contactOwnerId);

  const contact = await ContactsCollection.findOne({
    _id: contactId,
  });

  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId: userId,
  });
  return contact;
};

export const upsertContact = async (
  contactId,
  payload,
  contactOwnerId,
  options = {},
) => {
  await verifyContactOwnership(contactId, contactOwnerId);

  const rawResult = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (contactId, contactOwnerId) => {
  await verifyContactOwnership(contactId, contactOwnerId);
  await ContactsCollection.findByIdAndDelete(contactId);
};
