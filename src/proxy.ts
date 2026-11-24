import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // /api/health stays outside Clerk so uptime monitors never get a sign-in or handshake redirect.
    "/((?!_next|api/health$|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/((?!health$).*)",
    "/trpc(.*)",
    "/__clerk/(.*)",
  ],
};
