export class Pagination {
    constructor({
        data,
        total,
        page,
        limit,
        total_pages,
        paging_counter,
        has_prev_page,
        has_next_page,
        prev_page,
        next_page,
    }) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.total_pages = total_pages;
        this.paging_counter = paging_counter;
        this.has_prev_page = has_prev_page;
        this.has_next_page = has_next_page;
        this.prev_page = prev_page;
        this.next_page = next_page;
    }

    toObject() {
        return {
            data: this.data,
            total: this.total,
            page: this.page,
            limit: this.limit,
            total_pages: this.total_pages,
            paging_counter: this.paging_counter,
            has_prev_page: this.has_prev_page,
            has_next_page: this.has_next_page,
            prev_page: this.prev_page,
            next_page: this.next_page,
        };
    }
}
