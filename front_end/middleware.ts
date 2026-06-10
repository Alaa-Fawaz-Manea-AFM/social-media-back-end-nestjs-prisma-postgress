import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isSavedPage = pathname === "/saved";
  const isCreateUser = pathname === "/user/profile";
  const isCreatePost = pathname === "/post/create";

  const isEditUser = /^\/user\/edit\/[^/]+$/.test(pathname);
  const isEditPost = /^\/post\/edit\/[^/]+$/.test(pathname);

  const isProtectedRoute =
    isSavedPage || isCreatePost || isCreateUser || isEditUser || isEditPost;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/saved",
    "/user/profile",
    "/user/edit/:id*",
    "/post/create",
    "/post/edit/:id*",
  ],
};
