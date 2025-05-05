// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Get the token from the request
//   const token =
//     process.env.LOCAL_ENV === "production"
//       ? await getToken({
//           req,
//           secret: process.env.AUTH_SECRET,
//           secureCookie: process.env.NODE_ENV === "production",
//         })
//       : await getToken({ req, secret: process.env.AUTH_SECRET });

//   // If no token is found, return a 401 Unauthorized response
//   // if (!token) {
//   //   return NextResponse.json({ error: "Not authorized" }, { status: 401 });
//   // }

//   // Extract the user's role from the token
//   const userRole = token?.role;

//   // Role-based access control
//   if (pathname.startsWith("/admin") || pathname.startsWith("/api/private")) {
//     // Only ADMIN role can access these paths
//     if (userRole !== "ADMIN") {
//       return NextResponse.json({ error: "Not authorized" }, { status: 403 });
//     }
//   } else if (pathname.startsWith("/vendor") || pathname.startsWith("/api/vendors")) {
//     // Only VENDOR or ADMIN roles can access these paths
//     if (userRole !== "VENDOR" && userRole !== "ADMIN") {
//       return NextResponse.json({ error: "Not authorized" }, { status: 403 });
//     }
//   }

//   // Allow access if the role matches the required permissions
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     // Match all page and API routes, but exclude static assets
//     "/((?!_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|[^/]+\\.(?:css|js|gif|jpg|jpeg|png|webp|avif|svg|ico|woff|woff2|ttf|eot|mp4|webm|ogg|mp3|wav|m4a|aac|opus)).*)",
//   ],
// };