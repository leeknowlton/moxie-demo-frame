import { init, fetchQuery } from "@airstack/node";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.AIRSTACK_API_KEY;
if (!apiKey) {
  throw new Error("AIRSTACK_API_KEY is not defined");
}
init(apiKey);

console.log("Airstack API initialized for Moxie earnings");

const moxieQuery = `
query MyQuery($entityId: String!, $timeframe: FarcasterMoxieEarningStatsTimeframe!) {
  FarcasterMoxieEarningStats(
    input: {filter: {entityType: {_eq: USER}, entityId: {_eq: $entityId}}, timeframe: $timeframe, blockchain: ALL}
  ) {
    FarcasterMoxieEarningStat {
      allEarningsAmount
      frameDevEarningsAmount
      entityId
      entityType
      castEarningsAmount
      otherEarningsAmount
    }
  }
}
`;

export async function GET(req: NextRequest) {
  console.log(`Moxie earnings API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  const entityId = req.nextUrl.searchParams.get("entityId");
  console.log(`Requested entityId: ${entityId}`);

  if (!entityId) {
    console.log("Error: entityId parameter is missing");
    return NextResponse.json(
      { error: "entityId parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log(
      `Fetching Moxie earnings data from Airstack for entityId: ${entityId}`
    );
    const [todayData, weeklyData, lifetimeData] = await Promise.all([
      fetchQuery(moxieQuery, { entityId, timeframe: "TODAY" }),
      fetchQuery(moxieQuery, { entityId, timeframe: "WEEKLY" }),
      fetchQuery(moxieQuery, { entityId, timeframe: "LIFETIME" }),
    ]);

    if (todayData.error || weeklyData.error || lifetimeData.error) {
      console.error(
        "Airstack API error:",
        todayData.error || weeklyData.error || lifetimeData.error
      );
      return NextResponse.json(
        { error: "Error fetching Moxie earnings data" },
        { status: 500 }
      );
    }

    console.log(
      "Airstack API response (Moxie earnings data):",
      JSON.stringify(
        {
          today: todayData.data,
          weekly: weeklyData.data,
          lifetime: lifetimeData.data,
        },
        null,
        2
      )
    );

    return NextResponse.json({
      today:
        todayData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat[0],
      weekly:
        weeklyData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat[0],
      lifetime:
        lifetimeData.data.FarcasterMoxieEarningStats
          .FarcasterMoxieEarningStat[0],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
