export default interface IPaginationResponse<T> {
    data: T[],
    limit: number,
    offset: number
}
