import createHttpError from 'http-errors';
import {
  createContact,
  deleteContactById,
  getAllContacts,
  // getContactsById,
  upsertContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contactOwnerId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    contactOwnerId,
  });
  res.status(200).json(contacts);
};

export const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const contactOwnerId = req.user._id;

  const contact = await getContactsById(id, contactOwnerId);

  res.json({
    status: 200,
    message: `Successfully get contact with id ${id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact(
    { ...req.body, photo: photoUrl },
    req.user._id,
  );

  res.status(201).json(contact);

  // res.status(201).json({
  //   status: 201,
  //   message: 'Successfully created a contact!',
  //   data: contact,
  // });
};

export const patchContactController = async (req, res) => {
  const contactOwnerId = req.user._id;
  const { contactId } = req.params;

  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const { contact } = await upsertContact(
    contactId,
    { ...req.body, photo: photoUrl },
    contactOwnerId,
  );

  res.status(200).json({
    status: 200,
    message: `Successfully patched contact!`,
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const contactOwnerId = req.user._id;
  const { contactId } = req.params;

  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const { isNew, contact } = await upsertContact(
    contactId,
    { ...req.body, photo: photoUrl },
    contactOwnerId,
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted contact!`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contactOwnerId = req.user._id;

  const contact = await deleteContactById(contactId, contactOwnerId);
  res.status(204).send();
};
