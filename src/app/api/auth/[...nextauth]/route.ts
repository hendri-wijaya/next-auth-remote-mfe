import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";

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
      issuer: "https://identity-platform.domain.local/am/oauth2",
      clientId: process.env.FORGEROCK_CLIENT_ID ?? "",
      clientSecret: process.env.FORGEROCK_CLIENT_SECRET ?? "",
      authorization: {
        url: "https://identity-platform.domain.local/am/oauth2/authorize",
        params: {
          response_type: "code",
          client_id: process.env.FORGEROCK_CLIENT_ID,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/forgerock`,
          scope: "openid profile email",
          state: "xyz123",
        },
      },
      token: "https://identity-platform.domain.local/am/oauth2/access_token?realm=/",
      userinfo: "https://identity-platform.domain.local/am/oauth2/userinfo?realm=/",
      profile(profile: any) {
        console.log("ForgeRock profile received", profile);
          console.log("ForgeRock profile received", profile);
          return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  // adapter: RedisAdapter(redis),
  // adapter: RedisAdapter(redis),
  events: {
    signIn: async (message: any) => {
      console.log("NextAuth signIn event", message);
    },
    signOut: async (message: any) => {
      console.log("NextAuth signOut event", message);
    },
    createUser: async (message: any) => {
      console.log("NextAuth createUser event", message);
    },
    updateUser: async (message: any) => {
      console.log("NextAuth updateUser event", message);
    },
    linkAccount: async (message: any) => {
      console.log("NextAuth linkAccount event", message);
    },
    session: async (message: any) => {
      console.log("NextAuth session event", message);
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
    // Redirect to Google after successful sign in
    redirect: async () => {
      return "https://www.google.com";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
