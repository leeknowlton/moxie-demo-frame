import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL, formatNumber } from "../utils";

interface State {
  lastFid?: string;
}

interface MoxieData {
  today: { allEarningsAmount: string };
  weekly: { allEarningsAmount: string };
  lifetime: { allEarningsAmount: string };
}

const frameHandler = frames(async (ctx) => {
  interface UserData {
    name: string;
    username: string;
    fid: string;
    socialCapitalScore: string;
    socialCapitalRank: string;
    profileDisplayName: string;
    profileImageUrl: string;
  }

  let userData: UserData | null = null;
  let moxieData: MoxieData | null = null;

  let error: string | null = null;
  let isLoading = false;

  const fetchUserData = async (fid: string) => {
    isLoading = true;
    try {
      const airstackUrl = `${appURL()}/api/farscore?userId=${encodeURIComponent(
        fid
      )}`;
      const airstackResponse = await fetch(airstackUrl);
      if (!airstackResponse.ok) {
        throw new Error(
          `Airstack HTTP error! status: ${airstackResponse.status}`
        );
      }
      const airstackData = await airstackResponse.json();

      if (
        airstackData.userData.Socials.Social &&
        airstackData.userData.Socials.Social.length > 0
      ) {
        const social = airstackData.userData.Socials.Social[0];
        userData = {
          name: social.profileDisplayName || social.profileName || "Unknown",
          username: social.profileName || "unknown",
          fid: social.userId || "N/A",
          profileDisplayName: social.profileDisplayName || "N/A",
          socialCapitalScore:
            social.socialCapital?.socialCapitalScore?.toFixed(2) || "N/A",
          socialCapitalRank: social.socialCapital?.socialCapitalRank || "N/A",
          profileImageUrl:
            social.profileImageContentValue?.image?.extraSmall ||
            social.profileImage ||
            "",
        };
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = (err as Error).message;
    } finally {
      isLoading = false;
    }
  };

  const fetchMoxieData = async (fid: string) => {
    try {
      const moxieUrl = `${appURL()}/api/moxie-earnings?entityId=${encodeURIComponent(
        fid
      )}`;
      const moxieResponse = await fetch(moxieUrl);
      if (!moxieResponse.ok) {
        throw new Error(`Moxie HTTP error! status: ${moxieResponse.status}`);
      }
      moxieData = await moxieResponse.json();
    } catch (err) {
      console.error("Error fetching Moxie data:", err);
      error = (err as Error).message;
    }
  };

  const extractFid = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      let fid = parsedUrl.searchParams.get("userfid");

      console.log("Extracted FID from URL:", fid);
      return fid;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return null;
    }
  };

  let fid: string | null = null;

  if (ctx.message?.requesterFid) {
    fid = ctx.message.requesterFid.toString();
    console.log("Using requester FID:", fid);
  } else if (ctx.url) {
    fid = extractFid(ctx.url.toString());
    console.log("Extracted FID from URL:", fid);
  } else {
    console.log("No ctx.url available");
  }

  if (!fid && (ctx.state as State)?.lastFid) {
    fid = (ctx.state as State).lastFid ?? null;
    console.log("Using FID from state:", fid);
  }

  console.log("Final FID used:", fid);

  const shouldFetchData =
    fid && (!userData || (userData as UserData).fid !== fid);

  if (shouldFetchData && fid) {
    await Promise.all([fetchUserData(fid), fetchMoxieData(fid)]);
  }

  const SplashScreen = () => (
    <div tw="flex flex-col w-full h-full bg-pink-50 text-blue-800 font-sans">
      <div tw="flex items-center flex-grow">
        <div tw="flex flex-col items-center flex-grow rounded-lg border-2 border-blue-800 mx-24 py-8 bg-pink-50">
          <div tw="flex mb-6">
            <img
              src="https://storage.googleapis.com/papyrus_images/8ba13bd0410a9b2333784927e7c638ca"
              tw="h-12"
            />
            <div tw="flex text-4xl  pl-2 text-blue-800">airstack</div>
          </div>
          <div tw="flex text-4xl  mb-6">Far Score</div>
          <div tw="flex text-6xl  p-2 mb-6 text-center">--</div>
          <div tw="flex text-4xl p-2 rounded">Rank: --</div>
        </div>
      </div>
      <div tw="flex justify-between bg-blue-800 text-white mb-4 w-full px-4 py-1 text-center absolute top-50 p-10 bg-opacity-80">
        <div tw="flex flex-col items-center w-full">
          <span tw="flex text-6xl  mb-4">Moxie Demo Frame</span>
          <span tw="flex text-4xl ">
            Use this to build your Moxie Stats Frame.
          </span>
        </div>
      </div>
    </div>
  );

  const ScoreScreen = () => {
    return (
      <div tw="flex flex-col w-full h-full bg-pink-50 text-blue-800 font-sans">
        <div tw="flex items-center px-8 pt-4 bg-pink-50 justify-between mr-4">
          <div tw="flex items-center">
            <img
              src={userData?.profileImageUrl}
              alt="Profile"
              tw="w-20 h-20 rounded-full mr-4"
            />
            <div tw="flex flex-col">
              <span tw="flex text-4xl">{userData?.profileDisplayName}</span>
              <span tw="flex text-2xl">@{userData?.username}</span>
            </div>
          </div>
        </div>
        <div tw="flex justify-between px-8 align-center items-center">
          <div tw="flex flex-col items-center w-1/3">
            <div tw="flex flex-col items-center rounded-lg border-2 border-blue-800 py-8 bg-pink-50 bg-opacity-90 w-full">
              <div tw="flex mb-6">
                <img
                  src="https://storage.googleapis.com/papyrus_images/8ba13bd0410a9b2333784927e7c638ca"
                  tw="h-12"
                />
                <div tw="flex text-4xl pl-2 text-blue-800">airstack</div>
              </div>
              <div tw="flex text-4xl mb-6">Far Score</div>
              <div tw="flex text-6xl mb-6">{userData?.socialCapitalScore}</div>
              <div tw="flex text-4xl">Rank: {userData?.socialCapitalRank}</div>
            </div>
          </div>

          <div tw="flex flex-col border-2 border-blue-800 p-4">
            <div tw="text-3xl font-bold mb-4 text-center">Engagement Value</div>
            <div tw="flex flex-col items-center justify-center rounded-lg border-2 mb-4 py-2 bg-pink-50 bg-opacity-90">
              <span tw="text-2xl">Like</span>
              <div tw="flex text-4xl">{userData?.socialCapitalScore}</div>
            </div>
            <div tw="flex flex-col items-center justify-center rounded-lg border-2 mb-4 py-2 bg-pink-50 bg-opacity-90">
              <span tw="text-2xl">Reply</span>
              <div tw="flex text-4xl">
                {(Number(userData?.socialCapitalScore) * 3).toFixed(2)}
              </div>
            </div>
            <div tw="flex flex-col items-center justify-center rounded-lg border-2 py-2 bg-pink-50 bg-opacity-90">
              <span tw="text-2xl">Recast/Quote</span>
              <div tw="flex text-4xl">
                {(Number(userData?.socialCapitalScore) * 6).toFixed(2)}
              </div>
            </div>
          </div>
          <div tw="flex flex-col border-2 border-blue-800 p-4">
            <div tw="text-3xl font-bold mb-4 text-center">Moxie Earnings</div>
            <div tw="flex flex-col items-center justify-center rounded-lg border-2 mb-4 py-2 bg-pink-50 bg-opacity-90">
              <span tw="text-2xl">Today</span>
              <span tw="text-4xl">
                {formatNumber(
                  parseFloat(moxieData?.today.allEarningsAmount || "0")
                )}
              </span>
            </div>
            <div tw="flex flex-col items-center justify-center rounded-lg border-2 mb-4 py-2 bg-pink-50 bg-opacity-90">
              <span tw="text-2xl">Weekly</span>
              <span tw="text-4xl">
                {formatNumber(
                  parseFloat(moxieData?.weekly.allEarningsAmount || "0")
                )}
              </span>
            </div>
            <div tw="flex flex-col items-center justify-center rounded-lg border-2 py-2 bg-pink-50 bg-opacity-90">
              <span tw="text-2xl">Lifetime</span>
              <span tw="text-4xl">
                {formatNumber(
                  parseFloat(moxieData?.lifetime.allEarningsAmount || "0")
                )}
              </span>
            </div>
          </div>
        </div>
        <div tw="flex justify-between bg-blue-800 text-white w-full px-4 py-1 mt-4">
          <div tw="flex text-2xl ">Moxie Stats Demo Frame</div>

          <div tw="flex text-2xl">by @zeni.eth</div>
        </div>
      </div>
    );
  };
  const shareText = encodeURIComponent(
    userData
      ? `My Airstack Far Score is ${
          (userData as UserData).socialCapitalScore
        } with a rank of ${
          (userData as UserData).socialCapitalRank
        }! The higher the score, the more my reactions help you earn Moxie. Check out your score on moxiedemo, made by Zenigame (@zeni.eth)`
      : "Check out your Moxie Far Score!"
  );

  // Change the url here
  const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://moxiedemo.vercel.app/frames${
    fid ? `?userfid=${fid}` : ""
  }`;

  const buttons = [];

  if (!userData) {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        View Me
      </Button>,
      <Button
        action="link"
        // Change the url here
        target="https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fmoxiedemo.vercel.app%2Fapi%2Fcast-action"
      >
        Cast Action
      </Button>,
      <Button
        action="link"
        target="https://github.com/leeknowlton/farcaster-frame-airstack-moxie"
      >
        Frame Repo
      </Button>
    );
  } else {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        View
      </Button>,
      <Button action="link" target={shareUrl}>
        Share
      </Button>,
      <Button
        action="link"
        target="https://github.com/leeknowlton/farcaster-frame-airstack-moxie"
      >
        Frame Repo
      </Button>
    );
  }

  return {
    image: fid && !error ? <ScoreScreen /> : <SplashScreen />,
    buttons: buttons,
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
