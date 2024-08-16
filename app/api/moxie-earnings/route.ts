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
    interface MoxieEarningStat {
      allEarningsAmount: number;
    }

    let todayEarnings: MoxieEarningStat | null = null;
    let weeklyEarnings: MoxieEarningStat | null = null;
    let lifetimeEarnings: MoxieEarningStat | null = null;

    console.log(
      `Fetching Today's Moxie earnings data from Airstack for entityId: ${entityId}`
    );

    const [todayData] = await Promise.all([
      fetchQuery(moxieQuery, { entityId, timeframe: "TODAY" }),
    ]);

    if (todayData.error) {
      console.error("Airstack API error (today's Moxie earnings data):", todayData.error);
      return NextResponse.json(
        { error: todayData.error.message },
        { status: 500 }
      );
    } else {
      
      if (!(todayData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat == null) && todayData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat && todayData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat.length > 0) {
        todayEarnings = todayData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat[0];
      } else {
        todayEarnings = {
          allEarningsAmount: 0,
        };
      }
    }

    console.log(
      "Airstack API response (Today's Moxie earnings data):",
      JSON.stringify(
        {
          today: todayEarnings,
        },
        null,
        2
      )
    );

    console.log(
      `Fetching Weekly Moxie earnings data from Airstack for entityId: ${entityId}`
    );
    const [weeklyData] = await Promise.all([
      fetchQuery(moxieQuery, { entityId, timeframe: "WEEKLY" }),
    ]);

    if (weeklyData.error) {
      console.error("Airstack API error (weekly Moxie earnings data):", weeklyData.error);
      return NextResponse.json(
        { error: weeklyData.error.message },
        { status: 500 }
      );
    } else {
      if (!(weeklyData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat == null) && weeklyData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat && weeklyData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat.length > 0) {
        weeklyEarnings = weeklyData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat[0];
      } else {
        weeklyEarnings = {
          allEarningsAmount: 0,
        };
      }
      
    }

    console.log(
      "Airstack API response (Weekly Moxie earnings data):",
      JSON.stringify(
        {
          weekly: weeklyEarnings,
        },
        null,
        2
      )
    );

    console.log(
      `Fetching Lifetime Moxie earnings data from Airstack for entityId: ${entityId}`
    );
    const [lifetimeData] = await Promise.all([
      fetchQuery(moxieQuery, { entityId, timeframe: "LIFETIME" }),
    ]);

    if (lifetimeData.error) {
      console.error("Airstack API error (lifetime Moxie earnings data):", lifetimeData.error);
      return NextResponse.json(
        { error: lifetimeData.error.message },
        { status: 500 }
      );
    } else {
      if (!(lifetimeData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat == null) && lifetimeData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat && lifetimeData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat.length > 0) {
        lifetimeEarnings = lifetimeData.data.FarcasterMoxieEarningStats.FarcasterMoxieEarningStat[0];
      } else {
        lifetimeEarnings = {
          allEarningsAmount: 0,
        };
      }
      
    }

    console.log(
      "Airstack API response (Lifetime Moxie earnings data):",
      JSON.stringify(
        {
          lifetime: lifetimeEarnings,
        },
        null,
        2
      )
    );

    return NextResponse.json({
      today:
        todayEarnings,
      weekly:
        weeklyEarnings,
      lifetime:
        lifetimeEarnings,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
