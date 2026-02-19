// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setItem = (key:string, value:any) =>{
    localStorage.setItem(key, JSON.stringify(value));
}
export const getItem = (key:string) =>{
    return JSON.parse(localStorage.getItem(key) as string);
}
export const removeItem = ( key: string) =>{
    localStorage.removeItem(key);
}
