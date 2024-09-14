import { init, fetchQuery } from "@airstack/node";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.AIRSTACK_API_KEY;
if (!apiKey) {
  throw new Error("AIRSTACK_API_KEY is not defined");
}
init(apiKey);

console.log("Airstack API initialized");

const userQuery = `
query GetUserSocialCapital($userId: String!) {
  Socials(
    input: {filter: {userId: {_eq: $userId}}, blockchain: ethereum}
  ) {
    Social {
      profileName
      profileDisplayName
      userId
      profileBio
      profileImage
      profileImageContentValue {
        image {
          extraSmall
        }
      }
      socialCapital {
        socialCapitalScore
        socialCapitalRank
      }
    }
  }
}
`;

export async function GET(req: NextRequest) {
  console.log(`API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  const userId = req.nextUrl.searchParams.get("userId");
  console.log(`Requested userId: ${userId}`);

  if (!userId) {
    console.log("Error: userId parameter is missing");
    return NextResponse.json(
      { error: "userId parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching data from Airstack for userId: ${userId}`);
    const [userData] = await Promise.all([fetchQuery(userQuery, { userId })]);

    if (userData.error) {
      console.error("Airstack API error (user data):", userData.error);
      return NextResponse.json(
        { error: userData.error.message },
        { status: 500 }
      );
    }

    console.log(
      "Airstack API response (user data):",
      JSON.stringify(userData.data, null, 2)
    );

    return NextResponse.json({
      userData: userData.data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
