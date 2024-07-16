import {
  TEMP_UPLOAD_DIR,
  UPLOAD_DIR,
} from '../nodejs-hw-mongodb/src/constants/index.js';
import { initMongoConnection } from '../nodejs-hw-mongodb/src/db/initMongoConnection.js';
import { setupServer } from '../nodejs-hw-mongodb/src/server.js';
import { createDirIfNotExists } from '../nodejs-hw-mongodb/src/utils/createDirIfNotExists.js';

(async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
})();
