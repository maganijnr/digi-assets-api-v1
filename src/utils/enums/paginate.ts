export class Paginate {
  public paginate = (total: number, page: number, limit: number) => {
    limit = Number(limit);
    let currentPage = page ? Number(page) : 1;
    let next_page = currentPage + 1;
    const prev_page = currentPage > 1 ? currentPage - 1 : currentPage;
    const total_pages = Math.ceil(total / limit);
    if (next_page > total_pages) next_page = total_pages;
    const offset = currentPage === 1 ? 0 : (currentPage - 1) * limit;

    return {
      offset,
      limit,
      current_page: currentPage,
      next_page,
      prev_page,
      total_pages,
      total,
    };
  };
}
