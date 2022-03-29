export function findInArray(arr: any[], predicate: (item: any) => boolean): { data: any|null, index: number } {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return { data: arr[i], index: i };
    }
    return { data: null, index: -1 };
}