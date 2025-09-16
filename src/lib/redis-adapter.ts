// Minimal Redis Adapter for NextAuth.js
// Source: https://github.com/nextauthjs/adapters/tree/main/packages/redis
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken
} from "next-auth/adapters";
import type { Redis } from "ioredis";

export function RedisAdapter(redis: Redis): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const id = Math.random().toString(36).substring(2, 15);
      const newUser: AdapterUser = { id, ...user };
      await redis.hset(`user:${id}`, newUser);
      return newUser;
    },
    async getUser(id: string): Promise<AdapterUser | null> {
      const data = await redis.hgetall(`user:${id}`);
      if (data && data.id) {
        return {
          id: data.id,
          email: data.email,
          emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
          name: data.name,
          image: data.image,
        };
      }
      return null;
    },
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const keys = await redis.keys("user:*");
      for (const key of keys) {
        const user = await redis.hgetall(key);
        if (user.email === email) {
          return {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
            name: user.name,
            image: user.image,
          };
        }
      }
      return null;
    },
    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<AdapterUser | null> {
      const account = await redis.hgetall(`account:${provider}:${providerAccountId}`);
      if (!account || !account.userId) return null;
      const user = await redis.hgetall(`user:${account.userId}`);
      if (user && user.id) {
        return {
          id: user.id,
          email: user.email ?? "",
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          name: user.name,
          image: user.image,
        };
      }
      return null;
    },
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      const existing = await redis.hgetall(`user:${user.id}`);
      const updated = { ...existing, ...user };
      await redis.hset(`user:${user.id}`, updated);
      return {
        id: updated.id,
        email: updated.email ?? "",
        emailVerified: updated.emailVerified ? new Date(updated.emailVerified) : null,
        name: updated.name,
        image: updated.image,
      };
    },
    async deleteUser(id: string): Promise<void> {
      await redis.del(`user:${id}`);
    },
    async linkAccount(account: AdapterAccount): Promise<AdapterAccount> {
      await redis.hset(`account:${account.provider}:${account.providerAccountId}`, account);
      return account;
    },
    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<void> {
      await redis.del(`account:${provider}:${providerAccountId}`);
    },
    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session = await redis.hgetall(`session:${sessionToken}`);
      if (!session || !session.userId) return null;
      const user = await redis.hgetall(`user:${session.userId}`);
      if (!user || !user.id) return null;
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires ? new Date(session.expires) : new Date(),
        },
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          name: user.name,
          image: user.image,
        },
      };
    },
    async createSession(session: AdapterSession): Promise<AdapterSession> {
      await redis.hset(`session:${session.sessionToken}`, {
        ...session,
        expires: session.expires.toISOString(),
      });
      return session;
    },
    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> {
      const existing = await redis.hgetall(`session:${session.sessionToken}`);
      if (!existing || !existing.sessionToken) return null;
      const updated = { ...existing, ...session };
      await redis.hset(`session:${session.sessionToken}`, {
        ...updated,
        expires: updated.expires ? new Date(updated.expires).toISOString() : new Date().toISOString(),
      });
      return {
        sessionToken: updated.sessionToken ?? "",
        userId: updated.userId ?? "",
        expires: updated.expires ? new Date(updated.expires) : new Date(),
      };
    },
    async deleteSession(sessionToken: string): Promise<void> {
      await redis.del(`session:${sessionToken}`);
    },
    async createVerificationToken(token: VerificationToken): Promise<VerificationToken> {
      await redis.hset(`verification:${token.identifier}:${token.token}`, {
        ...token,
        expires: token.expires.toISOString(),
      });
      return token;
    },
    async useVerificationToken({ identifier, token }: { identifier: string; token: string }): Promise<VerificationToken | null> {
      const key = `verification:${identifier}:${token}`;
      const data = await redis.hgetall(key);
      await redis.del(key);
      if (data && data.token) {
        return {
          identifier: data.identifier,
          token: data.token,
          expires: data.expires ? new Date(data.expires) : new Date(),
        };
      }
      return null;
    },
  };
}
