import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import OktaProvider from "next-auth/providers/okta";

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
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer: "https://integrator-9547141.okta.com/oauth2/default",
      authorization: {
        params: {
          scope: "openid profile email",
          idp: process.env.OKTA_FEDERATED_IDP!, // 👈 forces federation to ForgeRock
        },
      },
    }),
  ],
  // adapter: RedisAdapter(redis),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };