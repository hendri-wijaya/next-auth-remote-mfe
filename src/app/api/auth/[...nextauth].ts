import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";
import { RedisAdapter } from "@/lib/redis-adapter";
import Redis from "ioredis";

const redis = new Redis();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your own user validation logic
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
    Auth0Provider({
      id: "forgerock",
      name: "ForgeRock",
      issuer: process.env.FORGEROCK_ISSUER_URL,
  clientId: process.env.FORGEROCK_CLIENT_ID ?? "",
  clientSecret: process.env.FORGEROCK_CLIENT_SECRET ?? "",
      authorization: {
        url: process.env.FORGEROCK_AUTHORIZATION_URL,
        params: {
          scope: "openid profile email",
        },
      },
      token: process.env.FORGEROCK_TOKEN_URL,
      userinfo: process.env.FORGEROCK_USERINFO_URL,
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  adapter: RedisAdapter(redis),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };