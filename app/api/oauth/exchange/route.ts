import { prisma } from "@/app/lib/db";
import { requiredAuthUser } from "@/app/lib/hook";
import { nylas, nylasConfig } from "@/app/lib/nylas";
import { log } from "console";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await requiredAuthUser();

  const url = new URL(req.url);

  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json(
      { error: "No authorization code returned from Nylas" },
      { status: 400 }
    );
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      code,
      redirectUri: nylasConfig.redirectUri,
    });

    const { grantId, email } = response;
    console.log({ grantId, email });

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        grantId: grantId,
        grantEmail: email,
      },
    });
  } catch (error) {
    console.log("Error exchanging code for token:", error);
    return Response.json(
      { error: "Failed to exchange code for access token" },
      { status: 500 }
    );
  }

  redirect("/dashboard");
}
