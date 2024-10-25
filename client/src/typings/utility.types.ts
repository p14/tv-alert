export type PublicRequestParams = {
    data?: object
    method?: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
};

export type UserSession = {
    email: string
    expires: string
    signature: string
};
