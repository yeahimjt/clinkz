import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID) ?? '',
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET) ?? '',
    }),
  ],
});

export { handler as GET, handler as POST };
