
 export function debounce<F extends (...args: any[]) => void>(func: F, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isFirstCall = true;

    return (...args: Parameters<F>) => {
        if(isFirstCall){
            func(...args);
            isFirstCall = false;
        }
        if(timeoutId)clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            isFirstCall = true;
        }, delay);
    };
}
