import { NextResponse } from 'next/server';
import axios from 'axios';
import { serialize } from 'cookie'; // Import cookie serialization utility

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  console.log("Facebook Route");
  console.log("Received code:", code);

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
      params: {
        client_id: "923337799655387",
        client_secret: "f77bc0bbef6212d686349856d1cab037",
        redirect_uri: `http://localhost:3000/api/auth/facebook`, // Redirect URI must match
        code,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch user information
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: accessToken,
        fields: 'id,name,email,picture',
      },
    });

    const user = userResponse.data;
    console.log('User Info:', user);

    // Set user info in cookies
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      httpOnly: true, // Not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    };

    const cookies = serialize('user', JSON.stringify(user), cookieOptions);

    // Create response with cookies
    const response = NextResponse.json({ user });
    response.headers.append('Set-Cookie', cookies);

    return response;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
  }
}
