// Middleware authenticate виконує процес аутентифікації користувача,
//   перевіряючи наявність та дійсність токена доступу в заголовку запиту.

import createHttpError from 'http-errors';

import { Sessions } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await Sessions.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;

  next();
};

// import createHttpError from 'http-errors';
// import { Session } from '../db/models/session.js';
// import { User } from '../db/models/user.js';

// export const authenticate = async (req, res, next) => {
//   const header = req.get('Authorization');

//   if (!header) {
//     return next(createHttpError(401, 'Auth header is not provided'));
//   }

//   const [bearer, token] = header.split(' ');

//   if (bearer !== 'Bearer' || !token) {
//     return next(createHttpError(401, 'Auth header should be of bearer type'));
//   }

//   const session = await Session.findOne({ accessToken: token });

//   if (!session) {
//     return next(createHttpError(401, 'Session not found!'));
//   }

//   if (Date.now() > session.accessTokenValidUntil) {
//     return next(createHttpError(401, 'Access token expired!'));
//   }

//   const user = await User.findById(session.userId);

//   if (!user) {
//     return next(
//       createHttpError(401, 'User associated with this session is not found!'),
//     );
//   }

//   req.user = user;

//   return next();
// };
