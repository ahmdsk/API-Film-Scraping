export interface IConfig {
    port: number | string;
    filmURL: string;
}

export const Config: IConfig = {
    port: process.env.PORT || 3000,
    filmURL: process.env.FILM_URL || 'https://ngefilm21.cfd',
};