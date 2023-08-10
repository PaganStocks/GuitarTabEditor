import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({ 
        authorizationParams: {
            audience: 'https://musictabseditor.com',
            scope: 'openid profile email',
        },
     }),
    onError(_: Request, error: Error) {
        console.error(error);
    }
});