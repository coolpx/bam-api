export interface Endpoint {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    rateLimits?: {
        max: number;
        windowMs: number;
    }[];
    handler: (
        req: import('express').Request,
        res: import('express').Response
    ) => Promise<any>;
}
