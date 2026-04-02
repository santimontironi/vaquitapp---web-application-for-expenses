export const formatJoinedDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}
