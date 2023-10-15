declare namespace Api {
  namespace Response {
    type Collection<T> = {
      items: T[];
      meta: {
        currentPage: number;
        itemCount: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
      };
      links: {
        first: string;
        last: string;
        next: string;
        previous: string;
      };
    };

    type Token = {
      l2Address: string;
      l1Address: string | null;
      name: string | null;
      symbol: string | null;
      decimals: number;
    };
    
    type Transfer = {
      from: string;
      to: string;
      blockNumber: number;
      transactionHash: string | null;
      amount: string | null;
      token: Token | null;
      tokenAddress: string;
      type: "deposit" | "transfer" | "withdrawal" | "fee" | "mint" | "refund";
      timestamp: string;
    };
  }
}