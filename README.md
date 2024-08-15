# Moxie Airstack Demo Frame

> Let a thousand Moxie frames bloom.

This project is a Farcaster Frame built using [frames.js](https://framesjs.org/) the [Airstack](https://airstack.xyz) validator and node package.

## Features

- Frames.js with TailwindCSS for styling
- Airstack API integration for Far Score and Moxie earnings data
- Cast Action Install
- Airstack validator integration for Moxie everyday rewards
- Ready for deployment on Vercel

## Setup

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
AIRSTACK_API_KEY=your_airstack_api_key_here
```

Replace `your_airstack_api_key_here` with your actual Airstack API key.

## Local Development

To run the project locally:

```bash
npm run dev
```

This will start both the Next.js development server and the frames.js debugger.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. In the Vercel deployment settings, add the following environment variables:
   - `AIRSTACK_API_KEY`: Your Airstack API key
4. Deploy the project.

**Important:** Make sure to use the short Vercel URL in your `APP_URL` environment variable. Redeploy if needed.

## Airstack Validator

This project includes the Airstack validator, which you need to earn Moxie rewards when users interact with your Farcaster Frame.

##

## API Routes

The project includes two main API routes:

1. `/api/farscore`: Fetches user social capital data from Airstack.
2. `/api/moxie-earnings`: Retrieves Moxie earnings data for a user.

These routes are used internally by the Frame to display user information and earnings.

## Cast Action

The project includes a Cast Action install button. Make sure to customize the link with your own frame url. The Cast Action is defined in the `/api/cast-action/route.tsx` file.

## Warpcast Validation

![CleanShot 2024-08-15 at 09 10 58@2x](https://github.com/user-attachments/assets/46bff4fd-4a1e-47a4-81a8-8f936c238975)

Check your frame at https://warpcast.com/~/developers/frames . Be sure to use the short url that vercel gives you (Warpcast doesn't like long urls), and add /frames to the end (as in the screenshot above).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## References

- [frames.js Documentation](https://framesjs.org/)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Airstack API](https://docs.airstack.xyz/airstack-docs-and-faqs/)
- [TailwindCSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)
