import createHttpError from 'http-errors';
import { ONE_DAY } from '../constants/index.js';
import {
  // checkPassword,
  // findUserByEmail,
  loginUser,
  refreshUsersSession,
  logoutUser,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

const setupSessionCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

// ********** registerUserController  *************
export const registerUserController = async (req, res, next) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    user: { name: user.name, email: user.email },
  });
};

// ********** loginUserController  *************
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSessionCookies(res, session);

  res.status(200).json({
    user: { name: user.name, email: user.email },
    accessToken: session.accessToken,
  });
};

// ********** refreshUserSessionController  *************

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSessionCookies(res, session);

  res.status(200).json({
    accessToken: session.accessToken,
  });
};

// ********** logoutController  *************
export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

// ********** requestResetEmailController  *************
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

// ********** resetPasswordController  *************
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
