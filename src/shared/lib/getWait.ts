export function getWait(timeout = Math.random() * 1500) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}
