import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactByIdController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  // putContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middleware/validateBody.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  validateObjectId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateObjectId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// contactsRouter.put(
//   '/:contactId',
//   upload.single('photo'),
//   validateObjectId,
//   validateBody(updateContactSchema),
//   ctrlWrapper(putContactController),
// );

contactsRouter.delete(
  '/:contactId',
  validateObjectId,
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
