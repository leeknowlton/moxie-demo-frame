Based on the provided codebase, here's an updated README with additional information and instructions:

# Moxie Airstack Demo Frame

This project is a Farcaster Frame built using [frames.js](https://framesjs.org/), demonstrating integration with Airstack for validator rewards and Moxie earnings data.

## Features

- Built with frames.js for easy Frame development
- Airstack API integration for Far Score and Moxie earnings data
- TailwindCSS for styling
- Cast Action Install
- Airstack validator integration for Moxie rewards
- Ready for deployment on Vercel

## Setup

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
APP_URL="https://your-vercel-url.vercel.app"
AIRSTACK_API_KEY=your_airstack_api_key_here
```

Replace `your_airstack_api_key_here` with your actual Airstack API key.

## Local Development

To run the project locally:

```bash
npm run dev
```

This will start both the Next.js development server and the frames.js debugger. Follow the [debugging guide](https://framesjs.org/guides/debugging) to preview and debug your Frame.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. In the Vercel deployment settings, add the following environment variables:
   - `APP_URL`: Set this to your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
   - `AIRSTACK_API_KEY`: Your Airstack API key
4. Deploy the project.

**Important:** Make sure to use the short Vercel URL in your `APP_URL` environment variable to ensure proper functionality.

## Airstack Validator

This project includes the Airstack validator, which is crucial for earning Moxie rewards when users interact with your Farcaster Frame. The validator is automatically integrated into the Frame's functionality.

## API Routes

The project includes two main API routes:

1. `/api/farscore`: Fetches user social capital data from Airstack.
2. `/api/moxie-earnings`: Retrieves Moxie earnings data for a user.

These routes are used internally by the Frame to display user information and earnings.

## Cast Action

The project includes a Cast Action feature, which allows users to easily install and use the Frame from their Farcaster client. The Cast Action is defined in the `/api/cast-action/route.tsx` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## References

- [frames.js Documentation](https://framesjs.org/)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Airstack API](https://docs.airstack.xyz/airstack-docs-and-faqs/)
- [TailwindCSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)
