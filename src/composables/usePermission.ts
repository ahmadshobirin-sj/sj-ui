export const usePermission = (permissions: string[]) => {
    const can = (keys: string | string[]): boolean => {
        const set = permissions

        if (Array.isArray(keys)) {
            return keys.some((key) => set.includes(key))
        }

        return set.includes(keys)
    }

    return {
        can,
    }
}
