import { useState, useMemo } from 'react'

export const usePagination = ({
                                  totalItems = 0,
                                  itemsPerPage = 10,
                                  initialPage = 1,
                                  siblingCount = 1
                              }) => {
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [pageSize, setPageSize] = useState(itemsPerPage)

    const totalPages = Math.ceil(totalItems / pageSize)

    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

        const shouldShowLeftDots = leftSiblingIndex > 2
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2

        const firstPageIndex = 1
        const lastPageIndex = totalPages

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
            return [...leftRange, '...', totalPages]
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount
            const rightRange = Array.from(
                { length: rightItemCount },
                (_, i) => totalPages - rightItemCount + i + 1
            )
            return [firstPageIndex, '...', ...rightRange]
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            )
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex]
        }

        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }, [totalPages, siblingCount, currentPage])

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(pageNumber)
    }

    const goToNextPage = () => goToPage(currentPage + 1)
    const goToPreviousPage = () => goToPage(currentPage - 1)
    const goToFirstPage = () => goToPage(1)
    const goToLastPage = () => goToPage(totalPages)

    const changePageSize = (newPageSize) => {
        setPageSize(newPageSize)
        setCurrentPage(1) // Reset to first page
    }

    return {
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        paginationRange,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
        changePageSize,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startIndex: (currentPage - 1) * pageSize,
        endIndex: Math.min(currentPage * pageSize, totalItems)
    }
}
