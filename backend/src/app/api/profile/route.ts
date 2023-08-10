import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const GET = withApiAuthRequired(async () => {
    const session = await getAccessToken();

    return NextResponse.json(session);
});

export { GET };