import { IronSessionOptions, sealData, unsealData } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSideProps, NextApiHandler, NextApiRequest } from "next";

import { randomid } from "./nanoid";

const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_PASSWORD,
  cookieName: "rallly-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl: 0, // basically forever
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: GetServerSideProps) {
  return withIronSessionSsr(handler, sessionOptions);
}

export const decryptToken = async <P extends Record<string, unknown>>(
  token: string,
): Promise<P> => {
  return await unsealData(token, { password: sessionOptions.password });
};

export const createToken = async <T extends Record<string, unknown>>(
  payload: T,
) => {
  return await sealData(payload, {
    password: sessionOptions.password,
    ttl: 60 * 15, // 15 minutes
  });
};

export const createGuestUser = async (req: NextApiRequest) => {
  req.session.user = {
    id: `user-${await randomid()}`,
    isGuest: true,
  };
  await req.session.save();
};
