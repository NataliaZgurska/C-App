import createHttpError from 'http-errors';
import { THIRTY_DAYS } from '../constants/index.js';
import {
  checkPassword,
  findUserByEmail,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: THIRTY_DAYS,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: THIRTY_DAYS,
  });
};

export const registerUserController = async (req, res, next) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    user: { name: user.name, email: user.email },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    user: { name: user.name, email: user.email },
    accessToken: session.accessToken,
  });
};

// ********** logoutController  *************
export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser({
      sessionId: req.cookies.sessionId,
      sessionToken: req.cookies.sessionToken,
    });
  }

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');

  res.status(204).send();
};

export const refreshTokenController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;
  const session = await refreshSession({ sessionId, sessionToken });

  setupSessionCookies(res, session);

  res.status(200).json({
    accessToken: session.accessToken,
  });
  // res.json({
  //   status: 200,
  //   message: 'Token refreshed successfully!',
  //   data: { accessToken: session.accessToken },
  // });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
