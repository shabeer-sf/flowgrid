import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes using a route matcher
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Protect routes if they match the protected route patterns
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Redirect to onboarding if user is logged in but has no organization and is not already on allowed pages
  const isOnboardingPath = req.nextUrl.pathname === "/onboarding";
  const isRootPath = req.nextUrl.pathname === "/";
  if (userId && !orgId && !isOnboardingPath && !isRootPath) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Allow the request to proceed for other cases
  return NextResponse.next();
});

// Middleware configuration
export const config = {
  matcher: [
    // Exclude Next.js internals and static files unless in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always include API routes
    "/(api|trpc)(.*)",
  ],
};
